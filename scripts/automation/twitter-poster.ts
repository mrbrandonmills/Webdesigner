/**
 * Twitter Auto-Poster
 *
 * Automatically posts tweets to Twitter on a schedule
 * Uses Twitter API v2 with OAuth 1.0a authentication
 * - Posts daily tweets about dream analysis, archetypes
 * - Includes links to tools
 * - Rotates through pre-written tweets
 * - Handles rate limits and retries
 *
 * Usage:
 * - Run directly: npx tsx scripts/automation/twitter-poster.ts
 * - Via scheduler: Automatically called by scheduler.ts
 */

import * as fs from 'fs'
import * as crypto from 'crypto'
import * as path from 'path'
import {
  twitterConfig,
  rateLimitConfig,
  retryConfig,
  pathsConfig,
  siteConfig,
  isPlatformConfigured,
  twitterTopics,
} from './config'
import { logger } from './logger'
import { stateManager } from './state-manager'

interface Tweet {
  id: string
  text: string
  replyTo?: string
  mediaUrl?: string
}

interface TweetThread {
  id: string
  tweets: Tweet[]
}

// Pre-written tweets for rotation
const defaultTweets: Tweet[] = [
  {
    id: 'dream-1',
    text: `Dreams aren't random noise—they're your unconscious mind processing what your conscious mind won't face.

Jung called them "the small hidden door in the deepest and most intimate sanctum of the soul."

What is your psyche trying to tell you?

${siteConfig.baseUrl}/tools/dream-interpreter`,
  },
  {
    id: 'archetype-1',
    text: `The Shadow isn't your enemy—it's your disowned self.

Everything you judge in others exists somewhere within you.

Integration isn't about elimination. It's about acknowledgment.

Explore your shadow: ${siteConfig.baseUrl}/tools/archetype-quiz`,
  },
  {
    id: 'symbol-1',
    text: `Water in dreams = emotions
Falling = loss of control
Being chased = avoidance
Teeth falling out = anxiety about appearance/communication

But context matters more than universal meanings.

Your dream, your symbols.

${siteConfig.baseUrl}/tools/dream-interpreter`,
  },
  {
    id: 'lucid-1',
    text: `Lucid dreaming tip:

Throughout today, ask yourself: "Am I dreaming?"

Really question it. Look at text twice. Check your hands.

When this becomes habit, you'll do it in dreams too.

And then you'll know.

${siteConfig.baseUrl}/dream-journal`,
  },
  {
    id: 'jung-1',
    text: `"Until you make the unconscious conscious, it will direct your life and you will call it fate."

— Carl Jung

The patterns you don't see are the patterns that control you.

Start seeing: ${siteConfig.baseUrl}/tools/archetype-quiz`,
  },
  {
    id: 'meditation-1',
    text: `Meditation isn't about emptying your mind.

It's about observing what fills it.

The thoughts that arise when you're still? Those are the ones worth examining.

Guided meditations: ${siteConfig.baseUrl}/meditations`,
  },
  {
    id: 'shadow-work-1',
    text: `Shadow work exercise:

Think of someone who annoys you deeply.

List their worst qualities.

Now sit with this truth: those qualities live in you too.

That's why they trigger you.

This is where growth begins.`,
  },
  {
    id: 'anima-1',
    text: `The Anima/Animus: your inner opposite-gender archetype.

Men have an inner feminine (Anima)
Women have an inner masculine (Animus)

Ignoring this leads to projection onto partners.

Integrating it leads to wholeness.

${siteConfig.baseUrl}/tools/archetype-quiz`,
  },
  {
    id: 'dream-journal-1',
    text: `Want to remember more dreams?

Keep a journal by your bed.
Write immediately upon waking.
Don't move or check your phone first.
Even fragments count.

After 2 weeks, you'll remember 2-3 dreams per night.

${siteConfig.baseUrl}/dream-journal`,
  },
  {
    id: 'persona-1',
    text: `The Persona is the mask you show the world.

Necessary for social function.
Dangerous when you believe it's who you are.

The gap between your persona and your true self = your suffering.

Close the gap.`,
  },
  {
    id: 'recurring-1',
    text: `Recurring dreams are your psyche's way of saying:

"You haven't gotten the message yet."

They'll keep repeating until you do.

What dream keeps visiting you?

That's where your work is.

${siteConfig.baseUrl}/tools/dream-interpreter`,
  },
  {
    id: 'collective-1',
    text: `Why do people across cultures dream of flying, falling, being chased?

Jung's answer: the Collective Unconscious.

Shared archetypal patterns inherited through human experience.

You're not just you. You're all of us.`,
  },
  {
    id: 'self-1',
    text: `The Self archetype: your potential wholeness.

Not the ego (who you think you are)
Not the shadow (who you hide)
Not the persona (who you show)

The Self contains all of it.

Individuation is the journey toward it.`,
  },
  {
    id: 'nightmare-1',
    text: `Nightmares aren't punishment.

They're urgent messages from your unconscious that your waking mind keeps ignoring.

The more you avoid, the louder they get.

Face the monster. Ask what it wants. Listen.

That's how they transform.`,
  },
]

// Generate OAuth 1.0a signature
function generateOAuthSignature(
  method: string,
  url: string,
  params: Record<string, string>,
  consumerSecret: string,
  tokenSecret: string
): string {
  // Sort and encode parameters
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&')

  // Create signature base string
  const signatureBase = [
    method.toUpperCase(),
    encodeURIComponent(url),
    encodeURIComponent(sortedParams),
  ].join('&')

  // Create signing key
  const signingKey = `${encodeURIComponent(consumerSecret)}&${encodeURIComponent(tokenSecret)}`

  // Generate HMAC-SHA1 signature
  const signature = crypto
    .createHmac('sha1', signingKey)
    .update(signatureBase)
    .digest('base64')

  return signature
}

// Generate OAuth 1.0a header
function generateOAuthHeader(
  method: string,
  url: string,
  extraParams: Record<string, string> = {}
): string {
  const oauthParams: Record<string, string> = {
    oauth_consumer_key: twitterConfig.apiKey,
    oauth_token: twitterConfig.accessToken,
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_nonce: crypto.randomBytes(16).toString('hex'),
    oauth_version: '1.0',
  }

  const allParams = { ...oauthParams, ...extraParams }

  const signature = generateOAuthSignature(
    method,
    url,
    allParams,
    twitterConfig.apiSecret,
    twitterConfig.accessSecret
  )

  oauthParams.oauth_signature = signature

  const headerString = Object.keys(oauthParams)
    .sort()
    .map(key => `${encodeURIComponent(key)}="${encodeURIComponent(oauthParams[key])}"`)
    .join(', ')

  return `OAuth ${headerString}`
}

// Post a tweet
async function postTweet(
  text: string,
  replyToId?: string
): Promise<{ success: boolean; tweetId?: string; error?: string }> {
  const url = 'https://api.twitter.com/2/tweets'

  const body: Record<string, any> = { text }
  if (replyToId) {
    body.reply = { in_reply_to_tweet_id: replyToId }
  }

  const authHeader = generateOAuthHeader('POST', url)

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorText = await response.text()

      // Check for rate limiting
      if (response.status === 429) {
        const resetTime = response.headers.get('x-rate-limit-reset')
        const waitTime = resetTime
          ? (parseInt(resetTime) * 1000 - Date.now())
          : rateLimitConfig.twitter.cooldownAfterError

        logger.rateLimited('TWITTER', waitTime)
        return { success: false, error: `Rate limited, retry in ${Math.ceil(waitTime / 1000)}s` }
      }

      return { success: false, error: `HTTP ${response.status}: ${errorText}` }
    }

    const data = await response.json()
    return { success: true, tweetId: data.data.id }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// Sleep helper
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Load custom tweets from file if exists
function loadTweets(): Tweet[] {
  const tweetsPath = path.join(pathsConfig.contentDir, 'twitter', 'tweets.md')

  if (!fs.existsSync(tweetsPath)) {
    logger.info('TWITTER', 'Using default tweets (no custom tweets file found)')
    return defaultTweets
  }

  try {
    const content = fs.readFileSync(tweetsPath, 'utf-8')
    const tweets: Tweet[] = []
    const tweetBlocks = content.split(/^---$/m).filter(block => block.trim())

    for (const block of tweetBlocks) {
      const text = block.trim()
      // Skip header comments (lines starting with #)
      if (text.startsWith('#')) continue
      if (text && text.length <= 280) {
        const id = crypto.createHash('md5').update(text).digest('hex').substring(0, 8)
        tweets.push({ id, text })
      }
    }

    if (tweets.length > 0) {
      logger.info('TWITTER', `Loaded ${tweets.length} custom tweets`)
      return tweets
    }
  } catch (error) {
    logger.warn('TWITTER', 'Failed to load custom tweets, using defaults')
  }

  return defaultTweets
}

// Main posting function
export async function postToTwitter(postCount: number = 1): Promise<void> {
  logger.info('TWITTER', `Starting Twitter posting (count: ${postCount})`)

  // Check configuration
  if (!isPlatformConfigured('twitter')) {
    logger.error('TWITTER', 'Twitter credentials not configured')
    console.log('\nSetup instructions:')
    console.log('1. Go to: https://developer.twitter.com/')
    console.log('2. Create app and get credentials')
    console.log('3. Add to .env.local:')
    console.log('   TWITTER_API_KEY=your_api_key')
    console.log('   TWITTER_API_SECRET=your_api_secret')
    console.log('   TWITTER_ACCESS_TOKEN=your_access_token')
    console.log('   TWITTER_ACCESS_SECRET=your_access_secret')
    return
  }

  // Check daily limit
  const maxPosts = rateLimitConfig.twitter.maxTweetsPerDay
  if (!stateManager.canPostToday('twitter', maxPosts)) {
    logger.warn('TWITTER', `Daily limit reached (${maxPosts} tweets)`)
    return
  }

  // Load tweets
  const tweets = loadTweets()
  if (tweets.length === 0) {
    logger.warn('TWITTER', 'No tweets available to post')
    return
  }

  // Determine posts to make
  const remaining = stateManager.getPostsRemaining('twitter', maxPosts)
  const actualCount = Math.min(postCount, remaining, tweets.length)

  logger.info('TWITTER', `Will post ${actualCount} of ${tweets.length} available tweets`)

  // Post tweets
  let successCount = 0
  for (let i = 0; i < actualCount; i++) {
    const index = stateManager.getNextIndex('twitter', tweets.length)
    const tweet = tweets[index]

    // Check if already posted recently
    if (stateManager.wasPosted('twitter', tweet.id)) {
      logger.info('TWITTER', `Skipping recently posted tweet`)
      continue
    }

    logger.postStarted('TWITTER', `"${tweet.text.substring(0, 50)}..."`)

    try {
      const result = await postTweet(tweet.text)

      if (result.success) {
        const tweetUrl = `https://twitter.com/user/status/${result.tweetId}`
        stateManager.recordPost('twitter', tweet.id, true, {
          title: tweet.text.substring(0, 50),
          url: tweetUrl,
          index,
        })
        logger.postCompleted('TWITTER', tweet.text.substring(0, 50), tweetUrl)
        successCount++
      } else {
        stateManager.recordPost('twitter', tweet.id, false, {
          title: tweet.text.substring(0, 50),
          error: result.error,
          index,
        })
        logger.postFailed('TWITTER', tweet.text.substring(0, 50), { message: result.error })

        // Wait on error
        await sleep(rateLimitConfig.twitter.cooldownAfterError)
      }
    } catch (error: any) {
      stateManager.recordPost('twitter', tweet.id, false, {
        title: tweet.text.substring(0, 50),
        error: error.message,
      })
      logger.postFailed('TWITTER', tweet.text.substring(0, 50), error)
    }

    // Wait between tweets
    if (i < actualCount - 1) {
      logger.info('TWITTER', `Waiting ${rateLimitConfig.twitter.minDelayBetweenTweets / 1000}s before next tweet`)
      await sleep(rateLimitConfig.twitter.minDelayBetweenTweets)
    }
  }

  // Summary
  const stats = stateManager.getStats('twitter')
  logger.success('TWITTER', `Posting complete: ${successCount}/${actualCount} successful`)
  logger.info('TWITTER', `Total tweets: ${stats.totalPosts}, Today: ${stats.postsToday}`)
}

// Post a thread (multiple connected tweets)
export async function postThread(tweets: string[]): Promise<void> {
  logger.info('TWITTER', `Posting thread with ${tweets.length} tweets`)

  let previousId: string | undefined

  for (let i = 0; i < tweets.length; i++) {
    const text = tweets[i]
    logger.postStarted('TWITTER', `Thread ${i + 1}/${tweets.length}`)

    const result = await postTweet(text, previousId)

    if (result.success) {
      previousId = result.tweetId
      logger.postCompleted('TWITTER', `Thread ${i + 1}`, `Tweet ID: ${result.tweetId}`)
    } else {
      logger.postFailed('TWITTER', `Thread ${i + 1}`, { message: result.error })
      throw new Error(`Thread posting failed at tweet ${i + 1}: ${result.error}`)
    }

    // Wait between tweets in thread
    if (i < tweets.length - 1) {
      await sleep(rateLimitConfig.twitter.minDelayBetweenTweets)
    }
  }

  logger.success('TWITTER', `Thread posted successfully`)
}

// Get posting status
export function getTwitterStatus(): {
  configured: boolean
  postsToday: number
  postsRemaining: number
  totalPosts: number
  availableContent: number
} {
  const stats = stateManager.getStats('twitter')
  const tweets = loadTweets()

  return {
    configured: isPlatformConfigured('twitter'),
    postsToday: stats.postsToday,
    postsRemaining: stateManager.getPostsRemaining('twitter', rateLimitConfig.twitter.maxTweetsPerDay),
    totalPosts: stats.totalPosts,
    availableContent: tweets.length,
  }
}

// Run directly
if (require.main === module) {
  postToTwitter(1)
    .then(() => {
      console.log('\nTwitter posting completed')
      process.exit(0)
    })
    .catch(error => {
      logger.error('TWITTER', 'Fatal error', error)
      process.exit(1)
    })
}

export default postToTwitter
