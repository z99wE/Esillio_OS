from typing import Any, Dict, List
from app.runtime.capabilities.base import BaseCapability
from pydantic import BaseModel, Field

class FollowUpTask(BaseModel):
    title: str = Field(description="A concise title for the task")
    description: str = Field(description="A detailed description of the action the patient needs to take")
    task_type: str = Field(description="Type of task: must be one of 'appointment_prep', 'lab_followup', 'medication_change', 'ask_doctor', 'general'")
    checklist: List[str] = Field(default_factory=list, description="An array of specific, actionable steps or questions to ask the doctor. Crucial for 'appointment_prep' and 'ask_doctor'.")

class TaskGeneratorOutput(BaseModel):
    tasks: List[FollowUpTask] = Field(description="The list of actionable follow-up tasks extracted from the clinical record")

class TaskGeneratorCapability(BaseModel, BaseCapability):
    """
    LLM capability to extract actionable patient follow-up tasks from a clinical timeline record.
    """

    def run(self, clinical_text: str) -> Dict[str, Any]:
        prompt = f"""
        You are a medical intelligence assistant extracting actionable follow-up tasks for a patient from clinical notes.
        Read the provided clinical text and identify any tasks the patient needs to perform.
        
        Examples of tasks:
        - Getting a lab test done (lab_followup)
        - Preparing for an upcoming specialist visit (appointment_prep)
        - Changing a medication dosage or starting a new medication (medication_change)
        - Clarifying a specific symptom or condition with their doctor (ask_doctor)
        - Any other specific instruction (general)

        For tasks like 'appointment_prep' or 'ask_doctor', break down the preparation steps or specific questions into a distinct array of 'checklist' strings.
        Extract the tasks clearly, keeping the title concise and the description informative.

        Clinical Text:
        {clinical_text}
        """
        response = self.llm.invoke(
            prompt,
            response_model=TaskGeneratorOutput
        )
        return response.model_dump()
