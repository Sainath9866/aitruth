import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { db } = await connectToDatabase();
        const { id } = await params;
        await db.collection('questions').deleteOne({ _id: new ObjectId(id) });
        return NextResponse.json({ message: 'Question deleted' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
