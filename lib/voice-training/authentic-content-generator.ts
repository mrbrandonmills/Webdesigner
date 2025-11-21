/**
 * Authentic Content Generator
 * Generates posts that sound EXACTLY like Brandon, not generic marketing
 * Only posts if Brandon-ness score > 95%
 */

import { GoogleGenerativeAI } from '@google/generative-ai'
import type { BrandonVoiceProfile } from './voice-profile-generator'

export interface GeneratedPost {
  id: string
  content: string
  hashtags: string[]
  brandonScore: number        // 0-100: How much it sounds like Brandon
  reasoning: string           // Why this score
  targetPlatform: 'instagram' | 'twitter' | 'pinterest'
  category: string            // 'poetry', 'philosophy', 'art', 'product'
}

export interface ContentBrief {
  type: 'product' | 'poetry' | 'philosophy' | 'photography' | 'general'
  topic: string              // e.g., "Fine Lines poetry print"
  link?: string              // Optional product link
  targetPlatform: 'instagram' | 'twitter' | 'pinterest'
}

export class AuthenticContentGenerator {
  private gemini: GoogleGenerativeAI
  private model: any
  private voiceProfile: BrandonVoiceProfile
  private MIN_BRANDON_SCORE = 95  // Only post if ≥ 95% Brandon-like

  constructor(voiceProfile: BrandonVoiceProfile) {
    const apiKey = process.env.GOOGLE_AI_API_KEY
    if (!apiKey) {
      throw new Error('GOOGLE_AI_API_KEY not found')
    }

    this.gemini = new GoogleGenerativeAI(apiKey)
    this.model = this.gemini.getGenerativeModel({ model: 'gemini-2.5-pro' })
    this.voiceProfile = voiceProfile
  }

  /**
   * Generate 10 post options, return best ones that pass threshold
   */
  async generateOptions(brief: ContentBrief, count: number = 10): Promise<GeneratedPost[]> {
    console.log(`🎨 Generating ${count} post options for: ${brief.topic}`)

    const prompt = this.buildPrompt(brief)

    const result = await this.model.generateContent(prompt)
    const response = result.response.text()

    // Parse JSON array of posts
    const jsonMatch = response.match(/\[[\s\S]*\]/)
    if (!jsonMatch) {
      throw new Error('Failed to parse generated posts')
    }

    const generatedPosts: GeneratedPost[] = JSON.parse(jsonMatch[0])

    // Add IDs and filter by score
    const scoredPosts = generatedPosts.map((post, idx) => ({
      ...post,
      id: `post-${Date.now()}-${idx}`,
      targetPlatform: brief.targetPlatform
    }))

    // Sort by Brandon score
    scoredPosts.sort((a, b) => b.brandonScore - a.brandonScore)

    const passing = scoredPosts.filter(p => p.brandonScore >= this.MIN_BRANDON_SCORE)
    const top = scoredPosts[0]

    console.log(`✓ Generated ${scoredPosts.length} posts`)
    console.log(`  Top score: ${top.brandonScore}% - "${top.content.substring(0, 50)}..."`)
    console.log(`  Passing (≥95%): ${passing.length}`)

    if (passing.length === 0) {
      console.warn('⚠️ NO posts passed 95% Brandon-ness threshold')
      console.warn(`   Best was: ${top.brandonScore}%`)
      console.warn(`   Reason: ${top.reasoning}`)
    }

    return scoredPosts
  }

  /**
   * Get best post (highest score above threshold)
   */
  async generateBest(brief: ContentBrief): Promise<GeneratedPost | null> {
    const options = await this.generateOptions(brief, 10)
    const best = options[0]

    if (best.brandonScore < this.MIN_BRANDON_SCORE) {
      console.error(`❌ Best post only scored ${best.brandonScore}% (need ≥95%)`)
      return null
    }

    console.log(`✓ Selected post with ${best.brandonScore}% Brandon-ness`)
    return best
  }

  /**
   * Build generation prompt with voice profile
   */
  private buildPrompt(brief: ContentBrief): string {
    const profile = this.voiceProfile

    return `You are Brandon Mills (@mrbrandonmills). Write social media posts that sound EXACTLY like you - not like a marketing bot.

VOICE PROFILE:
- Tone: ${profile.tone.primary.join(', ')} (intensity: ${profile.tone.intensity}/10, authenticity: ${profile.tone.authenticity}/10)
- Style: ${profile.style.sentenceStructure}
- Punctuation: ${profile.style.punctuationStyle}
- Capitalization: ${profile.style.capitalization}
- Average length: ${profile.style.avgLength} words

UNIQUE PHRASES YOU USE:
${profile.vocabulary.uniquePhrases.slice(0, 10).join('\n')}

WORDS YOU NEVER USE (generic marketing):
${profile.vocabulary.avoidWords.join(', ')}

THEMES YOU EXPLORE:
Primary: ${profile.themes.primary.join(', ')}
Secondary: ${profile.themes.secondary.join(', ')}
Avoid: ${profile.themes.taboo.join(', ')}

HASHTAG STYLE:
Usage: ${profile.hashtagStyle.usage}
Types: ${profile.hashtagStyle.types.join(', ')}
Examples: ${profile.hashtagStyle.examples.join(', ')}

EXAMPLE POSTS FROM YOUR INSTAGRAM (top performers):
${profile.examplePosts.map(p => `"${p.caption}"`).join('\n\n')}

CONTENT BRIEF:
Type: ${brief.type}
Topic: ${brief.topic}
Platform: ${brief.targetPlatform}
${brief.link ? `Link: ${brief.link}` : ''}

YOUR TASK:
Generate 10 different post options that sound EXACTLY like you. No generic marketing language. Be raw, authentic, philosophical when appropriate.

For each post, also generate a "Brandon-ness Score" (0-100) that measures:
- How authentic does it sound? (not polished marketing)
- Does it use YOUR unique phrases and style?
- Does it avoid generic marketing words?
- Does it match YOUR punctuation/capitalization style?
- Would someone who knows you believe YOU wrote this?

Return JSON array:
[
  {
    "content": "the actual post text",
    "hashtags": ["#tag1", "#tag2"],
    "brandonScore": 95,
    "reasoning": "why this score - what makes it authentic or what's missing",
    "category": "poetry"
  },
  ...9 more
]

BE BRUTALLY HONEST with scores. A generic "Check out my new..." post should score <40.
Only posts that sound EXACTLY like you should score ≥95.`
  }

  /**
   * Check if a post passes quality threshold
   */
  passesThreshold(post: GeneratedPost): boolean {
    return post.brandonScore >= this.MIN_BRANDON_SCORE
  }

  /**
   * Generate performance report
   */
  generateReport(posts: GeneratedPost[]): string {
    const passing = posts.filter(p => this.passesThreshold(p))
    const avgScore = posts.reduce((sum, p) => sum + p.brandonScore, 0) / posts.length

    return `
CONTENT GENERATION REPORT
=========================
Total generated: ${posts.length}
Average score: ${avgScore.toFixed(1)}%
Passing (≥95%): ${passing.length}

Top 3:
${posts.slice(0, 3).map((p, i) => `
  ${i + 1}. Score: ${p.brandonScore}%
     "${p.content.substring(0, 60)}..."
     Why: ${p.reasoning}
`).join('')}
`
  }
}
