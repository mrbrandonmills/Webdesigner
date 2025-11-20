/**
 * Pinterest Headless Poster
 *
 * Logs into Pinterest and posts pins using Puppeteer.
 * Uses the generated content from pinterest-content-generator.
 *
 * Usage:
 *   npx tsx scripts/automation/pinterest-headless-poster.ts
 *   npx tsx scripts/automation/pinterest-headless-poster.ts --dry-run
 */

import * as fs from 'fs'
import * as path from 'path'
import puppeteer from 'puppeteer'
import { config } from 'dotenv'

// Load environment variables
config({ path: path.join(process.cwd(), '.env.local') })

interface PinterestPin {
  type: string
  title: string
  description: string
  hashtags: string[]
  altText: string
  board: string
  link: string
  scheduledDate: string
}

async function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function loginToPinterest(page: puppeteer.Page, email: string, password: string): Promise<boolean> {
  console.log('🔐 Logging into Pinterest...')

  try {
    await page.goto('https://www.pinterest.com/login/', { waitUntil: 'networkidle2' })
    await delay(2000)

    // Enter email
    await page.waitForSelector('input[name="id"]', { timeout: 10000 })
    await page.type('input[name="id"]', email, { delay: 50 })

    // Enter password
    await page.waitForSelector('input[name="password"]', { timeout: 10000 })
    await page.type('input[name="password"]', password, { delay: 50 })

    // Click login button
    await page.click('button[type="submit"]')

    // Wait for navigation
    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 })
    await delay(3000)

    // Check if logged in
    const isLoggedIn = !page.url().includes('login')

    if (isLoggedIn) {
      console.log('   ✅ Login successful')
      return true
    } else {
      console.log('   ❌ Login failed - may need manual verification')
      return false
    }
  } catch (error: any) {
    console.error('   ❌ Login error:', error.message)
    return false
  }
}

async function createPin(
  page: puppeteer.Page,
  pin: PinterestPin
): Promise<boolean> {
  console.log('📌 Creating pin:', pin.title.substring(0, 50) + '...')

  try {
    // Go to pin creation
    await page.goto('https://www.pinterest.com/pin-creation-tool/', { waitUntil: 'networkidle2' })
    await delay(3000)

    // Add destination link (this auto-populates image)
    try {
      await page.waitForSelector('[data-test-id="pin-draft-link"] input', { timeout: 5000 })
      await page.type('[data-test-id="pin-draft-link"] input', pin.link, { delay: 30 })
      await delay(2000)
    } catch {
      console.log('   ⚠️ Could not find link input')
    }

    // Add title
    try {
      await page.waitForSelector('[data-test-id="pin-draft-title"] textarea', { timeout: 5000 })
      await page.type('[data-test-id="pin-draft-title"] textarea', pin.title, { delay: 30 })
    } catch {
      console.log('   ⚠️ Could not find title input')
    }

    // Add description with hashtags
    const fullDescription = pin.description + '\n\n' + pin.hashtags.join(' ')
    try {
      await page.waitForSelector('[data-test-id="pin-draft-description"] textarea', { timeout: 5000 })
      await page.type('[data-test-id="pin-draft-description"] textarea', fullDescription, { delay: 20 })
    } catch {
      console.log('   ⚠️ Could not find description input')
    }

    // Click Publish
    try {
      await page.waitForSelector('[data-test-id="board-dropdown-save-button"]', { timeout: 5000 })
      await page.click('[data-test-id="board-dropdown-save-button"]')
      await delay(3000)

      console.log('   ✅ Pin created successfully')
      return true
    } catch {
      console.log('   ❌ Could not find publish button')
      return false
    }

  } catch (error: any) {
    console.error('   ❌ Pin creation error:', error.message)
    return false
  }
}

async function main() {
  const args = process.argv.slice(2)
  const dryRun = args.includes('--dry-run')

  console.log('\n📌 Pinterest Headless Poster')
  console.log('============================\n')

  // Check credentials
  const email = process.env.PINTEREST_EMAIL
  const password = process.env.PINTEREST_PASSWORD

  if (!email || !password) {
    console.error('❌ Pinterest credentials not configured')
    console.log('\nAdd to .env.local:')
    console.log('  PINTEREST_EMAIL=your@email.com')
    console.log('  PINTEREST_PASSWORD=yourpassword')
    process.exit(1)
  }

  // Load pins to post
  const contentDir = path.join(process.cwd(), 'data', 'content-batches')
  const productDir = path.join(process.cwd(), 'data', 'product-pins')

  // Get content pins
  let pins: PinterestPin[] = []

  if (fs.existsSync(contentDir)) {
    const files = fs.readdirSync(contentDir).filter(f => f.startsWith('content-batch-') && f.endsWith('.json'))
    if (files.length > 0) {
      const latestBatch = files.sort().reverse()[0]
      const batch = JSON.parse(fs.readFileSync(path.join(contentDir, latestBatch), 'utf-8'))
      pins = batch.pinterest || []
      console.log('📂 Loaded ' + pins.length + ' content pins')
    }
  }

  // Get product pins
  if (fs.existsSync(productDir)) {
    const files = fs.readdirSync(productDir).filter(f => f.startsWith('product-pins-') && f.endsWith('.json'))
    if (files.length > 0) {
      const latestProducts = files.sort().reverse()[0]
      const products = JSON.parse(fs.readFileSync(path.join(productDir, latestProducts), 'utf-8'))
      // Convert product format to pin format
      const productPins = products.map((p: any) => ({
        type: 'product',
        title: p.pinTitle,
        description: p.pinDescription,
        hashtags: p.hashtags,
        altText: p.altText,
        board: p.board,
        link: p.link,
        scheduledDate: new Date().toISOString().split('T')[0]
      }))
      pins = [...pins, ...productPins]
      console.log('📂 Loaded ' + productPins.length + ' product pins')
    }
  }

  if (pins.length === 0) {
    console.log('❌ No pins found')
    console.log('Run: npm run pinterest:content')
    console.log('Run: npm run pinterest:products')
    process.exit(1)
  }

  // Filter to 5 pins max per run (to avoid rate limiting)
  const pinsToPost = pins.slice(0, 5)
  console.log('📋 Will post ' + pinsToPost.length + ' pins\n')

  if (dryRun) {
    console.log('🔍 DRY RUN - Would post these pins:')
    pinsToPost.forEach((pin, i) => {
      console.log('\n' + (i + 1) + '. ' + pin.title)
      console.log('   Board: ' + pin.board)
      console.log('   Link: ' + pin.link)
    })
    process.exit(0)
  }

  // Launch browser
  console.log('🌐 Launching browser...')
  const browser = await puppeteer.launch({
    headless: false, // Set to true for fully headless
    defaultViewport: { width: 1280, height: 800 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })

  const page = await browser.newPage()

  // Set user agent
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')

  try {
    // Login
    const loggedIn = await loginToPinterest(page, email, password)

    if (!loggedIn) {
      console.log('\n⚠️ Could not log in automatically.')
      console.log('Pinterest may require manual verification.')
      console.log('Please log in manually in the browser window.')
      
      // Keep browser open for manual login
      console.log('Browser will stay open. Close it when done.')
      return
    }

    // Post each pin
    let successCount = 0
    for (const pin of pinsToPost) {
      const success = await createPin(page, pin)
      if (success) successCount++

      // Delay between pins to avoid rate limiting
      await delay(5000)
    }

    console.log('\n✅ Posted ' + successCount + '/' + pinsToPost.length + ' pins')

  } catch (error: any) {
    console.error('\n❌ Error:', error.message)
  } finally {
    await browser.close()
  }
}

// Run
main().catch(err => {
  console.error('Error:', err.message)
  process.exit(1)
})
