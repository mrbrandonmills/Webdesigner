#!/usr/bin/env node

/**
 * Printful Pricing Update Script
 *
 * Updates product pricing based on current Printful costs.
 * Applies markup strategy and rounds to psychological pricing.
 *
 * Usage:
 *   node scripts/printful/update-pricing.js [options]
 *
 * Options:
 *   --markup=<number>     Markup multiplier (default: 2.8)
 *   --round=<number>      Round to nearest (default: 5)
 *   --product=<id>        Update specific product only
 *   --dry-run             Preview changes without saving
 */

const https = require('https')
const fs = require('fs')
const path = require('path')

// Configuration
const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY
const MARKUP = parseFloat(process.argv.find(arg => arg.startsWith('--markup='))?.split('=')[1] || '2.8')
const ROUND_TO = parseInt(process.argv.find(arg => arg.startsWith('--round='))?.split('=')[1] || '5')
const PRODUCT_ID = process.argv.find(arg => arg.startsWith('--product='))?.split('=')[1]
const DRY_RUN = process.argv.includes('--dry-run')

const CACHE_FILE = path.join(__dirname, '../../data/curated-products.json')
const PRICING_LOG = path.join(__dirname, '../../data/pricing-history.json')

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
}

const stats = {
  checked: 0,
  updated: 0,
  unchanged: 0,
  errors: 0,
}

/**
 * API request helper
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
      res.on('data', chunk => data += chunk)
      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(JSON.parse(data))
        } else {
          reject(new Error(`API error: ${res.statusCode}`))
        }
      })
    }).on('error', reject).end()
  })
}

/**
 * Calculate retail price
 */
function calculateRetailPrice(cost) {
  const price = parseFloat(cost) * MARKUP

  // Round to nearest ROUND_TO
  return Math.ceil(price / ROUND_TO) * ROUND_TO
}

/**
 * Format price for display
 */
function formatPrice(cents) {
  return `$${(cents / 100).toFixed(2)}`
}

/**
 * Calculate profit margin
 */
function calculateMargin(retailPrice, cost) {
  const profit = retailPrice - cost
  const margin = (profit / retailPrice) * 100
  return margin.toFixed(1)
}

/**
 * Load product cache
 */
function loadCache() {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      return JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'))
    }
  } catch (error) {
    console.warn(`${colors.yellow}⚠ Could not load cache${colors.reset}`)
  }

  return { products: [] }
}

/**
 * Save product cache
 */
function saveCache(cache) {
  if (DRY_RUN) {
    console.log(`${colors.yellow}[DRY RUN] Would save updated pricing${colors.reset}`)
    return
  }

  try {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2))
    console.log(`${colors.green}✓ Pricing saved${colors.reset}`)
  } catch (error) {
    console.error(`${colors.red}✗ Could not save cache${colors.reset}`)
  }
}

/**
 * Log pricing changes
 */
function logPricingChange(changes) {
  if (DRY_RUN) return

  try {
    let history = []

    if (fs.existsSync(PRICING_LOG)) {
      history = JSON.parse(fs.readFileSync(PRICING_LOG, 'utf8'))
    }

    history.push({
      timestamp: new Date().toISOString(),
      markup: MARKUP,
      changes,
    })

    // Keep last 100 entries
    if (history.length > 100) {
      history = history.slice(-100)
    }

    fs.writeFileSync(PRICING_LOG, JSON.stringify(history, null, 2))
  } catch (error) {
    console.warn(`${colors.yellow}⚠ Could not log changes${colors.reset}`)
  }
}

/**
 * Fetch current Printful pricing
 */
async function fetchCurrentPricing(productId) {
  const response = await apiRequest(`/catalog/products/${productId}`)
  return response.result.variants
}

/**
 * Update product pricing
 */
async function updateProductPricing(product) {
  console.log(`\n${colors.blue}Checking: ${product.name}${colors.reset}`)
  stats.checked++

  try {
    // Fetch current Printful pricing
    const currentVariants = await fetchCurrentPricing(product.printfulId)

    const changes = []
    let hasChanges = false

    // Update each variant
    for (const variant of product.variants) {
      const printfulVariant = currentVariants.find(v => v.id === variant.printfulVariantId)

      if (!printfulVariant) {
        console.log(`  ${colors.yellow}⚠ Variant ${variant.id} not found in Printful${colors.reset}`)
        continue
      }

      const currentCost = parseFloat(printfulVariant.price) * 100  // Convert to cents
      const oldCost = variant.cost
      const oldPrice = variant.price

      // Calculate new price
      const newPrice = calculateRetailPrice(printfulVariant.price) * 100

      // Check if changed
      if (currentCost !== oldCost || newPrice !== oldPrice) {
        const oldMargin = calculateMargin(oldPrice, oldCost)
        const newMargin = calculateMargin(newPrice, currentCost)

        console.log(`  ${variant.color} / ${variant.size}:`)
        console.log(`    Cost: ${formatPrice(oldCost)} → ${formatPrice(currentCost)} ${currentCost !== oldCost ? colors.yellow + '(changed)' + colors.reset : ''}`)
        console.log(`    Price: ${formatPrice(oldPrice)} → ${formatPrice(newPrice)} ${newPrice !== oldPrice ? colors.green + '(updated)' + colors.reset : ''}`)
        console.log(`    Margin: ${oldMargin}% → ${newMargin}%`)

        variant.cost = currentCost
        variant.price = newPrice

        changes.push({
          variantId: variant.id,
          color: variant.color,
          size: variant.size,
          oldCost,
          newCost: currentCost,
          oldPrice,
          newPrice,
          oldMargin: parseFloat(oldMargin),
          newMargin: parseFloat(newMargin),
        })

        hasChanges = true
      }
    }

    if (hasChanges) {
      stats.updated++
      return { product, changes }
    } else {
      console.log(`  ${colors.green}✓ No changes needed${colors.reset}`)
      stats.unchanged++
      return null
    }

  } catch (error) {
    console.error(`  ${colors.red}✗ Error: ${error.message}${colors.reset}`)
    stats.errors++
    return null
  }
}

/**
 * Generate pricing report
 */
function generateReport(allChanges) {
  console.log(`\n${colors.cyan}═══════════════════════════════════════${colors.reset}`)
  console.log(`${colors.cyan}   Pricing Update Report${colors.reset}`)
  console.log(`${colors.cyan}═══════════════════════════════════════${colors.reset}`)

  console.log(`\nMarkup: ${MARKUP}x`)
  console.log(`Rounding: $${ROUND_TO}`)

  console.log(`\nProducts Checked: ${stats.checked}`)
  console.log(`Products Updated: ${stats.updated}`)
  console.log(`Products Unchanged: ${stats.unchanged}`)
  console.log(`Errors: ${stats.errors}`)

  if (allChanges.length > 0) {
    console.log(`\n${colors.yellow}Price Changes:${colors.reset}`)

    let totalOldRevenue = 0
    let totalNewRevenue = 0
    let totalOldCost = 0
    let totalNewCost = 0

    for (const { product, changes } of allChanges) {
      console.log(`\n${product.name}:`)

      for (const change of changes) {
        console.log(`  ${change.color} / ${change.size}:`)
        console.log(`    ${formatPrice(change.oldPrice)} → ${formatPrice(change.newPrice)}`)
        console.log(`    Margin: ${change.oldMargin}% → ${change.newMargin}%`)

        totalOldRevenue += change.oldPrice
        totalNewRevenue += change.newPrice
        totalOldCost += change.oldCost
        totalNewCost += change.newCost
      }
    }

    console.log(`\n${colors.cyan}Overall Impact:${colors.reset}`)
    console.log(`Total Revenue Change: ${formatPrice(totalOldRevenue)} → ${formatPrice(totalNewRevenue)}`)
    console.log(`Total Cost Change: ${formatPrice(totalOldCost)} → ${formatPrice(totalNewCost)}`)

    const oldProfit = totalOldRevenue - totalOldCost
    const newProfit = totalNewRevenue - totalNewCost
    console.log(`Total Profit Change: ${formatPrice(oldProfit)} → ${formatPrice(newProfit)}`)

    const profitDiff = newProfit - oldProfit
    const diffColor = profitDiff > 0 ? colors.green : colors.red
    console.log(`Profit Difference: ${diffColor}${formatPrice(Math.abs(profitDiff))} (${profitDiff > 0 ? '+' : '-'}${Math.abs((profitDiff / oldProfit) * 100).toFixed(1)}%)${colors.reset}`)
  }
}

/**
 * Main pricing update function
 */
async function updatePricing() {
  console.log(`${colors.blue}═══════════════════════════════════════${colors.reset}`)
  console.log(`${colors.blue}   Printful Pricing Update${colors.reset}`)
  console.log(`${colors.blue}═══════════════════════════════════════${colors.reset}\n`)

  if (!PRINTFUL_API_KEY) {
    console.error(`${colors.red}✗ PRINTFUL_API_KEY not set${colors.reset}`)
    process.exit(1)
  }

  if (DRY_RUN) {
    console.log(`${colors.yellow}[DRY RUN MODE - No changes will be saved]${colors.reset}\n`)
  }

  console.log(`Markup: ${MARKUP}x`)
  console.log(`Rounding: $${ROUND_TO}\n`)

  try {
    // Load product cache
    const cache = loadCache()

    if (cache.products.length === 0) {
      console.error(`${colors.red}✗ No products in cache. Run sync-products.js first.${colors.reset}`)
      process.exit(1)
    }

    // Filter products
    let products = cache.products

    if (PRODUCT_ID) {
      products = products.filter(p => p.printfulId.toString() === PRODUCT_ID)

      if (products.length === 0) {
        console.error(`${colors.red}✗ Product ${PRODUCT_ID} not found${colors.reset}`)
        process.exit(1)
      }
    }

    console.log(`Updating ${products.length} products...\n`)

    // Update each product
    const allChanges = []

    for (let i = 0; i < products.length; i++) {
      const product = products[i]

      const result = await updateProductPricing(product)

      if (result) {
        allChanges.push(result)
      }

      // Rate limiting
      if (i < products.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500))
      }
    }

    // Save updates
    if (allChanges.length > 0) {
      saveCache(cache)
      logPricingChange(allChanges)
    }

    // Generate report
    generateReport(allChanges)

    console.log(`\n${colors.green}✓ Update complete${colors.reset}`)

  } catch (error) {
    console.error(`\n${colors.red}✗ Update failed: ${error.message}${colors.reset}`)
    console.error(error.stack)
    process.exit(1)
  }
}

// Run update
updatePricing()
