from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models import EvaluationDB, QuestionDB, SessionLocal
from typing import Dict, List
from collections import defaultdict

router = APIRouter(
    prefix="/analytics",
    tags=["analytics"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/overview")
def get_overview(db: Session = Depends(get_db)):
    """Get overall statistics"""
    evaluations = db.query(EvaluationDB).all()
    
    if not evaluations:
        return {
            "total_evaluations": 0,
            "avg_accuracy": 0,
            "avg_clarity": 0,
            "avg_completeness": 0,
            "total_questions": 0
        }
    
    total = len(evaluations)
    avg_accuracy = sum(e.accuracy_score for e in evaluations) / total
    avg_clarity = sum(e.clarity_score for e in evaluations) / total
    avg_completeness = sum(e.completeness_score for e in evaluations) / total
    
    return {
        "total_evaluations": total,
        "avg_accuracy": round(avg_accuracy, 1),
        "avg_clarity": round(avg_clarity, 1),
        "avg_completeness": round(avg_completeness, 1),
        "total_questions": db.query(QuestionDB).count()
    }

@router.get("/by-subject")
def get_by_subject(db: Session = Depends(get_db)):
    """Get accuracy breakdown by subject"""
    results = []
    
    # Get all evaluations with their questions
    evaluations = db.query(EvaluationDB, QuestionDB).join(
        QuestionDB, EvaluationDB.question_id == QuestionDB.id
    ).all()
    
    # Group by subject
    subject_data = defaultdict(lambda: {"scores": [], "count": 0})
    
    for eval, question in evaluations:
        subject = question.subject
        subject_data[subject]["scores"].append({
            "accuracy": eval.accuracy_score,
            "clarity": eval.clarity_score,
            "completeness": eval.completeness_score
        })
        subject_data[subject]["count"] += 1
    
    # Calculate averages
    for subject, data in subject_data.items():
        scores = data["scores"]
        results.append({
            "subject": subject,
            "count": data["count"],
            "avg_accuracy": round(sum(s["accuracy"] for s in scores) / len(scores), 1),
            "avg_clarity": round(sum(s["clarity"] for s in scores) / len(scores), 1),
            "avg_completeness": round(sum(s["completeness"] for s in scores) / len(scores), 1)
        })
    
    return results

@router.get("/by-model")
def get_by_model(db: Session = Depends(get_db)):
    """Get accuracy breakdown by model"""
    results = []
    
    evaluations = db.query(EvaluationDB).all()
    
    # Group by model
    model_data = defaultdict(lambda: {"scores": [], "count": 0})
    
    for eval in evaluations:
        model = eval.model_name
        model_data[model]["scores"].append({
            "accuracy": eval.accuracy_score,
            "clarity": eval.clarity_score,
            "completeness": eval.completeness_score
        })
        model_data[model]["count"] += 1
    
    # Calculate averages
    for model, data in model_data.items():
        scores = data["scores"]
        results.append({
            "model": model,
            "count": data["count"],
            "avg_accuracy": round(sum(s["accuracy"] for s in scores) / len(scores), 1),
            "avg_clarity": round(sum(s["clarity"] for s in scores) / len(scores), 1),
            "avg_completeness": round(sum(s["completeness"] for s in scores) / len(scores), 1)
        })
    
    return results
