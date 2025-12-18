import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET() {
    try {
        const { db } = await connectToDatabase();

        // Aggregate evaluations by subject
        // We need to join with questions to get the subject
        const results = await db.collection('evaluations').aggregate([
            {
                $lookup: {
                    from: 'questions',
                    localField: 'question_id',
                    foreignField: '_id',
                    as: 'question'
                }
            },
            { $unwind: '$question' },
            {
                $group: {
                    _id: '$question.subject',
                    count: { $sum: 1 },
                    avg_accuracy: { $avg: '$accuracy_score' },
                    avg_clarity: { $avg: '$clarity_score' },
                    avg_completeness: { $avg: '$completeness_score' }
                }
            },
            {
                $project: {
                    subject: '$_id',
                    count: 1,
                    avg_accuracy: { $round: ['$avg_accuracy', 1] },
                    avg_clarity: { $round: ['$avg_clarity', 1] },
                    avg_completeness: { $round: ['$avg_completeness', 1] },
                    _id: 0
                }
            }
        ]).toArray();

        return NextResponse.json(results);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
