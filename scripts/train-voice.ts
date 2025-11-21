#!/usr/bin/env tsx
/**
 * Voice Training CLI
 * Run this to scrape @mrbrandonmills Instagram and create/update voice profile
 *
 * Usage:
 *   npm run train-voice          # Full training
 *   npm run train-voice --quick  # Quick update (skip if profile < 7 days old)
 */

// Load environment variables
import { config } from 'dotenv'
config({ path: '.env.local' })

import { InstagramVoiceScraper } from '../lib/voice-training/instagram-scraper'
import { VoiceProfileGenerator } from '../lib/voice-training/voice-profile-generator'
import { AuthenticContentGenerator } from '../lib/voice-training/authentic-content-generator'
import { PerformanceTracker } from '../lib/voice-training/performance-tracker'

const VOICE_PROFILE_PATH = './data/brandon-voice-profile.json'
const TRAINING_DATA_PATH = './data/instagram-training-data.json'

async function main() {
  const args = process.argv.slice(2)
  const isQuick = args.includes('--quick')

  console.log('🎨 BRANDON MILLS VOICE TRAINING')
  console.log('================================\n')

  // Check if quick mode and profile is recent
  if (isQuick) {
    try {
      const fs = await import('fs/promises')
      const stats = await fs.stat(VOICE_PROFILE_PATH)
      const age = Date.now() - stats.mtimeMs
      const days = age / (1000 * 60 * 60 * 24)

      if (days < 7) {
        console.log(`✓ Voice profile is ${days.toFixed(1)} days old (< 7 days)`)
        console.log('  Skipping training. Use without --quick to force update.')
        return
      }
    } catch (error) {
      // Profile doesn't exist, continue
    }
  }

  // Step 1: Scrape Instagram
  console.log('Step 1: Scraping @mrbrandonmills Instagram...')
  const scraper = new InstagramVoiceScraper()

  let posts
  try {
    posts = await scraper.scrapePosts(100) // Last 100 posts
    console.log(`✓ Scraped ${posts.length} posts\n`)
  } catch (error) {
    console.error('❌ Instagram scraping failed:', error)
    console.error('\nCheck:')
    console.error('  1. INSTAGRAM_ACCESS_TOKEN is set in .env.local')
    console.error('  2. INSTAGRAM_BUSINESS_ACCOUNT_ID is set in .env.local')
    console.error('  3. Token has required permissions')
    process.exit(1)
  }

  // Step 2: Analyze voice patterns
  console.log('Step 2: Analyzing voice patterns...')
  const voiceData = await scraper.analyzeVoice(posts)

  console.log('  Analysis complete:')
  console.log(`    - Total posts: ${voiceData.totalPosts}`)
  console.log(`    - Avg engagement: ${voiceData.avgEngagement.toFixed(2)}`)
  console.log(`    - Avg word count: ${voiceData.linguisticPatterns.avgWordCount}`)
  console.log(`    - Detected tones: ${voiceData.linguisticPatterns.sentimentTone.join(', ')}`)
  console.log('')

  // Save training data
  await scraper.saveTrainingData(voiceData, TRAINING_DATA_PATH)

  // Step 3: Generate voice profile with Gemini
  console.log('Step 3: Generating voice profile with Gemini...')
  const profileGen = new VoiceProfileGenerator()

  let profile
  try {
    profile = await profileGen.generateProfile(voiceData)
    console.log(`✓ Voice profile generated\n`)
  } catch (error) {
    console.error('❌ Profile generation failed:', error)
    console.error('\nCheck:')
    console.error('  1. GOOGLE_AI_API_KEY is set in .env.local')
    console.error('  2. Gemini API quota is available')
    process.exit(1)
  }

  // Save profile
  await profileGen.saveProfile(profile, VOICE_PROFILE_PATH)

  console.log('VOICE PROFILE SUMMARY')
  console.log('====================')
  console.log(`Tone: ${profile.tone.primary.join(', ')}`)
  console.log(`Intensity: ${profile.tone.intensity}/10`)
  console.log(`Authenticity: ${profile.tone.authenticity}/10`)
  console.log(`Style: ${profile.style.sentenceStructure}`)
  console.log(`Hashtag usage: ${profile.hashtagStyle.usage}`)
  console.log('')

  // Step 4: Test content generation
  console.log('Step 4: Testing content generation...')
  const contentGen = new AuthenticContentGenerator(profile)

  const testBrief = {
    type: 'poetry' as const,
    topic: 'Fine Lines poetry collection now available as museum-quality prints',
    link: 'https://brandonmills.com/shop',
    targetPlatform: 'instagram' as const
  }

  const testPosts = await contentGen.generateOptions(testBrief, 5)

  console.log('\nTEST GENERATION RESULTS:')
  console.log('=======================')
  console.log(contentGen.generateReport(testPosts))

  // Step 5: Show performance insights
  console.log('\nStep 5: Analyzing past performance...')
  const tracker = new PerformanceTracker()

  try {
    const insights = await tracker.analyzePatterns()

    console.log('PERFORMANCE INSIGHTS')
    console.log('===================')
    console.log('\nTop Categories:')
    insights.topCategories.forEach((cat, i) => {
      console.log(`  ${i + 1}. ${cat.category}: ${cat.avgEngagement.toFixed(2)} avg engagement`)
    })

    if (insights.topHashtags.length > 0) {
      console.log('\nTop Hashtags:')
      insights.topHashtags.slice(0, 5).forEach((tag, i) => {
        console.log(`  ${i + 1}. ${tag.tag}: ${tag.avgEngagement.toFixed(2)} avg engagement`)
      })
    }

    console.log('\nRecommendations:')
    insights.recommendations.forEach(rec => console.log(`  • ${rec}`))
  } catch (error) {
    console.log('  (No performance data yet - will build over time)')
  }

  console.log('\n✅ VOICE TRAINING COMPLETE')
  console.log('===========================')
  console.log(`Profile saved to: ${VOICE_PROFILE_PATH}`)
  console.log(`Training data saved to: ${TRAINING_DATA_PATH}`)
  console.log('\nThe cron job will now use this profile to generate authentic content.')
  console.log('Run this script weekly to keep the voice profile updated.')
}

main().catch(error => {
  console.error('Fatal error:', error)
  process.exit(1)
})
