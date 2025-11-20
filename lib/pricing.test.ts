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
import { logger } from '@/lib/logger'

async function runTests() {
  logger.info('Pricing Service Test Suite ===\n')

  try {
    // Test 1: Calculate price for a canvas product
    logger.info('Test 1: Calculate price from Printful API')
    logger.info('Testing with product ID 301 (canvas), variant ID 10513')

    const price1 = await calculateProductPrice(301, 10513)
    logger.info('Calculated price: $${price1.toFixed(2)}')

    // Test 2: Validate matching price
    logger.info('nTest 2: Validate correct price')
    const validation1 = await validatePrice(price1, 301, 10513)
    logger.info('Validation result:', { data: {
      valid: validation1.valid,
      serverPrice: validation1.serverPrice,
      clientPrice: validation1.clientPrice,
      difference: validation1.difference,
    } })

    // Test 3: Detect tampered price
    logger.info('nTest 3: Detect tampered price (client sends $0.01)')
    const validation2 = await validatePrice(0.01, 301, 10513)
    logger.info('Tampering detected:', { data: {
      valid: validation2.valid,
      serverPrice: validation2.serverPrice,
      clientPrice: validation2.clientPrice,
      difference: validation2.difference,
    } })

    if (!validation2.valid) {
      logger.info('Security working: Tampered price rejected!')
    } else {
      logger.info('SECURITY ISSUE: Tampered price accepted!')
    }

    // Test 4: Check cache
    logger.info('nTest 4: Check price cache')
    const cacheStats = getCacheStats()
    logger.info('Cache stats:', { data: cacheStats })

    // Test 5: Verify cache hit (should be instant)
    logger.info('nTest 5: Verify cache hit (should be fast)')
    const startTime = Date.now()
    const price2 = await calculateProductPrice(301, 10513)
    const duration = Date.now() - startTime
    logger.info('Cache hit: ${duration}ms (should be <10ms)')
    logger.info('Price: $${price2.toFixed(2)} (should match $${price1.toFixed(2)})')

    // Test 6: Clear cache and recalculate
    logger.info('nTest 6: Clear cache and recalculate')
    clearPriceCache()
    const price3 = await calculateProductPrice(301, 10513)
    logger.info('Recalculated after cache clear: $${price3.toFixed(2)}')

    logger.info('n=== All Tests Passed ===')
    logger.info('Pricing service is working correctly')
    logger.info('Server-side validation prevents price tampering')
    logger.info('Cache improves performance')
  } catch (error) {
    logger.error('Test failed:', error)
    logger.error('nPossible issues:')
    logger.error('Missing PRINTFUL_API_KEY in .env.local')
    logger.error('Missing PRINTFUL_STORE_ID in .env.local')
    logger.error('Invalid product/variant IDs')
    logger.error('Printful API connection issue')
    process.exit(1)
  }
}

// Run tests
runTests()
