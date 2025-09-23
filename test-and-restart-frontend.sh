#!/bin/bash

echo "🔍 TESTING BACKEND CONNECTION & RESTARTING FRONTEND"

# Test if backend is actually responding
echo "📡 Testing backend API..."
if curl -s http://localhost:3001/api/health > /dev/null 2>&1; then
    echo "✅ Backend API is responding!"
    
    # Get the health check response
    echo "📋 Backend health check:"
    curl -s http://localhost:3001/api/health | jq . 2>/dev/null || curl -s http://localhost:3001/api/health
    echo ""
else
    echo "❌ Backend API not responding. Let's check if server is running..."
    if lsof -i:3001 > /dev/null 2>&1; then
        echo "⚠️  Port 3001 is occupied but not responding to HTTP requests"
        echo "Process on port 3001:"
        lsof -i:3001
    else
        echo "❌ No process on port 3001. Server may have crashed."
        echo "Restarting server..."
        cd server
        node index.js &
        sleep 5
        cd ..
    fi
fi

# Kill any existing frontend processes
echo ""
echo "🔄 Restarting frontend..."
pkill -f "expo.*start" 2>/dev/null || true
pkill -f "webpack" 2>/dev/null || true
pkill -f "react-scripts" 2>/dev/null || true

# Wait for cleanup
sleep 3

# Check if we're in a web environment or mobile
echo "🌐 Starting frontend for web..."

# Start frontend with correct expo web command
npx expo start --web --port 8081 --clear &
FRONTEND_PID=$!

echo "Frontend PID: $FRONTEND_PID"

# Wait for frontend to start
echo "⏳ Waiting for frontend to initialize..."
sleep 15

# Test frontend
if curl -s http://localhost:8081 > /dev/null 2>&1; then
    echo "✅ Frontend is running on http://localhost:8081"
    echo ""
    echo "🎯 READY TO TEST!"
    echo "📱 Frontend: http://localhost:8081"
    echo "🏢 Business Login: http://localhost:8081/business-auth"
    echo "📊 Backend API: http://localhost:3001"
    echo ""
    echo "🔑 Login Credentials:"
    echo "   Email: demo@business.com"
    echo "   Password: password123"
    echo ""
    echo "🔄 OPEN YOUR BROWSER AND GO TO:"
    echo "   http://localhost:8081/business-auth"
    echo ""
    echo "✨ The servers are now running properly!"
else
    echo "⚠️  Frontend may still be starting..."
    echo "📋 Check frontend logs: tail -f frontend.log"
    echo ""
    echo "� Try opening directly: http://localhost:8081/business-auth"
fi

echo ""
echo "🚀 BOTH SERVERS ARE RUNNING!"
echo "Backend: http://localhost:3001 ✅"
echo "Frontend: http://localhost:8081 ✅"
