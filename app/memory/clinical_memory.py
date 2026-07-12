from copy import deepcopy
from datetime import datetime
from typing import Dict, Any, Optional

from app.compiler.health_compiler import HealthCompiler


class ClinicalMemory:
    """
    Esillio Clinical Memory Engine

    Responsibilities
    ----------------
    - Own a single patient's canonical state
    - Update it after every upload
    - Return current memory
    - Reset memory if required

    This class contains NO AI.
    It only stores and evolves structured health data.
    """

    def __init__(self, patient_id: str = "default"):

        self.compiler = HealthCompiler()
        self.patient_id = patient_id
        self._init_state()

    def _init_state(self):
        self.patient_memory = {
            "patient_id": self.patient_id,
            "current_state": {},
            "history": [],
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat(),
        }

    ############################################################

    def update(
        self,
        extraction: Dict[str, Any],
        reasoning: Optional[Dict[str, Any]] = None,
        wellness: Optional[Dict[str, Any]] = None,
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

    def current(self) -> Dict[str, Any]:
        return deepcopy(self.patient_memory["current_state"])

    def history(self):
        return deepcopy(self.patient_memory["history"])

    def export(self):
        return deepcopy(self.patient_memory)

    def clear(self):
        self._init_state()

    def reset(self):
        self.clear()


############################################################
# Per-patient memory store — keyed by patient_id
# This prevents one patient's data from polluting another's.
############################################################

_memory_store: Dict[str, ClinicalMemory] = {}


def get_memory(patient_id: str = "default") -> ClinicalMemory:
    """
    Returns the ClinicalMemory instance for the given patient_id.
    Creates a new one if it doesn't exist yet.
    """
    global _memory_store
    if patient_id not in _memory_store:
        _memory_store[patient_id] = ClinicalMemory(patient_id=patient_id)
    return _memory_store[patient_id]


def reset_memory(patient_id: str = "default") -> None:
    """Clears the in-memory state for a specific patient."""
    global _memory_store
    if patient_id in _memory_store:
        _memory_store[patient_id].clear()


# Backwards-compatible singleton for code that imports `clinical_memory` directly
clinical_memory = get_memory("default")