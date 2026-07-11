import uuid
from datetime import datetime

from app.schemas.health_event import HealthEvent


class DocumentParser:

    KEYWORDS = {
        "diabetes": "Condition",
        "hypertension": "Condition",
        "cholesterol": "Condition",
        "fever": "Symptom",
        "headache": "Symptom",
        "metformin": "Medication",
        "paracetamol": "Medication",
        "aspirin": "Medication",
        "hemoglobin": "Biomarker",
        "glucose": "Biomarker",
        "hb": "Biomarker",
    }

    def parse(self, text: str):

        events = []

        lower = text.lower()

        for keyword, category in self.KEYWORDS.items():

            if keyword in lower:

                events.append(
                    HealthEvent(
                        id=str(uuid.uuid4()),
                        title=keyword.title(),
                        category=category,
                        source="document",
                        description=f"Detected '{keyword}' in uploaded document.",
                        timestamp=datetime.utcnow(),
                        confidence=0.80,
                    )
                )

        return events