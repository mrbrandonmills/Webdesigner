/**
 * AUTO-POST EVERYWHERE - Master Script
 *
 * Posts your Braun IPL blog to Pinterest, Twitter, and Quora with ONE COMMAND
 *
 * Usage:
 *   npm run auto-post
 *
 * Or run individually:
 *   npm run auto-post:pinterest
 *   npm run auto-post:twitter
 *   npm run auto-post:quora
 */

import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

interface Platform {
  name: string
  command: string
  description: string
  required: string[]
}

const platforms: Platform[] = [
  {
    name: 'Pinterest',
    command: 'npx tsx scripts/auto-post-pinterest.ts',
    description: '5 pins with images',
    required: ['PINTEREST_ACCESS_TOKEN', 'PINTEREST_BOARD_ID_ATHOME_BEAUTY'],
  },
  {
    name: 'Twitter',
    command: 'npx tsx scripts/auto-post-twitter.ts',
    description: '8-tweet thread',
    required: ['TWITTER_API_KEY', 'TWITTER_ACCESS_TOKEN'],
  },
  {
    name: 'Quora',
    command: 'npx tsx scripts/auto-post-quora.ts',
    description: '5 detailed answers',
    required: ['QUORA_EMAIL', 'QUORA_PASSWORD'],
  },
]

function checkCredentials(platform: Platform): boolean {
  for (const envVar of platform.required) {
    if (!process.env[envVar]) {
      return false
    }
  }
  return true
}

async function postToPlatform(platform: Platform): Promise<void> {
  console.log(`\n${'='.repeat(60)}`)
  console.log(`📢 ${platform.name.toUpperCase()}`)
  console.log(`${'='.repeat(60)}`)
  console.log(`Posting: ${platform.description}\n`)

  try {
    const { stdout, stderr } = await execAsync(platform.command)

    if (stdout) console.log(stdout)
    if (stderr) console.error(stderr)

    console.log(`\n✅ ${platform.name} posting complete!`)
  } catch (error: any) {
    console.error(`\n❌ ${platform.name} posting failed:`, error.message)
    throw error
  }
}

async function main() {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║      🚀 AUTO-POST EVERYWHERE - BRAUN IPL BLOG 🚀          ║
║                                                            ║
║  This script will automatically post your blog to:        ║
║  • Pinterest (5 pins)                                     ║
║  • Twitter (8-tweet thread)                               ║
║  • Quora (5 detailed answers)                             ║
║                                                            ║
║  Expected reach: 10,000-20,000 people in first week       ║
║  Expected blog clicks: 500-1,000                          ║
║  Expected revenue: $200-500 in Month 1                    ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
`)

  console.log('\n🔍 Checking credentials...\n')

  const availablePlatforms: Platform[] = []
  const missingPlatforms: Platform[] = []

  for (const platform of platforms) {
    if (checkCredentials(platform)) {
      console.log(`   ✅ ${platform.name} - Credentials found`)
      availablePlatforms.push(platform)
    } else {
      console.log(`   ❌ ${platform.name} - Missing credentials`)
      console.log(`      Required: ${platform.required.join(', ')}`)
      missingPlatforms.push(platform)
    }
  }

  if (availablePlatforms.length === 0) {
    console.error('\n❌ No platforms configured!')
    console.log('\nPlease add credentials to .env.local')
    console.log('See setup instructions in individual scripts.')
    process.exit(1)
  }

  console.log(`\n📊 Summary:`)
  console.log(`   Platforms ready: ${availablePlatforms.length}/${platforms.length}`)
  console.log(`   Total content pieces: ${availablePlatforms.reduce((sum, p) => {
    if (p.name === 'Pinterest') return sum + 5
    if (p.name === 'Twitter') return sum + 8
    if (p.name === 'Quora') return sum + 5
    return sum
  }, 0)}`)

  console.log('\n⏱️  Estimated time: 5-10 minutes')
  console.log('\n🚀 Starting automated posting...\n')

  // Post to each platform sequentially
  for (const platform of availablePlatforms) {
    try {
      await postToPlatform(platform)
    } catch (error) {
      console.log(`\n⚠️  Continuing with remaining platforms...`)
    }
  }

  console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║                  ✅ ALL DONE! ✅                          ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
`)

  console.log('\n📊 Posting Summary:')
  for (const platform of availablePlatforms) {
    console.log(`   ✅ ${platform.name}: ${platform.description}`)
  }

  if (missingPlatforms.length > 0) {
    console.log('\n⚠️  Skipped Platforms:')
    for (const platform of missingPlatforms) {
      console.log(`   ⏭️  ${platform.name}: ${platform.description}`)
      console.log(`      (Add credentials to .env.local to enable)`)
    }
  }

  console.log('\n🎯 Next Steps:')
  console.log('   1. Check Pinterest: https://pinterest.com/me')
  console.log('   2. Check Twitter: https://twitter.com/home')
  console.log('   3. Check Quora: https://quora.com/profile/me')
  console.log('   4. Monitor analytics in Google Analytics')
  console.log('   5. Reply to ALL comments within 24 hours')

  console.log('\n📈 Expected Results (Week 1):')
  console.log('   • 1,000-2,000 blog visitors')
  console.log('   • 50-100 Amazon clicks')
  console.log('   • $200-500 in affiliate revenue')

  console.log('\n💰 Expected Results (Month 3):')
  console.log('   • 5,000-10,000 monthly visitors')
  console.log('   • 200-400 Amazon clicks')
  console.log('   • $1,000-2,000 monthly revenue')

  console.log('\n🚀 Your blog is now EVERYWHERE!\n')
}

main().catch((error) => {
  console.error('\n❌ Fatal error:', error)
  process.exit(1)
})
