/**
 * AI Content Generator
 *
 * Uses OpenAI/Anthropic API to generate fresh content
 * - Creates new Reddit posts, tweets, Quora answers
 * - Saves to content folders
 * - Can generate a week's worth at once
 *
 * Usage:
 * - Run directly: npx tsx scripts/automation/content-generator.ts
 * - Generate specific type: npx tsx scripts/automation/content-generator.ts --type=reddit
 * - Generate week's content: npx tsx scripts/automation/content-generator.ts --count=7
 */

import * as fs from 'fs'
import * as path from 'path'
import {
  aiConfig,
  pathsConfig,
  siteConfig,
  targetSubreddits,
  twitterTopics,
} from './config'
import { logger } from './logger'
import { stateManager } from './state-manager'

interface GeneratedContent {
  reddit: RedditContent[]
  twitter: TwitterContent[]
  quora: QuoraContent[]
}

interface RedditContent {
  subreddit: string
  title: string
  text: string
}

interface TwitterContent {
  text: string
}

interface QuoraContent {
  keywords: string
  answer: string
}

// System prompts for content generation
const systemPrompts = {
  reddit: `You are a content creator for Brandon Mills, a photographer, artist, and writer who focuses on dream analysis, Jungian psychology, archetypes, and personal growth.

Generate engaging Reddit posts that:
- Provide genuine value and insights
- Feel authentic and personal, not salesy
- Include a natural mention of brandonmills.com tools/content when relevant
- Are appropriate for the specified subreddit
- Follow Reddit etiquette (no clickbait, be genuine)

The site offers:
- Dream Interpreter tool
- Archetype Quiz
- Dream Journal
- Meditations
- Blog posts on psychology, dreams, consciousness

Always write in first person, sharing genuine insights and experiences.`,

  twitter: `You are writing tweets for Brandon Mills, who focuses on dream analysis, Jungian psychology, archetypes, and personal growth.

Generate engaging tweets that:
- Are under 280 characters
- Provide a thought-provoking insight or tip
- Feel authentic and conversational
- May include a link to brandonmills.com when natural
- Use line breaks for readability

Topics to cover:
- Dream interpretation and symbolism
- Jungian archetypes (Shadow, Anima/Animus, Self, Persona)
- Shadow work and integration
- Lucid dreaming
- Meditation and mindfulness
- Personal growth and self-discovery

Don't use hashtags excessively. Focus on value over engagement tricks.`,

  quora: `You are answering questions on Quora as Brandon Mills, who has expertise in dream analysis, Jungian psychology, and personal growth.

Generate helpful, detailed Quora answers that:
- Directly address the question asked
- Provide genuine, actionable insights
- Are well-structured with clear sections
- Include personal experience where appropriate
- Naturally mention brandonmills.com resources when relevant
- Are 300-600 words (comprehensive but not overwhelming)

Write in first person, be genuine, and focus on actually helping the person asking.`,
}

// Generate content using OpenAI
async function generateWithOpenAI(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${aiConfig.openaiApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: 2000,
      temperature: 0.7,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`OpenAI API error: ${error}`)
  }

  const data = await response.json()
  return data.choices[0].message.content
}

// Generate content using Anthropic
async function generateWithAnthropic(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': aiConfig.anthropicApiKey,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 2000,
      system: systemPrompt,
      messages: [
        { role: 'user', content: userPrompt },
      ],
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Anthropic API error: ${error}`)
  }

  const data = await response.json()
  return data.content[0].text
}

// Main AI generation function
async function generateContent(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  // Prefer Anthropic if available, fall back to OpenAI
  if (aiConfig.anthropicApiKey) {
    return generateWithAnthropic(systemPrompt, userPrompt)
  } else if (aiConfig.openaiApiKey) {
    return generateWithOpenAI(systemPrompt, userPrompt)
  } else {
    throw new Error('No AI API key configured')
  }
}

// Generate Reddit posts
async function generateRedditPosts(count: number = 7): Promise<RedditContent[]> {
  logger.info('GENERATOR', `Generating ${count} Reddit posts`)

  const posts: RedditContent[] = []
  const usedSubreddits = new Set<string>()

  for (let i = 0; i < count; i++) {
    // Select subreddit (rotate through list)
    let subreddit = targetSubreddits[i % targetSubreddits.length]

    // Avoid repeating same subreddit
    while (usedSubreddits.has(subreddit) && usedSubreddits.size < targetSubreddits.length) {
      subreddit = targetSubreddits[Math.floor(Math.random() * targetSubreddits.length)]
    }
    usedSubreddits.add(subreddit)

    const userPrompt = `Generate a Reddit post for r/${subreddit}.

The post should:
- Be relevant to r/${subreddit}'s typical content
- Share a genuine insight, tip, or personal experience
- Be 200-400 words
- Include a natural call-to-action to ${siteConfig.baseUrl} if appropriate

Return the post in this exact format:
TITLE: [Your title here]
TEXT: [Your post text here]`

    try {
      const result = await generateContent(systemPrompts.reddit, userPrompt)

      // Parse the result
      const titleMatch = result.match(/TITLE:\s*(.+?)(?=\nTEXT:|$)/s)
      const textMatch = result.match(/TEXT:\s*(.+)/s)

      if (titleMatch && textMatch) {
        posts.push({
          subreddit,
          title: titleMatch[1].trim(),
          text: textMatch[1].trim(),
        })
        logger.info('GENERATOR', `Generated Reddit post for r/${subreddit}`)
      }
    } catch (error: any) {
      logger.error('GENERATOR', `Failed to generate Reddit post: ${error.message}`)
    }

    // Small delay between generations
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  return posts
}

// Generate tweets
async function generateTweets(count: number = 14): Promise<TwitterContent[]> {
  logger.info('GENERATOR', `Generating ${count} tweets`)

  const tweets: TwitterContent[] = []

  for (let i = 0; i < count; i++) {
    const topic = twitterTopics[i % twitterTopics.length]

    const userPrompt = `Generate a single tweet about ${topic}.

Requirements:
- Maximum 280 characters
- Provide one valuable insight or tip
- Use line breaks for readability
- Include ${siteConfig.baseUrl} if natural (not required)

Return only the tweet text, nothing else.`

    try {
      const result = await generateContent(systemPrompts.twitter, userPrompt)
      const tweetText = result.trim()

      if (tweetText && tweetText.length <= 280) {
        tweets.push({ text: tweetText })
        logger.info('GENERATOR', `Generated tweet about ${topic}`)
      } else if (tweetText.length > 280) {
        // Truncate if needed
        tweets.push({ text: tweetText.substring(0, 277) + '...' })
        logger.warn('GENERATOR', `Tweet truncated (was ${tweetText.length} chars)`)
      }
    } catch (error: any) {
      logger.error('GENERATOR', `Failed to generate tweet: ${error.message}`)
    }

    await new Promise(resolve => setTimeout(resolve, 500))
  }

  return tweets
}

// Generate Quora answers
async function generateQuoraAnswers(count: number = 5): Promise<QuoraContent[]> {
  logger.info('GENERATOR', `Generating ${count} Quora answers`)

  const answers: QuoraContent[] = []

  const questionTopics = [
    'dream interpretation meaning',
    'understanding dreams psychology',
    'shadow work exercises',
    'Jungian archetypes explained',
    'lucid dreaming techniques',
    'recurring dreams meaning',
    'meditation for self-discovery',
    'personal growth practices',
    'unconscious mind psychology',
    'dream symbols interpretation',
  ]

  for (let i = 0; i < count; i++) {
    const keywords = questionTopics[i % questionTopics.length]

    const userPrompt = `Generate a Quora answer for a question about "${keywords}".

The answer should:
- Be 300-600 words
- Be well-structured with clear sections
- Provide actionable insights
- Include personal experience
- Naturally mention ${siteConfig.baseUrl} resources when relevant

Return the answer text only, formatted with proper paragraphs and bullet points where appropriate.`

    try {
      const result = await generateContent(systemPrompts.quora, userPrompt)

      answers.push({
        keywords,
        answer: result.trim(),
      })
      logger.info('GENERATOR', `Generated Quora answer for: ${keywords}`)
    } catch (error: any) {
      logger.error('GENERATOR', `Failed to generate Quora answer: ${error.message}`)
    }

    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  return answers
}

// Save generated content to files
function saveContent(content: GeneratedContent): void {
  // Save Reddit posts
  if (content.reddit.length > 0) {
    const redditPath = pathsConfig.redditPosts
    const existingContent = fs.existsSync(redditPath)
      ? fs.readFileSync(redditPath, 'utf-8')
      : ''

    let newContent = existingContent
    for (const post of content.reddit) {
      const postBlock = `
---
subreddit: ${post.subreddit}
title: "${post.title}"
text: ${post.text}
`
      newContent += postBlock
    }

    fs.writeFileSync(redditPath, newContent)
    logger.success('GENERATOR', `Saved ${content.reddit.length} Reddit posts to ${redditPath}`)
  }

  // Save tweets
  if (content.twitter.length > 0) {
    const twitterDir = path.join(pathsConfig.contentDir, 'twitter')
    if (!fs.existsSync(twitterDir)) {
      fs.mkdirSync(twitterDir, { recursive: true })
    }

    const tweetsPath = path.join(twitterDir, 'tweets.md')
    const existingContent = fs.existsSync(tweetsPath)
      ? fs.readFileSync(tweetsPath, 'utf-8')
      : ''

    let newContent = existingContent
    for (const tweet of content.twitter) {
      newContent += `\n---\n${tweet.text}\n`
    }

    fs.writeFileSync(tweetsPath, newContent)
    logger.success('GENERATOR', `Saved ${content.twitter.length} tweets to ${tweetsPath}`)
  }

  // Save Quora answers
  if (content.quora.length > 0) {
    const quoraPath = pathsConfig.quoraAnswers
    const existingContent = fs.existsSync(quoraPath)
      ? fs.readFileSync(quoraPath, 'utf-8')
      : ''

    let newContent = existingContent
    for (const answer of content.quora) {
      const answerBlock = `
---
keywords: ${answer.keywords}
answer: ${answer.answer}
`
      newContent += answerBlock
    }

    fs.writeFileSync(quoraPath, newContent)
    logger.success('GENERATOR', `Saved ${content.quora.length} Quora answers to ${quoraPath}`)
  }
}

// Main generation function
export async function generateAllContent(options: {
  reddit?: number
  twitter?: number
  quora?: number
} = {}): Promise<GeneratedContent> {
  const redditCount = options.reddit ?? 7
  const twitterCount = options.twitter ?? 14
  const quoraCount = options.quora ?? 5

  logger.info('GENERATOR', 'Starting content generation')
  logger.info('GENERATOR', `Targets: ${redditCount} Reddit, ${twitterCount} Twitter, ${quoraCount} Quora`)

  // Check for AI credentials
  if (!aiConfig.openaiApiKey && !aiConfig.anthropicApiKey) {
    logger.error('GENERATOR', 'No AI API key configured')
    throw new Error('Set OPENAI_API_KEY or ANTHROPIC_API_KEY in .env.local')
  }

  const content: GeneratedContent = {
    reddit: [],
    twitter: [],
    quora: [],
  }

  // Generate all content
  if (redditCount > 0) {
    content.reddit = await generateRedditPosts(redditCount)
  }

  if (twitterCount > 0) {
    content.twitter = await generateTweets(twitterCount)
  }

  if (quoraCount > 0) {
    content.quora = await generateQuoraAnswers(quoraCount)
  }

  // Save to files
  saveContent(content)

  // Record generation
  const totalGenerated = content.reddit.length + content.twitter.length + content.quora.length
  stateManager.recordContentGeneration(totalGenerated)

  logger.success('GENERATOR', `Content generation complete!`)
  logger.info('GENERATOR', `Generated: ${content.reddit.length} Reddit, ${content.twitter.length} Twitter, ${content.quora.length} Quora`)

  return content
}

// Generate content for specific platform
export async function generateForPlatform(
  platform: 'reddit' | 'twitter' | 'quora',
  count: number = 7
): Promise<void> {
  const options = { [platform]: count }
  await generateAllContent(options)
}

// Get generation status
export function getGeneratorStatus(): {
  lastGenerated: string
  totalGenerated: number
  aiConfigured: boolean
} {
  const genInfo = stateManager.getLastGeneration()

  return {
    lastGenerated: genInfo.lastGenerated || 'Never',
    totalGenerated: genInfo.count,
    aiConfigured: !!(aiConfig.openaiApiKey || aiConfig.anthropicApiKey),
  }
}

// Parse command line arguments
function parseArgs(): { type?: string; count?: number } {
  const args = process.argv.slice(2)
  const result: { type?: string; count?: number } = {}

  for (const arg of args) {
    if (arg.startsWith('--type=')) {
      result.type = arg.replace('--type=', '')
    } else if (arg.startsWith('--count=')) {
      result.count = parseInt(arg.replace('--count=', ''), 10)
    }
  }

  return result
}

// Run directly
if (require.main === module) {
  const args = parseArgs()

  let promise: Promise<any>

  if (args.type) {
    const platform = args.type as 'reddit' | 'twitter' | 'quora'
    const count = args.count || 7
    promise = generateForPlatform(platform, count)
  } else {
    const count = args.count || 7
    promise = generateAllContent({
      reddit: count,
      twitter: count * 2,
      quora: Math.ceil(count * 0.7),
    })
  }

  promise
    .then(() => {
      console.log('\nContent generation completed')
      process.exit(0)
    })
    .catch(error => {
      logger.error('GENERATOR', 'Fatal error', error)
      process.exit(1)
    })
}

export default generateAllContent
