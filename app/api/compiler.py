from fastapi import APIRouter

from app.compiler.compiler import BiologicalContinuityCompiler
from app.schemas.compiler import CompileRequest

router = APIRouter(
    prefix="/compiler",
    tags=["Compiler"],
)

compiler = BiologicalContinuityCompiler()


@router.post("/compile")
async def compile_event(request: CompileRequest):

    event = compiler.compile(request)

    return event