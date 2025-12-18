"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

interface Question {
    id: string;
    text: string;
    subject: string;
}

interface Evaluation {
    id: string;
    model_name: string;
    accuracy_score: number;
    clarity_score: number;
    completeness_score: number;
    reasoning: string;
    response_text: string;
}

export default function EvaluationsPage() {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
    const [selectedModel, setSelectedModel] = useState("gpt-4o");
    const [selectedProvider, setSelectedProvider] = useState("openai");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<Evaluation | null>(null);

    useEffect(() => {
        loadQuestions();
    }, []);

    useEffect(() => {
        // Auto-update model name when provider changes
        const modelMap: { [key: string]: string } = {
            "openai": "gpt-4o",
            "google": "gemini-2.5-flash",
            "anthropic": "claude-sonnet-4-5",
            "deepseek": "deepseek-chat"
        };
        setSelectedModel(modelMap[selectedProvider] || "gpt-4o");
    }, [selectedProvider]);

    const loadQuestions = async () => {
        try {
            console.log("Fetching questions from API...");
            const data = await api.get("/questions");
            console.log("Questions received:", data);
            setQuestions(data);
        } catch (error) {
            console.error("Failed to load questions:", error);
        }
    };

    const handleEvaluate = async () => {
        if (!selectedQuestionId) return;
        setLoading(true);
        setResult(null);
        try {
            const res = await api.post(
                "/evaluations",
                {
                    question_id: selectedQuestionId,
                    provider: selectedProvider,
                    model_name: selectedModel
                }
            );
            setResult(res);
        } catch (e) {
            console.error(e);
            alert("Evaluation failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto min-h-screen bg-gray-50">
            <h1 className="text-3xl font-bold mb-6 text-gray-900">Run Evaluation</h1>

            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <div className="grid gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Select Question</label>
                        <select
                            className="w-full border border-gray-300 p-2 rounded text-gray-900"
                            onChange={(e) => setSelectedQuestionId(e.target.value)}
                            value={selectedQuestionId || ""}
                        >
                            <option value="">-- Select a Question --</option>
                            {questions.map((q) => (
                                <option key={q.id} value={q.id}>
                                    [{q.subject}] {q.text.substring(0, 80)}...
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">AI Provider</label>
                            <select
                                className="w-full border border-gray-300 p-2 rounded bg-white text-gray-900"
                                value={selectedProvider}
                                onChange={(e) => setSelectedProvider(e.target.value)}
                            >
                                <option value="openai">OpenAI</option>
                                <option value="google">Google</option>
                                <option value="anthropic">Anthropic</option>
                                <option value="deepseek">DeepSeek</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Model Name</label>
                            <input
                                className="w-full border border-gray-300 p-2 rounded bg-white text-gray-900 placeholder-gray-400"
                                value={selectedModel}
                                onChange={(e) => setSelectedModel(e.target.value)}
                                placeholder="Enter model name"
                            />
                        </div>
                    </div>

                    <button
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                        onClick={handleEvaluate}
                        disabled={loading || !selectedQuestionId}
                    >
                        {loading ? "Evaluating..." : "Run Truth Meter"}
                    </button>
                </div>
            </div>


            {result && (
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-3">📊 Evaluation Result</h3>

                    {/* Display the Question */}
                    <div className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">Question Evaluated:</h4>
                        <p className="text-gray-800 leading-relaxed">{questions.find(q => q.id === selectedQuestionId)?.text}</p>
                    </div>

                    {/* Scores */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="bg-blue-50 p-4 rounded-lg text-center border border-blue-200">
                            <div className="text-3xl font-bold text-blue-600">{result.accuracy_score}%</div>
                            <div className="text-sm text-gray-700 font-medium mt-1">Accuracy</div>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg text-center border border-green-200">
                            <div className="text-3xl font-bold text-green-600">{result.clarity_score}%</div>
                            <div className="text-sm text-gray-700 font-medium mt-1">Clarity</div>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg text-center border border-purple-200">
                            <div className="text-3xl font-bold text-purple-600">{result.completeness_score}%</div>
                            <div className="text-sm text-gray-700 font-medium mt-1">Completeness</div>
                        </div>
                    </div>

                    {/* TruthMeter Analysis */}
                    <div className="mb-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                            <span className="mr-2">🔍</span> TruthMeter Analysis
                        </h4>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-300">
                            <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{result.reasoning}</p>
                        </div>
                    </div>

                    {/* AI Response */}
                    <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                            <span className="mr-2">🤖</span> AI Response
                        </h4>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-300 max-h-96 overflow-y-auto">
                            <pre className="text-gray-800 leading-relaxed whitespace-pre-wrap font-sans">{result.response_text}</pre>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
