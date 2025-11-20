/**
 * Multi-Platform Poster
 *
 * Unified automation that posts to all configured platforms.
 * Handles scheduling, rate limiting, and error recovery.
 *
 * Usage:
 *   npx tsx scripts/automation/multi-platform-poster.ts
 *   npx tsx scripts/automation/multi-platform-poster.ts --platforms=twitter,reddit,linkedin
 *   npx tsx scripts/automation/multi-platform-poster.ts --dry-run
 */

import { postToTwitter, getTwitterStatus } from './twitter-poster'
import { postToReddit, getRedditStatus } from './reddit-poster'
import { postToLinkedIn, getLinkedInStatus } from './linkedin-poster'
import { postToPinterest, getPinterestStatus } from './pinterest-poster'
import { postToQuora, getQuoraStatus } from './quora-poster'
import { postToHackerNews, getHackerNewsStatus } from './hackernews-poster'
import { logger } from './logger'

interface PlatformConfig {
  name: string
  enabled: boolean
  getStatus: () => any
  post: (count: number) => Promise<void>
  dailyLimit: number
  postCount: number
}

const platforms: PlatformConfig[] = [
  {
    name: 'twitter',
    enabled: !!process.env.TWITTER_API_KEY,
    getStatus: getTwitterStatus,
    post: postToTwitter,
    dailyLimit: 10,
    postCount: 2
  },
  {
    name: 'linkedin',
    enabled: !!process.env.LINKEDIN_ACCESS_TOKEN,
    getStatus: getLinkedInStatus,
    post: postToLinkedIn,
    dailyLimit: 3,
    postCount: 1
  },
  {
    name: 'pinterest',
    enabled: !!process.env.PINTEREST_ACCESS_TOKEN,
    getStatus: getPinterestStatus,
    post: postToPinterest,
    dailyLimit: 10,
    postCount: 3
  },
  {
    name: 'reddit',
    enabled: !!(process.env.REDDIT_USERNAME && process.env.REDDIT_PASSWORD),
    getStatus: getRedditStatus,
    post: postToReddit,
    dailyLimit: 3,
    postCount: 1
  },
  {
    name: 'quora',
    enabled: !!(process.env.QUORA_EMAIL && process.env.QUORA_PASSWORD),
    getStatus: getQuoraStatus,
    post: postToQuora,
    dailyLimit: 3,
    postCount: 1
  },
  {
    name: 'hackernews',
    enabled: !!(process.env.HN_USERNAME && process.env.HN_PASSWORD),
    getStatus: getHackerNewsStatus,
    post: postToHackerNews,
    dailyLimit: 2,
    postCount: 1
  }
]

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2)
  const result = {
    platforms: [] as string[],
    dryRun: false
  }

  for (const arg of args) {
    if (arg === '--dry-run') {
      result.dryRun = true
    } else if (arg.startsWith('--platforms=')) {
      result.platforms = arg.replace('--platforms=', '').split(',')
    }
  }

  return result
}

// Get all platform statuses
function getAllStatus() {
  console.log('\n📊 Platform Status:\n')

  for (const platform of platforms) {
    const status = platform.getStatus()
    const icon = status.configured ? '✅' : '❌'
    console.log(`${icon} ${platform.name.toUpperCase()}`)
    console.log(`   Configured: ${status.configured}`)
    console.log(`   Posts Today: ${status.postsToday}`)
    console.log(`   Total Posts: ${status.totalPosts}`)
    console.log(`   Available Content: ${status.availableContent}`)
    console.log('')
  }
}

// Main multi-platform posting function
async function postToAllPlatforms(options: {
  platforms?: string[]
  dryRun?: boolean
} = {}): Promise<void> {
  console.log('\n🚀 Multi-Platform Poster\n')
  console.log('=' .repeat(50))

  // Filter platforms
  let activePlatforms = platforms.filter(p => p.enabled)

  if (options.platforms && options.platforms.length > 0) {
    activePlatforms = activePlatforms.filter(p =>
      options.platforms!.includes(p.name)
    )
  }

  if (activePlatforms.length === 0) {
    console.log('\n❌ No platforms configured or selected')
    console.log('\nRequired environment variables:')
    console.log('  Twitter: TWITTER_API_KEY, TWITTER_API_SECRET, TWITTER_ACCESS_TOKEN, TWITTER_ACCESS_SECRET')
    console.log('  LinkedIn: LINKEDIN_ACCESS_TOKEN')
    console.log('  Pinterest: PINTEREST_ACCESS_TOKEN')
    console.log('  Reddit: REDDIT_USERNAME, REDDIT_PASSWORD')
    console.log('  Quora: QUORA_EMAIL, QUORA_PASSWORD')
    return
  }

  console.log(`\n📋 Active platforms: ${activePlatforms.map(p => p.name).join(', ')}`)

  if (options.dryRun) {
    console.log('\n🔍 DRY RUN - No posts will be created\n')
    getAllStatus()
    return
  }

  // Post to each platform
  const results: { platform: string; success: boolean; error?: string }[] = []

  for (const platform of activePlatforms) {
    console.log(`\n${'='.repeat(50)}`)
    console.log(`📤 Posting to ${platform.name.toUpperCase()}`)
    console.log('='.repeat(50))

    try {
      // Check daily limit
      const status = platform.getStatus()
      if (status.postsToday >= platform.dailyLimit) {
        console.log(`⚠️  Daily limit reached (${platform.dailyLimit}), skipping`)
        results.push({ platform: platform.name, success: false, error: 'Daily limit reached' })
        continue
      }

      // Check available content
      if (status.availableContent === 0) {
        console.log('⚠️  No content available, skipping')
        results.push({ platform: platform.name, success: false, error: 'No content available' })
        continue
      }

      // Calculate how many to post
      const remaining = platform.dailyLimit - status.postsToday
      const toPost = Math.min(platform.postCount, remaining, status.availableContent)

      await platform.post(toPost)
      results.push({ platform: platform.name, success: true })

    } catch (error: any) {
      console.error(`❌ Error: ${error.message}`)
      results.push({ platform: platform.name, success: false, error: error.message })
    }

    // Wait between platforms
    if (activePlatforms.indexOf(platform) < activePlatforms.length - 1) {
      console.log('\n⏳ Waiting 30 seconds before next platform...')
      await new Promise(resolve => setTimeout(resolve, 30000))
    }
  }

  // Summary
  console.log('\n' + '='.repeat(50))
  console.log('📊 SUMMARY')
  console.log('='.repeat(50))

  const successful = results.filter(r => r.success).length
  const failed = results.filter(r => !r.success).length

  console.log(`\n✅ Successful: ${successful}`)
  console.log(`❌ Failed: ${failed}`)

  for (const result of results) {
    const icon = result.success ? '✅' : '❌'
    const errorMsg = result.error ? ` (${result.error})` : ''
    console.log(`   ${icon} ${result.platform}${errorMsg}`)
  }

  console.log('')
}

// Status command
async function showStatus(): Promise<void> {
  getAllStatus()
}

// Export functions
export { postToAllPlatforms, showStatus }

// Run directly
if (require.main === module) {
  const args = parseArgs()

  if (args.dryRun || process.argv.includes('--status')) {
    showStatus()
  } else {
    postToAllPlatforms({
      platforms: args.platforms.length > 0 ? args.platforms : undefined,
      dryRun: args.dryRun
    }).then(() => {
      console.log('\n✨ Multi-platform posting completed\n')
      process.exit(0)
    }).catch(err => {
      console.error('Error:', err)
      process.exit(1)
    })
  }
}
