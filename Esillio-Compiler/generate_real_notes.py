import random
import torch
from transformers import Gemma4Processor, Gemma4ForConditionalGeneration

MODEL="/workspace/models/gemma4"

processor = Gemma4Processor.from_pretrained(MODEL)

model = Gemma4ForConditionalGeneration.from_pretrained(
    MODEL,
    torch_dtype=torch.bfloat16,
    device_map="auto"
)

with open("notes.txt") as f:
    categories = [x.strip() for x in f if x.strip()]

TOTAL = 100

with open("real_notes.txt","w") as out:

    for i in range(TOTAL):

        category = random.choice(categories)

        messages = [
            {
                "role":"system",
                "content":[
                    {
                        "type":"text",
                        "text":
                        "Generate ONE realistic patient health note. "
                        "Do not produce JSON. "
                        "Write exactly one sentence."
                    }
                ]
            },
            {
                "role":"user",
                "content":[
                    {
                        "type":"text",
                        "text":f"Category: {category}"
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
            max_new_tokens=80,
            do_sample=True,
            temperature=0.9,
            top_p=0.95
        )

        answer = processor.decode(
            outputs[0][inputs["input_ids"].shape[-1]:],
            skip_special_tokens=True
        ).strip()

        answer = answer.replace("\n"," ")

        out.write(answer + "\n")

        print(f"{i+1}/{TOTAL}")
