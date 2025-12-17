"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">AI Truth Meter</h1>
          <div className="space-x-4">
            <Link href="/questions" className="text-gray-600 hover:text-blue-600">Question Bank</Link>
            <Link href="/evaluations" className="text-gray-600 hover:text-blue-600">Run Evaluation</Link>
            <Link href="/analytics" className="text-gray-600 hover:text-blue-600">Analytics</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-8">
        <div className="text-center py-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Measure AI Reliability</h2>
          <p className="text-xl text-gray-600 mb-8">
            Compare ChatGPT, Gemini, Claude, and DeepSeek using our proprietary TruthMeter evaluation system.
          </p>

          <div className="flex justify-center gap-4">
            <Link
              href="/questions"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Manage Questions
            </Link>
            <Link
              href="/evaluations"
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Start Evaluating
            </Link>
            <Link
              href="/analytics"
              className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
            >
              View Analytics
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold mb-2 text-gray-900">Accuracy Tracking</h3>
            <p className="text-gray-600">Automated scoring using our proprietary TruthMeter-Judge AI model.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold mb-2 text-gray-900">Multi-Model Support</h3>
            <p className="text-gray-600">Test OpenAI, Google, Anthropic, and DeepSeek models side-by-side.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold mb-2 text-gray-900">Detailed Analytics</h3>
            <p className="text-gray-600">Comprehensive breakdown of scores by subject, clarity, and completeness.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
