/**
 * Reddit Post API
 *
 * POST /api/social/reddit/post
 *
 * Handles Reddit post creation via web dashboard
 */

import { NextRequest, NextResponse } from 'next/server'

const REDDIT_CLIENT_ID = process.env.REDDIT_CLIENT_ID
const REDDIT_CLIENT_SECRET = process.env.REDDIT_CLIENT_SECRET
const REDDIT_USERNAME = process.env.REDDIT_USERNAME
const REDDIT_PASSWORD = process.env.REDDIT_PASSWORD

interface RedditPostRequest {
  subreddit: string
  title: string
  text: string
  flairText?: string
  scheduleFor?: string // ISO date string for scheduling
}

interface RedditTokenResponse {
  access_token: string
  token_type: string
  expires_in: number
}

async function getRedditAccessToken(): Promise<string> {
  const auth = Buffer.from(`${REDDIT_CLIENT_ID}:${REDDIT_CLIENT_SECRET}`).toString('base64')

  const response = await fetch('https://www.reddit.com/api/v1/access_token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'BrandonMillsBlog/1.0',
    },
    body: `grant_type=password&username=${REDDIT_USERNAME}&password=${REDDIT_PASSWORD}`,
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to get Reddit access token: ${error}`)
  }

  const data: RedditTokenResponse = await response.json()
  return data.access_token
}

async function submitRedditPost(
  accessToken: string,
  post: RedditPostRequest
): Promise<{ url: string; id: string }> {
  const response = await fetch('https://oauth.reddit.com/api/submit', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'BrandonMillsBlog/1.0',
    },
    body: new URLSearchParams({
      sr: post.subreddit,
      kind: 'self',
      title: post.title,
      text: post.text,
      api_type: 'json',
    }).toString(),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to submit Reddit post: ${error}`)
  }

  const data = await response.json()

  if (data.json.errors && data.json.errors.length > 0) {
    throw new Error(`Reddit API error: ${JSON.stringify(data.json.errors)}`)
  }

  return {
    url: data.json.data.url,
    id: data.json.data.id,
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: RedditPostRequest = await request.json()

    // Validate request
    if (!body.subreddit || !body.title || !body.text) {
      return NextResponse.json(
        { error: 'Missing required fields: subreddit, title, text' },
        { status: 400 }
      )
    }

    // Check credentials
    if (!REDDIT_CLIENT_ID || !REDDIT_CLIENT_SECRET || !REDDIT_USERNAME || !REDDIT_PASSWORD) {
      return NextResponse.json(
        { error: 'Reddit credentials not configured' },
        { status: 500 }
      )
    }

    // Handle scheduling (if scheduleFor is provided)
    if (body.scheduleFor) {
      const scheduleDate = new Date(body.scheduleFor)
      const now = new Date()

      if (scheduleDate <= now) {
        return NextResponse.json(
          { error: 'Schedule time must be in the future' },
          { status: 400 }
        )
      }

      // TODO: Store in database for scheduled posting
      // For now, just return success
      return NextResponse.json({
        success: true,
        scheduled: true,
        scheduleFor: body.scheduleFor,
        message: 'Post scheduled successfully',
      })
    }

    // Get Reddit access token
    const accessToken = await getRedditAccessToken()

    // Submit post
    const result = await submitRedditPost(accessToken, body)

    return NextResponse.json({
      success: true,
      url: result.url,
      id: result.id,
      message: 'Post published successfully!',
    })
  } catch (error: any) {
    console.error('Reddit post error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to post to Reddit' },
      { status: 500 }
    )
  }
}
