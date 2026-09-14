from fastapi import APIRouter
from app.schemas.analysis import SkillExtractionRequest, SkillExtractionResponse
from app.services.skill_extraction_service import skill_extraction_service
from app.services.skill_normalization_service import normalization_service

router = APIRouter()

@router.post("/extract-skills", response_model=SkillExtractionResponse)
def extract_and_normalize_skills(payload: SkillExtractionRequest):
    """Extract candidate skills from free-text descriptions or resume snippets."""
    extracted = skill_extraction_service.extract_skills_from_text(payload.text)
    normalized = normalization_service.normalize_skill_list(extracted)
    return SkillExtractionResponse(
        extracted_skills=extracted,
        normalized_skills=normalized
    )
