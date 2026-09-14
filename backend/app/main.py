from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config.settings import settings
from app.api.v1 import health, careers, skills, analysis, auth, dashboard
from app.models import db_models
from app.utils.db import engine, Base

# Create database tables if they do not exist
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="SkillBridge AI - An AI-Powered Personalized Learning and Career Skill Gap Analyzer"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(health.router, prefix=settings.API_V1_STR, tags=["Health"])
app.include_router(auth.router, prefix=settings.API_V1_STR, tags=["Authentication"])
app.include_router(careers.router, prefix=settings.API_V1_STR, tags=["Careers"])
app.include_router(skills.router, prefix=settings.API_V1_STR, tags=["Skills"])
app.include_router(analysis.router, prefix=settings.API_V1_STR, tags=["Analysis & Progress"])
app.include_router(dashboard.router, prefix=settings.API_V1_STR, tags=["Dashboard & Analytics"])

@app.get("/")
def root():
    return {
        "message": f"Welcome to {settings.PROJECT_NAME} API!",
        "docs_url": "/docs",
        "health_check": f"{settings.API_V1_STR}/health"
    }
