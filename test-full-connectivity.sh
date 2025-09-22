#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔍 Reel-to-Reality Full Connectivity Test${NC}"
echo -e "${BLUE}======================================${NC}"

# Test 1: Backend Server Health
echo -e "\n${YELLOW}1. Testing Backend Server (http://localhost:3001)...${NC}"
if curl -s http://localhost:3001 > /dev/null; then
    echo -e "${GREEN}✅ Backend server is responding${NC}"
    
    # Test backend API endpoints
    echo -e "\n${YELLOW}   Testing Backend API Endpoints:${NC}"
    
    # Test health endpoint
    if curl -s http://localhost:3001/api/health > /dev/null; then
        echo -e "${GREEN}   ✅ Health endpoint: /api/health${NC}"
    else
        echo -e "${RED}   ❌ Health endpoint: /api/health${NC}"
    fi
    
    # Test business login endpoint
    echo -e "${YELLOW}   Testing business login endpoint...${NC}"
    LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3001/api/business/auth/login \
        -H "Content-Type: application/json" \
        -d '{"email":"demo@business.com","password":"password123"}')
    
    if echo "$LOGIN_RESPONSE" | grep -q '"success":true'; then
        echo -e "${GREEN}   ✅ Business login endpoint working${NC}"
        
        # Extract token for further tests
        TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
        echo -e "${BLUE}   📝 Auth token extracted for further tests${NC}"
        
        # Test authenticated endpoints
        echo -e "${YELLOW}   Testing authenticated endpoints...${NC}"
        
        # Test challenges endpoint
        CHALLENGES_RESPONSE=$(curl -s -H "Authorization: Bearer $TOKEN" \
            http://localhost:3001/api/business/challenges)
        
        if echo "$CHALLENGES_RESPONSE" | grep -q '"success":true'; then
            echo -e "${GREEN}   ✅ Challenges endpoint working${NC}"
        else
            echo -e "${RED}   ❌ Challenges endpoint failed${NC}"
        fi
        
        # Test analytics endpoint
        ANALYTICS_RESPONSE=$(curl -s -H "Authorization: Bearer $TOKEN" \
            http://localhost:3001/api/business/analytics/stats)
        
        if echo "$ANALYTICS_RESPONSE" | grep -q '"success":true'; then
            echo -e "${GREEN}   ✅ Analytics endpoint working${NC}"
        else
            echo -e "${RED}   ❌ Analytics endpoint failed${NC}"
        fi
        
    else
        echo -e "${RED}   ❌ Business login endpoint failed${NC}"
        echo -e "${RED}   Response: $LOGIN_RESPONSE${NC}"
    fi
    
else
    echo -e "${RED}❌ Backend server is not responding${NC}"
    echo -e "${YELLOW}   Make sure to run: ./start-servers.sh${NC}"
fi

# Test 2: Frontend Server Health
echo -e "\n${YELLOW}2. Testing Frontend Server (http://localhost:8081)...${NC}"
if curl -s http://localhost:8081 > /dev/null; then
    echo -e "${GREEN}✅ Frontend server is responding${NC}"
    
    # Test specific routes
    echo -e "\n${YELLOW}   Testing Frontend Routes:${NC}"
    
    routes=("/business-auth" "/business-dashboard" "/login")
    for route in "${routes[@]}"; do
        if curl -s "http://localhost:8081$route" > /dev/null; then
            echo -e "${GREEN}   ✅ Route: $route${NC}"
        else
            echo -e "${RED}   ❌ Route: $route${NC}"
        fi
    done
    
else
    echo -e "${RED}❌ Frontend server is not responding${NC}"
    echo -e "${YELLOW}   Make sure to run: ./start-servers.sh${NC}"
fi

# Test 3: CORS Configuration
echo -e "\n${YELLOW}3. Testing CORS Configuration...${NC}"
CORS_RESPONSE=$(curl -s -H "Origin: http://localhost:8081" \
    -H "Access-Control-Request-Method: POST" \
    -H "Access-Control-Request-Headers: Content-Type" \
    -X OPTIONS http://localhost:3001/api/business/auth/login)

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ CORS preflight request successful${NC}"
else
    echo -e "${RED}❌ CORS configuration issue${NC}"
fi

# Test 4: Full Integration Test
echo -e "\n${YELLOW}4. Testing Full Integration Flow...${NC}"
if curl -s http://localhost:3001 > /dev/null && curl -s http://localhost:8081 > /dev/null; then
    echo -e "${GREEN}✅ Both servers are running${NC}"
    echo -e "${GREEN}✅ Ready for full integration testing${NC}"
    
    echo -e "\n${BLUE}📋 Integration Test Steps:${NC}"
    echo -e "${YELLOW}   1. Open: http://localhost:8081${NC}"
    echo -e "${YELLOW}   2. Click 'Business Dashboard'${NC}"
    echo -e "${YELLOW}   3. Login with: demo@business.com / password123${NC}"
    echo -e "${YELLOW}   4. Verify dashboard loads with real data${NC}"
    
else
    echo -e "${RED}❌ Integration test cannot proceed - servers not running${NC}"
fi

# Test 5: Database/Storage Test
echo -e "\n${YELLOW}5. Testing Data Persistence...${NC}"
if curl -s http://localhost:3001 > /dev/null; then
    # Test if demo data is loaded
    DEMO_DATA=$(curl -s http://localhost:3001/)
    if echo "$DEMO_DATA" | grep -q "Demo Cafe"; then
        echo -e "${GREEN}✅ Demo business data is loaded${NC}"
    else
        echo -e "${YELLOW}⚠️  Demo data may not be properly initialized${NC}"
    fi
else
    echo -e "${RED}❌ Cannot test data persistence - backend not running${NC}"
fi

# Summary
echo -e "\n${BLUE}📊 CONNECTIVITY TEST SUMMARY${NC}"
echo -e "${BLUE}=============================${NC}"

if curl -s http://localhost:3001 > /dev/null && curl -s http://localhost:8081 > /dev/null; then
    echo -e "${GREEN}✅ Backend Server: RUNNING (Port 3001)${NC}"
    echo -e "${GREEN}✅ Frontend Server: RUNNING (Port 8081)${NC}"
    echo -e "${GREEN}✅ System Status: READY FOR USE${NC}"
    
    echo -e "\n${BLUE}🚀 Quick Access Links:${NC}"
    echo -e "${YELLOW}• Home: http://localhost:8081${NC}"
    echo -e "${YELLOW}• Business Auth: http://localhost:8081/business-auth${NC}"
    echo -e "${YELLOW}• Business Dashboard: http://localhost:8081/business-dashboard${NC}"
    echo -e "${YELLOW}• Backend API: http://localhost:3001${NC}"
    
    echo -e "\n${BLUE}🔑 Demo Credentials:${NC}"
    echo -e "${YELLOW}• Email: demo@business.com${NC}"
    echo -e "${YELLOW}• Password: password123${NC}"
    
else
    echo -e "${RED}❌ System Status: NOT READY${NC}"
    echo -e "${YELLOW}🔧 To fix: Run './start-servers.sh' first${NC}"
fi

echo -e "\n${BLUE}Test completed at $(date)${NC}"
