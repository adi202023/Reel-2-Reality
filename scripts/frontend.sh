#!/bin/bash
cd "$(dirname "$0")/.." || exit 1

echo "🌐 Starting frontend only (backend should already be running)"
pkill -f "expo.*start" 2>/dev/null || true
pkill -f "webpack" 2>/dev/null || true
lsof -ti:8081 | xargs kill -9 2>/dev/null || true
sleep 3

curl -s http://localhost:3001/api/health > /dev/null 2>&1 && echo "✅ Backend running" || echo "⚠️  Backend not responding"
echo "🚀 Starting frontend on port 8081..."
npx expo start --web --port 8081 --clear &
echo "Frontend: http://localhost:8081 | Business Auth: http://localhost:8081/business-auth"
