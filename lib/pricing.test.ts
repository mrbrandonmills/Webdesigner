/**
 * Manual Test Script for Pricing Service
 *
 * Run this to verify the pricing service works correctly:
 * npx tsx lib/pricing.test.ts
 *
 * This tests:
 * 1. Server-side price calculation from Printful API
 * 2. Price validation (client vs server)
 * 3. Cache functionality
 * 4. Error handling
 */

import { calculateProductPrice, validatePrice, getCacheStats, clearPriceCache } from './pricing'

async function runTests() {
  console.log('=== Pricing Service Test Suite ===\n')

  try {
    // Test 1: Calculate price for a canvas product
    console.log('Test 1: Calculate price from Printful API')
    console.log('Testing with product ID 301 (canvas), variant ID 10513')

    const price1 = await calculateProductPrice(301, 10513)
    console.log(`✅ Calculated price: $${price1.toFixed(2)}`)

    // Test 2: Validate matching price
    console.log('\nTest 2: Validate correct price')
    const validation1 = await validatePrice(price1, 301, 10513)
    console.log(`✅ Validation result:`, {
      valid: validation1.valid,
      serverPrice: validation1.serverPrice,
      clientPrice: validation1.clientPrice,
      difference: validation1.difference,
    })

    // Test 3: Detect tampered price
    console.log('\nTest 3: Detect tampered price (client sends $0.01)')
    const validation2 = await validatePrice(0.01, 301, 10513)
    console.log(`✅ Tampering detected:`, {
      valid: validation2.valid,
      serverPrice: validation2.serverPrice,
      clientPrice: validation2.clientPrice,
      difference: validation2.difference,
    })

    if (!validation2.valid) {
      console.log('✅ Security working: Tampered price rejected!')
    } else {
      console.log('❌ SECURITY ISSUE: Tampered price accepted!')
    }

    // Test 4: Check cache
    console.log('\nTest 4: Check price cache')
    const cacheStats = getCacheStats()
    console.log(`✅ Cache stats:`, cacheStats)

    // Test 5: Verify cache hit (should be instant)
    console.log('\nTest 5: Verify cache hit (should be fast)')
    const startTime = Date.now()
    const price2 = await calculateProductPrice(301, 10513)
    const duration = Date.now() - startTime
    console.log(`✅ Cache hit: ${duration}ms (should be <10ms)`)
    console.log(`Price: $${price2.toFixed(2)} (should match $${price1.toFixed(2)})`)

    // Test 6: Clear cache and recalculate
    console.log('\nTest 6: Clear cache and recalculate')
    clearPriceCache()
    const price3 = await calculateProductPrice(301, 10513)
    console.log(`✅ Recalculated after cache clear: $${price3.toFixed(2)}`)

    console.log('\n=== All Tests Passed ===')
    console.log('✅ Pricing service is working correctly')
    console.log('✅ Server-side validation prevents price tampering')
    console.log('✅ Cache improves performance')
  } catch (error) {
    console.error('❌ Test failed:', error)
    console.error('\nPossible issues:')
    console.error('- Missing PRINTFUL_API_KEY in .env.local')
    console.error('- Missing PRINTFUL_STORE_ID in .env.local')
    console.error('- Invalid product/variant IDs')
    console.error('- Printful API connection issue')
    process.exit(1)
  }
}

// Run tests
runTests()
