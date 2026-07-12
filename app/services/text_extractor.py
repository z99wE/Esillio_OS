from pathlib import Path


class TextExtractor:

    def extract(self, filepath: str) -> str:

        suffix = Path(filepath).suffix.lower()

        if suffix == ".txt":
            with open(filepath, "r", encoding="utf-8") as f:
                return f.read()

        return ""