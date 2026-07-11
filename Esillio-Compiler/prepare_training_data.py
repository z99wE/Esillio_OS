import json
import csv

INPUT = "health_ir_dataset_clean.jsonl"
OUTPUT = "training/compiler_training.csv"

rows = []

with open(INPUT, "r") as f:

    for line in f:

        sample = json.loads(line)

        ir = sample["output"]

        entities = ir.get("entities", {})

        meds = entities.get("medications", [])

        medication = ""
        dosage = ""
        frequency = ""

        # Handle multiple possible medication formats
        if meds:

            first = meds[0]

            if isinstance(first, dict):

                medication = first.get("name", "")
                dosage = first.get("dosage", "")
                frequency = first.get("frequency", "")

            elif isinstance(first, str):

                medication = first

        rows.append(
            {
                "text": sample.get("input", ""),
                "event_type": ir.get("event_type", ""),
                "medication": medication,
                "dosage": dosage,
                "frequency": frequency,
            }
        )

with open(OUTPUT, "w", newline="") as f:

    writer = csv.DictWriter(
        f,
        fieldnames=[
            "text",
            "event_type",
            "medication",
            "dosage",
            "frequency",
        ],
    )

    writer.writeheader()

    writer.writerows(rows)

print(f"Saved {len(rows)} examples to {OUTPUT}")
