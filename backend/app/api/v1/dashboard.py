from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional

from app.utils.db import get_db
from app.utils.auth import get_current_user_optional
from app.models.db_models import AnalysisSessionModel, ProgressRecordModel, UserModel
from app.services.career_service import career_service

router = APIRouter()

@router.get("/dashboard/stats")
def get_dashboard_stats(
    current_user: Optional[UserModel] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    """Retrieve comprehensive monitoring and analytics progress stats for active session or user."""
    query = db.query(AnalysisSessionModel)
    if current_user:
        query = query.filter(AnalysisSessionModel.user_id == current_user.id)
    
    sessions = query.order_by(AnalysisSessionModel.created_at.desc()).all()

    if not sessions:
        return {
            "has_data": False,
            "total_sessions": 0,
            "active_careers": [],
            "overall_readiness_avg": 0.0,
            "total_completed_skills": 0,
            "total_learning_skills": 0,
            "total_missing_skills": 0,
            "category_breakdown": {},
            "session_history": []
        }

    total_sessions = len(sessions)
    readiness_scores = []
    category_counts: Dict[str, Dict[str, int]] = {}
    completed_skills_set = set()
    learning_skills_set = set()
    missing_skills_set = set()
    active_careers_set = set()
    session_history = []

    for s in sessions:
        res_data = s.analysis_result_data or {}
        summary = res_data.get("summary", {})
        c_name = res_data.get("career_name", "Unknown Career")
        active_careers_set.add(c_name)

        readiness = summary.get("readiness_percentage", 0.0)
        readiness_scores.append(readiness)

        # Status Map
        statuses = s.progress_status_data or {}

        # Aggregate skills across missing, improvement, existing
        all_skills = (
            res_data.get("missing_skills", []) +
            res_data.get("needs_improvement_skills", []) +
            res_data.get("existing_skills", []) +
            res_data.get("optional_skills", [])
        )

        for item in all_skills:
            s_name = item.get("skill_name")
            cat = item.get("category", "General")
            classification = item.get("classification")
            
            status = statuses.get(s_name, "COMPLETED" if classification == "EXISTING" else "NOT_STARTED")

            if cat not in category_counts:
                category_counts[cat] = {"total": 0, "completed": 0}
            
            category_counts[cat]["total"] += 1
            
            if status == "COMPLETED":
                completed_skills_set.add(s_name)
                category_counts[cat]["completed"] += 1
            elif status == "LEARNING":
                learning_skills_set.add(s_name)
            elif classification == "MISSING" and status == "NOT_STARTED":
                missing_skills_set.add(s_name)

        session_history.append({
            "analysis_id": s.id,
            "created_at": s.created_at.isoformat() if s.created_at else "",
            "career_id": s.career_id,
            "career_name": c_name,
            "readiness_percentage": readiness,
            "existing_count": summary.get("existing_count", 0),
            "missing_count": summary.get("missing_count", 0),
            "needs_improvement_count": summary.get("needs_improvement_count", 0)
        })

    avg_readiness = round(sum(readiness_scores) / max(1, len(readiness_scores)), 1)

    # Calculate percentages for category breakdown
    category_breakdown = {}
    for cat, counts in category_counts.items():
        tot = counts["total"]
        comp = counts["completed"]
        pct = round((comp / max(1, tot)) * 100, 1)
        category_breakdown[cat] = {
            "total": tot,
            "completed": comp,
            "completion_percentage": pct
        }

    return {
        "has_data": True,
        "total_sessions": total_sessions,
        "active_careers": list(active_careers_set),
        "overall_readiness_avg": avg_readiness,
        "total_completed_skills": len(completed_skills_set),
        "total_learning_skills": len(learning_skills_set),
        "total_missing_skills": len(missing_skills_set),
        "category_breakdown": category_breakdown,
        "session_history": session_history[:10] # Top 10 recent
    }
