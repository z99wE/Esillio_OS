from fastapi import FastAPI
from fastapi import Request
from fastapi.middleware.cors import CORSMiddleware
import logging
import time
from fastapi.responses import JSONResponse

from app.config import settings

# Setup structured logger
logger = logging.getLogger("esillio")
logger.setLevel(logging.INFO)
ch = logging.StreamHandler()
import uuid
import contextvars

request_id_context_var = contextvars.ContextVar("request_id", default="-")

class RequestIdFilter(logging.Filter):
    def filter(self, record):
        record.request_id = request_id_context_var.get()
        return True

logger.addFilter(RequestIdFilter())
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - [ReqID: %(request_id)s] - %(message)s')
ch.setFormatter(formatter)
logger.addHandler(ch)

from app.api.routes import router
from app.api.events import router as event_router
from app.api.compiler import router as compiler_router
from app.api.upload import router as upload_router
from app.api.timeline import router as timeline_router
from app.api.clinical_memory import router as clinical_memory_router
from app.api.settings import router as settings_router
from app.api.usage import router as usage_router
from app.esiwell.router import router as esiwell_router
from app.api.auth import auth_router
from app.api.education import router as education_router
from app.api.admin import router as admin_router

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
    "http://localhost:5173",    # Vite dev (primary)
    "http://localhost:5174",    # Vite dev (secondary port when 5173 is taken)
    "http://localhost:3000",    # fallback dev
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
    "http://127.0.0.1:3000",
]

import os
if os.getenv("FRONTEND_URL"):
    _ALLOWED_ORIGINS.append(os.getenv("FRONTEND_URL"))

cors_env = os.getenv("CORS_ALLOWED_ORIGINS", "")
if cors_env:
    _ALLOWED_ORIGINS.extend([x.strip() for x in cors_env.split(",") if x.strip()])

app.add_middleware(
    CORSMiddleware,
    allow_origins=_ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)


@app.middleware("http")
async def security_headers_and_logging(request: Request, call_next):
    req_id = str(uuid.uuid4())
    request_id_context_var.set(req_id)
    
    start_time = time.time()
    try:
        response = await call_next(request)
    except Exception as exc:
        process_time = time.time() - start_time
        logger.error(f"Tenant isolation / Unhandled error on {request.url.path}: {exc}", exc_info=True)
        return JSONResponse(
            status_code=500,
            content={"detail": "An internal server error occurred."},
        )

    process_time = time.time() - start_time
    logger.info(f"Method: {request.method} Path: {request.url.path} Status: {response.status_code} Time: {process_time:.4f}s")
    
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "no-referrer"
    response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
    response.headers["Cross-Origin-Opener-Policy"] = "same-origin"
    response.headers["X-Request-ID"] = req_id
    return response

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
app.include_router(usage_router)
app.include_router(esiwell_router)
app.include_router(auth_router, prefix="/api/auth", tags=["auth"])
from app.api.export import router as export_router
app.include_router(export_router)
from app.api.intelligence import router as intelligence_router
app.include_router(intelligence_router)
app.include_router(education_router, prefix="/api/education", tags=["education"])
from app.api.tasks import router as tasks_router
app.include_router(tasks_router, prefix="/api/tasks", tags=["tasks"])
from app.api.shares import router as shares_router
app.include_router(shares_router, prefix="/api/shares", tags=["shares"])
app.include_router(admin_router, prefix="/api/admin", tags=["admin"])
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
    db_ok = False
    ai_provider = "unknown"
    ai_ready = False

    try:
        from app.storage.supabase_client import supabase
        if supabase:
            supabase.table("profiles").select("count", count="exact").limit(1).execute()
            db_ok = True
    except Exception:
        pass

    try:
        from app.runtime.engine import get_runtime
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
