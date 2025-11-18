/**
 * Pinterest Browser Automation
 *
 * Uses Playwright to automate Pinterest posting without requiring API access.
 * Stores Pinterest session cookies locally for persistent authentication.
 */

import { chromium, Browser, Page } from 'playwright'
import { writeFile, readFile, mkdir } from 'fs/promises'
import path from 'path'

interface PinterestCredentials {
  email: string
  password: string
}

interface PinData {
  title: string
  description: string
  imageUrl: string
  link: string
  boardName?: string
  altText?: string
}

interface PinterestSession {
  cookies: any[]
  timestamp: number
}

const PINTEREST_SESSION_FILE = path.join(process.cwd(), 'data', 'pinterest-session.json')
const SESSION_EXPIRY_DAYS = 30

export class PinterestAutomation {
  private browser: Browser | null = null
  private page: Page | null = null

  /**
   * Initialize browser and load saved session if available
   */
  async initialize(headless: boolean = true): Promise<void> {
    this.browser = await chromium.launch({
      headless,
      args: ['--disable-blink-features=AutomationControlled'],
    })

    const context = await this.browser.newContext({
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      viewport: { width: 1920, height: 1080 },
    })

    // Load saved session if available
    await this.loadSession(context)

    this.page = await context.newPage()
  }

  /**
   * Load saved Pinterest session cookies
   */
  private async loadSession(context: any): Promise<boolean> {
    try {
      const sessionData = await readFile(PINTEREST_SESSION_FILE, 'utf-8')
      const session: PinterestSession = JSON.parse(sessionData)

      // Check if session is expired
      const daysSinceLogin = (Date.now() - session.timestamp) / (1000 * 60 * 60 * 24)
      if (daysSinceLogin > SESSION_EXPIRY_DAYS) {
        console.log('Pinterest session expired')
        return false
      }

      await context.addCookies(session.cookies)
      console.log('✅ Loaded Pinterest session from cache')
      return true
    } catch (error) {
      console.log('No saved Pinterest session found')
      return false
    }
  }

  /**
   * Save Pinterest session cookies for reuse
   */
  private async saveSession(context: any): Promise<void> {
    const cookies = await context.cookies()
    const session: PinterestSession = {
      cookies,
      timestamp: Date.now(),
    }

    const dataDir = path.dirname(PINTEREST_SESSION_FILE)
    await mkdir(dataDir, { recursive: true })
    await writeFile(PINTEREST_SESSION_FILE, JSON.stringify(session, null, 2))
    console.log('✅ Saved Pinterest session')
  }

  /**
   * Login to Pinterest (only needed if no valid session exists)
   */
  async login(credentials: PinterestCredentials): Promise<void> {
    if (!this.page) throw new Error('Browser not initialized')

    console.log('🔐 Logging into Pinterest...')

    await this.page.goto('https://www.pinterest.com/login/')
    await this.page.waitForLoadState('networkidle')

    // Fill in email
    const emailInput = this.page.locator('input[type="email"], input[name="id"]')
    await emailInput.waitFor({ state: 'visible', timeout: 10000 })
    await emailInput.fill(credentials.email)

    // Fill in password
    const passwordInput = this.page.locator('input[type="password"], input[name="password"]')
    await passwordInput.fill(credentials.password)

    // Click login button
    const loginButton = this.page.locator('button[type="submit"], button:has-text("Log in")')
    await loginButton.click()

    // Wait for navigation to complete
    await this.page.waitForURL(/pinterest\.com\/(?!login)/, { timeout: 30000 })
    await this.page.waitForLoadState('networkidle')

    console.log('✅ Successfully logged into Pinterest')

    // Save session for reuse
    if (this.browser) {
      const context = this.page.context()
      await this.saveSession(context)
    }
  }

  /**
   * Check if already logged in
   */
  async isLoggedIn(): Promise<boolean> {
    if (!this.page) return false

    try {
      await this.page.goto('https://www.pinterest.com/', { timeout: 10000 })
      await this.page.waitForLoadState('networkidle')

      // Check for login page redirect
      const currentUrl = this.page.url()
      if (currentUrl.includes('/login')) {
        return false
      }

      // Check for profile icon (indicates logged in)
      const profileIcon = this.page.locator('[data-test-id="header-profile"], [aria-label*="Profile"]')
      const isVisible = await profileIcon.isVisible().catch(() => false)

      return isVisible
    } catch (error) {
      return false
    }
  }

  /**
   * Create a new Pin
   */
  async createPin(pinData: PinData): Promise<{ success: boolean; pinUrl?: string; error?: string }> {
    if (!this.page) throw new Error('Browser not initialized')

    try {
      console.log(`📌 Creating Pin: ${pinData.title}`)

      // Go to Pin creation page
      await this.page.goto('https://www.pinterest.com/pin-builder/')
      await this.page.waitForLoadState('networkidle')

      // Wait for the upload interface
      await this.page.waitForSelector('[data-test-id="pin-builder-container"]', { timeout: 10000 })

      // Handle image upload
      if (pinData.imageUrl.startsWith('http')) {
        // For URLs, paste into the URL input
        const urlInput = this.page.locator('input[placeholder*="URL"], input[placeholder*="url"]').first()
        if (await urlInput.isVisible().catch(() => false)) {
          await urlInput.fill(pinData.imageUrl)
          await this.page.waitForTimeout(2000) // Wait for image to load
        } else {
          throw new Error('Could not find URL input field')
        }
      } else {
        throw new Error('Only image URLs are supported. Upload local files manually or host them first.')
      }

      // Fill in title
      const titleInput = this.page.locator('input[placeholder*="title"], textarea[placeholder*="title"]').first()
      await titleInput.waitFor({ state: 'visible', timeout: 5000 })
      await titleInput.fill(pinData.title)

      // Fill in description
      const descriptionInput = this.page.locator('textarea[placeholder*="description"], div[contenteditable="true"]').first()
      if (await descriptionInput.isVisible().catch(() => false)) {
        await descriptionInput.fill(pinData.description)
      }

      // Fill in link
      const linkInput = this.page.locator('input[placeholder*="link"], input[placeholder*="website"]').first()
      if (await linkInput.isVisible().catch(() => false)) {
        await linkInput.fill(pinData.link)
      }

      // Fill in alt text if provided
      if (pinData.altText) {
        const altTextInput = this.page.locator('input[placeholder*="alt"], textarea[placeholder*="alt"]').first()
        if (await altTextInput.isVisible().catch(() => false)) {
          await altTextInput.fill(pinData.altText)
        }
      }

      // Select board if specified
      if (pinData.boardName) {
        const boardSelector = this.page.locator('button:has-text("Select"), [data-test-id="board-dropdown-select-button"]').first()
        if (await boardSelector.isVisible().catch(() => false)) {
          await boardSelector.click()
          await this.page.waitForTimeout(1000)

          // Search for board
          const boardSearch = this.page.locator('input[placeholder*="Search"]').first()
          if (await boardSearch.isVisible().catch(() => false)) {
            await boardSearch.fill(pinData.boardName)
            await this.page.waitForTimeout(1000)
          }

          // Click on the board
          const boardOption = this.page.locator(`[role="option"]:has-text("${pinData.boardName}")`).first()
          await boardOption.click()
        }
      }

      // Click publish button
      const publishButton = this.page.locator('button:has-text("Publish"), button:has-text("Save")').first()
      await publishButton.waitFor({ state: 'visible', timeout: 5000 })
      await publishButton.click()

      // Wait for success
      await this.page.waitForTimeout(3000)

      // Try to get the Pin URL from the success page
      const currentUrl = this.page.url()
      let pinUrl = currentUrl

      // Look for success indicators
      const successIndicator = this.page.locator('[data-test-id="pin-success"], :has-text("Pin created")').first()
      const isSuccess = await successIndicator.isVisible().catch(() => false)

      if (isSuccess || currentUrl.includes('/pin/')) {
        console.log(`✅ Pin created successfully: ${pinUrl}`)
        return { success: true, pinUrl }
      } else {
        throw new Error('Pin creation did not complete successfully')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      console.error('❌ Failed to create Pin:', errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  /**
   * Get list of boards
   */
  async getBoards(): Promise<{ name: string; id: string }[]> {
    if (!this.page) throw new Error('Browser not initialized')

    try {
      // Navigate to boards page
      await this.page.goto('https://www.pinterest.com/_/_/boards/')
      await this.page.waitForLoadState('networkidle')

      // Extract board names
      const boards = await this.page.$$eval('[data-test-id="board-card"], [data-test-id="board-name"]', (elements) => {
        return elements.map((el, index) => ({
          name: el.textContent?.trim() || `Board ${index + 1}`,
          id: `board-${index}`,
        }))
      })

      return boards
    } catch (error) {
      console.error('Failed to fetch boards:', error)
      return []
    }
  }

  /**
   * Take a screenshot (useful for debugging)
   */
  async screenshot(filename: string): Promise<void> {
    if (!this.page) throw new Error('Browser not initialized')

    const screenshotPath = path.join(process.cwd(), 'data', 'screenshots', filename)
    await mkdir(path.dirname(screenshotPath), { recursive: true })
    await this.page.screenshot({ path: screenshotPath, fullPage: true })
    console.log(`📸 Screenshot saved: ${screenshotPath}`)
  }

  /**
   * Close browser
   */
  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close()
      this.browser = null
      this.page = null
    }
  }
}

/**
 * Helper function to create a Pin with automatic session management
 */
export async function createPinterestPin(
  pinData: PinData,
  credentials?: PinterestCredentials,
  headless: boolean = true
): Promise<{ success: boolean; pinUrl?: string; error?: string }> {
  const automation = new PinterestAutomation()

  try {
    await automation.initialize(headless)

    // Check if already logged in
    const isLoggedIn = await automation.isLoggedIn()

    if (!isLoggedIn) {
      if (!credentials) {
        throw new Error('Pinterest credentials required - not logged in')
      }
      await automation.login(credentials)
    } else {
      console.log('✅ Using existing Pinterest session')
    }

    // Create the Pin
    const result = await automation.createPin(pinData)

    return result
  } finally {
    await automation.close()
  }
}
