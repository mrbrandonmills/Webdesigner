#!/usr/bin/env node

/**
 * Shopify Product Sync Script
 *
 * Syncs products from external source to Shopify store
 * Supports create, update, and delta sync
 */

import { restClient, graphqlClient } from '../../lib/shopify-client.js'
import pLimit from 'p-limit'

// Rate limiting: 2 requests per second
const limit = pLimit(2)

// Configuration
const config = {
  batchSize: 100,
  deltaSync: true, // Only sync changed products
  dryRun: false, // Set to true to test without making changes
}

/**
 * Main sync function
 */
async function syncProducts(externalProducts) {
  console.log(`Starting product sync... (${externalProducts.length} products)`)

  const results = {
    created: [],
    updated: [],
    skipped: [],
    errors: [],
  }

  // Fetch existing products from Shopify
  const existingProducts = await fetchAllShopifyProducts()
  const skuMap = new Map(
    existingProducts.map(p => [p.variants[0]?.sku, p])
  )

  // Process each product
  for (const externalProduct of externalProducts) {
    try {
      const sku = externalProduct.sku
      const existing = skuMap.get(sku)

      if (existing) {
        // Product exists - check if update needed
        if (config.deltaSync && !hasChanged(existing, externalProduct)) {
          results.skipped.push(sku)
          console.log(`⊘ Skipped ${sku} (no changes)`)
          continue
        }

        // Update existing product
        if (!config.dryRun) {
          await limit(() => updateProduct(existing.id, externalProduct))
        }
        results.updated.push(sku)
        console.log(`↻ Updated ${sku}`)
      } else {
        // Create new product
        if (!config.dryRun) {
          await limit(() => createProduct(externalProduct))
        }
        results.created.push(sku)
        console.log(`+ Created ${sku}`)
      }
    } catch (error) {
      results.errors.push({
        sku: externalProduct.sku,
        error: error.message,
      })
      console.error(`✗ Error processing ${externalProduct.sku}:`, error.message)
    }
  }

  // Print summary
  console.log('\n' + '='.repeat(50))
  console.log('SYNC SUMMARY')
  console.log('='.repeat(50))
  console.log(`Created:  ${results.created.length}`)
  console.log(`Updated:  ${results.updated.length}`)
  console.log(`Skipped:  ${results.skipped.length}`)
  console.log(`Errors:   ${results.errors.length}`)
  console.log('='.repeat(50))

  if (results.errors.length > 0) {
    console.log('\nErrors:')
    results.errors.forEach(e => {
      console.log(`  ${e.sku}: ${e.error}`)
    })
  }

  return results
}

/**
 * Fetch all products from Shopify (with pagination)
 */
async function fetchAllShopifyProducts() {
  const products = []
  let hasNextPage = true
  let pageInfo = null

  while (hasNextPage) {
    const query = `
      query ($cursor: String) {
        products(first: 250, after: $cursor) {
          pageInfo {
            hasNextPage
            endCursor
          }
          edges {
            node {
              id
              title
              description
              vendor
              productType
              tags
              variants(first: 1) {
                edges {
                  node {
                    id
                    sku
                    price
                    inventoryManagement
                  }
                }
              }
              images(first: 10) {
                edges {
                  node {
                    url
                  }
                }
              }
              updatedAt
            }
          }
        }
      }
    `

    const response = await graphqlClient.query({
      data: {
        query,
        variables: pageInfo ? { cursor: pageInfo } : {},
      },
    })

    const data = response.body.data.products
    products.push(...data.edges.map(e => e.node))

    hasNextPage = data.pageInfo.hasNextPage
    pageInfo = data.pageInfo.endCursor
  }

  console.log(`Fetched ${products.length} existing products from Shopify`)
  return products
}

/**
 * Create new product in Shopify
 */
async function createProduct(productData) {
  const response = await restClient.post({
    path: 'products',
    data: {
      product: {
        title: productData.title,
        body_html: productData.description,
        vendor: productData.vendor || 'Brandon Mills',
        product_type: productData.category,
        tags: productData.tags?.join(', ') || '',
        variants: [
          {
            price: productData.price.toString(),
            sku: productData.sku,
            inventory_management: 'shopify',
            inventory_policy: 'deny',
            inventory_quantity: productData.inventory || 0,
          },
        ],
        images: productData.images?.map(url => ({ src: url })) || [],
        metafields: productData.metafields || [],
      },
    },
  })

  return response.body.product
}

/**
 * Update existing product in Shopify
 */
async function updateProduct(productId, productData) {
  // Extract numeric ID from GraphQL ID
  const numericId = productId.split('/').pop()

  const response = await restClient.put({
    path: `products/${numericId}`,
    data: {
      product: {
        id: numericId,
        title: productData.title,
        body_html: productData.description,
        product_type: productData.category,
        tags: productData.tags?.join(', ') || '',
        variants: [
          {
            price: productData.price.toString(),
            sku: productData.sku,
          },
        ],
      },
    },
  })

  // Update images separately if changed
  if (productData.images && productData.images.length > 0) {
    await updateProductImages(numericId, productData.images)
  }

  return response.body.product
}

/**
 * Update product images
 */
async function updateProductImages(productId, imageUrls) {
  // Get existing images
  const product = await restClient.get({
    path: `products/${productId}`,
  })

  const existingImageUrls = product.body.product.images.map(img => img.src)

  // Only update if images have changed
  if (JSON.stringify(existingImageUrls) === JSON.stringify(imageUrls)) {
    return
  }

  // Delete existing images
  for (const image of product.body.product.images) {
    await restClient.delete({
      path: `products/${productId}/images/${image.id}`,
    })
  }

  // Add new images
  for (const url of imageUrls) {
    await restClient.post({
      path: `products/${productId}/images`,
      data: {
        image: { src: url },
      },
    })
  }
}

/**
 * Check if product has changed
 */
function hasChanged(shopifyProduct, externalProduct) {
  // Compare key fields
  if (shopifyProduct.title !== externalProduct.title) return true
  if (shopifyProduct.description !== externalProduct.description) return true
  if (shopifyProduct.productType !== externalProduct.category) return true

  // Compare price
  const shopifyPrice = parseFloat(shopifyProduct.variants[0]?.price || 0)
  const externalPrice = parseFloat(externalProduct.price)
  if (Math.abs(shopifyPrice - externalPrice) > 0.01) return true

  // Compare tags
  const shopifyTags = shopifyProduct.tags || []
  const externalTags = externalProduct.tags || []
  if (JSON.stringify(shopifyTags.sort()) !== JSON.stringify(externalTags.sort())) {
    return true
  }

  return false
}

/**
 * Example: Fetch products from external source
 * Replace with your actual data source (database, API, CSV, etc.)
 */
async function fetchExternalProducts() {
  // Example mock data
  return [
    {
      sku: 'BM-NECKLACE-001',
      title: 'Sterling Silver Necklace',
      description: '<p>Handcrafted sterling silver necklace</p>',
      category: 'Jewelry',
      vendor: 'Brandon Mills',
      price: 99.99,
      inventory: 50,
      tags: ['sterling silver', 'necklace', 'jewelry'],
      images: [
        'https://example.com/images/necklace-1.jpg',
        'https://example.com/images/necklace-2.jpg',
      ],
      metafields: [
        {
          namespace: 'custom',
          key: 'material',
          value: 'Sterling Silver',
          type: 'single_line_text_field',
        },
      ],
    },
    // Add more products...
  ]
}

/**
 * CLI execution
 */
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('Shopify Product Sync\n')

  // Parse command line arguments
  const args = process.argv.slice(2)
  if (args.includes('--help')) {
    console.log('Usage: node sync-products.js [options]')
    console.log('')
    console.log('Options:')
    console.log('  --dry-run       Test without making changes')
    console.log('  --full          Full sync (ignore delta)')
    console.log('  --batch-size N  Set batch size (default: 100)')
    console.log('  --help          Show this help')
    process.exit(0)
  }

  if (args.includes('--dry-run')) {
    config.dryRun = true
    console.log('DRY RUN MODE - No changes will be made\n')
  }

  if (args.includes('--full')) {
    config.deltaSync = false
    console.log('FULL SYNC - All products will be updated\n')
  }

  const batchSizeIndex = args.indexOf('--batch-size')
  if (batchSizeIndex !== -1 && args[batchSizeIndex + 1]) {
    config.batchSize = parseInt(args[batchSizeIndex + 1])
  }

  // Run sync
  fetchExternalProducts()
    .then(products => syncProducts(products))
    .then(results => {
      console.log('\n✓ Sync complete!')
      process.exit(results.errors.length > 0 ? 1 : 0)
    })
    .catch(error => {
      console.error('\n✗ Sync failed:', error)
      process.exit(1)
    })
}

export { syncProducts, fetchAllShopifyProducts, createProduct, updateProduct }
