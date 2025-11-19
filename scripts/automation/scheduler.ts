/**
 * Automation Scheduler
 *
 * Main scheduler that runs all automation tasks on a schedule
 * Uses node-cron for scheduling
 *
 * Usage:
 * - Run scheduler: npm run automate
 * - Run once (all): npx tsx scripts/automation/scheduler.ts --once
 * - Run specific platform: npx tsx scripts/automation/scheduler.ts --platform=reddit
 * - Show status: npx tsx scripts/automation/scheduler.ts --status
 *
 * Schedule (default times in UTC):
 * - 08:00 - Content generation (if needed)
 * - 14:00 - Reddit post
 * - 16:00 - Twitter post
 * - 18:00 - Quora post
 */

import * as cron from 'node-cron'
import {
  scheduleConfig,
  validateConfig,
  isPlatformConfigured,
  rateLimitConfig,
} from './config'
import { logger } from './logger'
import { stateManager } from './state-manager'
import { postToReddit, getRedditStatus } from './reddit-poster'
import { postToTwitter, getTwitterStatus } from './twitter-poster'
import { postToQuora, getQuoraStatus } from './quora-poster'
import { generateAllContent, getGeneratorStatus } from './content-generator'

// Track running state
let isRunning = false
let scheduledJobs: cron.ScheduledTask[] = []

// Display banner
function displayBanner(): void {
  console.log(`
================================================================================
                    BRANDON MILLS CONTENT AUTOMATION
================================================================================

  Automated posting to Reddit, Twitter, and Quora with AI content generation.

  Schedule (UTC):
    - ${scheduleConfig.contentGenerationTime} - Content Generation
    - ${scheduleConfig.redditPostTime} - Reddit Post
    - ${scheduleConfig.twitterPostTime} - Twitter Post
    - ${scheduleConfig.quoraPostTime} - Quora Post

================================================================================
`)
}

// Display current status
function displayStatus(): void {
  console.log('\n--- AUTOMATION STATUS ---\n')

  // Configuration status
  const configResult = validateConfig()
  console.log('Configuration:')
  if (configResult.valid) {
    console.log('  [+] All credentials configured')
  } else {
    console.log('  [!] Missing credentials:')
    configResult.errors.forEach(err => console.log(`      - ${err}`))
  }

  // Platform status
  console.log('\nPlatform Status:')

  const redditStatus = getRedditStatus()
  console.log(`  Reddit:`)
  console.log(`    Configured: ${redditStatus.configured ? 'Yes' : 'No'}`)
  console.log(`    Posts today: ${redditStatus.postsToday}/${rateLimitConfig.reddit.maxPostsPerDay}`)
  console.log(`    Total posts: ${redditStatus.totalPosts}`)
  console.log(`    Available content: ${redditStatus.availableContent}`)

  const twitterStatus = getTwitterStatus()
  console.log(`  Twitter:`)
  console.log(`    Configured: ${twitterStatus.configured ? 'Yes' : 'No'}`)
  console.log(`    Posts today: ${twitterStatus.postsToday}/${rateLimitConfig.twitter.maxTweetsPerDay}`)
  console.log(`    Total posts: ${twitterStatus.totalPosts}`)
  console.log(`    Available content: ${twitterStatus.availableContent}`)

  const quoraStatus = getQuoraStatus()
  console.log(`  Quora:`)
  console.log(`    Configured: ${quoraStatus.configured ? 'Yes' : 'No'}`)
  console.log(`    Posts today: ${quoraStatus.postsToday}/${rateLimitConfig.quora.maxAnswersPerDay}`)
  console.log(`    Total posts: ${quoraStatus.totalPosts}`)
  console.log(`    Available content: ${quoraStatus.availableContent}`)

  // Generator status
  const genStatus = getGeneratorStatus()
  console.log(`\nContent Generator:`)
  console.log(`    AI configured: ${genStatus.aiConfigured ? 'Yes' : 'No'}`)
  console.log(`    Last generated: ${genStatus.lastGenerated}`)
  console.log(`    Total generated: ${genStatus.totalGenerated}`)

  // Recent activity
  const recentPosts = stateManager.getRecentPosts(undefined, 10)
  if (recentPosts.length > 0) {
    console.log('\nRecent Activity:')
    recentPosts.slice(-5).reverse().forEach(post => {
      const status = post.success ? '[+]' : '[x]'
      const time = new Date(post.postedAt).toLocaleString()
      console.log(`    ${status} ${post.platform.toUpperCase()} - ${time}`)
      if (post.title) {
        console.log(`        ${post.title.substring(0, 50)}...`)
      }
    })
  }

  console.log('\n--- END STATUS ---\n')
}

// Convert time string to cron expression
function timeToCron(time: string): string {
  const [hours, minutes] = time.split(':')
  return `${minutes} ${hours} * * *`
}

// Run content generation if needed
async function runContentGeneration(): Promise<void> {
  logger.info('SCHEDULER', 'Checking if content generation is needed')

  const redditStatus = getRedditStatus()
  const twitterStatus = getTwitterStatus()
  const quoraStatus = getQuoraStatus()
  const genStatus = getGeneratorStatus()

  // Check if we need more content
  const needsReddit = redditStatus.availableContent < 7
  const needsTwitter = twitterStatus.availableContent < 14
  const needsQuora = quoraStatus.availableContent < 5

  // Check if AI is configured
  if (!genStatus.aiConfigured) {
    logger.warn('SCHEDULER', 'AI not configured, skipping content generation')
    return
  }

  // Check last generation time (don't generate more than once per day)
  if (genStatus.lastGenerated) {
    const lastGen = new Date(genStatus.lastGenerated)
    const now = new Date()
    const hoursSince = (now.getTime() - lastGen.getTime()) / (1000 * 60 * 60)

    if (hoursSince < 24) {
      logger.info('SCHEDULER', 'Content generated recently, skipping')
      return
    }
  }

  if (needsReddit || needsTwitter || needsQuora) {
    logger.info('SCHEDULER', 'Generating new content')
    try {
      await generateAllContent({
        reddit: needsReddit ? 7 : 0,
        twitter: needsTwitter ? 14 : 0,
        quora: needsQuora ? 5 : 0,
      })
    } catch (error: any) {
      logger.error('SCHEDULER', `Content generation failed: ${error.message}`)
    }
  } else {
    logger.info('SCHEDULER', 'Sufficient content available')
  }
}

// Run all posts once
async function runOnce(platform?: string): Promise<void> {
  logger.info('SCHEDULER', `Running automation once${platform ? ` for ${platform}` : ''}`)

  if (!platform || platform === 'generate') {
    await runContentGeneration()
  }

  if (!platform || platform === 'reddit') {
    if (isPlatformConfigured('reddit')) {
      await postToReddit(1)
    } else {
      logger.warn('SCHEDULER', 'Reddit not configured, skipping')
    }
  }

  if (!platform || platform === 'twitter') {
    if (isPlatformConfigured('twitter')) {
      await postToTwitter(1)
    } else {
      logger.warn('SCHEDULER', 'Twitter not configured, skipping')
    }
  }

  if (!platform || platform === 'quora') {
    if (isPlatformConfigured('quora')) {
      await postToQuora(1)
    } else {
      logger.warn('SCHEDULER', 'Quora not configured, skipping')
    }
  }

  logger.success('SCHEDULER', 'Single run completed')
}

// Start the scheduler
function startScheduler(): void {
  if (isRunning) {
    logger.warn('SCHEDULER', 'Scheduler is already running')
    return
  }

  logger.schedulerStarted()
  isRunning = true

  // Rotate logs on startup
  logger.rotateIfNeeded(10)

  // Schedule content generation
  const genCron = timeToCron(scheduleConfig.contentGenerationTime)
  const genJob = cron.schedule(genCron, async () => {
    logger.info('SCHEDULER', 'Triggered: Content generation')
    await runContentGeneration()
  })
  scheduledJobs.push(genJob)
  logger.taskScheduled('Content Generation', scheduleConfig.contentGenerationTime)

  // Schedule Reddit posting
  if (isPlatformConfigured('reddit')) {
    const redditCron = timeToCron(scheduleConfig.redditPostTime)
    const redditJob = cron.schedule(redditCron, async () => {
      logger.info('SCHEDULER', 'Triggered: Reddit post')
      await postToReddit(1)
    })
    scheduledJobs.push(redditJob)
    logger.taskScheduled('Reddit', scheduleConfig.redditPostTime)
  } else {
    logger.warn('SCHEDULER', 'Reddit not configured, not scheduling')
  }

  // Schedule Twitter posting
  if (isPlatformConfigured('twitter')) {
    const twitterCron = timeToCron(scheduleConfig.twitterPostTime)
    const twitterJob = cron.schedule(twitterCron, async () => {
      logger.info('SCHEDULER', 'Triggered: Twitter post')
      await postToTwitter(1)
    })
    scheduledJobs.push(twitterJob)
    logger.taskScheduled('Twitter', scheduleConfig.twitterPostTime)
  } else {
    logger.warn('SCHEDULER', 'Twitter not configured, not scheduling')
  }

  // Schedule Quora posting
  if (isPlatformConfigured('quora')) {
    const quoraCron = timeToCron(scheduleConfig.quoraPostTime)
    const quoraJob = cron.schedule(quoraCron, async () => {
      logger.info('SCHEDULER', 'Triggered: Quora post')
      await postToQuora(1)
    })
    scheduledJobs.push(quoraJob)
    logger.taskScheduled('Quora', scheduleConfig.quoraPostTime)
  } else {
    logger.warn('SCHEDULER', 'Quora not configured, not scheduling')
  }

  console.log('\nScheduler is running. Press Ctrl+C to stop.\n')
  console.log('Logs: logs/automation.log')
  console.log('')
}

// Stop the scheduler
function stopScheduler(): void {
  logger.schedulerStopped()
  isRunning = false

  scheduledJobs.forEach(job => job.stop())
  scheduledJobs = []

  console.log('\nScheduler stopped.')
}

// Handle graceful shutdown
function setupShutdownHandlers(): void {
  process.on('SIGINT', () => {
    console.log('\n\nReceived SIGINT signal')
    stopScheduler()
    process.exit(0)
  })

  process.on('SIGTERM', () => {
    console.log('\n\nReceived SIGTERM signal')
    stopScheduler()
    process.exit(0)
  })
}

// Parse command line arguments
function parseArgs(): {
  once: boolean
  status: boolean
  platform?: string
  help: boolean
} {
  const args = process.argv.slice(2)
  const result = {
    once: false,
    status: false,
    platform: undefined as string | undefined,
    help: false,
  }

  for (const arg of args) {
    if (arg === '--once' || arg === '-o') {
      result.once = true
    } else if (arg === '--status' || arg === '-s') {
      result.status = true
    } else if (arg === '--help' || arg === '-h') {
      result.help = true
    } else if (arg.startsWith('--platform=')) {
      result.platform = arg.replace('--platform=', '')
    }
  }

  return result
}

// Display help
function displayHelp(): void {
  console.log(`
Usage: npx tsx scripts/automation/scheduler.ts [options]

Options:
  --once, -o            Run all tasks once and exit
  --platform=NAME       Run specific platform only (reddit, twitter, quora, generate)
  --status, -s          Display current status and exit
  --help, -h            Display this help message

Examples:
  npx tsx scripts/automation/scheduler.ts              Start the scheduler
  npx tsx scripts/automation/scheduler.ts --once       Run all tasks once
  npx tsx scripts/automation/scheduler.ts --platform=reddit    Run Reddit only
  npx tsx scripts/automation/scheduler.ts --status     Show current status

Environment Variables Required:
  REDDIT_CLIENT_ID, REDDIT_CLIENT_SECRET, REDDIT_USERNAME, REDDIT_PASSWORD
  TWITTER_API_KEY, TWITTER_API_SECRET, TWITTER_ACCESS_TOKEN, TWITTER_ACCESS_SECRET
  QUORA_EMAIL, QUORA_PASSWORD
  OPENAI_API_KEY or ANTHROPIC_API_KEY (for content generation)
`)
}

// Main entry point
async function main(): Promise<void> {
  const args = parseArgs()

  // Display help
  if (args.help) {
    displayHelp()
    return
  }

  // Display banner
  displayBanner()

  // Display status
  if (args.status) {
    displayStatus()
    return
  }

  // Run once mode
  if (args.once || args.platform) {
    await runOnce(args.platform)
    return
  }

  // Start scheduler mode
  setupShutdownHandlers()
  displayStatus()
  startScheduler()

  // Keep the process running
  await new Promise(() => {})
}

// Export functions for programmatic use
export {
  startScheduler,
  stopScheduler,
  runOnce,
  displayStatus,
}

// Run main
main().catch(error => {
  logger.error('SCHEDULER', 'Fatal error', error)
  process.exit(1)
})
