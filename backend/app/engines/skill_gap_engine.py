from typing import List, Dict, Tuple
from app.schemas.career import CareerProfile, CareerSkill
from app.schemas.profile import LearnerSkillInput
from app.schemas.analysis import ClassifiedSkillItem, SkillGapSummary
from app.services.skill_normalization_service import normalization_service

PROFICIENCY_WEIGHTS = {
    "BEGINNER": 1,
    "INTERMEDIATE": 2,
    "ADVANCED": 3
}

class SkillGapEngine:
    def __init__(self):
        self.norm_service = normalization_service

    def analyze_skill_gap(
        self,
        user_skills_input: List[LearnerSkillInput],
        career: CareerProfile
    ) -> Tuple[List[ClassifiedSkillItem], SkillGapSummary]:
        # 1. Map user skills by normalized name -> proficiency level
        user_skills_map: Dict[str, str] = {}
        for item in user_skills_input:
            norm_name = self.norm_service.normalize_skill(item.name)
            prof = item.proficiency.upper() if item.proficiency else "BEGINNER"
            user_skills_map[norm_name] = prof

        classified_items: List[ClassifiedSkillItem] = []
        
        existing_count = 0
        improvement_count = 0
        missing_count = 0
        optional_count = 0

        # 2. Evaluate each skill in the career profile
        for req_skill in career.skills:
            norm_req_name = self.norm_service.normalize_skill(req_skill.name)
            
            user_prof = user_skills_map.get(norm_req_name, None)
            
            # Also check if any alias maps to this skill
            if user_prof is None:
                for u_skill, u_level in user_skills_map.items():
                    if self.norm_service.normalize_skill(u_skill) == norm_req_name:
                        user_prof = u_level
                        break

            req_weight = PROFICIENCY_WEIGHTS.get(req_skill.required_level.upper(), 2)
            
            if user_prof is not None:
                user_weight = PROFICIENCY_WEIGHTS.get(user_prof.upper(), 1)
                
                if user_weight >= req_weight:
                    classification = "EXISTING"
                    existing_count += 1
                    explanation = f"You possess '{req_skill.name}' at the recommended level ({req_skill.required_level})."
                else:
                    classification = "NEEDS_IMPROVEMENT"
                    improvement_count += 1
                    explanation = f"You have baseline experience in '{req_skill.name}' ({user_prof}), but the role requires {req_skill.required_level} level."
            else:
                user_prof = "NOT_POSSESSED"
                if req_skill.essential and req_skill.importance != "OPTIONAL":
                    classification = "MISSING"
                    missing_count += 1
                    explanation = f"'{req_skill.name}' is an essential skill required for {career.name} but was not found in your current profile."
                else:
                    classification = "OPTIONAL"
                    optional_count += 1
                    explanation = f"'{req_skill.name}' is an optional or advanced specialization skill for {career.name}."

            classified_items.append(
                ClassifiedSkillItem(
                    skill_name=req_skill.name,
                    category=req_skill.category,
                    priority=req_skill.importance,
                    classification=classification,
                    required_level=req_skill.required_level,
                    current_level=user_prof if user_prof != "NOT_POSSESSED" else "None",
                    explanation=explanation,
                    prerequisites=req_skill.prerequisites
                )
            )

        # Calculate readiness percentage
        total_essential = sum(1 for item in career.skills if item.essential)
        if total_essential > 0:
            readiness = round(((existing_count + (improvement_count * 0.5)) / total_essential) * 100, 1)
            readiness = min(100.0, max(0.0, readiness))
        else:
            readiness = 100.0

        summary = SkillGapSummary(
            total_required=len(career.skills),
            existing_count=existing_count,
            needs_improvement_count=improvement_count,
            missing_count=missing_count,
            optional_count=optional_count,
            readiness_percentage=readiness
        )

        return classified_items, summary

skill_gap_engine = SkillGapEngine()
