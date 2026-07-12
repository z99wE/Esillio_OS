from pydantic import BaseModel
from typing import Optional


class HealthNote(BaseModel):
    text: str


class CompileRequest(BaseModel):
    """
    Multi-agent compile request.

    text:           The user's free-form health note or query.
    system_prompt:  Optional orchestration system prompt from the frontend.
                    When provided, this is prepended so the LLM acts as the
                    multi-agent EsiDiet / EsiActive / EsiCalm orchestrator.
    patient_context: Optional patient timeline/memory summary to ground responses.
    patient_id:     Optional patient identifier for memory isolation.
    """
    text: str
    system_prompt: Optional[str] = None
    patient_context: Optional[str] = None
    patient_id: Optional[str] = "default"


class ChatRequest(BaseModel):
    """
    Free-form chat with patient documents.
    """
    message: str
    patient_context: Optional[str] = None
    patient_id: Optional[str] = "default"
