#!/usr/bin/env npx tsx

/**
 * Amazon Product Image Scraper
 *
 * Fetches current product images directly from Amazon product pages
 * and updates affiliate-products.ts with working image URLs.
 *
 * This is the workaround solution until PA-API access is available
 * (requires 10 qualifying sales in last 30 days).
 */

import { chromium } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

interface ProductData {
  asin: string;
  url: string;
  imageUrl: string | null;
  error?: string;
}

// Extract ASINs from affiliate-products.ts
function extractASINs(): Array<{ asin: string; url: string }> {
  const filePath = path.join(__dirname, '../lib/affiliate-products.ts');
  const content = fs.readFileSync(filePath, 'utf-8');

  const urlRegex = /amazonUrl:\s*`([^`]+)`/g;
  const products: Array<{ asin: string; url: string }> = [];

  let match;
  while ((match = urlRegex.exec(content)) !== null) {
    const url = match[1];
    const asinMatch = url.match(/\/(dp|gp\/product)\/([A-Z0-9]{10})/);
    if (asinMatch) {
      products.push({
        asin: asinMatch[2],
        url: url
      });
    }
  }

  return products;
}

// Scrape image URL from Amazon product page
async function scrapeProductImage(url: string): Promise<string | null> {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    // Navigate to product page
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

    // Wait for image to load
    await page.waitForSelector('#landingImage, #imgBlkFront, #main-image', { timeout: 10000 });

    // Extract primary image URL (try multiple selectors)
    const imageUrl = await page.evaluate(() => {
      // Try main product image selectors
      const selectors = [
        '#landingImage',
        '#imgBlkFront',
        '#main-image',
        'img[data-a-image-name="landingImage"]',
        '.a-dynamic-image'
      ];

      for (const selector of selectors) {
        const img = document.querySelector(selector) as HTMLImageElement;
        if (img && img.src) {
          // Get highest quality version of image
          let src = img.src;

          // Replace size constraints with large version
          src = src.replace(/\._[A-Z]{2}[0-9]+_\./, '._SL1500_.');
          src = src.replace(/\._[A-Z]{2}[0-9]+,/, '._SL1500_,');

          return src;
        }
      }

      return null;
    });

    await browser.close();
    return imageUrl;
  } catch (error) {
    await browser.close();
    throw error;
  }
}

// Update affiliate-products.ts with new image URLs
function updateProductFile(updates: ProductData[]) {
  const filePath = path.join(__dirname, '../lib/affiliate-products.ts');
  let content = fs.readFileSync(filePath, 'utf-8');

  let updateCount = 0;

  updates.forEach((update) => {
    if (!update.imageUrl) return;

    // Split content into lines for easier processing
    const lines = content.split('\n');
    let updated = false;

    for (let i = 0; i < lines.length; i++) {
      // Find amazonUrl line containing this ASIN
      if (lines[i].includes('amazonUrl:') && lines[i].includes(update.asin)) {
        // Search forward for the images array (should be 1-3 lines below)
        for (let j = i + 1; j < Math.min(lines.length, i + 5); j++) {
          if (lines[j].trim().startsWith('images:')) {
            // Replace the images line
            const indent = lines[j].match(/^\s*/)?.[0] || '    ';
            lines[j] = `${indent}images: ['${update.imageUrl}'],`;
            updated = true;
            updateCount++;
            console.log(`✓ Updated ASIN ${update.asin}`);
            break;
          }
        }
        break;
      }
    }

    if (updated) {
      content = lines.join('\n');
    }
  });

  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`\n✅ Updated ${updateCount} products with current image URLs`);
}

// Main execution
async function main() {
  console.log('🔍 Amazon Product Image Scraper');
  console.log('================================\n');

  // Step 1: Extract ASINs
  console.log('📋 Step 1: Extracting ASINs from affiliate-products.ts...');
  const products = extractASINs();
  console.log(`   Found ${products.length} Amazon products\n`);

  if (products.length === 0) {
    console.log('ℹ️  No Amazon products found. Exiting.\n');
    return;
  }

  // Step 2: Scrape images from Amazon
  console.log('📋 Step 2: Scraping current images from Amazon...');
  console.log('   This will take a few minutes (rate limiting delays)\n');

  const updates: ProductData[] = [];

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    console.log(`   [${i + 1}/${products.length}] Fetching ${product.asin}...`);

    try {
      const imageUrl = await scrapeProductImage(product.url);
      updates.push({
        asin: product.asin,
        url: product.url,
        imageUrl
      });

      if (imageUrl) {
        console.log(`      ✓ Got image URL`);
      } else {
        console.log(`      ⚠️  No image found`);
      }
    } catch (error) {
      console.log(`      ❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      updates.push({
        asin: product.asin,
        url: product.url,
        imageUrl: null,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // Rate limiting: wait 2 seconds between requests
    if (i < products.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  // Step 3: Update file
  console.log('\n📋 Step 3: Updating affiliate-products.ts...\n');
  updateProductFile(updates);

  // Step 4: Summary
  const successful = updates.filter(u => u.imageUrl !== null).length;
  const failed = updates.filter(u => u.imageUrl === null).length;

  console.log('\n📊 Summary:');
  console.log(`   ✓ Successfully updated: ${successful}`);
  console.log(`   ❌ Failed: ${failed}\n`);

  if (failed > 0) {
    console.log('⚠️  Some products could not be updated. These may need manual review.\n');
  }

  console.log('🎉 Complete! Run `npm run build` to rebuild with updated images.\n');
}

main().catch((error) => {
  console.error('\n❌ Fatal Error:', error);
  process.exit(1);
});
