import logging
from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException

from app.runtime.engine import reload_runtime
from app.api.auth import get_current_user
from app.storage.supabase_client import supabase

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/settings",
    tags=["AI Settings"],
)


# ---------------------------------------------------------------------------
# Pydantic models
# ---------------------------------------------------------------------------

class AISettingsPayload(BaseModel):
    """BYOK: user saves their own key."""
    provider: str
    base_url: str | None = None
    api_key: str | None = None
    model: str | None = None
    retain_existing_key: bool = False


class AdminKeyPayload(BaseModel):
    """Admin adds a new key to the shared pool."""
    provider: str = "openai"
    api_key: str


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def is_admin(user_id: str) -> bool:
    if not supabase:
        return False
    try:
        res = supabase.table("profiles").select("role").eq("id", user_id).execute()
        if res.data and res.data[0].get("role") == "admin":
            return True
    except Exception as e:
        logger.error(f"Failed to check admin status: {e}")
    return False


def _mask_key(key: str) -> str:
    """Return first 6 and last 4 chars of key for display."""
    if len(key) <= 10:
        return "••••••"
    return key[:6] + "••••••" + key[-4:]


# ---------------------------------------------------------------------------
# User-facing: current AI settings (own BYOK if present, else managed)
# ---------------------------------------------------------------------------

@router.get("/ai")
def get_ai_settings(user_id: str = Depends(get_current_user)):
    """Return current AI provider config for the calling user."""
    if not supabase:
        raise HTTPException(status_code=500, detail="Database not configured")

    try:
        # Check user's own BYOK key first
        byok_res = supabase.table("llm_keys").select("provider, is_active").eq("user_id", user_id).eq("is_active", True).limit(1).execute()
        byok_active = bool(byok_res.data)
        provider = byok_res.data[0].get("provider", "openai") if byok_active else "managed"

        return {
            "status": "success",
            "settings": {
                "provider": provider,
                "key_present": byok_active,
                "byok_active": byok_active,
                "is_admin": is_admin(user_id),
            },
            "provider_defaults": {},
        }
    except Exception as e:
        logger.error(f"Failed to fetch AI settings: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch AI settings")


# ---------------------------------------------------------------------------
# User-facing: save / clear BYOK key
# ---------------------------------------------------------------------------

@router.post("/ai")
def save_ai_settings(payload: AISettingsPayload, user_id: str = Depends(get_current_user)):
    """Save or clear the calling user's BYOK API key."""
    if not supabase:
        raise HTTPException(status_code=500, detail="Database not configured")

    try:
        if not payload.retain_existing_key and payload.api_key:
            # Replace any existing user key
            supabase.table("llm_keys").delete().eq("user_id", user_id).execute()
            supabase.table("llm_keys").insert({
                "user_id": user_id,
                "provider": payload.provider,
                "api_key": payload.api_key,
                "is_active": True,
            }).execute()
            reload_runtime()

        return {
            "status": "success",
            "message": "Your API key has been saved. AI usage is now billed to your account.",
            "settings": {
                "key_present": bool(payload.api_key) or payload.retain_existing_key,
                "byok_active": bool(payload.api_key) or payload.retain_existing_key,
            },
        }
    except Exception as e:
        logger.error(f"Failed to save AI settings: {e}")
        raise HTTPException(status_code=500, detail="Failed to save AI settings")


@router.delete("/ai/byok")
def delete_byok_key(user_id: str = Depends(get_current_user)):
    """Remove the calling user's BYOK key (revert to managed pool)."""
    if not supabase:
        raise HTTPException(status_code=500, detail="Database not configured")
    try:
        supabase.table("llm_keys").delete().eq("user_id", user_id).execute()
        reload_runtime()
        return {"status": "success", "message": "BYOK key removed. You are back on the managed plan."}
    except Exception as e:
        logger.error(f"Failed to remove BYOK key: {e}")
        raise HTTPException(status_code=500, detail="Failed to remove BYOK key")


# ---------------------------------------------------------------------------
# Admin: manage the shared system key pool
# ---------------------------------------------------------------------------

@router.get("/ai/keys")
def list_admin_keys(user_id: str = Depends(get_current_user)):
    """Admin: list all system keys in the pool (masked)."""
    if not is_admin(user_id):
        raise HTTPException(status_code=403, detail="Admin access required")
    if not supabase:
        raise HTTPException(status_code=500, detail="Database not configured")

    try:
        res = supabase.table("llm_keys").select("id, provider, api_key, is_active, created_at").is_("user_id", "null").order("created_at").execute()
        keys = [
            {
                "id": row["id"],
                "provider": row["provider"],
                "key_preview": _mask_key(row["api_key"]),
                "is_active": row["is_active"],
                "created_at": row["created_at"],
            }
            for row in res.data
        ]
        return {"status": "success", "keys": keys}
    except Exception as e:
        logger.error(f"Failed to list admin keys: {e}")
        raise HTTPException(status_code=500, detail="Failed to list admin keys")


@router.post("/ai/keys")
def add_admin_key(payload: AdminKeyPayload, user_id: str = Depends(get_current_user)):
    """Admin: add a new key to the shared pool (additive — existing keys stay)."""
    if not is_admin(user_id):
        raise HTTPException(status_code=403, detail="Admin access required")
    if not supabase:
        raise HTTPException(status_code=500, detail="Database not configured")

    try:
        supabase.table("llm_keys").insert({
            "user_id": None,  # None = system/admin key
            "provider": payload.provider,
            "api_key": payload.api_key,
            "is_active": True,
        }).execute()
        reload_runtime()
        return {"status": "success", "message": "Key added to the admin pool and runtime reloaded."}
    except Exception as e:
        logger.error(f"Failed to add admin key: {e}")
        raise HTTPException(status_code=500, detail="Failed to add admin key")


@router.delete("/ai/keys/{key_id}")
def deactivate_admin_key(key_id: str, user_id: str = Depends(get_current_user)):
    """Admin: deactivate (soft-delete) a specific key from the pool by ID."""
    if not is_admin(user_id):
        raise HTTPException(status_code=403, detail="Admin access required")
    if not supabase:
        raise HTTPException(status_code=500, detail="Database not configured")

    try:
        res = supabase.table("llm_keys").update({"is_active": False}).eq("id", key_id).is_("user_id", "null").execute()
        if not res.data:
            raise HTTPException(status_code=404, detail="Key not found in system pool")
        reload_runtime()
        return {"status": "success", "message": "Key deactivated. Pool reloaded."}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to deactivate admin key: {e}")
        raise HTTPException(status_code=500, detail="Failed to deactivate admin key")


# ---------------------------------------------------------------------------
# Connection test
# ---------------------------------------------------------------------------

@router.post("/ai/test")
def test_ai_connection(user_id: str = Depends(get_current_user)):
    """Test the active AI provider for the calling user."""
    from app.runtime.engine import get_runtime
    runtime = get_runtime()

    try:
        content, _ = runtime.analyze_text(
            "Reply with the single word: pong",
            user_id=user_id,
            action="test_connection",
            credits=0,
        )

        if "Error" in content or not content.strip():
            return {
                "status": "error",
                "message": content or "Provider returned an empty response.",
                "ai_ready": False,
            }

        return {
            "status": "success",
            "message": "AI provider is connected and responding.",
            "ai_ready": True,
            "sample_response": content.strip()[:100],
        }
    except Exception as e:
        logger.error(f"AI test failed: {e}")
        return {"status": "error", "message": str(e), "ai_ready": False}

