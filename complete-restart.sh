#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 COMPLETE SYSTEM RESTART - Reel-to-Reality${NC}"

# Function to check if port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo -e "${YELLOW}⚠️  Port $1 is already in use${NC}"
        return 0
    else
        return 1
    fi
}

# COMPLETE CLEANUP - Kill everything
echo -e "${BLUE}🧹 COMPLETE CLEANUP - Killing all processes...${NC}"
pkill -f "node" 2>/dev/null || true
pkill -f "expo" 2>/dev/null || true
pkill -f "webpack" 2>/dev/null || true
pkill -f "metro" 2>/dev/null || true
pkill -f "react" 2>/dev/null || true
sleep 5

# Force kill ports
echo -e "${YELLOW}🔥 Force killing ports 3001 and 8081...${NC}"
lsof -ti:3001 | xargs kill -9 2>/dev/null || true
lsof -ti:8081 | xargs kill -9 2>/dev/null || true
sleep 3

echo -e "${GREEN}✅ Complete cleanup finished${NC}"

# Clear all caches
echo -e "${BLUE}🗑️  Clearing all caches...${NC}"
rm -rf node_modules/.cache 2>/dev/null || true
rm -rf .expo 2>/dev/null || true
rm -rf .next 2>/dev/null || true
rm -rf dist 2>/dev/null || true
rm -rf build 2>/dev/null || true
npm cache clean --force 2>/dev/null || true

echo -e "${BLUE}📦 Installing/updating dependencies...${NC}"

# Backend dependencies
cd server
if [ ! -d "node_modules" ] || [ ! -f "node_modules/.package-lock.json" ]; then
    echo -e "${YELLOW}Installing backend dependencies...${NC}"
    rm -rf node_modules package-lock.json 2>/dev/null || true
    npm install
else
    echo -e "${GREEN}✅ Backend dependencies OK${NC}"
fi

# Frontend dependencies
cd ..
if [ ! -d "node_modules" ] || [ ! -f "node_modules/.package-lock.json" ]; then
    echo -e "${YELLOW}Installing frontend dependencies...${NC}"
    rm -rf node_modules package-lock.json 2>/dev/null || true
    npm install
else
    echo -e "${GREEN}✅ Frontend dependencies OK${NC}"
fi

echo -e "${BLUE}🔥 STARTING SERVERS WITH FULL RESET...${NC}"

# Function to cleanup on exit
cleanup() {
    echo -e "\n${RED}🛑 EMERGENCY STOP - Killing all processes...${NC}"
    kill $BACKEND_PID 2>/dev/null || true
    kill $FRONTEND_PID 2>/dev/null || true
    pkill -f "node" 2>/dev/null || true
    pkill -f "expo" 2>/dev/null || true
    pkill -f "webpack" 2>/dev/null || true
    pkill -f "metro" 2>/dev/null || true
    echo -e "${GREEN}✅ All processes stopped${NC}"
    exit 0
}

# Trap Ctrl+C and other signals
trap cleanup INT TERM EXIT

# Start backend server
echo -e "${GREEN}🚀 Starting backend server on port 3001...${NC}"
cd server
npm run dev > ../backend.log 2>&1 &
BACKEND_PID=$!
echo -e "${BLUE}Backend PID: $BACKEND_PID${NC}"

# Wait for backend
echo -e "${YELLOW}⏳ Waiting for backend to fully initialize...${NC}"
sleep 8

# Check backend
if ! kill -0 $BACKEND_PID 2>/dev/null; then
    echo -e "${RED}❌ BACKEND FAILED TO START${NC}"
    echo -e "${RED}Backend log:${NC}"
    cat ../backend.log
    exit 1
fi

# Test backend API
echo -e "${YELLOW}🔍 Testing backend API...${NC}"
if curl -s http://localhost:3001 > /dev/null; then
    echo -e "${GREEN}✅ Backend API responding${NC}"
else
    echo -e "${RED}❌ Backend API not responding${NC}"
    echo -e "${RED}Backend log:${NC}"
    tail -10 ../backend.log
fi

# Start frontend server
echo -e "${GREEN}🌐 Starting frontend server on port 8081...${NC}"
cd ..

# Set environment variables
export EXPO_DEVTOOLS_LISTEN_ADDRESS=0.0.0.0
export EXPO_WEB_PORT=8081
export NODE_ENV=development

# Start frontend with complete reset
npx expo start --web --port 8081 --clear --reset-cache > frontend.log 2>&1 &
FRONTEND_PID=$!
echo -e "${BLUE}Frontend PID: $FRONTEND_PID${NC}"

# Wait for frontend
echo -e "${YELLOW}⏳ Waiting for frontend to fully initialize...${NC}"
sleep 20

# Check frontend
if ! kill -0 $FRONTEND_PID 2>/dev/null; then
    echo -e "${RED}❌ FRONTEND FAILED TO START${NC}"
    echo -e "${RED}Frontend log:${NC}"
    cat frontend.log
    cleanup
    exit 1
fi

# Test frontend
echo -e "${YELLOW}🔍 Testing frontend server...${NC}"
if curl -s http://localhost:8081 > /dev/null; then
    echo -e "${GREEN}✅ Frontend server responding${NC}"
else
    echo -e "${YELLOW}⚠️  Frontend may still be starting...${NC}"
fi

echo -e "\n${GREEN}🎉 SYSTEM FULLY OPERATIONAL!${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ Backend API: ${YELLOW}http://localhost:3001${NC}"
echo -e "${GREEN}✅ Frontend App: ${YELLOW}http://localhost:8081${NC}"
echo -e "${GREEN}✅ Business Login: ${YELLOW}http://localhost:8081/business-auth${NC}"
echo -e "${GREEN}✅ Business Dashboard: ${YELLOW}http://localhost:8081/business-dashboard${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "\n${GREEN}🎯 DEMO CREDENTIALS:${NC}"
echo -e "${YELLOW}📧 Email: demo@business.com${NC}"
echo -e "${YELLOW}🔐 Password: password123${NC}"
echo -e "\n${BLUE}📋 LOGS:${NC}"
echo -e "${YELLOW}Backend: tail -f backend.log${NC}"
echo -e "${YELLOW}Frontend: tail -f frontend.log${NC}"
echo -e "\n${BLUE}🔗 QUICK ACCESS:${NC}"
echo -e "${YELLOW}• Home: http://localhost:8081${NC}"
echo -e "${YELLOW}• Business Auth: http://localhost:8081/business-auth${NC}"
echo -e "${YELLOW}• Dashboard: http://localhost:8081/business-dashboard${NC}"
echo -e "\n${RED}Press Ctrl+C to stop all servers${NC}"

# Monitor both processes
while true; do
    if ! kill -0 $BACKEND_PID 2>/dev/null; then
        echo -e "${RED}❌ Backend crashed!${NC}"
        tail -20 backend.log
        break
    fi
    
    if ! kill -0 $FRONTEND_PID 2>/dev/null; then
        echo -e "${RED}❌ Frontend crashed!${NC}"
        tail -20 frontend.log
        break
    fi
    
    sleep 3
done

echo -e "${RED}❌ System failure detected${NC}"
cleanup
