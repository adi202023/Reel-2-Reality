#!/bin/bash
cd "$(dirname "$0")/.." || exit 1

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🔧 Fixing Backend Connection...${NC}"
lsof -ti:3001 | xargs kill -9 2>/dev/null || true
sleep 3
rm -f backend.log frontend.log

cd server
[ ! -d "node_modules" ] && npm install
npm run dev > ../backend.log 2>&1 &
BACKEND_PID=$!
sleep 5

if ! kill -0 $BACKEND_PID 2>/dev/null; then
    echo -e "${RED}❌ Backend failed to start${NC}"
    tail -20 ../backend.log
    exit 1
fi

cd ..
if curl -s http://localhost:3001/api/health > /dev/null; then
    echo -e "${GREEN}✅ Backend running at http://localhost:3001${NC}"
else
    echo -e "${RED}❌ Backend not responding${NC}"
    tail -10 backend.log
fi
