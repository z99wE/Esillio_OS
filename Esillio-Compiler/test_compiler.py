from pathlib import Path

import pytest
from transformers import pipeline

MODEL_DIR = Path("artifacts/esillio_compiler")

if not MODEL_DIR.exists():
    pytest.skip("Local compiler artifact not present; skipping integration smoke test.", allow_module_level=True)

classifier = pipeline(
    "text-classification",
    model=str(MODEL_DIR),
    tokenizer=str(MODEL_DIR)
)

examples = [
    "Started Metformin 500 mg twice daily.",
    "Patient reports severe headache.",
    "Walked 6 km today.",
    "HbA1c increased to 7.4%.",
    "Blood pressure measured at 150 over 90."
]

for text in examples:
    print("=" * 60)
    print(text)
    print(classifier(text))
