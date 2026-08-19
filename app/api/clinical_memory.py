from fastapi import APIRouter, Depends

from app.memory import get_memory as get_patient_memory
from app.api.auth import get_current_user

router = APIRouter(
    prefix="/memory",
    tags=["Clinical Memory"],
)


@router.get("/")
def get_memory_route(user_id: str = Depends(get_current_user)):
    """
    Returns the complete canonical patient state.
    """
    return {
        "status": "success",
        "memory": get_patient_memory(user_id).current(),
    }


@router.get("/current")
def get_current_memory(user_id: str = Depends(get_current_user)):
    """
    Returns the current patient state.
    """
    return {
        "status": "success",
        "memory": get_patient_memory(user_id).current(),
    }


@router.post("/reset")
def reset_memory(user_id: str = Depends(get_current_user)):
    """
    Clears the in-memory clinical state.

    NOTE:
    This does NOT clear SQLite.
    """

    get_patient_memory(user_id).reset()

    return {
        "status": "success",
        "message": "Clinical memory has been reset.",
    }


@router.get("/export")
def export_memory(user_id: str = Depends(get_current_user)):
    """
    Export the complete clinical memory.
    """

    return {
        "status": "success",
        "memory": get_patient_memory(user_id).current(),
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
