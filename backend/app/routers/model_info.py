from fastapi import APIRouter
from app.services.eval_service import EvaluationService

router = APIRouter(
    prefix="/model",
    tags=["model-info"],
)

eval_service = EvaluationService()

@router.get("/judge/info")
def get_judge_model_info():
    """
    Get information about our proprietary TruthMeter-Judge model.
    
    Returns model version, training details, and capabilities.
    """
    return eval_service.get_judge_info()

@router.get("/judge/health")
def check_judge_health():
    """
    Health check for the TruthMeter-Judge model.
    """
    return {
        "status": "operational",
        "model": "TruthMeter-Judge-v1.0",
        "ready": True
    }
