from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "project" in data

def test_careers_endpoint():
    response = client.get("/api/v1/careers")
    assert response.status_code == 200
    careers = response.json()
    assert len(careers) >= 7

def test_analyze_endpoint():
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

    response = client.post("/api/v1/analyze", json=payload)
    assert response.status_code == 200
    res = response.json()
    assert "analysis_id" in res
    assert res["career_id"] == "data_analyst"
    assert len(res["missing_skills"]) > 0
    assert len(res["roadmap"]["phases"]) == 5
    assert len(res["roadmap"]["recommended_projects"]) > 0
