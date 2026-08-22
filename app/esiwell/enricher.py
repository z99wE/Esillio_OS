"""
EsiWell™

Runtime Enrichment Engine

This layer enriches extracted medical records using the
compiled EsiWell knowledge database.

It is intentionally provider-independent and CPU-only.
"""

import sqlite3

from .loader import get_loader
from .state import get_state_engine


class EsiWellEnricher:

    def __init__(self):

        self.db = get_loader()

        self.state = get_state_engine()

    ############################################################

    def _lookup_rules(
        self,
        cursor,
        entity: str,
    ) -> list:

        return cursor.execute(

            """
            SELECT *

            FROM rules

            WHERE trigger_entity=?

            """,

            (entity,),

        ).fetchall()

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

        ########################################################
        # Knowledge Rules
        #
        # The compiled knowledge database is a build artifact and
        # may be absent in fresh checkouts (e.g. CI). In that case
        # enrichment degrades to a no-op passthrough instead of
        # failing hard.
        ########################################################

        try:

            cursor = self.db.cursor()

            ####################################################
            # Medication Rules
            ####################################################

            for medication in record.get(
                "medications",
                [],
            ):

                for row in self._lookup_rules(
                    cursor,
                    medication,
                ):

                    enriched["esiwell"]["rules"].append(

                        dict(row)

                    )

            ####################################################
            # Biomarker Rules
            ####################################################

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

                for row in self._lookup_rules(
                    cursor,
                    name,
                ):

                    enriched["esiwell"]["recommendations"].append(

                        dict(row)

                    )

        except sqlite3.OperationalError:

            pass

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
