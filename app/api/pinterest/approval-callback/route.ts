import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const error = url.searchParams.get('error')
  const origin = `${url.protocol}//${url.host}`

  if (error) {
    return NextResponse.redirect(
      `${origin}/pinterest-approval-demo?error=${encodeURIComponent(error)}`
    )
  }

  if (!code) {
    return NextResponse.redirect(
      `${origin}/pinterest-approval-demo?error=${encodeURIComponent('missing_code')}`
    )
  }

  const appId =
    process.env.NEXT_PUBLIC_PINTEREST_APP_ID || process.env.PINTEREST_APP_ID
  const appSecret = process.env.PINTEREST_APP_SECRET
  const redirectUri =
    process.env.PINTEREST_APPROVAL_REDIRECT_URI ||
    process.env.PINTEREST_REDIRECT_URI ||
    'https://brandonmills.com/api/pinterest/approval-callback'
  const useSandbox = process.env.PINTEREST_USE_SANDBOX !== 'false'

  if (!appId || !appSecret || !redirectUri) {
    console.error('[Pinterest Approval] Missing env vars for token exchange')
    return NextResponse.redirect(
      `${origin}/pinterest-approval-demo?error=${encodeURIComponent('server_misconfigured')}`
    )
  }

  const tokenUrl = useSandbox
    ? 'https://api-sandbox.pinterest.com/v5/oauth/token'
    : 'https://api.pinterest.com/v5/oauth/token'

  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectUri,
  })

  const credentials = Buffer.from(`${appId}:${appSecret}`).toString('base64')

  let response: Response
  try {
    response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    })
  } catch (err) {
    console.error('[Pinterest Approval] Network error', err)
    return NextResponse.redirect(
      `${origin}/pinterest-approval-demo?error=${encodeURIComponent('network_error')}`
    )
  }

  let data: any = {}
  try {
    data = await response.json()
  } catch (err) {
    console.error('[Pinterest Approval] Failed to parse token response', err)
  }

  if (!response.ok) {
    console.error('[Pinterest Approval] Token exchange failed', response.status, data)
    const detail =
      data?.error_description || data?.message || data?.error || 'Authentication failed'
    return NextResponse.redirect(
      `${origin}/pinterest-approval-demo?error=${encodeURIComponent(detail)}`
    )
  }

  console.log(
    '[Pinterest Approval] Token exchange success',
    JSON.stringify(
      {
        ...data,
        access_token: data?.access_token ? '***redacted***' : undefined,
      },
      null,
      2
    )
  )

  const redirect = new URL('/pinterest-approval-demo', origin)
  redirect.searchParams.set('success', '1')
  if (data.access_token) redirect.searchParams.set('access_token', data.access_token)
  if (data.expires_in) redirect.searchParams.set('expires_in', String(data.expires_in))

  return NextResponse.redirect(redirect.toString())
}
