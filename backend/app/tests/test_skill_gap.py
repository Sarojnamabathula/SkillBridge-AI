import pytest
from app.services.career_service import career_service
from app.engines.skill_gap_engine import skill_gap_engine
from app.schemas.profile import LearnerSkillInput

def test_demo_data_analyst_gap_analysis():
    # User Profile from prompt: B.Tech CS, Beginner, Skills: Python, Basic SQL, HTML, CSS. Career Goal: Data Analyst
    career = career_service.get_career_by_id("data_analyst")
    assert career is not None

    user_skills = [
        LearnerSkillInput(name="Python", proficiency="INTERMEDIATE"),
        LearnerSkillInput(name="SQL", proficiency="BEGINNER"),
        LearnerSkillInput(name="HTML & CSS", proficiency="INTERMEDIATE")
    ]

    classified, summary = skill_gap_engine.analyze_skill_gap(user_skills, career)

    # Convert results into name->classification map
    gap_map = {item.skill_name: item.classification for item in classified}

    # Python: Required INTERMEDIATE, User has INTERMEDIATE -> EXISTING
    assert gap_map.get("Python") == "EXISTING"

    # SQL: Required INTERMEDIATE, User has BEGINNER -> NEEDS_IMPROVEMENT
    assert gap_map.get("SQL") == "NEEDS_IMPROVEMENT"

    # Statistics & Probability: Required INTERMEDIATE, User doesn't have -> MISSING
    assert gap_map.get("Statistics & Probability") == "MISSING"

    # Data Analysis Libraries: Required INTERMEDIATE, User doesn't have -> MISSING
    assert gap_map.get("Data Analysis Libraries") == "MISSING"

    # Data Visualization: Required INTERMEDIATE, User doesn't have -> MISSING
    assert gap_map.get("Data Visualization") == "MISSING"

    # R: Optional -> OPTIONAL
    assert gap_map.get("R") == "OPTIONAL"

    assert summary.existing_count >= 1
    assert summary.missing_count >= 3
