#!/bin/bash

echo "🌐 STARTING FRONTEND ONLY (Backend already running)"

# Kill any existing frontend processes
echo "🔄 Cleaning up existing frontend processes..."
pkill -f "expo.*start" 2>/dev/null || true
pkill -f "webpack" 2>/dev/null || true
pkill -f "react-scripts" 2>/dev/null || true
lsof -ti:8081 | xargs kill -9 2>/dev/null || true

# Wait for cleanup
sleep 3

# Verify backend is running
if curl -s http://localhost:3001/api/health > /dev/null 2>&1; then
    echo "✅ Backend is running on port 3001"
else
    echo "⚠️  Backend not responding, but continuing with frontend..."
fi

# Start frontend
echo "🚀 Starting frontend on port 8081..."
npx expo start --web --port 8081 --clear &
FRONTEND_PID=$!

echo "Frontend PID: $FRONTEND_PID"
echo "⏳ Waiting for frontend to start..."

# Wait and check
sleep 20

if curl -s http://localhost:8081 > /dev/null 2>&1; then
    echo ""
    echo "🎉 SUCCESS! Frontend is running!"
    echo ""
    echo "🔗 OPEN THESE URLS IN YOUR BROWSER:"
    echo "   🏠 Home: http://localhost:8081"
    echo "   🏢 Business Login: http://localhost:8081/business-auth"
    echo "   📊 Backend API: http://localhost:3001/api/health"
    echo ""
    echo "🔑 Demo Login:"
    echo "   Email: demo@business.com"
    echo "   Password: password123"
    echo ""
    echo "✨ Ready to use! The connection error should be gone now."
else
    echo ""
    echo "⚠️  Frontend still starting... Give it a moment and try:"
    echo "   http://localhost:8081/business-auth"
fi

echo ""
echo "📋 To monitor: tail -f frontend.log"
echo "🛑 To stop: Press Ctrl+C or kill $FRONTEND_PID"
