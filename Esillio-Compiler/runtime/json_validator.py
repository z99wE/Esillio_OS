import json

def extract_json(text):
    """
    Extract the first valid JSON object from model output.
    Returns a Python dictionary or None.
    """

    start = text.find("{")
    end = text.rfind("}")

    if start == -1 or end == -1:
        return None

    candidate = text[start:end + 1]

    try:
        return json.loads(candidate)
    except Exception:
        return None
