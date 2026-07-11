"""
builder.validate

Validates the generated EsiWell knowledge database.
"""

import sqlite3

from builder.config import DATABASE


def validate():

    conn = sqlite3.connect(DATABASE)
    cur = conn.cursor()

    print("=" * 50)
    print("EsiWell Validation")
    print("=" * 50)

    tables = [
        "metadata",
        "entities",
        "aliases",
        "relationships",
        "rules",
        "references_db",
    ]

    success = True

    for table in tables:

        try:
            count = cur.execute(
                f"SELECT COUNT(*) FROM {table}"
            ).fetchone()[0]

            print(f"{table:20} : {count}")

        except Exception as e:

            success = False
            print(f"{table:20} : ERROR ({e})")

    print("=" * 50)

    if success:
        print("Validation PASSED")
    else:
        print("Validation FAILED")

    print("=" * 50)

    conn.close()


if __name__ == "__main__":
    validate()