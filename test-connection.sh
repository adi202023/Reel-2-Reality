#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔍 Testing Reel-to-Reality Frontend-Backend Connection...${NC}"

# Function to test API endpoint
test_api_endpoint() {
    local endpoint=$1
    local description=$2

    echo -e "\n${YELLOW}Testing $description...${NC}"

    if curl -s "$endpoint" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ $endpoint is responding${NC}"
        return 0
    else
        echo -e "${RED}❌ $endpoint is not responding${NC}"
        return 1
    fi
}

# Function to test API endpoint with expected response
test_api_response() {
    local endpoint=$1
    local description=$2
    local expected_content=$3

    echo -e "\n${YELLOW}Testing $description...${NC}"

    response=$(curl -s "$endpoint" 2>/dev/null)

    if [[ -z "$response" ]]; then
        echo -e "${RED}❌ $endpoint returned empty response${NC}"
        return 1
    fi

    if [[ "$response" == *"$expected_content"* ]]; then
        echo -e "${GREEN}✅ $endpoint returned expected content${NC}"
        return 0
    else
        echo -e "${YELLOW}⚠️  $endpoint response format may be different${NC}"
        echo -e "${BLUE}Response: ${response:0:200}...${NC}"
        return 1
    fi
}

echo -e "${BLUE}📋 Step 1: Testing Backend API Endpoints${NC}"

# Test backend root endpoint
test_api_response "http://localhost:3001" "Backend API Root" "Welcome to the Reel-to-Reality"

# Test backend health endpoint
test_api_response "http://localhost:3001/api/health" "Backend Health Check" "Business API is running"

echo -e "\n${BLUE}📋 Step 2: Testing Frontend Server${NC}"

# Test frontend server
test_api_endpoint "http://localhost:8081" "Frontend Server"

echo -e "\n${BLUE}📋 Step 3: Testing Authentication Flow${NC}"

# Test login with demo credentials
echo -e "${YELLOW}Testing login with demo credentials...${NC}"
login_response=$(curl -s -X POST http://localhost:3001/api/business/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@business.com","password":"password123"}')

if [[ "$login_response" == *"success"* ]] && [[ "$login_response" == *"token"* ]]; then
    echo -e "${GREEN}✅ Demo login successful${NC}"

    # Extract token for testing
    token=$(echo $login_response | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
    echo -e "${BLUE}Token: ${token:0:20}...${NC}"

    # Test challenges endpoint with token
    echo -e "${YELLOW}Testing challenges endpoint...${NC}"
    challenges_response=$(curl -s "http://localhost:3001/api/business/challenges" \
      -H "Authorization: Bearer $token")

    if [[ "$challenges_response" == *"success"* ]] && [[ "$challenges_response" == *"challenges"* ]]; then
        echo -e "${GREEN}✅ Challenges endpoint working${NC}"
    else
        echo -e "${YELLOW}⚠️  Challenges endpoint returned unexpected format${NC}"
        echo -e "${BLUE}Response: ${challenges_response:0:200}...${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Demo login failed - may need manual setup${NC}"
    echo -e "${BLUE}Response: ${login_response:0:200}...${NC}"
fi

echo -e "\n${BLUE}📋 Step 4: Testing Business Registration${NC}"

# Test registration endpoint
echo -e "${YELLOW}Testing business registration...${NC}"
register_response=$(curl -s -X POST http://localhost:3001/api/business/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@business.com",
    "password":"testpass123",
    "businessName":"Test Business",
    "businessType":"cafe",
    "address":"123 Test St",
    "phone":"+1234567890"
  }')

if [[ "$register_response" == *"success"* ]] && [[ "$register_response" == *"token"* ]]; then
    echo -e "${GREEN}✅ Business registration working${NC}"
else
    echo -e "${YELLOW}⚠️  Business registration response:${NC}"
    echo -e "${BLUE}Response: ${register_response:0:200}...${NC}"
fi

echo -e "\n${BLUE}📋 Step 5: Connection Test Summary${NC}"

# Summary
echo -e "${YELLOW}🎯 Connection Test Results:${NC}"
echo -e "${BLUE}- Backend Server: http://localhost:3001${NC}"
echo -e "${BLUE}- Frontend Server: http://localhost:8081${NC}"
echo -e "${BLUE}- Business Dashboard: http://localhost:8081/business-dashboard${NC}"
echo -e "${BLUE}- Demo Login: demo@business.com / password123${NC}"

echo -e "\n${GREEN}✅ If all tests passed, your frontend and backend are connected!${NC}"
echo -e "\n${YELLOW}📋 Next Steps:${NC}"
echo -e "${YELLOW}1. Open http://localhost:8081 in your browser${NC}"
echo -e "${YELLOW}2. Click 'Business Dashboard'${NC}"
echo -e "${YELLOW}3. Use demo credentials to login${NC}"
echo -e "${YELLOW}4. You should see the business dashboard with challenges${NC}"

echo -e "\n${BLUE}🔧 Troubleshooting:${NC}"
echo -e "${YELLOW}- Make sure both servers are running${NC}"
echo -e "${YELLOW}- Check browser console for errors (F12)${NC}"
echo -e "${YELLOW}- Try hard refresh (Ctrl+F5)${NC}"
echo -e "${YELLOW}- Clear browser cache${NC}"

echo -e "\n${GREEN}🎉 Connection test complete!${NC}"
