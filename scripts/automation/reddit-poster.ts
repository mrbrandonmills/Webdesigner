/**
 * Reddit Auto-Poster
 *
 * Automatically posts content to Reddit on a schedule
 * - Reads posts from /content/reddit/posts.md
 * - Tracks which posts have been made
 * - Rotates through subreddits
 * - Handles rate limits and retries
 *
 * Usage:
 * - Run directly: npx tsx scripts/automation/reddit-poster.ts
 * - Via scheduler: Automatically called by scheduler.ts
 */

import * as fs from 'fs'
import * as crypto from 'crypto'
import {
  redditConfig,
  rateLimitConfig,
  retryConfig,
  pathsConfig,
  isPlatformConfigured,
  targetSubreddits,
} from './config'
import { logger } from './logger'
import { stateManager } from './state-manager'

interface RedditPost {
  id: string
  subreddit: string
  title: string
  text: string
  flairText?: string
  linkUrl?: string
}

interface ParsedContent {
  posts: RedditPost[]
}

let accessToken: string | null = null
let tokenExpiry: number = 0

// Parse posts from markdown file
function parsePostsFromMarkdown(content: string): RedditPost[] {
  const posts: RedditPost[] = []
  const postBlocks = content.split(/^---$/m).filter(block => block.trim())

  for (const block of postBlocks) {
    const lines = block.trim().split('\n')
    let subreddit = ''
    let title = ''
    let text = ''
    let flairText = ''
    let linkUrl = ''
    let inText = false

    for (const line of lines) {
      if (line.startsWith('subreddit:')) {
        subreddit = line.replace('subreddit:', '').trim()
      } else if (line.startsWith('title:')) {
        title = line.replace('title:', '').trim()
      } else if (line.startsWith('flair:')) {
        flairText = line.replace('flair:', '').trim()
      } else if (line.startsWith('link:')) {
        linkUrl = line.replace('link:', '').trim()
      } else if (line.startsWith('text:')) {
        text = line.replace('text:', '').trim()
        inText = true
      } else if (inText) {
        text += '\n' + line
      }
    }

    if (subreddit && title && text) {
      const id = crypto
        .createHash('md5')
        .update(`${subreddit}-${title}`)
        .digest('hex')
        .substring(0, 8)

      posts.push({
        id,
        subreddit,
        title: title.replace(/^["']|["']$/g, ''),
        text: text.trim(),
        flairText: flairText || undefined,
        linkUrl: linkUrl || undefined,
      })
    }
  }

  return posts
}

// Load posts from content file
function loadPosts(): RedditPost[] {
  const postsPath = pathsConfig.redditPosts

  if (!fs.existsSync(postsPath)) {
    logger.error('REDDIT', `Posts file not found: ${postsPath}`)
    return []
  }

  const content = fs.readFileSync(postsPath, 'utf-8')
  const posts = parsePostsFromMarkdown(content)

  logger.info('REDDIT', `Loaded ${posts.length} posts from content file`)
  return posts
}

// Get Reddit access token
async function getAccessToken(): Promise<string> {
  // Return cached token if still valid
  if (accessToken && Date.now() < tokenExpiry) {
    return accessToken
  }

  const auth = Buffer.from(
    `${redditConfig.clientId}:${redditConfig.clientSecret}`
  ).toString('base64')

  const response = await fetch('https://www.reddit.com/api/v1/access_token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': redditConfig.userAgent,
    },
    body: `grant_type=password&username=${encodeURIComponent(
      redditConfig.username
    )}&password=${encodeURIComponent(redditConfig.password)}`,
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to get access token: ${error}`)
  }

  const data = await response.json()
  accessToken = data.access_token
  tokenExpiry = Date.now() + data.expires_in * 1000 - 60000 // Refresh 1 min early

  logger.debug('REDDIT', 'Access token obtained')
  return accessToken!
}

// Submit a post to Reddit
async function submitPost(post: RedditPost): Promise<{ success: boolean; url?: string; error?: string }> {
  const token = await getAccessToken()

  logger.postStarted('REDDIT', `r/${post.subreddit}: "${post.title.substring(0, 50)}..."`)

  const body: Record<string, string> = {
    sr: post.subreddit,
    kind: post.linkUrl ? 'link' : 'self',
    title: post.title,
    api_type: 'json',
  }

  if (post.linkUrl) {
    body.url = post.linkUrl
  } else {
    body.text = post.text
  }

  if (post.flairText) {
    body.flair_text = post.flairText
  }

  const response = await fetch('https://oauth.reddit.com/api/submit', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': redditConfig.userAgent,
    },
    body: new URLSearchParams(body).toString(),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`HTTP ${response.status}: ${error}`)
  }

  const data = await response.json()

  // Check for API errors
  if (data.json.errors && data.json.errors.length > 0) {
    const errorMsg = data.json.errors
      .map((e: string[]) => e.join(': '))
      .join(', ')
    throw new Error(errorMsg)
  }

  // Check for rate limiting
  if (data.json.ratelimit) {
    const waitTime = Math.ceil(data.json.ratelimit) * 1000
    logger.rateLimited('REDDIT', waitTime)
    await sleep(waitTime)
    // Retry the post
    return submitPost(post)
  }

  const postUrl = data.json.data?.url || ''
  return { success: true, url: postUrl }
}

// Sleep helper
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Retry with exponential backoff
async function withRetry<T>(
  operation: () => Promise<T>,
  platform: string
): Promise<T> {
  let delay = retryConfig.initialDelay

  for (let attempt = 1; attempt <= retryConfig.maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error: any) {
      if (attempt === retryConfig.maxRetries) {
        throw error
      }

      logger.retrying(platform, attempt, retryConfig.maxRetries)
      await sleep(delay)
      delay = Math.min(delay * retryConfig.backoffMultiplier, retryConfig.maxDelay)
    }
  }

  throw new Error('Max retries exceeded')
}

// Main posting function
export async function postToReddit(postCount: number = 1): Promise<void> {
  logger.info('REDDIT', `Starting Reddit posting (count: ${postCount})`)

  // Check configuration
  if (!isPlatformConfigured('reddit')) {
    logger.error('REDDIT', 'Reddit credentials not configured')
    console.log('\nSetup instructions:')
    console.log('1. Go to: https://www.reddit.com/prefs/apps')
    console.log('2. Click "create another app..."')
    console.log('3. Select "script"')
    console.log('4. Add to .env.local:')
    console.log('   REDDIT_CLIENT_ID=your_client_id')
    console.log('   REDDIT_CLIENT_SECRET=your_client_secret')
    console.log('   REDDIT_USERNAME=your_username')
    console.log('   REDDIT_PASSWORD=your_password')
    return
  }

  // Check daily limit
  const maxPosts = rateLimitConfig.reddit.maxPostsPerDay
  if (!stateManager.canPostToday('reddit', maxPosts)) {
    logger.warn('REDDIT', `Daily limit reached (${maxPosts} posts)`)
    return
  }

  // Load posts
  const posts = loadPosts()
  if (posts.length === 0) {
    logger.warn('REDDIT', 'No posts available to post')
    return
  }

  // Determine posts to make
  const remaining = stateManager.getPostsRemaining('reddit', maxPosts)
  const actualCount = Math.min(postCount, remaining, posts.length)

  logger.info('REDDIT', `Will post ${actualCount} of ${posts.length} available posts`)

  // Get access token
  await getAccessToken()

  // Post content
  let successCount = 0
  for (let i = 0; i < actualCount; i++) {
    const index = stateManager.getNextIndex('reddit', posts.length)
    const post = posts[index]

    // Check if already posted
    if (stateManager.wasPosted('reddit', post.id)) {
      logger.info('REDDIT', `Skipping already posted: ${post.title.substring(0, 40)}...`)
      continue
    }

    try {
      const result = await withRetry(
        () => submitPost(post),
        'REDDIT'
      )

      if (result.success) {
        stateManager.recordPost('reddit', post.id, true, {
          title: post.title,
          subreddit: post.subreddit,
          url: result.url,
          index,
        })
        logger.postCompleted('REDDIT', `r/${post.subreddit}: ${post.title.substring(0, 40)}...`, result.url)
        successCount++
      }
    } catch (error: any) {
      stateManager.recordPost('reddit', post.id, false, {
        title: post.title,
        subreddit: post.subreddit,
        error: error.message,
        index,
      })
      logger.postFailed('REDDIT', `r/${post.subreddit}: ${post.title.substring(0, 40)}...`, error)

      // Wait before continuing
      await sleep(rateLimitConfig.reddit.cooldownAfterError)
    }

    // Wait between posts
    if (i < actualCount - 1) {
      logger.info('REDDIT', `Waiting ${rateLimitConfig.reddit.minDelayBetweenPosts / 1000}s before next post`)
      await sleep(rateLimitConfig.reddit.minDelayBetweenPosts)
    }
  }

  // Summary
  const stats = stateManager.getStats('reddit')
  logger.success('REDDIT', `Posting complete: ${successCount}/${actualCount} successful`)
  logger.info('REDDIT', `Total posts: ${stats.totalPosts}, Today: ${stats.postsToday}`)
}

// Get posting status
export function getRedditStatus(): {
  configured: boolean
  postsToday: number
  postsRemaining: number
  totalPosts: number
  availableContent: number
} {
  const stats = stateManager.getStats('reddit')
  const posts = loadPosts()

  return {
    configured: isPlatformConfigured('reddit'),
    postsToday: stats.postsToday,
    postsRemaining: stateManager.getPostsRemaining('reddit', rateLimitConfig.reddit.maxPostsPerDay),
    totalPosts: stats.totalPosts,
    availableContent: posts.length,
  }
}

// Run directly
if (require.main === module) {
  postToReddit(1)
    .then(() => {
      console.log('\nReddit posting completed')
      process.exit(0)
    })
    .catch(error => {
      logger.error('REDDIT', 'Fatal error', error)
      process.exit(1)
    })
}

export default postToReddit
