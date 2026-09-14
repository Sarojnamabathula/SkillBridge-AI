import uuid
import datetime
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List, Dict, Optional

from app.schemas.profile import LearnerProfileCreate, LearnerSkillInput
from app.schemas.analysis import (
    AnalysisResponse,
    ProgressUpdateRequest,
    ProgressUpdateResponse,
    ClassifiedSkillItem
)
from app.services.career_service import career_service
from app.services.skill_normalization_service import normalization_service
from app.services.skill_extraction_service import skill_extraction_service
from app.services.ai_service import ai_service
from app.engines.skill_gap_engine import skill_gap_engine
from app.engines.prioritization_engine import prioritization_engine
from app.engines.roadmap_engine import roadmap_engine
from app.engines.project_engine import project_engine

from app.utils.db import get_db
from app.utils.auth import get_current_user_optional
from app.models.db_models import AnalysisSessionModel, ProgressRecordModel, UserModel

router = APIRouter()

@router.post("/analyze", response_model=AnalysisResponse)
def analyze_learner_skills(
    profile: LearnerProfileCreate,
    current_user: Optional[UserModel] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    """Perform deterministic skill gap analysis and generate a personalized learning roadmap."""
    # 1. Retrieve career profile
    career = career_service.get_career_by_id(profile.career_goal)
    if not career:
        raise HTTPException(
            status_code=404,
            detail=f"Selected career goal '{profile.career_goal}' was not found."
        )

    # 2. Collect current skills from explicit inputs + optional text background
    combined_user_skills: List[LearnerSkillInput] = list(profile.current_skills)

    if profile.free_text_background and profile.free_text_background.strip():
        extracted = skill_extraction_service.extract_skills_from_text(profile.free_text_background)
        existing_names = {s.name.lower() for s in combined_user_skills}
        for ext_skill in extracted:
            if ext_skill.lower() not in existing_names:
                combined_user_skills.append(
                    LearnerSkillInput(name=ext_skill, proficiency="BEGINNER")
                )

    # 3. Execute deterministic skill gap engine
    classified_skills, summary = skill_gap_engine.analyze_skill_gap(
        user_skills_input=combined_user_skills,
        career=career
    )

    # 4. Execute prioritization engine
    prioritized_skills = prioritization_engine.prioritize_skills(classified_skills)

    # Filter into classification lists
    existing_list = [item for item in prioritized_skills if item.classification == "EXISTING"]
    improvement_list = [item for item in prioritized_skills if item.classification == "NEEDS_IMPROVEMENT"]
    missing_list = [item for item in prioritized_skills if item.classification == "MISSING"]
    optional_list = [item for item in prioritized_skills if item.classification == "OPTIONAL"]

    # 5. Execute roadmap engine
    roadmap = roadmap_engine.generate_roadmap(
        classified_skills=prioritized_skills,
        weekly_hours=profile.available_learning_time
    )

    # 6. Execute project engine
    projects = project_engine.recommend_projects(
        career_id=career.career_id,
        classified_skills=prioritized_skills,
        experience_level=profile.experience_level
    )
    roadmap.recommended_projects = projects

    # 7. Generate session ID and save record
    analysis_id = str(uuid.uuid4())
    now_str = datetime.datetime.now(datetime.timezone.utc).isoformat()

    response = AnalysisResponse(
        analysis_id=analysis_id,
        created_at=now_str,
        career_id=career.career_id,
        career_name=career.name,
        learner_profile_summary={
            "education_level": profile.education_level,
            "field_of_study": profile.field_of_study or "N/A",
            "experience_level": profile.experience_level,
            "available_learning_time": f"{profile.available_learning_time} hours/week",
            "career_goal": career.name,
            "narrative": ai_service.generate_roadmap_narrative(career.name, summary.readiness_percentage)
        },
        summary=summary,
        existing_skills=existing_list,
        needs_improvement_skills=improvement_list,
        missing_skills=missing_list,
        optional_skills=optional_list,
        roadmap=roadmap,
        ai_disclaimer="SkillBridge AI provides learning guidance and decision support. Skill levels and progress reflect user-reported estimates and are not independent employment verification."
    )

    # Save to Database
    try:
        session_record = AnalysisSessionModel(
            id=analysis_id,
            user_id=current_user.id if current_user else None,
            created_at=datetime.datetime.now(datetime.timezone.utc),
            education_level=profile.education_level,
            field_of_study=profile.field_of_study,
            experience_level=profile.experience_level,
            career_id=career.career_id,
            available_hours=profile.available_learning_time,
            learner_profile_data=profile.model_dump(),
            analysis_result_data=response.model_dump(),
            progress_status_data={}
        )
        db.add(session_record)
        db.commit()
    except Exception:
        db.rollback()

    return response


@router.get("/analysis/{analysis_id}", response_model=AnalysisResponse)
def get_analysis_session(analysis_id: str, db: Session = Depends(get_db)):
    """Retrieve saved analysis session by ID."""
    session_record = db.query(AnalysisSessionModel).filter(AnalysisSessionModel.id == analysis_id).first()
    if not session_record:
        raise HTTPException(
            status_code=404,
            detail=f"Analysis session '{analysis_id}' not found."
        )
    return AnalysisResponse(**session_record.analysis_result_data)


@router.post("/progress", response_model=ProgressUpdateResponse)
def update_progress(payload: ProgressUpdateRequest, db: Session = Depends(get_db)):
    """Update learner skill progress status (NOT_STARTED, LEARNING, COMPLETED) and regenerate roadmap."""
    session_record = db.query(AnalysisSessionModel).filter(AnalysisSessionModel.id == payload.analysis_id).first()
    if not session_record:
        raise HTTPException(
            status_code=404,
            detail=f"Analysis session '{payload.analysis_id}' not found."
        )

    analysis_data = session_record.analysis_result_data
    career = career_service.get_career_by_id(session_record.career_id)

    # Re-run roadmap engine with updated user status map
    all_classified: List[ClassifiedSkillItem] = []
    for section in ["existing_skills", "needs_improvement_skills", "missing_skills", "optional_skills"]:
        for item in analysis_data.get(section, []):
            all_classified.append(ClassifiedSkillItem(**item))

    updated_roadmap = roadmap_engine.generate_roadmap(
        classified_skills=all_classified,
        weekly_hours=session_record.available_hours,
        user_status_map=payload.skill_statuses
    )

    # Projects remain preserved
    updated_roadmap.recommended_projects = [
        p for p in analysis_data.get("roadmap", {}).get("recommended_projects", [])
    ]

    # Calculate overall completion progress percentage
    total_skills = len(all_classified)
    completed_skills = sum(1 for status in payload.skill_statuses.values() if status == "COMPLETED")
    progress_pct = round((completed_skills / max(1, total_skills)) * 100, 1)

    # Save progress record
    now_str = datetime.datetime.now(datetime.timezone.utc).isoformat()
    session_record.progress_status_data = payload.skill_statuses
    db.commit()

    return ProgressUpdateResponse(
        analysis_id=payload.analysis_id,
        updated_at=now_str,
        progress_percentage=progress_pct,
        updated_roadmap=updated_roadmap
    )


@router.get("/progress/{analysis_id}")
def get_progress(analysis_id: str, db: Session = Depends(get_db)):
    """Retrieve learner progress tracking record."""
    session_record = db.query(AnalysisSessionModel).filter(AnalysisSessionModel.id == analysis_id).first()
    if not session_record:
        raise HTTPException(
            status_code=404,
            detail=f"Analysis session '{analysis_id}' not found."
        )
    return {
        "analysis_id": analysis_id,
        "skill_statuses": session_record.progress_status_data or {}
    }
