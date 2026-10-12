
from fastapi import FastAPI

from app.core.config import get_settings

settings = get_settings()

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="Backend API for the Moadian tax invoice platform",
)


@app.get("/", tags=["System"])
def root():
    return {
        "message": "Welcome to Moadian SaaS API",
        "docs": "/docs",
    }


@app.get("/health", tags=["System"])
def health_check():
    return {
        "status": "ok",
        "message": "Moadian SaaS backend is running",
        "environment": settings.environment,
    }
