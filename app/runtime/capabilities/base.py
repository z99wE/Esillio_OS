from typing import Any
from pydantic import BaseModel


class BaseCapability(BaseModel):
    """
    Base class for LLM-backed structured capabilities.

    Subclasses receive an LLM-capable client via the ``llm`` field and use
    ``self.llm.invoke(...)`` for structured generation.
    """

    llm: Any = None
