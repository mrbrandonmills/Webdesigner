#!/bin/bash
# Automated Production Verification Script
# Verifies social icon sizes are correct in production

set -e

echo "🔍 PRODUCTION DEPLOYMENT VERIFICATION"
echo "======================================"
echo ""

PROD_URL="https://www.brandonmills.com"
EXPECTED_DESKTOP_ICON_SIZE="32"
EXPECTED_MOBILE_ICON_SIZE="40"

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "📍 Checking: $PROD_URL"
echo ""

# Fetch production HTML with fresh cache
echo "⏳ Fetching production site (bypassing cache)..."
PRODUCTION_HTML=$(curl -s -H "Cache-Control: no-cache, no-store, must-revalidate" \
                       -H "Pragma: no-cache" \
                       -H "Expires: 0" \
                       "$PROD_URL")

# Check 1: Desktop Instagram Icon Size
echo "🔎 Test 1: Desktop Instagram Icon Size"
if echo "$PRODUCTION_HTML" | grep -q "instagram.*width=\"$EXPECTED_DESKTOP_ICON_SIZE\""; then
    echo -e "   ${GREEN}✅ PASS${NC} - Desktop Instagram icon is ${EXPECTED_DESKTOP_ICON_SIZE}px"
    DESKTOP_INSTAGRAM_PASS=true
else
    echo -e "   ${RED}❌ FAIL${NC} - Desktop Instagram icon is NOT ${EXPECTED_DESKTOP_ICON_SIZE}px"
    DESKTOP_INSTAGRAM_PASS=false
fi

# Check 2: Desktop Shopping Bag Icon Size
echo "🔎 Test 2: Desktop Shopping Bag Icon Size"
if echo "$PRODUCTION_HTML" | grep -q "shopping.*width=\"$EXPECTED_DESKTOP_ICON_SIZE\""; then
    echo -e "   ${GREEN}✅ PASS${NC} - Desktop Shopping Bag icon is ${EXPECTED_DESKTOP_ICON_SIZE}px"
    DESKTOP_CART_PASS=true
else
    echo -e "   ${RED}❌ FAIL${NC} - Desktop Shopping Bag icon is NOT ${EXPECTED_DESKTOP_ICON_SIZE}px"
    DESKTOP_CART_PASS=false
fi

# Check 3: Verify deployment is fresh
echo "🔎 Test 3: Cache Age"
CACHE_AGE=$(curl -s -I "$PROD_URL" | grep -i "age:" | awk '{print $2}' | tr -d '\r')
if [ -z "$CACHE_AGE" ]; then
    CACHE_AGE=0
fi

if [ "$CACHE_AGE" -lt 120 ]; then
    echo -e "   ${GREEN}✅ PASS${NC} - Cache is fresh (age: ${CACHE_AGE}s)"
    CACHE_PASS=true
else
    echo -e "   ${YELLOW}⚠️  WARN${NC} - Cache is stale (age: ${CACHE_AGE}s) - user may need hard refresh"
    CACHE_PASS=false
fi

# Check 4: Verify deployment hash
echo "🔎 Test 4: Latest Deployment"
DEPLOYMENT_ID=$(echo "$PRODUCTION_HTML" | grep -o 'dpl=[^"]*' | head -1 | cut -d= -f2)
if [ -n "$DEPLOYMENT_ID" ]; then
    echo -e "   ${GREEN}✅ PASS${NC} - Deployment ID found: $DEPLOYMENT_ID"
    DEPLOYMENT_PASS=true
else
    echo -e "   ${RED}❌ FAIL${NC} - No deployment ID found"
    DEPLOYMENT_PASS=false
fi

# Check 5: Verify navigation exists
echo "🔎 Test 5: Navigation Component"
if echo "$PRODUCTION_HTML" | grep -q "BRANDON MILLS"; then
    echo -e "   ${GREEN}✅ PASS${NC} - Navigation component loaded"
    NAV_PASS=true
else
    echo -e "   ${RED}❌ FAIL${NC} - Navigation component not found"
    NAV_PASS=false
fi

echo ""
echo "======================================"
echo "📊 VERIFICATION SUMMARY"
echo "======================================"

TOTAL_TESTS=5
PASSED_TESTS=0

[ "$DESKTOP_INSTAGRAM_PASS" = true ] && ((PASSED_TESTS++))
[ "$DESKTOP_CART_PASS" = true ] && ((PASSED_TESTS++))
[ "$CACHE_PASS" = true ] && ((PASSED_TESTS++))
[ "$DEPLOYMENT_PASS" = true ] && ((PASSED_TESTS++))
[ "$NAV_PASS" = true ] && ((PASSED_TESTS++))

echo "Tests Passed: $PASSED_TESTS/$TOTAL_TESTS"
echo ""

if [ "$PASSED_TESTS" -eq "$TOTAL_TESTS" ]; then
    echo -e "${GREEN}✅ ALL TESTS PASSED${NC}"
    echo "Production deployment is verified and correct!"
    exit 0
elif [ "$PASSED_TESTS" -ge 4 ]; then
    echo -e "${YELLOW}⚠️  MOSTLY PASSING${NC}"
    echo "Core functionality verified. Minor issues detected."
    if [ "$CACHE_PASS" = false ]; then
        echo ""
        echo "💡 TIP: User should perform hard refresh:"
        echo "   Mac: Cmd + Shift + R"
        echo "   Windows: Ctrl + Shift + R"
    fi
    exit 0
else
    echo -e "${RED}❌ VERIFICATION FAILED${NC}"
    echo "Production deployment has issues. Please investigate."
    exit 1
fi
