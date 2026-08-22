"""
Knowledge base and enrichment integrity tests.

These verify that the EsiWell knowledge database builds offline,
carries schema and seed data, and that runtime enrichment degrades
gracefully (never crashes) whether or not rule rows exist.
"""

import sqlite3

import pytest

from app.esiwell.enricher import get_enricher
from builder.config import DATABASE


def _database_ready() -> bool:

    if not DATABASE.exists():

        return False

    try:

        conn = sqlite3.connect(DATABASE)

        tables = {
            row[0]
            for row in conn.execute(
                "SELECT name FROM sqlite_master WHERE type='table'"
            )
        }

        ready = (
            "entities" in tables
            and conn.execute(
                "SELECT COUNT(*) FROM entities"
            ).fetchone()[0] > 0
        )

        conn.close()

        return ready

    except sqlite3.Error:

        return False


@pytest.fixture(scope="module", autouse=True)
def knowledge_base():

    if not _database_ready():

        from builder.build import build as forge_build

        forge_build()


EXPECTED_TABLES = {
    "metadata",
    "entities",
    "aliases",
    "relationships",
    "rules",
    "references_db",
}


def test_knowledge_database_exists():

    assert DATABASE.exists()


def test_knowledge_database_schema():

    conn = sqlite3.connect(DATABASE)

    tables = {
        row[0]
        for row in conn.execute(
            "SELECT name FROM sqlite_master WHERE type='table'"
        )
    }

    conn.close()

    missing = EXPECTED_TABLES - tables

    assert not missing, f"missing tables: {missing}"


def test_knowledge_entities_seeded():

    conn = sqlite3.connect(DATABASE)

    count = conn.execute(
        "SELECT COUNT(*) FROM entities"
    ).fetchone()[0]

    conn.close()

    assert count > 0


def test_enricher_returns_esiwell_block():

    enricher = get_enricher()

    enriched = enricher.enrich(
        {
            "medications": ["Metformin"],
            "biomarkers": ["HbA1c"],
        }
    )

    block = enriched["esiwell"]

    assert block["knowledge_version"]

    assert isinstance(block["rules"], list)

    assert isinstance(block["recommendations"], list)

    assert "patient_state" in block
