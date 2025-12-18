import OpenAI from 'openai';

export interface EvaluationResult {
    accuracy_score: number;
    clarity_score: number;
    completeness_score: number;
    reasoning: string;
    judged_by: string;
    model_version: string;
}

export class JudgeService {
    private readonly MODEL_NAME = 'TruthMeter-Judge-v1.0';
    private readonly MODEL_VERSION = '1.0.0';
    private openai?: OpenAI;

    constructor() {
        if (process.env.OPENAI_API_KEY) {
            this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        }
    }

    async evaluate(question: string, referenceAnswer: string, aiResponse: string): Promise<EvaluationResult> {
        if (!this.openai) {
            throw new Error('OpenAI API key not configured for Judge Service');
        }

        const prompt = this.buildEvaluationPrompt(question, referenceAnswer, aiResponse);

        try {
            const response = await this.openai.chat.completions.create({
                model: 'gpt-4o',
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.3,
                response_format: { type: 'json_object' },
            });

            const resultText = response.choices[0].message.content || '{}';
            const result = JSON.parse(resultText);

            return {
                ...result,
                judged_by: this.MODEL_NAME,
                model_version: this.MODEL_VERSION,
            };
        } catch (error: any) {
            console.error('Evaluation failed:', error);
            return {
                accuracy_score: 0,
                clarity_score: 0,
                completeness_score: 0,
                reasoning: `Evaluation failed: ${error.message}`,
                judged_by: this.MODEL_NAME,
                model_version: this.MODEL_VERSION,
            };
        }
    }

    private buildEvaluationPrompt(question: string, reference: string, response: string): string {
        return `
You are TruthMeter-Judge-v1.0, a HIGHLY CRITICAL AI model specialized in evaluating educational content.
You were trained on expert-labeled datasets to assess factual accuracy in educational contexts.

CRITICAL INSTRUCTION: You MUST be EXTREMELY STRICT. A score of 100% should be RARE and only given for PERFECT responses.
Look for ANY imperfections, missing details, unclear wording, or deviations from the reference answer.

TASK: Evaluate the following AI-generated educational response.

QUESTION:
${question}

EXPERT REFERENCE ANSWER (Ground Truth):
${reference}

AI MODEL RESPONSE TO EVALUATE:
${response}

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
{
    "accuracy_score": <float 0-100, be strict!>,
    "clarity_score": <float 0-100, be strict!>,
    "completeness_score": <float 0-100, be strict!>,
    "reasoning": "<MUST follow the Strengths/Drawbacks format above>"
}

Remember: BE STRICT. Perfect scores (100) should be EXTREMELY RARE.
If score is below 100, you MUST list specific drawbacks.
`;
    }
}

export const judgeService = new JudgeService();
