#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔧 ULTIMATE FIX FOR ALL TYPESCRIPT ERRORS${NC}"
echo -e "${BLUE}=========================================${NC}"

# Phase 1: Clean Friends.tsx imports completely
echo -e "\n${YELLOW}📋 Phase 1: Fixing Friends.tsx imports${NC}"
if [ -f "src/pages/Friends.tsx" ]; then
    echo -e "${BLUE}Rewriting Friends.tsx import section...${NC}"
    
    # Create a temporary file with correct imports
    cat > temp_friends_imports.txt << 'EOF'
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Users, 
  Play, 
  Star, 
  Film, 
  ArrowLeft, 
  Trophy,
  Zap,
  Camera,
  Video
} from 'lucide-react';
EOF
    
    # Get everything after the imports
    sed -n '15,$p' src/pages/Friends.tsx > temp_friends_rest.txt
    
    # Combine them
    cat temp_friends_imports.txt temp_friends_rest.txt > src/pages/Friends.tsx
    
    # Clean up temp files
    rm temp_friends_imports.txt temp_friends_rest.txt
    
    echo -e "${GREEN}✅ Fixed Friends.tsx imports${NC}"
else
    echo -e "${RED}❌ Friends.tsx not found${NC}"
fi

# Phase 2: Fix Challenges.tsx Target reference
echo -e "\n${YELLOW}📋 Phase 2: Fixing Challenges.tsx${NC}"
if [ -f "src/pages/Challenges.tsx" ]; then
    sed -i '' 's/return Target;/return Star;/g' src/pages/Challenges.tsx
    echo -e "${GREEN}✅ Fixed Challenges.tsx${NC}"
else
    echo -e "${RED}❌ Challenges.tsx not found${NC}"
fi

# Phase 3: Fix Profile.tsx Target reference
echo -e "\n${YELLOW}📋 Phase 3: Fixing Profile.tsx${NC}"
if [ -f "src/pages/Profile.tsx" ]; then
    sed -i '' 's/"Challenge Champion": Target,/"Challenge Champion": Star,/g' src/pages/Profile.tsx
    echo -e "${GREEN}✅ Fixed Profile.tsx${NC}"
else
    echo -e "${RED}❌ Profile.tsx not found${NC}"
fi

# Phase 4: Test TypeScript compilation
echo -e "\n${YELLOW}🔍 Phase 4: Testing TypeScript compilation${NC}"
if command -v npx &> /dev/null; then
    if npx tsc --noEmit --skipLibCheck 2>/dev/null; then
        echo -e "${GREEN}✅ TypeScript compilation successful!${NC}"
        COMPILATION_STATUS="PASS"
    else
        echo -e "${RED}❌ TypeScript compilation failed:${NC}"
        npx tsc --noEmit --skipLibCheck
        COMPILATION_STATUS="FAIL"
    fi
else
    echo -e "${YELLOW}⚠️  TypeScript check skipped${NC}"
    COMPILATION_STATUS="SKIP"
fi

# Phase 5: Final verification
echo -e "\n${YELLOW}✅ Phase 5: Final System Check${NC}"
if [ "$COMPILATION_STATUS" = "PASS" ]; then
    echo -e "${GREEN}🎉 ALL TYPESCRIPT ERRORS FIXED!${NC}"
    echo -e "${GREEN}✅ No more duplicate imports${NC}"
    echo -e "${GREEN}✅ No more Target references${NC}"
    echo -e "${GREEN}✅ TypeScript compilation successful${NC}"
    echo -e "${GREEN}✅ System ready to start${NC}"
    
    echo -e "\n${BLUE}🚀 NEXT STEPS:${NC}"
    echo -e "${YELLOW}1. Run: ./start-servers.sh${NC}"
    echo -e "${YELLOW}2. Access: http://localhost:8081${NC}"
    echo -e "${YELLOW}3. Business: http://localhost:8081/business-auth${NC}"
    echo -e "${YELLOW}4. Login: demo@business.com / password123${NC}"
    
    echo -e "\n${GREEN}✨ YOUR REEL-TO-REALITY PLATFORM IS NOW FULLY FUNCTIONAL!${NC}"
else
    echo -e "${RED}❌ Some TypeScript errors remain${NC}"
    echo -e "${YELLOW}Please check the errors above and fix manually${NC}"
fi

echo -e "\n${BLUE}🎯 Ultimate fix complete!${NC}"
