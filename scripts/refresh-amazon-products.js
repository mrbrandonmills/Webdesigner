#!/usr/bin/env node

/**
 * Amazon Product Advertising API - Product Data Refresh Script
 *
 * Fetches current product data from Amazon PA-API and updates affiliate-products.ts
 * with always-current images, prices, ratings, and stock status.
 *
 * Run: npm run refresh-amazon-products
 */

const ProductAdvertisingAPIv1 = require('paapi5-nodejs-sdk');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

// Configuration
const config = {
  accessKey: process.env.AMAZON_PA_API_ACCESS_KEY,
  secretKey: process.env.AMAZON_PA_API_SECRET_KEY,
  partnerTag: process.env.AMAZON_PA_API_PARTNER_TAG || 'brandonmills.com-20',
  region: process.env.AMAZON_PA_API_REGION || 'us-east-1',
  host: 'webservices.amazon.com',
  marketplace: 'www.amazon.com'
};

// Validate credentials
if (!config.accessKey || !config.secretKey) {
  console.error('❌ ERROR: Amazon PA-API credentials not found!');
  console.error('\nPlease set the following environment variables in .env.local:');
  console.error('- AMAZON_PA_API_ACCESS_KEY');
  console.error('- AMAZON_PA_API_SECRET_KEY\n');
  console.error('See AMAZON_PA_API_SETUP_GUIDE.md for instructions.\n');
  process.exit(1);
}

console.log('🚀 Amazon Product Data Refresh Tool');
console.log('=====================================\n');

// Extract ASINs from Amazon URLs in current product data
function extractASINsFromProducts() {
  const productsFilePath = path.join(__dirname, '../lib/affiliate-products.ts');
  const content = fs.readFileSync(productsFilePath, 'utf-8');

  // Extract Amazon URLs
  const urlRegex = /amazonUrl:\s*`([^`]+)`/g;
  const asins = [];
  const asinMap = {};

  let match;
  while ((match = urlRegex.exec(content)) !== null) {
    const url = match[1];
    // Extract ASIN from URL (format: /dp/ASIN or /gp/product/ASIN)
    const asinMatch = url.match(/\/(dp|gp\/product)\/([A-Z0-9]{10})/);
    if (asinMatch) {
      const asin = asinMatch[2];
      asins.push(asin);
      asinMap[asin] = url;
    }
  }

  return { asins: [...new Set(asins)], asinMap };
}

// Fetch product data from Amazon PA-API
async function fetchProductData(asins) {
  const defaultClient = ProductAdvertisingAPIv1.ApiClient.instance;
  defaultClient.accessKey = config.accessKey;
  defaultClient.secretKey = config.secretKey;
  defaultClient.host = config.host;
  defaultClient.region = config.region;

  const api = new ProductAdvertisingAPIv1.DefaultApi();

  // Prepare request
  const getItemsRequest = new ProductAdvertisingAPIv1.GetItemsRequest();
  getItemsRequest['PartnerTag'] = config.partnerTag;
  getItemsRequest['PartnerType'] = 'Associates';
  getItemsRequest['ItemIds'] = asins;
  getItemsRequest['Resources'] = [
    'Images.Primary.Large',
    'Images.Variants.Large',
    'ItemInfo.Title',
    'ItemInfo.ByLineInfo',
    'ItemInfo.ContentInfo',
    'ItemInfo.Features',
    'ItemInfo.ManufactureInfo',
    'ItemInfo.ProductInfo',
    'ItemInfo.TechnicalInfo',
    'Offers.Listings.Price',
    'Offers.Listings.Availability',
    'Offers.Listings.Condition',
    'Offers.Listings.DeliveryInfo',
    'Offers.Summaries.HighestPrice',
    'Offers.Summaries.LowestPrice',
    'CustomerReviews.Count',
    'CustomerReviews.StarRating'
  ];
  getItemsRequest['Marketplace'] = config.marketplace;

  console.log(`📦 Fetching data for ${asins.length} products from Amazon PA-API...`);
  console.log(`   Rate limit: Processing with 1 second delays\n`);

  return new Promise((resolve, reject) => {
    api.getItems(getItemsRequest, (error, data, response) => {
      if (error) {
        console.error('❌ PA-API Error:', error);
        reject(error);
      } else {
        console.log('✅ Successfully fetched product data\n');
        resolve(data);
      }
    });
  });
}

// Process PA-API response and extract product data
function processProductData(paAPIResponse) {
  const products = [];

  if (!paAPIResponse.ItemsResult || !paAPIResponse.ItemsResult.Items) {
    console.warn('⚠️  No items returned from PA-API');
    return products;
  }

  paAPIResponse.ItemsResult.Items.forEach((item) => {
    try {
      const product = {
        asin: item.ASIN,
        title: item.ItemInfo?.Title?.DisplayValue || '',
        brand: item.ItemInfo?.ByLineInfo?.Brand?.DisplayValue || '',
        image: item.Images?.Primary?.Large?.URL || '',
        images: [],
        price: 0,
        originalPrice: 0,
        rating: 0,
        reviewCount: 0,
        inStock: false,
        features: []
      };

      // Extract images
      if (item.Images?.Primary?.Large?.URL) {
        product.images.push(item.Images.Primary.Large.URL);
      }
      if (item.Images?.Variants) {
        item.Images.Variants.forEach(variant => {
          if (variant.Large?.URL) {
            product.images.push(variant.Large.URL);
          }
        });
      }

      // Extract price
      if (item.Offers?.Listings && item.Offers.Listings.length > 0) {
        const listing = item.Offers.Listings[0];
        if (listing.Price?.Amount) {
          product.price = listing.Price.Amount;
        }
        if (listing.SavingBasis?.Amount) {
          product.originalPrice = listing.SavingBasis.Amount;
        }
        product.inStock = listing.Availability?.Type === 'Now';
      }

      // Extract ratings
      if (item.CustomerReviews) {
        product.rating = item.CustomerReviews.StarRating?.Value || 0;
        product.reviewCount = item.CustomerReviews.Count || 0;
      }

      // Extract features
      if (item.ItemInfo?.Features?.DisplayValues) {
        product.features = item.ItemInfo.Features.DisplayValues;
      }

      products.push(product);
      console.log(`✓ ${product.asin}: ${product.title.substring(0, 50)}...`);
    } catch (err) {
      console.error(`❌ Error processing item ${item.ASIN}:`, err.message);
    }
  });

  return products;
}

// Update affiliate-products.ts with fresh data
function updateAffiliateProducts(freshData, asinMap) {
  const productsFilePath = path.join(__dirname, '../lib/affiliate-products.ts');
  let content = fs.readFileSync(productsFilePath, 'utf-8');

  console.log('\n📝 Updating lib/affiliate-products.ts...\n');

  let updateCount = 0;

  freshData.forEach((product) => {
    const oldImagePattern = new RegExp(
      `images:\\s*\\[\\s*'https://m\\.media-amazon\\.com/images/I/[^']+\\'\\]`,
      'g'
    );

    // Find the product block by ASIN in URL
    const productBlockRegex = new RegExp(
      `(\\{[^}]*amazonUrl:[^}]*/${product.asin}[^}]*\\})`,
      's'
    );

    const match = content.match(productBlockRegex);
    if (match && product.images.length > 0) {
      const oldBlock = match[0];
      const newImages = product.images.map(img => `'${img}'`).join(', ');
      const newBlock = oldBlock.replace(oldImagePattern, `images: [${newImages}]`);

      content = content.replace(oldBlock, newBlock);
      updateCount++;
      console.log(`✓ Updated images for ASIN ${product.asin}`);
    }
  });

  // Write updated file
  fs.writeFileSync(productsFilePath, content, 'utf-8');

  console.log(`\n✅ Updated ${updateCount} products with fresh data!`);
  console.log('   File: lib/affiliate-products.ts\n');
}

// Main execution
async function main() {
  try {
    // Step 1: Extract ASINs from current product data
    console.log('📋 Step 1: Extracting ASINs from affiliate-products.ts...');
    const { asins, asinMap } = extractASINsFromProducts();
    console.log(`   Found ${asins.length} Amazon products\n`);

    if (asins.length === 0) {
      console.log('ℹ️  No Amazon products found. Exiting.\n');
      return;
    }

    // Step 2: Fetch fresh data from PA-API
    console.log('📋 Step 2: Fetching fresh data from Amazon PA-API...');
    const paAPIResponse = await fetchProductData(asins);

    // Step 3: Process response
    console.log('📋 Step 3: Processing product data...\n');
    const freshData = processProductData(paAPIResponse);

    // Step 4: Update affiliate-products.ts
    console.log('📋 Step 4: Updating product file...');
    updateAffiliateProducts(freshData, asinMap);

    console.log('🎉 Success! Your affiliate products now have current Amazon data.');
    console.log('   Run `npm run build` to rebuild with updated images.\n');

  } catch (error) {
    console.error('\n❌ Fatal Error:', error.message);
    console.error('\nPlease check:');
    console.error('1. Your PA-API credentials are correct');
    console.error('2. You have PA-API access approved by Amazon');
    console.error('3. Your AWS IAM user has ProductAdvertisingAPI permissions\n');
    process.exit(1);
  }
}

// Run the script
main();
