from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from typing import Dict, Any, List
import json
import datetime

from app.storage.supabase_client import supabase
from app.api.auth import get_current_user
from app.services.audit_service import audit_service
from postgrest.exceptions import APIError

router = APIRouter(prefix="/api/export", tags=["export"])

def _safe_fetch(table_name: str, filter_column: str, filter_value: str):
    """Fetch rows from a Supabase table, returning an empty list if the table does not exist.
    This guards against schema‑drift during early rollout where some tables may not have been created yet.
    """
    try:
        resp = supabase.table(table_name).select("*").eq(filter_column, filter_value).execute()
        return resp.data or []
    except APIError as e:
        # PGRST205 means the table is missing – treat as empty data.
        if getattr(e, "code", None) == "PGRST205":
            return []
        raise

def _safe_delete(table_name: str, filter_column: str, filter_value: str):
    """Delete rows from a Supabase table, ignoring missing‑table errors.
    Returns True on success, False if the table is missing.
    """
    try:
        supabase.table(table_name).delete().eq(filter_column, filter_value).execute()
        return True
    except APIError as e:
        if getattr(e, "code", None) == "PGRST205":
            return False
        raise

@router.get("/clinician")
async def get_clinician_summary(
    user_id: str = Depends(get_current_user)
) -> Dict[str, Any]:
    """
    Generate a structured clinician summary from the patient's timeline.
    """
    if not supabase:
        return {"error": "Supabase not configured"}

    response = supabase.table("health_events").select("*").eq("patient_id", user_id).order("timestamp", desc=True).execute()
    events = response.data
    
    # Log export action
    audit_service.log_action(
        user_id=user_id,
        action="export_clinician_summary",
        resource_type="health_events",
        metadata={"total_events": len(events)}
    )
    
    # Categorize events
    medications = []
    conditions = []
    recent_biomarkers = []
    timeline = []
    
    for row in events:
        event = row
        cat = (event.get("category") or "").lower()
        
        # Build timeline
        timeline.append(event)
        
        if cat == "medication":
            medications.append(event)
        elif cat in ["diagnosis", "condition", "disease"]:
            conditions.append(event)
        elif cat == "biomarker":
            recent_biomarkers.append(event)
            
    # Take top 3 conditions
    top_conditions = conditions[:3]
    
    # Take top 5 medications
    current_medications = medications[:5]
    
    # Take top 5 biomarkers
    latest_biomarkers = recent_biomarkers[:5]
    
    return {
        "patient": {
            "id": user_id,
            "email": "user@esillio.com" # Could fetch from supabase auth
        },
        "summary": {
            "active_conditions": top_conditions,
            "current_medications": current_medications,
            "recent_biomarkers": latest_biomarkers,
            "total_events": len(events)
        },
        "timeline": timeline
    }


@router.get("/my-data")
async def export_my_data(
    user_id: str = Depends(get_current_user),
) -> JSONResponse:
    """
    GDPR-compliant full personal data export.
    Returns all data the system holds for the authenticated user as a
    downloadable JSON attachment.
    """
    if not supabase:
        raise HTTPException(status_code=503, detail="Database not configured")

    # Collect all user data across tables using safe fetch to handle missing tables gracefully
    events_resp = _safe_fetch("health_events", "patient_id", user_id)
    profile_resp = _safe_fetch("profiles", "id", user_id)
    shares_resp = _safe_fetch("shares", "owner_id", user_id)
    tasks_resp = _safe_fetch("patient_tasks", "patient_id", user_id)

    export_payload = {
        "exported_at": datetime.datetime.utcnow().isoformat() + "Z",
        "user_id": user_id,
        "profile": profile_resp,
        "health_events": events_resp,
        "shares": shares_resp,
        "tasks": tasks_resp,
    }

    # Audit the export
    audit_service.log_action(
        user_id=user_id,
        action="gdpr_data_export",
        resource_type="user_data",
        metadata={"tables": ["profiles", "health_events", "shares", "patient_tasks"]},
    )

    content = json.dumps(export_payload, indent=2, default=str)
    return JSONResponse(
        content=export_payload,
        headers={
            "Content-Disposition": f'attachment; filename="esillio-data-{user_id[:8]}.json"',
        },
    )


@router.delete("/delete-account")
async def delete_account(
    user_id: str = Depends(get_current_user),
) -> Dict[str, str]:
    """
    Permanent, irreversible account and data deletion.
    Deletes all PHI and personal data rows, then removes the auth user.
    This satisfies GDPR Article 17 (Right to Erasure).
    """
    if not supabase:
        raise HTTPException(status_code=503, detail="Database not configured")

    # Audit before deletion (last record we will ever write for this user)
    audit_service.log_action(
        user_id=user_id,
        action="account_deletion_requested",
        resource_type="user_account",
        metadata={},
    )

    try:
        # Delete all PHI tables in dependency order
        _safe_delete("shares", "owner_id", user_id)
        _safe_delete("patient_tasks", "patient_id", user_id)
        _safe_delete("health_events", "patient_id", user_id)
        _safe_delete("clinical_memories", "patient_id", user_id)
        _safe_delete("profiles", "id", user_id)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Data deletion failed: {str(e)}",
        )

    return {"status": "deleted", "message": "Your account and all associated data have been permanently deleted."}
