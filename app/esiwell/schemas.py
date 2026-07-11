from pydantic import BaseModel

class HealthNote(BaseModel):
    text: str
