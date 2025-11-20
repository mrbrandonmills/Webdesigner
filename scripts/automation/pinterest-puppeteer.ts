/**
 * Pinterest Auto-Poster (Puppeteer-based)
 *
 * Uses browser automation since Pinterest API access was denied.
 * Logs in and creates pins directly via the web interface.
 */

import * as fs from 'fs'
import * as path from 'path'
import puppeteer from 'puppeteer'
import { pathsConfig } from './config'
import { logger } from './logger'
import { stateManager } from './state-manager'

interface PinterestPin {
  id: string
  title: string
  description: string
  link: string
  imageUrl: string
  board?: string
}

// Load pins from markdown file
function loadPins(): PinterestPin[] {
  const pinsPath = path.join(pathsConfig.contentDir, 'pinterest', 'pins.md')

  if (!fs.existsSync(pinsPath)) {
    logger.warn('PINTEREST', 'No pins file found')
    return []
  }

  const content = fs.readFileSync(pinsPath, 'utf-8')
  const pins: PinterestPin[] = []

  // Split by --- separator
  const blocks = content.split(/^---$/m).filter(b => b.trim())

  for (const block of blocks) {
    const lines = block.trim().split('\n')

    // Skip header comments
    if (lines[0]?.trim().startsWith('#')) continue

    let title = ''
    let description = ''
    let link = ''
    let imageUrl = ''
    let board = ''

    for (const line of lines) {
      const trimmed = line.trim()
      if (trimmed.toLowerCase().startsWith('title:')) {
        title = trimmed.replace(/^title:\s*/i, '')
      } else if (trimmed.toLowerCase().startsWith('description:')) {
        description = trimmed.replace(/^description:\s*/i, '')
      } else if (trimmed.toLowerCase().startsWith('link:')) {
        link = trimmed.replace(/^link:\s*/i, '')
      } else if (trimmed.toLowerCase().startsWith('image:')) {
        imageUrl = trimmed.replace(/^image:\s*/i, '')
      } else if (trimmed.toLowerCase().startsWith('board:')) {
        board = trimmed.replace(/^board:\s*/i, '')
      }
    }

    if (title && link) {
      const id = Buffer.from(title).toString('base64').substring(0, 12)
      pins.push({
        id,
        title,
        description: description || title,
        link,
        imageUrl: imageUrl || '',
        board: board || 'Dream Interpretation'
      })
    }
  }

  logger.info('PINTEREST', `Loaded ${pins.length} pins`)
  return pins
}

// Sleep helper
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Main posting function
export async function postToPinterestPuppeteer(pinCount: number = 1): Promise<void> {
  logger.info('PINTEREST', `Starting Pinterest posting (count: ${pinCount})`)

  const email = process.env.PINTEREST_EMAIL
  const password = process.env.PINTEREST_PASSWORD

  if (!email || !password) {
    logger.error('PINTEREST', 'Missing PINTEREST_EMAIL or PINTEREST_PASSWORD')
    return
  }

  const pins = loadPins()
  if (pins.length === 0) {
    logger.warn('PINTEREST', 'No pins available')
    return
  }

  // Get unposted content
  const postedIds = stateManager.getPostedIds('pinterest')
  const availablePins = pins.filter(p => !postedIds.includes(p.id))

  if (availablePins.length === 0) {
    logger.info('PINTEREST', 'All pins have been used, resetting')
    stateManager.resetPlatform('pinterest')
  }

  const toPost = availablePins.slice(0, pinCount)
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

    // Login to Pinterest
    logger.info('PINTEREST', 'Logging in...')
    await page.goto('https://www.pinterest.com/login/', { waitUntil: 'networkidle2' })

    await sleep(2000)

    // Fill login form
    await page.waitForSelector('input[name="id"]', { timeout: 10000 })
    await page.type('input[name="id"]', email, { delay: 50 })
    await page.type('input[name="password"]', password, { delay: 50 })

    // Click login button
    const loginButton = await page.$('button[type="submit"]')
    if (loginButton) {
      await loginButton.click()
    }

    // Wait for login to complete
    await sleep(5000)

    // Check if logged in
    const loggedIn = await page.evaluate(() => {
      return !window.location.href.includes('/login')
    })

    if (!loggedIn) {
      logger.error('PINTEREST', 'Login failed - check credentials')
      await browser.close()
      return
    }

    logger.info('PINTEREST', 'Login successful')

    // Post each pin
    for (const pin of toPost) {
      logger.info('PINTEREST', `Creating pin: ${pin.title.substring(0, 50)}...`)

      try {
        // Navigate to pin builder
        await page.goto('https://www.pinterest.com/pin-builder/', {
          waitUntil: 'networkidle2',
          timeout: 30000
        })

        await sleep(3000)

        // If we have an image URL, we need to use "Save from site"
        // Otherwise, would need to upload an image file

        // Fill title
        const titleSelectors = [
          'textarea[placeholder*="title"]',
          'div[data-test-id="pin-draft-title"] textarea',
          'textarea[aria-label*="title"]'
        ]

        let titleFilled = false
        for (const selector of titleSelectors) {
          const titleInput = await page.$(selector)
          if (titleInput) {
            await titleInput.click()
            await titleInput.type(pin.title, { delay: 30 })
            titleFilled = true
            break
          }
        }

        if (!titleFilled) {
          // Try clicking on the title area first
          const titleArea = await page.$('[data-test-id="pin-draft-title"]')
          if (titleArea) {
            await titleArea.click()
            await page.keyboard.type(pin.title, { delay: 30 })
            titleFilled = true
          }
        }

        await sleep(1000)

        // Fill description
        const descSelectors = [
          'textarea[placeholder*="description"]',
          'div[data-test-id="pin-draft-description"] textarea',
          'textarea[aria-label*="description"]'
        ]

        for (const selector of descSelectors) {
          const descInput = await page.$(selector)
          if (descInput) {
            await descInput.click()
            await descInput.type(pin.description, { delay: 20 })
            break
          }
        }

        await sleep(1000)

        // Fill link
        const linkSelectors = [
          'input[placeholder*="link"]',
          'input[aria-label*="link"]',
          'input[data-test-id="pin-draft-link"]'
        ]

        for (const selector of linkSelectors) {
          const linkInput = await page.$(selector)
          if (linkInput) {
            await linkInput.click()
            await linkInput.type(pin.link, { delay: 30 })
            break
          }
        }

        await sleep(2000)

        // Note: Creating a pin also requires uploading an image
        // Pinterest doesn't allow pins without images
        // This would need to download the image from imageUrl and upload it

        // For now, log that image upload is needed
        logger.warn('PINTEREST', 'Pin creation requires image upload - this is a limitation')

        // Mark as attempted
        stateManager.recordPost('pinterest', pin.id, false, {
          title: pin.title,
          error: 'Image upload required - use Pinterest web interface or API'
        })

        // Wait between pins
        if (toPost.indexOf(pin) < toPost.length - 1) {
          logger.info('PINTEREST', 'Waiting 30s before next pin...')
          await sleep(30000)
        }

      } catch (error: any) {
        logger.error('PINTEREST', `Failed: ${error.message}`)
        stateManager.recordPost('pinterest', pin.id, false, {
          title: pin.title,
          error: error.message
        })
      }
    }

  } finally {
    await browser.close()
  }

  logger.info('PINTEREST', `Complete: ${successCount}/${toPost.length} successful`)
  logger.info('PINTEREST', 'Note: Pinterest Puppeteer automation has limitations with image upload')
}

// Get status
export function getPinterestPuppeteerStatus() {
  const stats = stateManager.getStats('pinterest')
  const pins = loadPins()

  return {
    configured: !!(process.env.PINTEREST_EMAIL && process.env.PINTEREST_PASSWORD),
    postsToday: stats.postsToday,
    totalPosts: stats.totalPosts,
    availableContent: pins.length
  }
}

// Run directly
if (require.main === module) {
  postToPinterestPuppeteer(1).then(() => {
    console.log('\nPinterest posting completed')
    process.exit(0)
  }).catch(err => {
    console.error('Error:', err)
    process.exit(1)
  })
}
