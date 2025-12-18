import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET() {
    try {
        const { db } = await connectToDatabase();

        const results = await db.collection('evaluations').aggregate([
            {
                $group: {
                    _id: '$model_name',
                    count: { $sum: 1 },
                    avg_accuracy: { $avg: '$accuracy_score' },
                    avg_clarity: { $avg: '$clarity_score' },
                    avg_completeness: { $avg: '$completeness_score' }
                }
            },
            {
                $project: {
                    model: '$_id',
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
