import logging

from app.runtime.providers.provider_factory import (
    create_provider,
)

logger = logging.getLogger(__name__)

_runtime = None


class AIRuntime:
    """
    Esillio Runtime
    
    Dynamically loads the configured provider.
    Optimised for execution on AMD Instinct GPUs using ROCm.
    Default local target model: Gemma 4 (4-bit quantised for efficient local inference).
    """

    def __init__(self):

        self.reload()

    ########################################################

    def reload(self):

        logger.info(
            "Loading AI Provider..."
        )

        self.provider = create_provider()

        logger.info(
            "AI Provider Ready."
        )

    ########################################################

    def analyze_text(
        self,
        prompt: str,
        user_id: str | None = None,
        action: str = "llm_generate",
        credits: int = 1,
    ) -> tuple[str, dict]:
        from app.services.usage_service import usage_service
        
        provider = create_provider(user_id=user_id)
        
        if user_id and not usage_service.can_consume(user_id, credits=credits, byok_active=provider.byok_active):
            return "Error: Daily usage limit reached. Please configure BYOK or wait until tomorrow.", {}

        content, usage = provider.generate(
            prompt=prompt,
        )
        
        if user_id:
            prompt_tokens = usage.get("prompt_tokens", 0)
            completion_tokens = usage.get("completion_tokens", 0)
            cost_usd = (prompt_tokens * 0.000005) + (completion_tokens * 0.000015)
            usage_service.consume(
                user_id=user_id,
                action=action,
                credits=credits,
                prompt_tokens=prompt_tokens,
                completion_tokens=completion_tokens,
                cost_usd=cost_usd,
                byok_active=provider.byok_active,
            )

        return content, usage

    ########################################################

    def analyze_image(
        self,
        image,
        prompt: str,
        user_id: str | None = None,
        action: str = "llm_vision",
        credits: int = 2,
    ) -> tuple[str, dict]:
        from app.services.usage_service import usage_service
        
        provider = create_provider(user_id=user_id)
        
        if user_id and not usage_service.can_consume(user_id, credits=credits, byok_active=provider.byok_active):
            return "Error: Daily usage limit reached. Please configure BYOK or wait until tomorrow.", {}

        content, usage = provider.analyze_image(
            image_path=image,
            prompt=prompt,
        )
        
        if user_id:
            prompt_tokens = usage.get("prompt_tokens", 0)
            completion_tokens = usage.get("completion_tokens", 0)
            cost_usd = (prompt_tokens * 0.000005) + (completion_tokens * 0.000015)
            usage_service.consume(
                user_id=user_id,
                action=action,
                credits=credits,
                prompt_tokens=prompt_tokens,
                completion_tokens=completion_tokens,
                cost_usd=cost_usd,
                byok_active=provider.byok_active,
            )

        return content, usage


############################################################


def get_runtime():

    global _runtime

    if _runtime is None:

        _runtime = AIRuntime()

    return _runtime


############################################################


def reload_runtime():

    runtime = get_runtime()

    runtime.reload()

    return runtime