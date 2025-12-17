# 🚀 Quick Start Guide

Just cloned the repo? Follow these steps:

## 1️⃣ Prerequisites
- Python 3.8+
- Node.js 18+
- At least one API key (OpenAI/Anthropic/Google/Groq/DeepSeek)

## 2️⃣ Quick Setup

### Option A: Automated Setup (Recommended)

**macOS/Linux:**
```bash
./setup.sh
```

**Windows:**
```batch
setup.bat
```

### Option B: Manual Setup

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env and add your API keys
python populate_questions.py
```

**Frontend:**
```bash
cd frontend
npm install
```

## 3️⃣ Configure API Keys

Edit `backend/.env`:
```env
OPENAI_API_KEY=sk-your-key-here
ANTHROPIC_API_KEY=sk-ant-your-key-here
GOOGLE_API_KEY=your-key-here
GROQ_API_KEY=gsk-your-key-here
DEEPSEEK_API_KEY=your-key-here
```

> **Note:** You only need at least ONE valid API key to run the app.

## 4️⃣ Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate  # Windows: venv\Scripts\activate
uvicorn app.main:app --reload --port 8001
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## 5️⃣ Access the App

Open your browser and go to:
- **Frontend:** http://localhost:3002
- **Backend API Docs:** http://localhost:8001/docs

## ✅ You're Done!

Start by:
1. Visiting `/questions` to see the question bank
2. Going to `/evaluations` to test AI models
3. Checking `/analytics` for performance insights

---

**Having issues?** See the full [README.md](README.md#-troubleshooting) for troubleshooting.
