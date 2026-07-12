import pandas as pd
from datasets import Dataset
from transformers import (
    AutoTokenizer,
    AutoModelForSequenceClassification,
    Trainer,
    TrainingArguments,
)

MODEL = "google/bert_uncased_L-2_H-128_A-2"

df = pd.read_csv("training/compiler_training.csv")

# Keep only rows that have an event type
df = df[df["event_type"].notna()].copy()

labels = sorted(df["event_type"].unique())
label2id = {v: i for i, v in enumerate(labels)}
id2label = {i: v for v, i in label2id.items()}

df["label"] = df["event_type"].map(label2id)

dataset = Dataset.from_pandas(df[["text", "label"]])

tokenizer = AutoTokenizer.from_pretrained(MODEL)

def tokenize(batch):
    return tokenizer(
        batch["text"],
        truncation=True,
        padding="max_length",
        max_length=128,
    )

dataset = dataset.map(tokenize, batched=True)

model = AutoModelForSequenceClassification.from_pretrained(
    MODEL,
    num_labels=len(labels),
    id2label=id2label,
    label2id=label2id,
)

args = TrainingArguments(
    output_dir="artifacts/checkpoints",
    per_device_train_batch_size=8,
    num_train_epochs=10,
    learning_rate=2e-5,
    logging_steps=5,
    save_strategy="epoch",
    report_to="none",
)

trainer = Trainer(
    model=model,
    args=args,
    train_dataset=dataset,
)

trainer.train()

model.save_pretrained("artifacts/esillio_compiler")
tokenizer.save_pretrained("artifacts/esillio_compiler")

print("Training complete.")
