#!/usr/bin/env tsx
/**
 * Direct Printful Sync - Creates sync products directly without file upload
 * This is a workaround for API permission issues with file uploads
 */

import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY!
const PRINTFUL_STORE_ID = process.env.PRINTFUL_STORE_ID!

// Product type mappings
const PRODUCT_MAPPINGS: Record<string, any> = {
  't-shirt': {
    variantId: 4012, // Bella + Canvas 3001, M, Black
    placement: 'front',
    retailPrice: '39.95'
  },
  'poster': {
    variantId: 3483, // Poster 12×18
    placement: 'default',
    retailPrice: '29.95'
  },
  'mug': {
    variantId: 1320, // White Glossy Mug 11oz
    placement: 'default',
    retailPrice: '24.95'
  },
  'phone-case': {
    variantId: 12318, // iPhone 14 Clear Case
    placement: 'default',
    retailPrice: '34.95'
  },
  'tote-bag': {
    variantId: 12262, // Eco Tote Bag 15×15
    placement: 'default',
    retailPrice: '44.95'
  },
  'wall-art': {
    variantId: 3490, // Framed Poster 12×18 Black Frame
    placement: 'default',
    retailPrice: '89.95'
  }
}

async function createSyncProduct(design: any, imageUrl: string) {
  const mapping = PRODUCT_MAPPINGS[design.productType]
  if (!mapping) {
    console.log(`   ⚠️ No mapping for ${design.productType}`)
    return null
  }

  const productName = `${design.category.charAt(0).toUpperCase() + design.category.slice(1)} - ${design.name.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}`
  const externalId = `${design.category}-${design.name}-${design.productType}-${Date.now()}`

  const data = {
    sync_product: {
      external_id: externalId,
      name: productName,
      thumbnail: imageUrl
    },
    sync_variants: [
      {
        external_id: `${externalId}-v1`,
        variant_id: mapping.variantId,
        retail_price: mapping.retailPrice,
        files: [
          {
            type: mapping.placement,
            url: imageUrl
          }
        ]
      }
    ]
  }

  try {
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
      console.error(`   ❌ Failed: ${error.substring(0, 100)}`)
      return null
    }

    const result = await response.json()
    console.log(`   ✅ Created: ID ${result.result.id}`)
    return result.result
  } catch (error) {
    console.error(`   ❌ Error:`, error)
    return null
  }
}

async function main() {
  console.log('\n🚀 Direct Printful Sync\n')
  console.log('Using local server URLs for images...\n')

  // Read manifest
  const manifestPath = '/Volumes/Super Mastery/Webdesigner/public/designs/rendered/manifest.json'
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'))

  const results: any[] = []
  let successCount = 0
  let failCount = 0

  // Test with just a few designs first
  const testDesigns = [
    { category: 'poetry', name: 'poet-proponent', file: manifest.categories.poetry['poet-proponent'][0] },
    { category: 'philosophy', name: 'self-esteem', file: manifest.categories.philosophy['self-esteem'][0] },
    { category: 'photography', name: 'am-reed-aqua', file: manifest.categories.photography['am-reed-aqua'][0] }
  ]

  for (const testDesign of testDesigns) {
    const design = {
      ...testDesign.file,
      category: testDesign.category,
      name: testDesign.name
    }

    const relativePath = design.absolutePath.replace('/Volumes/Super Mastery/Webdesigner/public/', '')
    const imageUrl = `http://localhost:8080/${relativePath}`

    console.log(`📦 ${design.category} - ${design.name} (${design.productType})`)
    console.log(`   Image: ${imageUrl}`)

    const result = await createSyncProduct(design, imageUrl)

    if (result) {
      successCount++
      results.push({
        success: true,
        category: design.category,
        name: design.name,
        productType: design.productType,
        syncProductId: result.id,
        productName: result.name
      })
    } else {
      failCount++
      results.push({
        success: false,
        category: design.category,
        name: design.name,
        productType: design.productType
      })
    }

    // Rate limit
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  // Save results
  const outputPath = '/Volumes/Super Mastery/Webdesigner/public/designs/printful-direct-sync.json'
  fs.writeFileSync(outputPath, JSON.stringify({
    syncDate: new Date().toISOString(),
    successful: successCount,
    failed: failCount,
    results
  }, null, 2))

  console.log('\n' + '='.repeat(50))
  console.log(`✅ Success: ${successCount}`)
  console.log(`❌ Failed: ${failCount}`)
  console.log(`💾 Results: ${outputPath}`)
  console.log('='.repeat(50))

  if (successCount > 0) {
    console.log('\n🎯 View your products at:')
    console.log('https://www.printful.com/dashboard/store/products')
  }
}

main().catch(console.error)