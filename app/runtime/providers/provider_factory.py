from app.runtime.config import (
    AI_PROVIDER,
    MODEL_PATH,
    OPENAI_API_KEY,
    OPENAI_BASE_URL,
    OPENAI_MODEL,
)

from app.runtime.providers.local_provider import LocalProvider
from app.runtime.providers.openai_provider import OpenAIProvider
from app.storage.repository import settings_repository


def create_provider():
    """
    Creates the active AI provider.

    Priority
    --------
    1. User settings (saved via /settings/ai)
    2. Environment variables (.env)
    """

    ##########################################################
    # Try loading user settings from SQLite
    ##########################################################

    try:

        settings = settings_repository.get_settings()

        provider = settings.get(
            "provider",
            AI_PROVIDER,
        )

        base_url = settings.get(
            "base_url",
            OPENAI_BASE_URL,
        )

        api_key = settings.get(
            "api_key",
            OPENAI_API_KEY,
        )

        model = settings.get(
            "model",
            OPENAI_MODEL,
        )

    except Exception:
        pass

    provider = "openai"
    base_url = OPENAI_BASE_URL
    api_key = OPENAI_API_KEY or "dummy_key_to_bypass_init"
    model = OPENAI_MODEL

    ##########################################################
    # Local Gemma
    ##########################################################

    if provider.lower() == "local":

        return LocalProvider(
            model_path=str(MODEL_PATH),
        )

    ##########################################################
    # OpenAI-Compatible Runtime
    ##########################################################

    if provider.lower() == "openai":

        return OpenAIProvider(
            api_key=api_key,
            base_url=base_url,
            model=model,
        )

    ##########################################################

    raise ValueError(
        f"Unsupported AI provider: {provider}"
    )