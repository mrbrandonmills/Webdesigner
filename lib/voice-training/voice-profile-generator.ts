/**
 * Brandon's Voice Profile Generator
 * Uses Gemini to deeply analyze Instagram posts and create authentic voice model
 */

import { GoogleGenerativeAI } from '@google/generative-ai'
import type { VoiceTrainingData } from './instagram-scraper'

export interface BrandonVoiceProfile {
  version: string
  generatedAt: string

  // Core characteristics
  tone: {
    primary: string[]      // raw, philosophical, poetic
    intensity: number       // 1-10 scale
    authenticity: number    // 1-10 scale
  }

  // Writing patterns
  style: {
    avgLength: number
    sentenceStructure: string // complex, simple, mixed
    punctuationStyle: string  // heavy, minimal, artistic
    capitalization: string  // standard, artistic, emphatic
  }

  // Vocabulary
  vocabulary: {
    commonWords: string[]
    uniquePhrases: string[]
    avoidWords: string[]      // Generic marketing words Brandon doesn't use
  }

  // Content themes
  themes: {
    primary: string[]         // self-actualization, art, truth
    secondary: string[]
    taboo: string[]           // Topics to avoid
  }

  // Hashtag strategy
  hashtagStyle: {
    usage: 'minimal' | 'moderate' | 'heavy'
    types: string[]           // branded, topical, artistic
    examples: string[]
  }

  // Example posts (top performers for reference)
  examplePosts: Array<{
    caption: string
    engagement: number
    why: string              // Why this performed well
  }>
}

export class VoiceProfileGenerator {
  private gemini: GoogleGenerativeAI
  private model: any

  constructor() {
    const apiKey = process.env.GOOGLE_AI_API_KEY
    if (!apiKey) {
      throw new Error('GOOGLE_AI_API_KEY not found')
    }

    this.gemini = new GoogleGenerativeAI(apiKey)
    this.model = this.gemini.getGenerativeModel({ model: 'gemini-2.5-pro' })
  }

  /**
   * Generate comprehensive voice profile from Instagram data
   */
  async generateProfile(voiceData: VoiceTrainingData): Promise<BrandonVoiceProfile> {
    console.log('🧠 Analyzing Brandon\'s voice with Gemini...')

    // Prepare training corpus
    const topPosts = voiceData.topPerformers.map(p => p.caption).join('\n\n---\n\n')
    const allPosts = voiceData.posts.map(p => p.caption).join('\n\n')

    const prompt = `You are analyzing the authentic voice and writing style of Brandon Mills (@mrbrandonmills) from his Instagram posts.

CONTEXT:
- Total posts analyzed: ${voiceData.totalPosts}
- Average engagement: ${voiceData.avgEngagement.toFixed(2)}
- Average word count: ${voiceData.linguisticPatterns.avgWordCount}
- Detected tones: ${voiceData.linguisticPatterns.sentimentTone.join(', ')}

TOP PERFORMING POSTS (highest engagement):
${topPosts}

YOUR TASK:
Deeply analyze Brandon's voice to create a profile that captures his AUTHENTIC style. This is NOT generic marketing - it's HIS unique voice.

Analyze:
1. TONE: What makes his voice distinctive? (raw, philosophical, poetic, questioning)
2. INTENSITY: How emotionally charged is his writing? (1-10)
3. AUTHENTICITY: How real/unfiltered does he sound? (1-10)
4. SENTENCE STRUCTURE: Complex philosophical statements? Short punchy lines? Mix?
5. PUNCTUATION: Heavy use of dashes, ellipses, question marks?
6. CAPITALIZATION: Standard or uses CAPS for emphasis?
7. VOCABULARY: Unique words/phrases he uses frequently
8. AVOID WORDS: Generic marketing words he NEVER uses (e.g., "excited to announce", "check out")
9. THEMES: What does he talk about? (art, philosophy, self-actualization, truth, psychology)
10. HASHTAG STYLE: Minimal branded tags? Topical? Artistic?

Return a JSON object with this structure:
{
  "tone": {
    "primary": ["raw", "philosophical", "poetic"],
    "intensity": 8,
    "authenticity": 9
  },
  "style": {
    "sentenceStructure": "complex philosophical mixed with short punchy statements",
    "punctuationStyle": "heavy use of dashes, ellipses for thought flow",
    "capitalization": "uses CAPS for emphasis on key words"
  },
  "vocabulary": {
    "uniquePhrases": ["list of phrases he actually uses"],
    "avoidWords": ["excited to announce", "thrilled to share", etc]
  },
  "themes": {
    "primary": ["self-actualization", "truth", "art"],
    "secondary": ["philosophy", "psychology"],
    "taboo": ["superficial positivity", "generic motivation"]
  },
  "hashtagStyle": {
    "usage": "minimal",
    "types": ["branded", "artistic"],
    "examples": ["${voiceData.linguisticPatterns.hashtagStyle.slice(0, 5).join('", "')}"]
  }
}

Be SPECIFIC. Use actual examples from his posts. This profile will be used to generate content that sounds exactly like him.`

    const result = await this.model.generateContent(prompt)
    const response = result.response.text()

    // Extract JSON from response
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('Failed to parse Gemini response as JSON')
    }

    const profileData = JSON.parse(jsonMatch[0])

    // Add example posts
    const examplePosts = voiceData.topPerformers.slice(0, 5).map(post => ({
      caption: post.caption,
      engagement: post.engagement_rate || 0,
      why: 'High engagement - authentic voice resonates'
    }))

    const profile: BrandonVoiceProfile = {
      version: '1.0',
      generatedAt: new Date().toISOString(),
      tone: profileData.tone,
      style: {
        avgLength: voiceData.linguisticPatterns.avgWordCount,
        ...profileData.style
      },
      vocabulary: profileData.vocabulary,
      themes: profileData.themes,
      hashtagStyle: profileData.hashtagStyle,
      examplePosts
    }

    console.log('✓ Voice profile generated successfully')
    return profile
  }

  /**
   * Save profile to file
   */
  async saveProfile(profile: BrandonVoiceProfile, filepath: string): Promise<void> {
    const fs = await import('fs/promises')
    await fs.writeFile(filepath, JSON.stringify(profile, null, 2))
    console.log(`✓ Voice profile saved to ${filepath}`)
  }

  /**
   * Load existing profile
   */
  async loadProfile(filepath: string): Promise<BrandonVoiceProfile> {
    const fs = await import('fs/promises')
    const data = await fs.readFile(filepath, 'utf-8')
    return JSON.parse(data)
  }
}
