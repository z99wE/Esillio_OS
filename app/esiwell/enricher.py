cd /workspace/Esillio-Latest

cat > app/esiwell/enricher.py <<'EOF'
"""
EsiWell™

Runtime Enrichment Engine

This layer enriches extracted medical records using the
compiled EsiWell knowledge database.

It is intentionally provider-independent and CPU-only.
"""

from .loader import get_loader
from .state import get_state_engine


class EsiWellEnricher:

    def __init__(self):

        self.db = get_loader()

        self.state = get_state_engine()

    ############################################################

    def enrich(
        self,
        record: dict,
    ) -> dict:

        enriched = dict(record)

        enriched["esiwell"] = {

            "knowledge_version": "2026.07",

            "relationships": [],

            "rules": [],

            "recommendations": [],

            "patient_state": {}

        }

        cursor = self.db.cursor()

        ########################################################
        # Medication Rules
        ########################################################

        for medication in record.get(
            "medications",
            [],
        ):

            rows = cursor.execute(

                """
                SELECT *

                FROM rules

                WHERE trigger_entity=?

                """,

                (medication,),

            ).fetchall()

            for row in rows:

                enriched["esiwell"]["rules"].append(

                    dict(row)

                )

        ########################################################
        # Biomarker Rules
        ########################################################

        for biomarker in record.get(
            "biomarkers",
            [],
        ):

            if isinstance(
                biomarker,
                dict,
            ):

                name = biomarker.get(
                    "name",
                    "",
                )

            else:

                name = str(
                    biomarker
                )

            rows = cursor.execute(

                """
                SELECT *

                FROM rules

                WHERE trigger_entity=?

                """,

                (name,),

            ).fetchall()

            for row in rows:

                enriched["esiwell"]["recommendations"].append(

                    dict(row)

                )

        ########################################################
        # Canonical Patient State
        ########################################################

        enriched["esiwell"]["patient_state"] = self.state.build(
            enriched
        )

        ########################################################

        return enriched


_runtime = None


def get_enricher():

    global _runtime

    if _runtime is None:

        _runtime = EsiWellEnricher()

    return _runtime

