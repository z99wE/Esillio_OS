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

        logger.info("Runtime Ready.")

    ########################################################

    def analyze_text(
        self,
        prompt: str,
    ) -> str:

        return self.provider._generate(
            prompt
        )

    ########################################################

    def analyze_image(
        self,
        image,
        prompt: str,
    ) -> str:

        return self.provider.vision(
            image=image,
            prompt=prompt,
        )


############################################################

def get_runtime():

    global _runtime

    if _runtime is None:

        _runtime = AIRuntime()

    return _runtime