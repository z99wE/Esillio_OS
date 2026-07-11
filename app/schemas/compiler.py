from pydantic import BaseModel


class CompileRequest(BaseModel):

    title: str

    category: str

    source: str

    description: str = ""