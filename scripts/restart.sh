#!/bin/bash
cd "$(dirname "$0")/.." || exit 1

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🚀 Full system restart...${NC}"
pkill -f "node" 2>/dev/null || true
pkill -f "expo" 2>/dev/null || true
pkill -f "webpack" 2>/dev/null || true
pkill -f "metro" 2>/dev/null || true
sleep 5
lsof -ti:3001 | xargs kill -9 2>/dev/null || true
lsof -ti:8081 | xargs kill -9 2>/dev/null || true
sleep 3

rm -rf node_modules/.cache .expo .next dist build 2>/dev/null
npm cache clean --force 2>/dev/null

cd server && { [ ! -d "node_modules" ] && npm install; }
cd .. && { [ ! -d "node_modules" ] && npm install; }

cleanup() {
    kill $BACKEND_PID 2>/dev/null || true
    kill $FRONTEND_PID 2>/dev/null || true
    pkill -f "node" 2>/dev/null || true
    pkill -f "expo" 2>/dev/null || true
    exit 0
}
trap cleanup INT TERM EXIT

echo -e "${GREEN}Starting backend...${NC}"
cd server && npm run dev > ../backend.log 2>&1 &
BACKEND_PID=$!
sleep 8

echo -e "${GREEN}Starting frontend...${NC}"
cd ..
export EXPO_DEVTOOLS_LISTEN_ADDRESS=0.0.0.0 EXPO_WEB_PORT=8081 NODE_ENV=development
npx expo start --web --port 8081 --clear --reset-cache > frontend.log 2>&1 &
FRONTEND_PID=$!
sleep 20

echo -e "${GREEN}✅ System ready: http://localhost:8081 | http://localhost:3001${NC}"
while kill -0 $BACKEND_PID 2>/dev/null && kill -0 $FRONTEND_PID 2>/dev/null; do sleep 3; done
cleanup
