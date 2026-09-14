# SkillBridge AI – System Architecture Documentation

This document describes the architectural design, component boundaries, data flow, deterministic rules vs AI boundaries, and future extension capabilities of SkillBridge AI.

---

## 1. System Overview & Component Structure

SkillBridge AI separates core decision-support logic from natural language enhancement:

```
[ FRONTEND LAYER ]
└── React (Vite) Single Page Application
    ├── Context: AnalysisContext (State management & LocalStorage persistence)
    ├── Services: api.js (REST API Client + Client-side Fallbacks)
    └── UI Pages: Home, Profile, Careers, Gap Analysis, Roadmap, Projects, Progress, Responsible AI

[ API & ROUTING LAYER ]
└── FastAPI (Python 3.12)
    ├── CORS Middleware
    ├── Pydantic Schemas Validation
    └── Routes: /health, /careers, /extract-skills, /analyze, /progress, /roadmap/regenerate

[ CORE ENGINES (Deterministic & Rule-Based) ]
├── Skill Normalization Service (Reverse Alias Lookup Table)
├── Skill Extraction Service (Entity / Regex Keyword Parsing)
├── Career Knowledge Service (Structured JSON Schema Database)
├── Skill Gap Engine (Deterministic Classification: Existing, Improvement, Missing, Optional)
├── Prioritization Engine (Importance Weights + Prerequisite Block Scoring)
├── Roadmap Engine (5-Phase Prerequisite Topological Sequencing)
└── Project Recommendation Engine (Curated Hands-On Capstone Catalog)

[ AI LAYER ]
└── AIService (Provider Abstraction Interface)
    ├── Active Provider (OpenAI / Anthropic / Gemini SDK wrappers)
    └── Fallback Template Provider (100% Offline Rule-Based Templates)

[ DATA & PERSISTENCE LAYER ]
└── SQLite via SQLAlchemy ORM (Analysis Sessions & Progress Records)
```

---

## 2. Data Flow Sequence

1. **Learner Input**: Learner provides education level, experience level, current skills, available hours/week, and optional background text.
2. **Normalization & Extraction**:
   - Explicit skill inputs are normalized via `SkillNormalizationService` against `skill_aliases.json`.
   - Text background is parsed via `SkillExtractionService` to find additional normalized skill entities.
3. **Career Knowledge Retrieval**: Target career benchmark is fetched from `careers.json`.
4. **Deterministic Gap Classification**:
   - `SkillGapEngine` compares learner skills against career requirements.
   - Assigns classification (`EXISTING`, `NEEDS_IMPROVEMENT`, `MISSING`, `OPTIONAL`).
   - Calculates overall readiness percentage.
5. **Prioritization & Topological Sequencing**:
   - `PrioritizationEngine` ranks skill gaps based on prerequisite dependencies and role importance.
   - `RoadmapEngine` constructs a 5-phase sequential pathway, placing prerequisite skills in earlier phases.
6. **Project & AI Enhancement**:
   - `ProjectEngine` matches top capstone builds to missing competencies.
   - `AIService` formats personalized explanations (or applies rule templates if key is absent).
7. **Persistence & UI Render**:
   - Response payload saved to SQLite database.
   - Interactive UI renders Skill Gap Dashboard, 5-Phase Roadmap, Projects, and Progress Tracker.

---

## 3. Deterministic Core vs. AI Boundaries

| System Function | Responsibility Boundary | Implementation Method |
| :--- | :--- | :--- |
| Skill Alias Mapping | 100% Deterministic | Reverse alias JSON dictionary lookup |
| Required Career Skills | 100% Deterministic | Structured JSON schema database |
| Skill Gap Classification | 100% Deterministic | Strict rules engine comparing levels & requirement flags |
| Priority Calculation | 100% Deterministic | Importance scoring + Prerequisite graph weighting |
| Roadmap Phase Ordering | 100% Deterministic | Topological prerequisite ordering algorithm |
| Project Matching | 100% Deterministic | Curated project catalog matching missing skills |
| Narrative Enhancements | AI-Assisted (with Fallback) | LLM provider abstraction with deterministic template fallback |

---

## 4. Future Architecture Extensions (RAG & Resume Upload)

The backend is architected to easily support future extensions:
1. **Resume Document Parsing**: Adding `pdfplumber` / `python-docx` service into `SkillExtractionService`.
2. **RAG Vector Search**: Replacing static `careers.json` with a Vector Store (e.g. ChromaDB / FAISS) querying live job market skill taxonomies via similarity search.
3. **PostgreSQL Migration**: Changing `DATABASE_URL` in `.env` to PostgreSQL connection URI without modifying application code.
