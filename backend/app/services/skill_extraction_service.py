import re
from typing import List, Set
from app.services.skill_normalization_service import normalization_service

class SkillExtractionService:
    def __init__(self):
        self.norm_service = normalization_service

    def extract_skills_from_text(self, text: str) -> List[str]:
        if not text or not text.strip():
            return []

        found_skills: Set[str] = set()
        cleaned_text = " " + text.lower() + " "

        # 1. Match against known reverse_map entries
        for alias_key, canonical in self.norm_service.reverse_map.items():
            # Use regex word boundaries where appropriate to avoid false positives inside words
            # Special escape for chars like +, #, &
            escaped_alias = re.escape(alias_key)
            pattern = r'(?:^|[^\w])' + escaped_alias + r'(?:[^\w]|$)'
            
            if re.search(pattern, cleaned_text):
                found_skills.add(canonical)

        return sorted(list(found_skills))

skill_extraction_service = SkillExtractionService()
