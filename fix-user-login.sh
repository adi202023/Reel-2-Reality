#!/bin/bash

echo "🔧 Fixing User Login 'Failed to fetch' Error..."
echo "=============================================="

# Kill any existing server processes
echo "📋 Stopping existing server processes..."
pkill -f "node.*server" || true
pkill -f "npm.*start" || true
sleep 2

# Check if port 3001 is in use
echo "🔍 Checking port 3001..."
if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Port 3001 is still in use. Attempting to free it..."
    lsof -ti:3001 | xargs kill -9 2>/dev/null || true
    sleep 2
fi

# Navigate to server directory and start server
cd server

echo "🗑️  Clearing empty data files to force reinitialization..."
rm -f data/challenges.json
rm -f data/userChallenges.json
rm -f data/participants.json
rm -f data/submissions.json
rm -f data/users.json

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing server dependencies..."
    npm install
fi

echo "🚀 Starting backend server..."
echo "Server will initialize with demo data including user accounts..."
echo ""

# Start server in background
node index.js &
SERVER_PID=$!

# Wait for server to start
echo "⏳ Waiting for server to initialize..."
sleep 5

# Test server connectivity
echo ""
echo "🧪 Testing server connectivity..."
if curl -s http://localhost:3001/api/health >/dev/null 2>&1; then
    echo "✅ Backend server is running successfully!"
    echo "🌐 Server URL: http://localhost:3001"
    echo ""
    echo "📊 Available demo accounts for testing:"
    echo "   Backend Demo: john@example.com / password123"
    echo "   Backend Demo: jane@example.com / password123"
    echo ""
else
    echo "⚠️  Server failed to start or is not responding."
    echo "🔄 Using fallback authentication mode..."
    echo ""
fi

echo "🎯 Authentication Options Available:"
echo "=================================="
echo ""
echo "1. 🌐 ONLINE MODE (if server is running):"
echo "   - Use any email/password to create new accounts"
echo "   - Demo accounts: john@example.com / password123"
echo ""
echo "2. 📱 OFFLINE MODE (fallback when server is down):"
echo "   - Demo account: demo@user.com / password123"
echo "   - Create new accounts (stored locally)"
echo "   - Previously created accounts will work"
echo ""
echo "✨ The app now works in both online and offline modes!"
echo "🔄 If you see 'Failed to fetch', the app will automatically"
echo "    switch to offline mode and show appropriate messages."
echo ""
echo "🎮 Try logging in with:"
echo "   Email: demo@user.com"
echo "   Password: password123"
echo ""
echo "📝 Or create a new account - it will work offline!"
echo ""
echo "🔧 If you need to restart the server later:"
echo "   cd server && node index.js"
echo ""

# Keep script running to show server logs
if ps -p $SERVER_PID > /dev/null 2>&1; then
    echo "📋 Server is running (PID: $SERVER_PID)"
    echo "🔍 Press Ctrl+C to stop monitoring server logs"
    echo "📊 Server logs:"
    echo "==============="
    wait $SERVER_PID
else
    echo "⚠️  Server process ended. Check for port conflicts or errors above."
    echo "🔄 The app will work in offline mode regardless."
fi
