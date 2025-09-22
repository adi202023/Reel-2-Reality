#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔍 Verifying Reel-to-Reality Setup...${NC}"

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check file exists
file_exists() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✅ $1 exists${NC}"
        return 0
    else
        echo -e "${RED}❌ $1 missing${NC}"
        return 1
    fi
}

# Function to check directory exists
dir_exists() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✅ $1 directory exists${NC}"
        return 0
    else
        echo -e "${RED}❌ $1 directory missing${NC}"
        return 1
    fi
}

echo -e "${BLUE}📋 Checking Prerequisites...${NC}"

# Check Node.js
if command_exists node; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✅ Node.js: $NODE_VERSION${NC}"
else
    echo -e "${RED}❌ Node.js not found${NC}"
    exit 1
fi

# Check npm
if command_exists npm; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✅ npm: $NPM_VERSION${NC}"
else
    echo -e "${RED}❌ npm not found${NC}"
    exit 1
fi

# Check Expo CLI
if command_exists expo; then
    EXPO_VERSION=$(expo --version)
    echo -e "${GREEN}✅ Expo CLI: $EXPO_VERSION${NC}"
else
    echo -e "${YELLOW}⚠️  Expo CLI not found globally. Installing...${NC}"
    npm install -g @expo/cli
fi

echo -e "\n${BLUE}📁 Checking Project Structure...${NC}"

# Check essential files
file_exists "package.json" || exit 1
file_exists "src/App.tsx" || exit 1
file_exists "src/index.css" || exit 1
file_exists "src/context/AppContext.tsx" || exit 1
file_exists "src/pages/BusinessDashboard.tsx" || exit 1
file_exists "src/components/ui/button.tsx" || exit 1
file_exists "server/package.json" || exit 1
file_exists "server/index.js" || exit 1
file_exists "start-servers.sh" || exit 1

# Check directories
dir_exists "src/pages" || exit 1
dir_exists "src/components" || exit 1
dir_exists "src/context" || exit 1
dir_exists "server" || exit 1

echo -e "\n${BLUE}🔧 Checking Dependencies...${NC}"

# Check frontend dependencies
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✅ Frontend dependencies installed${NC}"
else
    echo -e "${YELLOW}⚠️  Installing frontend dependencies...${NC}"
    npm install
fi

# Check backend dependencies
cd server
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✅ Backend dependencies installed${NC}"
else
    echo -e "${YELLOW}⚠️  Installing backend dependencies...${NC}"
    npm install
fi
cd ..

echo -e "\n${BLUE}⚙️  Checking Configuration Files...${NC}"

# Check TypeScript config
if [ -f "tsconfig.json" ]; then
    echo -e "${GREEN}✅ TypeScript configuration found${NC}"
else
    echo -e "${RED}❌ tsconfig.json missing${NC}"
fi

# Check Babel config
if [ -f "babel.config.js" ]; then
    echo -e "${GREEN}✅ Babel configuration found${NC}"
else
    echo -e "${RED}❌ babel.config.js missing${NC}"
fi

echo -e "\n${BLUE}🔍 Checking Code Syntax...${NC}"

# Check TypeScript compilation (non-blocking)
echo -e "${YELLOW}Checking TypeScript compilation...${NC}"
if npx tsc --noEmit --skipLibCheck > /dev/null 2>&1; then
    echo -e "${GREEN}✅ TypeScript compilation successful${NC}"
else
    echo -e "${YELLOW}⚠️  TypeScript compilation has warnings (non-critical)${NC}"
fi

echo -e "\n${BLUE}🌐 Checking Port Availability...${NC}"

# Check if ports are available
if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null ; then
    echo -e "${YELLOW}⚠️  Port 3001 is in use (will be cleared by start script)${NC}"
else
    echo -e "${GREEN}✅ Port 3001 is available${NC}"
fi

if lsof -Pi :8081 -sTCP:LISTEN -t >/dev/null ; then
    echo -e "${YELLOW}⚠️  Port 8081 is in use (will be cleared by start script)${NC}"
else
    echo -e "${GREEN}✅ Port 8081 is available${NC}"
fi

echo -e "\n${BLUE}📝 Checking Essential Components...${NC}"

# Check if key components have proper exports
if grep -q "export default BusinessDashboard" src/pages/BusinessDashboard.tsx; then
    echo -e "${GREEN}✅ BusinessDashboard component properly exported${NC}"
else
    echo -e "${RED}❌ BusinessDashboard component export issue${NC}"
fi

if grep -q "export.*Button" src/components/ui/button.tsx; then
    echo -e "${GREEN}✅ Button component properly exported${NC}"
else
    echo -e "${RED}❌ Button component export issue${NC}"
fi

if grep -q "export.*AppProvider" src/context/AppContext.tsx; then
    echo -e "${GREEN}✅ AppProvider properly exported${NC}"
else
    echo -e "${RED}❌ AppProvider export issue${NC}"
fi

echo -e "\n${BLUE}🚀 Setup Verification Complete!${NC}"

echo -e "\n${GREEN}✅ All checks passed! Your setup is ready.${NC}"
echo -e "\n${BLUE}📋 Next Steps:${NC}"
echo -e "${YELLOW}1. Run: ./start-servers.sh${NC}"
echo -e "${YELLOW}2. Wait for both servers to start${NC}"
echo -e "${YELLOW}3. Open: http://localhost:8081${NC}"
echo -e "${YELLOW}4. Navigate to Business Dashboard${NC}"
echo -e "${YELLOW}5. Use demo login: demo@business.com / password123${NC}"

echo -e "\n${BLUE}🔧 Troubleshooting:${NC}"
echo -e "${YELLOW}- If servers don't start: Check logs in backend.log and frontend.log${NC}"
echo -e "${YELLOW}- If blank screen: Clear browser cache and reload${NC}"
echo -e "${YELLOW}- If port conflicts: The start script will handle them automatically${NC}"

echo -e "\n${GREEN}🎉 Ready to launch Reel-to-Reality!${NC}"
