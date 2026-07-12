from fastapi import APIRouter, Depends
from typing import Dict, Any, List

from app.storage.database import database
from app.api.auth import get_current_user

router = APIRouter(prefix="/api/export", tags=["export"])

@router.get("/clinician")
async def get_clinician_summary(
    user_id: str = Depends(get_current_user)
) -> Dict[str, Any]:
    """
    Generate a structured clinician summary from the patient's timeline.
    """
    cursor = database.connection.cursor()
    
    # Fetch all events ordered by date descending
    cursor.execute(
        """
        SELECT * FROM health_events 
        WHERE patient_id = ? 
        ORDER BY timestamp DESC
        """,
        (user_id,)
    )
    events = cursor.fetchall()
    
    # Categorize events
    medications = []
    conditions = []
    recent_biomarkers = []
    timeline = []
    
    for row in events:
        event = dict(row)
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
            "email": "user@esillio.com"
        },
        "summary": {
            "active_conditions": top_conditions,
            "current_medications": current_medications,
            "recent_biomarkers": latest_biomarkers,
            "total_events": len(events)
        },
        "timeline": timeline
    }
