import logging
from pathlib import Path
from typing import Optional, List, Dict, Any

import torch
from PIL import Image

from transformers import (
    AutoProcessor,
    Gemma4ForConditionalGeneration,
)

from app.runtime.config import (
    MAX_NEW_TOKENS,
    TEMPERATURE,
)

logger = logging.getLogger(__name__)


class LocalProvider:
    """
    Local Gemma 4 Provider

    Responsibilities:
    - Load the local model once
    - Generate text
    - Analyze medical images
    """

    def __init__(
        self,
        model_path: str,
    ):

        self.model_path = Path(model_path)

        try:
            logger.info("Loading Gemma processor...")
            self.processor = AutoProcessor.from_pretrained(
                self.model_path
            )

            logger.info("Loading Gemma model...")
            self.model = (
                Gemma4ForConditionalGeneration
                .from_pretrained(
                    self.model_path,
                    torch_dtype=torch.bfloat16,
                    device_map="auto",
                )
                .eval()
            )
            
            logger.info("Gemma Runtime Ready")
            
        except Exception:
            logger.exception("Failed to load Gemma runtime")
            raise

    ###########################################################

    def _ensure_complete_response(self, text: str) -> str:
        text = text.strip()

        if not text:
            return text

        # JSON response
        if text.endswith(("}", "]")):
            return text

        # Normal sentence
        if text.endswith((".", "!", "?", "\"", "'", "”", "’")):
            return text

        last = max(
            text.rfind("."),
            text.rfind("!"),
            text.rfind("?"),
        )

        if last != -1:
            return text[: last + 1].strip()

        return text

    ###########################################################

    def _run_inference(
        self, 
        messages: List[Dict[str, Any]], 
        max_new_tokens: Optional[int] = None
    ) -> str:
        """
        Helper method to apply chat template, run generation under inference mode,
        and clean up the final decoded response.
        """
        inputs = self.processor.apply_chat_template(
            messages,
            tokenize=True,
            add_generation_prompt=True,
            return_dict=True,
            return_tensors="pt",
        )

        inputs = {
            k: v.to(self.model.device)
            for k, v in inputs.items()
        }

        with torch.inference_mode():
            outputs = self.model.generate(
                **inputs,
                max_new_tokens=max_new_tokens or MAX_NEW_TOKENS,
                do_sample=False,
                temperature=TEMPERATURE,
            )

        generated = outputs[
            0,
            inputs["input_ids"].shape[-1]:,
        ]

        decoded_text = self.processor.decode(
            generated,
            skip_special_tokens=True,
        )

        return self._ensure_complete_response(decoded_text)

    ###########################################################

    def generate(
        self,
        prompt: str,
        max_new_tokens: Optional[int] = None,
    ) -> str:

        messages = [
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": prompt,
                    }
                ],
            }
        ]

        return self._run_inference(messages, max_new_tokens)

    ###########################################################

    def analyze_image(
        self,
        image_path: str,
        prompt: str,
        max_new_tokens: Optional[int] = None,
    ) -> str:

        image = Image.open(image_path).convert("RGB")

        messages = [
            {
                "role": "user",
                "content": [
                    {
                        "type": "image",
                        "image": image,
                    },
                    {
                        "type": "text",
                        "text": prompt,
                    },
                ],
            }
        ]

        return self._run_inference(messages, max_new_tokens)
