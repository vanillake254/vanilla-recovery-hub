#!/bin/bash

# Vanilla Recovery Hub - Installation Script
# This script sets up the development environment

set -e

echo "🚀 Vanilla Recovery Hub - Installation Script"
echo "=============================================="
echo ""

# Check Node.js version
echo "📋 Checking prerequisites..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version must be 18 or higher. Current: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install backend dependencies
echo ""
echo "📦 Installing backend dependencies..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Backend installation failed"
    exit 1
fi
echo "✅ Backend dependencies installed"

# Install frontend dependencies
echo ""
echo "📦 Installing frontend dependencies..."
cd ../frontend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Frontend installation failed"
    exit 1
fi
echo "✅ Frontend dependencies installed"

# Create environment files if they don't exist
cd ..
echo ""
echo "📝 Setting up environment files..."

if [ ! -f "backend/.env" ]; then
    cp backend/.env.example backend/.env
    echo "✅ Created backend/.env from template"
    echo "⚠️  Please edit backend/.env and add your credentials"
else
    echo "ℹ️  backend/.env already exists"
fi

if [ ! -f "frontend/.env.local" ]; then
    cp frontend/.env.local.example frontend/.env.local
    echo "✅ Created frontend/.env.local from template"
    echo "⚠️  Please edit frontend/.env.local and add your API URL"
else
    echo "ℹ️  frontend/.env.local already exists"
fi

# Create logs directory
mkdir -p backend/logs
echo "✅ Created logs directory"

echo ""
echo "=============================================="
echo "✨ Installation Complete!"
echo "=============================================="
echo ""
echo "📋 Next Steps:"
echo ""
echo "1. Configure backend/.env with your credentials:"
echo "   - MongoDB URI from mongodb.com"
echo "   - Flutterwave API keys from flutterwave.com"
echo "   - Generate JWT secret: node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\""
echo ""
echo "2. Configure frontend/.env.local:"
echo "   - Set NEXT_PUBLIC_API_URL=http://localhost:5000"
echo ""
echo "3. Start the backend:"
echo "   cd backend && npm run dev"
echo ""
echo "4. Start the frontend (in another terminal):"
echo "   cd frontend && npm run dev"
echo ""
echo "5. Open http://localhost:3000 in your browser"
echo ""
echo "📚 Documentation:"
echo "   - Quick Start: QUICK_START.md"
echo "   - Deployment: DEPLOYMENT.md"
echo "   - API Guide: DEVELOPER_GUIDE.md"
echo ""
echo "🎉 Happy coding!"
