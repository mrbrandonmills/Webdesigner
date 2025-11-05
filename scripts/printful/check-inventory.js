#!/usr/bin/env node

/**
 * Printful Inventory Check Script
 *
 * Checks stock availability for all products across regions.
 * Identifies out-of-stock items and suggests alternatives.
 *
 * Usage:
 *   node scripts/printful/check-inventory.js [options]
 *
 * Options:
 *   --product=<id>    Check specific product
 *   --region=<code>   Check specific region (US, EU, MX, CA)
 *   --alert           Send alert if stock issues found
 */

const https = require('https')
const fs = require('fs')
const path = require('path')

// Configuration
const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY
const PRODUCT_ID = process.argv.find(arg => arg.startsWith('--product='))?.split('=')[1]
const REGION = process.argv.find(arg => arg.startsWith('--region='))?.split('=')[1]
const SEND_ALERT = process.argv.includes('--alert')

const CACHE_FILE = path.join(__dirname, '../../data/curated-products.json')
const INVENTORY_LOG = path.join(__dirname, '../../data/inventory-log.json')

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
}

const stats = {
  totalProducts: 0,
  totalVariants: 0,
  inStock: 0,
  outOfStock: 0,
  lowStock: 0,
  discontinued: 0,
}

const issues = []

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
 * Log inventory status
 */
function logInventory(data) {
  try {
    let history = []

    if (fs.existsSync(INVENTORY_LOG)) {
      history = JSON.parse(fs.readFileSync(INVENTORY_LOG, 'utf8'))
    }

    history.push({
      timestamp: new Date().toISOString(),
      stats,
      issues,
    })

    // Keep last 30 days
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000)
    history = history.filter(h => new Date(h.timestamp).getTime() > thirtyDaysAgo)

    fs.writeFileSync(INVENTORY_LOG, JSON.stringify(history, null, 2))
  } catch (error) {
    console.warn(`${colors.yellow}⚠ Could not log inventory${colors.reset}`)
  }
}

/**
 * Check variant stock status
 */
async function checkVariantStock(variantId) {
  const response = await apiRequest(`/catalog/variants/${variantId}`)
  return response.result.variant
}

/**
 * Get stock status icon
 */
function getStockIcon(status) {
  switch (status) {
    case 'in_stock': return `${colors.green}✓${colors.reset}`
    case 'out_of_stock': return `${colors.red}✗${colors.reset}`
    case 'low_stock': return `${colors.yellow}⚠${colors.reset}`
    case 'discontinued': return `${colors.red}⊗${colors.reset}`
    default: return '?'
  }
}

/**
 * Check product inventory
 */
async function checkProductInventory(product) {
  console.log(`\n${colors.blue}${product.name}${colors.reset}`)
  console.log(`Product ID: ${product.printfulId}`)

  stats.totalProducts++

  const variantIssues = []

  for (const variant of product.variants) {
    stats.totalVariants++

    try {
      // Fetch current stock status
      const current = await checkVariantStock(variant.printfulVariantId)

      // Check overall stock
      if (!current.in_stock) {
        stats.outOfStock++
        variantIssues.push({
          variant: `${variant.color} / ${variant.size}`,
          issue: 'out_of_stock',
          severity: 'high',
        })
      } else {
        stats.inStock++
      }

      // Check regional availability
      const regionalStatus = []

      if (REGION) {
        // Check specific region
        const status = current.availability_regions[REGION] || 'unknown'
        regionalStatus.push({ region: REGION, status })
      } else {
        // Check all regions
        for (const [region, status] of Object.entries(current.availability_regions || {})) {
          regionalStatus.push({ region, status })
        }
      }

      // Display status
      const stockIcon = getStockIcon(current.in_stock ? 'in_stock' : 'out_of_stock')
      console.log(`  ${stockIcon} ${variant.color} / ${variant.size}`)

      for (const { region, status } of regionalStatus) {
        const icon = getStockIcon(status)
        console.log(`    ${region}: ${icon} ${status}`)

        if (status === 'out_of_stock') {
          variantIssues.push({
            variant: `${variant.color} / ${variant.size}`,
            region,
            issue: status,
            severity: 'medium',
          })
        }
      }

      // Update cache
      variant.inStock = current.in_stock
      variant.availability = current.availability_regions

    } catch (error) {
      console.error(`    ${colors.red}✗ Error checking variant${colors.reset}`)
      stats.discontinued++
    }

    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 500))
  }

  // Report product-level issues
  if (variantIssues.length > 0) {
    const highSeverity = variantIssues.filter(i => i.severity === 'high')

    if (highSeverity.length === product.variants.length) {
      console.log(`  ${colors.red}⚠ WARNING: All variants out of stock${colors.reset}`)
      issues.push({
        product: product.name,
        productId: product.printfulId,
        issue: 'all_variants_out_of_stock',
        variants: variantIssues,
      })
    } else if (highSeverity.length > 0) {
      console.log(`  ${colors.yellow}⚠ ${highSeverity.length} variants out of stock${colors.reset}`)
      issues.push({
        product: product.name,
        productId: product.printfulId,
        issue: 'some_variants_out_of_stock',
        variants: variantIssues,
      })
    }
  }
}

/**
 * Generate inventory report
 */
function generateReport() {
  console.log(`\n${colors.cyan}═══════════════════════════════════════${colors.reset}`)
  console.log(`${colors.cyan}   Inventory Report${colors.reset}`)
  console.log(`${colors.cyan}═══════════════════════════════════════${colors.reset}`)

  console.log(`\nProducts Checked: ${stats.totalProducts}`)
  console.log(`Total Variants: ${stats.totalVariants}`)

  console.log(`\nStock Status:`)
  console.log(`  ${colors.green}In Stock: ${stats.inStock}${colors.reset}`)
  console.log(`  ${colors.red}Out of Stock: ${stats.outOfStock}${colors.reset}`)
  console.log(`  ${colors.yellow}Low Stock: ${stats.lowStock}${colors.reset}`)
  console.log(`  ${colors.red}Discontinued: ${stats.discontinued}${colors.reset}`)

  const stockRate = (stats.inStock / stats.totalVariants * 100).toFixed(1)
  console.log(`\nStock Rate: ${stockRate}%`)

  if (issues.length > 0) {
    console.log(`\n${colors.yellow}Issues Found:${colors.reset}`)

    for (const issue of issues) {
      console.log(`\n${colors.yellow}${issue.product}${colors.reset}`)
      console.log(`  Issue: ${issue.issue}`)
      console.log(`  Affected variants: ${issue.variants.length}`)

      for (const variant of issue.variants) {
        console.log(`    - ${variant.variant} (${variant.region || 'all regions'})`)
      }
    }

    console.log(`\n${colors.yellow}⚠ ${issues.length} product(s) with stock issues${colors.reset}`)
  } else {
    console.log(`\n${colors.green}✓ No stock issues found${colors.reset}`)
  }

  // Recommendations
  if (stats.outOfStock > 0) {
    console.log(`\n${colors.cyan}Recommendations:${colors.reset}`)
    console.log(`  1. Consider removing out-of-stock variants from display`)
    console.log(`  2. Show "Notify when available" option`)
    console.log(`  3. Suggest alternative products/colors`)
    console.log(`  4. Check alternative fulfillment regions`)
  }
}

/**
 * Send alert notification
 */
function sendAlert() {
  if (!SEND_ALERT || issues.length === 0) return

  console.log(`\n${colors.yellow}Sending alert notification...${colors.reset}`)

  // In production, send email/Slack notification
  const alertData = {
    timestamp: new Date().toISOString(),
    summary: `${issues.length} products with stock issues`,
    stats,
    issues: issues.slice(0, 10),  // Top 10 issues
  }

  console.log(JSON.stringify(alertData, null, 2))

  // TODO: Integrate with notification service
  // await sendEmail(alertData)
  // await sendSlackMessage(alertData)
}

/**
 * Main inventory check function
 */
async function checkInventory() {
  console.log(`${colors.blue}═══════════════════════════════════════${colors.reset}`)
  console.log(`${colors.blue}   Printful Inventory Check${colors.reset}`)
  console.log(`${colors.blue}═══════════════════════════════════════${colors.reset}\n`)

  if (!PRINTFUL_API_KEY) {
    console.error(`${colors.red}✗ PRINTFUL_API_KEY not set${colors.reset}`)
    process.exit(1)
  }

  if (REGION) {
    console.log(`Region: ${REGION}\n`)
  }

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

    console.log(`Checking inventory for ${products.length} products...`)

    // Check each product
    for (const product of products) {
      await checkProductInventory(product)
    }

    // Save updated cache
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2))

    // Log inventory
    logInventory({ stats, issues })

    // Generate report
    generateReport()

    // Send alerts if needed
    sendAlert()

    console.log(`\n${colors.green}✓ Inventory check complete${colors.reset}`)

  } catch (error) {
    console.error(`\n${colors.red}✗ Check failed: ${error.message}${colors.reset}`)
    console.error(error.stack)
    process.exit(1)
  }
}

// Run check
checkInventory()
