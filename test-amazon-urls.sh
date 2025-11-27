#!/bin/bash

# Extract all Amazon image URLs and test them
echo "Testing Amazon Product Image URLs..."
echo "====================================="
echo ""

cd "/Volumes/Super Mastery/Webdesigner"

# Get all unique Amazon image URLs
grep -o 'https://m.media-amazon.com/images/I/[^"'\'']*' lib/affiliate-products.ts | sort -u | while read url; do
    # Remove trailing characters
    clean_url=$(echo "$url" | sed "s/'\],//g" | sed "s/'],//g")

    # Test the URL
    status=$(curl -s -o /dev/null -w "%{http_code}" "$clean_url")

    if [ "$status" = "200" ]; then
        echo "✅ $status - $clean_url"
    else
        echo "❌ $status - $clean_url"
    fi
done

echo ""
echo "====================================="
echo "Test complete!"
