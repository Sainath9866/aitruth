from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models import EvaluationDB, EvaluationCreate, QuestionDB, SessionLocal
from app.services.eval_service import EvaluationService
from app.services.llm_service import LLMService

router = APIRouter(
    prefix="/evaluations",
    tags=["evaluations"],
)

eval_service = EvaluationService()
llm_service = LLMService()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/run/{question_id}")
async def run_evaluation(question_id: int, model_provider: str, model_name: str, db: Session = Depends(get_db)):
    # 1. Get Question
    question = db.query(QuestionDB).filter(QuestionDB.id == question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    
    # 2. Get AI Response
    ai_response_text = await llm_service.get_response(model_provider, model_name, question.text)
    
    # 3. Evaluate Response
    eval_result = await eval_service.evaluate_response(question.text, question.reference_answer, ai_response_text)
    
    # 4. Save to DB
    db_eval = EvaluationDB(
        question_id=question.id,
        model_name=f"{model_provider}/{model_name}",
        response_text=ai_response_text,
        accuracy_score=eval_result["accuracy_score"],
        clarity_score=eval_result["clarity_score"],
        completeness_score=eval_result["completeness_score"],
        reasoning=eval_result["reasoning"]
    )
    db.add(db_eval)
    db.commit()
    db.refresh(db_eval)
    
    return db_eval

@router.get("/")
def get_evaluations(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(EvaluationDB).offset(skip).limit(limit).all()
