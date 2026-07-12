import json
import torch
from transformers import Gemma4Processor, Gemma4ForConditionalGeneration

MODEL = "/workspace/models/gemma4"

processor = Gemma4Processor.from_pretrained(MODEL)

model = Gemma4ForConditionalGeneration.from_pretrained(
    MODEL,
    torch_dtype=torch.bfloat16,
    device_map="auto"
)

messages = [
    {
        "role": "system",
        "content": [
            {
                "type": "text",
                "text": (
                    "You are the Esillio Biological Continuity Compiler.\n"
                    "Convert the user's health note into ONLY valid JSON.\n"
                    "Do not explain anything.\n"
                    "Return one JSON object with this schema:\n\n"
                    "{\n"
                    '  "event_type": "",\n'
                    '  "timestamp": null,\n'
                    '  "source": "synthetic",\n'
                    '  "confidence": 1.0,\n'
                    '  "entities": {\n'
                    '    "medications": [],\n'
                    '    "biomarkers": [],\n'
                    '    "conditions": [],\n'
                    '    "symptoms": [],\n'
                    '    "activities": [],\n'
                    '    "nutrition": []\n'
                    "  },\n"
                    '  "relationships": []\n'
                    "}"
                )
            }
        ]
    },
    {
        "role": "user",
        "content": [
            {
                "type": "text",
                "text": "Started Metformin 500 mg twice daily."
            }
        ]
    }
]

inputs = processor.apply_chat_template(
    messages,
    tokenize=True,
    return_dict=True,
    return_tensors="pt"
).to(model.device)

outputs = model.generate(
    **inputs,
    max_new_tokens=256,
    do_sample=False
)

response = processor.decode(
    outputs[0][inputs["input_ids"].shape[-1]:],
    skip_special_tokens=True
)

print("\n===== MODEL OUTPUT =====\n")
print(response)

