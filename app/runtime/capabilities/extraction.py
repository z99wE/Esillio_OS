import json
import logging
from pathlib import Path

from app.runtime.engine import get_runtime

logger = logging.getLogger(__name__)


class MedicalExtractionCapability:
    """
    Extract structured medical information from text.

    Produces canonical JSON that is consumed by the
    rest of Esillio.
    """

    def __init__(self):

        self.runtime = get_runtime()

        self.prompt = self._load_prompt()

    ########################################################

    def _load_prompt(self):

        prompt_path = Path(
            "app/runtime/prompts/medical_extract.txt"
        )

        return prompt_path.read_text()

    ########################################################

    def run(
        self,
        document: str,
    ) -> dict:

        prompt = self.prompt.replace(
            "{{DOCUMENT}}",
            document,
        )

        response = self.runtime.analyze_text(
            prompt=prompt
        )

        return self._validate(response)

    ########################################################

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
                "Medical extraction JSON parsing failed."
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