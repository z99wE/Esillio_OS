from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from app.services.timeline_service import timeline_service
from app.api.auth import get_current_user

router = APIRouter(
    prefix="/timeline",
    tags=["Timeline"],
)

@router.get("/")
async def get_timeline(category: Optional[str] = None, user_id: str = Depends(get_current_user)):
    """
    Fetch the patient's chronologically sorted timeline from Supabase.
    """
    try:
        events = timeline_service.get_patient_timeline(patient_id=user_id)
        if category:
            events = [
                event for event in events
                if event.get("event_type", "").lower() == category.lower()
            ]
        return events
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))