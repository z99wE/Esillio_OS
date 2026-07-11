"""
builder.optimize

Optimizes the SQLite knowledge database.
"""

import sqlite3

from builder.config import DATABASE


def optimize():

    conn = sqlite3.connect(DATABASE)

    print("=" * 50)
    print("Optimizing SQLite Database")
    print("=" * 50)

    conn.execute("VACUUM")
    conn.execute("ANALYZE")

    conn.commit()
    conn.close()

    print("Optimization complete.")
    print("=" * 50)


if __name__ == "__main__":
    optimize()