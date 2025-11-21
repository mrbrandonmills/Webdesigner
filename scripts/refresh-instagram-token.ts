#!/usr/bin/env tsx
/**
 * Refresh Instagram Access Token
 * Gets a fresh PAGE token (not user token) that doesn't expire
 */

import { config } from 'dotenv'
config({ path: '.env.local' })

const FACEBOOK_PAGE_ID = process.env.FACEBOOK_PAGE_ID!
const INSTAGRAM_ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN! // Current (expired) token

async function refreshToken() {
  console.log('🔄 INSTAGRAM TOKEN REFRESH')
  console.log('==========================\n')

  if (!FACEBOOK_PAGE_ID) {
    console.error('❌ FACEBOOK_PAGE_ID not found in .env.local')
    console.error('   Get it from: https://developers.facebook.com/apps')
    process.exit(1)
  }

  console.log(`Facebook Page ID: ${FACEBOOK_PAGE_ID}`)
  console.log(`Current token: ${INSTAGRAM_ACCESS_TOKEN.substring(0, 20)}...\n`)

  console.log('To get a fresh PAGE token:')
  console.log('===========================\n')

  console.log('1. Go to: https://developers.facebook.com/tools/explorer')
  console.log('2. Select your app: "Dopamills"')
  console.log('3. Click "Generate Access Token"')
  console.log('4. Select ALL permissions when prompted')
  console.log('5. Copy the token\n')

  console.log('6. Get PAGE token (permanent):')
  console.log(`   https://graph.facebook.com/v18.0/${FACEBOOK_PAGE_ID}?fields=access_token&access_token=YOUR_TOKEN_HERE\n`)

  console.log('7. Copy the "access_token" from response')
  console.log('8. Update .env.local:')
  console.log('   INSTAGRAM_ACCESS_TOKEN=<paste_new_token_here>\n')

  console.log('Then redeploy to Vercel:')
  console.log('   vercel env add INSTAGRAM_ACCESS_TOKEN')
  console.log('   (paste new token when prompted)')
}

refreshToken()
