/**
 * Automation Configuration
 *
 * Centralized configuration for all automation scripts
 * Environment variables and shared settings
 */

import * as fs from 'fs'
import * as path from 'path'

// Load environment variables
const dotenvPath = path.join(process.cwd(), '.env.local')
if (fs.existsSync(dotenvPath)) {
  const envContent = fs.readFileSync(dotenvPath, 'utf-8')
  envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=')
    if (key && valueParts.length > 0) {
      const value = valueParts.join('=').trim()
      if (!process.env[key.trim()]) {
        process.env[key.trim()] = value
      }
    }
  })
}

// Reddit Configuration
export const redditConfig = {
  clientId: process.env.REDDIT_CLIENT_ID || '',
  clientSecret: process.env.REDDIT_CLIENT_SECRET || '',
  username: process.env.REDDIT_USERNAME || '',
  password: process.env.REDDIT_PASSWORD || '',
  userAgent: 'BrandonMillsAutomation/2.0',
}

// Twitter Configuration
export const twitterConfig = {
  apiKey: process.env.TWITTER_API_KEY || '',
  apiSecret: process.env.TWITTER_API_SECRET || '',
  accessToken: process.env.TWITTER_ACCESS_TOKEN || '',
  accessSecret: process.env.TWITTER_ACCESS_SECRET || '',
}

// Quora Configuration
export const quoraConfig = {
  email: process.env.QUORA_EMAIL || '',
  password: process.env.QUORA_PASSWORD || '',
}

// OpenAI/Anthropic for content generation
export const aiConfig = {
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  anthropicApiKey: process.env.ANTHROPIC_API_KEY || '',
}

// Site Configuration
export const siteConfig = {
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'https://brandonmills.com',
  siteName: 'Brandon Mills',
}

// Paths Configuration
export const pathsConfig = {
  projectRoot: process.cwd(),
  contentDir: path.join(process.cwd(), 'content'),
  logsDir: path.join(process.cwd(), 'logs'),
  redditPosts: path.join(process.cwd(), 'content', 'reddit', 'posts.md'),
  redditSchedule: path.join(process.cwd(), 'content', 'reddit', 'schedule.md'),
  quoraAnswers: path.join(process.cwd(), 'content', 'quora', 'answers.md'),
  twitterContent: path.join(process.cwd(), 'content', 'twitter'),
  automationState: path.join(process.cwd(), 'data', 'automation-state.json'),
}

// Schedule Configuration
export const scheduleConfig = {
  // Times in UTC
  redditPostTime: '14:00', // 10 AM EST
  twitterPostTime: '16:00', // 12 PM EST
  quoraPostTime: '18:00', // 2 PM EST
  contentGenerationTime: '08:00', // 4 AM EST - generate before posting
}

// Rate Limiting Configuration
export const rateLimitConfig = {
  reddit: {
    minDelayBetweenPosts: 60000, // 1 minute
    maxPostsPerDay: 5,
    cooldownAfterError: 300000, // 5 minutes
  },
  twitter: {
    minDelayBetweenTweets: 3000, // 3 seconds
    maxTweetsPerDay: 50,
    cooldownAfterError: 60000, // 1 minute
  },
  quora: {
    minDelayBetweenAnswers: 30000, // 30 seconds
    maxAnswersPerDay: 3,
    cooldownAfterError: 300000, // 5 minutes
  },
}

// Retry Configuration
export const retryConfig = {
  maxRetries: 3,
  initialDelay: 1000, // 1 second
  maxDelay: 30000, // 30 seconds
  backoffMultiplier: 2,
}

// Subreddits for rotation
export const targetSubreddits = [
  'malegrooming',
  'SkincareAddiction',
  'selfimprovement',
  'beards',
  'wicked_edge',
  'DreamInterpretation',
  'Dreams',
  'Jung',
  'LucidDreaming',
  'Meditation',
  'Mindfulness',
  'spirituality',
  'psychology',
  'StonerPhilosophy',
]

// Twitter topics for content generation
export const twitterTopics = [
  'dream analysis',
  'Jungian archetypes',
  'shadow work',
  'lucid dreaming',
  'dream symbolism',
  'collective unconscious',
  'personal growth',
  'mindfulness',
  'meditation',
  'self-discovery',
]

// Validate configuration
export function validateConfig(): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  // Check Reddit credentials
  if (!redditConfig.clientId) errors.push('REDDIT_CLIENT_ID not set')
  if (!redditConfig.clientSecret) errors.push('REDDIT_CLIENT_SECRET not set')
  if (!redditConfig.username) errors.push('REDDIT_USERNAME not set')
  if (!redditConfig.password) errors.push('REDDIT_PASSWORD not set')

  // Check Twitter credentials
  if (!twitterConfig.apiKey) errors.push('TWITTER_API_KEY not set')
  if (!twitterConfig.apiSecret) errors.push('TWITTER_API_SECRET not set')
  if (!twitterConfig.accessToken) errors.push('TWITTER_ACCESS_TOKEN not set')
  if (!twitterConfig.accessSecret) errors.push('TWITTER_ACCESS_SECRET not set')

  // Check Quora credentials
  if (!quoraConfig.email) errors.push('QUORA_EMAIL not set')
  if (!quoraConfig.password) errors.push('QUORA_PASSWORD not set')

  // Check AI credentials (at least one should be set for content generation)
  if (!aiConfig.openaiApiKey && !aiConfig.anthropicApiKey) {
    errors.push('Neither OPENAI_API_KEY nor ANTHROPIC_API_KEY is set')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

// Check if specific platform is configured
export function isPlatformConfigured(platform: 'reddit' | 'twitter' | 'quora'): boolean {
  switch (platform) {
    case 'reddit':
      return !!(redditConfig.clientId && redditConfig.clientSecret &&
                redditConfig.username && redditConfig.password)
    case 'twitter':
      return !!(twitterConfig.apiKey && twitterConfig.apiSecret &&
                twitterConfig.accessToken && twitterConfig.accessSecret)
    case 'quora':
      return !!(quoraConfig.email && quoraConfig.password)
    default:
      return false
  }
}

export default {
  reddit: redditConfig,
  twitter: twitterConfig,
  quora: quoraConfig,
  ai: aiConfig,
  site: siteConfig,
  paths: pathsConfig,
  schedule: scheduleConfig,
  rateLimit: rateLimitConfig,
  retry: retryConfig,
  subreddits: targetSubreddits,
  topics: twitterTopics,
  validate: validateConfig,
  isPlatformConfigured,
}
