import json

INPUT = "health_ir_dataset.jsonl"
OUTPUT = "health_ir_dataset_clean.jsonl"

count = 0

with open(INPUT) as fin, open(OUTPUT, "w") as fout:

    for line in fin:

        row = json.loads(line)

        text = row["output"]

        text = text.replace("```json", "")
        text = text.replace("```", "")
        text = text.strip()

        try:
            parsed = json.loads(text)

            clean = {
                "input": row["input"],
                "output": parsed
            }

            fout.write(json.dumps(clean) + "\n")
            count += 1

        except Exception:
            pass

print(f"Saved {count} clean records.")
