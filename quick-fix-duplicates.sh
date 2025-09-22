#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔧 QUICK FIX FOR DUPLICATE IMPORTS${NC}"
echo -e "${BLUE}=================================${NC}"

# Fix Friends.tsx duplicate Star import
echo -e "${YELLOW}Fixing Friends.tsx duplicate imports...${NC}"
if [ -f "src/pages/Friends.tsx" ]; then
    # Remove duplicate Star import
    sed -i '' '/^  Star,$/d' src/pages/Friends.tsx
    echo -e "${GREEN}✅ Fixed Friends.tsx${NC}"
else
    echo -e "${RED}❌ Friends.tsx not found${NC}"
fi

# Test TypeScript compilation
echo -e "\n${YELLOW}🔍 Testing TypeScript compilation...${NC}"
if command -v npx &> /dev/null; then
    if npx tsc --noEmit --skipLibCheck 2>/dev/null; then
        echo -e "${GREEN}✅ TypeScript compilation successful!${NC}"
        echo -e "\n${GREEN}🎉 ALL ISSUES FIXED!${NC}"
        echo -e "${GREEN}✅ No more duplicate imports${NC}"
        echo -e "${GREEN}✅ TypeScript compilation passes${NC}"
        echo -e "${GREEN}✅ Ready to start servers${NC}"
        
        echo -e "\n${BLUE}🚀 NEXT STEPS:${NC}"
        echo -e "${YELLOW}1. Run: ./start-servers.sh${NC}"
        echo -e "${YELLOW}2. Access: http://localhost:8081${NC}"
        echo -e "${YELLOW}3. Business: http://localhost:8081/business-auth${NC}"
        echo -e "${YELLOW}4. Login: demo@business.com / password123${NC}"
    else
        echo -e "${RED}❌ TypeScript compilation still has errors:${NC}"
        npx tsc --noEmit --skipLibCheck
    fi
else
    echo -e "${YELLOW}⚠️  TypeScript check skipped${NC}"
fi

echo -e "\n${BLUE}🎯 Quick fix complete!${NC}"
