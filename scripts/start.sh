#!/bin/bash
cd "$(dirname "$0")/.." || exit 1

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🚀 Starting Reel-to-Reality Business System...${NC}"

check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo -e "${YELLOW}⚠️  Port $1 is already in use${NC}"
        return 0
    else
        return 1
    fi
}

echo -e "${BLUE}🧹 Cleaning up existing processes...${NC}"
pkill -f "node.*3001" 2>/dev/null || true
pkill -f "expo.*8081" 2>/dev/null || true
pkill -f "webpack.*8081" 2>/dev/null || true
pkill -f "metro" 2>/dev/null || true
sleep 3

check_port 3001 && { lsof -ti:3001 | xargs kill -9 2>/dev/null || true; sleep 2; }
check_port 8081 && { lsof -ti:8081 | xargs kill -9 2>/dev/null || true; sleep 2; }
echo -e "${GREEN}✅ Ports cleaned up${NC}"

echo -e "${BLUE}📦 Installing dependencies...${NC}"
cd server && { [ ! -d "node_modules" ] && npm install || echo -e "${GREEN}✅ Backend deps OK${NC}"; }
cd .. && { [ ! -d "node_modules" ] && npm install || echo -e "${GREEN}✅ Frontend deps OK${NC}"; }

cleanup() {
    echo -e "\n${RED}🛑 Stopping servers...${NC}"
    kill $BACKEND_PID 2>/dev/null || true
    kill $FRONTEND_PID 2>/dev/null || true
    pkill -f "node.*3001" 2>/dev/null || true
    pkill -f "expo.*8081" 2>/dev/null || true
    pkill -f "webpack.*8081" 2>/dev/null || true
    pkill -f "metro" 2>/dev/null || true
    echo -e "${GREEN}✅ Servers stopped${NC}"
    exit 0
}
trap cleanup INT TERM EXIT

echo -e "${GREEN}Starting backend on port 3001...${NC}"
cd server && npm run dev > ../backend.log 2>&1 &
BACKEND_PID=$!
sleep 5
if ! kill -0 $BACKEND_PID 2>/dev/null; then
    echo -e "${RED}❌ Backend failed to start${NC}"
    cat ../backend.log
    exit 1
fi

echo -e "${GREEN}Starting frontend on port 8081...${NC}"
cd ..
export EXPO_DEVTOOLS_LISTEN_ADDRESS=0.0.0.0 EXPO_WEB_PORT=8081
npx expo start --web --port 8081 --clear --minify > frontend.log 2>&1 &
FRONTEND_PID=$!
sleep 15
if ! kill -0 $FRONTEND_PID 2>/dev/null; then
    echo -e "${RED}❌ Frontend failed to start${NC}"
    cat frontend.log
    exit 1
fi

echo -e "${GREEN}✅ Servers started!${NC}"
echo -e "${BLUE}Backend: ${YELLOW}http://localhost:3001${NC}"
echo -e "${BLUE}Frontend: ${YELLOW}http://localhost:8081${NC}"
echo -e "${YELLOW}Demo: demo@business.com / password123${NC}"
echo -e "${RED}Press Ctrl+C to stop${NC}"

while true; do
    kill -0 $BACKEND_PID 2>/dev/null || { tail -20 backend.log; break; }
    kill -0 $FRONTEND_PID 2>/dev/null || { tail -20 frontend.log; break; }
    sleep 2
done
cleanup
