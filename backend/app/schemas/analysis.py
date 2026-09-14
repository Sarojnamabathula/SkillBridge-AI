from pydantic import BaseModel
from typing import List, Dict, Optional
from app.schemas.profile import LearnerProfileCreate
from app.schemas.roadmap import RoadmapOutput

class ClassifiedSkillItem(BaseModel):
    skill_name: str
    category: str
    priority: str # CRITICAL, HIGH, MEDIUM, OPTIONAL
    classification: str # EXISTING, NEEDS_IMPROVEMENT, MISSING, OPTIONAL
    required_level: str
    current_level: str
    explanation: str
    prerequisites: List[str] = []

class SkillGapSummary(BaseModel):
    total_required: int
    existing_count: int
    needs_improvement_count: int
    missing_count: int
    optional_count: int
    readiness_percentage: float

class AnalysisResponse(BaseModel):
    analysis_id: str
    created_at: str
    career_id: str
    career_name: str
    learner_profile_summary: Dict[str, str]
    summary: SkillGapSummary
    existing_skills: List[ClassifiedSkillItem]
    needs_improvement_skills: List[ClassifiedSkillItem]
    missing_skills: List[ClassifiedSkillItem]
    optional_skills: List[ClassifiedSkillItem]
    roadmap: RoadmapOutput
    ai_disclaimer: str

class SkillExtractionRequest(BaseModel):
    text: str

class SkillExtractionResponse(BaseModel):
    extracted_skills: List[str]
    normalized_skills: List[str]

class ProgressUpdateRequest(BaseModel):
    analysis_id: str
    skill_statuses: Dict[str, str] # e.g. {"Python": "COMPLETED", "SQL": "LEARNING"}

class ProgressUpdateResponse(BaseModel):
    analysis_id: str
    updated_at: str
    progress_percentage: float
    updated_roadmap: RoadmapOutput
