#!/bin/bash

# Instagram Meta Developer Setup - Quick Guide
# Opens all the right pages and guides you through credential generation

echo "=========================================="
echo "INSTAGRAM AUTOMATION - META SETUP WIZARD"
echo "=========================================="
echo ""
echo "This script will:"
echo "1. Open Meta Developer Console"
echo "2. Guide you through creating an app"
echo "3. Help you get all necessary credentials"
echo "4. Update your .env.local automatically"
echo ""
echo "Time needed: ~10 minutes"
echo ""
read -p "Press ENTER to start..."

# Step 1: Create Meta App
echo ""
echo "=========================================="
echo "STEP 1: Create Meta Developer App"
echo "=========================================="
echo ""
echo "Opening Meta Developer Console..."
open "https://developers.facebook.com/apps"
echo ""
echo "📋 INSTRUCTIONS:"
echo ""
echo "1. Click 'Create App' button"
echo "2. Choose 'Business' type → Next"
echo "3. App Details:"
echo "   - App Name: Dopamills Automation"
echo "   - App Contact Email: dopamills@brandonmills.com"
echo "   - Business Account: (Choose yours or skip)"
echo "4. Click 'Create App'"
echo "5. Wait for app to be created..."
echo ""
read -p "Done creating app? Press ENTER to continue..."

# Step 2: Add Instagram Product
echo ""
echo "=========================================="
echo "STEP 2: Add Instagram Graph API"
echo "=========================================="
echo ""
echo "📋 INSTRUCTIONS:"
echo ""
echo "1. Scroll down to 'Add Products'"
echo "2. Find 'Instagram' and click 'Set Up'"
echo "3. It will add Instagram Graph API to your app"
echo ""
read -p "Done adding Instagram? Press ENTER to continue..."

# Step 3: Get App ID and Secret
echo ""
echo "=========================================="
echo "STEP 3: Get App ID & App Secret"
echo "=========================================="
echo ""
echo "Opening Settings → Basic..."
open "https://developers.facebook.com/apps"
echo ""
echo "📋 INSTRUCTIONS:"
echo ""
echo "1. In your app, go to: Settings → Basic"
echo "2. Copy your App ID"
echo "3. Click 'Show' next to App Secret and copy it"
echo ""
echo "Enter them below:"
echo ""
read -p "App ID: " META_APP_ID
read -p "App Secret: " META_APP_SECRET
echo ""
echo "✅ App credentials saved!"

# Step 4: Get Access Token
echo ""
echo "=========================================="
echo "STEP 4: Generate Access Token"
echo "=========================================="
echo ""
echo "Opening Graph API Explorer..."
open "https://developers.facebook.com/tools/explorer"
echo ""
echo "📋 INSTRUCTIONS:"
echo ""
echo "1. At the top, select your app 'Dopamills Automation'"
echo "2. In 'User or Page' dropdown, select 'Dopamills' page"
echo "3. Click 'Generate Access Token'"
echo "4. Grant ALL Instagram permissions when prompted"
echo "5. Copy the long token (starts with 'EAA...')"
echo ""
echo "⚠️  IMPORTANT: This is a short-lived token."
echo "   We'll exchange it for a long-lived one (60 days) later."
echo ""
read -p "Access Token: " INSTAGRAM_ACCESS_TOKEN
echo ""
echo "✅ Access token saved!"

# Step 5: Get Instagram Business Account ID
echo ""
echo "=========================================="
echo "STEP 5: Get Instagram Business Account ID"
echo "=========================================="
echo ""
echo "📋 INSTRUCTIONS:"
echo ""
echo "Still in Graph API Explorer:"
echo "1. Make sure 'Dopamills' page is selected"
echo "2. In the query field (right side), enter:"
echo "   me?fields=instagram_business_account"
echo "3. Click 'Submit'"
echo "4. Copy the 'instagram_business_account' > 'id' from response"
echo ""
read -p "Instagram Business Account ID: " INSTAGRAM_BUSINESS_ACCOUNT_ID
echo ""
echo "✅ Instagram Business Account ID saved!"

# Step 6: Get Facebook Page ID
echo ""
echo "=========================================="
echo "STEP 6: Get Facebook Page ID"
echo "=========================================="
echo ""
echo "Opening your Dopamills Facebook Page..."
open "https://www.facebook.com/dopamills"
echo ""
echo "📋 INSTRUCTIONS:"
echo ""
echo "1. Go to your Dopamills page"
echo "2. Click 'About' tab"
echo "3. Scroll down to find 'Page ID'"
echo "   OR look at the URL: facebook.com/PAGE_ID"
echo ""
read -p "Facebook Page ID: " FACEBOOK_PAGE_ID
echo ""
echo "✅ Facebook Page ID saved!"

# Step 7: Update .env.local
echo ""
echo "=========================================="
echo "STEP 7: Updating .env.local"
echo "=========================================="
echo ""

ENV_FILE="/Volumes/Super Mastery/Webdesigner/.env.local"

# Check if Instagram section exists
if grep -q "# Instagram Automation" "$ENV_FILE"; then
  echo "Instagram section found in .env.local"
  echo "Updating existing credentials..."

  # Update each credential
  sed -i '' "s|^META_APP_ID=.*|META_APP_ID=$META_APP_ID|" "$ENV_FILE"
  sed -i '' "s|^META_APP_SECRET=.*|META_APP_SECRET=$META_APP_SECRET|" "$ENV_FILE"
  sed -i '' "s|^INSTAGRAM_BUSINESS_ACCOUNT_ID=.*|INSTAGRAM_BUSINESS_ACCOUNT_ID=$INSTAGRAM_BUSINESS_ACCOUNT_ID|" "$ENV_FILE"
  sed -i '' "s|^FACEBOOK_PAGE_ID=.*|FACEBOOK_PAGE_ID=$FACEBOOK_PAGE_ID|" "$ENV_FILE"
  sed -i '' "s|^INSTAGRAM_ACCESS_TOKEN=.*|INSTAGRAM_ACCESS_TOKEN=$INSTAGRAM_ACCESS_TOKEN|" "$ENV_FILE"
else
  echo "Adding Instagram credentials to .env.local..."

  cat >> "$ENV_FILE" << EOF

# ============================================
# INSTAGRAM AUTOMATION - Dopamills Account
# ============================================
META_APP_ID=$META_APP_ID
META_APP_SECRET=$META_APP_SECRET
INSTAGRAM_BUSINESS_ACCOUNT_ID=$INSTAGRAM_BUSINESS_ACCOUNT_ID
FACEBOOK_PAGE_ID=$FACEBOOK_PAGE_ID
INSTAGRAM_ACCESS_TOKEN=$INSTAGRAM_ACCESS_TOKEN
INSTAGRAM_WEBHOOK_VERIFY_TOKEN=dopamills_webhook_2024
EOF
fi

echo "✅ .env.local updated!"

# Step 8: Exchange for long-lived token
echo ""
echo "=========================================="
echo "STEP 8: Exchange for Long-Lived Token"
echo "=========================================="
echo ""
echo "Converting short-lived token (1 hour) to long-lived token (60 days)..."
echo ""

# Exchange token using Meta API
LONG_LIVED_RESPONSE=$(curl -s "https://graph.facebook.com/v18.0/oauth/access_token?grant_type=fb_exchange_token&client_id=$META_APP_ID&client_secret=$META_APP_SECRET&fb_exchange_token=$INSTAGRAM_ACCESS_TOKEN")

if echo "$LONG_LIVED_RESPONSE" | grep -q "access_token"; then
  LONG_LIVED_TOKEN=$(echo "$LONG_LIVED_RESPONSE" | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

  # Update .env.local with long-lived token
  sed -i '' "s|^INSTAGRAM_ACCESS_TOKEN=.*|INSTAGRAM_ACCESS_TOKEN=$LONG_LIVED_TOKEN|" "$ENV_FILE"

  echo "✅ Long-lived token obtained and saved!"
  echo "   Token will last 60 days"
else
  echo "⚠️  Could not exchange token automatically."
  echo "   Your current token will work for 1 hour."
  echo "   You can exchange it manually later."
fi

# Step 9: Verify setup
echo ""
echo "=========================================="
echo "STEP 9: Verify Setup"
echo "=========================================="
echo ""
echo "Testing Instagram API connection..."
echo ""

# Test API call
TEST_RESPONSE=$(curl -s "https://graph.facebook.com/v18.0/$INSTAGRAM_BUSINESS_ACCOUNT_ID?fields=id,username&access_token=$INSTAGRAM_ACCESS_TOKEN")

if echo "$TEST_RESPONSE" | grep -q "dopamills"; then
  echo "✅ SUCCESS! Instagram API is working!"
  echo ""
  echo "Account verified: @dopamills"
else
  echo "⚠️  Could not verify connection."
  echo "   Response: $TEST_RESPONSE"
  echo "   You may need to check your credentials."
fi

# Final summary
echo ""
echo "=========================================="
echo "✅ SETUP COMPLETE!"
echo "=========================================="
echo ""
echo "Your Instagram automation is configured for:"
echo "  Account: @dopamills"
echo "  Facebook Page: Dopamills"
echo "  App: Dopamills Automation"
echo ""
echo "📋 CREDENTIALS SAVED TO:"
echo "  /Volumes/Super Mastery/Webdesigner/.env.local"
echo ""
echo "🚀 NEXT STEPS:"
echo ""
echo "1. Test with dry run:"
echo "   npm run automate:instagram:dry"
echo ""
echo "2. If test looks good, start automation:"
echo "   npm run automate:instagram"
echo ""
echo "3. Automation will post 4x per day:"
echo "   - 9:00am, 12:30pm, 6:30pm, 9:00pm"
echo "   - Natural captions by GPT-4o"
echo "   - Auto-reply to comments"
echo "   - Product rotation from Printful"
echo ""
echo "⚠️  TOKEN REMINDER:"
echo "   Your access token expires in 60 days."
echo "   You'll need to refresh it before then."
echo ""
echo "=========================================="
echo ""

