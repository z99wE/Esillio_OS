from typing import Any, Dict, List
from app.runtime.capabilities.base import BaseCapability
from pydantic import BaseModel, Field

class DiffEvent(BaseModel):
    category: str = Field(description="'Resolved', 'New', 'Changed', or 'Unchanged'")
    description: str = Field(description="Description of the change")
    event_type: str = Field(description="Category of the event (e.g. medication, diagnosis)")

class ClinicalDiffOutput(BaseModel):
    diffs: List[DiffEvent] = Field(description="List of clinical differences")

class ClinicalDiffCapability(BaseCapability):
    """
    LLM capability to generate structured clinical diffs between two sets of events.
    """

    def run(self, events_a: List[Dict[str, Any]], events_b: List[Dict[str, Any]]) -> Dict[str, Any]:
        prompt = f"""
        You are a medical intelligence assistant analyzing changes in a patient's clinical history.
        Compare the following two sets of clinical events from different encounters and generate a structured diff.

        Encounter A (older):
        {events_a}

        Encounter B (newer):
        {events_b}

        Identify what is 'Resolved' (present in A, missing in B), 'New' (missing in A, present in B), 'Changed' (e.g., dosage change), and 'Unchanged'.
        """
        response = self.llm.invoke(
            prompt,
            response_model=ClinicalDiffOutput
        )
        return response.model_dump()
