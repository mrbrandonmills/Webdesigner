/**
 * Instagram Voice Training Scraper
 * Scrapes @mrbrandonmills posts to extract authentic voice/style
 */

export interface InstagramPost {
  id: string
  caption: string
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM'
  permalink: string
  timestamp: string
  like_count?: number
  comments_count?: number
  engagement_rate?: number
}

export interface VoiceTrainingData {
  posts: InstagramPost[]
  totalPosts: number
  avgEngagement: number
  topPerformers: InstagramPost[]
  linguisticPatterns: {
    avgWordCount: number
    sentimentTone: string[]
    commonPhrases: string[]
    hashtagStyle: string[]
  }
}

export class InstagramVoiceScraper {
  private accountId: string

  constructor() {
    this.accountId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID!

    if (!this.accountId) {
      throw new Error('Instagram credentials missing. Check INSTAGRAM_BUSINESS_ACCOUNT_ID')
    }
  }

  /**
   * Get valid access token (auto-refreshes if expired)
   */
  private async getAccessToken(): Promise<string> {
    const { InstagramTokenManager } = await import('../instagram-auto-refresh')
    return await InstagramTokenManager.getValidToken()
  }

  /**
   * Scrape all posts from @mrbrandonmills
   * Graph API endpoint: /{ig-user-id}/media
   */
  async scrapePosts(limit: number = 100): Promise<InstagramPost[]> {
    const accessToken = await this.getAccessToken()
    const posts: InstagramPost[] = []
    let nextUrl: string | null = `https://graph.facebook.com/v18.0/${this.accountId}/media`

    const params = new URLSearchParams({
      fields: 'id,caption,media_type,permalink,timestamp,like_count,comments_count',
      access_token: accessToken,
      limit: '50' // Max per request
    })

    try {
      while (nextUrl && posts.length < limit) {
        const url = nextUrl.includes('?') ? nextUrl : `${nextUrl}?${params}`

        const response = await fetch(url)

        if (!response.ok) {
          const error = await response.json()
          throw new Error(`Instagram API error: ${JSON.stringify(error)}`)
        }

        const data = await response.json()

        // Filter posts with captions (text content for voice training)
        const postsWithCaptions = data.data.filter((post: any) => post.caption && post.caption.trim())
        posts.push(...postsWithCaptions)

        // Check for pagination
        nextUrl = data.paging?.next || null

        // Respect rate limits
        await new Promise(resolve => setTimeout(resolve, 200))
      }

      console.log(`✓ Scraped ${posts.length} posts from @mrbrandonmills`)
      return posts.slice(0, limit)

    } catch (error) {
      console.error('Instagram scraping failed:', error)
      throw error
    }
  }

  /**
   * Analyze posts to extract voice patterns
   */
  async analyzeVoice(posts: InstagramPost[]): Promise<VoiceTrainingData> {
    // Calculate engagement rates
    const postsWithEngagement = posts.map(post => ({
      ...post,
      engagement_rate: post.like_count && post.comments_count
        ? (post.like_count + post.comments_count * 10) / 100 // Weighted: comments = 10x likes
        : 0
    }))

    // Sort by engagement
    const topPerformers = [...postsWithEngagement]
      .sort((a, b) => (b.engagement_rate || 0) - (a.engagement_rate || 0))
      .slice(0, 10)

    // Extract linguistic patterns
    const captions = posts.map(p => p.caption).filter(Boolean)
    const wordCounts = captions.map(c => c.split(/\s+/).length)
    const avgWordCount = wordCounts.reduce((a, b) => a + b, 0) / wordCounts.length

    // Extract common phrases (simplified - full version uses NLP)
    const allText = captions.join(' ').toLowerCase()
    const hashtagStyle = [...new Set(
      allText.match(/#\w+/g) || []
    )]

    const avgEngagement = postsWithEngagement.reduce((sum, p) =>
      sum + (p.engagement_rate || 0), 0
    ) / postsWithEngagement.length

    return {
      posts: postsWithEngagement,
      totalPosts: posts.length,
      avgEngagement,
      topPerformers,
      linguisticPatterns: {
        avgWordCount: Math.round(avgWordCount),
        sentimentTone: this.extractTone(captions),
        commonPhrases: this.extractCommonPhrases(captions),
        hashtagStyle: hashtagStyle.slice(0, 20)
      }
    }
  }

  /**
   * Extract tone/sentiment from captions
   */
  private extractTone(captions: string[]): string[] {
    const tones: string[] = []
    const allText = captions.join(' ').toLowerCase()

    // Simple keyword matching (full version uses Gemini sentiment analysis)
    if (allText.includes('fuck') || allText.includes('shit')) tones.push('raw')
    if (allText.includes('love') || allText.includes('beautiful')) tones.push('poetic')
    if (allText.includes('truth') || allText.includes('reality')) tones.push('philosophical')
    if (allText.includes('?')) tones.push('questioning')

    return [...new Set(tones)]
  }

  /**
   * Extract common phrases (2-4 word patterns)
   */
  private extractCommonPhrases(captions: string[]): string[] {
    // Simplified - full version uses n-gram analysis
    const phrases = new Map<string, number>()

    captions.forEach(caption => {
      const words = caption.toLowerCase().split(/\s+/)
      for (let i = 0; i < words.length - 1; i++) {
        const bigram = `${words[i]} ${words[i + 1]}`
        phrases.set(bigram, (phrases.get(bigram) || 0) + 1)
      }
    })

    // Return phrases that appear 3+ times
    return Array.from(phrases.entries())
      .filter(([_, count]) => count >= 3)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([phrase]) => phrase)
  }

  /**
   * Save training data to file for AI fine-tuning
   */
  async saveTrainingData(data: VoiceTrainingData, filepath: string): Promise<void> {
    const fs = await import('fs/promises')
    await fs.writeFile(filepath, JSON.stringify(data, null, 2))
    console.log(`✓ Voice training data saved to ${filepath}`)
  }
}
