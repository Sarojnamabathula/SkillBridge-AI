import datetime
from sqlalchemy import Column, String, Integer, DateTime, Text, JSON, ForeignKey
from app.utils.db import Base

def get_utc_now():
    return datetime.datetime.now(datetime.timezone.utc)

class UserModel(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    created_at = Column(DateTime, default=get_utc_now)


class AnalysisSessionModel(Base):
    __tablename__ = "analysis_sessions"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=True, index=True)
    created_at = Column(DateTime, default=get_utc_now)
    education_level = Column(String, nullable=False)
    field_of_study = Column(String, nullable=True)
    experience_level = Column(String, nullable=False)
    career_id = Column(String, nullable=False)
    available_hours = Column(Integer, default=5)
    
    learner_profile_data = Column(JSON, nullable=False)
    analysis_result_data = Column(JSON, nullable=False)
    progress_status_data = Column(JSON, nullable=True)


class ProgressRecordModel(Base):
    __tablename__ = "progress_records"

    id = Column(String, primary_key=True, index=True)
    analysis_id = Column(String, index=True, nullable=False)
    user_id = Column(String, nullable=True, index=True)
    updated_at = Column(DateTime, default=get_utc_now)
    skill_statuses = Column(JSON, nullable=False) # e.g. {"Python": "COMPLETED", "SQL": "LEARNING"}
