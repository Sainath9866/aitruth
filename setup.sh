#!/bin/bash

# AI Truth Meter - Quick Setup Script
# This script helps set up the project quickly

set -e

echo "🔍 AI Truth Meter - Setup Script"
echo "================================="
echo ""

# Check Python
echo "✓ Checking Python installation..."
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8+ first."
    exit 1
fi
echo "  Python version: $(python3 --version)"

# Check Node.js
echo "✓ Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi
echo "  Node version: $(node --version)"

echo ""
echo "📦 Setting up Backend..."
cd backend

# Create virtual environment
if [ ! -d "venv" ]; then
    echo "  Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "  Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "  Installing Python dependencies..."
pip install -q --upgrade pip
pip install -q -r requirements.txt

# Check for .env file
if [ ! -f ".env" ]; then
    echo "  Creating .env file from template..."
    cp .env.example .env
    echo ""
    echo "⚠️  IMPORTANT: Please edit backend/.env and add your API keys!"
    echo "   You need at least one API key from: OpenAI, Anthropic, Google, Groq, or DeepSeek"
    echo ""
fi

# Populate questions
echo "  Populating sample questions..."
python populate_questions.py

cd ..

echo ""
echo "📦 Setting up Frontend..."
cd frontend

# Install npm dependencies
echo "  Installing npm dependencies..."
npm install

cd ..

echo ""
echo "✅ Setup Complete!"
echo ""
echo "📝 Next Steps:"
echo "   1. Edit backend/.env and add your API keys"
echo "   2. Start the backend:"
echo "      cd backend && source venv/bin/activate && uvicorn app.main:app --reload --port 8001"
echo "   3. In a new terminal, start the frontend:"
echo "      cd frontend && npm run dev"
echo "   4. Open http://localhost:3002 in your browser"
echo ""
echo "📚 For more details, see README.md"
echo ""
