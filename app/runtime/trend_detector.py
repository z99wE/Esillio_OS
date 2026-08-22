import json
from typing import List, Dict, Any
from app.runtime.engine import get_runtime

class TrendDetector:
    def __init__(self):
        self.engine = get_runtime()

    def analyze_trends(self, biomarkers: List[Dict[str, Any]], user_id: str | None = None) -> Dict[str, Any]:
        """
        Analyze a list of biomarker events to detect negative health trajectories.
        """
        if len(biomarkers) < 2:
            return {"status": "insufficient_data", "trends": []}

        import re
        def sanitize_input(text: str) -> str:
            # Remove any special instruction characters or potential prompt injection markers
            if not isinstance(text, str):
                text = str(text)
            sanitized = re.sub(r'[<>{}\[\]|`\\]', '', text)
            # Remove system prompt override phrases
            phrases_to_block = ["ignore previous", "system prompt", "you are now", "forget all instructions"]
            for phrase in phrases_to_block:
                if phrase in sanitized.lower():
                    sanitized = "[REDACTED_DUE_TO_SECURITY_POLICY]"
            return sanitized.strip()

        # Format biomarkers for the LLM
        history_text = "Patient Biomarker History:\n"
        for b in sorted(biomarkers, key=lambda x: x.get("timestamp", "")):
            date = sanitize_input(b.get("timestamp", "Unknown Date"))
            title = sanitize_input(b.get("title", "Unknown Marker"))
            value = sanitize_input(b.get("value", "Unknown Value"))
            history_text += f"- {date}: {title} = {value}\n"

        prompt = f"""
        You are a clinical anomaly detection AI. Analyze the following patient biomarker history.
        Identify any concerning or deteriorating trends (e.g., rising HbA1c, increasing LDL, decreasing HRV).
        If an anomaly is detected, provide a short, actionable explanation.
        
        Respond ONLY with a valid JSON object matching this schema:
        {{
            "anomalies_detected": boolean,
            "trends": [
                {{
                    "biomarker": "name of biomarker",
                    "trend": "rising" or "falling",
                    "clinical_significance": "short explanation",
                    "actionable_insight": "short recommendation"
                }}
            ]
        }}
        
        {history_text}
        """

        try:
            content, usage = self.engine.analyze_text(
                prompt=prompt,
                user_id=user_id,
                action="trend_detection",
                credits=2,
            )
            # Try to extract JSON if wrapped in markdown
            if "```json" in content:
                content = content.split("```json")[1].split("```")[0].strip()
            elif "```" in content:
                content = content.split("```")[1].strip()
                
            result = json.loads(content)
            result["usage"] = usage
            return result
        except Exception as e:
            print(f"Error in trend detection: {e}")
            return {"status": "error", "message": "Failed to analyze trends", "trends": []}
