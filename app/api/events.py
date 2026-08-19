from fastapi import APIRouter, Depends

from app.schemas.health_event import HealthEvent
from app.storage.repository import repository
from app.api.auth import get_current_user

router = APIRouter(
    prefix="/events",
    tags=["Health Events"],
)


@router.post("/")
async def create_event(event: HealthEvent):

    repository.create_event(event)

    return {
        "status": "stored",
        "id": event.id,
    }


@router.get("/")
async def list_events(user_id: str = Depends(get_current_user)):

    return repository.list_events(patient_id=user_id)
