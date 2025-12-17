# 🔍 AI Truth Meter

An intelligent system for evaluating AI model responses across multiple providers using an objective evaluation framework. Compare accuracy, clarity, and completeness of answers from OpenAI, Google Gemini, Anthropic Claude, Groq, and DeepSeek.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.8+-blue.svg)
![Node](https://img.shields.io/badge/node-18+-green.svg)

## ✨ Features

- 📊 **Multi-Model Evaluation**: Test responses from multiple AI providers simultaneously
- 🎯 **Objective Scoring**: Evaluate responses on accuracy, clarity, and completeness
- 📈 **Analytics Dashboard**: Visualize performance metrics across models and subjects
- 🎓 **Subject-Based Testing**: Pre-configured questions for Math, Science, History, and more
- 🔄 **Real-time Comparison**: Side-by-side model performance analysis

## 🏗️ Architecture

- **Frontend**: Next.js 16 + React 19 + TypeScript + Tailwind CSS
- **Backend**: FastAPI + SQLAlchemy + SQLite
- **AI Integration**: OpenAI, Google Gemini, Anthropic, Groq, DeepSeek APIs
- **Data Visualization**: Recharts

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.8+** ([Download](https://www.python.org/downloads/))
- **Node.js 18+** ([Download](https://nodejs.org/))
- **npm** or **yarn** (comes with Node.js)

## 🔑 Required API Keys

You'll need API keys from at least one of these providers:

1. **OpenAI** - [Get API Key](https://platform.openai.com/api-keys)
2. **Anthropic (Claude)** - [Get API Key](https://console.anthropic.com/)
3. **Google AI (Gemini)** - [Get API Key](https://makersuite.google.com/app/apikey)
4. **Groq** - [Get API Key](https://console.groq.com/keys)
5. **DeepSeek** - [Get API Key](https://platform.deepseek.com/api_keys)

> **Note**: You don't need all API keys to run the application. The system will only use models for which you have provided valid API keys.

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/ai-truth-meter.git
cd ai-truth-meter
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create a virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env

# Edit .env file with your API keys
# Open .env in your favorite editor and add your API keys
nano .env  # or use any text editor
```

#### Backend `.env` Configuration

Edit the `.env` file and add your API keys:

```env
# Add the API keys you have (not all are required)
OPENAI_API_KEY=sk-your-openai-key-here
ANTHROPIC_API_KEY=sk-ant-your-anthropic-key-here
GOOGLE_API_KEY=your-google-ai-key-here
GROQ_API_KEY=gsk-your-groq-key-here
DEEPSEEK_API_KEY=your-deepseek-key-here
```

#### Initialize Database & Populate Questions

```bash
# The database will be created automatically on first run
# To populate with sample questions:
python populate_questions.py
```

#### Start Backend Server

```bash
# Run the FastAPI server
uvicorn app.main:app --reload --port 8001

# Backend will be available at http://localhost:8001
# API documentation at http://localhost:8001/docs
```

### 3. Frontend Setup

Open a **new terminal window** and:

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Frontend will be available at http://localhost:3002
```

## 🎮 Usage

1. **Access the Application**: Open your browser and navigate to `http://localhost:3002`

2. **Question Bank** (`/questions`):
   - View pre-populated questions across different subjects
   - Add new custom questions for testing
   - Manage existing questions

3. **Run Evaluations** (`/evaluations`):
   - Select a question from the bank
   - Choose which AI models to test
   - View real-time evaluation results
   - See detailed scoring breakdown

4. **Analytics Dashboard** (`/analytics`):
   - View overall performance metrics
   - Compare models side-by-side
   - Analyze accuracy by subject
   - Track evaluation trends

## 📁 Project Structure

```
ai-truth-meter/
├── backend/
│   ├── app/
│   │   ├── models.py              # Database models
│   │   ├── main.py                # FastAPI application
│   │   ├── routers/               # API endpoints
│   │   │   ├── questions.py
│   │   │   ├── evaluations.py
│   │   │   ├── analytics.py
│   │   │   └── model_info.py
│   │   └── services/
│   │       ├── llm_service.py     # AI model integration
│   │       └── truthmeter_judge.py # Evaluation logic
│   ├── .env.example               # Environment template
│   ├── requirements.txt           # Python dependencies
│   └── populate_questions.py      # Sample data script
│
├── frontend/
│   ├── app/
│   │   ├── page.tsx               # Home page
│   │   ├── questions/page.tsx     # Question management
│   │   ├── evaluations/page.tsx   # Testing interface
│   │   └── analytics/page.tsx     # Dashboard
│   ├── lib/
│   │   └── api.ts                 # API client
│   └── package.json               # Node dependencies
│
└── README.md
```

## 🔧 Configuration

### Backend Port

By default, the backend runs on **port 8001**. To change:

```bash
uvicorn app.main:app --reload --port YOUR_PORT
```

Also update the frontend API configuration in `frontend/lib/api.ts`.

### Frontend Port

The frontend runs on **port 3002** by default. To change, update `package.json`:

```json
"scripts": {
  "dev": "next dev -p YOUR_PORT"
}
```

### CORS Configuration

If you change ports, update CORS settings in `backend/app/main.py`:

```python
allow_origins=["http://localhost:YOUR_FRONTEND_PORT"]
```

## 🧪 Testing

### Test Backend API

```bash
# Visit the interactive API documentation
http://localhost:8001/docs

# Or test with curl
curl http://localhost:8001/
```

### Test Frontend

Simply navigate to `http://localhost:3002` in your browser.

## 🐛 Troubleshooting

### Backend Issues

**Port already in use:**
```bash
# Kill process on port 8001 (macOS/Linux)
lsof -ti:8001 | xargs kill -9

# Windows
netstat -ano | findstr :8001
taskkill /PID <PID> /F
```

**Missing dependencies:**
```bash
pip install -r requirements.txt --upgrade
```

**Database errors:**
```bash
# Delete and recreate database
rm truth_meter.db
python populate_questions.py
```

### Frontend Issues

**Port conflict:**
```bash
# Kill process on port 3002
lsof -ti:3002 | xargs kill -9
```

**Module not found:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Build errors:**
```bash
npm run build
```

### API Key Issues

- Ensure API keys are properly formatted in `.env`
- Check for typos or extra spaces
- Verify keys are active and have sufficient credits
- Check API provider's status page for outages

## 📊 Database Schema

The application uses SQLite with the following main tables:

- **questions**: Stores test questions with subjects and reference answers
- **evaluations**: Stores model responses and evaluation scores
- **models**: Tracks available AI models and their configurations

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with FastAPI, Next.js, and modern AI APIs
- Inspired by the need for objective AI model evaluation
- Charts powered by Recharts

## 📧 Support

If you encounter any issues or have questions:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Review API documentation at `http://localhost:8001/docs`
3. Open an issue on GitHub

---

**Made with ❤️ for transparent AI evaluation**
