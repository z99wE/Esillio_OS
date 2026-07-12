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

SYSTEM_PROMPT = """
You are the Esillio Biological Continuity Compiler.

Convert the following health note into ONLY valid JSON.

Return ONLY JSON.

{
  "event_type":"",
  "timestamp":null,
  "source":"synthetic",
  "confidence":1.0,
  "entities":{
      "medications":[],
      "biomarkers":[],
      "conditions":[],
      "symptoms":[],
      "activities":[],
      "nutrition":[]
  },
  "relationships":[]
}
"""

notes = []

with open("training_notes.txt") as f:
    for line in f:
        line = line.strip()
        if line:
            notes.append(line)

print("Loaded", len(notes), "notes")

with open("health_ir_dataset.jsonl", "w") as out:

    for idx, note in enumerate(notes, start=1):

        messages = [
            {
                "role": "system",
                "content": [
                    {
                        "type": "text",
                        "text": SYSTEM_PROMPT
                    }
                ]
            },
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": note
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

        out.write(json.dumps({
            "input": note,
            "output": response
        }) + "\n")

        if idx % 10 == 0:
            print(f"{idx}/{len(notes)}")

print("Finished.")

