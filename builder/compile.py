"""
EsiWell Forge

SQLite Knowledge Compiler
"""

import sqlite3

from builder.config import DATABASE, KNOWLEDGE_VERSION


def create_database():

    conn = sqlite3.connect(DATABASE)

    cur = conn.cursor()

    ############################################################
    # Metadata
    ############################################################

    cur.execute("""
    CREATE TABLE IF NOT EXISTS metadata(

        key TEXT PRIMARY KEY,

        value TEXT

    )
    """)

    ############################################################
    # Canonical Entities
    ############################################################

    cur.execute("""
    CREATE TABLE IF NOT EXISTS entities(

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        canonical_name TEXT UNIQUE,

        category TEXT,

        description TEXT

    )
    """)

    ############################################################
    # Aliases
    ############################################################

    cur.execute("""
    CREATE TABLE IF NOT EXISTS aliases(

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        entity_id INTEGER,

        alias TEXT

    )
    """)

    ############################################################
    # Relationships
    ############################################################

    cur.execute("""
    CREATE TABLE IF NOT EXISTS relationships(

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        source_entity INTEGER,

        target_entity INTEGER,

        relationship TEXT,

        confidence REAL

    )
    """)

    ############################################################
    # Rules
    ############################################################

    cur.execute("""
    CREATE TABLE IF NOT EXISTS rules(

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        trigger_entity INTEGER,

        action TEXT,

        payload TEXT

    )
    """)

    ############################################################
    # References
    ############################################################

    cur.execute("""
    CREATE TABLE IF NOT EXISTS references_db(

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        entity_id INTEGER,

        source TEXT,

        url TEXT

    )
    """)

    ############################################################
    # Metadata
    ############################################################

    cur.execute(
        """
        INSERT OR REPLACE INTO metadata
        VALUES(?,?)
        """,
        (
            "knowledge_version",
            KNOWLEDGE_VERSION,
        ),
    )

    conn.commit()

    conn.close()

    print("✓ SQLite knowledge database created")


if __name__ == "__main__":

    create_database()