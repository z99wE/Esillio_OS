from app.runtime.config import (
    AI_PROVIDER,
    OPENAI_API_KEY,
    OPENAI_API_KEYS,
    OPENAI_BASE_URL,
    OPENAI_MODEL,
)

from app.runtime.providers.local_provider import LocalProvider
from app.runtime.providers.key_pool_provider import KeyPoolProvider
from app.runtime.providers.openai_provider import OpenAIProvider

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
    # Override with user settings from Supabase (highest priority)
    ##########################################################

    try:
        from app.storage.supabase_client import supabase
        if supabase:
            # We don't have a settings table yet, but we will rely on env vars for now.
            # You can implement Supabase settings retrieval here later if needed.
            pass

    except Exception:
        logger.warning(
            "Failed to load AI settings from Supabase — using env-var defaults.",
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
        key_pool = []
        if api_key:
            key_pool = [api_key]
        elif OPENAI_API_KEYS:
            key_pool = OPENAI_API_KEYS

        if not key_pool:
            logger.warning(
                "No API key configured. Using stub provider (demo mode)."
            )
            return _stub_provider()

        providers = [
            OpenAIProvider(
                api_key=key,
                base_url=base_url,
                model=model,
            )
            for key in key_pool
        ]

        if len(providers) == 1:
            return providers[0]

        return KeyPoolProvider(providers)

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
