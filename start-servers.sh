#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting Reel-to-Reality Business System...${NC}"

# Function to check if port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo -e "${YELLOW}⚠️  Port $1 is already in use${NC}"
        return 0
    else
        return 1
    fi
}

# Kill any existing processes on our ports
echo -e "${BLUE}🧹 Cleaning up existing processes...${NC}"
pkill -f "node.*3001" 2>/dev/null || true
pkill -f "expo.*8081" 2>/dev/null || true
pkill -f "webpack.*8081" 2>/dev/null || true
pkill -f "metro" 2>/dev/null || true
sleep 3

# Check if backend port is available
if check_port 3001; then
    echo -e "${YELLOW}Attempting to free port 3001...${NC}"
    lsof -ti:3001 | xargs kill -9 2>/dev/null || true
    sleep 2
fi

# Check if frontend port is available  
if check_port 8081; then
    echo -e "${YELLOW}Attempting to free port 8081...${NC}"
    lsof -ti:8081 | xargs kill -9 2>/dev/null || true
    sleep 2
fi

echo -e "${GREEN}✅ Ports cleaned up${NC}"

echo -e "${BLUE}📦 Installing dependencies...${NC}"

# Install backend dependencies
cd server
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing backend dependencies...${NC}"
    npm install
else
    echo -e "${GREEN}✅ Backend dependencies already installed${NC}"
fi

# Install frontend dependencies
cd ..
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing frontend dependencies...${NC}"
    npm install
else
    echo -e "${GREEN}✅ Frontend dependencies already installed${NC}"
fi

echo -e "${BLUE}🔥 Starting servers...${NC}"

# Function to cleanup on exit
cleanup() {
    echo -e "\n${RED}🛑 Stopping servers...${NC}"
    kill $BACKEND_PID 2>/dev/null || true
    kill $FRONTEND_PID 2>/dev/null || true
    # Kill any remaining processes
    pkill -f "node.*3001" 2>/dev/null || true
    pkill -f "expo.*8081" 2>/dev/null || true
    pkill -f "webpack.*8081" 2>/dev/null || true
    pkill -f "metro" 2>/dev/null || true
    echo -e "${GREEN}✅ Servers stopped${NC}"
    exit 0
}

# Trap Ctrl+C and other signals
trap cleanup INT TERM EXIT

# Start backend server in background
echo -e "${GREEN}Starting backend server on port 3001...${NC}"
cd server
npm run dev > ../backend.log 2>&1 &
BACKEND_PID=$!
echo -e "${BLUE}Backend PID: $BACKEND_PID${NC}"

# Wait for backend to start
echo -e "${YELLOW}Waiting for backend to initialize...${NC}"
sleep 5

# Check if backend is running
if ! kill -0 $BACKEND_PID 2>/dev/null; then
    echo -e "${RED}❌ Backend failed to start. Check backend.log for details.${NC}"
    cat ../backend.log
    exit 1
fi

# Start frontend server
echo -e "${GREEN}Starting frontend server on port 8081...${NC}"
cd ..

# Set environment variables for consistent port
export EXPO_DEVTOOLS_LISTEN_ADDRESS=0.0.0.0
export EXPO_WEB_PORT=8081

# Start with explicit port configuration and clear cache
npx expo start --web --port 8081 --clear --minify > frontend.log 2>&1 &
FRONTEND_PID=$!
echo -e "${BLUE}Frontend PID: $FRONTEND_PID${NC}"

# Wait for frontend to start
echo -e "${YELLOW}Waiting for frontend to initialize...${NC}"
sleep 15

# Check if frontend is running
if ! kill -0 $FRONTEND_PID 2>/dev/null; then
    echo -e "${RED}❌ Frontend failed to start. Check frontend.log for details.${NC}"
    cat frontend.log
    cleanup
    exit 1
fi

# Verify servers are responding
echo -e "${BLUE}🔍 Verifying server status...${NC}"

# Check backend
if curl -s http://localhost:3001 > /dev/null; then
    echo -e "${GREEN}✅ Backend server is responding${NC}"
else
    echo -e "${YELLOW}⚠️  Backend server may still be starting...${NC}"
fi

# Check frontend
if curl -s http://localhost:8081 > /dev/null; then
    echo -e "${GREEN}✅ Frontend server is responding${NC}"
else
    echo -e "${YELLOW}⚠️  Frontend server may still be starting...${NC}"
fi

echo -e "${GREEN}✅ Servers started successfully!${NC}"
echo -e "${BLUE}📊 Backend API: ${YELLOW}http://localhost:3001${NC}"
echo -e "${BLUE}🌐 Frontend App: ${YELLOW}http://localhost:8081${NC}"
echo -e "${BLUE}🏢 Business Auth: ${YELLOW}http://localhost:8081/business-auth${NC}"
echo -e "${BLUE}📈 Business Dashboard: ${YELLOW}http://localhost:8081/business-dashboard${NC}"
echo ""
echo -e "${GREEN}🎯 Demo Business Login:${NC}"
echo -e "${YELLOW}Email: demo@business.com${NC}"
echo -e "${YELLOW}Password: password123${NC}"
echo ""
echo -e "${BLUE}📋 Server Logs:${NC}"
echo -e "${YELLOW}Backend: tail -f backend.log${NC}"
echo -e "${YELLOW}Frontend: tail -f frontend.log${NC}"
echo ""
echo -e "${BLUE}🔗 Direct Access:${NC}"
echo -e "${YELLOW}• Home Page: http://localhost:8081${NC}"
echo -e "${YELLOW}• Business Dashboard: http://localhost:8081/business-dashboard${NC}"
echo -e "${YELLOW}• Business Login: http://localhost:8081/business-auth${NC}"
echo ""
echo -e "${RED}Press Ctrl+C to stop both servers${NC}"

# Keep script running and monitor both processes
while true; do
    if ! kill -0 $BACKEND_PID 2>/dev/null; then
        echo -e "${RED}❌ Backend server stopped unexpectedly${NC}"
        echo -e "${BLUE}Backend log:${NC}"
        tail -20 backend.log
        break
    fi
    
    if ! kill -0 $FRONTEND_PID 2>/dev/null; then
        echo -e "${RED}❌ Frontend server stopped unexpectedly${NC}"
        echo -e "${BLUE}Frontend log:${NC}"
        tail -20 frontend.log
        break
    fi
    
    sleep 2
done

# If we get here, one of the processes died
echo -e "${RED}❌ One of the servers stopped unexpectedly${NC}"
cleanup
