/**
 * Pinterest OAuth Callback - Localhost Version
 * Matches registered URI: http://localhost:8889/callback
 */

import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  if (error) {
    return NextResponse.redirect(
      new URL(`/pinterest-demo?error=${error}`, request.url)
    )
  }

  if (!code) {
    return NextResponse.redirect(
      new URL('/pinterest-demo?error=no_code', request.url)
    )
  }

  const appId = process.env.PINTEREST_APP_ID || '1537033'
  const appSecret = process.env.PINTEREST_APP_SECRET || '5622572870c8bb2d30afd94394ef5db31196f78c'

  // Use localhost redirect for local development
  const isLocalhost = request.url.includes('localhost')
  const redirectUri = isLocalhost
    ? 'http://localhost:8889/callback'
    : 'https://brandonmills.com/api/pinterest/oauth/callback'

  try {
    const credentials = Buffer.from(`${appId}:${appSecret}`).toString('base64')

    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirectUri
    })

    console.log('[Pinterest OAuth] Exchanging code for token...')
    console.log('[Pinterest OAuth] Redirect URI:', redirectUri)

    const response = await fetch('https://api.pinterest.com/v5/oauth/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: body.toString()
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('[Pinterest OAuth] Token exchange failed:', data)
      return NextResponse.redirect(
        new URL(`/pinterest-demo?error=${data.error || 'token_exchange_failed'}`, request.url)
      )
    }

    console.log('[Pinterest OAuth] ✓ Token exchange successful!')

    const successUrl = new URL('/pinterest-demo', request.url)
    successUrl.searchParams.set('success', 'true')
    successUrl.searchParams.set('access_token', data.access_token)
    successUrl.searchParams.set('refresh_token', data.refresh_token || '')
    successUrl.searchParams.set('expires_in', data.expires_in?.toString() || '')

    return NextResponse.redirect(successUrl)

  } catch (error) {
    console.error('[Pinterest OAuth] Unexpected error:', error)
    return NextResponse.redirect(
      new URL('/pinterest-demo?error=server_error', request.url)
    )
  }
}
