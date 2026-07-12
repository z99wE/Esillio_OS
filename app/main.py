from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings

from app.api.routes import router
from app.api.events import router as event_router
from app.api.compiler import router as compiler_router
from app.api.upload import router as upload_router
from app.api.timeline import router as timeline_router
from app.api.clinical_memory import router as clinical_memory_router
from app.api.settings import router as settings_router
from app.esiwell.router import router as esiwell_router
from app.api.auth import auth_router

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.VERSION,
    description=settings.DESCRIPTION,
)

############################################################
# CORS
# allow_origins=["*"] with allow_credentials=True is rejected
# by browsers when the frontend is on a different origin.
# Enumerate real origins explicitly.
############################################################

_ALLOWED_ORIGINS = [
    "http://localhost:5173",    # Vite dev
    "http://localhost:3000",    # fallback dev
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
    # Add your production domain here, e.g.:
    # "https://esillio.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=_ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

############################################################
# API Routers
############################################################

app.include_router(router)
app.include_router(event_router)
app.include_router(compiler_router)
app.include_router(upload_router)
app.include_router(timeline_router)
app.include_router(clinical_memory_router)
app.include_router(settings_router)
app.include_router(esiwell_router)
app.include_router(auth_router, prefix="/api/auth", tags=["auth"])

############################################################
# Root Health Check
############################################################

@app.get("/")
def root():
    return {
        "application": settings.APP_NAME,
        "version": settings.VERSION,
        "status": "running",
    }


@app.get("/health")
def health_check():
    """
    Detailed health check — verifies DB and AI runtime are reachable.
    Used by deployment platforms and the frontend status indicator.
    """
    from app.storage.database import database
    from app.runtime.engine import get_runtime

    db_ok = False
    ai_provider = "unknown"
    ai_ready = False

    try:
        database.connection.execute("SELECT 1")
        db_ok = True
    except Exception:
        pass

    try:
        runtime = get_runtime()
        ai_provider = runtime.provider.__class__.__name__
        ai_ready = ai_provider != "_StubProvider"
    except Exception:
        pass

    return {
        "status": "healthy" if db_ok else "degraded",
        "database": "ok" if db_ok else "error",
        "ai_provider": ai_provider,
        "ai_ready": ai_ready,
    }