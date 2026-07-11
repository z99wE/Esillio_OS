import json
import logging
from pathlib import Path

from app.runtime.engine import get_runtime

logger = logging.getLogger(__name__)


class WellnessCapability:
    """
    Esillio Personal Wellness Intelligence

    Generates educational wellness suggestions based on
    structured medical information.

    This module does NOT diagnose disease or prescribe treatment.
    """

    def __init__(self):

        self.runtime = get_runtime()

        self.prompt = self._load_prompt()

    ##########################################################

    def _load_prompt(self):

        prompt_path = Path(
            "app/runtime/prompts/wellness.txt"
        )

        return prompt_path.read_text()

    ##########################################################

    def run(
        self,
        medical_record: dict,
    ) -> dict:

        prompt = self.prompt.replace(
            "{{PATIENT_RECORD}}",
            json.dumps(
                medical_record,
                indent=2,
            ),
        )

        response = self.runtime.analyze_text(
            prompt=prompt,
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
                "Wellness JSON parsing failed."
            )

            return {

                "success": False,

                "diet": {},

                "exercise": {},

                "sleep": {},

                "hydration": {},

                "stress": {},

                "preventive": {},

                "questions_for_clinician": [],

                "wellness_summary": "",

                "raw_response": response,

            }