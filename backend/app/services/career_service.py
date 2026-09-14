import json
import os
from typing import List, Optional, Dict
from app.schemas.career import CareerProfile, CareerSkill

class CareerService:
    def __init__(self, data_path: str = None):
        if data_path is None:
            base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            data_path = os.path.join(base_dir, "data", "careers.json")
            
        self.careers: Dict[str, CareerProfile] = {}
        self._load_careers(data_path)

    def _load_careers(self, path: str):
        if os.path.exists(path):
            with open(path, "r", encoding="utf-8") as f:
                data = json.load(f)
                for item in data:
                    profile = CareerProfile(**item)
                    self.careers[profile.career_id] = profile

    def get_all_careers(self) -> List[CareerProfile]:
        return list(self.careers.values())

    def get_career_by_id(self, career_id: str) -> Optional[CareerProfile]:
        if career_id in self.careers:
            return self.careers[career_id]
        
        # Try matching by normalized name
        cleaned_search = career_id.lower().replace("-", "_").replace(" ", "_")
        for cid, profile in self.careers.items():
            if cid == cleaned_search or profile.name.lower() == career_id.lower():
                return profile
        return None

career_service = CareerService()
