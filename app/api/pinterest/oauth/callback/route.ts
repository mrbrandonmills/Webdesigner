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
      new URL(`/pinterest-oauth-demo?error=${error}`, request.url)
    )
  }

  // Validate code exists
  if (!code) {
    return NextResponse.redirect(
      new URL('/pinterest-oauth-demo?error=no_code', request.url)
    )
  }

  const appId = process.env.PINTEREST_APP_ID
  const appSecret = process.env.PINTEREST_APP_SECRET
  const redirectUri = process.env.PINTEREST_REDIRECT_URI

  if (!appId || !appSecret || !redirectUri) {
    console.error('[Pinterest OAuth] Missing app credentials')
    return NextResponse.redirect(
      new URL('/pinterest-oauth-demo?error=missing_credentials', request.url)
    )
  }

  try {
    // Step 2: Exchange code for access token
    // https://developers.pinterest.com/docs/getting-started/authentication/

    // Use SANDBOX OAuth endpoint for trial access
    // Trial access requires: https://api-sandbox.pinterest.com/v5/oauth/token
    const useSandbox = process.env.PINTEREST_USE_SANDBOX !== 'false'
    const tokenUrl = useSandbox
      ? 'https://api-sandbox.pinterest.com/v5/oauth/token'
      : 'https://api.pinterest.com/v5/oauth/token'

    console.log('[Pinterest OAuth] Using token endpoint:', tokenUrl)

    // Create Basic Auth header (app_id:app_secret as base64)
    const credentials = Buffer.from(`${appId}:${appSecret}`).toString('base64')

    // Pinterest requires client_id and client_secret in body IN ADDITION to Basic Auth
    // This is undocumented but required - without it you get "Authentication failed"
    // See: https://stackoverflow.com/questions/73920854
    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirectUri,
      client_id: appId,
      client_secret: appSecret
    })

    console.log('[Pinterest OAuth] Exchanging code for token...')
    console.log('[Pinterest OAuth] App ID:', appId)
    console.log('[Pinterest OAuth] App Secret (first 10 chars):', appSecret?.substring(0, 10))
    console.log('[Pinterest OAuth] Redirect URI:', redirectUri)
    console.log('[Pinterest OAuth] Code (first 20 chars):', code?.substring(0, 20))
    console.log('[Pinterest OAuth] Request body:', body.toString())

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
      console.error('[Pinterest OAuth] Token exchange failed!')
      console.error('[Pinterest OAuth] Status:', response.status)
      console.error('[Pinterest OAuth] Response:', JSON.stringify(data, null, 2))
      const errorDetail = data.error_description || data.message || data.error || 'token_exchange_failed'
      return NextResponse.redirect(
        new URL(`/pinterest-oauth-demo?error=${encodeURIComponent(errorDetail)}`, request.url)
      )
    }

    console.log('[Pinterest OAuth] ✓ Token exchange successful!')

    // Redirect to public OAuth demo page for approval video
    const redirectPath = '/pinterest-oauth-demo'

    const successUrl = new URL(redirectPath, request.url)
    successUrl.searchParams.set('success', 'true')
    successUrl.searchParams.set('access_token', data.access_token)
    successUrl.searchParams.set('refresh_token', data.refresh_token || '')
    successUrl.searchParams.set('expires_in', data.expires_in?.toString() || '')

    return NextResponse.redirect(successUrl)

  } catch (error) {
    console.error('[Pinterest OAuth] Unexpected error:', error)
    return NextResponse.redirect(
      new URL('/pinterest-oauth-demo?error=server_error', request.url)
    )
  }
}
