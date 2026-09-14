from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_dashboard_stats_endpoint():
    # 1. Run an analysis session
    payload = {
        "education_level": "B.Tech Computer Science",
        "field_of_study": "Computer Science",
        "experience_level": "BEGINNER",
        "current_skills": [
            {"name": "Python", "proficiency": "INTERMEDIATE"},
            {"name": "Basic SQL", "proficiency": "BEGINNER"}
        ],
        "free_text_background": "I know HTML and CSS basics.",
        "career_goal": "data_analyst",
        "available_learning_time": 6
    }
    client.post("/api/v1/analyze", json=payload)

    # 2. Query Dashboard Stats
    res = client.get("/api/v1/dashboard/stats")
    assert res.status_code == 200
    data = res.json()
    assert data["has_data"] is True
    assert data["total_sessions"] >= 1
    assert "overall_readiness_avg" in data
    assert "category_breakdown" in data
