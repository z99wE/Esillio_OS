"""
EsiWell Runtime Engine
"""

from .enricher import get_enricher


class EsiWell:

    def __init__(self):

        self.runtime = get_enricher()

    ########################################################

    def enrich(
        self,
        record: dict,
    ) -> dict:

        return self.runtime.enrich(
            record
        )


_runtime = None


def get_esiwell():

    global _runtime

    if _runtime is None:

        _runtime = EsiWell()

    return _runtime