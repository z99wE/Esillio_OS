from fastapi import APIRouter, Depends
from typing import Dict, Any

from app.storage.database import database
from app.api.auth import get_current_user
from app.runtime.trend_detector import TrendDetector

router = APIRouter(prefix="/api/intelligence", tags=["intelligence"])
trend_detector = TrendDetector()

@router.get("/trends")
async def get_health_trends(
    current_user: dict = Depends(get_current_user)
) -> Dict[str, Any]:
    """
    Analyze biomarker history to detect deteriorating trends.
    """
    cursor = database.connection.cursor()
    
    # Fetch biomarkers
    cursor.execute(
        """
        SELECT * FROM health_events 
        WHERE patient_id = ? AND category = 'biomarker'
        ORDER BY timestamp ASC
        """,
        (current_user["id"],)
    )
    events = cursor.fetchall()
    
    biomarkers = [dict(row) for row in events]
    
    # Analyze trends
    result = trend_detector.analyze_trends(biomarkers)
    
    return result
