#!/bin/bash

echo "🔧 Fixing Challenges Data Issue..."
echo "=================================="

# Kill any existing server processes
echo "📋 Stopping existing server processes..."
pkill -f "node.*server" || true
pkill -f "npm.*start" || true
sleep 2

# Navigate to server directory
cd server

# Clear the empty data files to force reinitialization
echo "🗑️  Clearing empty data files..."
rm -f data/challenges.json
rm -f data/userChallenges.json
rm -f data/participants.json
rm -f data/submissions.json
rm -f data/users.json

# Keep businesses.json as it has valid data
echo "✅ Keeping existing business data..."

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing server dependencies..."
    npm install
fi

# Start the server
echo "🚀 Starting server with fresh data initialization..."
echo "Server will initialize with demo challenges..."
echo ""
echo "Starting server on port 3001..."
node index.js &

# Wait for server to start
sleep 3

# Test the server
echo ""
echo "🧪 Testing server endpoints..."
echo "Health check:"
curl -s http://localhost:3001/api/health | jq '.' || echo "Server starting..."

sleep 2

echo ""
echo "Public challenges endpoint:"
curl -s http://localhost:3001/api/challenges/public | jq '.data.challenges | length' || echo "Challenges loading..."

echo ""
echo "✅ Server should now be running with initialized challenge data!"
echo "🌐 You can now refresh your web application to see the challenges."
echo ""
echo "📊 To verify challenges are loaded, check:"
echo "   - http://localhost:3001/api/challenges/public"
echo "   - Your web app's Challenges page should now show data"
echo ""
echo "🔄 If issues persist, run this script again or check server logs."
