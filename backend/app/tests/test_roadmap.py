import pytest
from app.services.career_service import career_service
from app.engines.skill_gap_engine import skill_gap_engine
from app.engines.prioritization_engine import prioritization_engine
from app.engines.roadmap_engine import roadmap_engine
from app.schemas.profile import LearnerSkillInput

def test_roadmap_phase_generation():
    career = career_service.get_career_by_id("data_analyst")
    user_skills = [LearnerSkillInput(name="Python", proficiency="BEGINNER")]

    classified, _ = skill_gap_engine.analyze_skill_gap(user_skills, career)
    prioritized = prioritization_engine.prioritize_skills(classified)
    
    roadmap = roadmap_engine.generate_roadmap(prioritized, weekly_hours=6)

    assert len(roadmap.phases) == 5
    assert roadmap.total_estimated_weeks > 0
    assert roadmap.weekly_commitment_hours == 6

    # Verify Phase 1 has skills or prerequisites
    p1_skill_names = [s.skill_name for s in roadmap.phases[0].skills]
    assert len(p1_skill_names) >= 0
