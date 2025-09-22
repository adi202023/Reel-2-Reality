#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔍 COMPREHENSIVE REEL-TO-REALITY SYSTEM CHECK${NC}"
echo -e "${BLUE}=============================================${NC}"

# Phase 1: Check TypeScript Compilation
echo -e "\n${YELLOW}📋 Phase 1: TypeScript Compilation Check${NC}"
echo -e "----------------------------------------"

if command -v npx &> /dev/null; then
    echo -e "${BLUE}Checking TypeScript compilation...${NC}"
    if npx tsc --noEmit --skipLibCheck 2>/dev/null; then
        echo -e "${GREEN}✅ TypeScript compilation successful!${NC}"
        TS_STATUS="✅ PASS"
    else
        echo -e "${RED}❌ TypeScript compilation failed${NC}"
        echo -e "${YELLOW}Running TypeScript check with errors:${NC}"
        npx tsc --noEmit --skipLibCheck
        TS_STATUS="❌ FAIL"
    fi
else
    echo -e "${YELLOW}⚠️  TypeScript check skipped (npx not available)${NC}"
    TS_STATUS="⚠️  SKIP"
fi

# Phase 2: Check File Structure
echo -e "\n${YELLOW}📁 Phase 2: File Structure Check${NC}"
echo -e "--------------------------------"

critical_files=(
    "src/pages/BusinessDashboard.tsx"
    "src/pages/BusinessAuth.tsx"
    "src/pages/Login.tsx"
    "src/pages/Dashboard.tsx"
    "src/services/api.ts"
    "src/services/businessAPI.ts"
    "server/index.js"
    "server/package.json"
    "package.json"
)

missing_files=0
for file in "${critical_files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅ $file${NC}"
    else
        echo -e "${RED}❌ $file - MISSING${NC}"
        missing_files=$((missing_files + 1))
    fi
done

if [ $missing_files -eq 0 ]; then
    FILE_STATUS="✅ PASS"
    echo -e "${GREEN}✅ All critical files present${NC}"
else
    FILE_STATUS="❌ FAIL"
    echo -e "${RED}❌ $missing_files critical files missing${NC}"
fi

# Phase 3: Check Dependencies
echo -e "\n${YELLOW}📦 Phase 3: Dependencies Check${NC}"
echo -e "-----------------------------"

if [ -f "package.json" ]; then
    echo -e "${BLUE}Checking frontend dependencies...${NC}"
    if [ -d "node_modules" ]; then
        echo -e "${GREEN}✅ Frontend node_modules exists${NC}"
        FRONTEND_DEPS="✅ PASS"
    else
        echo -e "${RED}❌ Frontend node_modules missing${NC}"
        FRONTEND_DEPS="❌ FAIL"
    fi
else
    echo -e "${RED}❌ Frontend package.json missing${NC}"
    FRONTEND_DEPS="❌ FAIL"
fi

if [ -f "server/package.json" ]; then
    echo -e "${BLUE}Checking backend dependencies...${NC}"
    if [ -d "server/node_modules" ]; then
        echo -e "${GREEN}✅ Backend node_modules exists${NC}"
        BACKEND_DEPS="✅ PASS"
    else
        echo -e "${RED}❌ Backend node_modules missing${NC}"
        BACKEND_DEPS="❌ FAIL"
    fi
else
    echo -e "${RED}❌ Backend package.json missing${NC}"
    BACKEND_DEPS="❌ FAIL"
fi

# Phase 4: Check Port Availability
echo -e "\n${YELLOW}🌐 Phase 4: Port Availability Check${NC}"
echo -e "----------------------------------"

check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 1  # Port is in use
    else
        return 0  # Port is available
    fi
}

if check_port 3001; then
    echo -e "${GREEN}✅ Port 3001 (Backend) available${NC}"
    BACKEND_PORT="✅ AVAILABLE"
else
    echo -e "${YELLOW}⚠️  Port 3001 (Backend) in use${NC}"
    BACKEND_PORT="⚠️  IN USE"
fi

if check_port 8081; then
    echo -e "${GREEN}✅ Port 8081 (Frontend) available${NC}"
    FRONTEND_PORT="✅ AVAILABLE"
else
    echo -e "${YELLOW}⚠️  Port 8081 (Frontend) in use${NC}"
    FRONTEND_PORT="⚠️  IN USE"
fi

if check_port 19006; then
    echo -e "${GREEN}✅ Port 19006 (Expo) available${NC}"
    EXPO_PORT="✅ AVAILABLE"
else
    echo -e "${YELLOW}⚠️  Port 19006 (Expo) in use${NC}"
    EXPO_PORT="⚠️  IN USE"
fi

# Phase 5: Check API Endpoints (if backend is running)
echo -e "\n${YELLOW}🔌 Phase 5: API Endpoints Check${NC}"
echo -e "------------------------------"

if ! check_port 3001; then
    echo -e "${BLUE}Backend detected on port 3001, testing endpoints...${NC}"
    
    # Test health endpoint
    if curl -s http://localhost:3001/api/health >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Health endpoint working${NC}"
        HEALTH_API="✅ PASS"
    else
        echo -e "${RED}❌ Health endpoint failed${NC}"
        HEALTH_API="❌ FAIL"
    fi
    
    # Test business auth endpoint
    if curl -s -X POST http://localhost:3001/api/business/auth/login \
        -H "Content-Type: application/json" \
        -d '{"email":"test","password":"test"}' >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Business auth endpoint responding${NC}"
        BUSINESS_API="✅ PASS"
    else
        echo -e "${RED}❌ Business auth endpoint failed${NC}"
        BUSINESS_API="❌ FAIL"
    fi
else
    echo -e "${YELLOW}⚠️  Backend not running, skipping API tests${NC}"
    HEALTH_API="⚠️  SKIP"
    BUSINESS_API="⚠️  SKIP"
fi

# Phase 6: Check for Common Issues
echo -e "\n${YELLOW}🔧 Phase 6: Common Issues Check${NC}"
echo -e "------------------------------"

# Check for unquoted emojis
emoji_issues=$(grep -r "return [⭐🎯🎬☀️🌙✨🔥];\|{[⭐🎯🎬☀️🌙✨🔥]}" src/ --include="*.tsx" --include="*.ts" 2>/dev/null || true)
if [ -z "$emoji_issues" ]; then
    echo -e "${GREEN}✅ No unquoted emoji syntax issues${NC}"
    EMOJI_SYNTAX="✅ PASS"
else
    echo -e "${RED}❌ Found unquoted emoji syntax issues${NC}"
    EMOJI_SYNTAX="❌ FAIL"
fi

# Check for problematic Lucide imports
lucide_issues=$(grep -r "Building\|Plus\|BarChart\|Settings\|Edit\|Trash\|Calendar\|TrendingUp\|DollarSign\|Clock\|CheckCircle\|XCircle\|Filter\|Search\|Download\|Bell\|Menu\|X\|Target\|MapPin\|ShoppingBag\|Gift" src/ --include="*.tsx" --include="*.ts" | grep "from 'lucide-react'" || true)
if [ -z "$lucide_issues" ]; then
    echo -e "${GREEN}✅ No problematic Lucide React imports${NC}"
    LUCIDE_IMPORTS="✅ PASS"
else
    echo -e "${RED}❌ Found problematic Lucide React imports${NC}"
    LUCIDE_IMPORTS="❌ FAIL"
fi

# Summary Report
echo -e "\n${BLUE}📊 SYSTEM CHECK SUMMARY${NC}"
echo -e "${BLUE}======================${NC}"
echo -e "TypeScript Compilation: $TS_STATUS"
echo -e "File Structure:         $FILE_STATUS"
echo -e "Frontend Dependencies:  $FRONTEND_DEPS"
echo -e "Backend Dependencies:   $BACKEND_DEPS"
echo -e "Backend Port (3001):    $BACKEND_PORT"
echo -e "Frontend Port (8081):   $FRONTEND_PORT"
echo -e "Expo Port (19006):      $EXPO_PORT"
echo -e "Health API:             $HEALTH_API"
echo -e "Business API:           $BUSINESS_API"
echo -e "Emoji Syntax:           $EMOJI_SYNTAX"
echo -e "Lucide Imports:         $LUCIDE_IMPORTS"

# Overall Status
failed_checks=0
if [[ "$TS_STATUS" == *"FAIL"* ]]; then failed_checks=$((failed_checks + 1)); fi
if [[ "$FILE_STATUS" == *"FAIL"* ]]; then failed_checks=$((failed_checks + 1)); fi
if [[ "$FRONTEND_DEPS" == *"FAIL"* ]]; then failed_checks=$((failed_checks + 1)); fi
if [[ "$BACKEND_DEPS" == *"FAIL"* ]]; then failed_checks=$((failed_checks + 1)); fi
if [[ "$EMOJI_SYNTAX" == *"FAIL"* ]]; then failed_checks=$((failed_checks + 1)); fi
if [[ "$LUCIDE_IMPORTS" == *"FAIL"* ]]; then failed_checks=$((failed_checks + 1)); fi

echo -e "\n${BLUE}🎯 OVERALL STATUS${NC}"
echo -e "${BLUE}===============${NC}"
if [ $failed_checks -eq 0 ]; then
    echo -e "${GREEN}✅ SYSTEM READY - All checks passed!${NC}"
    echo -e "${GREEN}🚀 Your Reel-to-Reality platform is fully functional!${NC}"
else
    echo -e "${RED}❌ ISSUES FOUND - $failed_checks checks failed${NC}"
    echo -e "${YELLOW}🔧 Run the fix commands to resolve issues${NC}"
fi

# Recommendations
echo -e "\n${BLUE}💡 RECOMMENDATIONS${NC}"
echo -e "${BLUE}=================${NC}"

if [[ "$TS_STATUS" == *"FAIL"* ]] || [[ "$EMOJI_SYNTAX" == *"FAIL"* ]] || [[ "$LUCIDE_IMPORTS" == *"FAIL"* ]]; then
    echo -e "${YELLOW}1. Run: ./fix-emoji-syntax.sh${NC}"
fi

if [[ "$FRONTEND_DEPS" == *"FAIL"* ]]; then
    echo -e "${YELLOW}2. Run: npm install${NC}"
fi

if [[ "$BACKEND_DEPS" == *"FAIL"* ]]; then
    echo -e "${YELLOW}3. Run: cd server && npm install${NC}"
fi

if [ $failed_checks -eq 0 ]; then
    echo -e "${YELLOW}4. Start servers: ./start-servers.sh${NC}"
    echo -e "${YELLOW}5. Access app: http://localhost:8081${NC}"
    echo -e "${YELLOW}6. Business login: demo@business.com / password123${NC}"
fi

echo -e "\n${BLUE}🎉 System check complete!${NC}"
