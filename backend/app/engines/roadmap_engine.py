from typing import List, Dict, Set
from app.schemas.analysis import ClassifiedSkillItem
from app.schemas.roadmap import RoadmapOutput, RoadmapPhase, RoadmapSkillItem
from app.schemas.career import CareerProfile

SKILL_HOURS_ESTIMATE = {
    "BEGINNER": 15,
    "INTERMEDIATE": 25,
    "ADVANCED": 40
}

SUGGESTED_PRACTICE_TEMPLATES = {
    "Python": "Build automation scripts, solve algorithmic puzzles, and parse text files.",
    "SQL": "Write relational queries, JOINs, group aggregations, and subqueries on sample DBs.",
    "Statistics & Probability": "Calculate mean, standard deviation, confidence intervals, and run t-tests.",
    "Data Analysis Libraries": "Clean noisy CSV datasets using Pandas, compute aggregations, and manipulate dataframes.",
    "Data Visualization": "Plot bar charts, scatter plots, histograms, and heatmaps using Seaborn/Plotly.",
    "Business Intelligence Tools": "Create interactive sales/metrics dashboards in Power BI or Tableau.",
    "HTML & CSS": "Build responsive landing pages using semantic HTML and Flexbox/Grid CSS.",
    "JavaScript": "Create interactive DOM applications, handle async fetch requests, and implement state logic.",
    "React": "Build component-based single page applications with state hooks and props.",
    "Backend Development": "Build RESTful API endpoints with validation, routing, and database integration.",
    "Git & Version Control": "Create GitHub repositories, commit code, create branches, and resolve merge conflicts.",
    "Machine Learning Fundamentals": "Train scikit-learn models (logistic regression, decision trees) and evaluate metrics.",
    "Deep Learning & Neural Networks": "Build PyTorch/TensorFlow neural network layers for image classification.",
    "Computer Networking Fundamentals": "Inspect packet flows with Wireshark and set up virtual subnets.",
    "Linux Administration": "Navigate Linux terminal, configure user permissions, write bash scripts, and manage services.",
    "Cloud Platforms (AWS/Azure/GCP)": "Deploy virtual machines, configure storage buckets, and manage security groups."
}

class RoadmapEngine:
    def generate_roadmap(
        self,
        classified_skills: List[ClassifiedSkillItem],
        weekly_hours: int = 6,
        user_status_map: Dict[str, str] = None
    ) -> RoadmapOutput:
        user_status_map = user_status_map or {}
        
        # We only need to put non-EXISTING skills in learning phases 1-4,
        # or EXISTING skills that need improvement.
        skills_to_learn = [
            item for item in classified_skills 
            if item.classification in ("MISSING", "NEEDS_IMPROVEMENT", "OPTIONAL")
        ]

        # Map skill name -> ClassifiedSkillItem
        skill_dict = {item.skill_name: item for item in classified_skills}

        # Topological sorting / Phase classification respecting prerequisites
        phase1_skills: List[RoadmapSkillItem] = [] # Foundation & Unmet Prerequisites
        phase2_skills: List[RoadmapSkillItem] = [] # Core Essential Skills
        phase3_skills: List[RoadmapSkillItem] = [] # Applied Tools & Frameworks
        phase4_skills: List[RoadmapSkillItem] = [] # Advanced & Optional Skills

        placed_skills: Set[str] = set(
            item.skill_name for item in classified_skills if item.classification == "EXISTING"
        )

        for item in skills_to_learn:
            # Check if skill status is updated by user
            status = user_status_map.get(item.skill_name, "NOT_STARTED")
            
            est_hours = SKILL_HOURS_ESTIMATE.get(item.required_level.upper(), 20)
            if item.classification == "NEEDS_IMPROVEMENT":
                est_hours = int(est_hours * 0.5)

            practice = SUGGESTED_PRACTICE_TEMPLATES.get(
                item.skill_name,
                f"Complete hands-on exercises and practical tutorials focused on {item.skill_name}."
            )

            roadmap_item = RoadmapSkillItem(
                skill_name=item.skill_name,
                category=item.category,
                priority=item.priority,
                target_proficiency=item.required_level,
                prerequisites=item.prerequisites,
                suggested_practice=practice,
                estimated_hours=est_hours,
                user_status=status
            )

            # Determine appropriate phase
            has_unmet_prereqs = any(p not in placed_skills for p in item.prerequisites)

            if item.priority == "CRITICAL" and (has_unmet_prereqs or len(item.prerequisites) == 0):
                phase1_skills.append(roadmap_item)
            elif item.classification == "MISSING" and item.priority in ("CRITICAL", "HIGH"):
                phase2_skills.append(roadmap_item)
            elif item.classification == "NEEDS_IMPROVEMENT" or item.priority == "HIGH":
                phase3_skills.append(roadmap_item)
            else:
                phase4_skills.append(roadmap_item)

            placed_skills.add(item.skill_name)

        # Helper to create phase object
        def create_phase(num: int, title: str, obj: str, items: List[RoadmapSkillItem]) -> RoadmapPhase:
            total_h = sum(i.estimated_hours for i in items)
            weeks = round(total_h / max(1, weekly_hours), 1) if total_h > 0 else 1.0
            return RoadmapPhase(
                phase_number=num,
                phase_title=title,
                objective=obj,
                duration_weeks=weeks,
                skills=items
            )

        phases: List[RoadmapPhase] = []
        phases.append(
            create_phase(
                1,
                "Phase 1: Foundations & Prerequisites",
                "Master essential prerequisite concepts and fundamental tools required for advanced topics.",
                phase1_skills
            )
        )
        phases.append(
            create_phase(
                2,
                "Phase 2: Core Domain Skills",
                "Focus on high-priority missing skills that form the core of your target career.",
                phase2_skills
            )
        )
        phases.append(
            create_phase(
                3,
                "Phase 3: Applied Tools & Workflows",
                "Strengthen areas needing improvement and integrate tools into realistic workflows.",
                phase3_skills
            )
        )
        phases.append(
            create_phase(
                4,
                "Phase 4: Advanced & Specialization Tools",
                "Explore optional advanced topics to differentiate your skill profile.",
                phase4_skills
            )
        )
        phases.append(
            create_phase(
                5,
                "Phase 5: Portfolio & Capstone Projects",
                "Apply all learned skills by engineering end-to-end practical portfolio projects.",
                []
            )
        )

        total_est_hours = sum(
            sum(i.estimated_hours for i in p.skills) for p in phases
        )
        total_weeks = round(total_est_hours / max(1, weekly_hours), 1) if total_est_hours > 0 else 2.0

        return RoadmapOutput(
            total_estimated_weeks=total_weeks,
            weekly_commitment_hours=weekly_hours,
            phases=phases,
            recommended_projects=[]
        )

roadmap_engine = RoadmapEngine()
