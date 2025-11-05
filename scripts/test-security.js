#!/usr/bin/env node

/**
 * Security test script to verify all fixes are working
 *
 * Usage: node scripts/test-security.js
 */

const fs = require('fs')
const path = require('path')

console.log('\n🔒 Security Audit Results\n')
console.log('=' .repeat(50))

let issues = []
let fixes = []

// Test 1: Check for hardcoded credentials
console.log('\n1. Checking for hardcoded credentials...')
const envExample = fs.readFileSync(path.join(__dirname, '..', '.env.example'), 'utf8')
const printfulClient = fs.readFileSync(path.join(__dirname, '..', 'lib', 'printful-client.ts'), 'utf8')

if (envExample.includes('vbrzkAu9dnvIO6AAikezjsczratgW3FWjhDAOuWo') ||
    envExample.includes('17145314')) {
  issues.push('❌ Hardcoded Printful credentials found in .env.example')
} else {
  fixes.push('✅ No hardcoded Printful credentials in .env.example')
}

if (printfulClient.includes('vbrzkAu9dnvIO6AAikezjsczratgW3FWjhDAOuWo') ||
    printfulClient.includes('Token:') && printfulClient.includes('17145314')) {
  issues.push('❌ Hardcoded credentials found in printful-client.ts')
} else {
  fixes.push('✅ No hardcoded credentials in printful-client.ts')
}

// Test 2: Check middleware protection
console.log('\n2. Checking API route protection...')
const middleware = fs.readFileSync(path.join(__dirname, '..', 'middleware.ts'), 'utf8')

if (middleware.includes('/api/admin/:path*')) {
  fixes.push('✅ Admin API routes protected in middleware')
} else {
  issues.push('❌ Admin API routes not protected in middleware')
}

// Test 3: Check for bcrypt password hashing
console.log('\n3. Checking password security...')
const auth = fs.readFileSync(path.join(__dirname, '..', 'lib', 'auth.ts'), 'utf8')

if (auth.includes('bcrypt') && auth.includes('ADMIN_PASSWORD_HASH')) {
  fixes.push('✅ Password hashing with bcrypt implemented')
} else {
  issues.push('❌ Password not properly hashed')
}

if (auth.includes("sameSite: 'strict'")) {
  fixes.push('✅ Cookie security strengthened (sameSite: strict)')
} else {
  issues.push('❌ Cookie security not strengthened')
}

if (auth.includes('maxAge: 60 * 60 * 4') || auth.includes('SESSION_DURATION_HOURS = 4')) {
  fixes.push('✅ Session duration reduced to 4 hours')
} else {
  issues.push('❌ Session duration not reduced')
}

// Test 4: Check for Zod validation
console.log('\n4. Checking input validation...')
const stripeCheckout = fs.readFileSync(path.join(__dirname, '..', 'app', 'api', 'stripe', 'checkout', 'route.ts'), 'utf8')

if (stripeCheckout.includes('import { z } from \'zod\'') &&
    stripeCheckout.includes('checkoutRequestSchema')) {
  fixes.push('✅ Zod validation implemented in Stripe checkout')
} else {
  issues.push('❌ Input validation missing in Stripe checkout')
}

// Test 5: Check product replication validation
console.log('\n5. Checking product replication fix...')
const replicate = fs.readFileSync(path.join(__dirname, '..', 'app', 'api', 'admin', 'products', 'replicate', 'route.ts'), 'utf8')

if (replicate.includes('!products || !Array.isArray(products)')) {
  fixes.push('✅ Product replication crash fixed with validation')
} else {
  issues.push('❌ Product replication validation missing')
}

// Test 6: Check for STRIPE_WEBHOOK_SECRET
console.log('\n6. Checking webhook secret configuration...')
if (envExample.includes('STRIPE_WEBHOOK_SECRET')) {
  fixes.push('✅ STRIPE_WEBHOOK_SECRET added to .env.example')
} else {
  issues.push('❌ STRIPE_WEBHOOK_SECRET missing from .env.example')
}

// Test 7: Check for logger utility
console.log('\n7. Checking logger implementation...')
const loggerExists = fs.existsSync(path.join(__dirname, '..', 'lib', 'logger.ts'))

if (loggerExists) {
  fixes.push('✅ Logger utility created')

  if (stripeCheckout.includes('import logger') && replicate.includes('import logger')) {
    fixes.push('✅ Logger implemented in critical files')
  } else {
    issues.push('⚠️  Logger not fully implemented in all files')
  }
} else {
  issues.push('❌ Logger utility not created')
}

// Summary
console.log('\n' + '=' .repeat(50))
console.log('\n📊 SUMMARY\n')

if (fixes.length > 0) {
  console.log('Fixed Issues:')
  fixes.forEach(fix => console.log('  ' + fix))
}

if (issues.length > 0) {
  console.log('\n⚠️  Remaining Issues:')
  issues.forEach(issue => console.log('  ' + issue))
} else {
  console.log('\n🎉 ALL SECURITY ISSUES FIXED!')
}

console.log('\n' + '=' .repeat(50))
console.log('\n📝 Next Steps:')
console.log('1. Generate a password hash: node scripts/generate-password-hash.js <your-password>')
console.log('2. Add the hash to your .env.local file')
console.log('3. Add your Printful and Stripe credentials to .env.local')
console.log('4. Deploy to production and test all features')
console.log('\n')