import json
import logging
from pathlib import Path

from app.runtime.engine import get_runtime

logger = logging.getLogger(__name__)


class ClinicalReasoningCapability:
    """
    Esillio Clinical Intelligence Engine

    Responsibilities
    ----------------
    • Interpret extracted medical information
    • Explain important findings
    • Highlight possible trends
    • Suggest discussion topics for the next clinician visit
    • Generate educational health summaries

    This module DOES NOT diagnose disease or prescribe treatment.
    """

    def __init__(self):

        self.runtime = get_runtime()

        self.prompt = self._load_prompt()

    ##########################################################

    def _load_prompt(self):

        prompt_path = Path(
            "app/runtime/prompts/clinical_reasoning.txt"
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

        response = self.runtime.provider._generate(
            prompt
        )

        return self._validate(response)

    ##########################################################

    def _validate(
        self,
        response: str,
    ):

        try:

            parsed = json.loads(response)

            parsed["success"] = True

            return parsed

        except Exception:

            logger.exception(
                "Clinical reasoning JSON parsing failed."
            )

            return {

                "success": False,

                "important_findings": [],

                "possible_trends": [],

                "red_flags": [],

                "recommended_follow_up": [],

                "questions_for_clinician": [],

                "clinical_summary": "",

                "raw_response": response,

            }