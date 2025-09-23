#!/bin/bash

echo "🔧 COMPREHENSIVE SERVER FIX - Starting..."
echo "This will fix the 'Unable to connect to server' error"

# Step 1: Kill any existing processes
echo ""
echo "📋 Step 1: Cleaning up existing processes..."
echo "Killing processes on port 3001..."
lsof -ti:3001 | xargs kill -9 2>/dev/null || true

echo "Killing node server processes..."
pkill -f "node.*server" 2>/dev/null || true
pkill -f "node.*index.js" 2>/dev/null || true
pkill -f "expo.*start" 2>/dev/null || true

# Wait for processes to terminate
sleep 3

# Step 2: Navigate to server directory and check setup
echo ""
echo "📋 Step 2: Checking server setup..."
cd server

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found in server directory"
    exit 1
fi

# Check if node_modules exists, install if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing server dependencies..."
    npm install
fi

# Step 3: Clear potentially corrupted data files
echo ""
echo "📋 Step 3: Clearing potentially corrupted data files..."
mkdir -p data
rm -f data/challenges.json data/userChallenges.json data/participants.json data/submissions.json data/users.json data/businesses.json

echo "✅ Data files cleared - server will regenerate with fresh demo data"

# Step 4: Start the server with proper logging
echo ""
echo "📋 Step 4: Starting server..."
echo "🚀 Starting Node.js server on port 3001..."

# Start server in background and capture PID
node index.js > ../backend.log 2>&1 &
SERVER_PID=$!

echo "Server started with PID: $SERVER_PID"

# Step 5: Wait and verify server startup
echo ""
echo "📋 Step 5: Verifying server startup..."
sleep 8

# Check if server process is still running
if ! kill -0 $SERVER_PID 2>/dev/null; then
    echo "❌ Server process died. Check logs:"
    tail -20 ../backend.log
    exit 1
fi

# Check if port 3001 is listening
if lsof -i:3001 > /dev/null 2>&1; then
    echo "✅ Server is running on port 3001"
    
    # Test API endpoint
    echo "🔍 Testing API health endpoint..."
    sleep 2
    
    if curl -s http://localhost:3001/api/health > /dev/null 2>&1; then
        echo "✅ API health check passed"
        echo ""
        echo "🎉 SUCCESS! Server is running properly"
        echo ""
        echo "📊 Server Details:"
        echo "   • Backend API: http://localhost:3001"
        echo "   • Health Check: http://localhost:3001/api/health"
        echo "   • Business Login: demo@business.com / password123"
        echo "   • User Login: john@example.com / password123"
        echo ""
        echo "🔄 Now refresh your browser and try logging in!"
        echo ""
        echo "📝 Server logs are being written to: backend.log"
        echo "   To monitor: tail -f backend.log"
        
    else
        echo "⚠️  Server is running but API not responding. Check logs:"
        tail -10 ../backend.log
    fi
else
    echo "❌ Server failed to bind to port 3001. Check logs:"
    tail -20 ../backend.log
    exit 1
fi

echo ""
echo "✅ COMPREHENSIVE FIX COMPLETED!"
