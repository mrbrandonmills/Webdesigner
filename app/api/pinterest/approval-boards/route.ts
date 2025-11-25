import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { accessToken } = await request.json()

    if (!accessToken) {
      return NextResponse.json({ error: 'accessToken is required' }, { status: 400 })
    }

    const useSandbox = process.env.PINTEREST_USE_SANDBOX !== 'false'
    const url = useSandbox
      ? 'https://api-sandbox.pinterest.com/v5/boards'
      : 'https://api.pinterest.com/v5/boards'

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || 'Failed to fetch boards', details: data },
        { status: response.status }
      )
    }

    return NextResponse.json({ boards: data.items || [], bookmark: data.bookmark || null })
  } catch (error) {
    console.error('[Pinterest Approval] Boards fetch failed', error)
    return NextResponse.json({ error: 'Unexpected server error' }, { status: 500 })
  }
}
