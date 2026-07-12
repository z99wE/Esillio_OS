import json
from datetime import datetime
from typing import List, Dict, Any
from app.runtime.engine import get_runtime

class TrendDetector:
    def __init__(self):
        self.engine = get_runtime()

    def analyze_trends(self, biomarkers: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Analyze a list of biomarker events to detect negative health trajectories.
        """
        if len(biomarkers) < 2:
            return {"status": "insufficient_data", "trends": []}

        # Format biomarkers for the LLM
        history_text = "Patient Biomarker History:\n"
        for b in sorted(biomarkers, key=lambda x: x.get("timestamp", "")):
            date = b.get("timestamp", "Unknown Date")
            title = b.get("title", "Unknown Marker")
            value = b.get("value", "Unknown Value")
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
            response = self.engine.analyze_text(prompt=prompt)
            # Try to extract JSON if wrapped in markdown
            if "```json" in response:
                response = response.split("```json")[1].split("```")[0].strip()
            elif "```" in response:
                response = response.split("```")[1].strip()
                
            result = json.loads(response)
            return result
        except Exception as e:
            print(f"Error in trend detection: {e}")
            return {"status": "error", "message": "Failed to analyze trends", "trends": []}
