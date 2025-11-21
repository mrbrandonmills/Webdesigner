/**
 * Pinterest Pin Creation API
 *
 * Creates a pin on Pinterest using the v5 API.
 * This demonstrates API integration for the Standard Access video.
 *
 * Endpoint: POST /api/pinterest/create-pin
 * Body: {
 *   access_token: string
 *   title: string
 *   description: string
 *   link: string
 *   media_source: { source_type: "image_url", url: string }
 *   board_id: string
 * }
 */

import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

interface CreatePinRequest {
  access_token: string
  title: string
  description: string
  link: string
  media_source: {
    source_type: 'image_url'
    url: string
  }
  board_id: string
}

export async function POST(request: NextRequest) {
  try {
    const body: CreatePinRequest = await request.json()

    const {
      access_token,
      title,
      description,
      link,
      media_source,
      board_id
    } = body

    // Validate required fields
    if (!access_token) {
      return NextResponse.json(
        { error: 'access_token is required' },
        { status: 400 }
      )
    }

    if (!title || !description || !link || !media_source || !board_id) {
      return NextResponse.json(
        { error: 'Missing required fields: title, description, link, media_source, board_id' },
        { status: 400 }
      )
    }

    console.log('[Pinterest] Creating pin...')
    console.log('[Pinterest] Title:', title)
    console.log('[Pinterest] Board ID:', board_id)

    // Create pin using Pinterest v5 API
    // https://developers.pinterest.com/docs/api/v5/#operation/pins/create

    const apiUrl = 'https://api-sandbox.pinterest.com/v5/pins' // Use sandbox for demo

    const pinData = {
      title,
      description,
      link,
      media_source,
      board_id
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(pinData)
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('[Pinterest] Pin creation failed:', data)
      return NextResponse.json(
        {
          error: data.message || 'Pin creation failed',
          details: data
        },
        { status: response.status }
      )
    }

    console.log('[Pinterest] ✓ Pin created successfully!')
    console.log('[Pinterest] Pin ID:', data.id)

    return NextResponse.json({
      success: true,
      pin: {
        id: data.id,
        link: data.link,
        url: `https://pinterest.com/pin/${data.id}`,
        title: data.title,
        description: data.description,
        media: data.media,
        board_id: data.board_id,
        created_at: data.created_at
      }
    })

  } catch (error) {
    console.error('[Pinterest] Unexpected error:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// GET endpoint to fetch available boards
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const access_token = searchParams.get('access_token')

  if (!access_token) {
    return NextResponse.json(
      { error: 'access_token required' },
      { status: 400 }
    )
  }

  try {
    // Fetch user's boards
    const apiUrl = 'https://api-sandbox.pinterest.com/v5/boards'

    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${access_token}`
      }
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || 'Failed to fetch boards' },
        { status: response.status }
      )
    }

    return NextResponse.json({
      success: true,
      boards: data.items || []
    })

  } catch (error) {
    console.error('[Pinterest] Error fetching boards:', error)
    return NextResponse.json(
      { error: 'Failed to fetch boards' },
      { status: 500 }
    )
  }
}
