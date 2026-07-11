"""
EsiWell Forge Configuration
"""

from pathlib import Path

ROOT = Path(__file__).resolve().parent

ARTIFACTS = ROOT / "artifacts"
CACHE = ROOT / "cache"
DATASETS = ROOT / "datasets"
OUTPUT = ROOT / "output"

DATABASE = ARTIFACTS / "esiwell.db"

KNOWLEDGE_VERSION = "2026.1"
BUILD_NAME = "EsiWell"
BUILD_AUTHOR = "Esillio"

for directory in (
    ARTIFACTS,
    CACHE,
    DATASETS,
    OUTPUT,
):
    directory.mkdir(parents=True, exist_ok=True)