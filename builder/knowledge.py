"""
builder.knowledge

Seeds the EsiWell SQLite knowledge base with a small curated
offline knowledge pack.

This is Version 1 of Forge.
"""

import sqlite3

from builder.config import DATABASE


SEED_ENTITIES = [
    ("HbA1c", "Biomarker", "Average blood glucose over ~3 months"),
    ("Glucose", "Biomarker", "Blood glucose concentration"),
    ("Vitamin D", "Biomarker", "Vitamin D status"),
    ("Ferritin", "Biomarker", "Iron storage marker"),
    ("Hemoglobin", "Biomarker", "Oxygen carrying protein"),
    ("LDL Cholesterol", "Biomarker", "Low density lipoprotein"),
    ("HDL Cholesterol", "Biomarker", "High density lipoprotein"),
    ("Triglycerides", "Biomarker", "Blood triglyceride level"),
    ("Creatinine", "Biomarker", "Kidney function marker"),
    ("eGFR", "Biomarker", "Estimated kidney filtration"),

    ("Metformin", "Medication", "Type 2 diabetes medication"),
    ("Insulin", "Medication", "Blood glucose lowering hormone"),
    ("Atorvastatin", "Medication", "Cholesterol lowering medication"),
    ("Vitamin D3", "Supplement", "Vitamin D supplement"),
    ("Iron", "Supplement", "Iron supplementation"),
]


def build():

    conn = sqlite3.connect(DATABASE)
    cur = conn.cursor()

    cur.executemany(
        """
        INSERT OR IGNORE INTO entities
        (
            canonical_name,
            category,
            description
        )
        VALUES
        (
            ?,
            ?,
            ?
        )
        """,
        SEED_ENTITIES,
    )

    conn.commit()

    count = cur.execute(
        "SELECT COUNT(*) FROM entities"
    ).fetchone()[0]

    print("=" * 50)
    print("EsiWell Knowledge Builder")
    print("=" * 50)
    print(f"Entities loaded : {count}")
    print("Knowledge database initialized.")
    print("=" * 50)

    conn.close()


if __name__ == "__main__":
    build()