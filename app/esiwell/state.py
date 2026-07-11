"""
EsiWell™

Patient State Engine

Creates a canonical patient state
from extracted medical information.
"""

from datetime import datetime


class PatientStateEngine:

    ##########################################################

    def build(
        self,
        record: dict,
    ) -> dict:

        entities = []

        entities.extend(
            record.get(
                "conditions",
                [],
            )
        )

        entities.extend(
            record.get(
                "medications",
                [],
            )
        )

        entities.extend(
            record.get(
                "allergies",
                [],
            )
        )

        biomarker_names = []

        for item in record.get(
            "biomarkers",
            [],
        ):

            if isinstance(item, dict):

                biomarker_names.append(
                    item.get(
                        "name",
                        ""
                    )
                )

            else:

                biomarker_names.append(
                    str(item)
                )

        state = {

            "health_version": 1,

            "generated_at": datetime.utcnow().isoformat(),

            "known_entities": sorted(
                set(
                    entities
                )
            ),

            "known_biomarkers": sorted(
                set(
                    biomarker_names
                )
            ),

            "entity_count": len(
                set(
                    entities
                )
            ),

            "biomarker_count": len(
                set(
                    biomarker_names
                )
            ),

            "confidence": 1.0,

        }

        return state


_runtime = None


def get_state_engine():

    global _runtime

    if _runtime is None:

        _runtime = PatientStateEngine()

    return _runtime