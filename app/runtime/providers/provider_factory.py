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
from app.runtime.providers.base_provider import BaseProvider

import logging

logger = logging.getLogger(__name__)


def create_provider(user_id: str | None = None):
    """
    Creates the active AI provider.

    Priority
    --------
    1. User BYOK (from llm_keys)
    2. Admin System Keys (from llm_keys)
    3. Environment variables (.env)
    4. No-op stub (demo mode — returns empty string)
    """

    ##########################################################
    # Default to env-var fallback values
    ##########################################################

    provider = AI_PROVIDER or "openai"
    base_url = OPENAI_BASE_URL or "https://api.openai.com/v1"
    api_key = OPENAI_API_KEY or ""
    model = OPENAI_MODEL or "gpt-4o"

    ##########################################################
    # DB Keys: BYOK and Admin Keys (highest priority)
    ##########################################################

    try:
        from app.storage.supabase_client import supabase
        if supabase:
            key_pool = []
            byok_active = False

            # 1. User BYOK
            if user_id:
                user_keys = supabase.table("llm_keys").select("api_key").eq("user_id", user_id).eq("is_active", True).execute()
                if user_keys.data:
                    byok_active = True
                    key_pool = [k["api_key"] for k in user_keys.data]

            # 2. Admin System Keys
            if not key_pool:
                admin_keys = supabase.table("llm_keys").select("api_key").is_("user_id", "null").eq("is_active", True).execute()
                if admin_keys.data:
                    key_pool = [k["api_key"] for k in admin_keys.data]

            if key_pool:
                providers = [
                    OpenAIProvider(
                        api_key=key,
                        base_url=base_url,
                        model=model,
                    )
                    for key in key_pool
                ]

                provider_obj: BaseProvider = (
                    providers[0] if len(providers) == 1 else KeyPoolProvider(providers)
                )
                provider_obj.byok_active = byok_active
                return provider_obj

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
            provider_obj = LocalProvider()
            provider_obj.byok_active = False
            return provider_obj
        except Exception:
            logger.exception(
                "LocalProvider failed to load — falling back to stub."
            )
            stub = _stub_provider()
            stub.byok_active = False
            return stub

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
            stub = _stub_provider()
            stub.byok_active = False
            return stub

        providers = [
            OpenAIProvider(
                api_key=key,
                base_url=base_url,
                model=model,
            )
            for key in key_pool
        ]

        if len(providers) == 1:
            provider_obj = providers[0]
        else:
            provider_obj = KeyPoolProvider(providers)

        provider_obj.byok_active = False
        return provider_obj

    ##########################################################

    logger.warning("Unrecognised provider '%s' — using stub.", provider)
    stub = _stub_provider()
    stub.byok_active = False
    return stub


##########################################################
# Stub provider — returns empty string, never crashes
##########################################################

class _StubProvider(BaseProvider):
    def generate(self, prompt: str, max_new_tokens: int = 1024, **kwargs) -> tuple[str, dict]:
        return (
            "No AI provider is configured. "
            "Add an API key in Settings to enable AI features.",
            {"prompt_tokens": 0, "completion_tokens": 0}
        )

    def analyze_image(self, image_path: str, prompt: str, max_new_tokens: int = 1024, **kwargs) -> tuple[str, dict]:
        return self.generate(prompt)


def _stub_provider() -> _StubProvider:
    return _StubProvider()
