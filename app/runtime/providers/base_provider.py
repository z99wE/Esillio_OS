from abc import ABC, abstractmethod


class BaseProvider(ABC):
    """
    Base interface for every AI provider.
    """

    @abstractmethod
    def generate(
        self,
        prompt: str,
        max_new_tokens: int = 1024,
    ) -> str:
        pass

    @abstractmethod
    def analyze_image(
        self,
        image_path: str,
        prompt: str,
        max_new_tokens: int = 1024,
    ) -> str:
        pass