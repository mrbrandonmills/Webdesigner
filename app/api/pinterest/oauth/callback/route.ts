// app/api/pinterest/oauth/callback/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const error = url.searchParams.get('error')

  const origin = `${url.protocol}//${url.host}`

  // If Pinterest sends ?error=...
  if (error) {
    return NextResponse.redirect(
      `${origin}/pinterest-oauth-demo?error=${encodeURIComponent(error)}`
    )
  }

  if (!code) {
    return NextResponse.redirect(
      `${origin}/pinterest-oauth-demo?error=${encodeURIComponent('missing_code')}`
    )
  }

  const appId =
    process.env.NEXT_PUBLIC_PINTEREST_APP_ID || process.env.PINTEREST_APP_ID
  const appSecret = process.env.PINTEREST_APP_SECRET
  const redirectUri = process.env.PINTEREST_REDIRECT_URI
  const useSandbox = process.env.PINTEREST_USE_SANDBOX !== 'false'

  if (!appId || !appSecret || !redirectUri) {
    console.error('[Pinterest OAuth] Missing env vars', {
      appId: !!appId,
      appSecret: !!appSecret,
      redirectUri: !!redirectUri,
    })
    return NextResponse.redirect(
      `${origin}/pinterest-oauth-demo?error=${encodeURIComponent(
        'server_misconfigured'
      )}`
    )
  }

  const tokenUrl = useSandbox
    ? 'https://api-sandbox.pinterest.com/v5/oauth/token'
    : 'https://api.pinterest.com/v5/oauth/token'

  // 🔑 THIS is the make-or-break part:
  // client_id + client_secret MUST be in the x-www-form-urlencoded body
  // Pinterest expects Basic auth header and a minimal form body
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectUri,
  })

  const credentials = Buffer.from(`${appId}:${appSecret}`).toString('base64')

  console.log('[Pinterest OAuth] Exchanging code for token', {
    tokenUrl,
    redirectUri,
  })

  let resp: Response
  try {
    resp = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    })
  } catch (e) {
    console.error('[Pinterest OAuth] Network error', e)
    return NextResponse.redirect(
      `${origin}/pinterest-oauth-demo?error=${encodeURIComponent(
        'network_error'
      )}`
    )
  }

  let data: any = {}
  try {
    data = await resp.json()
  } catch (e) {
    console.error('[Pinterest OAuth] Failed to parse JSON', e)
  }

  if (!resp.ok) {
    console.error(
      '[Pinterest OAuth] Token exchange FAILED',
      resp.status,
      JSON.stringify(data, null, 2)
    )

    const detail =
      data?.error_description || data?.message || data?.error || 'Authentication failed'

    return NextResponse.redirect(
      `${origin}/pinterest-oauth-demo?error=${encodeURIComponent(detail)}`
    )
  }

  console.log(
    '[Pinterest OAuth] Token exchange SUCCESS',
    JSON.stringify(
      {
        ...data,
        access_token: data?.access_token ? '***redacted***' : undefined,
      },
      null,
      2
    )
  )

  const { access_token, refresh_token, expires_in } = data

  const redirect = new URL('/pinterest-oauth-demo', origin)
  redirect.searchParams.set('success', 'true')
  if (access_token) redirect.searchParams.set('access_token', access_token)
  if (refresh_token) redirect.searchParams.set('refresh_token', refresh_token)
  if (expires_in) redirect.searchParams.set('expires_in', String(expires_in))

  return NextResponse.redirect(redirect.toString())
}
