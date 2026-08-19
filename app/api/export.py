from fastapi import APIRouter, Depends
from typing import Dict, Any, List

from app.storage.supabase_client import supabase
from app.api.auth import get_current_user
from app.services.audit_service import audit_service

router = APIRouter(prefix="/api/export", tags=["export"])

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
