# SkillBridge AI – Responsible AI, Privacy & Governance Policy

This document outlines the Responsible AI commitments, ethical considerations, privacy safeguards, and governance frameworks built into SkillBridge AI.

---

## 1. Fairness & Non-Discrimination Policy

### Principles
- **No Demographic Collection**: SkillBridge AI strictly excludes demographic data—such as gender, race, ethnicity, age, religion, caste, national origin, political affiliation, or financial status—from all recommendation algorithms.
- **Skill-Based Evaluation**: Learning recommendations are computed exclusively using:
  1. User-reported skill proficiencies.
  2. Experience level and education domain.
  3. Career benchmark requirements.
  4. Weekly learning availability.

---

## 2. Transparency & Explainability

### Deterministic Source of Truth
- The system does not rely on opaque "black box" machine learning models to decide missing skills or priority levels.
- Every skill gap classification displays a human-readable explanation based on observable inputs and rules:
  - *Example*: "You possess 'Python' at the recommended level (INTERMEDIATE)."
  - *Example*: "You have baseline experience in 'SQL' (BEGINNER), but the role requires INTERMEDIATE level."

---

## 3. Privacy & Data Minimization

### Safeguards
- **Data Minimization**: Only information essential for skill gap evaluation is requested.
- **Transient Resume Analysis**: Free-text background descriptions or pasted project text are processed transiently in-memory for entity extraction and are **never logged, saved to disk, or resold**.
- **No Sensitive Authentication**: The prototype uses anonymous sessions, requiring zero password or personal email credentials.

---

## 4. Ethical Standards & Disclaimers

### Mandatory Ethical Disclosure
> "SkillBridge AI provides learning guidance and decision support under UN Sustainable Development Goal 4 (Quality Education). Recommendations are not guarantees of employment, career placement, salary outcomes, or professional certification."

### Key Constraints
- The system **never** ranks a learner's intelligence or overall personal worth.
- The system **never** guarantees job offers or career placement.
- Self-reported skill statuses represent user estimates and are not independent verification of competence.

---

## 5. System Limitations

1. **Static Benchmark Scope**: Knowledge base profiles reflect standard industry benchmarks, but individual company requirements vary.
2. **User-Reported Inputs**: Skill accuracy relies on self-reported learner estimates.
3. **Decision-Support Role**: Recommendations supplement, but do not replace, formal academic education and career mentorship.
