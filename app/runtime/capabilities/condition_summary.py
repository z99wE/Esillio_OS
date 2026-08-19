from typing import Any, Dict, List
from app.runtime.capabilities.base import BaseCapability
from pydantic import BaseModel, Field

class Citation(BaseModel):
    document_id: str = Field(description="The document ID from the source event")
    source_snippet: str = Field(description="The snippet of text supporting the claim")

class SummaryItem(BaseModel):
    date: str = Field(description="The date of the event")
    description: str = Field(description="Summary of what happened")
    citations: List[Citation] = Field(description="List of citations supporting this summary item")

class ConditionSummaryOutput(BaseModel):
    condition: str = Field(description="The condition being summarized")
    summary: str = Field(description="High-level narrative summary of the condition's progression")
    timeline: List[SummaryItem] = Field(description="Chronological summary of events")

class ConditionSummaryCapability(BaseModel, BaseCapability):
    """
    LLM capability to synthesize a chronological summary with strict citation tracking.
    """

    def run(self, condition: str, events: List[Dict[str, Any]]) -> Dict[str, Any]:
        prompt = f"""
        You are a medical intelligence assistant summarizing a patient's history for a specific condition.
        Synthesize a chronological summary of the progression of '{condition}' based on the provided timeline events.
        
        CRITICAL: Every claim in your summary must be supported by a citation mapping back to the provided events. 
        Use the 'document_id' and 'source_snippet' from the insight_provenance data in the events to build the citations.

        Timeline Events:
        {events}
        """
        response = self.llm.invoke(
            prompt,
            response_model=ConditionSummaryOutput
        )
        return response.model_dump()
