#!/usr/bin/env node

/**
 * Rate Limiting Test Script
 *
 * Tests that the login endpoint properly rate limits after 5 failed attempts.
 * Run this after starting your dev server: npm run dev
 * Then execute: node test-rate-limiting.js
 */

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'
const LOGIN_URL = `${BASE_URL}/api/auth/login`

async function testRateLimit() {
  console.log('🧪 Testing Rate Limiting on Login Endpoint')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  // Test 1: First 5 attempts should return 401 Unauthorized
  console.log('Test 1: Attempting 5 failed logins (should all return 401)...\n')

  for (let i = 1; i <= 5; i++) {
    try {
      const response = await fetch(LOGIN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'test',
          password: 'wrongpassword',
        }),
      })

      const data = await response.json()
      const remaining = response.headers.get('X-RateLimit-Remaining')

      console.log(`  Attempt ${i}:`)
      console.log(`    Status: ${response.status}`)
      console.log(`    Remaining attempts: ${remaining}`)

      if (response.status === 401) {
        console.log(`    ✅ Correctly returned 401 Unauthorized`)
      } else {
        console.log(`    ❌ Expected 401, got ${response.status}`)
      }
      console.log()
    } catch (error) {
      console.error(`  ❌ Request failed:`, error.message)
      console.log()
    }

    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  // Test 2: 6th attempt should be rate limited (429)
  console.log('Test 2: Attempting 6th login (should be rate limited with 429)...\n')

  try {
    const response = await fetch(LOGIN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'test',
        password: 'wrongpassword',
      }),
    })

    const data = await response.json()
    const retryAfter = response.headers.get('Retry-After')

    console.log(`  Status: ${response.status}`)
    console.log(`  Error: ${data.error}`)
    console.log(`  Retry After: ${retryAfter} seconds`)

    if (response.status === 429) {
      console.log(`  ✅ Correctly rate limited with 429 Too Many Requests`)
      console.log(`  ✅ Client blocked for ~${Math.ceil(retryAfter / 60)} minutes`)
    } else {
      console.log(`  ❌ Expected 429, got ${response.status}`)
    }
    console.log()
  } catch (error) {
    console.error(`  ❌ Request failed:`, error.message)
    console.log()
  }

  // Test 3: Verify subsequent attempts are also blocked
  console.log('Test 3: Attempting another login while blocked (should still be 429)...\n')

  try {
    const response = await fetch(LOGIN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'test',
        password: 'wrongpassword',
      }),
    })

    const data = await response.json()

    console.log(`  Status: ${response.status}`)
    console.log(`  Error: ${data.error}`)

    if (response.status === 429) {
      console.log(`  ✅ Still correctly rate limited`)
    } else {
      console.log(`  ❌ Expected 429, got ${response.status}`)
    }
    console.log()
  } catch (error) {
    console.error(`  ❌ Request failed:`, error.message)
    console.log()
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('✅ Rate limiting test complete!')
  console.log('\nNote: The rate limit will reset after 15 minutes.')
  console.log('Restart your dev server to reset immediately.\n')
}

// Run the test
testRateLimit().catch(error => {
  console.error('Test failed:', error)
  process.exit(1)
})
