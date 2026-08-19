from fastapi import APIRouter, Depends
from typing import Dict, Any

from app.storage.supabase_client import supabase
from app.api.auth import get_current_user
from app.runtime.trend_detector import TrendDetector

router = APIRouter(prefix="/api/intelligence", tags=["intelligence"])
trend_detector = TrendDetector()

@router.get("/trends")
async def get_health_trends(
    user_id: str = Depends(get_current_user)
) -> Dict[str, Any]:
    """
    Analyze biomarker history to detect deteriorating trends.
    """
    if not supabase:
        return {"trends": []}

    # Fetch biomarkers
    response = supabase.table("health_events").select("*").eq("patient_id", user_id).eq("category", "biomarker").order("timestamp", desc=False).execute()
    biomarkers = response.data
    
    # Analyze trends
    result = trend_detector.analyze_trends(biomarkers)
    
    return result
