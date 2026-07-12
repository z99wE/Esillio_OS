import logging
from pathlib import Path
from typing import Optional

from transformers import pipeline

logger = logging.getLogger(__name__)


class LocalProvider:
    """
    Local Provider
    
    Responsibilities:
    - Load the highly optimized local compiler model (trained on AMD)
    - Run fast text classification via huggingface pipeline on CPU
    """

    def __init__(
        self,
        model_path: str = "/app/Esillio-Compiler/artifacts/esillio_compiler",
    ):
        self.model_path = str(Path(model_path))

        try:
            logger.info(f"Loading compiled local model pipeline from {self.model_path}...")
            self.classifier = pipeline(
                "text-classification",
                model=self.model_path,
                tokenizer=self.model_path,
            )
            logger.info("Compiled Runtime Ready")
            
        except Exception:
            logger.exception("Failed to load local compiled runtime")
            raise

    ###########################################################

    def generate(
        self,
        prompt: str,
        max_new_tokens: Optional[int] = None,
    ) -> str:
        """
        Classifies the text and returns the classification result as a string.
        """
        try:
            result = self.classifier(prompt)
            return str(result)
        except Exception as e:
            logger.error(f"Classification failed: {e}")
            return f"Error analyzing data: {e}"

    ###########################################################

    def analyze_image(
        self,
        image_path: str,
        prompt: str,
        max_new_tokens: Optional[int] = None,
    ) -> str:
        """
        The compiled model is text-only. Returns a fallback message.
        """
        return "Image analysis is not supported by the current micro-model. Please use the OpenAI provider for visual tasks."
