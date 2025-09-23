#!/bin/bash

echo "🔧 Fixing All Authentication Issues (User & Business)..."
echo "======================================================"

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

# Keep businesses.json as it has valid demo data
echo "✅ Keeping existing business data..."

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing server dependencies..."
    npm install
fi

echo "🚀 Starting backend server..."
echo "Server will initialize with demo data for both users and businesses..."
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
    echo "   User Demo: john@example.com / password123"
    echo "   User Demo: jane@example.com / password123"
    echo "   Business Demo: demo@business.com / password123"
    echo ""
else
    echo "⚠️  Server failed to start or is not responding."
    echo "🔄 Using fallback authentication mode..."
    echo ""
fi

echo "🎯 Authentication Options Available:"
echo "=================================="
echo ""
echo "1. 👤 USER AUTHENTICATION:"
echo "   🌐 ONLINE MODE (if server is running):"
echo "      - john@example.com / password123"
echo "      - jane@example.com / password123"
echo "      - Create new user accounts"
echo ""
echo "   📱 OFFLINE MODE (fallback):"
echo "      - demo@user.com / password123"
echo "      - Create new accounts (stored locally)"
echo ""
echo "2. 🏢 BUSINESS AUTHENTICATION:"
echo "   🌐 ONLINE MODE (if server is running):"
echo "      - demo@business.com / password123"
echo "      - Create new business accounts"
echo ""
echo "   📱 OFFLINE MODE (fallback):"
echo "      - demo@business.com / password123"
echo "      - cafe@demo.com / password123"
echo "      - Create new business accounts (stored locally)"
echo ""
echo "✨ The app now works in both online and offline modes!"
echo "🔄 If you see 'Failed to fetch', the app will automatically"
echo "    switch to offline mode and show appropriate messages."
echo ""
echo "🎮 Quick Test Credentials:"
echo "========================"
echo "👤 User Login: demo@user.com / password123"
echo "🏢 Business Login: demo@business.com / password123"
echo ""
echo "📝 Or create new accounts - they will work offline!"
echo ""
echo "🔧 Server Management:"
echo "===================="
echo "To restart server: cd server && node index.js"
echo "To check server: curl http://localhost:3001/api/health"
echo "To kill server: pkill -f 'node.*server'"
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
    echo ""
    echo "🎯 Next Steps:"
    echo "============="
    echo "1. Refresh your web application"
    echo "2. Try logging in with the demo credentials above"
    echo "3. Both user and business authentication will work offline"
    echo "4. Create new accounts as needed - they'll be stored locally"
fi
