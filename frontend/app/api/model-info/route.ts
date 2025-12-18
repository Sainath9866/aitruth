import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({
        model_name: "TruthMeter-Judge-v1.0",
        version: "1.0.0",
        training_date: "2024-12",
        specialization: "Educational Content Evaluation",
        supported_domains: ["Mathematics", "Science", "History", "Literature"],
        description: "Proprietary AI model trained on expert-labeled educational Q&A pairs"
    });
}
