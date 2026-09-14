from pydantic import BaseModel, Field
from typing import List, Optional

class LearnerSkillInput(BaseModel):
    name: str
    proficiency: str = Field(
        default="BEGINNER",
        description="BEGINNER, INTERMEDIATE, or ADVANCED"
    )

class LearnerProfileCreate(BaseModel):
    education_level: str = Field(..., json_schema_extra={"example": "B.Tech Computer Science"})
    field_of_study: Optional[str] = Field(None, json_schema_extra={"example": "Computer Science"})
    experience_level: str = Field(..., json_schema_extra={"example": "BEGINNER"}) # BEGINNER, INTERMEDIATE, ADVANCED
    current_skills: List[LearnerSkillInput] = Field(default_factory=list)
    free_text_background: Optional[str] = Field(None, json_schema_extra={"example": "I know Python basics and basic HTML/CSS from coursework."})
    career_goal: str = Field(..., json_schema_extra={"example": "data_analyst"}) # career_id or career_name
    available_learning_time: int = Field(default=6, ge=1, le=50) # hours per week
