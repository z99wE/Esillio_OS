from typing import Optional

from fastapi import APIRouter, Depends

from app.timeline.service import timeline_service
from app.api.auth import get_current_user

router = APIRouter(
    prefix="/timeline",
    tags=["Timeline"],
)


@router.get("/")
async def get_timeline(category: Optional[str] = None, user_id: str = Depends(get_current_user)):

    return timeline_service.get_timeline(patient_id=user_id, category=category)