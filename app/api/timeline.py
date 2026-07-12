from typing import Optional

from fastapi import APIRouter

from app.timeline.service import timeline_service

router = APIRouter(
    prefix="/timeline",
    tags=["Timeline"],
)


@router.get("/")
async def get_timeline(category: Optional[str] = None):

    return timeline_service.get_timeline(category)