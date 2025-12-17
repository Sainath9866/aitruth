from sqlalchemy import Column, Integer, String, Text, Float, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from pydantic import BaseModel
from typing import Optional

Base = declarative_base()

# SQLAlchemy Models
class QuestionDB(Base):
    __tablename__ = "questions"
    id = Column(Integer, primary_key=True, index=True)
    text = Column(Text, nullable=False)
    subject = Column(String, index=True)
    reference_answer = Column(Text, nullable=False)
    difficulty = Column(String, default="Medium")

class EvaluationDB(Base):
    __tablename__ = "evaluations"
    id = Column(Integer, primary_key=True, index=True)
    question_id = Column(Integer, index=True)
    model_name = Column(String, index=True)
    response_text = Column(Text)
    accuracy_score = Column(Float)
    clarity_score = Column(Float)
    completeness_score = Column(Float)
    reasoning = Column(Text)

# Pydantic Models for API
class QuestionCreate(BaseModel):
    text: str
    subject: str
    reference_answer: str
    difficulty: str = "Medium"

class QuestionResponse(QuestionCreate):
    id: int
    
    class Config:
        orm_mode = True  # Changed from from_attributes for compatibility

class EvaluationCreate(BaseModel):
    question_id: int
    model_name: str
    response_text: str
    accuracy_score: float
    clarity_score: float
    completeness_score: float
    reasoning: str

# Database Setup
SQLALCHEMY_DATABASE_URL = "sqlite:///./truth_meter.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    Base.metadata.create_all(bind=engine)
