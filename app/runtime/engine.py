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
    ) -> str:

        return self.provider.generate(
            prompt=prompt,
        )

    ########################################################

    def analyze_image(
        self,
        image,
        prompt: str,
    ) -> str:

        return self.provider.analyze_image(
            image_path=image,
            prompt=prompt,
        )


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