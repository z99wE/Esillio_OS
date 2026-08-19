"""
Esillio Clinical Memory Engine

Maintains the canonical patient state generated from
AI-extracted medical information.
"""

from .clinical_memory import (
    ClinicalMemory,
    get_memory,
    clinical_memory,
)

__version__ = "1.0.0"

__all__ = [
    "ClinicalMemory",
    "get_memory",
    "clinical_memory",
]
