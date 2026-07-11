from typing import Literal

from pydantic import BaseModel, Field


class AISettings(BaseModel):
    """
    User-configurable AI runtime settings.
    """

    provider: Literal[
        "local",
        "openai",
    ] = "local"

    base_url: str = Field(
        default="https://api.openai.com/v1",
    )

    api_key: str = Field(
        default="",
    )

    model: str = Field(
        default="gpt-4.1",
    )