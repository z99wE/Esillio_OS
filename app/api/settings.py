from fastapi import APIRouter

from app.schemas.ai_settings import AISettings
from app.storage.settings_repository import (
    settings_repository,
)
from app.runtime.engine import reload_runtime

router = APIRouter(
    prefix="/settings",
    tags=["AI Settings"],
)


############################################################


@router.get("/ai")
def get_ai_settings():

    return {
        "status": "success",
        "settings": settings_repository.get_settings(),
    }


############################################################


@router.post("/ai")
def save_ai_settings(
    settings: AISettings,
):

    saved = settings_repository.save_settings(

        provider=settings.provider,

        base_url=settings.base_url,

        api_key=settings.api_key,

        model=settings.model,
    )

    ########################################################
    # Reload Runtime
    ########################################################

    reload_runtime()

    ########################################################

    return {

        "status": "success",

        "message": "AI settings updated successfully.",

        "settings": saved,
    }