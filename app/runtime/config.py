from pathlib import Path
import torch

# -------------------------------------------------------
# Local Gemma Runtime Configuration
# -------------------------------------------------------

MODEL_PATH = Path("/workspace/models/gemma4")

DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

DTYPE = torch.bfloat16

MAX_NEW_TOKENS = 1024

TEMPERATURE = 0.1

TOP_P = 0.9

DO_SAMPLE = False

MODEL_NAME = "google/gemma-4-E4B-it"

# Fallbacks if DB is missing
AI_PROVIDER = "openai"
OPENAI_API_KEY = ""
OPENAI_BASE_URL = "https://api.openai.com/v1"
OPENAI_MODEL = "gpt-4o"