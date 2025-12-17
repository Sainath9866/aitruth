@echo off
REM AI Truth Meter - Quick Setup Script (Windows)
REM This script helps set up the project quickly

echo 🔍 AI Truth Meter - Setup Script
echo =================================
echo.

REM Check Python
echo ✓ Checking Python installation...
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python 3 is not installed. Please install Python 3.8+ first.
    exit /b 1
)
python --version

REM Check Node.js
echo ✓ Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    exit /b 1
)
node --version

echo.
echo 📦 Setting up Backend...
cd backend

REM Create virtual environment
if not exist "venv" (
    echo   Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
echo   Activating virtual environment...
call venv\Scripts\activate.bat

REM Install dependencies
echo   Installing Python dependencies...
python -m pip install --quiet --upgrade pip
pip install --quiet -r requirements.txt

REM Check for .env file
if not exist ".env" (
    echo   Creating .env file from template...
    copy .env.example .env
    echo.
    echo ⚠️  IMPORTANT: Please edit backend\.env and add your API keys!
    echo    You need at least one API key from: OpenAI, Anthropic, Google, Groq, or DeepSeek
    echo.
)

REM Populate questions
echo   Populating sample questions...
python populate_questions.py

cd ..

echo.
echo 📦 Setting up Frontend...
cd frontend

REM Install npm dependencies
echo   Installing npm dependencies...
call npm install

cd ..

echo.
echo ✅ Setup Complete!
echo.
echo 📝 Next Steps:
echo    1. Edit backend\.env and add your API keys
echo    2. Start the backend:
echo       cd backend ^&^& venv\Scripts\activate ^&^& uvicorn app.main:app --reload --port 8001
echo    3. In a new terminal, start the frontend:
echo       cd frontend ^&^& npm run dev
echo    4. Open http://localhost:3002 in your browser
echo.
echo 📚 For more details, see README.md
echo.
pause
