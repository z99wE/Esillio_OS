from abc import ABC, abstractmethod


class BaseProvider(ABC):
    """
    Base interface for every AI provider.
    """

    byok_active: bool = False

    @abstractmethod
    def generate(
        self,
        prompt: str,
        max_new_tokens: int = 1024,
    ) -> tuple[str, dict]:
        pass

    @abstractmethod
    def analyze_image(
        self,
        image_path: str,
        prompt: str,
        max_new_tokens: int = 1024,
    ) -> tuple[str, dict]:
        pass