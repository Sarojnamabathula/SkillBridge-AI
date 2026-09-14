from typing import List, Dict
from app.schemas.analysis import ClassifiedSkillItem

IMPORTANCE_SCORE = {
    "CRITICAL": 40,
    "HIGH": 30,
    "MEDIUM": 20,
    "OPTIONAL": 10
}

CLASSIFICATION_SCORE = {
    "MISSING": 30,
    "NEEDS_IMPROVEMENT": 20,
    "OPTIONAL": 5,
    "EXISTING": 0
}

class PrioritizationEngine:
    def prioritize_skills(self, items: List[ClassifiedSkillItem]) -> List[ClassifiedSkillItem]:
        # Count how many other skills depend on each skill as a prerequisite
        prereq_counts: Dict[str, int] = {}
        for item in items:
            for pre in item.prerequisites:
                prereq_counts[pre] = prereq_counts.get(pre, 0) + 1

        def get_sort_key(item: ClassifiedSkillItem) -> float:
            imp = IMPORTANCE_SCORE.get(item.priority, 10)
            cls = CLASSIFICATION_SCORE.get(item.classification, 0)
            block_bonus = prereq_counts.get(item.skill_name, 0) * 15
            return imp + cls + block_bonus

        # Sort descending by priority score
        sorted_items = sorted(items, key=get_sort_key, reverse=True)
        return sorted_items

prioritization_engine = PrioritizationEngine()
