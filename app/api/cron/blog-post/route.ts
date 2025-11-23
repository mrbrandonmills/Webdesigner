/**
 * Automated Blog Post Cron
 * Posts 1 article per day from Medium essays
 */

import { NextRequest, NextResponse } from 'next/server'
import { blogPosts } from '@/lib/blog-posts'
import { getBlogState, updateBlogState } from '@/lib/db/automation-state'
import { hasPostedToday, markPostedToday } from '@/lib/db/daily-post-tracker'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

interface Article {
  title: string
  slug: string
  date: string
  excerpt: string
  keywords: string[]
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    console.log('[Blog Cron] No auth - manual trigger or development')
  }

  console.log('[Blog Cron] Starting daily blog post automation...')

  try {
    // Convert blog posts to articles format
    const articles: Article[] = blogPosts.map(post => ({
      title: post.title,
      slug: post.slug.replace('/blog/', ''),
      date: post.datePublished || post.date,
      excerpt: post.excerpt,
      keywords: [post.category.toLowerCase().replace(/\s+/g, '-')]
    }))

    if (articles.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No articles available'
      }, { status: 404 })
    }

    // Load automation state from database (or calculate from date if DB unavailable)
    const state = await getBlogState(articles.length)

    // Check if already posted today (using both DB state and in-memory cache)
    const today = new Date().toISOString().split('T')[0]
    if (state.lastPostedDate === today || hasPostedToday('blog-post')) {
      return NextResponse.json({
        success: false,
        message: 'Already posted today',
        lastPosted: state.lastPostedDate || today
      }, { status: 200 })
    }

    // Get next article (cycle through)
    const nextIndex = (state.lastPostedIndex + 1) % articles.length
    const article = articles[nextIndex]

    console.log(`[Blog Cron] Publishing article ${nextIndex + 1}/${articles.length}: "${article.title}"`)

    // Post to social media with blog link
    const blogUrl = `https://brandonmills.com/blog/${article.slug}`

    await Promise.all([
      postToTwitter(article, blogUrl),
      postToPinterest(article, blogUrl),
      postToReddit(article, blogUrl)
    ])

    // Update state in database and cache
    await updateBlogState({
      lastPostedIndex: nextIndex,
      lastPostedDate: today
    })
    markPostedToday('blog-post')

    return NextResponse.json({
      success: true,
      article: {
        title: article.title,
        slug: article.slug,
        url: blogUrl
      },
      posted: {
        twitter: true,
        pinterest: true,
        reddit: true
      },
      nextArticleIndex: (nextIndex + 1) % articles.length
    })

  } catch (error) {
    console.error('[Blog Cron] Error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

async function postToTwitter(article: Article, url: string): Promise<void> {
  try {
    const { TwitterApi } = await import('twitter-api-v2')

    const client = new TwitterApi({
      appKey: process.env.TWITTER_API_KEY!,
      appSecret: process.env.TWITTER_API_SECRET!,
      accessToken: process.env.TWITTER_ACCESS_TOKEN!,
      accessSecret: process.env.TWITTER_ACCESS_SECRET!
    })

    const hashtags = article.keywords.slice(0, 3).map(k => `#${k.replace(/\s+/g, '')}`).join(' ')
    const tweet = `${article.title}\n\n${article.excerpt.substring(0, 150)}...\n\nRead more: ${url}\n\n${hashtags}`

    await client.v2.tweet(tweet)
    console.log('[Blog Cron] Posted to Twitter')
  } catch (error) {
    console.error('[Blog Cron] Twitter error:', error)
  }
}

async function postToPinterest(article: Article, url: string): Promise<void> {
  try {
    const token = process.env.PINTEREST_ACCESS_TOKEN
    const boardId = process.env.PINTEREST_BOARD_ID

    if (!token || !boardId) {
      console.log('[Blog Cron] Pinterest not configured')
      return
    }

    const imageUrl = 'https://brandonmills.com/og-image.jpg'

    const res = await fetch('https://api.pinterest.com/v5/pins', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        board_id: boardId,
        title: article.title,
        description: `${article.excerpt}\n\nRead full article: ${url}`,
        link: url,
        media_source: {
          source_type: 'image_url',
          url: imageUrl
        }
      })
    })

    if (res.ok) {
      console.log('[Blog Cron] Posted to Pinterest')
    } else {
      console.error('[Blog Cron] Pinterest error:', await res.text())
    }
  } catch (error) {
    console.error('[Blog Cron] Pinterest error:', error)
  }
}

async function postToReddit(article: Article, url: string): Promise<void> {
  try {
    // Reddit posting via puppeteer automation
    const response = await fetch('https://brandonmills.com/api/social/reddit/post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: article.title,
        url: url,
        subreddit: 'philosophy' // Or choose based on article.keywords
      })
    })

    if (response.ok) {
      console.log('[Blog Cron] Posted to Reddit')
    } else {
      console.error('[Blog Cron] Reddit error:', await response.text())
    }
  } catch (error) {
    console.error('[Blog Cron] Reddit error:', error)
  }
}
