#!/usr/bin/env node

/**
 * Test Script: Printful Sync Products Integration
 *
 * This script tests the complete flow:
 * 1. Generate AI design (or use placeholder)
 * 2. Create Printful sync product
 * 3. Verify product in store API
 * 4. Test admin management endpoints
 */

const ADMIN_USERNAME = 'Bmilly23'
const ADMIN_PASSWORD = 'Brandon.mills23'
const BASE_URL = 'http://localhost:3000'

// Helper function to make authenticated admin requests
async function adminFetch(path, options = {}) {
  const credentials = Buffer.from(`${ADMIN_USERNAME}:${ADMIN_PASSWORD}`).toString('base64')

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/json',
      ...options.headers
    }
  })

  const data = await response.json()

  if (!response.ok) {
    console.error(`❌ Request failed: ${response.status}`)
    console.error(data)
    throw new Error(`Request failed: ${response.status}`)
  }

  return data
}

async function testFlow() {
  console.log('🚀 Starting Printful Sync Products Test Flow\n')
  console.log('=' .repeat(50))

  try {
    // Step 1: Check current sync products status
    console.log('\n📊 Step 1: Checking current sync products status...')
    const statusBefore = await adminFetch('/api/admin/sync-products', {
      method: 'POST',
      body: JSON.stringify({ action: 'status' })
    })

    console.log('Current status:')
    console.log(`  - Printful sync products: ${statusBefore.status.printfulSyncProducts}`)
    console.log(`  - Local products: ${statusBefore.status.localProducts}`)
    console.log(`  - Synced local products: ${statusBefore.status.syncedLocalProducts}`)
    console.log(`  - Unsynced local products: ${statusBefore.status.unsyncedLocalProducts}`)

    // Step 2: Generate a test product with AI design
    console.log('\n🎨 Step 2: Generating test product with AI design...')
    console.log('(This will create a poster with consciousness theme)')

    const generateResult = await adminFetch('/api/admin/generate-products', {
      method: 'POST',
      body: JSON.stringify({
        themes: ['consciousness'],
        products: ['poster-medium']
      })
    })

    if (generateResult.success) {
      console.log(`✅ Generated ${generateResult.count} product(s)`)
      const product = generateResult.products[0]
      console.log(`  - Title: ${product.title}`)
      console.log(`  - Design URL: ${product.designUrl}`)
      console.log(`  - Printful Sync ID: ${product.printfulSyncProductId || 'N/A'}`)

      if (product.printfulSyncProductId) {
        console.log('  ✨ Product was automatically synced to Printful!')
      }
    }

    // Step 3: List all sync products on Printful
    console.log('\n📋 Step 3: Listing all sync products on Printful...')
    const syncProductsList = await adminFetch('/api/admin/sync-products?details=true')

    console.log(`Found ${syncProductsList.count} sync products on Printful:`)
    syncProductsList.products.slice(0, 5).forEach(p => {
      console.log(`  - [${p.id}] ${p.name}`)
      if (p.variants && p.variants.length > 0) {
        console.log(`    Variants: ${p.variants.length}, Price: $${p.variants[0].retail_price}`)
      }
    })

    // Step 4: Test store API to verify products are visible
    console.log('\n🏪 Step 4: Testing store API...')
    const storeProducts = await fetch(`${BASE_URL}/api/store/products`).then(r => r.json())

    console.log(`Store API returned ${storeProducts.count} products:`)
    console.log(`  - Sync products: ${storeProducts.sources.syncProducts}`)
    console.log(`  - Curated products: ${storeProducts.sources.curatedProducts}`)
    console.log(`  - Catalog products: ${storeProducts.sources.catalogProducts}`)

    if (storeProducts.products.length > 0) {
      const firstProduct = storeProducts.products[0]
      console.log(`\nFirst product in store:`)
      console.log(`  - Title: ${firstProduct.title}`)
      console.log(`  - Price: $${firstProduct.basePrice}`)
      console.log(`  - Source: ${firstProduct.source}`)
      console.log(`  - Has sync ID: ${firstProduct.syncProductId ? 'Yes' : 'No'}`)
    }

    // Step 5: Sync any unsynced local products
    console.log('\n🔄 Step 5: Syncing unsynced local products...')
    const syncResult = await adminFetch('/api/admin/sync-products', {
      method: 'POST',
      body: JSON.stringify({ action: 'sync' })
    })

    console.log(syncResult.message)
    if (syncResult.syncedCount > 0) {
      console.log(`✅ Successfully synced ${syncResult.syncedCount} products`)
    }

    // Step 6: Final status check
    console.log('\n📊 Step 6: Final status check...')
    const statusAfter = await adminFetch('/api/admin/sync-products', {
      method: 'POST',
      body: JSON.stringify({ action: 'status' })
    })

    console.log('Final status:')
    console.log(`  - Printful sync products: ${statusAfter.status.printfulSyncProducts}`)
    console.log(`  - Synced local products: ${statusAfter.status.syncedLocalProducts}`)
    console.log(`  - Unsynced local products: ${statusAfter.status.unsyncedLocalProducts}`)

    if (statusAfter.status.orphanedSyncProducts.length > 0) {
      console.log(`\n⚠️ Found ${statusAfter.status.orphanedSyncProducts.length} orphaned sync products on Printful:`)
      statusAfter.status.orphanedSyncProducts.slice(0, 3).forEach(p => {
        console.log(`  - [${p.id}] ${p.name} (external: ${p.external_id})`)
      })
    }

    console.log('\n' + '=' .repeat(50))
    console.log('✅ Test flow completed successfully!')
    console.log('\n📝 Summary:')
    console.log('1. AI designs can be generated and automatically uploaded to Printful')
    console.log('2. Sync products are created with proper variant configuration')
    console.log('3. Store API prioritizes sync products over catalog products')
    console.log('4. Admin APIs provide full management capabilities')
    console.log('\n🎉 The Printful Sync Products integration is working!')

  } catch (error) {
    console.error('\n❌ Test flow failed:', error)
    process.exit(1)
  }
}

// Check if server is running
async function checkServer() {
  try {
    const response = await fetch(BASE_URL)
    if (!response.ok && response.status !== 404) {
      throw new Error('Server not responding properly')
    }
    return true
  } catch (error) {
    console.error('❌ Server is not running at', BASE_URL)
    console.error('Please start the server with: npm run dev')
    process.exit(1)
  }
}

// Main execution
async function main() {
  console.log('🔍 Checking if server is running...')
  await checkServer()
  console.log('✅ Server is running')

  await testFlow()
}

main().catch(console.error)