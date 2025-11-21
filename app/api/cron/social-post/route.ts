import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

// Content pool for social posts - rotates through these
const contentPool = [
  {
    type: 'poetry',
    text: 'New poetry collection "Fine Lines" explores the boundaries between chaos and order. Available now.',
    link: 'https://brandonmills.com/shop',
    hashtags: '#poetry #literature #contemporarypoetry #brandonmills'
  },
  {
    type: 'photography',
    text: 'Sacred geometry meets photography. Museum-quality prints now available.',
    link: 'https://brandonmills.com/shop',
    hashtags: '#sacredgeometry #photography #artprints #luxuryart'
  },
  {
    type: 'philosophy',
    text: 'Self-actualization through art and philosophy. Explore the collection.',
    link: 'https://brandonmills.com/shop',
    hashtags: '#philosophy #selfactualization #mindfulness #brandonmills'
  },
  {
    type: 'merchandise',
    text: 'Premium merchandise featuring original designs. Limited edition pieces.',
    link: 'https://brandonmills.com/shop',
    hashtags: '#merchandise #limitededition #premiumquality #artmerch'
  }
]

// Get content based on time of day for variety
function getContent() {
  const hour = new Date().getUTCHours()
  const index = Math.floor(hour / 6) % contentPool.length
  return contentPool[index]
}

export async function GET(request: NextRequest) {
  // Verify cron secret (Vercel adds this automatically for cron jobs)
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    // Allow without auth for manual testing, but log it
    console.log('[Cron] No auth header - manual trigger or development')
  }

  const platform = request.nextUrl.searchParams.get('platform')
  const content = getContent()

  console.log(`[Cron] Social post triggered for: ${platform}`)
  console.log(`[Cron] Content type: ${content.type}`)

  try {
    switch (platform) {
      case 'twitter':
        return await postToTwitter(content)
      case 'pinterest':
        return await postToPinterest(content)
      case 'instagram':
        return await postToInstagram(content)
      default:
        return NextResponse.json({ error: 'Invalid platform' }, { status: 400 })
    }
  } catch (error) {
    console.error(`[Cron] Error posting to ${platform}:`, error)
    return NextResponse.json({
      success: false,
      platform,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// Twitter posting using OAuth 1.0a
async function postToTwitter(content: typeof contentPool[0]) {
  const { TwitterApi } = await import('twitter-api-v2')

  const client = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY!,
    appSecret: process.env.TWITTER_API_SECRET!,
    accessToken: process.env.TWITTER_ACCESS_TOKEN!,
    accessSecret: process.env.TWITTER_ACCESS_SECRET!,
  })

  const tweet = `${content.text}\n\n${content.link}\n\n${content.hashtags}`

  const result = await client.v2.tweet(tweet)

  console.log(`[Twitter] Posted tweet ID: ${result.data.id}`)

  return NextResponse.json({
    success: true,
    platform: 'twitter',
    postId: result.data.id,
    message: 'Tweet posted successfully'
  })
}

// Pinterest posting
async function postToPinterest(content: typeof contentPool[0]) {
  const token = process.env.PINTEREST_ACCESS_TOKEN
  const boardId = process.env.PINTEREST_BOARD_ID

  if (!token || !boardId) {
    throw new Error('Pinterest credentials not configured')
  }

  // Get a random product image
  const productImages = [
    'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80',
    'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80'
  ]
  const imageUrl = productImages[Math.floor(Math.random() * productImages.length)]

  const res = await fetch('https://api.pinterest.com/v5/pins', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      board_id: boardId,
      title: content.text.substring(0, 100),
      description: `${content.text} ${content.hashtags}`,
      link: content.link,
      media_source: {
        source_type: 'image_url',
        url: imageUrl
      }
    })
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || `Pinterest API error: ${res.status}`)
  }

  const result = await res.json()
  console.log(`[Pinterest] Created pin ID: ${result.id}`)

  return NextResponse.json({
    success: true,
    platform: 'pinterest',
    postId: result.id,
    message: 'Pin created successfully'
  })
}

// Instagram posting via Meta Graph API
async function postToInstagram(content: typeof contentPool[0]) {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN
  const igAccountId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID

  if (!token || !igAccountId) {
    throw new Error('Instagram credentials not configured')
  }

  // Get a product image
  const productImages = [
    'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=1080&q=80',
    'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1080&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1080&q=80'
  ]
  const imageUrl = productImages[Math.floor(Math.random() * productImages.length)]

  // Step 1: Create media container
  const createRes = await fetch(
    `https://graph.facebook.com/v18.0/${igAccountId}/media`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image_url: imageUrl,
        caption: `${content.text}\n\n${content.hashtags}\n\nLink in bio: ${content.link}`,
        access_token: token
      })
    }
  )

  if (!createRes.ok) {
    const error = await createRes.json()
    throw new Error(error.error?.message || `Instagram API error: ${createRes.status}`)
  }

  const { id: containerId } = await createRes.json()

  // Step 2: Publish the container
  const publishRes = await fetch(
    `https://graph.facebook.com/v18.0/${igAccountId}/media_publish`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        creation_id: containerId,
        access_token: token
      })
    }
  )

  if (!publishRes.ok) {
    const error = await publishRes.json()
    throw new Error(error.error?.message || `Instagram publish error: ${publishRes.status}`)
  }

  const { id: mediaId } = await publishRes.json()
  console.log(`[Instagram] Published post ID: ${mediaId}`)

  return NextResponse.json({
    success: true,
    platform: 'instagram',
    postId: mediaId,
    message: 'Instagram post published successfully'
  })
}
