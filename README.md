# 🔍 AI Truth Meter

An intelligent system for evaluating AI model responses across multiple providers using an objective evaluation framework. Compare accuracy, clarity, and completeness of answers from OpenAI, Google Gemini, Anthropic Claude, Groq, and DeepSeek.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-18+-green.svg)
![MongoDB](https://img.shields.io/badge/database-MongoDB-green.svg)

## ✨ Features

- 📊 **Multi-Model Evaluation**: Test responses from multiple AI providers simultaneously
- 🎯 **Objective Scoring**: Evaluate responses on accuracy, clarity, and completeness
- 📈 **Analytics Dashboard**: Visualize performance metrics across models and subjects
- 🎓 **Subject-Based Testing**: Pre-configured questions for Math, Science, History, and more
- 🔄 **Real-time Comparison**: Side-by-side model performance analysis
- ⚡ **Next.js 16 Architecture**: Unified frontend and backend for easy deployment

## 🏗️ Architecture

- **Framework**: Next.js 16 + React 19 + TypeScript + Tailwind CSS
- **Database**: MongoDB (Atlas or Local)
- **AI Integration**: OpenAI, Google Gemini, Anthropic, Groq, DeepSeek APIs
- **Data Visualization**: Recharts

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js 18+** ([Download](https://nodejs.org/))
- **MongoDB** (Atlas account or local installation)
- **npm** or **yarn**

## 🔑 Required Configuration

Create a `.env` file in the `frontend` directory (use `.env.example` as a template):

```env
MONGO_URI=mongodb+srv://your-mongodb-uri
OPENAI_API_KEY=sk-your-openai-key
ANTHROPIC_API_KEY=sk-ant-your-anthropic-key
GOOGLE_API_KEY=your-google-ai-key
GROQ_API_KEY=gsk-your-groq-key
DEEPSEEK_API_KEY=your-deepseek-key
```

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Sainath9866/aitruth.git
cd aitruth
```

### 2. Setup & Run

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Populate initial questions (ensure .env is configured)
node scripts/populate_mongo.js

# Start development server
npm run dev
```

The application will be available at `http://localhost:3002`.

## 🎮 Usage

1. **Access the Application**: Open your browser to `http://localhost:3002`
2. **Question Bank** (`/questions`): Manage and view test questions.
3. **Run Evaluations** (`/evaluations`): Select a question and models to test.
4. **Analytics Dashboard** (`/analytics`): View performance metrics and comparisons.

## 📁 Project Structure

```
aitruth/
├── frontend/
│   ├── app/
│   │   ├── api/               # Next.js API Routes (Backend)
│   │   ├── questions/         # Question management UI
│   │   ├── evaluations/       # Testing interface UI
│   │   └── analytics/         # Dashboard UI
│   ├── lib/
│   │   ├── services/          # Core logic (LLM & Judge)
│   │   ├── mongodb.ts         # Database connection
│   │   └── api.ts             # Frontend API client
│   ├── scripts/               # Utility scripts (population)
│   └── .env.example           # Environment template
└── README.md
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.
