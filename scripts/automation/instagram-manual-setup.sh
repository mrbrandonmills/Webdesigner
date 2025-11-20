#!/bin/bash

# Manual Instagram Setup - Direct Token Generation

echo "=========================================="
echo "INSTAGRAM MANUAL TOKEN SETUP"
echo "=========================================="
echo ""

APP_ID="1322977046248770"
APP_SECRET="04567d41bbaee516f732e48493c208e6"

echo "We need to get a Page Access Token manually."
echo ""
echo "OPTION 1: Use Access Token Tool (EASIEST)"
echo "=========================================="
echo ""
echo "1. Go to: https://developers.facebook.com/tools/accesstoken/"
echo "2. Find your 'Dopamills' Page"
echo "3. Click 'Generate Token' next to it"
echo "4. Copy the token (starts with EAA...)"
echo ""
echo "OPTION 2: Use Graph API Explorer"
echo "=========================================="
echo ""
echo "1. Go to: https://developers.facebook.com/tools/explorer/"
echo "2. Select 'Dopamills Automation' app at top"
echo "3. Click 'Get Token' dropdown"
echo "4. Choose 'Get Page Access Token'"
echo "5. Select 'Dopamills' page"
echo "6. Grant all permissions"
echo "7. Copy the token"
echo ""
echo "=========================================="
echo ""

# Open both tools
echo "Opening both tools for you..."
open "https://developers.facebook.com/tools/accesstoken/"
sleep 2
open "https://developers.facebook.com/tools/explorer/"

echo ""
read -p "Press ENTER after you have your token ready..."
echo ""
read -p "Paste your Page Access Token (EAA...): " PAGE_TOKEN
echo ""

if [[ ! $PAGE_TOKEN =~ ^EAA ]]; then
  echo "⚠️  Warning: Token doesn't start with 'EAA'"
  echo "   Make sure you copied a Page Access Token, not an App Token"
  echo ""
  read -p "Continue anyway? (y/n): " confirm
  if [[ $confirm != "y" ]]; then
    echo "Exiting..."
    exit 1
  fi
fi

echo "Testing token..."
echo ""

# Test the token
RESPONSE=$(curl -s "https://graph.facebook.com/v18.0/me?access_token=$PAGE_TOKEN")

if echo "$RESPONSE" | grep -q "error"; then
  echo "❌ Token test failed:"
  echo "$RESPONSE"
  exit 1
fi

PAGE_NAME=$(echo "$RESPONSE" | grep -o '"name":"[^"]*' | cut -d'"' -f4)
PAGE_ID=$(echo "$RESPONSE" | grep -o '"id":"[^"]*' | cut -d'"' -f4)

echo "✅ Token valid!"
echo "   Page: $PAGE_NAME"
echo "   Page ID: $PAGE_ID"
echo ""

# Get Instagram account
echo "Getting Instagram Business Account..."
IG_RESPONSE=$(curl -s "https://graph.facebook.com/v18.0/$PAGE_ID?fields=instagram_business_account&access_token=$PAGE_TOKEN")

if echo "$IG_RESPONSE" | grep -q "error"; then
  echo "❌ Could not get Instagram account:"
  echo "$IG_RESPONSE"
  exit 1
fi

IG_ACCOUNT_ID=$(echo "$IG_RESPONSE" | grep -o '"id":"[0-9]*' | cut -d'"' -f4)

if [ -z "$IG_ACCOUNT_ID" ]; then
  echo "❌ No Instagram Business Account connected to this page"
  echo "   Make sure your Instagram is connected in Page settings"
  exit 1
fi

echo "✅ Instagram Business Account ID: $IG_ACCOUNT_ID"
echo ""

# Test Instagram connection
echo "Testing Instagram connection..."
IG_TEST=$(curl -s "https://graph.facebook.com/v18.0/$IG_ACCOUNT_ID?fields=username&access_token=$PAGE_TOKEN")

IG_USERNAME=$(echo "$IG_TEST" | grep -o '"username":"[^"]*' | cut -d'"' -f4)

if [ -z "$IG_USERNAME" ]; then
  echo "❌ Could not verify Instagram username"
  echo "$IG_TEST"
  exit 1
fi

echo "✅ Connected to Instagram: @$IG_USERNAME"
echo ""

# Exchange for long-lived token
echo "Exchanging for long-lived token (60 days)..."
LONG_TOKEN_RESPONSE=$(curl -s "https://graph.facebook.com/v18.0/oauth/access_token?grant_type=fb_exchange_token&client_id=$APP_ID&client_secret=$APP_SECRET&fb_exchange_token=$PAGE_TOKEN")

if echo "$LONG_TOKEN_RESPONSE" | grep -q "access_token"; then
  LONG_TOKEN=$(echo "$LONG_TOKEN_RESPONSE" | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)
  echo "✅ Long-lived token obtained!"
  FINAL_TOKEN=$LONG_TOKEN
else
  echo "⚠️  Could not exchange for long-lived token"
  echo "   Using short-lived token (1-2 hours)"
  FINAL_TOKEN=$PAGE_TOKEN
fi
echo ""

# Update .env.local
echo "Updating .env.local..."

ENV_FILE="/Volumes/Super Mastery/Webdesigner/.env.local"

# Update each credential
sed -i '' "s|^META_APP_ID=.*|META_APP_ID=$APP_ID|" "$ENV_FILE"
sed -i '' "s|^META_APP_SECRET=.*|META_APP_SECRET=$APP_SECRET|" "$ENV_FILE"
sed -i '' "s|^INSTAGRAM_BUSINESS_ACCOUNT_ID=.*|INSTAGRAM_BUSINESS_ACCOUNT_ID=$IG_ACCOUNT_ID|" "$ENV_FILE"
sed -i '' "s|^FACEBOOK_PAGE_ID=.*|FACEBOOK_PAGE_ID=$PAGE_ID|" "$ENV_FILE"
sed -i '' "s|^INSTAGRAM_ACCESS_TOKEN=.*|INSTAGRAM_ACCESS_TOKEN=$FINAL_TOKEN|" "$ENV_FILE"

echo "✅ Credentials saved!"
echo ""

# Summary
echo "=========================================="
echo "✅ SETUP COMPLETE!"
echo "=========================================="
echo ""
echo "Instagram Account: @$IG_USERNAME"
echo "Instagram Business ID: $IG_ACCOUNT_ID"
echo "Facebook Page: $PAGE_NAME ($PAGE_ID)"
echo "Access Token: Saved to .env.local"
echo ""
echo "🚀 NEXT STEPS:"
echo ""
echo "1. Test automation (dry run):"
echo "   npm run automate:instagram:dry"
echo ""
echo "2. Start 4x/day posting:"
echo "   npm run automate:instagram"
echo ""
echo "=========================================="
echo ""
