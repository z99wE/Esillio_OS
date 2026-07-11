import json
import logging
from pathlib import Path

from app.runtime.engine import get_runtime

logger = logging.getLogger(__name__)


class VisionCapability:
    """
    Esillio Vision Intelligence

    Supports:

    - Prescriptions
    - Lab Reports
    - Blood Reports
    - Hospital Summaries
    - Medical Images

    Returns structured JSON.
    """

    def __init__(self):

        self.runtime = get_runtime()

        self.prompt = self._load_prompt()

    ##########################################################

    def _load_prompt(self):

        prompt_path = Path(
            "app/runtime/prompts/vision_extract.txt"
        )

        return prompt_path.read_text()

    ##########################################################

    def run(
        self,
        image_path: str,
    ) -> dict:
        """
        Analyze a medical image using the local Gemma Vision model.
        """

        response = self.runtime.analyze_image(
            image_path=image_path,
            prompt=self.prompt,
        )

        return self._validate(response)

    ##########################################################

    def _validate(
        self,
        response: str,
    ) -> dict:

        try:

            parsed = json.loads(response)

            parsed["success"] = True

            return parsed

        except Exception:

            logger.exception(
                "Vision JSON parsing failed."
            )

            return {

                "success": False,

                "conditions": [],

                "medications": [],

                "symptoms": [],

                "biomarkers": [],

                "procedures": [],

                "allergies": [],

                "family_history": [],

                "nutrition": [],

                "lifestyle": [],

                "follow_up": [],

                "red_flags": [],

                "summary": "",

                "raw_response": response,

            }