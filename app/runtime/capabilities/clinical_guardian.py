import json
import logging
from pathlib import Path

from app.runtime import Guardrails
from app.runtime.engine import get_runtime

logger = logging.getLogger(__name__)


class ClinicalGuardianCapability:
    """
    Esillio Guardian™

    High-level Clinical Intelligence Engine.

    Responsibilities
    ----------------
    • Prioritize findings
    • Explain biomarkers
    • Review medications
    • Generate lifestyle guidance
    • Produce an executive summary

    Educational only.
    """

    def __init__(self):

        self.runtime = get_runtime()

        self.prompt = self._load_prompt()

    ##########################################################

    def _load_prompt(self):

        prompt_path = Path(
            "app/runtime/prompts/clinical_guardian.txt"
        )

        return prompt_path.read_text()

    ##########################################################

    def run(
        self,
        patient_record: dict,
        user_id: str | None = None,
    ) -> dict:

        prompt = self.prompt.replace(
            "{{PATIENT_RECORD}}",
            json.dumps(
                patient_record,
                indent=2,
            ),
        )

        content, usage = self.runtime.analyze_text(
            prompt=prompt,
            user_id=user_id,
            action="clinical_guardian",
            credits=2,
        )

        parsed = self._validate(content)
        parsed["usage"] = usage
        return parsed

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