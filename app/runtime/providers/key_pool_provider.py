import logging
import threading
from typing import List

from app.runtime.providers.openai_provider import OpenAIProvider

logger = logging.getLogger(__name__)


class KeyPoolProvider:
    """
    Round-robin provider wrapper that falls back to the next key when one fails.
    """

    def __init__(self, providers: List[OpenAIProvider]):
        if not providers:
            raise ValueError("KeyPoolProvider requires at least one provider")
        self.providers = providers
        self._lock = threading.Lock()
        self._cursor = 0

    def _ordered_providers(self):
        with self._lock:
            start = self._cursor
            self._cursor = (self._cursor + 1) % len(self.providers)
        return self.providers[start:] + self.providers[:start]

    def generate(self, prompt: str, max_new_tokens: int = 1024, **kwargs) -> tuple[str, dict]:
        last_error = None
        for provider in self._ordered_providers():
            try:
                return provider.generate(prompt=prompt, max_new_tokens=max_new_tokens)
            except Exception as exc:
                last_error = exc
                logger.warning("Provider key failed, trying next key: %s", exc)
        if last_error:
            raise last_error
        raise RuntimeError("No providers available")

    def analyze_image(self, image_path: str, prompt: str, max_new_tokens: int = 1024, **kwargs) -> tuple[str, dict]:
        last_error = None
        for provider in self._ordered_providers():
            try:
                return provider.analyze_image(
                    image_path=image_path,
                    prompt=prompt,
                    max_new_tokens=max_new_tokens,
                )
            except Exception as exc:
                last_error = exc
                logger.warning("Provider key failed for image, trying next key: %s", exc)
        if last_error:
            raise last_error
        raise RuntimeError("No providers available")
