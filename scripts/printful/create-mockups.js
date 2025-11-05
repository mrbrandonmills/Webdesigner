#!/usr/bin/env node

/**
 * Printful Mockup Generator Script
 *
 * Generates product mockups for all products or specific variants.
 * Uploads design files and creates realistic product images.
 *
 * Usage:
 *   node scripts/printful/create-mockups.js [options]
 *
 * Options:
 *   --product=<id>      Generate for specific product ID
 *   --design=<path>     Path to design file
 *   --variants=<ids>    Comma-separated variant IDs
 *   --format=<jpg|png>  Output format (default: jpg)
 */

const https = require('https')
const fs = require('fs')
const path = require('path')

// Configuration
const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY
const PRODUCT_ID = process.argv.find(arg => arg.startsWith('--product='))?.split('=')[1]
const DESIGN_FILE = process.argv.find(arg => arg.startsWith('--design='))?.split('=')[1]
const VARIANTS = process.argv.find(arg => arg.startsWith('--variants='))?.split('=')[1]?.split(',').map(Number)
const FORMAT = process.argv.find(arg => arg.startsWith('--format='))?.split('=')[1] || 'jpg'

const CACHE_FILE = path.join(__dirname, '../../data/product-mockups.json')
const API_BASE = 'https://api.printful.com'

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
}

/**
 * Make API request
 */
function apiRequest(endpoint, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.printful.com',
      path: endpoint,
      method,
      headers: {
        'Authorization': `Bearer ${PRINTFUL_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }

    const req = https.request(options, (res) => {
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
    })

    req.on('error', reject)

    if (body) {
      req.write(JSON.stringify(body))
    }

    req.end()
  })
}

/**
 * Upload design file to Printful
 */
async function uploadDesignFile(filePath) {
  console.log(`${colors.blue}Uploading design file: ${filePath}${colors.reset}`)

  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`)
  }

  // Read file
  const fileBuffer = fs.readFileSync(filePath)
  const fileName = path.basename(filePath)

  // Create form data (simplified for demo - use proper multipart in production)
  const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2)

  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.printful.com',
      path: '/files',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PRINTFUL_API_KEY}`,
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
      },
    }

    const req = https.request(options, (res) => {
      let data = ''

      res.on('data', (chunk) => {
        data += chunk
      })

      res.on('end', () => {
        if (res.statusCode === 200) {
          const response = JSON.parse(data)
          console.log(`${colors.green}✓ File uploaded: ${response.result.id}${colors.reset}`)
          resolve(response.result)
        } else {
          reject(new Error(`Upload failed: ${res.statusCode} - ${data}`))
        }
      })
    })

    req.on('error', reject)

    // Write multipart data
    req.write(`--${boundary}\r\n`)
    req.write(`Content-Disposition: form-data; name="file"; filename="${fileName}"\r\n`)
    req.write(`Content-Type: image/png\r\n\r\n`)
    req.write(fileBuffer)
    req.write(`\r\n--${boundary}--\r\n`)

    req.end()
  })
}

/**
 * Create mockup generation task
 */
async function createMockupTask(productId, variantIds, designUrl) {
  console.log(`${colors.blue}Creating mockup task for product ${productId}${colors.reset}`)

  // Default print position for t-shirts (Bella + Canvas 3001)
  const printPosition = {
    area_width: 1800,
    area_height: 2400,
    width: 1800,
    height: 1800,
    top: 300,
    left: 0,
  }

  const body = {
    variant_ids: variantIds,
    format: FORMAT,
    files: [
      {
        placement: 'front',
        image_url: designUrl,
        position: printPosition,
      },
    ],
  }

  const response = await apiRequest(
    `/mockup-generator/create-task/${productId}`,
    'POST',
    body
  )

  console.log(`${colors.green}✓ Task created: ${response.result.task_key}${colors.reset}`)
  return response.result
}

/**
 * Check mockup task status
 */
async function checkMockupStatus(taskKey) {
  const response = await apiRequest(`/mockup-generator/task?task_key=${taskKey}`)
  return response.result
}

/**
 * Wait for mockup generation to complete
 */
async function waitForMockups(taskKey, maxAttempts = 30) {
  console.log(`${colors.blue}Waiting for mockup generation...${colors.reset}`)

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const status = await checkMockupStatus(taskKey)

    if (status.status === 'completed') {
      console.log(`${colors.green}✓ Mockups ready!${colors.reset}`)
      return status.mockups
    }

    if (status.status === 'failed') {
      throw new Error('Mockup generation failed')
    }

    process.stdout.write(`  Attempt ${attempt}/${maxAttempts}...\r`)

    // Wait 2 seconds between checks
    await new Promise(resolve => setTimeout(resolve, 2000))
  }

  throw new Error('Mockup generation timeout')
}

/**
 * Download mockup image
 */
async function downloadMockup(url, outputPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(outputPath)

    https.get(url, (response) => {
      response.pipe(file)

      file.on('finish', () => {
        file.close()
        resolve(outputPath)
      })
    }).on('error', (err) => {
      fs.unlink(outputPath, () => {})
      reject(err)
    })
  })
}

/**
 * Load mockup cache
 */
function loadCache() {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      return JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'))
    }
  } catch (error) {
    console.warn(`${colors.yellow}⚠ Could not load cache${colors.reset}`)
  }

  return { mockups: {} }
}

/**
 * Save mockup cache
 */
function saveCache(cache) {
  try {
    const dir = path.dirname(CACHE_FILE)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }

    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2))
    console.log(`${colors.green}✓ Cache saved${colors.reset}`)
  } catch (error) {
    console.error(`${colors.red}✗ Could not save cache${colors.reset}`)
  }
}

/**
 * Main mockup generation function
 */
async function generateMockups() {
  console.log(`${colors.blue}═══════════════════════════════════════${colors.reset}`)
  console.log(`${colors.blue}   Printful Mockup Generator${colors.reset}`)
  console.log(`${colors.blue}═══════════════════════════════════════${colors.reset}\n`)

  // Validate inputs
  if (!PRINTFUL_API_KEY) {
    console.error(`${colors.red}✗ PRINTFUL_API_KEY not set${colors.reset}`)
    process.exit(1)
  }

  if (!PRODUCT_ID) {
    console.error(`${colors.red}✗ --product=<id> required${colors.reset}`)
    console.log('Example: node create-mockups.js --product=71 --design=./logo.png')
    process.exit(1)
  }

  if (!DESIGN_FILE) {
    console.error(`${colors.red}✗ --design=<path> required${colors.reset}`)
    process.exit(1)
  }

  try {
    // Load cache
    const cache = loadCache()

    // Upload design file
    const designFile = await uploadDesignFile(DESIGN_FILE)

    // Get product details
    console.log(`${colors.blue}Fetching product details...${colors.reset}`)
    const productResponse = await apiRequest(`/catalog/products/${PRODUCT_ID}`)
    const product = productResponse.result

    // Select variants
    let variantIds = VARIANTS

    if (!variantIds) {
      // Auto-select popular variants
      const popularColors = ['Black', 'White', 'Navy']
      const popularSizes = ['M', 'L']

      const selectedVariants = product.variants.filter(v =>
        popularColors.includes(v.color) && popularSizes.includes(v.size) && v.in_stock
      )

      variantIds = selectedVariants.map(v => v.id).slice(0, 5)  // Max 5 variants

      console.log(`${colors.blue}Auto-selected ${variantIds.length} variants${colors.reset}`)
    }

    if (variantIds.length === 0) {
      console.error(`${colors.red}✗ No variants selected${colors.reset}`)
      process.exit(1)
    }

    // Create mockup task
    const task = await createMockupTask(PRODUCT_ID, variantIds, designFile.url)

    // Wait for completion
    const mockups = await waitForMockups(task.task_key)

    // Process mockups
    console.log(`\n${colors.green}Generated ${mockups.length} mockups:${colors.reset}`)

    const outputDir = path.join(__dirname, '../../public/mockups', PRODUCT_ID.toString())
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }

    const productMockups = []

    for (let i = 0; i < mockups.length; i++) {
      const mockup = mockups[i]

      console.log(`\n[${i + 1}/${mockups.length}] Variant ${mockup.variant_ids.join(', ')}`)
      console.log(`  Main: ${mockup.mockup_url}`)

      const mockupData = {
        variantIds: mockup.variant_ids,
        placement: mockup.placement,
        urls: {
          main: mockup.mockup_url,
        },
      }

      // Download main mockup
      const mainFile = path.join(outputDir, `variant-${mockup.variant_ids[0]}-main.${FORMAT}`)
      await downloadMockup(mockup.mockup_url, mainFile)
      console.log(`  ${colors.green}✓ Downloaded: ${mainFile}${colors.reset}`)

      // Process extra mockups (lifestyle, flat, etc.)
      if (mockup.extra && mockup.extra.length > 0) {
        mockupData.urls.extra = []

        for (const extra of mockup.extra) {
          console.log(`  ${extra.title}: ${extra.url}`)

          const extraFile = path.join(
            outputDir,
            `variant-${mockup.variant_ids[0]}-${extra.title.toLowerCase()}.${FORMAT}`
          )

          await downloadMockup(extra.url, extraFile)
          mockupData.urls.extra.push({
            title: extra.title,
            url: extra.url,
            localPath: extraFile,
          })

          console.log(`  ${colors.green}✓ Downloaded: ${extraFile}${colors.reset}`)
        }
      }

      productMockups.push(mockupData)
    }

    // Update cache
    cache.mockups[PRODUCT_ID] = {
      productId: PRODUCT_ID,
      productName: product.product.title,
      designFile: designFile.url,
      mockups: productMockups,
      generatedAt: new Date().toISOString(),
    }

    saveCache(cache)

    // Summary
    console.log(`\n${colors.blue}═══════════════════════════════════════${colors.reset}`)
    console.log(`${colors.blue}   Generation Complete${colors.reset}`)
    console.log(`${colors.blue}═══════════════════════════════════════${colors.reset}`)
    console.log(`Product: ${product.product.title}`)
    console.log(`Variants: ${productMockups.length}`)
    console.log(`Output: ${outputDir}`)
    console.log(`${colors.green}✓ Success${colors.reset}`)

  } catch (error) {
    console.error(`\n${colors.red}✗ Generation failed: ${error.message}${colors.reset}`)
    console.error(error.stack)
    process.exit(1)
  }
}

// Run generator
generateMockups()
