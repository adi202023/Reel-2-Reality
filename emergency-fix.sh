#!/bin/bash

echo "🚨 EMERGENCY SERVER FIX - Aggressive Process Cleanup"
echo "This will forcefully kill ALL conflicting processes"

# Kill ALL processes more aggressively
echo "🔥 Killing ALL Node.js and related processes..."

# Kill by port
lsof -ti:3001 | xargs kill -9 2>/dev/null || true
lsof -ti:8081 | xargs kill -9 2>/dev/null || true

# Kill by process name patterns
pkill -9 -f "node.*index.js" 2>/dev/null || true
pkill -9 -f "nodemon" 2>/dev/null || true
pkill -9 -f "node.*server" 2>/dev/null || true
pkill -9 -f "expo.*start" 2>/dev/null || true
pkill -9 -f "npm.*start" 2>/dev/null || true
pkill -9 node 2>/dev/null || true

# Wait longer for cleanup
echo "⏳ Waiting for processes to terminate..."
sleep 5

# Verify ports are free
echo "🔍 Checking if ports are free..."
if lsof -i:3001 > /dev/null 2>&1; then
    echo "⚠️  Port 3001 still in use, trying harder..."
    sudo lsof -ti:3001 | xargs sudo kill -9 2>/dev/null || true
    sleep 3
fi

# Navigate to server and clean up
cd server

# Remove any lock files
rm -f package-lock.json
rm -rf node_modules/.cache

# Clear ALL data files
echo "🧹 Clearing all data files..."
rm -rf data/
mkdir -p data

# Start server WITHOUT nodemon
echo "🚀 Starting server directly (no nodemon)..."
node index.js &
SERVER_PID=$!

echo "Server PID: $SERVER_PID"

# Wait and check
sleep 8

if kill -0 $SERVER_PID 2>/dev/null && lsof -i:3001 > /dev/null 2>&1; then
    echo "✅ SUCCESS! Server is running on port 3001"
    echo "🎯 Login: demo@business.com / password123"
    echo "🔗 API: http://localhost:3001/api/health"
    echo ""
    echo "🔄 REFRESH YOUR BROWSER NOW!"
else
    echo "❌ Still failed. Checking what's using port 3001:"
    lsof -i:3001
    echo ""
    echo "All node processes:"
    ps aux | grep node
fi
