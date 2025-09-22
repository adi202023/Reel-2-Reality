#!/bin/bash

# Quick start script to fix the "Failed to fetch" issue
echo "🚀 Quick Start - Fixing Backend Connection..."

# Kill any existing processes
echo "🧹 Cleaning up ports..."
lsof -ti:3001 | xargs kill -9 2>/dev/null || true
lsof -ti:8081 | xargs kill -9 2>/dev/null || true
sleep 2

# Start backend server
echo "🔥 Starting backend server..."
cd server

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    npm install
fi

# Start server directly with node (no nodemon dependency issues)
echo "✅ Starting backend on port 3001..."
node index.js &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Test backend connection
echo "🔍 Testing backend connection..."
if curl -s http://localhost:3001/api/health > /dev/null; then
    echo "✅ Backend is running successfully!"
    echo "🌐 Backend API: http://localhost:3001"
    echo "📋 Health check: http://localhost:3001/api/health"
else
    echo "❌ Backend failed to start. Checking logs..."
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

# Start frontend
cd ..
echo "🎨 Starting frontend..."

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

# Start frontend
echo "✅ Starting frontend on port 8081..."
npx expo start --web --port 8081 --clear &
FRONTEND_PID=$!

echo ""
echo "🎉 Servers are starting!"
echo "🔗 Frontend: http://localhost:8081"
echo "🔗 Backend: http://localhost:3001"
echo ""
echo "⏳ Wait 10-15 seconds for frontend to fully load..."
echo "🔄 Then refresh your browser if needed"
echo ""
echo "Press Ctrl+C to stop servers"

# Keep running
wait
