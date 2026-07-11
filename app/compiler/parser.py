from datetime import datetime
import uuid

from app.schemas.health_event import HealthEvent


class BiologicalContinuityParser:

    def compile_manual_event(
        self,
        title: str,
        category: str,
        source: str,
        description: str = "",
    ) -> HealthEvent:

        return HealthEvent(
            id=str(uuid.uuid4()),
            source=source,
            category=category,
            timestamp=datetime.utcnow(),
            title=title,
            description=description,
            biomarkers=[],
            medications=[],
            symptoms=[],
            tags=[],
            confidence=1.0,
        )