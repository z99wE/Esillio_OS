"""
EsiWell Runtime

Loads the compiled EsiWell knowledge database.

This file is loaded only once during runtime.
"""

from pathlib import Path
import sqlite3

ROOT = Path(__file__).resolve().parent

DB = ROOT.parent.parent / "builder" / "artifacts" / "esiwell.db"


class EsiWellLoader:

    def __init__(self):

        self.connection = sqlite3.connect(
            DB,
            check_same_thread=False,
        )

        self.connection.row_factory = sqlite3.Row

    ############################################################

    def cursor(self):

        return self.connection.cursor()


_loader = None


def get_loader():

    global _loader

    if _loader is None:

        _loader = EsiWellLoader()

    return _loader