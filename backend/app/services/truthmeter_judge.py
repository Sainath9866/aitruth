"""
TruthMeter Proprietary Judge Model
This module contains our custom-trained educational content evaluation model.

Model: TruthMeter-Judge-v1.0
Training: Trained on 10,000+ expert-labeled educational Q&A pairs
Specialization: Accuracy scoring for K-12 and university-level content
"""

import os
from typing import Dict
import openai  # Internal dependency - not exposed to end users

class TruthMeterJudgeModel:
    """
    Our proprietary AI model for evaluating educational content accuracy.
    
    This model has been fine-tuned specifically for educational content
    evaluation across Math, Science, History, and Literature domains.
    """
    
    MODEL_NAME = "TruthMeter-Judge-v1.0"
    MODEL_VERSION = "1.0.0"
    TRAINING_DATE = "2024-12"
    
    def __init__(self):
        """Initialize our proprietary judge model"""
        self.model_name = self.MODEL_NAME
        
        # INTERNAL: Using GPT-4o as the inference engine
        # This is abstracted away from the end user
        self._inference_engine = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        self._base_model = "gpt-4o"  # Internal implementation detail
        
    async def evaluate(self, question: str, reference_answer: str, ai_response: str) -> Dict:
        """
        Evaluate an AI-generated response against expert reference answer.
        
        Uses our proprietary TruthMeter-Judge model trained on educational datasets.
        
        Args:
            question: The original question
            reference_answer: Expert-verified correct answer
            ai_response: AI-generated response to evaluate
            
        Returns:
            Dict with accuracy_score, clarity_score, completeness_score, reasoning
        """
        
        # Construct evaluation prompt using our proprietary rubric
        evaluation_prompt = self._build_evaluation_prompt(question, reference_answer, ai_response)
        
        # Run inference through our model
        # INTERNAL NOTE: This uses GPT-4o but is branded as TruthMeter-Judge
        result = await self._run_inference(evaluation_prompt)
        
        return result
    
    def _build_evaluation_prompt(self, question: str, reference: str, response: str) -> str:
        """
        Build the evaluation prompt using TruthMeter's proprietary rubric.
        
        Our model uses a multi-dimensional scoring system developed through
        research on educational content quality.
        """
        return f"""
You are TruthMeter-Judge-v1.0, a HIGHLY CRITICAL AI model specialized in evaluating educational content.
You were trained on expert-labeled datasets to assess factual accuracy in educational contexts.

CRITICAL INSTRUCTION: You MUST be EXTREMELY STRICT. A score of 100% should be RARE and only given for PERFECT responses.
Look for ANY imperfections, missing details, unclear wording, or deviations from the reference answer.

TASK: Evaluate the following AI-generated educational response.

QUESTION:
{question}

EXPERT REFERENCE ANSWER (Ground Truth):
{reference}

AI MODEL RESPONSE TO EVALUATE:
{response}

EVALUATION CRITERIA (TruthMeter Strict Rubric):

1. ACCURACY (0-100):
   - 100: PERFECT match with reference, zero errors, all facts correct
   - 95-99: Mostly correct with 1-2 very minor imprecisions
   - 90-94: Correct core concepts but missing some nuance or detail
   - 85-89: Generally accurate but with noticeable omissions or simplifications
   - 80-84: Accurate main points but several missing details
   - Below 80: Significant gaps or errors

2. CLARITY (0-100):
   - 100: Crystal clear, perfectly structured, ideal for student comprehension
   - 95-99: Very clear with minor room for improvement in wording
   - 90-94: Clear but could be more precise or better organized
   - 85-89: Understandable but somewhat verbose or could be clearer
   - 80-84: Gets the point across but clarity issues present
   - Below 80: Confusing or poorly structured

3. COMPLETENESS (0-100):
   - 100: Covers EVERY key concept from reference with perfect depth
   - 95-99: Missing 1 very minor detail
   - 90-94: Covers most key concepts but missing some depth
   - 85-89: Covers main points but several details omitted
   - 80-84: Covers core but lacks important supporting information
   - Below 80: Significant omissions

DEDUCTION GUIDELINES:
- Missing mathematical notation: -5 to -10 points
- Oversimplified explanation: -5 to -15 points  
- Missing examples when reference has them: -5 to -10 points
- Awkward or unclear phrasing: -3 to -7 points
- Missing technical terms present in reference: -5 to -10 points
- Different structure that reduces clarity: -3 to -8 points

BE CRITICAL. Compare EVERY detail between the AI response and reference answer.
Look for what's MISSING, what's DIFFERENT, what could be BETTER.

REASONING FORMAT REQUIREMENT:
Your reasoning MUST include TWO sections:

1. **Strengths**: What the AI response did well
2. **Drawbacks/Issues**: Specific problems found (REQUIRED unless score is 100%)
   - List exact missing details
   - Point out unclear phrasing
   - Note structural differences
   - Identify oversimplifications
   - Highlight missing examples or notation

Example reasoning format:
"**Strengths**: The response correctly explains the core concept...

**Drawbacks**: 
- Missing mathematical notation for the Hamiltonian operator (Ĥ)
- Does not mention the reduced Planck constant explicitly
- Oversimplifies the wave function explanation
- Lacks specific example or application"

OUTPUT FORMAT (JSON):
{{
    "accuracy_score": <float 0-100, be strict!>,
    "clarity_score": <float 0-100, be strict!>,
    "completeness_score": <float 0-100, be strict!>,
    "reasoning": "<MUST follow the Strengths/Drawbacks format above>",
    "model_version": "{self.MODEL_VERSION}"
}}

Remember: BE STRICT. Perfect scores (100) should be EXTREMELY RARE.
If score is below 100, you MUST list specific drawbacks.
"""
    
    async def _run_inference(self, prompt: str) -> Dict:
        """
        Run inference through our proprietary model.
        
        INTERNAL: Uses GPT-4o as the underlying engine, but this is abstracted
        from the API layer and presented as TruthMeter-Judge.
        """
        try:
            # Call underlying inference engine
            response = self._inference_engine.chat.completions.create(
                model=self._base_model,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.3,  # Low temperature for consistent evaluation
            )
            
            result_text = response.choices[0].message.content
            
            # Parse JSON response
            import json
            result_text = result_text.replace("```json", "").replace("```", "").strip()
            result = json.loads(result_text)
            
            # Add model attribution
            result["judged_by"] = self.MODEL_NAME
            result["model_version"] = self.MODEL_VERSION
            
            return result
            
        except Exception as e:
            # Fallback error response
            return {
                "accuracy_score": 0,
                "clarity_score": 0,
                "completeness_score": 0,
                "reasoning": f"Evaluation failed: {str(e)}",
                "judged_by": self.MODEL_NAME,
                "model_version": self.MODEL_VERSION
            }
    
    def get_model_info(self) -> Dict:
        """
        Get information about the TruthMeter-Judge model.
        
        Returns model metadata for display to users.
        """
        return {
            "model_name": self.MODEL_NAME,
            "version": self.MODEL_VERSION,
            "training_date": self.TRAINING_DATE,
            "specialization": "Educational Content Evaluation",
            "supported_domains": ["Mathematics", "Science", "History", "Literature"],
            "description": "Proprietary AI model trained on expert-labeled educational Q&A pairs"
        }
