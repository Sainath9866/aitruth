#!/bin/bash

# AI Truth Meter - Quick Setup Script
# Unified Next.js + MongoDB Architecture

set -e

echo "🔍 AI Truth Meter - Setup Script"
echo "================================="
echo ""

# Check Node.js
echo "✓ Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi
echo "  Node version: $(node --version)"

echo ""
echo "📦 Setting up Application..."
cd frontend

# Install npm dependencies
echo "  Installing npm dependencies..."
npm install

# Check for .env file
if [ ! -f ".env" ]; then
    echo "  Creating .env file from template..."
    cp .env.example .env
    echo ""
    echo "⚠️  IMPORTANT: Please edit frontend/.env and add your MONGO_URI and API keys!"
fi

echo ""
echo "✅ Setup Complete!"
echo ""
echo "📝 Next Steps:"
echo "   1. Edit frontend/.env and add your MONGO_URI and API keys"
echo "   2. Populate questions: node scripts/populate_mongo.js"
echo "   3. Start the app: npm run dev"
echo "   4. Open http://localhost:3002 in your browser"
echo ""
