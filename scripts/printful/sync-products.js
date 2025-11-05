#!/usr/bin/env node

/**
 * Printful Product Sync Script
 *
 * Syncs products from Printful catalog to local database.
 * Run daily via cron or on-demand.
 *
 * Usage:
 *   node scripts/printful/sync-products.js [options]
 *
 * Options:
 *   --category=<id>   Only sync specific category
 *   --force          Force full sync (ignore cache)
 *   --dry-run        Preview changes without saving
 */

const https = require('https')
const fs = require('fs')
const path = require('path')

// Configuration
const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY
const CATEGORY_FILTER = process.argv.find(arg => arg.startsWith('--category='))?.split('=')[1]
const FORCE_SYNC = process.argv.includes('--force')
const DRY_RUN = process.argv.includes('--dry-run')

const CACHE_FILE = path.join(__dirname, '../../data/curated-products.json')
const API_BASE = 'https://api.printful.com'

// Color coding for console
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
}

// Stats
const stats = {
  fetched: 0,
  added: 0,
  updated: 0,
  removed: 0,
  errors: 0,
}

/**
 * Make API request to Printful
 */
function apiRequest(endpoint) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.printful.com',
      path: endpoint,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${PRINTFUL_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }

    https.request(options, (res) => {
      let data = ''

      res.on('data', (chunk) => {
        data += chunk
      })

      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(JSON.parse(data))
        } else {
          reject(new Error(`API error: ${res.statusCode} - ${data}`))
        }
      })
    }).on('error', reject).end()
  })
}

/**
 * Fetch all products from catalog
 */
async function fetchCatalogProducts() {
  console.log(`${colors.blue}Fetching catalog products...${colors.reset}`)

  const response = await apiRequest('/catalog/products')
  const products = response.result

  stats.fetched = products.length
  console.log(`${colors.green}✓ Fetched ${products.length} products${colors.reset}`)

  return products
}

/**
 * Fetch product details including variants
 */
async function fetchProductDetails(productId) {
  const response = await apiRequest(`/catalog/products/${productId}`)
  return response.result
}

/**
 * Calculate retail price from Printful cost
 */
function calculateRetailPrice(cost) {
  const markup = 2.8  // 2.8x markup
  const price = parseFloat(cost) * markup

  // Round to nearest $5
  return Math.ceil(price / 5) * 5
}

/**
 * Filter products by category
 */
function filterByCategory(products) {
  if (!CATEGORY_FILTER) return products

  // Category mapping
  const categories = {
    'apparel': [24, 25, 26],      // Men's, Women's, Kids
    'home': [27],                 // Home & Living
    'accessories': [32],          // Accessories
  }

  const categoryIds = categories[CATEGORY_FILTER.toLowerCase()] || [parseInt(CATEGORY_FILTER)]

  return products.filter(p => {
    // Note: Products don't have direct category in API
    // Filter by product type instead
    const apparelTypes = ['T-SHIRT', 'HOODIE', 'SWEATSHIRT', 'TANK-TOP']
    const homeTypes = ['MUG', 'POSTER', 'CANVAS', 'PILLOW']
    const accessoryTypes = ['STICKER', 'BAG', 'PHONE-CASE', 'HAT']

    if (CATEGORY_FILTER === 'apparel') return apparelTypes.includes(p.type)
    if (CATEGORY_FILTER === 'home') return homeTypes.includes(p.type)
    if (CATEGORY_FILTER === 'accessories') return accessoryTypes.includes(p.type)

    return true
  })
}

/**
 * Select curated products (hand-picked high-quality items)
 */
function curateProducts(products) {
  // Recommended products for Brandon Mills store
  const preferredBrands = ['Bella + Canvas', 'Gildan', 'Port & Company']
  const preferredModels = ['3001', '18000', 'PC90H']

  return products.filter(p => {
    // Include if from preferred brand
    if (preferredBrands.includes(p.brand)) return true

    // Include if specific model
    if (preferredModels.includes(p.model)) return true

    // Include popular product types
    const popularTypes = ['T-SHIRT', 'HOODIE', 'SWEATSHIRT', 'MUG', 'STICKER']
    if (popularTypes.includes(p.type)) return true

    return false
  })
}

/**
 * Process product variants
 */
async function processProduct(product) {
  console.log(`  Processing: ${product.title} (ID: ${product.id})`)

  try {
    // Fetch full details with variants
    const details = await fetchProductDetails(product.id)

    // Map variants
    const variants = details.variants.map(variant => ({
      id: `printful_${product.id}_${variant.id}`,
      printfulProductId: product.id,
      printfulVariantId: variant.id,
      name: variant.name,
      brand: product.brand,
      model: product.model,
      color: variant.color,
      colorCode: variant.color_code,
      size: variant.size,
      price: calculateRetailPrice(variant.price) * 100,  // Convert to cents
      cost: parseFloat(variant.price) * 100,  // Printful cost in cents
      inStock: variant.in_stock,
      image: variant.image,
      availability: variant.availability_regions,
    }))

    // Filter only in-stock variants
    const availableVariants = variants.filter(v => v.inStock)

    if (availableVariants.length === 0) {
      console.log(`    ${colors.yellow}⚠ No variants in stock, skipping${colors.reset}`)
      return null
    }

    console.log(`    ${colors.green}✓ ${availableVariants.length} variants available${colors.reset}`)

    return {
      id: `printful_${product.id}`,
      printfulId: product.id,
      name: product.title,
      brand: product.brand,
      model: product.model,
      type: product.type,
      typeName: product.type_name,
      description: product.description,
      image: product.image,
      variants: availableVariants,
      files: product.files,
      lastSynced: new Date().toISOString(),
    }
  } catch (error) {
    console.error(`    ${colors.red}✗ Error: ${error.message}${colors.reset}`)
    stats.errors++
    return null
  }
}

/**
 * Load existing cache
 */
function loadCache() {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const data = fs.readFileSync(CACHE_FILE, 'utf8')
      return JSON.parse(data)
    }
  } catch (error) {
    console.warn(`${colors.yellow}⚠ Could not load cache: ${error.message}${colors.reset}`)
  }

  return { products: [], lastSync: null }
}

/**
 * Save to cache
 */
function saveCache(data) {
  if (DRY_RUN) {
    console.log(`${colors.yellow}[DRY RUN] Would save to ${CACHE_FILE}${colors.reset}`)
    return
  }

  try {
    // Ensure directory exists
    const dir = path.dirname(CACHE_FILE)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }

    fs.writeFileSync(CACHE_FILE, JSON.stringify(data, null, 2))
    console.log(`${colors.green}✓ Saved to ${CACHE_FILE}${colors.reset}`)
  } catch (error) {
    console.error(`${colors.red}✗ Could not save cache: ${error.message}${colors.reset}`)
  }
}

/**
 * Main sync function
 */
async function syncProducts() {
  console.log(`${colors.blue}═══════════════════════════════════════${colors.reset}`)
  console.log(`${colors.blue}   Printful Product Sync${colors.reset}`)
  console.log(`${colors.blue}═══════════════════════════════════════${colors.reset}\n`)

  if (!PRINTFUL_API_KEY) {
    console.error(`${colors.red}✗ PRINTFUL_API_KEY not set${colors.reset}`)
    process.exit(1)
  }

  if (DRY_RUN) {
    console.log(`${colors.yellow}[DRY RUN MODE - No changes will be saved]${colors.reset}\n`)
  }

  // Load existing cache
  const cache = FORCE_SYNC ? { products: [] } : loadCache()
  console.log(`Cache: ${cache.products.length} products, last sync: ${cache.lastSync || 'never'}\n`)

  try {
    // Fetch catalog
    let products = await fetchCatalogProducts()

    // Apply filters
    if (CATEGORY_FILTER) {
      products = filterByCategory(products)
      console.log(`${colors.blue}Filtered to ${products.length} products in category: ${CATEGORY_FILTER}${colors.reset}`)
    }

    // Curate products
    products = curateProducts(products)
    console.log(`${colors.blue}Curated to ${products.length} recommended products${colors.reset}\n`)

    // Process each product
    const processedProducts = []

    for (let i = 0; i < products.length; i++) {
      const product = products[i]
      console.log(`[${i + 1}/${products.length}] ${product.title}`)

      const processed = await processProduct(product)

      if (processed) {
        processedProducts.push(processed)

        // Check if new or updated
        const existing = cache.products.find(p => p.id === processed.id)
        if (!existing) {
          stats.added++
        } else if (existing.lastSynced !== processed.lastSynced) {
          stats.updated++
        }
      }

      // Rate limiting: 120 req/min = 1 req every 500ms
      if (i < products.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500))
      }
    }

    // Check for removed products
    const removedProducts = cache.products.filter(
      cached => !processedProducts.find(p => p.id === cached.id)
    )
    stats.removed = removedProducts.length

    // Save to cache
    const newCache = {
      products: processedProducts,
      lastSync: new Date().toISOString(),
      stats: {
        total: processedProducts.length,
        variants: processedProducts.reduce((sum, p) => sum + p.variants.length, 0),
      },
    }

    saveCache(newCache)

    // Print summary
    console.log(`\n${colors.blue}═══════════════════════════════════════${colors.reset}`)
    console.log(`${colors.blue}   Sync Complete${colors.reset}`)
    console.log(`${colors.blue}═══════════════════════════════════════${colors.reset}`)
    console.log(`Products: ${stats.added} added, ${stats.updated} updated, ${stats.removed} removed`)
    console.log(`Total: ${newCache.stats.total} products, ${newCache.stats.variants} variants`)
    console.log(`Errors: ${stats.errors}`)
    console.log(`${colors.green}✓ Success${colors.reset}`)

  } catch (error) {
    console.error(`\n${colors.red}✗ Sync failed: ${error.message}${colors.reset}`)
    console.error(error.stack)
    process.exit(1)
  }
}

// Run sync
syncProducts()
