#!/bin/bash

# Test Promo Code System
# Run this script to verify all promo code endpoints work

echo "================================"
echo "Promo Code System Test Script"
echo "================================"
echo ""

BASE_URL="http://localhost:3000"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "Testing against: $BASE_URL"
echo ""

# Test 1: Validate BLOCKC2024 for Block C
echo -e "${YELLOW}Test 1: Validate BLOCKC2024 for Block C${NC}"
RESPONSE=$(curl -s -X POST "$BASE_URL/api/promo/validate" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "BLOCKC2024",
    "contentType": "book",
    "contentId": "block-c",
    "email": "test@example.com"
  }')

if echo "$RESPONSE" | grep -q '"valid":true'; then
  echo -e "${GREEN}✓ BLOCKC2024 is valid for Block C${NC}"
  echo "$RESPONSE" | jq '.'
else
  echo -e "${RED}✗ BLOCKC2024 validation failed${NC}"
  echo "$RESPONSE"
fi
echo ""

# Test 2: Validate COAUTHOR2024 for meditation
echo -e "${YELLOW}Test 2: Validate COAUTHOR2024 for meditation${NC}"
RESPONSE=$(curl -s -X POST "$BASE_URL/api/promo/validate" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "COAUTHOR2024",
    "contentType": "meditation",
    "contentId": "morning-mindfulness",
    "email": "test@example.com"
  }')

if echo "$RESPONSE" | grep -q '"valid":true'; then
  echo -e "${GREEN}✓ COAUTHOR2024 is valid for meditations${NC}"
  echo "$RESPONSE" | jq '.'
else
  echo -e "${RED}✗ COAUTHOR2024 validation failed${NC}"
  echo "$RESPONSE"
fi
echo ""

# Test 3: Invalid code
echo -e "${YELLOW}Test 3: Invalid promo code (should fail)${NC}"
RESPONSE=$(curl -s -X POST "$BASE_URL/api/promo/validate" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "INVALIDCODE",
    "contentType": "book",
    "contentId": "block-c",
    "email": "test@example.com"
  }')

if echo "$RESPONSE" | grep -q '"valid":false'; then
  echo -e "${GREEN}✓ Invalid code correctly rejected${NC}"
  echo "$RESPONSE" | jq '.'
else
  echo -e "${RED}✗ Invalid code test failed${NC}"
  echo "$RESPONSE"
fi
echo ""

# Test 4: Get all promo codes (admin)
echo -e "${YELLOW}Test 4: Get all promo codes (admin)${NC}"
RESPONSE=$(curl -s -X GET "$BASE_URL/api/admin/promo-codes")

if echo "$RESPONSE" | grep -q '"success":true'; then
  echo -e "${GREEN}✓ Successfully retrieved promo codes${NC}"
  echo "$RESPONSE" | jq '.codes | length as $count | "Found \($count) promo codes"'
  echo "$RESPONSE" | jq '.codes[] | .code' | head -5
else
  echo -e "${RED}✗ Failed to retrieve promo codes${NC}"
  echo "$RESPONSE"
fi
echo ""

# Test 5: Unlock with promo code
echo -e "${YELLOW}Test 5: Unlock Block C with BLOCKC2024${NC}"
RESPONSE=$(curl -s -X POST "$BASE_URL/api/promo/unlock" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "BLOCKC2024",
    "contentType": "book",
    "contentId": "block-c",
    "email": "coauthor@example.com"
  }')

if echo "$RESPONSE" | grep -q '"success":true'; then
  echo -e "${GREEN}✓ Successfully unlocked Block C${NC}"
  echo "$RESPONSE" | jq '.'
else
  echo -e "${RED}✗ Failed to unlock Block C${NC}"
  echo "$RESPONSE"
fi
echo ""

echo "================================"
echo "Test Summary"
echo "================================"
echo ""
echo "If all tests show ✓, the promo code system is working!"
echo ""
echo "Next steps:"
echo "1. Start your dev server: npm run dev"
echo "2. Visit: http://localhost:3000/admin/promo-codes"
echo "3. Visit: http://localhost:3000/writing/books/block-c"
echo "4. Test promo code: BLOCKC2024"
echo ""
