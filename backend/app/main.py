"""FastAPI application entry point."""

import os
from pathlib import Path

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from app.config import settings
from app.database import Base, engine
from app.routers import patient, doctor

# Create database tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Healthcare AI chatbot — patients ask, Gemini drafts, doctors approve.",
)

# ── CORS ────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "http://localhost:3000", "http://localhost:8000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ─────────────────────────────────────────────────────────────
app.include_router(patient.router)
app.include_router(doctor.router)

# ── Serve React Frontend ────────────────────────────────────────────────
# Path to the React build folder (one level up from backend/)
BUILD_DIR = Path(__file__).resolve().parent.parent.parent / "frontend" / "build"

if BUILD_DIR.exists():
    # Serve static assets (JS, CSS, images) at /static
    app.mount("/static", StaticFiles(directory=str(BUILD_DIR / "static")), name="static")

    @app.get("/", include_in_schema=False)
    async def serve_root():
        return FileResponse(str(BUILD_DIR / "index.html"))

    @app.get("/{full_path:path}", include_in_schema=False)
    async def serve_spa(request: Request, full_path: str):
        """Serve React SPA — return index.html for all non-API routes."""
        # Don't intercept API or docs routes
        if full_path.startswith(("api/", "docs", "redoc", "openapi.json")):
            return None
        # Try to serve the exact file if it exists (e.g., favicon, manifest)
        file_path = BUILD_DIR / full_path
        if file_path.is_file():
            return FileResponse(str(file_path))
        # Otherwise serve index.html for client-side routing
        return FileResponse(str(BUILD_DIR / "index.html"))
else:
    @app.get("/", tags=["Health"])
    def root():
        return {
            "project": settings.PROJECT_NAME,
            "version": settings.VERSION,
            "docs": "/docs",
            "note": "Frontend not built. Run 'npm run build' in frontend/ folder.",
        }
