/**
 * Reddit Auto-Poster (Puppeteer-based)
 *
 * Uses browser automation instead of API since Reddit API is blocked.
 * Logs in and posts directly via the web interface.
 */

import * as fs from 'fs'
import * as path from 'path'
import puppeteer from 'puppeteer'
import { pathsConfig } from './config'
import { logger } from './logger'
import { stateManager } from './state-manager'

interface RedditPost {
  id: string
  subreddit: string
  title: string
  body: string
}

// Load posts from markdown file
function loadPosts(): RedditPost[] {
  const postsPath = path.join(pathsConfig.contentDir, 'reddit', 'posts.md')

  if (!fs.existsSync(postsPath)) {
    logger.warn('REDDIT', 'No posts file found')
    return []
  }

  const content = fs.readFileSync(postsPath, 'utf-8')
  const posts: RedditPost[] = []

  // Split by --- separator
  const blocks = content.split(/^---$/m).filter(b => b.trim())

  for (const block of blocks) {
    // Skip header comments
    if (block.trim().startsWith('#')) continue

    const lines = block.trim().split('\n')
    let subreddit = 'Dreams'
    let title = ''
    let body = ''

    // Check first line for subreddit
    const firstLine = lines[0]?.trim()
    if (firstLine?.toLowerCase().startsWith('r/')) {
      subreddit = firstLine.replace(/^r\//i, '')
      title = lines[1]?.trim() || ''
      body = lines.slice(2).join('\n').trim()
    } else if (firstLine?.toLowerCase().startsWith('subreddit:')) {
      subreddit = firstLine.replace(/^subreddit:\s*/i, '')
      title = lines[1]?.trim() || ''
      body = lines.slice(2).join('\n').trim()
    } else {
      title = firstLine || ''
      body = lines.slice(1).join('\n').trim()
    }

    if (title && body) {
      const id = Buffer.from(title).toString('base64').substring(0, 12)
      posts.push({ id, subreddit, title, body })
    }
  }

  logger.info('REDDIT', `Loaded ${posts.length} posts`)
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
    logger.info('REDDIT', `Debug screenshot saved: ${filename}`)
  } catch (err: any) {
    logger.warn('REDDIT', `Failed to capture screenshot: ${err.message}`)
  }
}

// Robust login verification using multiple element-based checks
async function verifyRedditLogin(page: any): Promise<{ loggedIn: boolean; reason: string }> {
  try {
    const currentUrl = page.url()

    // Check 1: Not on login page anymore
    if (currentUrl.includes('/login')) {
      return { loggedIn: false, reason: 'Still on login page' }
    }

    // Check 2: Look for user account elements (old.reddit.com)
    const hasUserMenu = await page.evaluate(() => {
      // old.reddit.com shows username in top right
      const userElement = document.querySelector('span.user a') ||
                          document.querySelector('#header-bottom-right .user') ||
                          document.querySelector('a[href*="/user/"]')
      return !!userElement
    })

    if (hasUserMenu) {
      return { loggedIn: true, reason: 'Found user menu element' }
    }

    // Check 3: Look for logout link (reliable indicator)
    const hasLogout = await page.evaluate(() => {
      const logoutLink = document.querySelector('a[href*="logout"]') ||
                         Array.from(document.querySelectorAll('a')).find(a => a.textContent?.toLowerCase().includes('logout'))
      return !!logoutLink
    })

    if (hasLogout) {
      return { loggedIn: true, reason: 'Found logout link' }
    }

    // Check 4: Look for submit/create post button (secondary indicator)
    const hasSubmitButton = await page.evaluate(() => {
      const submitButton = document.querySelector('a[href*="/submit"]') ||
                           document.querySelector('.submit') ||
                           Array.from(document.querySelectorAll('a')).find(a => a.textContent?.includes('submit'))
      return !!submitButton
    })

    if (hasSubmitButton) {
      return { loggedIn: true, reason: 'Found submit button' }
    }

    // Check 5: Check if we're on reddit.com (not login)
    if (currentUrl.includes('reddit.com') && !currentUrl.includes('/login')) {
      // Wait a bit more for page to fully load
      await sleep(2000)

      // Recheck for user elements
      const recheckUser = await page.evaluate(() => {
        return !!document.querySelector('span.user a')
      })

      if (recheckUser) {
        return { loggedIn: true, reason: 'Found user element after recheck' }
      }
    }

    return { loggedIn: false, reason: 'No login indicators found' }

  } catch (err: any) {
    return { loggedIn: false, reason: `Verification error: ${err.message}` }
  }
}

// Main posting function
export async function postToReddit(postCount: number = 1): Promise<void> {
  logger.info('REDDIT', `Starting Reddit posting (count: ${postCount})`)

  const username = process.env.REDDIT_USERNAME
  const password = process.env.REDDIT_PASSWORD

  if (!username || !password) {
    logger.error('REDDIT', 'Missing REDDIT_USERNAME or REDDIT_PASSWORD')
    return
  }

  const posts = loadPosts()
  if (posts.length === 0) {
    logger.warn('REDDIT', 'No posts available')
    return
  }

  // Get unposted content
  const postedIds = stateManager.getPostedIds('reddit')
  const availablePosts = posts.filter(p => !postedIds.includes(p.id))

  if (availablePosts.length === 0) {
    logger.info('REDDIT', 'All posts have been used, resetting')
    stateManager.resetPlatform('reddit')
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

    // Login to Reddit using old.reddit.com (more stable for automation)
    logger.info('REDDIT', 'Logging in...')
    await page.goto('https://old.reddit.com/login', { waitUntil: 'networkidle2' })

    await sleep(2000)

    // Fill login form - old.reddit.com uses 'user' not 'username'
    const usernameSelectors = [
      'input[name="user"]',
      'input[name="username"]',
      'input[id="user_login"]',
      '#loginUsername',
      'input[type="text"]'
    ]

    let usernameFilled = false
    for (const selector of usernameSelectors) {
      const input = await page.$(selector)
      if (input) {
        await input.click()
        await input.type(username, { delay: 50 })
        usernameFilled = true
        logger.info('REDDIT', `Found username input with selector: ${selector}`)
        break
      }
    }

    if (!usernameFilled) {
      // Take screenshot for debugging
      const screenshotPath = `logs/screenshots/reddit-login-fail-${new Date().toISOString().replace(/:/g, '-')}.png`
      await page.screenshot({ path: screenshotPath, fullPage: true })
      logger.error('REDDIT', `Could not find username input. Screenshot saved: ${screenshotPath}`)

      // Log what's actually on the page
      const pageContent = await page.content()
      logger.error('REDDIT', `Page content (first 500 chars): ${pageContent.substring(0, 500)}`)

      throw new Error('Could not find username input - see screenshot in logs/screenshots/')
    }

    const passwordSelectors = [
      'input[name="passwd"]',
      'input[name="password"]',
      'input[id="passwd_login"]',
      '#loginPassword',
      'input[type="password"]'
    ]

    for (const selector of passwordSelectors) {
      const input = await page.$(selector)
      if (input) {
        await input.click()
        await input.type(password, { delay: 50 })
        break
      }
    }

    // Click login button
    const loginSelectors = [
      'button[type="submit"]',
      'button.login'
    ]

    for (const selector of loginSelectors) {
      const btn = await page.$(selector)
      if (btn) {
        await btn.click()
        break
      }
    }

    // Wait for login to complete with timeout protection
    logger.info('REDDIT', 'Waiting for login to complete...')
    await Promise.race([
      sleep(8000),
      page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 8000 }).catch(() => {
        // Navigation timeout is okay
      })
    ])

    // Robust login verification with multiple attempts
    const MAX_LOGIN_ATTEMPTS = 3
    let loginAttempt = 0
    let loginVerified = false

    while (loginAttempt < MAX_LOGIN_ATTEMPTS && !loginVerified) {
      if (loginAttempt > 0) {
        logger.info('REDDIT', `Login verification attempt ${loginAttempt + 1}/${MAX_LOGIN_ATTEMPTS}`)
        await sleep(3000) // Wait before rechecking
      }

      const loginCheck = await verifyRedditLogin(page)

      if (loginCheck.loggedIn) {
        logger.info('REDDIT', `Login successful: ${loginCheck.reason}`)
        loginVerified = true
      } else {
        logger.warn('REDDIT', `Login check failed: ${loginCheck.reason}`)
        loginAttempt++

        // Capture screenshot for debugging
        if (loginAttempt === MAX_LOGIN_ATTEMPTS) {
          const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
          await captureDebugScreenshot(page, `reddit-login-fail-${timestamp}.png`)
        }
      }
    }

    if (!loginVerified) {
      logger.error('REDDIT', 'Login failed after multiple verification attempts - check credentials')
      await browser.close()
      return
    }

    // Post each item with retry logic
    for (const post of toPost) {
      logger.info('REDDIT', `Posting to r/${post.subreddit}: ${post.title.substring(0, 50)}...`)

      const MAX_POST_RETRIES = 2
      let postRetry = 0
      let posted = false

      while (postRetry <= MAX_POST_RETRIES && !posted) {
        if (postRetry > 0) {
          const backoffTime = Math.min(30000 * Math.pow(2, postRetry - 1), 120000) // Max 2 min
          logger.info('REDDIT', `Retry ${postRetry}/${MAX_POST_RETRIES} after ${backoffTime / 1000}s...`)
          await sleep(backoffTime)
        }

        try {
        // Navigate to submit page (use old reddit for stability)
        await page.goto(`https://old.reddit.com/r/${post.subreddit}/submit?selftext=true`, {
          waitUntil: 'networkidle2',
          timeout: 30000
        })

        await sleep(3000)

        // Fill title - try multiple selectors (old reddit uses input, new uses textarea)
        const titleSelectors = [
          'textarea[name="title"]',
          'input[name="title"]',
          'textarea[placeholder*="Title"]',
          'input[placeholder*="Title"]',
          '[data-test-id="title-text-area"]'
        ]

        let titleFilled = false
        for (const selector of titleSelectors) {
          const titleInput = await page.$(selector)
          if (titleInput) {
            await titleInput.click()
            await titleInput.type(post.title, { delay: 30 })
            titleFilled = true
            break
          }
        }

        if (!titleFilled) {
          throw new Error('Could not find title input')
        }

        await sleep(1000)

        // Fill body - try multiple selectors (old reddit uses textarea, new uses contenteditable)
        const bodySelectors = [
          'textarea[name="text"]',
          'div[contenteditable="true"]',
          'textarea[placeholder*="Text"]',
          '[data-test-id="text-area"]',
          '.public-DraftEditor-content'
        ]

        let bodyFilled = false
        for (const selector of bodySelectors) {
          const bodyInput = await page.$(selector)
          if (bodyInput) {
            await bodyInput.click()
            await bodyInput.type(post.body, { delay: 20 })
            bodyFilled = true
            break
          }
        }

        if (!bodyFilled) {
          throw new Error('Could not find body input')
        }

        await sleep(2000)

        // Click post button - try multiple selectors
        const postButtonSelectors = [
          'button[type="submit"]',
          'button:has-text("Post")',
          '[data-test-id="submit-button"]'
        ]

        let posted = false
        for (const selector of postButtonSelectors) {
          const postButton = await page.$(selector)
          if (postButton) {
            const isDisabled = await postButton.evaluate(el => (el as HTMLButtonElement).disabled)
            if (!isDisabled) {
              await postButton.click()
              posted = true
              break
            }
          }
        }

        if (!posted) {
          throw new Error('Could not find or click post button')
        }

        // Wait for post to complete with timeout
        logger.info('REDDIT', 'Waiting for post submission...')
        await Promise.race([
          sleep(8000),
          page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 8000 }).catch(() => {
            // Navigation timeout is okay
          })
        ])

        // Capture screenshot for debugging
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
        await captureDebugScreenshot(page, `reddit-post-${timestamp}.png`)

        // Check if successful
        const currentUrl = page.url()
        if (currentUrl.includes('/comments/')) {
          stateManager.recordPost('reddit', post.id, true, {
            title: post.title,
            subreddit: post.subreddit,
            url: currentUrl
          })
          logger.info('REDDIT', `Posted successfully: ${currentUrl}`)
          successCount++
          posted = true
        } else {
          // Check for error messages in page
          const errorMessage = await page.evaluate(() => {
            const errorDiv = document.querySelector('.error') ||
                            document.querySelector('.status.error') ||
                            document.querySelector('[class*="error"]')
            return errorDiv ? errorDiv.textContent : 'Unknown error - URL did not change to post page'
          })

          logger.error('REDDIT', `Post failed: ${errorMessage}`)
          logger.info('REDDIT', `Current URL: ${currentUrl}`)

          // Record failure on last retry
          if (postRetry >= MAX_POST_RETRIES) {
            stateManager.recordPost('reddit', post.id, false, {
              title: post.title,
              error: errorMessage,
              url: currentUrl,
              screenshot: `reddit-post-${timestamp}.png`
            })
          }
        }

        postRetry++

      } catch (error: any) {
        logger.error('REDDIT', `Exception during posting: ${error.message}`)

        // Record failure on last retry
        if (postRetry >= MAX_POST_RETRIES) {
          stateManager.recordPost('reddit', post.id, false, {
            title: post.title,
            error: error.message
          })
        }

        postRetry++
      }
    } // End retry loop

      // Wait between posts (Reddit rate limit)
      if (toPost.indexOf(post) < toPost.length - 1) {
        logger.info('REDDIT', 'Waiting 60s before next post...')
        await sleep(60000)
      }
    }

  } finally {
    await browser.close()
  }

  logger.info('REDDIT', `Complete: ${successCount}/${toPost.length} successful`)
}

// Get status
export function getRedditStatus() {
  const stats = stateManager.getStats('reddit')
  const posts = loadPosts()

  return {
    configured: !!(process.env.REDDIT_USERNAME && process.env.REDDIT_PASSWORD),
    postsToday: stats.postsToday,
    totalPosts: stats.totalPosts,
    availableContent: posts.length
  }
}

// Run directly
if (require.main === module) {
  postToReddit(1).then(() => {
    console.log('\nReddit posting completed')
    process.exit(0)
  }).catch(err => {
    console.error('Error:', err)
    process.exit(1)
  })
}
