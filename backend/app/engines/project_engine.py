from typing import List
from app.schemas.analysis import ClassifiedSkillItem
from app.schemas.roadmap import ProjectRecommendation
from app.schemas.career import CareerProfile

PROJECT_CATALOG = {
    "data_analyst": [
        ProjectRecommendation(
            title="E-Commerce Sales Performance & Customer Churn Dashboard",
            difficulty="BEGINNER",
            skills_practiced=["SQL", "Python", "Data Analysis Libraries", "Data Visualization"],
            description="Extract retail transaction data using SQL queries, analyze purchase patterns with Pandas, and construct an interactive KPI dashboard.",
            learning_outcome="Hands-on experience writing SQL aggregation queries, data cleaning in Pandas, and visual business reporting."
        ),
        ProjectRecommendation(
            title="Exploratory Data Analysis on Global Education & Economic Metrics",
            difficulty="INTERMEDIATE",
            skills_practiced=["Python", "Statistics & Probability", "Data Visualization", "Business Intelligence Tools"],
            description="Analyze UN SDG datasets to identify correlations between education accessibility and employment outcomes across regions.",
            learning_outcome="Practical hypothesis testing, statistical correlation modeling, and storytelling with data visualizations."
        )
    ],
    "software_developer": [
        ProjectRecommendation(
            title="Task Automation & Command-Line CLI Tool",
            difficulty="BEGINNER",
            skills_practiced=["Python", "Programming Fundamentals", "Git & Version Control"],
            description="Build a modular command-line interface tool to automate file organization and log parsing with unit test coverage.",
            learning_outcome="Mastering clean OOP structure, command-line parsing, file I/O operations, and Git workflows."
        ),
        ProjectRecommendation(
            title="RESTful Web API Service with Relational DB Integration",
            difficulty="INTERMEDIATE",
            skills_practiced=["Python", "SQL", "Software Testing & QA", "Object-Oriented Programming (OOP)"],
            description="Design and implement a structured REST API using FastAPI/Flask with SQLite database migrations and pytest suite.",
            learning_outcome="End-to-end backend API architecture, database schema design, and automated test-driven development."
        )
    ],
    "full_stack_developer": [
        ProjectRecommendation(
            title="Personalized Learning Portal SPA",
            difficulty="INTERMEDIATE",
            skills_practiced=["HTML & CSS", "JavaScript", "React", "Backend Development", "SQL"],
            description="Build a full-stack single page web application with React frontend, FastAPI backend, and SQL persistence.",
            learning_outcome="Connecting client frontend state with backend REST APIs and database models."
        ),
        ProjectRecommendation(
            title="Collaborative Issue Tracker & Kanban Dashboard",
            difficulty="ADVANCED",
            skills_practiced=["React", "TypeScript", "Backend Development", "SQL", "Git & Version Control"],
            description="Engineered a multi-user project management board with drag-and-drop status, task filters, and API authentication.",
            learning_outcome="State management at scale, TypeScript type safety across stack, and clean API integration."
        )
    ],
    "web_developer": [
        ProjectRecommendation(
            title="Accessible & Responsive EdTech Landing Page",
            difficulty="BEGINNER",
            skills_practiced=["HTML & CSS", "JavaScript", "Responsive Web Design", "Web Performance & Accessibility"],
            description="Develop a responsive, WCAG-compliant educational homepage with light/dark themes and interactive components.",
            learning_outcome="Deep mastery of responsive layout grids, keyboard accessibility, ARIA landmarks, and CSS design systems."
        ),
        ProjectRecommendation(
            title="Interactive Course Catalog & Quiz Application",
            difficulty="INTERMEDIATE",
            skills_practiced=["JavaScript", "React", "Responsive Web Design", "Git & Version Control"],
            description="Create a dynamic course browsing application with search filters, interactive quiz modules, and local progress tracking.",
            learning_outcome="Component composition, client-side state management, and smooth user interactions."
        )
    ],
    "ai_ml_engineer": [
        ProjectRecommendation(
            title="Predictive Student Performance & Skill Gap Classifier",
            difficulty="INTERMEDIATE",
            skills_practiced=["Python", "Data Analysis Libraries", "Machine Learning Fundamentals", "Mathematics & Linear Algebra"],
            description="Train classification models (Random Forest, SVM, Logistic Regression) to predict learning outcomes from demographic-free features.",
            learning_outcome="Feature engineering, cross-validation model evaluation, hyperparameter tuning, and model metric analysis."
        ),
        ProjectRecommendation(
            title="Domain-Specific NLP Text Summarizer API",
            difficulty="ADVANCED",
            skills_practiced=["Python", "Natural Language Processing (NLP)", "Deep Learning & Neural Networks", "MLOps & Model Deployment"],
            description="Deploy a fine-tuned Transformer NLP model as an API endpoint to extract key skills and concepts from educational articles.",
            learning_outcome="Building NLP pipelines, vector embeddings, containerized model serving, and API benchmarking."
        )
    ],
    "cybersecurity_analyst": [
        ProjectRecommendation(
            title="Network Log Analyzer & Intrusion Detection Script",
            difficulty="INTERMEDIATE",
            skills_practiced=["Computer Networking Fundamentals", "Operating System Security", "Threat Analysis & Monitoring", "Python"],
            description="Develop Python log analysis scripts to parse system log files and detect anomalous port scan patterns or unauthorized access attempts.",
            learning_outcome="Packet inspection, log parsing regex rules, SIEM alert generation, and incident triage."
        ),
        ProjectRecommendation(
            title="Vulnerability Audit & Security Hardening Report",
            difficulty="INTERMEDIATE",
            skills_practiced=["Information Security Fundamentals", "Vulnerability Assessment", "Cryptography Basics"],
            description="Perform a security audit of a local web application environment, document vulnerabilities against OWASP Top 10, and propose hardening rules.",
            learning_outcome="Vulnerability scanning tools, risk classification, SSL/TLS certificate configuration, and defensive posture documentation."
        )
    ],
    "cloud_engineer": [
        ProjectRecommendation(
            title="Containerized Microservice Deployment with Docker & Infrastructure as Code",
            difficulty="INTERMEDIATE",
            skills_practiced=["Cloud Platforms (AWS/Azure/GCP)", "Linux Administration", "Docker & Containers", "Infrastructure as Code (Terraform/CloudFormation)"],
            description="Containerize a web app with Docker and provision cloud infrastructure (virtual network, instances) automatically via Terraform.",
            learning_outcome="Hands-on Infrastructure as Code, container orchestration basics, and cloud resource provisioning."
        ),
        ProjectRecommendation(
            title="Automated CI/CD Pipeline for Cloud Web Applications",
            difficulty="INTERMEDIATE",
            skills_practiced=["CI/CD Pipelines", "Git & Version Control", "Docker & Containers", "Linux Administration"],
            description="Configure a complete GitHub Actions CI/CD workflow that runs automated tests, builds container images, and deploys to cloud servers.",
            learning_outcome="Automated continuous integration, automated deployments, secret handling, and environment rollback strategies."
        )
    ]
}

class ProjectEngine:
    def recommend_projects(
        self,
        career_id: str,
        classified_skills: List[ClassifiedSkillItem],
        experience_level: str
    ) -> List[ProjectRecommendation]:
        # Fetch curated catalog projects for career or generic fallback
        career_key = career_id.lower()
        projects = PROJECT_CATALOG.get(career_key, PROJECT_CATALOG["software_developer"])
        
        # Collect missing or improvement skills
        target_skills = [
            item.skill_name for item in classified_skills
            if item.classification in ("MISSING", "NEEDS_IMPROVEMENT")
        ]

        # Return top 2 matching projects
        return projects[:2]

project_engine = ProjectEngine()
