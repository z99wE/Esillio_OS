from fastapi import APIRouter

from app.schemas.health_event import HealthEvent
from app.storage.repository import repository

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
async def list_events():

    return repository.list_events()