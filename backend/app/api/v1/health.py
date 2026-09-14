from fastapi import APIRouter
from app.config.settings import settings
from app.services.ai_service import ai_service

router = APIRouter()

@router.get("/health")
def health_check():
    return {
        "status": "healthy",
        "project": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "ai_active": ai_service.is_ai_active(),
        "ai_provider": settings.AI_PROVIDER
    }
