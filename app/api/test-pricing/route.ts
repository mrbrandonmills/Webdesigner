/**
 * Test endpoint for pricing validation
 *
 * Run this to test the pricing service:
 * curl -X POST http://localhost:3000/api/test-pricing
 *
 * This endpoint:
 * 1. Tests price calculation from Printful
 * 2. Tests price validation
 * 3. Tests tampering detection
 * 4. Returns detailed results
 */

import { NextResponse } from 'next/server'
import { calculateProductPrice, validatePrice, getCacheStats } from '@/lib/pricing'
import logger from '@/lib/logger'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST() {
  const results: any = {
    timestamp: new Date().toISOString(),
    tests: [],
    summary: {
      passed: 0,
      failed: 0,
      total: 0,
    },
  }

  try {
    // Test product: Canvas (Product ID 301, Variant ID 10513)
    const testProductId = 301
    const testVariantId = 10513

    // Test 1: Calculate server-side price
    logger.info('Running Test 1: Calculate server-side price')
    try {
      const serverPrice = await calculateProductPrice(testProductId, testVariantId)

      results.tests.push({
        name: 'Calculate server-side price',
        status: 'passed',
        data: {
          productId: testProductId,
          variantId: testVariantId,
          serverPrice: `$${serverPrice.toFixed(2)}`,
        },
      })
      results.summary.passed++

      // Test 2: Validate correct price
      logger.info('Running Test 2: Validate correct price')
      const validation1 = await validatePrice(serverPrice, testProductId, testVariantId)

      results.tests.push({
        name: 'Validate correct price',
        status: validation1.valid ? 'passed' : 'failed',
        data: {
          valid: validation1.valid,
          serverPrice: `$${validation1.serverPrice.toFixed(2)}`,
          clientPrice: `$${validation1.clientPrice.toFixed(2)}`,
          difference: `$${validation1.difference.toFixed(4)}`,
        },
      })

      if (validation1.valid) {
        results.summary.passed++
      } else {
        results.summary.failed++
      }

      // Test 3: Detect tampered price
      logger.info('Running Test 3: Detect tampered price')
      const tamperedPrice = 0.01
      const validation2 = await validatePrice(tamperedPrice, testProductId, testVariantId)

      results.tests.push({
        name: 'Detect tampered price ($0.01)',
        status: !validation2.valid ? 'passed' : 'failed',
        data: {
          valid: validation2.valid,
          serverPrice: `$${validation2.serverPrice.toFixed(2)}`,
          clientPrice: `$${validation2.clientPrice.toFixed(2)}`,
          difference: `$${validation2.difference.toFixed(2)}`,
          expectedResult: 'Should reject tampered price',
        },
      })

      if (!validation2.valid) {
        results.summary.passed++
      } else {
        results.summary.failed++
        results.securityIssue = 'CRITICAL: Tampered price was accepted!'
      }

      // Test 4: Check cache
      logger.info('Running Test 4: Check cache functionality')
      const cacheStats = getCacheStats()

      results.tests.push({
        name: 'Check cache functionality',
        status: cacheStats.size > 0 ? 'passed' : 'warning',
        data: {
          cacheSize: cacheStats.size,
          entries: cacheStats.entries.map(e => ({
            key: e.key,
            price: `$${e.price.toFixed(2)}`,
            ageSeconds: e.age,
          })),
        },
      })

      if (cacheStats.size > 0) {
        results.summary.passed++
      } else {
        results.summary.failed++
      }
    } catch (error) {
      results.tests.push({
        name: 'Price calculation and validation',
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      })
      results.summary.failed++
    }

    // Calculate total
    results.summary.total = results.summary.passed + results.summary.failed

    // Overall status
    results.status = results.summary.failed === 0 ? 'success' : 'failed'

    // Security assessment
    const hasSecurityIssue = results.tests.some(
      (t: any) => t.name.includes('tampered') && t.status === 'failed'
    )

    results.securityStatus = hasSecurityIssue
      ? 'CRITICAL: Price tampering not detected - security vulnerability exists!'
      : 'SECURE: Price tampering properly detected and blocked'

    logger.success(`Test suite completed: ${results.summary.passed}/${results.summary.total} passed`)

    return NextResponse.json(results, { status: results.status === 'success' ? 200 : 500 })
  } catch (error) {
    logger.error('Test suite failed', error)

    return NextResponse.json(
      {
        status: 'error',
        error: error instanceof Error ? error.message : 'Test suite failed',
        hint: 'Check that PRINTFUL_API_KEY and PRINTFUL_STORE_ID are set in .env.local',
      },
      { status: 500 }
    )
  }
}
