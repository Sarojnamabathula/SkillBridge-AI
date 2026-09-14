# SkillBridge AI – REST API Documentation

Base URL: `http://localhost:8000/api/v1`

---

## Endpoints Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | System health check and AI provider availability status |
| `GET` | `/careers` | Fetch list of all available career profiles |
| `GET` | `/careers/{career_id}` | Fetch detailed career profile requirements |
| `POST` | `/extract-skills` | Extract and normalize skills from free-text |
| `POST` | `/analyze` | Perform deterministic skill gap analysis and generate roadmap |
| `GET` | `/analysis/{analysis_id}` | Retrieve saved analysis session |
| `POST` | `/progress` | Update skill completion progress and recalculate roadmap |
| `GET` | `/progress/{analysis_id}` | Retrieve skill completion record |

---

## Endpoint Details

### 1. Health Check
`GET /api/v1/health`

**Response (`200 OK`):**
```json
{
  "status": "healthy",
  "project": "SkillBridge AI",
  "version": "1.0.0",
  "ai_active": false,
  "ai_provider": "none"
}
```

---

### 2. List Careers Catalog
`GET /api/v1/careers`

**Response (`200 OK`):**
```json
[
  {
    "career_id": "data_analyst",
    "name": "Data Analyst",
    "description": "Transforms raw data into actionable insights...",
    "category": "Data & Analytics",
    "skills": [...]
  }
]
```

---

### 3. Extract & Normalize Skills
`POST /api/v1/extract-skills`

**Request Body:**
```json
{
  "text": "I have experience with py3, mysql queries, and html5 web styling."
}
```

**Response (`200 OK`):**
```json
{
  "extracted_skills": ["Python", "SQL", "HTML & CSS"],
  "normalized_skills": ["HTML & CSS", "Python", "SQL"]
}
```

---

### 4. Skill Gap Analysis & Roadmap Generation
`POST /api/v1/analyze`

**Request Body:**
```json
{
  "education_level": "B.Tech Computer Science",
  "field_of_study": "Computer Science",
  "experience_level": "BEGINNER",
  "current_skills": [
    { "name": "Python", "proficiency": "INTERMEDIATE" },
    { "name": "Basic SQL", "proficiency": "BEGINNER" }
  ],
  "free_text_background": "I know HTML and CSS basics.",
  "career_goal": "data_analyst",
  "available_learning_time": 6
}
```

**Response (`200 OK`):**
```json
{
  "analysis_id": "8f3b2a1c-...",
  "created_at": "2026-09-14T10:45:00Z",
  "career_id": "data_analyst",
  "career_name": "Data Analyst",
  "summary": {
    "total_required": 8,
    "existing_count": 2,
    "needs_improvement_count": 1,
    "missing_count": 4,
    "optional_count": 1,
    "readiness_percentage": 31.2
  },
  "existing_skills": [...],
  "needs_improvement_skills": [...],
  "missing_skills": [...],
  "optional_skills": [...],
  "roadmap": {
    "total_estimated_weeks": 10.5,
    "weekly_commitment_hours": 6,
    "phases": [...],
    "recommended_projects": [...]
  },
  "ai_disclaimer": "SkillBridge AI provides learning guidance and decision support."
}
```

---

### 5. Update Progress Status
`POST /api/v1/progress`

**Request Body:**
```json
{
  "analysis_id": "8f3b2a1c-...",
  "skill_statuses": {
    "Python": "COMPLETED",
    "SQL": "LEARNING",
    "Statistics & Probability": "NOT_STARTED"
  }
}
```

**Response (`200 OK`):**
```json
{
  "analysis_id": "8f3b2a1c-...",
  "updated_at": "2026-09-14T10:46:00Z",
  "progress_percentage": 33.3,
  "updated_roadmap": { ... }
}
```
