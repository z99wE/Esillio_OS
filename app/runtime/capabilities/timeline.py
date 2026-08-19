import json
import logging
from pathlib import Path

from app.runtime.engine import get_runtime

logger = logging.getLogger(__name__)


class TimelineExtractionCapability:
    """
    Extract structured timeline events and strict provenance 
    from a medical document (Phase 3: Moat Data Model).
    """

    def __init__(self):
        self.runtime = get_runtime()
        self.prompt = self._load_prompt()

    ########################################################

    def _load_prompt(self):
        prompt_path = Path("app/runtime/prompts/timeline_extract.txt")
        return prompt_path.read_text()

    ########################################################

    def run(self, document: str) -> dict:
        prompt = self.prompt.replace("{{DOCUMENT}}", document)
        response = self.runtime.analyze_text(prompt=prompt)
        return self._validate(response)

    ########################################################

    def _validate(self, response: str) -> dict:
        try:
            # The model might include markdown block formatting like ```json ... ```
            cleaned_response = response.strip()
            if cleaned_response.startswith("```json"):
                cleaned_response = cleaned_response[7:]
            if cleaned_response.startswith("```"):
                cleaned_response = cleaned_response[3:]
            if cleaned_response.endswith("```"):
                cleaned_response = cleaned_response[:-3]
            
            parsed = json.loads(cleaned_response.strip())
            parsed["success"] = True
            return parsed

        except Exception:
            logger.exception("Timeline extraction JSON parsing failed.")
            return {
                "success": False,
                "timeline_events": [],
                "raw_response": response,
            }
