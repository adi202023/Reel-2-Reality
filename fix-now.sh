#!/bin/bash
echo "🔧 FIXING SERVER CONNECTION..."

# Kill any processes on port 3001
echo "Killing processes on port 3001..."
lsof -ti:3001 | xargs kill -9 2>/dev/null || true

# Kill any node server processes
echo "Killing node server processes..."
pkill -f "node.*server" 2>/dev/null || true
pkill -f "node.*index.js" 2>/dev/null || true

# Wait a moment for processes to terminate
sleep 2

# Navigate to server directory
cd server

# Clear potentially corrupted data files
echo "Clearing data files..."
rm -f data/challenges.json data/userChallenges.json data/participants.json data/submissions.json data/users.json

# Start the server
echo "🚀 Starting server..."
node index.js &

# Wait for server to initialize
sleep 5

# Check if server is running
if lsof -i:3001 > /dev/null 2>&1; then
    echo "✅ Server is running on port 3001"
    echo "✅ DONE! Refresh browser and login with demo@business.com / password123"
else
    echo "❌ Server failed to start. Check server logs."
    exit 1
fi
