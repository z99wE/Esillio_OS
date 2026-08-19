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

@router.get("/diff")
async def get_timeline_diff(doc_a_id: str, doc_b_id: str, user_id: str = Depends(get_current_user)):
    """
    Compare clinical events between two documents/encounters.
    """
    try:
        diff_data = timeline_service.get_timeline_diff(user_id, doc_a_id, doc_b_id)
        return {
            "status": "success",
            "data": diff_data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/summary")
async def get_condition_summary(condition: str, user_id: str = Depends(get_current_user)):
    """
    Generate a chronological summary with citations for a specific condition.
    """
    try:
        summary_data = timeline_service.get_condition_summary(user_id, condition)
        return {
            "status": "success",
            "data": summary_data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))