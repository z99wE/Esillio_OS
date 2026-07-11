import json
import logging
from pathlib import Path

from app.runtime import Guardrails
from app.runtime.engine import get_runtime

logger = logging.getLogger(__name__)


class ClinicalReasoningCapability:
    """
    Esillio Clinical Reasoning Engine.
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
        patient_record: dict,
    ) -> dict:

        prompt = self.prompt.replace(
            "{{PATIENT_RECORD}}",
            json.dumps(
                patient_record,
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

            return Guardrails.apply(parsed)

        except Exception:

            logger.exception(
                "Clinical Guardian JSON parsing failed."
            )

            fallback = {

                "success": False,

                "top_3_priorities": [],

                "priority_findings": [],

                "medication_interactions": [],

                "contraindications": [],

                "dietary_recommendations": [],

                "exercise_recommendations": [],

                "sleep_recommendations": [],

                "hydration_recommendations": [],

                "preventive_recommendations": [],

                "biomarker_insights": [],

                "risk_flags": [],

                "questions_for_doctor": [],

                "follow_up_tests": [],

                "health_score": 0,

                "overall_summary": "",

                "raw_response": response,

            }

            return Guardrails.apply(fallback)