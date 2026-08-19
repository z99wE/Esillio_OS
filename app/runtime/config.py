import os

# -------------------------------------------------------
# Runtime Configuration (Lightweight)
# -------------------------------------------------------

MAX_NEW_TOKENS = 1024

TEMPERATURE = 0.1

TOP_P = 0.9

DO_SAMPLE = False

# Local proxy defaults
LOCAL_BASE_URL = os.getenv("LOCAL_BASE_URL", "http://host.docker.internal:11434/v1")
LOCAL_MODEL = os.getenv("LOCAL_MODEL", "gemma")
LOCAL_API_KEY = os.getenv("LOCAL_API_KEY", "local")
AI_PROVIDER = os.getenv("AI_PROVIDER", "openai")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
OPENAI_API_KEYS = [
    key.strip()
    for key in os.getenv("OPENAI_API_KEYS", "").split(",")
    if key.strip()
]
OPENAI_BASE_URL = os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1")
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o")

# Fallbacks if DB is missing
DEFAULT_DAILY_CREDITS = int(os.getenv("FREE_DAILY_CREDITS", "5"))
