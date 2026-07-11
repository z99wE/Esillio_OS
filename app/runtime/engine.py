import logging

from app.runtime.config import MODEL_PATH
from app.runtime.providers.local_provider import LocalProvider

logger = logging.getLogger(__name__)

_runtime = None


class AIRuntime:
    """
    Esillio Clinical Intelligence Runtime

    Loads the local Gemma model once and exposes a
    simple interface for all AI capabilities.
    """

    def __init__(self):

        logger.info("Loading Clinical Intelligence Runtime...")

        self.provider = LocalProvider(
            model_path=str(MODEL_PATH)
        )

        logger.info("Clinical Intelligence Runtime Ready.")

    ########################################################

    def analyze_text(
        self,
        prompt: str,
    ) -> str:
        """
        Generate a response from the local Gemma model.
        """

        return self.provider.generate(
            prompt=prompt
        )

    ########################################################

    def analyze_image(
        self,
        image_path: str,
        prompt: str,
    ) -> str:
        """
        Analyze a medical image using Gemma Vision.
        """

        return self.provider.analyze_image(
            image_path=image_path,
            prompt=prompt,
        )


############################################################

def get_runtime():
    """
    Singleton runtime.

    Loads Gemma exactly once during the application's
    lifetime.
    """

    global _runtime

    if _runtime is None:

        _runtime = AIRuntime()

    return _runtime