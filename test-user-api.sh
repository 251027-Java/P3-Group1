#!/bin/bash

# Test script for User Profile API with Docker Compose
# Usage: ./test-user-api.sh

echo "🚀 Testing User Profile API through API Gateway"
echo "================================================"
echo ""

GATEWAY_URL="http://localhost:8080"
BASE_URL="$GATEWAY_URL/api/react"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

test_endpoint() {
    local method=$1
    local endpoint=$2
    local description=$3
    local data=$4
    
    echo -e "${YELLOW}Testing:${NC} $description"
    echo "  $method $endpoint"
    
    if [ -z "$data" ]; then
        response=$(curl -s -w "\n%{http_code}" -X $method "$endpoint")
    else
        response=$(curl -s -w "\n%{http_code}" -X $method \
            -H "Content-Type: application/json" \
            -d "$data" \
            "$endpoint")
    fi
    
    status=$(echo "$response" | tail -n 1)
    body=$(echo "$response" | sed '$d')
    
    if [ $status -ge 200 ] && [ $status -lt 300 ]; then
        echo -e "  ${GREEN}✓ Success ($status)${NC}"
        echo "  Response: ${body:0:100}..."
    elif [ $status -eq 404 ]; then
        echo -e "  ${YELLOW}⚠ Not Found ($status)${NC} - May not exist yet"
        echo "  Response: $body"
    else
        echo -e "  ${RED}✗ Failed ($status)${NC}"
        echo "  Response: $body"
    fi
    echo ""
}

echo "1️⃣  Testing Gateway Health"
echo "=========================="
curl -s http://localhost:8080/actuator/health | jq '.' 2>/dev/null || curl -s http://localhost:8080/actuator/health
echo ""
echo ""

echo "2️⃣  Testing User Endpoints"
echo "=========================="
echo ""

# Test getting all users (from GlobalController)
test_endpoint "GET" "$BASE_URL" "Get all users"

# Test getting a specific user
test_endpoint "GET" "$BASE_URL/users/1" "Get user by ID (1)"

# Test getting user statistics
test_endpoint "GET" "$BASE_URL/users/1/statistics" "Get user statistics"

# Test getting user's friends
test_endpoint "GET" "$BASE_URL/users/1/friends" "Get user's friends"

# Test getting user's library (IDs only)
test_endpoint "GET" "$BASE_URL/users/1/library" "Get user's game library (IDs)"

# Test getting user's library (full objects)
test_endpoint "GET" "$BASE_URL/users/1/library/full" "Get user's game library (full)"

# Test getting user's wishlist
test_endpoint "GET" "$BASE_URL/users/1/wishlist" "Get user's wishlist"

# Test getting user's rewards
test_endpoint "GET" "$BASE_URL/users/1/rewards" "Get user's rewards"

# Test getting user's notifications
test_endpoint "GET" "$BASE_URL/users/1/notifications" "Get user's notifications"

# Test getting user's posts
test_endpoint "GET" "$BASE_URL/users/1/posts" "Get user's community posts"

echo ""
echo "3️⃣  Testing Update Operations"
echo "=============================="
echo ""

# Test updating user profile
test_endpoint "PUT" "$BASE_URL/users/1/profile" "Update user profile" \
    '{"displayName":"TestUser","canSell":true}'

# Test adding notification
test_endpoint "POST" "$BASE_URL/users/1/notifications" "Add notification" \
    '{"type":"test","message":"Test notification","timestamp":"2026-01-21T10:00:00"}'

echo ""
echo "✅ Testing Complete!"
echo ""
echo "📝 Notes:"
echo "   - Some endpoints may return 404 if no data exists yet"
echo "   - Use docker-compose logs to debug any issues"
echo "   - Check gateway routing: docker-compose logs api-gateway"
echo ""
