from transformers import pipeline

classifier = pipeline(
    "text-classification",
    model="artifacts/esillio_compiler",
    tokenizer="artifacts/esillio_compiler"
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
