#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🧹 Clearing caches and fixing blank screen issues...${NC}"

# Kill any existing processes
echo -e "${YELLOW}Stopping any running servers...${NC}"
pkill -f "node.*3001" 2>/dev/null || true
pkill -f "expo.*8081" 2>/dev/null || true
pkill -f "webpack.*8081" 2>/dev/null || true
pkill -f "metro" 2>/dev/null || true
sleep 3

# Clear Metro cache
echo -e "${BLUE}Clearing Metro bundler cache...${NC}"
npx react-native start --reset-cache > /dev/null 2>&1 || true

# Clear Expo cache
echo -e "${BLUE}Clearing Expo cache...${NC}"
npx expo install --fix > /dev/null 2>&1 || true

# Clear node_modules/.cache
echo -e "${BLUE}Clearing node_modules cache...${NC}"
rm -rf node_modules/.cache 2>/dev/null || true
rm -rf .expo 2>/dev/null || true

# Clear temporary files
echo -e "${BLUE}Clearing temporary files...${NC}"
find . -name "*.tmp" -delete 2>/dev/null || true
find . -name ".DS_Store" -delete 2>/dev/null || true

# Reinstall dependencies if needed
echo -e "${BLUE}Ensuring dependencies are up to date...${NC}"
if [ ! -d "node_modules" ] || [ ! -d "server/node_modules" ]; then
    echo -e "${YELLOW}Installing dependencies...${NC}"
    npm install
    cd server && npm install && cd ..
fi

echo -e "${GREEN}✅ Cache cleared successfully!${NC}"
echo -e "${BLUE}🚀 Starting servers with fresh cache...${NC}"

# Start servers with clear cache flag
echo -e "${GREEN}Starting backend server on port 3001...${NC}"
cd server
npm run dev > ../backend.log 2>&1 &
BACKEND_PID=$!
echo -e "${BLUE}Backend PID: $BACKEND_PID${NC}"

# Wait for backend
sleep 5

# Start frontend with clear cache
echo -e "${GREEN}Starting frontend server on port 8081...${NC}"
cd ..

# Set environment variables
export EXPO_DEVTOOLS_LISTEN_ADDRESS=0.0.0.0
export EXPO_WEB_PORT=8081

# Start with explicit clear cache
npx expo start --web --port 8081 --clear --minify > frontend.log 2>&1 &
FRONTEND_PID=$!
echo -e "${BLUE}Frontend PID: $FRONTEND_PID${NC}"

# Wait for frontend
sleep 10

# Verify servers
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

echo -e "${GREEN}✅ Servers restarted with fresh cache!${NC}"
echo -e "${BLUE}📊 Backend API: ${YELLOW}http://localhost:3001${NC}"
echo -e "${BLUE}🌐 Frontend App: ${YELLOW}http://localhost:8081${NC}"
echo -e "${BLUE}🏢 Business Auth: ${YELLOW}http://localhost:8081/business-auth${NC}"
echo -e "${BLUE}📈 Business Dashboard: ${YELLOW}http://localhost:8081/business-dashboard${NC}"
echo ""
echo -e "${GREEN}🎯 Demo Business Login:${NC}"
echo -e "${YELLOW}Email: demo@business.com${NC}"
echo -e "${YELLOW}Password: password123${NC}"
echo ""
echo -e "${BLUE}📋 If still blank, try:${NC}"
echo -e "${YELLOW}- Hard refresh browser (Ctrl+F5 or Cmd+Shift+R)${NC}"
echo -e "${YELLOW}- Clear browser cache${NC}"
echo -e "${YELLOW}- Try incognito/private mode${NC}"
echo -e "${YELLOW}- Check console for errors (F12)${NC}"
echo ""
echo -e "${RED}Press Ctrl+C to stop both servers${NC}"

# Monitor processes
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

# Cleanup
echo -e "\n${RED}🛑 Stopping servers...${NC}"
kill $BACKEND_PID 2>/dev/null || true
kill $FRONTEND_PID 2>/dev/null || true
echo -e "${GREEN}✅ Servers stopped${NC}"
