#!/usr/bin/env tsx
/**
 * Fetch Product Mockups from Printful
 *
 * Downloads mockup images for all synced products and updates the product catalog.
 *
 * Usage:
 *   npx tsx scripts/fetch-printful-mockups.ts
 */

import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY!
const PRINTFUL_STORE_ID = process.env.PRINTFUL_STORE_ID!

interface SyncResult {
  category: string
  name: string
  productType: string
  success: boolean
  syncProductId?: number
  variantCount?: number
}

interface MockupFile {
  type: string
  url?: string
  preview_url?: string
}

interface SyncVariant {
  id: number
  files?: MockupFile[]
}

async function fetchProductMockups() {
  console.log('\n========================================')
  console.log('  PRINTFUL MOCKUP FETCHER')
  console.log('========================================\n')

  // Verify environment
  if (!PRINTFUL_API_KEY || !PRINTFUL_STORE_ID) {
    console.error('Error: PRINTFUL_API_KEY and PRINTFUL_STORE_ID must be set')
    process.exit(1)
  }

  // Read sync results
  const syncPath = '/Volumes/Super Mastery/Webdesigner/public/designs/printful-sync.json'
  if (!fs.existsSync(syncPath)) {
    console.error('Error: Printful sync file not found at', syncPath)
    console.error('Run the sync script first: npm run sync:printful')
    process.exit(1)
  }

  const syncData = JSON.parse(fs.readFileSync(syncPath, 'utf-8'))
  const products = syncData.results.filter((r: SyncResult) => r.success && r.syncProductId)

  console.log(`Found ${products.length} synced products\n`)

  // Create mockups directory
  const mockupsDir = '/Volumes/Super Mastery/Webdesigner/public/mockups'
  fs.mkdirSync(mockupsDir, { recursive: true })

  const mockupResults: { product: string; filename: string; success: boolean; error?: string }[] = []

  for (const product of products) {
    const productKey = `${product.category}-${product.name}-${product.productType}`
    console.log(`Fetching: ${productKey}...`)

    try {
      // Get product details with mockup files
      const response = await fetch(
        `https://api.printful.com/store/products/${product.syncProductId}`,
        {
          headers: {
            'Authorization': `Bearer ${PRINTFUL_API_KEY}`,
            'X-PF-Store-Id': PRINTFUL_STORE_ID,
          }
        }
      )

      if (!response.ok) {
        const error = await response.text()
        console.error(`  API Error: ${error.substring(0, 100)}`)
        mockupResults.push({ product: productKey, filename: '', success: false, error: error.substring(0, 100) })
        continue
      }

      const data = await response.json()
      const syncVariants: SyncVariant[] = data.result.sync_variants || []

      // Find mockup/preview URLs
      let mockupUrl: string | null = null

      for (const variant of syncVariants) {
        if (variant.files) {
          for (const file of variant.files) {
            // Prefer preview URL, fall back to regular URL
            if (file.preview_url) {
              mockupUrl = file.preview_url
              break
            }
            if (file.type === 'preview' && file.url) {
              mockupUrl = file.url
              break
            }
          }
        }
        if (mockupUrl) break
      }

      if (!mockupUrl) {
        console.log(`  No mockup available yet`)
        mockupResults.push({ product: productKey, filename: '', success: false, error: 'No mockup URL' })
        continue
      }

      // Download the mockup image
      const filename = `${productKey}.jpg`
      const outputPath = path.join(mockupsDir, filename)

      console.log(`  Downloading mockup...`)
      const imgResponse = await fetch(mockupUrl)

      if (!imgResponse.ok) {
        throw new Error(`Failed to download: ${imgResponse.status}`)
      }

      const buffer = await imgResponse.arrayBuffer()
      fs.writeFileSync(outputPath, Buffer.from(buffer))

      console.log(`  Saved: ${filename}`)
      mockupResults.push({ product: productKey, filename, success: true })

      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 500))
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error'
      console.error(`  Error: ${errorMsg}`)
      mockupResults.push({ product: productKey, filename: '', success: false, error: errorMsg })
    }
  }

  // Summary
  console.log('\n========================================')
  console.log('  SUMMARY')
  console.log('========================================\n')

  const successful = mockupResults.filter(r => r.success)
  const failed = mockupResults.filter(r => !r.success)

  console.log(`Downloaded: ${successful.length} mockups`)
  console.log(`Failed: ${failed.length} products`)

  if (successful.length > 0) {
    console.log('\nSuccessful downloads:')
    successful.forEach(r => console.log(`  ${r.filename}`))
  }

  if (failed.length > 0) {
    console.log('\nFailed products:')
    failed.forEach(r => console.log(`  ${r.product}: ${r.error}`))
  }

  // Save results
  const resultsPath = '/Volumes/Super Mastery/Webdesigner/public/mockups/fetch-results.json'
  fs.writeFileSync(resultsPath, JSON.stringify({
    fetchDate: new Date().toISOString(),
    total: products.length,
    successful: successful.length,
    failed: failed.length,
    results: mockupResults
  }, null, 2))

  console.log(`\nResults saved to: ${resultsPath}`)
  console.log('\nNext steps:')
  console.log('  1. Run: npx tsx scripts/update-product-images.ts')
  console.log('  2. Commit and deploy the changes')
}

fetchProductMockups().catch(error => {
  console.error('Fatal error:', error)
  process.exit(1)
})
