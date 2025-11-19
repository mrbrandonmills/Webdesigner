/**
 * Quora Auto-Poster
 *
 * Automatically posts answers to Quora on a schedule
 * Uses Puppeteer for browser automation (no public API)
 * - Reads answers from /content/quora/answers.md
 * - Searches for relevant questions
 * - Tracks which answers have been posted
 * - Handles rate limits and retries
 *
 * Usage:
 * - Run directly: npx tsx scripts/automation/quora-poster.ts
 * - Via scheduler: Automatically called by scheduler.ts
 */

import puppeteer, { Browser, Page } from 'puppeteer'
import * as fs from 'fs'
import * as crypto from 'crypto'
import {
  quoraConfig,
  rateLimitConfig,
  retryConfig,
  pathsConfig,
  isPlatformConfigured,
} from './config'
import { logger } from './logger'
import { stateManager } from './state-manager'

interface QuoraAnswer {
  id: string
  questionKeywords: string
  questionUrl?: string
  answer: string
  topic?: string
}

// Parse answers from markdown file
function parseAnswersFromMarkdown(content: string): QuoraAnswer[] {
  const answers: QuoraAnswer[] = []
  const answerBlocks = content.split(/^---$/m).filter(block => block.trim())

  for (const block of answerBlocks) {
    const lines = block.trim().split('\n')
    let questionKeywords = ''
    let questionUrl = ''
    let answer = ''
    let topic = ''
    let inAnswer = false

    for (const line of lines) {
      if (line.startsWith('keywords:') || line.startsWith('question:')) {
        questionKeywords = line.replace(/^(keywords:|question:)/, '').trim()
      } else if (line.startsWith('url:')) {
        questionUrl = line.replace('url:', '').trim()
      } else if (line.startsWith('topic:')) {
        topic = line.replace('topic:', '').trim()
      } else if (line.startsWith('answer:')) {
        answer = line.replace('answer:', '').trim()
        inAnswer = true
      } else if (inAnswer) {
        answer += '\n' + line
      }
    }

    if (questionKeywords && answer) {
      const id = crypto
        .createHash('md5')
        .update(`${questionKeywords}-${answer.substring(0, 50)}`)
        .digest('hex')
        .substring(0, 8)

      answers.push({
        id,
        questionKeywords,
        questionUrl: questionUrl || undefined,
        answer: answer.trim(),
        topic: topic || undefined,
      })
    }
  }

  return answers
}

// Load answers from content file
function loadAnswers(): QuoraAnswer[] {
  const answersPath = pathsConfig.quoraAnswers

  if (!fs.existsSync(answersPath)) {
    logger.error('QUORA', `Answers file not found: ${answersPath}`)
    return []
  }

  const content = fs.readFileSync(answersPath, 'utf-8')
  const answers = parseAnswersFromMarkdown(content)

  logger.info('QUORA', `Loaded ${answers.length} answers from content file`)
  return answers
}

// Sleep helper
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Login to Quora
async function loginToQuora(page: Page): Promise<boolean> {
  logger.info('QUORA', 'Logging into Quora...')

  try {
    await page.goto('https://www.quora.com/', { waitUntil: 'networkidle2' })
    await sleep(2000)

    // Check if already logged in
    const isLoggedIn = await page.evaluate(() => {
      return !!document.querySelector('[class*="profile_photo"]') ||
             !!document.querySelector('a[href*="/profile/"]')
    })

    if (isLoggedIn) {
      logger.info('QUORA', 'Already logged in')
      return true
    }

    // Go to login page
    await page.goto('https://www.quora.com/', { waitUntil: 'networkidle2' })

    // Look for login form
    const emailInput = await page.$('input[type="email"], input[name="email"], input[placeholder*="Email"]')
    if (!emailInput) {
      // Try clicking login button first
      const loginButton = await page.$('button:has-text("Log in"), a:has-text("Log in")')
      if (loginButton) {
        await loginButton.click()
        await sleep(2000)
      }
    }

    // Fill email
    await page.waitForSelector('input[type="email"], input[name="email"]', { timeout: 10000 })
    await page.type('input[type="email"], input[name="email"]', quoraConfig.email)
    await sleep(500)

    // Click continue/next
    const continueButton = await page.$('button[type="submit"], button:has-text("Continue")')
    if (continueButton) {
      await continueButton.click()
      await sleep(2000)
    }

    // Fill password
    await page.waitForSelector('input[type="password"]', { timeout: 10000 })
    await page.type('input[type="password"]', quoraConfig.password)
    await sleep(500)

    // Click login
    const submitButton = await page.$('button[type="submit"], button:has-text("Log in")')
    if (submitButton) {
      await submitButton.click()
    }

    // Wait for login to complete
    await sleep(5000)

    // Verify login
    const verified = await page.evaluate(() => {
      return !!document.querySelector('[class*="profile"]') ||
             !document.querySelector('input[type="password"]')
    })

    if (verified) {
      logger.success('QUORA', 'Login successful')
      return true
    } else {
      logger.error('QUORA', 'Login verification failed')
      return false
    }
  } catch (error: any) {
    logger.error('QUORA', `Login failed: ${error.message}`)
    return false
  }
}

// Search for a question on Quora
async function findQuestion(page: Page, keywords: string): Promise<string | null> {
  logger.info('QUORA', `Searching for question: "${keywords}"`)

  try {
    // Navigate to search
    const searchUrl = `https://www.quora.com/search?q=${encodeURIComponent(keywords)}`
    await page.goto(searchUrl, { waitUntil: 'networkidle2' })
    await sleep(3000)

    // Find question links
    const questionUrl = await page.evaluate(() => {
      const links = document.querySelectorAll('a[href*="/answer/"], a[href*="?q="]')
      for (const link of links) {
        const href = (link as HTMLAnchorElement).href
        // Look for question pages (not answer pages)
        if (href.includes('quora.com/') && !href.includes('/answer/') && !href.includes('/search')) {
          const urlObj = new URL(href)
          if (urlObj.pathname.length > 10) {
            return href
          }
        }
      }
      return null
    })

    if (questionUrl) {
      logger.info('QUORA', `Found question: ${questionUrl}`)
      return questionUrl
    } else {
      logger.warn('QUORA', 'No suitable question found')
      return null
    }
  } catch (error: any) {
    logger.error('QUORA', `Search failed: ${error.message}`)
    return null
  }
}

// Post an answer to a question
async function postAnswer(
  page: Page,
  questionUrl: string,
  answerText: string
): Promise<{ success: boolean; error?: string }> {
  logger.info('QUORA', `Posting answer to: ${questionUrl}`)

  try {
    // Navigate to question
    await page.goto(questionUrl, { waitUntil: 'networkidle2' })
    await sleep(3000)

    // Click "Answer" button
    const answerButton = await page.$('button:has-text("Answer"), [class*="AnswerButton"]')
    if (!answerButton) {
      // Try alternate selectors
      const altButton = await page.evaluate(() => {
        const buttons = document.querySelectorAll('button, div[role="button"]')
        for (const btn of buttons) {
          if (btn.textContent?.includes('Answer')) {
            return true
          }
        }
        return false
      })

      if (!altButton) {
        return { success: false, error: 'Answer button not found' }
      }

      await page.evaluate(() => {
        const buttons = document.querySelectorAll('button, div[role="button"]')
        for (const btn of buttons) {
          if (btn.textContent?.includes('Answer')) {
            (btn as HTMLElement).click()
            break
          }
        }
      })
    } else {
      await answerButton.click()
    }

    await sleep(2000)

    // Wait for editor
    const editorSelector = '[contenteditable="true"], .doc, textarea'
    await page.waitForSelector(editorSelector, { timeout: 10000 })

    // Clear and type answer
    await page.click(editorSelector)
    await page.evaluate((selector) => {
      const editor = document.querySelector(selector)
      if (editor) {
        (editor as HTMLElement).textContent = ''
      }
    }, editorSelector)

    // Type the answer (split into chunks for long answers)
    const chunks = answerText.match(/.{1,500}/g) || [answerText]
    for (const chunk of chunks) {
      await page.type(editorSelector, chunk)
      await sleep(100)
    }

    await sleep(1000)

    // Click Post button
    const postButton = await page.$('button:has-text("Post"), [class*="submit"], button[type="submit"]')
    if (postButton) {
      await postButton.click()
    } else {
      // Try clicking by text
      await page.evaluate(() => {
        const buttons = document.querySelectorAll('button')
        for (const btn of buttons) {
          if (btn.textContent?.includes('Post')) {
            btn.click()
            break
          }
        }
      })
    }

    // Wait for post to complete
    await sleep(5000)

    logger.success('QUORA', 'Answer posted successfully')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// Main posting function
export async function postToQuora(postCount: number = 1): Promise<void> {
  logger.info('QUORA', `Starting Quora posting (count: ${postCount})`)

  // Check configuration
  if (!isPlatformConfigured('quora')) {
    logger.error('QUORA', 'Quora credentials not configured')
    console.log('\nAdd to .env.local:')
    console.log('   QUORA_EMAIL=your_email')
    console.log('   QUORA_PASSWORD=your_password')
    return
  }

  // Check daily limit
  const maxPosts = rateLimitConfig.quora.maxAnswersPerDay
  if (!stateManager.canPostToday('quora', maxPosts)) {
    logger.warn('QUORA', `Daily limit reached (${maxPosts} answers)`)
    return
  }

  // Load answers
  const answers = loadAnswers()
  if (answers.length === 0) {
    logger.warn('QUORA', 'No answers available to post')
    return
  }

  // Determine posts to make
  const remaining = stateManager.getPostsRemaining('quora', maxPosts)
  const actualCount = Math.min(postCount, remaining, answers.length)

  logger.info('QUORA', `Will post ${actualCount} of ${answers.length} available answers`)

  // Launch browser
  const browser = await puppeteer.launch({
    headless: true, // Set to false for debugging
    defaultViewport: { width: 1280, height: 720 },
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  let successCount = 0

  try {
    const page = await browser.newPage()

    // Set user agent
    await page.setUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    )

    // Login
    const loggedIn = await loginToQuora(page)
    if (!loggedIn) {
      logger.error('QUORA', 'Failed to login, aborting')
      return
    }

    // Post answers
    for (let i = 0; i < actualCount; i++) {
      const index = stateManager.getNextIndex('quora', answers.length)
      const answer = answers[index]

      // Check if already posted
      if (stateManager.wasPosted('quora', answer.id)) {
        logger.info('QUORA', `Skipping already posted answer`)
        continue
      }

      try {
        // Get question URL
        let questionUrl = answer.questionUrl
        if (!questionUrl) {
          questionUrl = await findQuestion(page, answer.questionKeywords)
        }

        if (!questionUrl) {
          logger.warn('QUORA', `Could not find question for: ${answer.questionKeywords}`)
          continue
        }

        // Post the answer
        const result = await postAnswer(page, questionUrl, answer.answer)

        if (result.success) {
          stateManager.recordPost('quora', answer.id, true, {
            title: answer.questionKeywords,
            url: questionUrl,
            index,
          })
          logger.postCompleted('QUORA', answer.questionKeywords, questionUrl)
          successCount++
        } else {
          stateManager.recordPost('quora', answer.id, false, {
            title: answer.questionKeywords,
            error: result.error,
            index,
          })
          logger.postFailed('QUORA', answer.questionKeywords, result)
        }
      } catch (error: any) {
        stateManager.recordPost('quora', answer.id, false, {
          title: answer.questionKeywords,
          error: error.message,
        })
        logger.postFailed('QUORA', answer.questionKeywords, error)

        // Wait before continuing
        await sleep(rateLimitConfig.quora.cooldownAfterError)
      }

      // Wait between posts
      if (i < actualCount - 1) {
        logger.info('QUORA', `Waiting ${rateLimitConfig.quora.minDelayBetweenAnswers / 1000}s before next answer`)
        await sleep(rateLimitConfig.quora.minDelayBetweenAnswers)
      }
    }
  } finally {
    await browser.close()
  }

  // Summary
  const stats = stateManager.getStats('quora')
  logger.success('QUORA', `Posting complete: ${successCount}/${actualCount} successful`)
  logger.info('QUORA', `Total answers: ${stats.totalPosts}, Today: ${stats.postsToday}`)
}

// Get posting status
export function getQuoraStatus(): {
  configured: boolean
  postsToday: number
  postsRemaining: number
  totalPosts: number
  availableContent: number
} {
  const stats = stateManager.getStats('quora')
  const answers = loadAnswers()

  return {
    configured: isPlatformConfigured('quora'),
    postsToday: stats.postsToday,
    postsRemaining: stateManager.getPostsRemaining('quora', rateLimitConfig.quora.maxAnswersPerDay),
    totalPosts: stats.totalPosts,
    availableContent: answers.length,
  }
}

// Run directly
if (require.main === module) {
  postToQuora(1)
    .then(() => {
      console.log('\nQuora posting completed')
      process.exit(0)
    })
    .catch(error => {
      logger.error('QUORA', 'Fatal error', error)
      process.exit(1)
    })
}

export default postToQuora
