from transformers import pipeline
from pathlib import Path

MODEL_DIR = Path(__file__).parent / "model"

classifier = pipeline(
    "text-classification",
    model=str(MODEL_DIR),
    tokenizer=str(MODEL_DIR)
)

def compile_note(note: str):

    result = classifier(note)[0]

    return {
        "input": note,
        "prediction": result["label"],
        "confidence": float(result["score"])
    }
