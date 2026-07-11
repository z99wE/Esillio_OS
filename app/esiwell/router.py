from fastapi import APIRouter

from .schemas import HealthNote
from .compiler import compile_note

router = APIRouter(
    prefix="/esiwell",
    tags=["EsiWell"]
)

@router.post("/compile")
def compile_health_note(note: HealthNote):

    return compile_note(note.text)
