from pydantic import BaseModel
from typing import List, Optional

class CareerSkill(BaseModel):
    name: str
    category: str
    importance: str # CRITICAL, HIGH, MEDIUM, OPTIONAL
    required_level: str # BEGINNER, INTERMEDIATE, ADVANCED
    prerequisites: List[str] = []
    essential: bool = True
    description: str = ""

class CareerProfile(BaseModel):
    career_id: str
    name: str
    description: str
    category: str
    skills: List[CareerSkill]
