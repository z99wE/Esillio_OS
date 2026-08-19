from typing import Dict, Any

from fastapi import APIRouter, Depends

from app.api.auth import get_current_user
from app.services.usage_service import usage_service

router = APIRouter(prefix="/usage", tags=["Usage"])


@router.get("/current")
def current_usage(user_id: str = Depends(get_current_user)) -> Dict[str, Any]:
    return {
        "status": "success",
        "usage": usage_service.get_usage(user_id),
    }
