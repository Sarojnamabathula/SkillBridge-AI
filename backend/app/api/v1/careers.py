from fastapi import APIRouter, HTTPException
from typing import List
from app.schemas.career import CareerProfile
from app.services.career_service import career_service

router = APIRouter()

@router.get("/careers", response_model=List[CareerProfile])
def list_careers():
    """Retrieve catalog of structured career profiles."""
    return career_service.get_all_careers()

@router.get("/careers/{career_id}", response_model=CareerProfile)
def get_career(career_id: str):
    """Retrieve detailed skill requirements for a specific career."""
    career = career_service.get_career_by_id(career_id)
    if not career:
        raise HTTPException(
            status_code=44,
            detail=f"Career with ID or name '{career_id}' not found."
        )
    return career
