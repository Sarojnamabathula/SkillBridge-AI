import pytest
from app.services.career_service import career_service
from app.engines.skill_gap_engine import skill_gap_engine
from app.engines.prioritization_engine import prioritization_engine
from app.schemas.profile import LearnerSkillInput

def test_prerequisite_prioritization():
    career = career_service.get_career_by_id("data_analyst")
    user_skills = [LearnerSkillInput(name="SQL", proficiency="BEGINNER")]

    classified, _ = skill_gap_engine.analyze_skill_gap(user_skills, career)
    prioritized = prioritization_engine.prioritize_skills(classified)

    # Check top skills are missing essential/critical skills or prerequisites
    top_skill_names = [item.skill_name for item in prioritized[:3]]
    assert any(s in top_skill_names for s in ["Python", "SQL", "Statistics & Probability"])
