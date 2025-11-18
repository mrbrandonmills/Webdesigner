#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read the sync results
const syncResults = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../public/designs/printful-sync.json'), 'utf8')
);

// Read the theme factory products
const themeFactoryData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../public/data/theme-factory-products.json'), 'utf8')
);

// Create a mapping from the sync results
const syncMap = {};
syncResults.results.forEach(result => {
  const key = `${result.category}-${result.name}-${result.productType}`;
  syncMap[key] = result.syncProductId;
});

// Mapping of product IDs to their sync keys
const productIdToSyncKey = {
  'tf-fine-lines-mug': 'poetry-fine-lines-mug',
  'tf-fine-lines-poster': 'poetry-fine-lines-poster',
  'tf-fine-lines-t-shirt': 'poetry-fine-lines-t-shirt',
  'tf-poet-proponent-mug': 'poetry-poet-proponent-mug',
  'tf-the-tourbillon-mug': 'poetry-the-tourbillon-mug',
  'tf-am-reed-aqua-phone-case': 'photography-am-reed-aqua-phone-case',
  'tf-am-reed-aqua-poster': 'photography-am-reed-aqua-poster',
  'tf-am-reed-aqua-tote-bag': 'photography-am-reed-aqua-tote-bag',
  'tf-am-reed-aqua-wall-art': 'photography-am-reed-aqua-wall-art',
  'tf-am-reed-leather-phone-case': 'photography-am-reed-leather-phone-case',
  'tf-am-reed-leather-poster': 'photography-am-reed-leather-poster',
  'tf-am-reed-leather-tote-bag': 'photography-am-reed-leather-tote-bag',
  'tf-am-reed-leather-wall-art': 'photography-am-reed-leather-wall-art',
  'tf-am-reed-monochrome-phone-case': 'photography-am-reed-monochrome-phone-case',
  'tf-am-reed-monochrome-poster': 'photography-am-reed-monochrome-poster',
  'tf-am-reed-monochrome-tote-bag': 'photography-am-reed-monochrome-tote-bag',
  'tf-am-reed-monochrome-wall-art': 'photography-am-reed-monochrome-wall-art',
  'tf-enlightenment-science-mug': 'philosophy-enlightenment-science-mug',
  'tf-self-esteem-mug': 'philosophy-self-esteem-mug',
  'tf-social-theory-mug': 'philosophy-social-theory-mug'
};

// Update the products
let updatedCount = 0;
themeFactoryData.products.forEach(product => {
  const syncKey = productIdToSyncKey[product.id];
  if (syncKey && syncMap[syncKey]) {
    const oldId = product.syncProductId;
    product.syncProductId = syncMap[syncKey];
    console.log(`Updated ${product.id}: ${oldId} -> ${product.syncProductId}`);
    updatedCount++;
  }
});

// Update the generated timestamp
themeFactoryData.generatedAt = new Date().toISOString();

// Save the updated file
fs.writeFileSync(
  path.join(__dirname, '../public/data/theme-factory-products.json'),
  JSON.stringify(themeFactoryData, null, 2)
);

console.log(`\n✅ Successfully updated ${updatedCount} products with new Printful sync IDs`);
console.log('📁 Updated file: public/data/theme-factory-products.json');