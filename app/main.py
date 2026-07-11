from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings

from app.api.routes import router
from app.api.events import router as event_router
from app.api.compiler import router as compiler_router
from app.api.upload import router as upload_router
from app.api.timeline import router as timeline_router

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.VERSION,
    description=settings.DESCRIPTION,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)
app.include_router(event_router)
app.include_router(compiler_router)
app.include_router(upload_router)
app.include_router(timeline_router)