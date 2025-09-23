#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔧 Fixing Backend Connection Issue...${NC}"

# Function to check if port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo -e "${YELLOW}⚠️  Port $1 is in use${NC}"
        return 0
    else
        echo -e "${GREEN}✅ Port $1 is available${NC}"
        return 1
    fi
}

# Kill processes on port 3001
echo -e "${BLUE}🧹 Cleaning up port 3001...${NC}"
if check_port 3001; then
    echo -e "${YELLOW}Killing processes on port 3001...${NC}"
    lsof -ti:3001 | xargs kill -9 2>/dev/null || true
    sleep 3
    
    # Double check
    if check_port 3001; then
        echo -e "${RED}❌ Failed to free port 3001. Please manually kill the process:${NC}"
        echo -e "${YELLOW}Run: lsof -i :3001${NC}"
        echo -e "${YELLOW}Then: kill -9 <PID>${NC}"
        exit 1
    else
        echo -e "${GREEN}✅ Port 3001 freed successfully${NC}"
    fi
fi

# Clean up any existing backend logs
echo -e "${BLUE}🧹 Cleaning up old logs...${NC}"
rm -f backend.log frontend.log

# Start backend server
echo -e "${BLUE}🚀 Starting backend server...${NC}"
cd server

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing backend dependencies...${NC}"
    npm install
fi

# Start the server
echo -e "${GREEN}Starting backend on port 3001...${NC}"
npm run dev > ../backend.log 2>&1 &
BACKEND_PID=$!

echo -e "${BLUE}Backend PID: $BACKEND_PID${NC}"

# Wait for backend to start
echo -e "${YELLOW}Waiting for backend to initialize...${NC}"
sleep 5

# Check if backend is running
if ! kill -0 $BACKEND_PID 2>/dev/null; then
    echo -e "${RED}❌ Backend failed to start. Checking logs...${NC}"
    cd ..
    tail -20 backend.log
    exit 1
fi

# Test backend connection
echo -e "${BLUE}🔍 Testing backend connection...${NC}"
cd ..
sleep 2

if curl -s http://localhost:3001/api/health > /dev/null; then
    echo -e "${GREEN}✅ Backend is running and responding!${NC}"
    echo -e "${BLUE}🌐 Backend API: ${YELLOW}http://localhost:3001${NC}"
    echo -e "${GREEN}🎉 Backend connection issue fixed!${NC}"
    echo ""
    echo -e "${BLUE}📋 Next steps:${NC}"
    echo -e "${YELLOW}1. Try signing in again in your app${NC}"
    echo -e "${YELLOW}2. If you need to stop the backend: kill $BACKEND_PID${NC}"
    echo -e "${YELLOW}3. To view backend logs: tail -f backend.log${NC}"
else
    echo -e "${RED}❌ Backend is running but not responding. Check logs:${NC}"
    tail -10 backend.log
fi
