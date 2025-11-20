/**
 * LinkedIn Auto-Poster
 *
 * Uses LinkedIn API to post updates to your profile/company page.
 * Requires OAuth 2.0 access token.
 */

import * as fs from 'fs'
import * as path from 'path'
import { pathsConfig } from './config'
import { logger } from './logger'
import { stateManager } from './state-manager'

interface LinkedInPost {
  id: string
  text: string
  articleUrl?: string
  articleTitle?: string
  articleDescription?: string
}

// Load posts from markdown file
function loadPosts(): LinkedInPost[] {
  const postsPath = path.join(pathsConfig.contentDir, 'linkedin', 'posts.md')

  if (!fs.existsSync(postsPath)) {
    logger.warn('LINKEDIN', 'No posts file found')
    return []
  }

  const content = fs.readFileSync(postsPath, 'utf-8')
  const posts: LinkedInPost[] = []

  // Split by --- separator
  const blocks = content.split(/^---$/m).filter(b => b.trim())

  for (const block of blocks) {
    const text = block.trim()

    // Skip header comments
    if (text.startsWith('#')) continue

    if (text) {
      // Check if there's a URL in the post
      const urlMatch = text.match(/\[Link\]:\s*(.+)$/m)
      const articleUrl = urlMatch ? urlMatch[1].trim() : undefined
      const cleanText = text.replace(/\[Link\]:\s*.+$/m, '').trim()

      const id = Buffer.from(cleanText.substring(0, 50)).toString('base64').substring(0, 12)
      posts.push({
        id,
        text: cleanText,
        articleUrl
      })
    }
  }

  logger.info('LINKEDIN', `Loaded ${posts.length} posts`)
  return posts
}

// Post to LinkedIn
async function createPost(
  accessToken: string,
  userId: string,
  post: LinkedInPost
): Promise<{ success: boolean; postId?: string; error?: string }> {

  // Build the share content
  const shareContent: any = {
    author: `urn:li:person:${userId}`,
    lifecycleState: 'PUBLISHED',
    specificContent: {
      'com.linkedin.ugc.ShareContent': {
        shareCommentary: {
          text: post.text
        },
        shareMediaCategory: post.articleUrl ? 'ARTICLE' : 'NONE'
      }
    },
    visibility: {
      'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
    }
  }

  // Add article if URL provided
  if (post.articleUrl) {
    shareContent.specificContent['com.linkedin.ugc.ShareContent'].media = [{
      status: 'READY',
      originalUrl: post.articleUrl,
      title: {
        text: post.articleTitle || 'Check this out'
      },
      description: {
        text: post.articleDescription || ''
      }
    }]
  }

  try {
    const response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0'
      },
      body: JSON.stringify(shareContent)
    })

    if (!response.ok) {
      const errorText = await response.text()
      return { success: false, error: `${response.status}: ${errorText}` }
    }

    const result = await response.json()
    return { success: true, postId: result.id }

  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// Get user profile ID
async function getUserId(accessToken: string): Promise<string | null> {
  try {
    const response = await fetch('https://api.linkedin.com/v2/me', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })

    if (!response.ok) {
      logger.error('LINKEDIN', `Failed to get user ID: ${response.status}`)
      return null
    }

    const data = await response.json()
    return data.id

  } catch (error: any) {
    logger.error('LINKEDIN', `Error getting user ID: ${error.message}`)
    return null
  }
}

// Main posting function
export async function postToLinkedIn(postCount: number = 1): Promise<void> {
  logger.info('LINKEDIN', `Starting LinkedIn posting (count: ${postCount})`)

  const accessToken = process.env.LINKEDIN_ACCESS_TOKEN

  if (!accessToken) {
    logger.error('LINKEDIN', 'Missing LINKEDIN_ACCESS_TOKEN')
    logger.info('LINKEDIN', 'Get token at: https://www.linkedin.com/developers/apps')
    return
  }

  // Get user ID
  const userId = await getUserId(accessToken)
  if (!userId) {
    logger.error('LINKEDIN', 'Could not retrieve user ID')
    return
  }

  const posts = loadPosts()
  if (posts.length === 0) {
    logger.warn('LINKEDIN', 'No posts available')
    return
  }

  // Get unposted content
  const postedIds = stateManager.getPostedIds('linkedin')
  const availablePosts = posts.filter(p => !postedIds.includes(p.id))

  if (availablePosts.length === 0) {
    logger.info('LINKEDIN', 'All posts have been used, resetting')
    stateManager.resetPlatform('linkedin')
  }

  const toPost = availablePosts.slice(0, postCount)
  let successCount = 0

  for (const post of toPost) {
    logger.info('LINKEDIN', `Posting: ${post.text.substring(0, 50)}...`)

    const result = await createPost(accessToken, userId, post)

    if (result.success) {
      stateManager.recordPost('linkedin', post.id, true, {
        postId: result.postId,
        text: post.text.substring(0, 100)
      })
      logger.info('LINKEDIN', `Posted successfully: ${result.postId}`)
      successCount++
    } else {
      stateManager.recordPost('linkedin', post.id, false, {
        text: post.text.substring(0, 100),
        error: result.error
      })
      logger.error('LINKEDIN', `Failed: ${result.error}`)
    }

    // Rate limit - wait 30 seconds between posts
    if (toPost.indexOf(post) < toPost.length - 1) {
      logger.info('LINKEDIN', 'Waiting 30s before next post...')
      await new Promise(resolve => setTimeout(resolve, 30000))
    }
  }

  logger.info('LINKEDIN', `Complete: ${successCount}/${toPost.length} successful`)
}

// Get status
export function getLinkedInStatus() {
  const stats = stateManager.getStats('linkedin')
  const posts = loadPosts()

  return {
    configured: !!process.env.LINKEDIN_ACCESS_TOKEN,
    postsToday: stats.postsToday,
    totalPosts: stats.totalPosts,
    availableContent: posts.length
  }
}

// Run directly
if (require.main === module) {
  postToLinkedIn(1).then(() => {
    console.log('\nLinkedIn posting completed')
    process.exit(0)
  }).catch(err => {
    console.error('Error:', err)
    process.exit(1)
  })
}
