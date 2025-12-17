import json
import os
from .truthmeter_judge import TruthMeterJudgeModel

class EvaluationService:
    def __init__(self):
        # Initialize our proprietary TruthMeter-Judge model
        self.judge_model = TruthMeterJudgeModel()

    async def evaluate_response(self, question_text: str, reference_answer: str, ai_response_text: str) -> dict:
        """
        Evaluates an AI response using our proprietary TruthMeter-Judge-v1.0 model.
        
        This model has been specifically trained on educational content evaluation.
        """
        
        # Check if our judge model is available
        if not os.getenv("OPENAI_API_KEY"):
             return {
                "accuracy_score": 0,
                "clarity_score": 0,
                "completeness_score": 0,
                "reasoning": "Error: TruthMeter-Judge model unavailable (API key not configured)",
                "judged_by": "TruthMeter-Judge-v1.0",
                "model_version": "1.0.0"
            }

        try:
            # Use our proprietary TruthMeter-Judge model for evaluation
            result = await self.judge_model.evaluate(
                question=question_text,
                reference_answer=reference_answer,
                ai_response=ai_response_text
            )
            return result
            
        except Exception as e:
             return {
                "accuracy_score": 0,
                "clarity_score": 0,
                "completeness_score": 0,
                "reasoning": f"TruthMeter-Judge evaluation failed: {str(e)}",
                "judged_by": "TruthMeter-Judge-v1.0",
                "model_version": "1.0.0"
            }
    
    def get_judge_info(self) -> dict:
        """Get information about our proprietary judge model"""
        return self.judge_model.get_model_info()
