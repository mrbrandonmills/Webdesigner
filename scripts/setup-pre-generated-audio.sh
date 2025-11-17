#!/bin/bash

# Setup Pre-Generated Audio
# This script automates the entire process of generating and deploying pre-generated audio

set -e

echo "=================================="
echo "Pre-Generated Audio Setup"
echo "=================================="
echo ""

# Check if environment variables are set
if [ -z "$CARTESIA_API_KEY" ]; then
    echo "❌ Error: CARTESIA_API_KEY not set"
    echo "Please add it to .env.local:"
    echo "  CARTESIA_API_KEY=your_key_here"
    exit 1
fi

if [ -z "$BLOB_READ_WRITE_TOKEN" ]; then
    echo "❌ Error: BLOB_READ_WRITE_TOKEN not set"
    echo "Please add it to .env.local:"
    echo "  BLOB_READ_WRITE_TOKEN=your_token_here"
    echo ""
    echo "Get it from: Vercel Dashboard → Storage → Blob"
    exit 1
fi

echo "✓ Environment variables configured"
echo ""

# Step 1: Generate audio files
echo "Step 1/4: Generating audio files..."
echo "This will take approximately 12-15 minutes"
echo ""
npm run audio:generate

if [ $? -ne 0 ]; then
    echo "❌ Audio generation failed"
    exit 1
fi

echo ""
echo "✓ Audio generation complete"
echo ""

# Step 2: Update API route with URLs
echo "Step 2/4: Updating API route with generated URLs..."
npm run audio:update-urls

if [ $? -ne 0 ]; then
    echo "❌ URL update failed"
    exit 1
fi

echo "✓ API route updated"
echo ""

# Step 3: Show git status
echo "Step 3/4: Checking changes..."
echo ""
git status app/api/get-poem-audio/route.ts

echo ""
echo "✓ Changes ready for commit"
echo ""

# Step 4: Instructions
echo "Step 4/4: Deploy to production"
echo ""
echo "Run these commands to deploy:"
echo ""
echo "  git add app/api/get-poem-audio/route.ts"
echo "  git commit -m \"Add pre-generated audio URLs for instant playback\""
echo "  git push"
echo ""
echo "=================================="
echo "Setup Complete!"
echo "=================================="
echo ""
echo "Generated audio files:"
echo "  - 3 poems × 4 voices = 12 files"
echo "  - Uploaded to Vercel Blob storage"
echo "  - URLs updated in API route"
echo ""
echo "Next: Commit and deploy to production"
