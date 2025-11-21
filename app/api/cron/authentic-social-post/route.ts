/**
 * Authentic Social Post Cron
 * Uses Brandon's voice profile to generate authentic content (not generic marketing)
 * Only posts if Brandon-ness score ≥ 95%
 */

import { NextRequest, NextResponse } from 'next/server'
import { VoiceProfileGenerator } from '@/lib/voice-training/voice-profile-generator'
import { AuthenticContentGenerator, type ContentBrief } from '@/lib/voice-training/authentic-content-generator'
import { PerformanceTracker } from '@/lib/voice-training/performance-tracker'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

const VOICE_PROFILE_PATH = './data/brandon-voice-profile.json'

// Content topics rotation
const contentTopics = [
  {
    type: 'poetry' as const,
    topic: 'Fine Lines poetry - exploring the boundaries between chaos and order',
    category: 'poetry'
  },
  {
    type: 'photography' as const,
    topic: 'Am Reed photography series - sacred geometry meets human form',
    category: 'photography'
  },
  {
    type: 'philosophy' as const,
    topic: 'Self-actualization through art and philosophy',
    category: 'philosophy'
  },
  {
    type: 'product' as const,
    topic: 'Museum-quality prints - Fine Art Trade Guild approved',
    category: 'product'
  }
]

function getTopicForTime(): typeof contentTopics[0] {
  const hour = new Date().getUTCHours()
  const index = Math.floor(hour / 6) % contentTopics.length
  return contentTopics[index]
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    console.log('[Cron] No auth - manual trigger or development')
  }

  const platform = request.nextUrl.searchParams.get('platform') as 'instagram' | 'twitter' | 'pinterest'

  if (!platform || !['instagram', 'twitter', 'pinterest'].includes(platform)) {
    return NextResponse.json({ error: 'Invalid platform' }, { status: 400 })
  }

  console.log(`[Authentic Cron] Starting ${platform} post generation...`)

  try {
    // Load voice profile
    const profileGen = new VoiceProfileGenerator()
    let profile

    try {
      profile = await profileGen.loadProfile(VOICE_PROFILE_PATH)
      console.log(`[Authentic Cron] Loaded voice profile (v${profile.version})`)
    } catch (error) {
      return NextResponse.json({
        success: false,
        error: 'Voice profile not found. Run: npm run train-voice',
        message: 'Brandon voice profile must be generated first by scraping Instagram'
      }, { status: 500 })
    }

    // Generate content
    const topic = getTopicForTime()
    const brief: ContentBrief = {
      type: topic.type,
      topic: topic.topic,
      link: 'https://brandonmills.com/shop',
      targetPlatform: platform
    }

    const contentGen = new AuthenticContentGenerator(profile)
    const post = await contentGen.generateBest(brief)

    if (!post) {
      console.error('[Authentic Cron] ❌ No posts passed 95% Brandon-ness threshold')
      return NextResponse.json({
        success: false,
        message: 'Generated content did not meet 95% authenticity threshold',
        recommendation: 'Voice profile may need retraining'
      }, { status: 200 }) // Don't error - just skip posting
    }

    console.log(`[Authentic Cron] ✓ Generated post: ${post.brandonScore}% Brandon-ness`)

    // Post to platform
    let postId: string | undefined

    switch (platform) {
      case 'instagram':
        postId = await postToInstagram(post.content, post.hashtags)
        break
      case 'twitter':
        postId = await postToTwitter(post.content, post.hashtags)
        break
      case 'pinterest':
        postId = await postToPinterest(post.content)
        break
    }

    if (!postId) {
      throw new Error('Failed to post')
    }

    // Track performance
    const tracker = new PerformanceTracker()
    await tracker.recordPost({
      postId,
      platform,
      content: post.content,
      hashtags: post.hashtags,
      category: topic.category,
      brandonScore: post.brandonScore
    })

    console.log(`[Authentic Cron] ✅ Posted to ${platform}: ${postId}`)

    return NextResponse.json({
      success: true,
      platform,
      postId,
      brandonScore: post.brandonScore,
      category: topic.category,
      preview: post.content.substring(0, 100)
    })

  } catch (error) {
    console.error(`[Authentic Cron] Error:`, error)
    return NextResponse.json({
      success: false,
      platform,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

/**
 * Post to Instagram
 */
async function postToInstagram(content: string, hashtags: string[]): Promise<string | undefined> {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN!
  const accountId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID!

  const caption = `${content}\n\n${hashtags.join(' ')}`

  // For now, use a default image (you'll want to integrate with your design system)
  const imageUrl = 'https://brandonmills.com/og-image.jpg'

  // Create media container
  const createUrl = `https://graph.facebook.com/v18.0/${accountId}/media`
  const createResponse = await fetch(createUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      image_url: imageUrl,
      caption,
      access_token: accessToken
    })
  })

  if (!createResponse.ok) {
    const error = await createResponse.json()
    throw new Error(`Instagram create failed: ${JSON.stringify(error)}`)
  }

  const { id: creationId } = await createResponse.json()

  // Publish
  const publishUrl = `https://graph.facebook.com/v18.0/${accountId}/media_publish`
  const publishResponse = await fetch(publishUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      creation_id: creationId,
      access_token: accessToken
    })
  })

  if (!publishResponse.ok) {
    const error = await publishResponse.json()
    throw new Error(`Instagram publish failed: ${JSON.stringify(error)}`)
  }

  const { id: mediaId } = await publishResponse.json()
  return mediaId
}

/**
 * Post to Twitter
 */
async function postToTwitter(content: string, hashtags: string[]): Promise<string | undefined> {
  const { TwitterApi } = await import('twitter-api-v2')

  const client = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY!,
    appSecret: process.env.TWITTER_API_SECRET!,
    accessToken: process.env.TWITTER_ACCESS_TOKEN!,
    accessSecret: process.env.TWITTER_ACCESS_SECRET!
  })

  const tweet = `${content}\n\n${hashtags.slice(0, 3).join(' ')}`
  const result = await client.v2.tweet(tweet)

  return result.data.id
}

/**
 * Post to Pinterest (simplified)
 */
async function postToPinterest(content: string): Promise<string | undefined> {
  // Pinterest posting logic here
  console.log('[Pinterest] Would post:', content.substring(0, 50))
  return `pinterest-${Date.now()}`
}
