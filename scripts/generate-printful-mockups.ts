#!/usr/bin/env tsx
/**
 * Generate Product Mockups using Printful Mockup Generator API
 *
 * Creates professional mockup images for products using Printful's mockup generator.
 *
 * Usage:
 *   npx tsx scripts/generate-printful-mockups.ts
 */

import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY!
const PRINTFUL_STORE_ID = process.env.PRINTFUL_STORE_ID!
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://brandonmills.com'

// Product type to Printful product ID mapping for mockup generation
const PRODUCT_IDS: Record<string, number> = {
  'mug': 19,        // White Glossy Mug
  't-shirt': 71,    // Unisex Staple T-Shirt
  'poster': 1,      // Enhanced Matte Paper Poster
  'phone-case': 472, // Snap Case for iPhone
  'tote-bag': 245,  // Econscious EC8000
  'wall-art': 2,    // Enhanced Matte Paper Framed Poster
}

// Variant IDs for default mockup sizes
const VARIANT_IDS: Record<string, number> = {
  'mug': 1320,      // 11oz
  't-shirt': 4012,  // Black M
  'poster': 3876,   // 12x18
  'phone-case': 16910, // iPhone 14
  'tote-bag': 10457, // One size
  'wall-art': 4398,  // 12x18 Black frame
}

interface MockupTask {
  task_key: string
  status: string
  mockups?: {
    placement: string
    variant_ids: number[]
    mockup_url: string
    extra: {
      title: string
      option: string
      url: string
    }[]
  }[]
  error?: string
}

async function generateMockup(
  productType: string,
  imageUrl: string,
  category: string,
  designName: string
): Promise<string | null> {
  const productId = PRODUCT_IDS[productType]
  const variantId = VARIANT_IDS[productType]

  if (!productId || !variantId) {
    console.log(`    Unknown product type: ${productType}`)
    return null
  }

  // Request mockup generation
  const createResponse = await fetch('https://api.printful.com/mockup-generator/create-task', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${PRINTFUL_API_KEY}`,
      'X-PF-Store-Id': PRINTFUL_STORE_ID,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      product_id: productId,
      variant_ids: [variantId],
      files: [{
        placement: 'default',
        image_url: imageUrl,
        position: {
          area_width: 1800,
          area_height: 2400,
          width: 1800,
          height: 2400,
          top: 0,
          left: 0,
        }
      }],
      format: 'jpg',
      option_groups: ['Front'],
    })
  })

  if (!createResponse.ok) {
    const error = await createResponse.text()
    console.log(`    API Error: ${error.substring(0, 100)}`)
    return null
  }

  const createData = await createResponse.json()
  const taskKey = createData.result?.task_key

  if (!taskKey) {
    console.log(`    No task key received`)
    return null
  }

  // Poll for task completion
  let attempts = 0
  const maxAttempts = 30 // 30 seconds max

  while (attempts < maxAttempts) {
    await new Promise(resolve => setTimeout(resolve, 1000))

    const statusResponse = await fetch(
      `https://api.printful.com/mockup-generator/task?task_key=${taskKey}`,
      {
        headers: {
          'Authorization': `Bearer ${PRINTFUL_API_KEY}`,
          'X-PF-Store-Id': PRINTFUL_STORE_ID,
        }
      }
    )

    if (!statusResponse.ok) {
      attempts++
      continue
    }

    const statusData = await statusResponse.json()
    const task: MockupTask = statusData.result

    if (task.status === 'completed' && task.mockups && task.mockups.length > 0) {
      // Get the first mockup URL
      const mockupUrl = task.mockups[0].mockup_url ||
        (task.mockups[0].extra && task.mockups[0].extra[0]?.url)

      if (mockupUrl) {
        return mockupUrl
      }
    } else if (task.status === 'failed') {
      console.log(`    Task failed: ${task.error || 'Unknown error'}`)
      return null
    }

    attempts++
  }

  console.log(`    Timeout waiting for mockup`)
  return null
}

async function main() {
  console.log('\n========================================')
  console.log('  PRINTFUL MOCKUP GENERATOR')
  console.log('========================================\n')

  // Verify environment
  if (!PRINTFUL_API_KEY || !PRINTFUL_STORE_ID) {
    console.error('Error: PRINTFUL_API_KEY and PRINTFUL_STORE_ID must be set')
    process.exit(1)
  }

  // Read manifest
  const manifestPath = '/Volumes/Super Mastery/Webdesigner/public/designs/rendered/manifest.json'
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'))

  // Create mockups directory
  const mockupsDir = '/Volumes/Super Mastery/Webdesigner/public/mockups'
  fs.mkdirSync(mockupsDir, { recursive: true })

  const results: { product: string; success: boolean; filename?: string; error?: string }[] = []
  let totalCount = 0

  // Process each design
  for (const [category, designs] of Object.entries(manifest.categories)) {
    for (const [designName, files] of Object.entries(designs as any)) {
      for (const file of files as any[]) {
        totalCount++
        const productKey = `${category}-${designName}-${file.productType}`
        const filename = `${productKey}.jpg`
        const outputPath = path.join(mockupsDir, filename)

        // Skip if mockup already exists
        if (fs.existsSync(outputPath)) {
          console.log(`[${totalCount}] ${productKey}: Already exists`)
          results.push({ product: productKey, success: true, filename })
          continue
        }

        console.log(`[${totalCount}] ${productKey}:`)
        console.log(`    Generating mockup...`)

        const imageUrl = `${SITE_URL}${file.path}`
        const mockupUrl = await generateMockup(file.productType, imageUrl, category, designName)

        if (mockupUrl) {
          // Download the mockup
          console.log(`    Downloading...`)
          const imgResponse = await fetch(mockupUrl)

          if (imgResponse.ok) {
            const buffer = await imgResponse.arrayBuffer()
            fs.writeFileSync(outputPath, Buffer.from(buffer))
            console.log(`    Saved: ${filename}`)
            results.push({ product: productKey, success: true, filename })
          } else {
            console.log(`    Failed to download`)
            results.push({ product: productKey, success: false, error: 'Download failed' })
          }
        } else {
          results.push({ product: productKey, success: false, error: 'Mockup generation failed' })
        }

        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 500))
      }
    }
  }

  // Summary
  console.log('\n========================================')
  console.log('  SUMMARY')
  console.log('========================================\n')

  const successful = results.filter(r => r.success)
  const failed = results.filter(r => !r.success)

  console.log(`Generated: ${successful.length} mockups`)
  console.log(`Failed: ${failed.length} products`)

  if (failed.length > 0) {
    console.log('\nFailed products:')
    failed.forEach(r => console.log(`  ${r.product}: ${r.error}`))
  }

  // Save results
  const resultsPath = '/Volumes/Super Mastery/Webdesigner/public/mockups/generate-results.json'
  fs.writeFileSync(resultsPath, JSON.stringify({
    generateDate: new Date().toISOString(),
    total: results.length,
    successful: successful.length,
    failed: failed.length,
    results
  }, null, 2))

  console.log(`\nResults saved to: ${resultsPath}`)

  if (successful.length > 0) {
    console.log('\nNext steps:')
    console.log('  1. Run: npx tsx scripts/update-product-images.ts')
    console.log('  2. Commit and deploy the changes')
  }
}

main().catch(error => {
  console.error('Fatal error:', error)
  process.exit(1)
})
