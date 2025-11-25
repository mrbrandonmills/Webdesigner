import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

interface PinPayload {
  accessToken: string
  boardId: string
  title: string
  description: string
  link: string
  media_source: {
    source_type: 'image_url'
    url: string
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<PinPayload>

    const accessToken = body.accessToken
    const boardId = body.boardId

    if (!accessToken || !boardId) {
      return NextResponse.json(
        { error: 'accessToken and boardId are required' },
        { status: 400 }
      )
    }

    const pinPayload: PinPayload = {
      accessToken,
      boardId,
      title: body.title || 'Pinterest Sandbox Approval Demo',
      description:
        body.description ||
        'Created via sandbox API for Standard Access approval walkthrough.',
      link: body.link || 'https://brandonmills.com',
      media_source:
        body.media_source ||
        ({
          source_type: 'image_url',
          url: 'https://brandonmills.com/images/og-image.jpg',
        } as const),
    }

    const useSandbox = process.env.PINTEREST_USE_SANDBOX !== 'false'
    const url = useSandbox
      ? 'https://api-sandbox.pinterest.com/v5/pins'
      : 'https://api.pinterest.com/v5/pins'

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        board_id: pinPayload.boardId,
        title: pinPayload.title,
        description: pinPayload.description,
        link: pinPayload.link,
        media_source: pinPayload.media_source,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || 'Failed to create pin', details: data },
        { status: response.status }
      )
    }

    return NextResponse.json({ pin: data })
  } catch (error) {
    console.error('[Pinterest Approval] Pin creation failed', error)
    return NextResponse.json({ error: 'Unexpected server error' }, { status: 500 })
  }
}
