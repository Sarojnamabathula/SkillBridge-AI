import pytest
from app.services.skill_normalization_service import normalization_service

def test_alias_normalization():
    assert normalization_service.normalize_skill("py") == "Python"
    assert normalization_service.normalize_skill("python programming") == "Python"
    assert normalization_service.normalize_skill("js") == "JavaScript"
    assert normalization_service.normalize_skill("mysql") == "SQL"
    assert normalization_service.normalize_skill("postgresql") == "SQL"
    assert normalization_service.normalize_skill("stats") == "Statistics & Probability"

def test_skill_list_normalization():
    input_list = ["py", "python3", "js", "mysql", "unknown_skill_xyz"]
    normalized = normalization_service.normalize_skill_list(input_list)
    assert "Python" in normalized
    assert "JavaScript" in normalized
    assert "SQL" in normalized
    assert "Unknown_Skill_Xyz" in normalized
