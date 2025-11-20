#!/bin/bash

echo "╔════════════════════════════════════════════════════════════╗"
echo "║   Instagram Automation - Quick Setup Script               ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

echo "📱 STEP 1: Instagram Business Account"
echo "══════════════════════════════════════════════════════════════"
echo ""
echo "Open Instagram app and do:"
echo "  1. Settings → Account → Switch to Professional Account"
echo "  2. Choose 'Business'"
echo "  3. Connect to Facebook Page"
echo ""
read -p "Press ENTER when your Instagram is Business account..."
echo ""

echo "🔧 STEP 2: Create Meta Developer App"
echo "══════════════════════════════════════════════════════════════"
echo ""
echo "Opening Meta Developer Console..."
open "https://developers.facebook.com/apps/create/"
echo ""
echo "In the browser that just opened:"
echo "  1. Click 'Create App'"
echo "  2. Choose 'Business' app type"
echo "  3. Display name: Brandon Mills Instagram"
echo "  4. Click 'Create App'"
echo "  5. Add Product: 'Instagram Graph API'"
echo ""
read -p "Press ENTER when app is created..."
echo ""

echo "🔑 STEP 3: Get Credentials"
echo "══════════════════════════════════════════════════════════════"
echo ""
echo "Opening App Settings..."
open "https://developers.facebook.com/apps/"
echo ""
echo "In the browser:"
echo "  1. Click your app"
echo "  2. Go to Settings → Basic"
echo "  3. Copy App ID and App Secret"
echo ""
read -p "Enter App ID: " APP_ID
read -p "Enter App Secret: " APP_SECRET
echo ""

echo "🎫 STEP 4: Generate Access Token"
echo "══════════════════════════════════════════════════════════════"
echo ""
echo "Opening Graph API Explorer..."
open "https://developers.facebook.com/tools/explorer/"
echo ""
echo "In the browser:"
echo "  1. Select your app from dropdown"
echo "  2. Click 'Generate Access Token'"
echo "  3. Grant permissions:"
echo "     - instagram_basic"
echo "     - instagram_content_publish"
echo "     - pages_read_engagement"
echo "     - pages_manage_posts"
echo "  4. Copy the token"
echo ""
read -p "Paste the short-lived token: " SHORT_TOKEN
echo ""

echo "🔄 Exchanging for long-lived token..."
EXCHANGE_URL="https://graph.facebook.com/v21.0/oauth/access_token?grant_type=fb_exchange_token&client_id=$APP_ID&client_secret=$APP_SECRET&fb_exchange_token=$SHORT_TOKEN"

LONG_TOKEN=$(curl -s "$EXCHANGE_URL" | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

if [ -z "$LONG_TOKEN" ]; then
  echo "❌ Failed to get long-lived token. Check your credentials."
  exit 1
fi

echo "✅ Long-lived token obtained!"
echo ""

echo "📍 STEP 5: Get Instagram Business Account ID"
echo "══════════════════════════════════════════════════════════════"
echo ""
echo "Fetching your Facebook Pages..."

PAGES=$(curl -s "https://graph.facebook.com/v21.0/me/accounts?access_token=$LONG_TOKEN")
echo "$PAGES" | grep -o '"name":"[^"]*' | cut -d'"' -f4 | nl
echo ""
read -p "Select page number: " PAGE_NUM

PAGE_ID=$(echo "$PAGES" | grep -o '"id":"[^"]*' | cut -d'"' -f4 | sed -n "${PAGE_NUM}p")

echo ""
echo "Fetching Instagram Business Account..."

IG_ACCOUNT=$(curl -s "https://graph.facebook.com/v21.0/$PAGE_ID?fields=instagram_business_account&access_token=$LONG_TOKEN")
IG_ID=$(echo "$IG_ACCOUNT" | grep -o '"id":"[^"]*' | cut -d'"' -f4 | head -1)

if [ -z "$IG_ID" ]; then
  echo "❌ No Instagram Business Account connected to this page."
  exit 1
fi

echo "✅ Instagram Business Account ID: $IG_ID"
echo ""

echo "🤖 STEP 6: OpenAI API Key"
echo "══════════════════════════════════════════════════════════════"
echo ""
echo "Opening OpenAI API Keys page..."
open "https://platform.openai.com/api-keys"
echo ""
echo "Create a new API key and paste it here:"
read -p "OpenAI API Key: " OPENAI_KEY
echo ""

echo "💾 STEP 7: Saving Configuration"
echo "══════════════════════════════════════════════════════════════"
echo ""

# Update .env.local
ENV_FILE=".env.local"

# Backup
cp "$ENV_FILE" "$ENV_FILE.backup"

# Replace Instagram section
sed -i '' "s/# META_APP_ID=/META_APP_ID=$APP_ID/" "$ENV_FILE"
sed -i '' "s/# META_APP_SECRET=/META_APP_SECRET=$APP_SECRET/" "$ENV_FILE"
sed -i '' "s/# INSTAGRAM_BUSINESS_ACCOUNT_ID=/INSTAGRAM_BUSINESS_ACCOUNT_ID=$IG_ID/" "$ENV_FILE"
sed -i '' "s/# FACEBOOK_PAGE_ID=/FACEBOOK_PAGE_ID=$PAGE_ID/" "$ENV_FILE"
sed -i '' "s/# INSTAGRAM_ACCESS_TOKEN=/INSTAGRAM_ACCESS_TOKEN=$LONG_TOKEN/" "$ENV_FILE"
sed -i '' "s/# INSTAGRAM_WEBHOOK_VERIFY_TOKEN=/INSTAGRAM_WEBHOOK_VERIFY_TOKEN=/" "$ENV_FILE"

# Add OpenAI key
sed -i '' "s/# OPENAI_API_KEY=sk-.*/OPENAI_API_KEY=$OPENAI_KEY/" "$ENV_FILE"

# Update status comments
sed -i '' 's/# INSTAGRAM AUTOMATION - PENDING CONFIGURATION/# INSTAGRAM AUTOMATION - ✅ CONFIGURED/' "$ENV_FILE"
sed -i '' 's/# OPENAI API - REQUIRED FOR INSTAGRAM CAPTIONS/# OPENAI API - ✅ CONFIGURED/' "$ENV_FILE"

echo "✅ Configuration saved!"
echo ""

echo "╔════════════════════════════════════════════════════════════╗"
echo "║   ✅ Setup Complete!                                      ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "Next commands:"
echo ""
echo "  Test setup:      npm run automate:instagram:dry"
echo "  Post once:       npm run automate:instagram:once"
echo "  Start automation: npm run automate:instagram"
echo ""
echo "🎉 You're ready to automate Instagram!"
