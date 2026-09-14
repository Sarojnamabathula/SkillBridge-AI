from pydantic import BaseModel
from typing import List, Optional

class RoadmapSkillItem(BaseModel):
    skill_name: str
    category: str
    priority: str # CRITICAL, HIGH, MEDIUM, OPTIONAL
    target_proficiency: str
    prerequisites: List[str] = []
    suggested_practice: str
    estimated_hours: int
    user_status: str = "NOT_STARTED" # NOT_STARTED, LEARNING, COMPLETED

class RoadmapPhase(BaseModel):
    phase_number: int
    phase_title: str # e.g. "Phase 1: Foundations & Prerequisites"
    objective: str
    duration_weeks: float
    skills: List[RoadmapSkillItem]

class ProjectRecommendation(BaseModel):
    title: str
    difficulty: str # BEGINNER, INTERMEDIATE, ADVANCED
    skills_practiced: List[str]
    description: str
    learning_outcome: str

class RoadmapOutput(BaseModel):
    total_estimated_weeks: float
    weekly_commitment_hours: int
    phases: List[RoadmapPhase]
    recommended_projects: List[ProjectRecommendation]
