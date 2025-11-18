#!/usr/bin/env tsx
/**
 * Production Printful Sync Script
 *
 * This script syncs all rendered designs to Printful when images are publicly accessible.
 *
 * Prerequisites:
 * 1. Images must be accessible via public URLs (e.g., deployed to Vercel/Netlify)
 * 2. PRINTFUL_API_KEY and PRINTFUL_STORE_ID must be set in environment
 * 3. NEXT_PUBLIC_SITE_URL must point to production URL
 *
 * Usage:
 *   NODE_ENV=production npx tsx scripts/sync-printful-production.ts
 *   NODE_ENV=production npx tsx scripts/sync-printful-production.ts --category poetry
 *   NODE_ENV=production npx tsx scripts/sync-printful-production.ts --test
 */

import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY!
const PRINTFUL_STORE_ID = process.env.PRINTFUL_STORE_ID!
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://brandonmills.com'

// Product mappings with multiple variants
const PRODUCT_MAPPINGS: Record<string, any> = {
  't-shirt': {
    productName: 'Premium T-Shirt',
    variants: [
      { id: 4012, size: 'M', color: 'Black' },
      { id: 4013, size: 'L', color: 'Black' },
      { id: 4014, size: 'XL', color: 'Black' }
    ],
    placement: 'front',
    retailPrice: '39.95'
  },
  'poster': {
    productName: 'Art Print',
    variants: [
      { id: 3483, size: '12×18' },
      { id: 3484, size: '18×24' }
    ],
    placement: 'default',
    retailPrice: '29.95'
  },
  'mug': {
    productName: 'Ceramic Mug',
    variants: [
      { id: 1320, size: '11oz' },
      { id: 1321, size: '15oz' }
    ],
    placement: 'default',
    retailPrice: '24.95'
  },
  'phone-case': {
    productName: 'Phone Case',
    variants: [
      { id: 12318, model: 'iPhone 14' },
      { id: 12319, model: 'iPhone 14 Pro' }
    ],
    placement: 'default',
    retailPrice: '34.95'
  },
  'tote-bag': {
    productName: 'Eco Tote',
    variants: [
      { id: 12262, size: '15×15' }
    ],
    placement: 'default',
    retailPrice: '44.95'
  },
  'wall-art': {
    productName: 'Framed Print',
    variants: [
      { id: 3490, size: '12×18', frame: 'Black' },
      { id: 3491, size: '18×24', frame: 'Black' }
    ],
    placement: 'default',
    retailPrice: '89.95'
  }
}

interface SyncResult {
  category: string
  name: string
  productType: string
  success: boolean
  syncProductId?: number
  variantCount?: number
  error?: string
  mockupUrls?: string[]
}

async function createSyncProduct(design: any): Promise<SyncResult> {
  const mapping = PRODUCT_MAPPINGS[design.productType]
  if (!mapping) {
    return {
      category: design.category,
      name: design.name,
      productType: design.productType,
      success: false,
      error: `No mapping for product type: ${design.productType}`
    }
  }

  // Format names
  const categoryName = design.category.charAt(0).toUpperCase() + design.category.slice(1)
  const designName = design.name.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  const productName = `${categoryName} - ${designName} - ${mapping.productName}`
  const externalId = `${design.category}-${design.name}-${design.productType}-${Date.now()}`

  // Build image URL (production)
  const imageUrl = `${SITE_URL}${design.path}`

  // Create sync variants for all sizes/models
  const syncVariants = mapping.variants.map((variant: any, index: number) => ({
    external_id: `${externalId}-v${index}`,
    variant_id: variant.id,
    retail_price: mapping.retailPrice,
    files: [
      {
        type: mapping.placement,
        url: imageUrl
      }
    ]
  }))

  const data = {
    sync_product: {
      external_id: externalId,
      name: productName,
      thumbnail: imageUrl
    },
    sync_variants: syncVariants
  }

  try {
    console.log(`   📤 Uploading to Printful...`)
    console.log(`   Image URL: ${imageUrl}`)

    const response = await fetch('https://api.printful.com/store/products', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PRINTFUL_API_KEY}`,
        'X-PF-Store-Id': PRINTFUL_STORE_ID,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      const error = await response.text()
      console.error(`   ❌ API Error: ${error.substring(0, 200)}`)
      return {
        category: design.category,
        name: design.name,
        productType: design.productType,
        success: false,
        error: error.substring(0, 200)
      }
    }

    const result = await response.json()
    console.log(`   ✅ Created: Product ID ${result.result.id}`)
    console.log(`   ✅ Variants: ${syncVariants.length} sizes/models created`)

    // Try to generate mockups (optional, may fail)
    let mockupUrls: string[] = []
    try {
      console.log(`   🎨 Generating mockups...`)
      const mockupResponse = await generateMockups(result.result.id)
      if (mockupResponse.length > 0) {
        mockupUrls = mockupResponse
        console.log(`   ✅ Mockups: ${mockupUrls.length} generated`)
      }
    } catch (mockupError) {
      console.log(`   ⚠️ Mockup generation skipped`)
    }

    return {
      category: design.category,
      name: design.name,
      productType: design.productType,
      success: true,
      syncProductId: result.result.id,
      variantCount: syncVariants.length,
      mockupUrls
    }
  } catch (error) {
    console.error(`   ❌ Exception:`, error)
    return {
      category: design.category,
      name: design.name,
      productType: design.productType,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

async function generateMockups(syncProductId: number): Promise<string[]> {
  // Implementation would go here
  // For now, return empty array
  return []
}

async function main() {
  console.log(`
╔════════════════════════════════════════════════════╗
║     🚀 PRODUCTION PRINTFUL SYNC 🚀                ║
║     Syncing all designs to Printful catalog       ║
╚════════════════════════════════════════════════════╝
  `)

  // Verify environment
  if (!PRINTFUL_API_KEY || !PRINTFUL_STORE_ID) {
    console.error('❌ Error: PRINTFUL_API_KEY and PRINTFUL_STORE_ID must be set')
    process.exit(1)
  }

  const isProduction = process.env.NODE_ENV === 'production'
  if (!isProduction) {
    console.warn('⚠️  Warning: Not in production mode. Images may not be accessible.')
    console.warn('   Run with: NODE_ENV=production npm run sync:printful')
  }

  console.log(`📍 Store ID: ${PRINTFUL_STORE_ID}`)
  console.log(`🌐 Site URL: ${SITE_URL}`)
  console.log('')

  // Read manifest
  const manifestPath = '/Volumes/Super Mastery/Webdesigner/public/designs/rendered/manifest.json'
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'))

  const args = process.argv.slice(2)
  const categoryFilter = args.includes('--category') ? args[args.indexOf('--category') + 1] : null
  const isTest = args.includes('--test')

  const results: SyncResult[] = []
  let processedCount = 0
  let targetCount = 0

  // Build list of designs to process
  const designsToProcess: any[] = []

  for (const [category, designs] of Object.entries(manifest.categories)) {
    if (categoryFilter && category !== categoryFilter) continue

    for (const [designName, files] of Object.entries(designs as any)) {
      for (const file of files as any[]) {
        designsToProcess.push({
          ...file,
          category,
          name: designName
        })

        if (isTest && designsToProcess.length >= 3) break
      }
      if (isTest && designsToProcess.length >= 3) break
    }
    if (isTest && designsToProcess.length >= 3) break
  }

  targetCount = designsToProcess.length
  console.log(`📊 Processing ${targetCount} designs...\n`)

  // Process each design
  for (const design of designsToProcess) {
    processedCount++
    const progress = `[${processedCount}/${targetCount}]`

    console.log(`${progress} 📦 ${design.category} - ${design.name} (${design.productType})`)

    const result = await createSyncProduct(design)
    results.push(result)

    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  // Generate summary
  const successful = results.filter(r => r.success)
  const failed = results.filter(r => !r.success)

  console.log('\n' + '═'.repeat(60))
  console.log('📊 SYNC SUMMARY')
  console.log('═'.repeat(60))
  console.log(`✅ Successful: ${successful.length} products`)
  console.log(`❌ Failed: ${failed.length} products`)
  console.log(`📁 Total processed: ${results.length} designs`)

  // Save results
  const outputPath = '/Volumes/Super Mastery/Webdesigner/public/designs/printful-sync.json'
  fs.writeFileSync(outputPath, JSON.stringify({
    syncDate: new Date().toISOString(),
    environment: isProduction ? 'production' : 'development',
    siteUrl: SITE_URL,
    totalDesigns: results.length,
    successful: successful.length,
    failed: failed.length,
    results
  }, null, 2))

  console.log(`\n💾 Results saved to: ${outputPath}`)

  // List successful products
  if (successful.length > 0) {
    console.log('\n✅ Successfully synced products:')
    successful.forEach(r => {
      console.log(`   • ${r.category} - ${r.name} (${r.productType})`)
      console.log(`     ID: ${r.syncProductId} | Variants: ${r.variantCount}`)
    })
  }

  // List failed products
  if (failed.length > 0) {
    console.log('\n❌ Failed products:')
    failed.forEach(r => {
      console.log(`   • ${r.category} - ${r.name} (${r.productType})`)
      console.log(`     Error: ${r.error}`)
    })
  }

  console.log('\n🎯 Next Steps:')
  console.log('   1. Visit Printful Dashboard: https://www.printful.com/dashboard/store/products')
  console.log('   2. Review product details and mockups')
  console.log('   3. Adjust pricing if needed')
  console.log('   4. Enable products for sale')
  console.log('   5. Test ordering process')

  if (!isProduction) {
    console.log('\n⚠️  IMPORTANT: To sync in production:')
    console.log('   1. Deploy site to Vercel/Netlify first')
    console.log('   2. Ensure images are accessible at ' + SITE_URL)
    console.log('   3. Run: NODE_ENV=production npm run sync:printful')
  }
}

main().catch(error => {
  console.error('Fatal error:', error)
  process.exit(1)
})