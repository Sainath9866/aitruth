"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

interface Question {
    id: string;
    text: string;
    subject: string;
    reference_answer: string;
    difficulty: string;
}

export default function QuestionsPage() {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [newQuestion, setNewQuestion] = useState({
        text: "",
        subject: "Math",
        reference_answer: "",
        difficulty: "Medium",
    });

    useEffect(() => {
        loadQuestions();
    }, []);

    const loadQuestions = async () => {
        const data = await api.get("/questions");
        setQuestions(data);
    };

    const handleCreate = async () => {
        await api.post("/questions/", newQuestion);
        setNewQuestion({ text: "", subject: "Math", reference_answer: "", difficulty: "Medium" });
        loadQuestions();
    };

    const handleDelete = async (id: string) => {
        await api.delete(`/questions/${id}`);
        loadQuestions();
    };

    return (
        <div className="p-8 max-w-4xl mx-auto min-h-screen bg-gray-50">
            <h1 className="text-3xl font-bold mb-6 text-gray-900">Question Bank</h1>

            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-xl font-semibold mb-4 text-gray-900">Add New Question</h2>
                <div className="grid gap-4">
                    <input
                        className="border border-gray-300 p-2 rounded text-gray-900 placeholder-gray-500"
                        placeholder="Question Text"
                        value={newQuestion.text}
                        onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
                    />
                    <input
                        className="border border-gray-300 p-2 rounded text-gray-900 placeholder-gray-500"
                        placeholder="Subject"
                        value={newQuestion.subject}
                        onChange={(e) => setNewQuestion({ ...newQuestion, subject: e.target.value })}
                    />
                    <textarea
                        className="border border-gray-300 p-2 rounded text-gray-900 placeholder-gray-500"
                        placeholder="Reference Answer"
                        value={newQuestion.reference_answer}
                        onChange={(e) => setNewQuestion({ ...newQuestion, reference_answer: e.target.value })}
                    />
                    <button
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        onClick={handleCreate}
                    >
                        Add Question
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                {questions.map((q) => (
                    <div key={q.id} className="bg-white p-4 rounded-lg shadow border border-gray-200">
                        <div className="flex justify-between items-start">
                            <div>
                                <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded mb-2">
                                    {q.subject}
                                </span>
                                <h3 className="font-medium text-lg text-gray-900">{q.text}</h3>
                                <p className="text-gray-600 mt-1 text-sm">Ref: {q.reference_answer}</p>
                            </div>
                            <button
                                className="text-red-500 hover:text-red-700"
                                onClick={() => handleDelete(q.id)}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
