import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET() {
    try {
        const { db } = await connectToDatabase();
        const questions = await db.collection('questions').find({}).toArray();
        // Map _id to id for frontend compatibility
        const formattedQuestions = questions.map(q => ({
            ...q,
            id: q._id.toString(),
            _id: undefined
        }));
        return NextResponse.json(formattedQuestions);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { db } = await connectToDatabase();
        const body = await request.json();
        const result = await db.collection('questions').insertOne({
            text: body.text,
            subject: body.subject,
            reference_answer: body.reference_answer,
            difficulty: body.difficulty || 'Medium',
            createdAt: new Date()
        });
        return NextResponse.json({ id: result.insertedId.toString(), ...body });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
