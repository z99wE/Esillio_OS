from fastapi import APIRouter

from app.memory import clinical_memory

router = APIRouter(
    prefix="/memory",
    tags=["Clinical Memory"],
)


@router.get("/")
def get_memory():
    """
    Returns the complete canonical patient state.
    """
    return {
        "status": "success",
        "memory": clinical_memory.current(),
    }


@router.get("/current")
def get_current_memory():
    """
    Returns the current patient state.
    """
    return {
        "status": "success",
        "memory": clinical_memory.current(),
    }


@router.post("/reset")
def reset_memory():
    """
    Clears the in-memory clinical state.

    NOTE:
    This does NOT clear SQLite.
    """

    clinical_memory.reset()

    return {
        "status": "success",
        "message": "Clinical memory has been reset.",
    }


@router.get("/export")
def export_memory():
    """
    Export the complete clinical memory.
    """

    return {
        "status": "success",
        "memory": clinical_memory.current(),
    }


@router.get("/health")
def memory_health():
    """
    Simple health check for the Clinical Memory Engine.
    """

    return {
        "status": "healthy",
        "initialized": True,
    }