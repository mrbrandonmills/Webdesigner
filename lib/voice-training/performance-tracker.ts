/**
 * Performance Feedback Loop
 * Tracks post engagement and learns what content performs well
 * Feeds insights back into content generation
 */

interface PostPerformance {
  postId: string
  platform: 'instagram' | 'twitter' | 'pinterest'
  content: string
  hashtags: string[]
  category: string
  brandonScore: number

  // Performance metrics
  likes: number
  comments: number
  shares: number
  saves?: number  // Instagram specific
  engagementRate: number

  // Timing
  postedAt: string
  checkedAt: string
  hoursElapsed: number

  // Analysis
  performanceScore: number  // 0-100
  insights: string[]
}

interface PerformanceInsights {
  topCategories: Array<{ category: string; avgEngagement: number }>
  topHashtags: Array<{ tag: string; avgEngagement: number }>
  bestPostingTimes: string[]
  contentPatterns: {
    whatWorks: string[]
    whatDoesnt: string[]
  }
  recommendations: string[]
}

export class PerformanceTracker {
  private dataFile: string

  constructor(dataFile: string = './data/post-performance.json') {
    this.dataFile = dataFile
  }

  /**
   * Record a new post
   */
  async recordPost(post: {
    postId: string
    platform: 'instagram' | 'twitter' | 'pinterest'
    content: string
    hashtags: string[]
    category: string
    brandonScore: number
  }): Promise<void> {
    const performance: PostPerformance = {
      ...post,
      likes: 0,
      comments: 0,
      shares: 0,
      engagementRate: 0,
      postedAt: new Date().toISOString(),
      checkedAt: new Date().toISOString(),
      hoursElapsed: 0,
      performanceScore: 0,
      insights: []
    }

    const data = await this.loadData()
    data.posts.push(performance)
    await this.saveData(data)

    console.log(`✓ Recorded post: ${postId.substring(0, 20)}...`)
  }

  /**
   * Update post with engagement metrics
   */
  async updateMetrics(postId: string, metrics: {
    likes: number
    comments: number
    shares?: number
    saves?: number
  }): Promise<void> {
    const data = await this.loadData()
    const post = data.posts.find(p => p.postId === postId)

    if (!post) {
      console.warn(`Post ${postId} not found`)
      return
    }

    // Update metrics
    post.likes = metrics.likes
    post.comments = metrics.comments
    post.shares = metrics.shares || 0
    post.saves = metrics.saves

    // Calculate engagement rate
    const totalEngagement =
      post.likes +
      (post.comments * 10) +  // Comments worth 10x likes
      (post.shares * 20) +    // Shares worth 20x
      (post.saves ? post.saves * 15 : 0)  // Saves worth 15x

    post.engagementRate = totalEngagement / 100

    // Calculate hours elapsed
    post.hoursElapsed = (Date.now() - new Date(post.postedAt).getTime()) / (1000 * 60 * 60)
    post.checkedAt = new Date().toISOString()

    // Performance score (relative to other posts)
    post.performanceScore = this.calculatePerformanceScore(post, data.posts)

    // Generate insights
    post.insights = this.generateInsights(post)

    await this.saveData(data)
    console.log(`✓ Updated ${postId}: ${post.likes} likes, ${post.comments} comments, score: ${post.performanceScore}`)
  }

  /**
   * Fetch metrics from Instagram API
   */
  async fetchInstagramMetrics(mediaId: string): Promise<any> {
    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN!

    const url = `https://graph.facebook.com/v18.0/${mediaId}?fields=like_count,comments_count&access_token=${accessToken}`

    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to fetch Instagram metrics: ${response.statusText}`)
    }

    const data = await response.json()
    return {
      likes: data.like_count || 0,
      comments: data.comments_count || 0
    }
  }

  /**
   * Auto-update all recent posts (last 48 hours)
   */
  async updateRecentPosts(): Promise<void> {
    const data = await this.loadData()
    const cutoff = Date.now() - (48 * 60 * 60 * 1000) // 48 hours

    const recentPosts = data.posts.filter(p =>
      new Date(p.postedAt).getTime() > cutoff &&
      p.platform === 'instagram'
    )

    console.log(`🔄 Updating ${recentPosts.length} recent posts...`)

    for (const post of recentPosts) {
      try {
        const metrics = await this.fetchInstagramMetrics(post.postId)
        await this.updateMetrics(post.postId, metrics)

        // Rate limit
        await new Promise(resolve => setTimeout(resolve, 500))
      } catch (error) {
        console.error(`Failed to update ${post.postId}:`, error)
      }
    }

    console.log('✓ Recent posts updated')
  }

  /**
   * Calculate performance score relative to other posts
   */
  private calculatePerformanceScore(post: PostPerformance, allPosts: PostPerformance[]): number {
    // Get posts from same category
    const sameCategoryPosts = allPosts.filter(p => p.category === post.category && p.engagementRate > 0)

    if (sameCategoryPosts.length < 3) {
      return 50 // Not enough data
    }

    // Calculate percentile
    const sorted = sameCategoryPosts.map(p => p.engagementRate).sort((a, b) => a - b)
    const index = sorted.indexOf(post.engagementRate)
    const percentile = (index / sorted.length) * 100

    return Math.round(percentile)
  }

  /**
   * Generate insights for a post
   */
  private generateInsights(post: PostPerformance): string[] {
    const insights: string[] = []

    if (post.performanceScore >= 80) {
      insights.push(`🔥 Top ${100 - post.performanceScore}% performer in ${post.category}`)
    }

    if (post.comments > post.likes * 0.1) {
      insights.push('💬 High comment rate - content sparked conversation')
    }

    if (post.brandonScore >= 98 && post.performanceScore >= 75) {
      insights.push('✨ Authentic voice + great performance - replicate this style')
    }

    if (post.brandonScore < 95 && post.performanceScore < 50) {
      insights.push('⚠️ Low Brandon-ness + poor performance - avoid this approach')
    }

    return insights
  }

  /**
   * Analyze all performance data to extract patterns
   */
  async analyzePatterns(): Promise<PerformanceInsights> {
    const data = await this.loadData()
    const posts = data.posts.filter(p => p.hoursElapsed >= 24) // At least 24h old

    // Top categories
    const categoryStats = new Map<string, { total: number; count: number }>()
    posts.forEach(p => {
      const stats = categoryStats.get(p.category) || { total: 0, count: 0 }
      stats.total += p.engagementRate
      stats.count++
      categoryStats.set(p.category, stats)
    })

    const topCategories = Array.from(categoryStats.entries())
      .map(([category, stats]) => ({
        category,
        avgEngagement: stats.total / stats.count
      }))
      .sort((a, b) => b.avgEngagement - a.avgEngagement)

    // Top hashtags
    const hashtagStats = new Map<string, { total: number; count: number }>()
    posts.forEach(p => {
      p.hashtags.forEach(tag => {
        const stats = hashtagStats.get(tag) || { total: 0, count: 0 }
        stats.total += p.engagementRate
        stats.count++
        hashtagStats.set(tag, stats)
      })
    })

    const topHashtags = Array.from(hashtagStats.entries())
      .filter(([_, stats]) => stats.count >= 3) // Used at least 3 times
      .map(([tag, stats]) => ({
        tag,
        avgEngagement: stats.total / stats.count
      }))
      .sort((a, b) => b.avgEngagement - a.avgEngagement)
      .slice(0, 10)

    // What works vs what doesn't
    const topPerformers = posts
      .filter(p => p.performanceScore >= 75)
      .sort((a, b) => b.performanceScore - a.performanceScore)
      .slice(0, 5)

    const poorPerformers = posts
      .filter(p => p.performanceScore < 40)
      .sort((a, b) => a.performanceScore - b.performanceScore)
      .slice(0, 5)

    const whatWorks = topPerformers.map(p =>
      `"${p.content.substring(0, 60)}..." (${p.performanceScore}% score, ${p.brandonScore}% Brandon-ness)`
    )

    const whatDoesnt = poorPerformers.map(p =>
      `"${p.content.substring(0, 60)}..." (${p.performanceScore}% score, ${p.brandonScore}% Brandon-ness)`
    )

    // Recommendations
    const recommendations: string[] = []

    if (topCategories.length > 0) {
      recommendations.push(`Focus on ${topCategories[0].category} content - best performing category`)
    }

    const highAuthenticityHighPerf = posts.filter(p => p.brandonScore >= 97 && p.performanceScore >= 75).length
    const lowAuthenticityHighPerf = posts.filter(p => p.brandonScore < 90 && p.performanceScore >= 75).length

    if (highAuthenticityHighPerf > lowAuthenticityHighPerf) {
      recommendations.push('Authentic voice (≥97% Brandon-ness) performs better - maintain high standards')
    }

    return {
      topCategories: topCategories.slice(0, 5),
      topHashtags,
      bestPostingTimes: [], // TODO: Analyze posting time patterns
      contentPatterns: {
        whatWorks,
        whatDoesnt
      },
      recommendations
    }
  }

  /**
   * Load performance data
   */
  private async loadData(): Promise<{ posts: PostPerformance[] }> {
    try {
      const fs = await import('fs/promises')
      const data = await fs.readFile(this.dataFile, 'utf-8')
      return JSON.parse(data)
    } catch (error) {
      // File doesn't exist yet
      return { posts: [] }
    }
  }

  /**
   * Save performance data
   */
  private async saveData(data: { posts: PostPerformance[] }): Promise<void> {
    const fs = await import('fs/promises')
    await fs.writeFile(this.dataFile, JSON.stringify(data, null, 2))
  }
}
