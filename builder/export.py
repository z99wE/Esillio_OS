"""
builder.export

Displays build metadata.
"""

import sqlite3

from builder.config import DATABASE


def export():

    conn = sqlite3.connect(DATABASE)

    cur = conn.cursor()

    print("=" * 50)
    print("EsiWell Build Information")
    print("=" * 50)

    rows = cur.execute(
        "SELECT key,value FROM metadata"
    ).fetchall()

    for key, value in rows:

        print(f"{key:20} : {value}")

    count = cur.execute(
        "SELECT COUNT(*) FROM entities"
    ).fetchone()[0]

    print()

    print(f"Total entities      : {count}")

    print("=" * 50)

    conn.close()


if __name__ == "__main__":
    export()