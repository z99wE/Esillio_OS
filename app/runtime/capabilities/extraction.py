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
        user_id: str | None = None,
    ) -> dict:

        prompt = self.prompt.replace(
            "{{DOCUMENT}}",
            document,
        )

        content, usage = self.runtime.analyze_text(
            prompt=prompt,
            user_id=user_id,
            action="extraction",
            credits=1,
        )

        parsed = self._validate(content)
        parsed["usage"] = usage
        return parsed

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