import logging

from fastapi import APIRouter

from app.schemas.ai_settings import AISettings
from app.storage.repository import settings_repository
from app.runtime.engine import reload_runtime

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/settings",
    tags=["AI Settings"],
)

############################################################
# Known providers and their default base URLs
# Gemini (AI Studio) uses an OpenAI-compatible endpoint —
# no code changes needed in the OpenAIProvider.
############################################################

PROVIDER_DEFAULTS = {
    "openai": {
        "base_url": "https://api.openai.com/v1",
        "model": "gpt-4o",
    },
    "gemini": {
        # Google AI Studio OpenAI-compatible endpoint
        "base_url": "https://generativelanguage.googleapis.com/v1beta/openai/",
        "model": "gemini-2.0-flash",
    },
    "lightning": {
        # Lightning AI — user must supply their own endpoint
        "base_url": "https://your-lightning-endpoint/v1",
        "model": "meta-llama/Llama-3.1-8B-Instruct",
    },
    "custom": {
        "base_url": "http://localhost:11434/v1",
        "model": "llama3",
    },
    "local": {
        "base_url": "",
        "model": "gemma",
    },
}


############################################################


@router.get("/ai")
def get_ai_settings():
    """Return current AI provider configuration."""
    return {
        "status": "success",
        "settings": settings_repository.get_settings(),
        "provider_defaults": PROVIDER_DEFAULTS,
    }


############################################################


@router.post("/ai")
def save_ai_settings(settings: AISettings):
    """
    Save AI provider settings and hot-reload the runtime.

    Supported providers:
    - openai     → OpenAI API (sk-...)
    - gemini     → Google AI Studio (AIza..., OpenAI-compat endpoint)
    - lightning  → Lightning AI Studio endpoint
    - custom     → Any OpenAI-compatible URL (Ollama, LM Studio, etc.)
    - local      → On-device Gemma model
    """

    saved = settings_repository.save_settings(
        provider=settings.provider,
        base_url=settings.base_url,
        api_key=settings.api_key,
        model=settings.model,
    )

    # Hot-reload the AI runtime with new settings
    reload_runtime()

    logger.info(
        "AI settings updated: provider=%s model=%s",
        settings.provider,
        settings.model,
    )

    return {
        "status": "success",
        "message": "AI settings updated successfully.",
        "settings": saved,
    }


############################################################


@router.post("/ai/test")
def test_ai_connection():
    """
    Send a minimal test request to verify the configured AI provider works.
    Returns success/failure so the frontend can show a connection status badge.
    """
    from app.runtime.engine import get_runtime

    try:
        runtime = get_runtime()
        provider_name = runtime.provider.__class__.__name__

        if provider_name == "_StubProvider":
            return {
                "status": "no_provider",
                "message": "No AI provider configured. Add an API key in Settings.",
                "ai_ready": False,
            }

        # Minimal probe — short prompt, fast response
        response = runtime.analyze_text(
            "Respond with exactly one word: OK"
        )

        return {
            "status": "success",
            "message": "AI provider is connected and responding.",
            "ai_ready": True,
            "provider": provider_name,
            "sample_response": response[:100] if response else "",
        }

    except Exception as e:
        logger.warning("AI connection test failed: %s", str(e))
        return {
            "status": "error",
            "message": str(e),
            "ai_ready": False,
        }