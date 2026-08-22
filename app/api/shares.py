from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime, timedelta

from app.api.auth import get_current_user
from app.storage.supabase_client import supabase

router = APIRouter()

class ShareCreate(BaseModel):
    shared_with_email: str
    access_level: str = Field(..., description="Must be 'caregiver', 'clinician', or 'summary_only'")
    expires_in_days: Optional[int] = Field(None, description="Number of days until share expires")

class DocumentShareCreate(BaseModel):
    shared_with_email: str
    expires_in_days: Optional[int] = None

class ShareResponse(BaseModel):
    id: str
    patient_id: str
    shared_with_email: str
    shared_with_user_id: Optional[str]
    access_level: str
    expires_at: Optional[datetime]
    created_at: datetime

class DocumentShareResponse(BaseModel):
    id: str
    document_id: str
    shared_with_email: str
    shared_with_user_id: Optional[str]
    expires_at: Optional[datetime]
    created_at: datetime

@router.post("/patient", response_model=ShareResponse)
async def create_patient_share(share: ShareCreate, current_user: str = Depends(get_current_user)):
    """Creates a share record for a patient's overall profile."""
    if share.access_level not in ["caregiver", "clinician", "summary_only"]:
        raise HTTPException(status_code=400, detail="Invalid access level.")
        
    expires_at = None
    if share.expires_in_days:
        expires_at = (datetime.utcnow() + timedelta(days=share.expires_in_days)).isoformat()
        
    data = {
        "patient_id": current_user,
        "shared_with_email": share.shared_with_email,
        "access_level": share.access_level,
        "expires_at": expires_at
    }
    
    res = supabase.table("patient_shares").insert(data).execute()
    if not res.data:
        raise HTTPException(status_code=500, detail="Failed to create share.")
    return res.data[0]

@router.post("/document/{document_id}", response_model=DocumentShareResponse)
async def create_document_share(document_id: str, share: DocumentShareCreate, current_user: str = Depends(get_current_user)):
    """Creates a share record for a specific document."""
    # First verify the user owns the document
    doc_res = supabase.table("documents").select("id").eq("id", document_id).eq("patient_id", current_user).execute()
    if not doc_res.data:
        raise HTTPException(status_code=404, detail="Document not found or unauthorized.")
        
    expires_at = None
    if share.expires_in_days:
        expires_at = (datetime.utcnow() + timedelta(days=share.expires_in_days)).isoformat()
        
    data = {
        "document_id": document_id,
        "shared_with_email": share.shared_with_email,
        "expires_at": expires_at
    }
    
    res = supabase.table("document_shares").insert(data).execute()
    if not res.data:
        raise HTTPException(status_code=500, detail="Failed to create document share.")
    return res.data[0]

@router.get("", response_model=dict)
async def list_shares(current_user: str = Depends(get_current_user)):
    """Lists shares granted BY the user, and shares granted TO the user."""
    # Shares I have granted
    granted_patient = supabase.table("patient_shares").select("*").eq("patient_id", current_user).execute()
    
    # Shares I have received
    received_patient = supabase.table("patient_shares").select("*, profiles(email)").eq("shared_with_user_id", current_user).execute()
    
    return {
        "granted_patient_shares": granted_patient.data,
        "received_patient_shares": received_patient.data
    }

@router.delete("/patient/{share_id}")
async def revoke_patient_share(share_id: str, current_user: str = Depends(get_current_user)):
    """Revokes a patient share."""
    res = supabase.table("patient_shares").delete().eq("id", share_id).eq("patient_id", current_user).execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="Share not found or unauthorized.")
    return {"status": "success"}

@router.delete("/document/{share_id}")
async def revoke_document_share(share_id: str, current_user: str = Depends(get_current_user)):
    """Revokes a document share."""
    supabase.table("document_shares").delete().eq("id", share_id).execute()
    return {"status": "success"}
