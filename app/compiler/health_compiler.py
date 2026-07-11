from copy import deepcopy
from datetime import datetime
from typing import Any, Dict, List, Optional


class HealthCompiler:
    """
    Compiles AI outputs into a single canonical patient state.

    This class contains NO AI.
    It simply merges structured information into a
    longitudinal health record.
    """

    def __init__(self):

        self.state = {
            "conditions": [],
            "medications": [],
            "symptoms": [],
            "biomarkers": [],
            "procedures": [],
            "allergies": [],
            "family_history": [],
            "nutrition": [],
            "lifestyle": [],
            "follow_up": [],
            "risk_flags": [],
            "timeline": [],
            "clinical_reasoning": {},
            "wellness": {},
            "last_updated": None,
        }

    ########################################################

    def compile(
        self,
        extraction: Dict[str, Any],
        reasoning: Optional[Dict[str, Any]] = None,
        wellness: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:

        fields = [
            "conditions",
            "medications",
            "symptoms",
            "biomarkers",
            "procedures",
            "allergies",
            "family_history",
            "nutrition",
            "lifestyle",
            "follow_up",
        ]

        for field in fields:
            self._merge_unique(
                field,
                extraction.get(field, []),
            )

        self._merge_unique(
            "risk_flags",
            extraction.get("red_flags", []),
        )

        self.state["timeline"].append(
            {
                "timestamp": datetime.utcnow().isoformat(),
                "summary": extraction.get(
                    "summary",
                    "",
                ),
            }
        )

        if reasoning:

            self.state["clinical_reasoning"] = deepcopy(
                reasoning
            )

        if wellness:

            self.state["wellness"] = deepcopy(
                wellness
            )

        self.state["last_updated"] = (
            datetime.utcnow().isoformat()
        )

        return deepcopy(self.state)

    ########################################################

    def _merge_unique(
        self,
        field: str,
        values: List[Any],
    ):

        if not values:
            return

        existing = {
            str(v).strip().lower()
            for v in self.state[field]
        }

        for value in values:

            key = str(value).strip().lower()

            if key not in existing:

                self.state[field].append(value)

                existing.add(key)

    ########################################################

    def current(self):

        return deepcopy(self.state)

    ########################################################

    def reset(self):

        self.__init__()