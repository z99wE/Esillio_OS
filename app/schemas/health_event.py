from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field


class Biomarker(BaseModel):
    name: str
    value: float
    unit: str
    reference_range: Optional[str] = None


class Medication(BaseModel):
    name: str
    dosage: Optional[str] = None
    frequency: Optional[str] = None


class Symptom(BaseModel):
    name: str
    severity: Optional[int] = Field(default=None, ge=1, le=10)


class HealthEvent(BaseModel):
    id: str

    source: str

    category: str

    timestamp: datetime

    title: str

    description: Optional[str] = None

    biomarkers: List[Biomarker] = []

    medications: List[Medication] = []

    symptoms: List[Symptom] = []

    tags: List[str] = []

    confidence: float = 1.0