#!/bin/bash

# Script to help organize Genesis modeling photos into categories
# Usage: ./organize-genesis-gallery.sh /path/to/genesis/photos

PHOTOS_DIR="${1:-$HOME/Downloads/Genesis}"
PUBLIC_DIR="/Volumes/Super Mastery/Webdesigner/public/images/gallery/genesis"

echo "📸 Genesis Gallery Organizer"
echo "============================"
echo ""
echo "This script will help you organize photos into:"
echo "  - Runway (fashion shows, catwalk)"
echo "  - Editorial (magazine shoots, GQ, Vogue)"
echo "  - Campaigns (brand campaigns, Dolce & Gabbana, Armani)"
echo ""

# Create category directories
mkdir -p "$PUBLIC_DIR/runway"
mkdir -p "$PUBLIC_DIR/editorial"
mkdir -p "$PUBLIC_DIR/campaigns"

if [ ! -d "$PHOTOS_DIR" ]; then
  echo "❌ Error: Photos directory not found: $PHOTOS_DIR"
  echo ""
  echo "Please download the Genesis photos from Google Drive and provide the path:"
  echo "  ./organize-genesis-gallery.sh /path/to/downloaded/photos"
  exit 1
fi

echo "📁 Source: $PHOTOS_DIR"
echo "📁 Destination: $PUBLIC_DIR"
echo ""

# List all image files
find "$PHOTOS_DIR" -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" \) | while read -r file; do
  filename=$(basename "$file")
  echo "Found: $filename"
done

echo ""
echo "Now, please manually organize these photos into the category folders:"
echo "  1. Open Finder and go to: $PHOTOS_DIR"
echo "  2. Look at each photo and determine if it's Runway, Editorial, or Campaign"
echo "  3. Copy photos to the appropriate folder in: $PUBLIC_DIR"
echo ""
echo "Or, tell me the naming pattern and I'll help you automate it!"
echo "  Example: Files with 'runway' in name go to runway folder"
