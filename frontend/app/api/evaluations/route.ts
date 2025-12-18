import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { llmService } from '@/lib/services/llmService';
import { judgeService } from '@/lib/services/judgeService';
import { ObjectId } from 'mongodb';

export async function POST(request: Request) {
    try {
        const { db } = await connectToDatabase();
        const body = await request.json();
        const { question_id, model_name, provider } = body;

        // 1. Get question details
        const question = await db.collection('questions').findOne({ _id: new ObjectId(question_id) });
        if (!question) {
            return NextResponse.json({ error: 'Question not found' }, { status: 404 });
        }

        // 2. Get AI response
        const aiResponse = await llmService.getResponse(provider, model_name, question.text);

        // 3. Run evaluation
        const evaluation = await judgeService.evaluate(question.text, question.reference_answer, aiResponse);

        // 4. Save evaluation to MongoDB
        const result = await db.collection('evaluations').insertOne({
            question_id: new ObjectId(question_id),
            model_name: model_name,
            provider: provider,
            response_text: aiResponse,
            accuracy_score: evaluation.accuracy_score,
            clarity_score: evaluation.clarity_score,
            completeness_score: evaluation.completeness_score,
            reasoning: evaluation.reasoning,
            judged_by: evaluation.judged_by,
            createdAt: new Date()
        });

        return NextResponse.json({
            id: result.insertedId.toString(),
            response_text: aiResponse,
            ...evaluation
        });
    } catch (error: any) {
        console.error('Evaluation route error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
