from app.runtime.config import (
    AI_PROVIDER,
    OPENAI_API_KEY,
    OPENAI_BASE_URL,
    OPENAI_MODEL,
)

from app.runtime.providers.local_provider import LocalProvider
from app.runtime.providers.openai_provider import OpenAIProvider
from app.storage.repository import settings_repository

import logging

logger = logging.getLogger(__name__)


def create_provider():
    """
    Creates the active AI provider.

    Priority
    --------
    1. User settings (saved via /settings/ai → SQLite)
    2. Environment variables (.env)
    3. No-op stub (demo mode — returns empty string)
    """

    ##########################################################
    # Default to env-var fallback values
    ##########################################################

    provider = AI_PROVIDER or "openai"
    base_url = OPENAI_BASE_URL or "https://api.openai.com/v1"
    api_key = OPENAI_API_KEY or ""
    model = OPENAI_MODEL or "gpt-4o"

    ##########################################################
    # Override with user settings from SQLite (highest priority)
    ##########################################################

    try:
        settings = settings_repository.get_settings()

        db_provider = settings.get("provider", "").strip()
        db_base_url = settings.get("base_url", "").strip()
        db_api_key = settings.get("api_key", "").strip()
        db_model = settings.get("model", "").strip()

        # Only use DB values that are real (not placeholder stubs)
        if db_provider and db_provider != "local":
            provider = db_provider
        if db_base_url:
            base_url = db_base_url
        if db_api_key and db_api_key not in ("dummy_key", "dummy_key_to_bypass_init", ""):
            api_key = db_api_key
        if db_model:
            model = db_model

        # Local provider: use it regardless of key
        if db_provider == "local":
            provider = "local"

        logger.info(
            "AI provider loaded from DB: provider=%s model=%s base_url=%s key_present=%s",
            provider, model, base_url, bool(api_key),
        )

    except Exception:
        logger.warning(
            "Failed to load AI settings from DB — using env-var defaults.",
            exc_info=True,
        )

    ##########################################################
    # Local Provider Proxy (e.g. Ollama/LM Studio)
    ##########################################################

    if provider.lower() == "local":
        try:
            return LocalProvider()
        except Exception:
            logger.exception(
                "LocalProvider failed to load — falling back to stub."
            )
            return _stub_provider()

    ##########################################################
    # OpenAI-Compatible Runtime
    # Covers: OpenAI, Lightning AI, Ollama, LM Studio,
    #         Google AI Studio (Gemini via OpenAI-compat endpoint)
    ##########################################################

    if provider.lower() in ("openai", "gemini", "custom", "lightning"):
        if not api_key:
            logger.warning(
                "No API key configured. Using stub provider (demo mode)."
            )
            return _stub_provider()

        return OpenAIProvider(
            api_key=api_key,
            base_url=base_url,
            model=model,
        )

    ##########################################################

    logger.warning("Unrecognised provider '%s' — using stub.", provider)
    return _stub_provider()


##########################################################
# Stub provider — returns empty string, never crashes
##########################################################

class _StubProvider:
    def generate(self, prompt: str, **kwargs) -> str:
        return (
            "No AI provider is configured. "
            "Add an API key in Settings to enable AI features."
        )

    def analyze_image(self, image_path: str, prompt: str, **kwargs) -> str:
        return self.generate(prompt)


def _stub_provider() -> _StubProvider:
    return _StubProvider()