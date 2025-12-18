import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET() {
    try {
        const { db } = await connectToDatabase();

        const evaluations = await db.collection('evaluations').find({}).toArray();
        const totalQuestions = await db.collection('questions').countDocuments();

        if (evaluations.length === 0) {
            return NextResponse.json({
                total_evaluations: 0,
                avg_accuracy: 0,
                avg_clarity: 0,
                avg_completeness: 0,
                total_questions: totalQuestions
            });
        }

        const total = evaluations.length;
        const avg_accuracy = evaluations.reduce((acc, e) => acc + (e.accuracy_score || 0), 0) / total;
        const avg_clarity = evaluations.reduce((acc, e) => acc + (e.clarity_score || 0), 0) / total;
        const avg_completeness = evaluations.reduce((acc, e) => acc + (e.completeness_score || 0), 0) / total;

        return NextResponse.json({
            total_evaluations: total,
            avg_accuracy: Math.round(avg_accuracy * 10) / 10,
            avg_clarity: Math.round(avg_clarity * 10) / 10,
            avg_completeness: Math.round(avg_completeness * 10) / 10,
            total_questions: totalQuestions
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
