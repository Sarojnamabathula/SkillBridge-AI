import json
import os
import re
from typing import Dict, List, Set

class SkillNormalizationService:
    def __init__(self, data_path: str = None):
        if data_path is None:
            base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            data_path = os.path.join(base_dir, "data", "skill_aliases.json")
        
        self.aliases_map: Dict[str, List[str]] = {}
        self.reverse_map: Dict[str, str] = {}
        self.canonical_skills: Set[str] = set()
        
        self._load_aliases(data_path)

    def _load_aliases(self, path: str):
        if os.path.exists(path):
            with open(path, "r", encoding="utf-8") as f:
                self.aliases_map = json.load(f)
                
            for canonical, aliases in self.aliases_map.items():
                self.canonical_skills.add(canonical)
                # Map lowercased canonical to canonical
                self.reverse_map[self._clean_str(canonical)] = canonical
                for alias in aliases:
                    self.reverse_map[self._clean_str(alias)] = canonical

    def _clean_str(self, text: str) -> str:
        text = text.lower().strip()
        text = re.sub(r'[^\w\s\+/\&\.\#-]', '', text)
        return re.sub(r'\s+', ' ', text)

    def normalize_skill(self, skill_name: str) -> str:
        if not skill_name or not skill_name.strip():
            return ""
        
        cleaned = self._clean_str(skill_name)
        
        # 1. Exact match in reverse alias map
        if cleaned in self.reverse_map:
            return self.reverse_map[cleaned]
            
        # 2. Check for exact match ignoring special characters
        for canonical in self.canonical_skills:
            if self._clean_str(canonical) == cleaned:
                return canonical
                
        # 3. Fallback: Return title-cased cleaned version
        return skill_name.strip().title()

    def normalize_skill_list(self, skill_names: List[str]) -> List[str]:
        normalized_set = set()
        for name in skill_names:
            norm = self.normalize_skill(name)
            if norm:
                normalized_set.add(norm)
        return sorted(list(normalized_set))

    def get_aliases_dict() -> Dict[str, List[str]]:
        return self.aliases_map

normalization_service = SkillNormalizationService()
