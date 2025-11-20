/**
 * Pinterest Token Refresh
 *
 * Refreshes the access token using the refresh token.
 *
 * Usage: npx tsx scripts/automation/pinterest-refresh-token.ts
 */

import { config } from 'dotenv'
import * as path from 'path'

config({ path: path.join(process.cwd(), '.env.local') })

const CLIENT_ID = '1537033'
const CLIENT_SECRET = '5622572870c8bb2d30afd94394ef5db31196f78c'

async function refreshToken() {
  console.log('\n🔄 Pinterest Token Refresh\n')

  const refreshToken = process.env.PINTEREST_REFRESH_TOKEN

  if (!refreshToken) {
    console.error('❌ PINTEREST_REFRESH_TOKEN not set in .env.local')
    process.exit(1)
  }

  console.log('Refresh token found, exchanging for new access token...\n')

  const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')

  try {
    const response = await fetch('https://api.pinterest.com/v5/oauth/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `grant_type=refresh_token&refresh_token=${encodeURIComponent(refreshToken)}`
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('❌ Token refresh failed:', response.status)
      console.error(error)
      process.exit(1)
    }

    const tokens = await response.json()

    console.log('✅ New tokens received!\n')
    console.log('Update your .env.local with:\n')
    console.log(`PINTEREST_ACCESS_TOKEN=${tokens.access_token}`)
    if (tokens.refresh_token) {
      console.log(`PINTEREST_REFRESH_TOKEN=${tokens.refresh_token}`)
    }
    console.log('')

    // Test the new token
    console.log('Testing new token...')
    const testResponse = await fetch('https://api.pinterest.com/v5/user_account', {
      headers: {
        'Authorization': `Bearer ${tokens.access_token}`
      }
    })

    if (testResponse.ok) {
      const user = await testResponse.json()
      console.log(`✅ Token works! Logged in as: ${user.username || user.id}`)
    } else {
      console.log('⚠️ Token received but test failed')
    }

  } catch (error: any) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

refreshToken()
