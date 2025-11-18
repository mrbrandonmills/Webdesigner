#!/usr/bin/env tsx
/**
 * Retry script for failed Printful syncs
 * This script retries only the failed products with longer delays
 */

import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY!
const PRINTFUL_STORE_ID = process.env.PRINTFUL_STORE_ID!
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://brandonmills.com'

// Product mappings
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
      { id: 3876, size: '12×18' },
      { id: 1, size: '18×24' }
    ],
    placement: 'default',
    retailPrice: '29.95'
  },
  'mug': {
    productName: 'Ceramic Mug',
    variants: [
      { id: 1320, size: '11oz' },
      { id: 4830, size: '15oz' }
    ],
    placement: 'default',
    retailPrice: '24.95'
  },
  'phone-case': {
    productName: 'Phone Case',
    variants: [
      { id: 16910, model: 'iPhone 14' },
      { id: 16912, model: 'iPhone 14 Pro' }
    ],
    placement: 'default',
    retailPrice: '34.95'
  },
  'tote-bag': {
    productName: 'Eco Tote',
    variants: [
      { id: 10457, size: 'One size' }
    ],
    placement: 'default',
    retailPrice: '44.95'
  },
  'wall-art': {
    productName: 'Framed Print',
    variants: [
      { id: 4398, size: '12×18', frame: 'Black' },
      { id: 3, size: '18×24', frame: 'Black' }
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

  const categoryName = design.category.charAt(0).toUpperCase() + design.category.slice(1)
  const designName = design.name.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  const productName = `${categoryName} - ${designName} - ${mapping.productName}`
  const externalId = `${design.category}-${design.name}-${design.productType}-${Date.now()}`

  const imageUrl = `${SITE_URL}${design.path}`

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

    return {
      category: design.category,
      name: design.name,
      productType: design.productType,
      success: true,
      syncProductId: result.result.id,
      variantCount: syncVariants.length
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

async function main() {
  console.log(`
╔════════════════════════════════════════════════════╗
║     🔄 RETRY FAILED PRINTFUL SYNCS 🔄             ║
║     Retrying with longer rate limit delays       ║
╚════════════════════════════════════════════════════╝
  `)

  // Read the previous sync results
  const resultsPath = '/Volumes/Super Mastery/Webdesigner/public/designs/printful-sync.json'
  const previousResults = JSON.parse(fs.readFileSync(resultsPath, 'utf-8'))

  // Get failed results
  const failedResults = previousResults.results.filter((r: any) => !r.success)
  
  if (failedResults.length === 0) {
    console.log('✅ No failed products to retry!')
    process.exit(0)
  }

  console.log(`📊 Retrying ${failedResults.length} failed products...\n`)

  // Read manifest to get file paths
  const manifestPath = '/Volumes/Super Mastery/Webdesigner/public/designs/rendered/manifest.json'
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'))

  // Build design map
  const designMap = new Map<string, any>()
  for (const [category, designs] of Object.entries(manifest.categories)) {
    for (const [designName, files] of Object.entries(designs as any)) {
      for (const file of files as any[]) {
        const key = `${category}-${designName}-${file.productType}`
        designMap.set(key, { ...file, category, name: designName })
      }
    }
  }

  // Retry each failed product
  const newResults: SyncResult[] = []
  let retryCount = 0

  for (const failed of failedResults) {
    retryCount++
    const key = `${failed.category}-${failed.name}-${failed.productType}`
    const design = designMap.get(key)

    if (!design) {
      console.log(`[${retryCount}/${failedResults.length}] ❌ ${failed.category} - ${failed.name} (${failed.productType})`)
      console.log(`   ❌ Could not find design in manifest`)
      continue
    }

    console.log(`[${retryCount}/${failedResults.length}] 📦 ${failed.category} - ${failed.name} (${failed.productType})`)

    const result = await createSyncProduct(design)
    newResults.push(result)

    // Longer delay between requests (2.5 seconds)
    if (retryCount < failedResults.length) {
      console.log(`   ⏳ Rate limiting (2.5s delay)...`)
      await new Promise(resolve => setTimeout(resolve, 2500))
    }
  }

  // Merge results
  const mergedResults = previousResults.results.map((r: any) => {
    if (!r.success) {
      const retried = newResults.find(nr => nr.category === r.category && nr.name === r.name && nr.productType === r.productType)
      if (retried) {
        return retried
      }
    }
    return r
  })

  const successful = mergedResults.filter((r: any) => r.success)
  const failed = mergedResults.filter((r: any) => !r.success)

  console.log('\n' + '═'.repeat(60))
  console.log('📊 UPDATED SYNC SUMMARY')
  console.log('═'.repeat(60))
  console.log(`✅ Successful: ${successful.length} products`)
  console.log(`❌ Failed: ${failed.length} products`)

  // Save updated results
  fs.writeFileSync(resultsPath, JSON.stringify({
    syncDate: new Date().toISOString(),
    environment: 'production',
    siteUrl: SITE_URL,
    totalDesigns: mergedResults.length,
    successful: successful.length,
    failed: failed.length,
    results: mergedResults
  }, null, 2))

  console.log(`\n💾 Results saved to: ${resultsPath}`)

  if (successful.length > 0) {
    console.log('\n✅ Successfully synced products:')
    successful.forEach((r: any) => {
      if (r.success) {
        console.log(`   • ${r.category} - ${r.name} (${r.productType})`)
        console.log(`     ID: ${r.syncProductId} | Variants: ${r.variantCount}`)
      }
    })
  }

  if (failed.length > 0) {
    console.log('\n❌ Still failing:')
    failed.forEach((r: any) => {
      console.log(`   • ${r.category} - ${r.name} (${r.productType})`)
      if (r.error) console.log(`     Error: ${r.error.substring(0, 100)}`)
    })
  }
}

main().catch(error => {
  console.error('Fatal error:', error)
  process.exit(1)
})
