#!/usr/bin/env npx tsx
/**
 * Instagram Token Diagnostic Tool
 *
 * Checks:
 * 1. Token validity and type
 * 2. Expiration time
 * 3. App mode (development vs live)
 * 4. Permissions granted
 * 5. Why token might be expiring prematurely
 */

import 'dotenv/config'

const token = process.env.INSTAGRAM_ACCESS_TOKEN
const appId = process.env.META_APP_ID
const appSecret = process.env.META_APP_SECRET
const igAccountId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID
const pageId = process.env.FACEBOOK_PAGE_ID

console.log('='.repeat(60))
console.log('INSTAGRAM TOKEN DIAGNOSTIC')
console.log('='.repeat(60))

async function diagnose() {
  // 1. Check if credentials exist
  console.log('\n1. CREDENTIAL CHECK')
  console.log('-------------------')
  console.log(`   META_APP_ID: ${appId ? '✅ Set' : '❌ Missing'}`)
  console.log(`   META_APP_SECRET: ${appSecret ? '✅ Set' : '❌ Missing'}`)
  console.log(`   INSTAGRAM_ACCESS_TOKEN: ${token ? '✅ Set (' + token.substring(0, 15) + '...)' : '❌ Missing'}`)
  console.log(`   INSTAGRAM_BUSINESS_ACCOUNT_ID: ${igAccountId ? '✅ ' + igAccountId : '❌ Missing'}`)
  console.log(`   FACEBOOK_PAGE_ID: ${pageId ? '✅ ' + pageId : '❌ Missing'}`)

  if (!token || !appId || !appSecret) {
    console.log('\n❌ Missing required credentials. Cannot continue.')
    return
  }

  // 2. Debug token
  console.log('\n2. TOKEN ANALYSIS')
  console.log('-----------------')

  try {
    const debugUrl = `https://graph.facebook.com/v18.0/debug_token?input_token=${token}&access_token=${appId}|${appSecret}`
    const debugRes = await fetch(debugUrl)
    const debugData = await debugRes.json()

    if (debugData.error) {
      console.log(`   ❌ Error: ${debugData.error.message}`)
      return
    }

    const data = debugData.data
    console.log(`   Valid: ${data.is_valid ? '✅ Yes' : '❌ No'}`)
    console.log(`   App ID: ${data.app_id}`)
    console.log(`   User ID: ${data.user_id}`)
    console.log(`   Type: ${data.type}`)

    // Check token type - this is CRITICAL
    if (data.type === 'USER') {
      console.log('\n   ⚠️  WARNING: This is a USER token, NOT a PAGE token!')
      console.log('   User tokens expire. Page tokens should be permanent.')
      console.log('   You need to exchange this for a page access token.')
    } else if (data.type === 'PAGE') {
      console.log('\n   ✅ This is a PAGE token (good!)')
    }

    // Check expiration
    if (data.expires_at === 0) {
      console.log('   Expires: ✅ NEVER (permanent token)')
    } else {
      const expiresAt = new Date(data.expires_at * 1000)
      const now = new Date()
      const hoursRemaining = Math.round((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60))

      if (expiresAt < now) {
        console.log(`   Expires: ❌ ALREADY EXPIRED at ${expiresAt.toLocaleString()}`)
      } else {
        console.log(`   Expires: ⚠️  ${expiresAt.toLocaleString()} (${hoursRemaining} hours remaining)`)
      }
    }

    // Check scopes
    console.log(`\n   Scopes granted:`)
    if (data.scopes) {
      data.scopes.forEach((scope: string) => {
        const required = ['instagram_basic', 'instagram_content_publish', 'pages_show_list', 'pages_read_engagement']
        const isRequired = required.includes(scope)
        console.log(`      ${isRequired ? '✅' : '•'} ${scope}`)
      })

      // Check for missing required scopes
      const requiredScopes = ['instagram_basic', 'instagram_content_publish', 'pages_show_list', 'pages_read_engagement']
      const missing = requiredScopes.filter(s => !data.scopes.includes(s))
      if (missing.length > 0) {
        console.log(`\n   ⚠️  Missing required scopes: ${missing.join(', ')}`)
      }
    }

    // 3. Check app mode
    console.log('\n3. APP STATUS')
    console.log('-------------')

    // Get app info
    const appUrl = `https://graph.facebook.com/v18.0/${appId}?access_token=${appId}|${appSecret}`
    const appRes = await fetch(appUrl)
    const appData = await appRes.json()

    if (appData.error) {
      console.log(`   Cannot check app: ${appData.error.message}`)
    } else {
      console.log(`   App Name: ${appData.name || 'Unknown'}`)
      console.log(`   App Link: ${appData.link || 'N/A'}`)
    }

    // 4. Test actual posting capability
    console.log('\n4. POSTING CAPABILITY TEST')
    console.log('--------------------------')

    if (igAccountId && data.is_valid) {
      // Just check if we can get account info (don't actually post)
      const accountUrl = `https://graph.facebook.com/v18.0/${igAccountId}?fields=username,followers_count,media_count&access_token=${token}`
      const accountRes = await fetch(accountUrl)
      const accountData = await accountRes.json()

      if (accountData.error) {
        console.log(`   ❌ Cannot access account: ${accountData.error.message}`)
      } else {
        console.log(`   ✅ Can access account: @${accountData.username}`)
        console.log(`   Followers: ${accountData.followers_count?.toLocaleString() || 'N/A'}`)
        console.log(`   Posts: ${accountData.media_count?.toLocaleString() || 'N/A'}`)
      }
    }

    // 5. ROOT CAUSE ANALYSIS
    console.log('\n5. ROOT CAUSE ANALYSIS')
    console.log('----------------------')

    if (!data.is_valid) {
      console.log('   ❌ Token is INVALID')
      console.log('\n   Possible causes:')
      console.log('   1. User changed their Facebook password')
      console.log('   2. User revoked app permissions')
      console.log('   3. App was put in development mode')
      console.log('   4. Token was a short-lived token that expired')
      console.log('\n   Solution:')
      console.log('   Run: npx tsx scripts/get-permanent-instagram-token.ts')
    } else if (data.type === 'USER' && data.expires_at !== 0) {
      console.log('   ⚠️  You have a USER token that WILL expire')
      console.log('\n   This is the problem!')
      console.log('   User tokens expire. You need a PAGE token.')
      console.log('\n   Solution:')
      console.log('   Run: npx tsx scripts/get-permanent-instagram-token.ts "YOUR_CURRENT_TOKEN"')
      console.log('   This will exchange it for a permanent page token.')
    } else if (data.expires_at !== 0) {
      console.log('   ⚠️  Token has expiration date set')
      console.log('   Even page tokens can expire if the app is in development mode.')
      console.log('\n   Check:')
      console.log('   1. Go to https://developers.facebook.com/apps/')
      console.log('   2. Select your app')
      console.log('   3. Check if app is in "Development" or "Live" mode')
      console.log('   4. Live mode is required for permanent tokens')
    } else {
      console.log('   ✅ Token appears to be permanent')
      console.log('   If it\'s still expiring, check:')
      console.log('   1. The .env.local and Vercel env vars are in sync')
      console.log('   2. No old deployments using old tokens')
    }

    // 6. RECOMMENDATIONS
    console.log('\n' + '='.repeat(60))
    console.log('RECOMMENDATIONS')
    console.log('='.repeat(60))

    if (data.is_valid && data.expires_at === 0 && data.type === 'PAGE') {
      console.log('\n✅ Your token looks good! No action needed.')
      console.log('\nIf posts are still failing, the issue might be:')
      console.log('   1. Vercel env vars not updated (re-deploy)')
      console.log('   2. Rate limiting (max 25 posts/day)')
      console.log('   3. Content policy violation')
    } else {
      console.log('\n🔧 TO FIX:')
      console.log('   1. Go to https://developers.facebook.com/tools/explorer/')
      console.log('   2. Select your app')
      console.log('   3. Generate NEW token with permissions:')
      console.log('      - pages_show_list')
      console.log('      - pages_read_engagement')
      console.log('      - instagram_basic')
      console.log('      - instagram_content_publish')
      console.log('   4. Run: npx tsx scripts/get-permanent-instagram-token.ts "NEW_TOKEN"')
      console.log('   5. Update .env.local with the output')
      console.log('   6. Update Vercel: vercel env rm/add INSTAGRAM_ACCESS_TOKEN')
      console.log('   7. Re-deploy: vercel --prod')
    }

  } catch (error) {
    console.error('\n❌ Diagnostic error:', error)
  }
}

diagnose()
