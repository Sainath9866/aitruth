"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Link from "next/link";

interface OverviewStats {
    total_evaluations: number;
    avg_accuracy: number;
    avg_clarity: number;
    avg_completeness: number;
    total_questions: number;
}

interface SubjectData {
    subject: string;
    count: number;
    avg_accuracy: number;
    avg_clarity: number;
    avg_completeness: number;
    [key: string]: any;  // Index signature for Recharts compatibility
}

interface ModelData {
    model: string;
    count: number;
    avg_accuracy: number;
    avg_clarity: number;
    avg_completeness: number;
    [key: string]: any;  // Index signature for Recharts compatibility
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export default function AnalyticsPage() {
    const [overview, setOverview] = useState<OverviewStats | null>(null);
    const [subjectData, setSubjectData] = useState<SubjectData[]>([]);
    const [modelData, setModelData] = useState<ModelData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [overviewRes, subjectRes, modelRes] = await Promise.all([
                api.get("/analytics/overview"),
                api.get("/analytics/by-subject"),
                api.get("/analytics/by-model"),
            ]);
            setOverview(overviewRes);
            setSubjectData(subjectRes);
            setModelData(modelRes);
        } catch (e) {
            console.error("Failed to load analytics", e);
            setError("Failed to load analytics data");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-900 mb-8">📊 Analytics Dashboard</h1>

                {loading && <p className="text-gray-800">Loading analytics...</p>}
                {error && <p className="text-red-600">{error}</p>}

                {!loading && !error && overview && (
                    <>
                        {/* Overview Cards */}
                        <div className="grid grid-cols-5 gap-4 mb-8">
                            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 text-center">
                                <div className="text-3xl font-bold text-blue-600">{overview.total_evaluations}</div>
                                <div className="text-sm text-gray-700 mt-2">Total Tests</div>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 text-center">
                                <div className="text-3xl font-bold text-green-600">{overview.avg_accuracy.toFixed(1)}%</div>
                                <div className="text-sm text-gray-700 mt-2">Avg Accuracy</div>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 text-center">
                                <div className="text-3xl font-bold text-purple-600">{overview.avg_clarity.toFixed(1)}%</div>
                                <div className="text-sm text-gray-700 mt-2">Avg Clarity</div>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 text-center">
                                <div className="text-3xl font-bold text-orange-600">{overview.avg_completeness.toFixed(1)}%</div>
                                <div className="text-sm text-gray-700 mt-2">Avg Completeness</div>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 text-center">
                                <div className="text-3xl font-bold text-gray-900">{overview.total_questions}</div>
                                <div className="text-sm text-gray-700 mt-2">Questions</div>
                            </div>
                        </div>

                        {/* By Subject */}
                        {subjectData.length > 0 && (
                            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-8">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">� Accuracy by Subject</h2>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={subjectData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="subject" />
                                        <YAxis domain={[0, 100]} />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="avg_accuracy" fill="#3B82F6" name="Accuracy" />
                                        <Bar dataKey="avg_clarity" fill="#10B981" name="Clarity" />
                                        <Bar dataKey="avg_completeness" fill="#F59E0B" name="Completeness" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        )}

                        {/* Model Comparison */}
                        {modelData.length > 0 && (
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                                    <h2 className="text-xl font-bold text-gray-900 mb-4">🤖 Model Comparison</h2>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={modelData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="model" angle={-15} textAnchor="end" height={80} />
                                            <YAxis domain={[0, 100]} />
                                            <Tooltip />
                                            <Legend />
                                            <Bar dataKey="avg_accuracy" fill="#3B82F6" name="Accuracy" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>

                                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                                    <h2 className="text-xl font-bold text-gray-900 mb-4">📊 Evaluation Distribution</h2>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie
                                                data={modelData}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={(entry: any) => `${entry.model.split('/')[1] || entry.model}: ${entry.count}`}
                                                outerRadius={80}
                                                fill="#8884d8"
                                                dataKey="count"
                                            >
                                                {modelData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
