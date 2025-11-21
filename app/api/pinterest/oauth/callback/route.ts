/**
 * Pinterest OAuth Callback Handler
 *
 * This endpoint receives the authorization code from Pinterest
 * and exchanges it for an access token.
 *
 * Pinterest OAuth flow:
 * 1. User clicks "Connect to Pinterest"
 * 2. Redirected to Pinterest login/authorization
 * 3. Pinterest redirects back here with a code
 * 4. We exchange code for access_token
 * 5. Store token and redirect to success page
 */

import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')
  const error = searchParams.get('error')
  const state = searchParams.get('state')

  // Handle authorization errors
  if (error) {
    return NextResponse.redirect(
      new URL(`/admin/pinterest-demo?error=${error}`, request.url)
    )
  }

  // Validate code exists
  if (!code) {
    return NextResponse.redirect(
      new URL('/admin/pinterest-demo?error=no_code', request.url)
    )
  }

  const appId = process.env.PINTEREST_APP_ID
  const appSecret = process.env.PINTEREST_APP_SECRET
  const redirectUri = process.env.PINTEREST_REDIRECT_URI

  if (!appId || !appSecret || !redirectUri) {
    console.error('[Pinterest OAuth] Missing app credentials')
    return NextResponse.redirect(
      new URL('/admin/pinterest-demo?error=missing_credentials', request.url)
    )
  }

  try {
    // Step 2: Exchange code for access token
    // https://developers.pinterest.com/docs/getting-started/authentication/

    const tokenUrl = 'https://api.pinterest.com/v5/oauth/token'

    // Create Basic Auth header (app_id:app_secret as base64)
    const credentials = Buffer.from(`${appId}:${appSecret}`).toString('base64')

    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirectUri
    })

    console.log('[Pinterest OAuth] Exchanging code for token...')
    console.log('[Pinterest OAuth] Redirect URI:', redirectUri)

    const response = await fetch(tokenUrl, {
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
        new URL(`/admin/pinterest-demo?error=${data.error || 'token_exchange_failed'}`, request.url)
      )
    }

    console.log('[Pinterest OAuth] ✓ Token exchange successful!')

    // Always redirect to public demo page for approval video
    const redirectPath = '/pinterest-demo'

    const successUrl = new URL(redirectPath, request.url)
    successUrl.searchParams.set('success', 'true')
    successUrl.searchParams.set('access_token', data.access_token)
    successUrl.searchParams.set('refresh_token', data.refresh_token || '')
    successUrl.searchParams.set('expires_in', data.expires_in?.toString() || '')

    return NextResponse.redirect(successUrl)

  } catch (error) {
    console.error('[Pinterest OAuth] Unexpected error:', error)
    return NextResponse.redirect(
      new URL('/admin/pinterest-demo?error=server_error', request.url)
    )
  }
}
