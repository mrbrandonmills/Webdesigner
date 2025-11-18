#!/usr/bin/env tsx
/**
 * Test script to discover correct Printful variant IDs
 * for mugs (product ID 19) and posters (product ID 1)
 *
 * Usage:
 *   npx tsx scripts/test-printful-catalog.ts
 */

import dotenv from 'dotenv'
import path from 'path'

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY!
const PRINTFUL_STORE_ID = process.env.PRINTFUL_STORE_ID!

if (!PRINTFUL_API_KEY || !PRINTFUL_STORE_ID) {
  console.error('❌ Error: PRINTFUL_API_KEY and PRINTFUL_STORE_ID must be set')
  process.exit(1)
}

/**
 * Fetch product catalog information from Printful API
 */
async function fetchProductVariants(productId: number, productName: string) {
  try {
    console.log(`\n${'='.repeat(60)}`)
    console.log(`📦 ${productName} (Product ID: ${productId})`)
    console.log('='.repeat(60))

    // Fetch product details
    const productResponse = await fetch(`https://api.printful.com/products/${productId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${PRINTFUL_API_KEY}`,
        'X-PF-Store-Id': PRINTFUL_STORE_ID,
        'Content-Type': 'application/json'
      }
    })

    if (!productResponse.ok) {
      const error = await productResponse.text()
      console.error(`❌ Failed to fetch product: ${error}`)
      return
    }

    const productData = await productResponse.json()
    const product = productData.result

    console.log(`\n📋 Product Info:`)
    console.log(`   Title: ${product.product.title}`)
    console.log(`   Brand: ${product.product.brand}`)
    console.log(`   Model: ${product.product.model}`)
    console.log(`   Type: ${product.product.type_name}`)

    console.log(`\n✨ Available Variants:`)
    console.log(`   Total variants: ${product.variants.length}`)

    // Group variants by common attributes for mugs/posters
    if (productId === 19) { // Mugs
      console.log('\n   🍵 MUG VARIANTS:')
      const mugVariants = product.variants.filter((v: any) =>
        v.name.toLowerCase().includes('11 oz') ||
        v.name.toLowerCase().includes('15 oz') ||
        v.name.toLowerCase().includes('11oz') ||
        v.name.toLowerCase().includes('15oz') ||
        v.name.toLowerCase().includes('20 oz')
      )

      mugVariants.forEach((variant: any) => {
        // Check if variant is actually available in any region
        const availability = variant.in_stock ? '✅' : '❌'
        console.log(`   ${availability} ID: ${variant.id} - ${variant.name}`)
        console.log(`      Size: ${variant.size || 'N/A'}`)
        console.log(`      Color: ${variant.color || 'White'}`)
        console.log(`      In Stock: ${variant.in_stock}`)
        if (variant.availability_regions && Array.isArray(variant.availability_regions)) {
          console.log(`      Regions: ${variant.availability_regions.join(', ')}`)
        }
      })

      // Recommend the best variants (use the IDs we found)
      console.log('\n   📌 RECOMMENDED VARIANTS:')
      const mug11oz = product.variants.find((v: any) => v.id === 1320)
      const mug15oz = product.variants.find((v: any) => v.id === 4830)

      if (mug11oz) {
        console.log(`   11oz White Mug: ${mug11oz.id} (${mug11oz.name})`)
      }
      if (mug15oz) {
        console.log(`   15oz White Mug: ${mug15oz.id} (${mug15oz.name})`)
      }

    } else if (productId === 1) { // Posters
      console.log('\n   🖼️ POSTER VARIANTS:')
      const posterVariants = product.variants.filter((v: any) =>
        v.name.includes('12″×18″') || v.name.includes('18″×24″') ||
        v.name.includes('12×18') || v.name.includes('18×24') ||
        v.name.includes('12"×18"') || v.name.includes('18"×24"')
      )

      posterVariants.forEach((variant: any) => {
        const availability = variant.in_stock ? '✅' : '❌'
        console.log(`   ${availability} ID: ${variant.id} - ${variant.name}`)
        console.log(`      Size: ${variant.size || 'N/A'}`)
        console.log(`      In Stock: ${variant.in_stock}`)
        if (variant.availability_regions && Array.isArray(variant.availability_regions)) {
          console.log(`      Regions: ${variant.availability_regions.join(', ')}`)
        }
      })

      // Recommend the best variants (use IDs we found from the API)
      console.log('\n   📌 RECOMMENDED VARIANTS:')
      const poster12x18 = product.variants.find((v: any) => v.id === 3876)
      const poster18x24 = product.variants.find((v: any) => v.id === 3878)

      if (poster12x18) {
        console.log(`   12×18 Poster: ${poster12x18.id} (${poster12x18.name})`)
      }
      if (poster18x24) {
        console.log(`   18×24 Poster: ${poster18x24.id} (${poster18x24.name})`)
      }
    }

    // Show all variants for debugging
    console.log('\n   📊 ALL VARIANTS (for reference):')
    product.variants.slice(0, 10).forEach((variant: any) => {
      const availability = variant.availability_status === 'active' ? '✅' : '❌'
      console.log(`   ${availability} ${variant.id}: ${variant.name}`)
    })
    if (product.variants.length > 10) {
      console.log(`   ... and ${product.variants.length - 10} more variants`)
    }

  } catch (error) {
    console.error(`❌ Error fetching ${productName}:`, error)
  }
}

/**
 * Test current variant IDs to see if they're valid
 */
async function testVariantId(variantId: number, description: string) {
  try {
    const response = await fetch(`https://api.printful.com/products/variant/${variantId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${PRINTFUL_API_KEY}`,
        'X-PF-Store-Id': PRINTFUL_STORE_ID,
        'Content-Type': 'application/json'
      }
    })

    if (response.ok) {
      const data = await response.json()
      const variant = data.result.variant
      console.log(`   ✅ ${description} (${variantId}): ${variant.name} - AVAILABLE`)
      return true
    } else {
      console.log(`   ❌ ${description} (${variantId}): NOT AVAILABLE`)
      return false
    }
  } catch (error) {
    console.log(`   ❌ ${description} (${variantId}): ERROR - ${error}`)
    return false
  }
}

async function main() {
  console.log(`
╔════════════════════════════════════════════════════╗
║   🔍 PRINTFUL CATALOG VARIANT DISCOVERY           ║
║   Finding correct variant IDs for products        ║
╚════════════════════════════════════════════════════╝
`)

  console.log(`📍 Store ID: ${PRINTFUL_STORE_ID}`)
  console.log(`🔑 API Key: ${PRINTFUL_API_KEY.substring(0, 10)}...`)

  // Test current variant IDs from the sync script
  console.log('\n📋 TESTING CURRENT VARIANT IDS:')
  console.log('='.repeat(60))

  await testVariantId(1320, 'Mug 11oz (current)')
  await testVariantId(1321, 'Mug 15oz (current - FAILING)')
  await testVariantId(3483, 'Poster 12×18 (current - FAILING)')
  await testVariantId(3484, 'Poster 18×24 (current)')

  // Fetch correct variants for mugs
  await fetchProductVariants(19, 'WHITE GLOSSY MUG')

  // Fetch correct variants for posters
  await fetchProductVariants(1, 'POSTER')

  // Also check t-shirts, phone cases, tote bags, and wall art
  console.log('\n📋 CHECKING OTHER PRODUCTS:')
  await testVariantId(4012, 'T-shirt M Black')
  await testVariantId(4013, 'T-shirt L Black')
  await testVariantId(12318, 'Phone Case iPhone 14')
  await testVariantId(12262, 'Tote Bag 15×15')
  await testVariantId(3490, 'Wall Art 12×18 Black Frame')

  console.log(`
${'='.repeat(60)}
📊 SUMMARY
${'='.repeat(60)}

Based on the catalog discovery, update the following in sync-printful-production.ts:

1. MUG variants (Product ID: 19):
   - Replace 1321 with the correct 15oz white mug variant ID
   - Keep 1320 if it's valid for 11oz

2. POSTER variants (Product ID: 1):
   - Replace 3483 with the correct 12×18 poster variant ID
   - Check if 3484 is valid for 18×24

Look for the RECOMMENDED VARIANTS section above for the best IDs to use.
`)
}

main().catch(error => {
  console.error('Fatal error:', error)
  process.exit(1)
})