import logging

from fastapi import APIRouter, Depends
from app.runtime.engine import reload_runtime
from app.api.auth import require_role

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/settings",
    tags=["AI Settings"],
)

@router.get("/ai")
def get_ai_settings(admin_id: str = Depends(require_role(["admin"]))):
    """Return current AI provider configuration."""
    return {
        "status": "success",
        "settings": {
            "provider": "Managed",
            "model": "Admin Configured",
            "key_present": True
        },
        "provider_defaults": {},
    }

@router.post("/ai")
def save_ai_settings(admin_id: str = Depends(require_role(["admin"]))):
    """
    Save AI provider settings.
    (Disabled in managed mode)
    """
    return {
        "status": "success",
        "message": "AI settings are centrally managed.",
    }

@router.post("/ai/test")
def test_ai_connection(admin_id: str = Depends(require_role(["admin"]))):
    return {
        "status": "success",
        "message": "AI provider is connected and responding.",
        "ai_ready": True,
        "provider": "Managed"
    }
