from copy import deepcopy
from datetime import datetime
from typing import Dict, Any

from app.compiler.health_compiler import HealthCompiler


class ClinicalMemory:
    """
    Esillio Clinical Memory Engine

    Responsibilities
    ----------------
    - Own the patient's canonical state
    - Update it after every upload
    - Return current memory
    - Reset memory if required

    This class contains NO AI.

    It only stores and evolves structured health data.
    """

    def __init__(self):

        self.compiler = HealthCompiler()

        self.patient_memory = {
            "patient_id": "default",

            "current_state": {},

            "history": [],

            "created_at": datetime.utcnow().isoformat(),

            "updated_at": datetime.utcnow().isoformat(),
        }

    ############################################################

    def update(
        self,
        extraction: Dict[str, Any],
        reasoning: Dict[str, Any] | None = None,
        wellness: Dict[str, Any] | None = None,
    ) -> Dict[str, Any]:

        compiled_state = self.compiler.compile(
            extraction=extraction,
            reasoning=reasoning,
            wellness=wellness,
        )

        self.patient_memory["current_state"] = compiled_state

        self.patient_memory["history"].append(
            {
                "timestamp": datetime.utcnow().isoformat(),
                "summary": extraction.get("summary", ""),
                "conditions": extraction.get("conditions", []),
                "medications": extraction.get("medications", []),
                "symptoms": extraction.get("symptoms", []),
            }
        )

        self.patient_memory["updated_at"] = (
            datetime.utcnow().isoformat()
        )

        return deepcopy(self.patient_memory)

    ############################################################

    def current(self):

        return deepcopy(
            self.patient_memory["current_state"]
        )

    ############################################################

    def history(self):

        return deepcopy(
            self.patient_memory["history"]
        )

    ############################################################

    def export(self):

        return deepcopy(self.patient_memory)

    ############################################################

    def clear(self):

        self.__init__()