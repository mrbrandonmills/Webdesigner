/**
 * Launch Day Automation Script
 *
 * Coordinates Product Hunt launch day posting across multiple platforms
 * with scheduled posts throughout the day.
 *
 * Usage:
 * npm run launch-day -- --ph-url="https://www.producthunt.com/posts/dream-decoder"
 *
 * Platforms:
 * - Twitter: Multiple scheduled tweets throughout the day
 * - Reddit: Blitz posting to multiple subreddits
 * - Hacker News: Show HN submission
 */

import * as fs from 'fs'
import * as path from 'path'
import * as crypto from 'crypto'
import puppeteer, { Browser, Page } from 'puppeteer'
import { twitterConfig, pathsConfig, isPlatformConfigured } from './config'
import { logger } from './logger'
import { stateManager } from './state-manager'

// Configuration
const SITE_URL = 'https://brandonmills.com/dreams'
const PRODUCT_NAME = 'Dream Decoder'
const KEY_FEATURES = [
  'Free to use',
  'AI-powered analysis',
  'Jungian psychology',
  '3D dream visualizations',
]

// Command line argument parsing
function parseArgs(): { phUrl: string; dryRun: boolean; skipSchedule: boolean } {
  const args = process.argv.slice(2)
  let phUrl = ''
  let dryRun = false
  let skipSchedule = false

  for (const arg of args) {
    if (arg.startsWith('--ph-url=')) {
      phUrl = arg.replace('--ph-url=', '').replace(/["']/g, '')
    } else if (arg === '--dry-run') {
      dryRun = true
    } else if (arg === '--skip-schedule') {
      skipSchedule = true
    }
  }

  if (!phUrl) {
    console.error('Error: --ph-url argument is required')
    console.error('Usage: npm run launch-day -- --ph-url="https://www.producthunt.com/posts/dream-decoder"')
    process.exit(1)
  }

  return { phUrl, dryRun, skipSchedule }
}

// Sleep helper
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Calculate milliseconds until target time (in local timezone)
function msUntilTime(hours: number, minutes: number): number {
  const now = new Date()
  const target = new Date()
  target.setHours(hours, minutes, 0, 0)

  if (target <= now) {
    // Time has passed today
    return 0
  }

  return target.getTime() - now.getTime()
}

// Format time for logging
function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

// ============================================================================
// TWITTER POSTING
// ============================================================================

// Generate OAuth 1.0a signature
function generateOAuthSignature(
  method: string,
  url: string,
  params: Record<string, string>,
  consumerSecret: string,
  tokenSecret: string
): string {
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&')

  const signatureBase = [
    method.toUpperCase(),
    encodeURIComponent(url),
    encodeURIComponent(sortedParams),
  ].join('&')

  const signingKey = `${encodeURIComponent(consumerSecret)}&${encodeURIComponent(tokenSecret)}`

  return crypto
    .createHmac('sha1', signingKey)
    .update(signatureBase)
    .digest('base64')
}

// Generate OAuth 1.0a header
function generateOAuthHeader(method: string, url: string): string {
  const oauthParams: Record<string, string> = {
    oauth_consumer_key: twitterConfig.apiKey,
    oauth_token: twitterConfig.accessToken,
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_nonce: crypto.randomBytes(16).toString('hex'),
    oauth_version: '1.0',
  }

  const signature = generateOAuthSignature(
    method,
    url,
    oauthParams,
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
  dryRun: boolean = false
): Promise<{ success: boolean; tweetId?: string; error?: string }> {
  if (dryRun) {
    logger.info('TWITTER', `[DRY RUN] Would post: ${text.substring(0, 50)}...`)
    return { success: true, tweetId: 'dry-run-id' }
  }

  const url = 'https://api.twitter.com/2/tweets'
  const authHeader = generateOAuthHeader('POST', url)

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      if (response.status === 429) {
        const resetTime = response.headers.get('x-rate-limit-reset')
        const waitTime = resetTime
          ? (parseInt(resetTime) * 1000 - Date.now())
          : 60000
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

// Twitter content for launch day
function getLaunchTweets(phUrl: string): Array<{ id: string; time: string; text: string }> {
  return [
    {
      id: 'launch-announcement',
      time: '12:01 AM',
      text: `We're live on Product Hunt!

${PRODUCT_NAME} - Free AI dream interpretation using Jungian psychology with stunning 3D visualizations.

Would love your support:
${phUrl}

${SITE_URL}`,
    },
    {
      id: 'morning-update',
      time: '9:00 AM',
      text: `Thank you for the incredible support this morning!

${PRODUCT_NAME} is climbing the ranks on Product Hunt.

If you haven't tried it yet - it's completely free:
${SITE_URL}

Support us here: ${phUrl}`,
    },
    {
      id: 'feature-highlight',
      time: '12:00 PM',
      text: `What makes ${PRODUCT_NAME} different:

- ${KEY_FEATURES[0]}
- ${KEY_FEATURES[1]}
- ${KEY_FEATURES[2]}
- ${KEY_FEATURES[3]}

Try it now: ${SITE_URL}

Vote on PH: ${phUrl}`,
    },
    {
      id: 'afternoon-push',
      time: '3:00 PM',
      text: `The afternoon push!

We're having an amazing launch day. Every upvote helps us reach more people who could benefit from understanding their dreams.

${phUrl}

Thank you for being part of this journey.`,
    },
    {
      id: 'evening-reminder',
      time: '6:00 PM',
      text: `Last few hours to support us on Product Hunt!

${PRODUCT_NAME} helps you decode your dreams using AI and Jungian psychology - completely free.

If you haven't voted yet:
${phUrl}

Thank you everyone!`,
    },
  ]
}

// ============================================================================
// REDDIT POSTING (Puppeteer)
// ============================================================================

// Reddit subreddits for launch day
const LAUNCH_SUBREDDITS = [
  'SideProject',
  'InternetIsBeautiful',
  'artificial',
  'psychology',
  'webapps',
]

// Generate Reddit posts for each subreddit
function getRedditPosts(phUrl: string): Array<{
  subreddit: string
  title: string
  body: string
}> {
  return [
    {
      subreddit: 'SideProject',
      title: `I built a free AI dream interpreter with 3D visualizations - Dream Decoder`,
      body: `Hey everyone!

I've been working on this side project for a while and finally launched it on Product Hunt today.

**What it does:**
- Interprets your dreams using AI and Jungian psychology
- Creates 3D visualizations of your dream symbols
- Completely free to use

**Tech stack:**
- Next.js 15 / React 19
- OpenAI API for interpretation
- Three.js for 3D visualizations

Would love any feedback!

Try it here: ${SITE_URL}

Product Hunt: ${phUrl}`,
    },
    {
      subreddit: 'InternetIsBeautiful',
      title: `Dream Decoder - Free AI dream interpretation with 3D visualizations`,
      body: `${SITE_URL}

A free tool that interprets your dreams using AI and Jungian psychology, then creates beautiful 3D visualizations of your dream symbols.

Just type in your dream and get an instant analysis with archetypal meanings and personalized insights.`,
    },
    {
      subreddit: 'artificial',
      title: `Launched an AI dream interpreter using Jungian psychology - Dream Decoder`,
      body: `I built a tool that uses LLMs to interpret dreams through the lens of Jungian psychology.

**How it works:**
1. User inputs their dream description
2. AI analyzes symbols, themes, and archetypes
3. Generates interpretation based on Jungian framework
4. Creates 3D visualization of key symbols

The challenge was getting the AI to provide meaningful psychological interpretations rather than generic responses. I found that structuring prompts around specific Jungian concepts (shadow, anima/animus, collective unconscious) produced much better results.

Try it: ${SITE_URL}

Launched on Product Hunt today: ${phUrl}

Would love feedback from this community!`,
    },
    {
      subreddit: 'psychology',
      title: `I built a free dream interpreter based on Jungian psychology`,
      body: `Hi r/psychology,

I've created a tool that interprets dreams using AI, specifically trained on Jungian analytical psychology concepts.

**The approach:**
- Analyzes dream symbols through archetypal meanings
- Considers shadow work and individuation
- Looks at anima/animus representations
- Explores collective unconscious patterns

I'm not claiming this replaces therapy or professional analysis - it's meant as a tool for personal reflection and understanding your inner world better.

Would love to hear thoughts from psychology enthusiasts on the interpretations.

${SITE_URL}

(Also launched on Product Hunt today if you'd like to support: ${phUrl})`,
    },
    {
      subreddit: 'webapps',
      title: `Dream Decoder - Free AI dream interpretation with 3D visualizations`,
      body: `**Link:** ${SITE_URL}

**What it does:**
Free dream interpretation using AI and Jungian psychology. Also generates 3D visualizations of your dream symbols.

**Features:**
- Instant AI-powered analysis
- Jungian archetypal interpretations
- 3D dream visualizations
- No account required
- Completely free

Launched on Product Hunt today: ${phUrl}`,
    },
  ]
}

// Post to Reddit using Puppeteer
async function postToRedditWithPuppeteer(
  posts: Array<{ subreddit: string; title: string; body: string }>,
  dryRun: boolean = false
): Promise<void> {
  const username = process.env.REDDIT_USERNAME
  const password = process.env.REDDIT_PASSWORD

  if (!username || !password) {
    logger.error('REDDIT', 'Missing REDDIT_USERNAME or REDDIT_PASSWORD')
    return
  }

  if (dryRun) {
    logger.info('REDDIT', `[DRY RUN] Would post to ${posts.length} subreddits`)
    for (const post of posts) {
      logger.info('REDDIT', `[DRY RUN] r/${post.subreddit}: ${post.title}`)
    }
    return
  }

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  let successCount = 0

  try {
    const page = await browser.newPage()
    await page.setViewport({ width: 1280, height: 800 })
    await page.setUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
    )

    // Login to Reddit
    logger.info('REDDIT', 'Logging in...')
    await page.goto('https://www.reddit.com/login', { waitUntil: 'networkidle2' })

    await page.waitForSelector('input[name="username"]', { timeout: 10000 })
    await page.type('input[name="username"]', username, { delay: 50 })
    await page.type('input[name="password"]', password, { delay: 50 })
    await page.click('button[type="submit"]')
    await sleep(5000)

    const loggedIn = await page.evaluate(() => {
      return (
        document.body.innerText.includes('Create Post') ||
        !window.location.href.includes('/login')
      )
    })

    if (!loggedIn) {
      logger.error('REDDIT', 'Login failed')
      await browser.close()
      return
    }

    logger.info('REDDIT', 'Login successful')

    // Post to each subreddit
    for (const post of posts) {
      logger.info('REDDIT', `Posting to r/${post.subreddit}...`)

      try {
        await page.goto(
          `https://www.reddit.com/r/${post.subreddit}/submit?type=TEXT`,
          { waitUntil: 'networkidle2', timeout: 30000 }
        )

        await sleep(3000)

        // Fill title
        const titleSelectors = [
          'textarea[placeholder*="Title"]',
          'input[placeholder*="Title"]',
          '[data-test-id="title-text-area"]',
          'div[slot="title"] textarea',
        ]

        let titleFilled = false
        for (const selector of titleSelectors) {
          const titleInput = await page.$(selector)
          if (titleInput) {
            await titleInput.click()
            await titleInput.type(post.title, { delay: 30 })
            titleFilled = true
            break
          }
        }

        if (!titleFilled) {
          throw new Error('Could not find title input')
        }

        await sleep(1000)

        // Fill body
        const bodySelectors = [
          'div[contenteditable="true"]',
          'textarea[placeholder*="Text"]',
          '[data-test-id="text-area"]',
          '.public-DraftEditor-content',
        ]

        let bodyFilled = false
        for (const selector of bodySelectors) {
          const bodyInput = await page.$(selector)
          if (bodyInput) {
            await bodyInput.click()
            await bodyInput.type(post.body, { delay: 20 })
            bodyFilled = true
            break
          }
        }

        if (!bodyFilled) {
          throw new Error('Could not find body input')
        }

        await sleep(2000)

        // Click post button
        const postButtonSelectors = [
          'button[type="submit"]',
          'button:has-text("Post")',
          '[data-test-id="submit-button"]',
        ]

        let posted = false
        for (const selector of postButtonSelectors) {
          const postButton = await page.$(selector)
          if (postButton) {
            const isDisabled = await postButton.evaluate(
              el => (el as HTMLButtonElement).disabled
            )
            if (!isDisabled) {
              await postButton.click()
              posted = true
              break
            }
          }
        }

        if (!posted) {
          throw new Error('Could not find or click post button')
        }

        await sleep(5000)

        const currentUrl = page.url()
        if (currentUrl.includes('/comments/')) {
          stateManager.recordPost('reddit', `launch-${post.subreddit}`, true, {
            title: post.title,
            subreddit: post.subreddit,
            url: currentUrl,
          })
          logger.success('REDDIT', `Posted to r/${post.subreddit}: ${currentUrl}`)
          successCount++
        } else {
          logger.warn('REDDIT', `Post to r/${post.subreddit} may have failed`)
        }

        // Wait between posts
        if (posts.indexOf(post) < posts.length - 1) {
          logger.info('REDDIT', 'Waiting 60s before next post...')
          await sleep(60000)
        }
      } catch (error: any) {
        logger.error('REDDIT', `Failed to post to r/${post.subreddit}: ${error.message}`)
        stateManager.recordPost('reddit', `launch-${post.subreddit}`, false, {
          title: post.title,
          subreddit: post.subreddit,
          error: error.message,
        })
      }
    }
  } finally {
    await browser.close()
  }

  logger.info('REDDIT', `Complete: ${successCount}/${posts.length} successful`)
}

// ============================================================================
// HACKER NEWS POSTING (Puppeteer)
// ============================================================================

async function postToHackerNews(phUrl: string, dryRun: boolean = false): Promise<void> {
  const username = process.env.HN_USERNAME
  const password = process.env.HN_PASSWORD

  if (!username || !password) {
    logger.error('HN', 'Missing HN_USERNAME or HN_PASSWORD')
    return
  }

  const title = `Show HN: ${PRODUCT_NAME} - Free AI dream interpretation with Jungian psychology`
  const url = SITE_URL

  if (dryRun) {
    logger.info('HN', `[DRY RUN] Would post: ${title}`)
    logger.info('HN', `[DRY RUN] URL: ${url}`)
    return
  }

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  try {
    const page = await browser.newPage()
    await page.setViewport({ width: 1280, height: 800 })

    // Login to HN
    logger.info('HN', 'Logging in...')
    await page.goto('https://news.ycombinator.com/login', {
      waitUntil: 'networkidle2',
    })

    await page.type('input[name="acct"]', username, { delay: 50 })
    await page.type('input[name="pw"]', password, { delay: 50 })
    await page.click('input[type="submit"]')
    await sleep(3000)

    // Navigate to submit page
    await page.goto('https://news.ycombinator.com/submit', {
      waitUntil: 'networkidle2',
    })

    // Fill in the form
    await page.type('input[name="title"]', title, { delay: 30 })
    await page.type('input[name="url"]', url, { delay: 30 })

    // Submit
    await page.click('input[type="submit"]')
    await sleep(5000)

    const currentUrl = page.url()
    if (currentUrl.includes('item?id=')) {
      logger.success('HN', `Posted: ${currentUrl}`)
      stateManager.recordPost('reddit', 'launch-hn', true, {
        title,
        url: currentUrl,
      })
    } else if (currentUrl.includes('newest')) {
      logger.success('HN', 'Post submitted successfully')
    } else {
      logger.warn('HN', 'Post may have failed - check manually')
    }
  } catch (error: any) {
    logger.error('HN', `Failed: ${error.message}`)
  } finally {
    await browser.close()
  }
}

// ============================================================================
// SCHEDULING
// ============================================================================

interface ScheduledTask {
  id: string
  name: string
  time: string
  hours: number
  minutes: number
  action: () => Promise<void>
  completed: boolean
}

async function runScheduledLaunch(phUrl: string, dryRun: boolean): Promise<void> {
  const tweets = getLaunchTweets(phUrl)
  const redditPosts = getRedditPosts(phUrl)

  // Define scheduled tasks
  const tasks: ScheduledTask[] = [
    {
      id: 'twitter-launch',
      name: 'Launch Tweet',
      time: '12:01 AM',
      hours: 0,
      minutes: 1,
      action: async () => {
        const tweet = tweets.find(t => t.id === 'launch-announcement')
        if (tweet) {
          const result = await postTweet(tweet.text, dryRun)
          if (result.success) {
            logger.success('TWITTER', `Launch tweet posted: ${result.tweetId}`)
          } else {
            logger.error('TWITTER', `Launch tweet failed: ${result.error}`)
          }
        }
      },
      completed: false,
    },
    {
      id: 'reddit-blitz',
      name: 'Reddit Blitz',
      time: '6:00 AM',
      hours: 6,
      minutes: 0,
      action: async () => {
        await postToRedditWithPuppeteer(redditPosts, dryRun)
      },
      completed: false,
    },
    {
      id: 'hacker-news',
      name: 'Hacker News',
      time: '7:00 AM',
      hours: 7,
      minutes: 0,
      action: async () => {
        await postToHackerNews(phUrl, dryRun)
      },
      completed: false,
    },
    {
      id: 'twitter-morning',
      name: 'Morning Update',
      time: '9:00 AM',
      hours: 9,
      minutes: 0,
      action: async () => {
        const tweet = tweets.find(t => t.id === 'morning-update')
        if (tweet) {
          const result = await postTweet(tweet.text, dryRun)
          if (result.success) {
            logger.success('TWITTER', `Morning tweet posted: ${result.tweetId}`)
          } else {
            logger.error('TWITTER', `Morning tweet failed: ${result.error}`)
          }
        }
      },
      completed: false,
    },
    {
      id: 'twitter-noon',
      name: 'Noon Update',
      time: '12:00 PM',
      hours: 12,
      minutes: 0,
      action: async () => {
        const tweet = tweets.find(t => t.id === 'feature-highlight')
        if (tweet) {
          const result = await postTweet(tweet.text, dryRun)
          if (result.success) {
            logger.success('TWITTER', `Noon tweet posted: ${result.tweetId}`)
          } else {
            logger.error('TWITTER', `Noon tweet failed: ${result.error}`)
          }
        }
      },
      completed: false,
    },
    {
      id: 'twitter-afternoon',
      name: 'Afternoon Push',
      time: '3:00 PM',
      hours: 15,
      minutes: 0,
      action: async () => {
        const tweet = tweets.find(t => t.id === 'afternoon-push')
        if (tweet) {
          const result = await postTweet(tweet.text, dryRun)
          if (result.success) {
            logger.success('TWITTER', `Afternoon tweet posted: ${result.tweetId}`)
          } else {
            logger.error('TWITTER', `Afternoon tweet failed: ${result.error}`)
          }
        }
      },
      completed: false,
    },
    {
      id: 'twitter-evening',
      name: 'Evening Reminder',
      time: '6:00 PM',
      hours: 18,
      minutes: 0,
      action: async () => {
        const tweet = tweets.find(t => t.id === 'evening-reminder')
        if (tweet) {
          const result = await postTweet(tweet.text, dryRun)
          if (result.success) {
            logger.success('TWITTER', `Evening tweet posted: ${result.tweetId}`)
          } else {
            logger.error('TWITTER', `Evening tweet failed: ${result.error}`)
          }
        }
      },
      completed: false,
    },
  ]

  // Display schedule
  console.log('\n=== Launch Day Schedule ===\n')
  for (const task of tasks) {
    console.log(`  ${task.time} - ${task.name}`)
  }
  console.log('\n')

  // Check current time and skip past tasks
  const now = new Date()
  const currentMinutes = now.getHours() * 60 + now.getMinutes()

  for (const task of tasks) {
    const taskMinutes = task.hours * 60 + task.minutes
    if (taskMinutes < currentMinutes) {
      logger.warn('SCHEDULER', `Skipping ${task.name} (${task.time}) - time has passed`)
      task.completed = true
    }
  }

  // Run scheduler loop
  logger.info('SCHEDULER', `Starting launch day automation (dry run: ${dryRun})`)
  logger.info('SCHEDULER', `Product Hunt URL: ${phUrl}`)

  while (true) {
    const allCompleted = tasks.every(t => t.completed)
    if (allCompleted) {
      logger.success('SCHEDULER', 'All tasks completed!')
      break
    }

    const currentTime = new Date()
    const currentMins = currentTime.getHours() * 60 + currentTime.getMinutes()

    for (const task of tasks) {
      if (task.completed) continue

      const taskMins = task.hours * 60 + task.minutes
      if (currentMins >= taskMins) {
        logger.info('SCHEDULER', `Running: ${task.name} (${task.time})`)
        try {
          await task.action()
          task.completed = true
          logger.success('SCHEDULER', `Completed: ${task.name}`)
        } catch (error: any) {
          logger.error('SCHEDULER', `Failed: ${task.name} - ${error.message}`)
          task.completed = true // Mark as completed to avoid retrying
        }
      }
    }

    // Wait 1 minute before checking again
    await sleep(60000)
  }
}

// Run all tasks immediately (for testing or manual execution)
async function runAllTasksNow(phUrl: string, dryRun: boolean): Promise<void> {
  logger.info('LAUNCH', 'Running all tasks immediately...')

  const tweets = getLaunchTweets(phUrl)
  const redditPosts = getRedditPosts(phUrl)

  // Check Twitter configuration
  if (!isPlatformConfigured('twitter')) {
    logger.warn('TWITTER', 'Twitter not configured - skipping tweets')
  } else {
    // Post all tweets with delay between them
    for (const tweet of tweets) {
      logger.info('TWITTER', `Posting: ${tweet.id} (${tweet.time})`)
      const result = await postTweet(tweet.text, dryRun)
      if (result.success) {
        logger.success('TWITTER', `Posted: ${result.tweetId}`)
        stateManager.recordPost('twitter', `launch-${tweet.id}`, true, {
          title: tweet.text.substring(0, 50),
          url: result.tweetId ? `https://twitter.com/status/${result.tweetId}` : undefined,
        })
      } else {
        logger.error('TWITTER', `Failed: ${result.error}`)
      }
      await sleep(5000) // 5 second delay between tweets
    }
  }

  // Post to Reddit
  await postToRedditWithPuppeteer(redditPosts, dryRun)

  // Post to Hacker News
  await postToHackerNews(phUrl, dryRun)

  logger.success('LAUNCH', 'All tasks completed!')
}

// ============================================================================
// MAIN
// ============================================================================

async function main(): Promise<void> {
  const { phUrl, dryRun, skipSchedule } = parseArgs()

  console.log('\n')
  console.log('========================================')
  console.log('    LAUNCH DAY AUTOMATION')
  console.log('========================================')
  console.log(`Product Hunt: ${phUrl}`)
  console.log(`Site URL: ${SITE_URL}`)
  console.log(`Dry Run: ${dryRun}`)
  console.log(`Skip Schedule: ${skipSchedule}`)
  console.log('========================================\n')

  if (skipSchedule) {
    // Run all tasks immediately
    await runAllTasksNow(phUrl, dryRun)
  } else {
    // Run with schedule
    await runScheduledLaunch(phUrl, dryRun)
  }
}

main()
  .then(() => {
    console.log('\nLaunch day automation completed')
    process.exit(0)
  })
  .catch(error => {
    logger.error('LAUNCH', 'Fatal error', error)
    process.exit(1)
  })
