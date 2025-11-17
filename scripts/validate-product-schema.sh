#!/bin/bash

# Product Schema Validation Script
# Tests all 21 product pages for valid JSON-LD schema markup

echo "🔍 Validating Product Schema Markup on All 21 Products"
echo "========================================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Base URL
BASE_URL="http://localhost:3000"

# Product slugs from affiliate-products.ts
PRODUCTS=(
  "braun-ipl-laser-hair-removal"
  "la-mer-moisturizing-cream"
  "skinceuticals-vitamin-c-serum"
  "macbook-pro-16-m3-max"
  "iphone-16-pro-max"
  "godox-led-video-light"
  "atomic-habits-book"
  "meditations-marcus-aurelius"
  "sapiens-harari"
  "the-republic-plato"
  "nasa-vintage-hoodie"
  "nasa-worm-logo-shirt"
  "spider-farmer-led-grow-light"
  "airpods-max"
  "ipad-pro-13-m4"
  "sony-wh-1000xm5-headphones"
  "apple-watch-ultra-2"
  "yeti-rambler-30oz"
  "kindle-oasis"
  "moleskine-classic-notebook"
  "rocketbook-everlast"
)

TOTAL=${#PRODUCTS[@]}
PASSED=0
FAILED=0

echo "Testing $TOTAL products..."
echo ""

for slug in "${PRODUCTS[@]}"; do
  URL="$BASE_URL/shop/$slug"

  # Fetch the page and check for schema
  RESPONSE=$(curl -s "$URL")

  # Check for Product schema
  if echo "$RESPONSE" | grep -q '"@type": "Product"'; then
    # Check for all required fields
    HAS_NAME=$(echo "$RESPONSE" | grep -q '"name":' && echo "yes" || echo "no")
    HAS_PRICE=$(echo "$RESPONSE" | grep -q '"price":' && echo "yes" || echo "no")
    HAS_RATING=$(echo "$RESPONSE" | grep -q '"aggregateRating":' && echo "yes" || echo "no")
    HAS_BRAND=$(echo "$RESPONSE" | grep -q '"brand":' && echo "yes" || echo "no")
    HAS_BREADCRUMB=$(echo "$RESPONSE" | grep -q '"@type": "BreadcrumbList"' && echo "yes" || echo "no")

    if [[ "$HAS_NAME" == "yes" && "$HAS_PRICE" == "yes" && "$HAS_RATING" == "yes" && "$HAS_BRAND" == "yes" && "$HAS_BREADCRUMB" == "yes" ]]; then
      echo -e "${GREEN}✓${NC} $slug"
      ((PASSED++))
    else
      echo -e "${YELLOW}⚠${NC} $slug (missing fields)"
      echo "  Name: $HAS_NAME | Price: $HAS_PRICE | Rating: $HAS_RATING | Brand: $HAS_BRAND | Breadcrumb: $HAS_BREADCRUMB"
      ((FAILED++))
    fi
  else
    echo -e "${RED}✗${NC} $slug (no schema found)"
    ((FAILED++))
  fi
done

echo ""
echo "========================================================"
echo "Results: $PASSED/$TOTAL passed"

if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}🎉 All products have valid schema markup!${NC}"
  exit 0
else
  echo -e "${RED}❌ $FAILED products have issues${NC}"
  exit 1
fi
