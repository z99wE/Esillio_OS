import logging
from typing import Optional
from openai import OpenAI

logger = logging.getLogger(__name__)


class LocalProvider:
    """
    Local Provider
    
    Responsibilities:
    - Act as a lightweight proxy to local inference servers (e.g., Ollama, LM Studio)
    - Do not bundle any heavy ML libraries (torch, transformers)
    - Use standard OpenAI compatible endpoints
    """

    def __init__(
        self,
        base_url: str = "http://host.docker.internal:11434/v1",  # Default to Ollama local URL
        model: str = "gemma",
        api_key: str = "local",
    ):
        self.model = model
        try:
            logger.info(f"Initializing lightweight local provider connected to {base_url}")
            self.client = OpenAI(
                base_url=base_url,
                api_key=api_key
            )
            logger.info("Local Provider Ready")
        except Exception:
            logger.exception("Failed to initialize lightweight local provider")
            raise

    ###########################################################

    def generate(
        self,
        prompt: str,
        max_new_tokens: int = 1024,
    ) -> str:
        """
        Sends the prompt to the local API
        """
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "user",
                        "content": prompt,
                    }
                ],
                max_tokens=max_new_tokens,
            )
            return response.choices[0].message.content
        except Exception as e:
            logger.error(f"Generation failed via local API: {e}")
            return f"Error communicating with local AI server: {e}"

    ###########################################################

    def analyze_image(
        self,
        image_path: str,
        prompt: str,
        max_new_tokens: int = 1024,
    ) -> str:
        """
        Fallback message, local proxy image processing can be added if local vision model is running
        """
        return "Image analysis requires connecting to a local vision model endpoint."
