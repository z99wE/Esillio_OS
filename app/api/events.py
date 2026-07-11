from fastapi import APIRouter

from app.schemas.health_event import HealthEvent

router = APIRouter(
    prefix="/events",
    tags=["Health Events"]
)

DATABASE = []


@router.post("/")
async def create_event(event: HealthEvent):
    DATABASE.append(event)

    return {
        "message": "Health Event stored successfully.",
        "events": len(DATABASE)
    }


@router.get("/")
async def list_events():
    return DATABASE