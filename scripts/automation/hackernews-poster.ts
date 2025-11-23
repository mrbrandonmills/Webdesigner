/**
 * Hacker News Auto-Poster (Puppeteer-based)
 *
 * Uses browser automation to post to Hacker News.
 * HN has strict spam detection - use sparingly!
 */

import * as fs from 'fs'
import * as path from 'path'
import puppeteer from 'puppeteer'
import { pathsConfig } from './config'
import { logger } from './logger'
import { stateManager } from './state-manager'

interface HNPost {
  id: string
  title: string
  url?: string
  text?: string
  type: 'link' | 'ask' | 'show'
}

// Load posts from markdown file
function loadPosts(): HNPost[] {
  const postsPath = path.join(pathsConfig.contentDir, 'hackernews', 'posts.md')

  if (!fs.existsSync(postsPath)) {
    logger.warn('HN', 'No posts file found')
    return []
  }

  const content = fs.readFileSync(postsPath, 'utf-8')
  const posts: HNPost[] = []

  // Split by --- separator
  const blocks = content.split(/^---$/m).filter(b => b.trim())

  for (const block of blocks) {
    const lines = block.trim().split('\n')

    // Skip header comments
    if (lines[0]?.trim().startsWith('#')) continue

    let title = ''
    let url = ''
    let text = ''
    let type: 'link' | 'ask' | 'show' = 'link'

    for (const line of lines) {
      const trimmed = line.trim()
      if (trimmed.toLowerCase().startsWith('title:')) {
        title = trimmed.replace(/^title:\s*/i, '')
      } else if (trimmed.toLowerCase().startsWith('url:')) {
        url = trimmed.replace(/^url:\s*/i, '')
      } else if (trimmed.toLowerCase().startsWith('type:')) {
        const t = trimmed.replace(/^type:\s*/i, '').toLowerCase()
        if (t === 'ask' || t === 'show' || t === 'link') {
          type = t
        }
      }
    }

    // Get text content (everything after the metadata)
    const textStart = block.indexOf('\n\n')
    if (textStart > 0) {
      text = block.substring(textStart).trim()
    }

    // Determine type from title if not specified
    if (title.toLowerCase().startsWith('ask hn:')) {
      type = 'ask'
    } else if (title.toLowerCase().startsWith('show hn:')) {
      type = 'show'
    }

    if (title) {
      const id = Buffer.from(title).toString('base64').substring(0, 12)
      posts.push({ id, title, url, text, type })
    }
  }

  logger.info('HN', `Loaded ${posts.length} posts`)
  return posts
}

// Sleep helper
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Screenshot helper for debugging
async function captureDebugScreenshot(page: any, filename: string): Promise<void> {
  try {
    const screenshotPath = path.join(pathsConfig.logsDir, 'screenshots', filename)
    await page.screenshot({ path: screenshotPath, fullPage: true })
    logger.info('HN', `Debug screenshot saved: ${filename}`)
  } catch (err: any) {
    logger.warn('HN', `Failed to capture screenshot: ${err.message}`)
  }
}

// Enhanced error detection with comprehensive HN error messages
async function detectHNError(page: any): Promise<{ isError: boolean; message: string; pageText: string }> {
  const result = await page.evaluate(() => {
    const bodyText = document.body.innerText.toLowerCase()
    const pageText = document.body.innerText.substring(0, 500) // First 500 chars for logging

    // Comprehensive list of known HN error patterns
    const errorPatterns = [
      { pattern: 'submitted too fast', message: 'Rate limited - submitting too fast' },
      { pattern: 'already been submitted', message: 'URL already submitted to HN' },
      { pattern: 'not allowed to post', message: 'Account not allowed to post' },
      { pattern: 'banned', message: 'Account or domain banned' },
      { pattern: 'too many submissions', message: 'Too many submissions' },
      { pattern: 'karma', message: 'Insufficient karma to post' },
      { pattern: 'please wait', message: 'Rate limited - please wait' },
      { pattern: 'try again', message: 'HN asking to try again' },
      { pattern: 'invalid', message: 'Invalid submission' },
      { pattern: 'error', message: 'HN reported an error' },
      { pattern: 'cannot submit', message: 'Cannot submit' },
      { pattern: 'throttled', message: 'Throttled by HN' },
      { pattern: 'duplicate', message: 'Duplicate submission detected' }
    ]

    for (const { pattern, message } of errorPatterns) {
      if (bodyText.includes(pattern)) {
        return { isError: true, message, pageText }
      }
    }

    return { isError: false, message: '', pageText }
  })

  return result
}

// Verify successful post with multiple indicators
async function verifyHNSuccess(page: any): Promise<{ success: boolean; postId: string | null; url: string }> {
  const currentUrl = page.url()

  // Check 1: URL contains item?id= (redirected to post)
  if (currentUrl.includes('item?id=')) {
    const idMatch = currentUrl.match(/id=(\d+)/)
    const postId = idMatch ? idMatch[1] : null
    return { success: true, postId, url: currentUrl }
  }

  // Check 2: URL is newest page (successful submission redirects here sometimes)
  if (currentUrl.includes('/newest')) {
    return { success: true, postId: null, url: currentUrl }
  }

  // Check 3: Page doesn't contain submit form anymore
  const hasSubmitForm = await page.evaluate(() => {
    return document.querySelector('input[name="title"]') !== null
  })

  if (!hasSubmitForm && !currentUrl.includes('/submit')) {
    return { success: true, postId: null, url: currentUrl }
  }

  return { success: false, postId: null, url: currentUrl }
}

// Main posting function
export async function postToHackerNews(postCount: number = 1): Promise<void> {
  logger.info('HN', `Starting Hacker News posting (count: ${postCount})`)

  const username = process.env.HN_USERNAME
  const password = process.env.HN_PASSWORD

  if (!username || !password) {
    logger.error('HN', 'Missing HN_USERNAME or HN_PASSWORD')
    return
  }

  const posts = loadPosts()
  if (posts.length === 0) {
    logger.warn('HN', 'No posts available')
    return
  }

  // Get unposted content
  const postedIds = stateManager.getPostedIds('hackernews')
  const availablePosts = posts.filter(p => !postedIds.includes(p.id))

  if (availablePosts.length === 0) {
    logger.info('HN', 'All posts have been used, resetting')
    stateManager.resetPlatform('hackernews')
  }

  const toPost = availablePosts.slice(0, postCount)
  let successCount = 0

  // Launch browser
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })

  try {
    const page = await browser.newPage()
    await page.setViewport({ width: 1280, height: 800 })
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36')

    // Login to Hacker News
    logger.info('HN', 'Logging in...')
    await page.goto('https://news.ycombinator.com/login', { waitUntil: 'networkidle2' })

    // Fill login form
    await page.waitForSelector('input[name="acct"]', { timeout: 10000 })
    await page.type('input[name="acct"]', username, { delay: 50 })
    await page.type('input[name="pw"]', password, { delay: 50 })

    // Click login button
    await page.click('input[type="submit"]')

    // Wait for login to complete
    await sleep(3000)

    // Check if logged in
    const loggedIn = await page.evaluate(() => {
      return document.body.innerText.includes('logout')
    })

    if (!loggedIn) {
      logger.error('HN', 'Login failed - check credentials')
      await browser.close()
      return
    }

    logger.info('HN', 'Login successful')

    // Post each item with retry logic
    for (const post of toPost) {
      logger.info('HN', `Posting: ${post.title.substring(0, 50)}...`)

      const MAX_RETRIES = 2
      let retryCount = 0
      let posted = false

      while (retryCount <= MAX_RETRIES && !posted) {
        if (retryCount > 0) {
          const backoffTime = Math.min(60000 * Math.pow(2, retryCount - 1), 300000) // Max 5 min
          logger.info('HN', `Retry ${retryCount}/${MAX_RETRIES} after ${backoffTime / 1000}s...`)
          await sleep(backoffTime)
        }

        try {
        // Navigate to submit page
        await page.goto('https://news.ycombinator.com/submit', {
          waitUntil: 'networkidle2',
          timeout: 30000
        })

        await sleep(2000)

        // Fill title
        const titleInput = await page.$('input[name="title"]')
        if (titleInput) {
          await titleInput.click()
          await titleInput.type(post.title, { delay: 30 })
        } else {
          throw new Error('Could not find title input')
        }

        await sleep(1000)

        // Fill URL or text based on post type
        if (post.type === 'link' && post.url) {
          const urlInput = await page.$('input[name="url"]')
          if (urlInput) {
            await urlInput.click()
            await urlInput.type(post.url, { delay: 30 })
          }
        } else if (post.text) {
          const textInput = await page.$('textarea[name="text"]')
          if (textInput) {
            await textInput.click()
            await textInput.type(post.text, { delay: 20 })
          }
        }

        await sleep(2000)

        // Click submit button
        const submitButton = await page.$('input[type="submit"]')
        if (submitButton) {
          await submitButton.click()
        } else {
          throw new Error('Could not find submit button')
        }

        // Wait for submission with timeout protection
        logger.info('HN', 'Waiting for submission to process...')
        await Promise.race([
          sleep(8000), // Wait up to 8 seconds
          page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 8000 }).catch(() => {
            // Navigation timeout is okay - page might not navigate
          })
        ])

        // Capture screenshot for debugging
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
        await captureDebugScreenshot(page, `hn-post-${timestamp}.png`)

        // Check for success using enhanced verification
        const successCheck = await verifyHNSuccess(page)

        if (successCheck.success) {
          const postId = successCheck.postId || 'unknown'
          stateManager.recordPost('hackernews', post.id, true, {
            title: post.title,
            hnId: postId,
            url: successCheck.url
          })
          logger.info('HN', `Posted successfully: ${successCheck.url}`)
          successCount++
          posted = true
        } else {
          // Check for specific error messages
          const errorCheck = await detectHNError(page)

          if (errorCheck.isError) {
            logger.error('HN', `Post failed: ${errorCheck.message}`)
            logger.info('HN', `Page content (first 500 chars): ${errorCheck.pageText}`)

            // Don't retry on certain permanent errors
            if (errorCheck.message.includes('already been submitted') ||
                errorCheck.message.includes('banned') ||
                errorCheck.message.includes('not allowed')) {
              logger.warn('HN', 'Permanent error detected - skipping retries')
              stateManager.recordPost('hackernews', post.id, false, {
                title: post.title,
                error: errorCheck.message,
                url: successCheck.url,
                screenshot: `hn-post-${timestamp}.png`
              })
              break // Exit retry loop
            }
          } else {
            logger.error('HN', 'Post failed: Unknown error - check screenshot for details')
            logger.info('HN', `Current URL: ${successCheck.url}`)
            logger.info('HN', `Page content (first 500 chars): ${errorCheck.pageText}`)
          }

          // Record failure if last retry
          if (retryCount >= MAX_RETRIES) {
            stateManager.recordPost('hackernews', post.id, false, {
              title: post.title,
              error: errorCheck.isError ? errorCheck.message : 'Unknown error - see logs',
              url: successCheck.url,
              screenshot: `hn-post-${timestamp}.png`
            })
          }
        }

        retryCount++

      } catch (error: any) {
        logger.error('HN', `Exception during posting: ${error.message}`)

        // Record failure if last retry
        if (retryCount >= MAX_RETRIES) {
          stateManager.recordPost('hackernews', post.id, false, {
            title: post.title,
            error: error.message
          })
        }

        retryCount++
      }
    } // End retry loop

      // HN has strict rate limits - wait 10 minutes between posts
      if (toPost.indexOf(post) < toPost.length - 1) {
        logger.info('HN', 'Waiting 10 minutes before next post (HN rate limit)...')
        await sleep(600000)
      }
    }

  } finally {
    await browser.close()
  }

  logger.info('HN', `Complete: ${successCount}/${toPost.length} successful`)
}

// Get status
export function getHackerNewsStatus() {
  const stats = stateManager.getStats('hackernews')
  const posts = loadPosts()

  return {
    configured: !!(process.env.HN_USERNAME && process.env.HN_PASSWORD),
    postsToday: stats.postsToday,
    totalPosts: stats.totalPosts,
    availableContent: posts.length
  }
}

// Run directly
if (require.main === module) {
  postToHackerNews(1).then(() => {
    console.log('\nHacker News posting completed')
    process.exit(0)
  }).catch(err => {
    console.error('Error:', err)
    process.exit(1)
  })
}
