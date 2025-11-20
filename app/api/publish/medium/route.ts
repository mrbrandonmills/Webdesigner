import { NextResponse } from 'next/server'
import { logger } from '@/lib/logger'

export const runtime = 'nodejs'
export const maxDuration = 60

interface MediumPublishRequest {
  title: string
  content: string // Markdown or HTML
  tags?: string[]
  canonicalUrl?: string
  publishStatus?: 'public' | 'draft' | 'unlisted'
}

/**
 * Publish essay to Medium
 *
 * Medium API Documentation: https://github.com/Medium/medium-api-docs
 *
 * Setup required:
 * 1. Get integration token from https://medium.com/me/settings/security
 * 2. Add MEDIUM_ACCESS_TOKEN to .env.local
 * 3. Add MEDIUM_AUTHOR_ID to .env.local (get from /v1/me endpoint)
 */
export async function POST(request: Request) {
  try {
    const { title, content, tags = [], canonicalUrl, publishStatus = 'draft' } = await request.json() as MediumPublishRequest

    const mediumAccessToken = process.env.MEDIUM_ACCESS_TOKEN
    const mediumAuthorId = process.env.MEDIUM_AUTHOR_ID

    if (!mediumAccessToken || !mediumAuthorId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Medium API credentials not configured',
          setup: 'Add MEDIUM_ACCESS_TOKEN and MEDIUM_AUTHOR_ID to .env.local',
        },
        { status: 500 }
      )
    }

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      )
    }

    logger.info('Log message', { template: `Publishing to Medium: "${title}"` })

    // Publish to Medium
    const mediumResponse = await fetch(
      `https://api.medium.com/v1/users/${mediumAuthorId}/posts`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${mediumAccessToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          title,
          contentFormat: 'markdown', // or 'html'
          content,
          tags: tags.slice(0, 5), // Medium allows max 5 tags
          publishStatus, // 'public', 'draft', or 'unlisted'
          canonicalUrl, // Link back to your site
        }),
      }
    )

    if (!mediumResponse.ok) {
      const errorText = await mediumResponse.text()
      logger.error('Medium API error:', errorText)
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to publish to Medium',
          details: errorText,
        },
        { status: mediumResponse.status }
      )
    }

    const mediumData = await mediumResponse.json()

    logger.info('Published to Medium:', { data: mediumData.data.url })

    return NextResponse.json({
      success: true,
      url: mediumData.data.url,
      id: mediumData.data.id,
      publishStatus: mediumData.data.publishStatus,
      message: `Successfully published to Medium: ${mediumData.data.url}`,
    })
  } catch (error) {
    logger.error('Medium publish error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Publish failed',
      },
      { status: 500 }
    )
  }
}

/**
 * Get Medium user info (for setup)
 */
export async function GET() {
  try {
    const mediumAccessToken = process.env.MEDIUM_ACCESS_TOKEN

    if (!mediumAccessToken) {
      return NextResponse.json(
        {
          error: 'MEDIUM_ACCESS_TOKEN not configured',
          setup: 'Get your integration token from https://medium.com/me/settings/security',
        },
        { status: 500 }
      )
    }

    const response = await fetch('https://api.medium.com/v1/me', {
      headers: {
        'Authorization': `Bearer ${mediumAccessToken}`,
        'Accept': 'application/json',
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json(
        { error: 'Failed to fetch Medium user info', details: errorText },
        { status: response.status }
      )
    }

    const data = await response.json()

    return NextResponse.json({
      success: true,
      user: data.data,
      message: `Save this ID to .env.local as MEDIUM_AUTHOR_ID: ${data.data.id}`,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get user info',
      },
      { status: 500 }
    )
  }
}
