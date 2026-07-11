from fastapi import APIRouter

router = APIRouter()


@router.get("/")
async def root():
    return {
        "product": "Esillio OS",
        "tagline": "Your body remembers.",
        "status": "running"
    }


@router.get("/health")
async def health():
    return {
        "status": "healthy"
    }


@router.get("/version")
async def version():
    return {
        "version": "0.1.0"
    }