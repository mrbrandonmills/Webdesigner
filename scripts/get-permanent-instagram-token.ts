#!/usr/bin/env npx tsx
/**
 * Get Permanent Instagram Page Token
 *
 * This script exchanges a short-lived user token for a PERMANENT page token.
 * Page tokens never expire as long as:
 * 1. The app is live (not in development mode)
 * 2. The user remains an admin of the page
 *
 * Run this ONCE to get a permanent token, then update .env.local
 */

import 'dotenv/config'

const APP_ID = process.env.META_APP_ID
const APP_SECRET = process.env.META_APP_SECRET
const PAGE_ID = process.env.FACEBOOK_PAGE_ID

async function getPermamentToken() {
  console.log('='.repeat(60))
  console.log('PERMANENT INSTAGRAM TOKEN GENERATOR')
  console.log('='.repeat(60))

  // Check for required env vars
  if (!APP_ID || !APP_SECRET || !PAGE_ID) {
    console.error('\n❌ Missing required environment variables:')
    if (!APP_ID) console.error('   - META_APP_ID')
    if (!APP_SECRET) console.error('   - META_APP_SECRET')
    if (!PAGE_ID) console.error('   - FACEBOOK_PAGE_ID')
    process.exit(1)
  }

  // Get the current token from command line or env
  const shortLivedToken = process.argv[2] || process.env.INSTAGRAM_ACCESS_TOKEN

  if (!shortLivedToken) {
    console.log('\n📋 STEP 1: Get a short-lived token')
    console.log('   Go to: https://developers.facebook.com/tools/explorer/')
    console.log('   1. Select your app from the dropdown')
    console.log('   2. Click "Generate Access Token"')
    console.log('   3. Grant these permissions:')
    console.log('      - pages_show_list')
    console.log('      - pages_read_engagement')
    console.log('      - instagram_basic')
    console.log('      - instagram_content_publish')
    console.log('      - instagram_manage_insights')
    console.log('   4. Copy the token and run:')
    console.log(`\n   npx tsx scripts/get-permanent-instagram-token.ts "YOUR_TOKEN_HERE"\n`)
    process.exit(1)
  }

  console.log('\n✅ Short-lived token provided')
  console.log(`   Token prefix: ${shortLivedToken.substring(0, 20)}...`)

  // Step 1: Exchange short-lived token for long-lived user token
  console.log('\n📋 STEP 2: Exchanging for long-lived user token...')

  const longLivedUrl = `https://graph.facebook.com/v18.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${APP_ID}&client_secret=${APP_SECRET}&fb_exchange_token=${shortLivedToken}`

  try {
    const longLivedRes = await fetch(longLivedUrl)
    const longLivedData = await longLivedRes.json()

    if (longLivedData.error) {
      console.error('\n❌ Error getting long-lived token:', longLivedData.error.message)
      console.log('\n   This usually means:')
      console.log('   - The token is already expired')
      console.log('   - The token was not generated with the correct app')
      console.log('   - Missing permissions\n')
      process.exit(1)
    }

    const longLivedUserToken = longLivedData.access_token
    console.log('   ✅ Long-lived user token obtained!')
    console.log(`   Expires in: ${Math.round(longLivedData.expires_in / 86400)} days`)

    // Step 2: Get page access token using long-lived user token
    console.log('\n📋 STEP 3: Getting permanent page token...')

    const pageTokenUrl = `https://graph.facebook.com/v18.0/${PAGE_ID}?fields=access_token&access_token=${longLivedUserToken}`

    const pageTokenRes = await fetch(pageTokenUrl)
    const pageTokenData = await pageTokenRes.json()

    if (pageTokenData.error) {
      console.error('\n❌ Error getting page token:', pageTokenData.error.message)
      process.exit(1)
    }

    const permanentPageToken = pageTokenData.access_token

    // Step 3: Verify the token is permanent by checking its debug info
    console.log('\n📋 STEP 4: Verifying token is permanent...')

    const debugUrl = `https://graph.facebook.com/v18.0/debug_token?input_token=${permanentPageToken}&access_token=${APP_ID}|${APP_SECRET}`

    const debugRes = await fetch(debugUrl)
    const debugData = await debugRes.json()

    if (debugData.data) {
      const { expires_at, is_valid, scopes } = debugData.data

      if (expires_at === 0) {
        console.log('   ✅ TOKEN IS PERMANENT (never expires)!')
      } else {
        const expiryDate = new Date(expires_at * 1000)
        console.log(`   ⚠️ Token expires: ${expiryDate.toLocaleString()}`)
      }

      console.log(`   Valid: ${is_valid ? 'Yes' : 'No'}`)
      console.log(`   Scopes: ${scopes?.join(', ') || 'none'}`)
    }

    // Output the token
    console.log('\n' + '='.repeat(60))
    console.log('🎉 SUCCESS! Your permanent page token:')
    console.log('='.repeat(60))
    console.log(`\n${permanentPageToken}\n`)
    console.log('='.repeat(60))

    console.log('\n📝 Update your .env.local file:')
    console.log('   INSTAGRAM_ACCESS_TOKEN=' + permanentPageToken)

    console.log('\n📝 Update Vercel environment variables:')
    console.log('   vercel env rm INSTAGRAM_ACCESS_TOKEN production')
    console.log('   vercel env add INSTAGRAM_ACCESS_TOKEN production')
    console.log('   (paste the token when prompted)\n')

  } catch (error) {
    console.error('\n❌ Network error:', error)
    process.exit(1)
  }
}

getPermamentToken()
