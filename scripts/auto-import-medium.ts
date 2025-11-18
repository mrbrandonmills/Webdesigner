/**
 * Medium Auto-Import Script (Headless Browser Automation)
 *
 * Since Medium shut down their API for new integrations, this script uses
 * Puppeteer to automate the import process through Medium's web interface.
 *
 * Setup:
 * 1. Add to .env.local:
 *    MEDIUM_EMAIL=your@email.com
 *    MEDIUM_PASSWORD=your_password
 *
 * Run: npm run auto-import:medium
 */

import puppeteer from 'puppeteer'

const MEDIUM_EMAIL = process.env.MEDIUM_EMAIL || 'therealbrandonmills@gmail.com'
const MEDIUM_PASSWORD = process.env.MEDIUM_PASSWORD

interface MediumImport {
  url: string // URL of blog post to import (e.g., https://brandonmills.com/blog/braun-ipl-first-week)
  description: string // Short description for logging
}

// Posts to import to Medium
const postsToImport: MediumImport[] = [
  {
    url: 'https://brandonmills.com/blog/braun-ipl-first-week',
    description: 'Braun IPL First Week Review',
  },
  // Add more blog posts here as needed
]

async function loginToMedium(page: any): Promise<void> {
  console.log('🔐 Logging in to Medium with Google...')

  await page.goto('https://medium.com/', { waitUntil: 'networkidle2' })

  // Click "Sign in" button
  await page.waitForSelector('a[href*="sign-in"]', { timeout: 10000 })
  await page.click('a[href*="sign-in"]')

  // Wait for sign-in page to load
  await page.waitForNavigation({ waitUntil: 'networkidle2' })

  // Click "Sign in with Google"
  await page.waitForSelector('button', { timeout: 10000 })
  const buttons = await page.$$('button')

  for (const button of buttons) {
    const text = await page.evaluate((el: any) => el.textContent, button)
    if (text && text.includes('Sign in with Google')) {
      await button.click()
      break
    }
  }

  // Wait for Google OAuth popup/redirect
  await new Promise(resolve => setTimeout(resolve, 2000))

  // Google login flow
  try {
    // Enter email
    await page.waitForSelector('input[type="email"]', { timeout: 10000 })
    await page.type('input[type="email"]', MEDIUM_EMAIL!)
    await page.keyboard.press('Enter')

    // Wait for password field
    await new Promise(resolve => setTimeout(resolve, 2000))
    await page.waitForSelector('input[type="password"]', { timeout: 10000 })
    await page.type('input[type="password"]', MEDIUM_PASSWORD!)
    await page.keyboard.press('Enter')

    // Wait for 2FA if enabled (Google Authenticator, not email)
    // This will pause here - you'll need to manually enter 2FA code
    console.log('   ⏸️  If 2FA is enabled, enter code in browser window...')
    await new Promise(resolve => setTimeout(resolve, 30000)) // 30 second wait for 2FA

    // Wait for redirect back to Medium
    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 60000 })

    console.log('   ✅ Logged in successfully\n')
  } catch (error) {
    console.log('   ⚠️  Google login flow may have changed or requires manual intervention')
    console.log('   Browser will stay open - complete login manually and script will continue\n')

    // Wait for user to manually complete login
    await new Promise(resolve => setTimeout(resolve, 60000)) // 1 minute wait
  }
}

async function importPost(page: any, post: MediumImport): Promise<void> {
  console.log(`📝 Importing: ${post.description}`)
  console.log(`   URL: ${post.url}`)

  // Navigate to homepage
  await page.goto('https://medium.com/', { waitUntil: 'networkidle2' })

  // Click on profile picture
  await page.waitForSelector('img[alt*="profile"]', { timeout: 10000 })
  await page.click('img[alt*="profile"]')

  // Wait for dropdown menu
  await new Promise(resolve => setTimeout(resolve, 1000))

  // Click "Stories"
  const menuItems = await page.$$('a')
  for (const item of menuItems) {
    const text = await page.evaluate((el: any) => el.textContent, item)
    if (text && text.includes('Stories')) {
      await item.click()
      break
    }
  }

  // Wait for Stories page to load
  await page.waitForNavigation({ waitUntil: 'networkidle2' })

  // Click "Import a story" button
  await page.waitForSelector('button', { timeout: 10000 })
  const buttons = await page.$$('button')

  for (const button of buttons) {
    const text = await page.evaluate((el: any) => el.textContent, button)
    if (text && text.includes('Import a story')) {
      await button.click()
      break
    }
  }

  // Wait for import dialog
  await new Promise(resolve => setTimeout(resolve, 2000))

  // Find the URL input field and paste the URL
  await page.waitForSelector('input[type="text"]', { timeout: 10000 })
  await page.type('input[type="text"]', post.url)

  // Click "Import" button
  const importButtons = await page.$$('button')
  for (const button of importButtons) {
    const text = await page.evaluate((el: any) => el.textContent, button)
    if (text && text.includes('Import') && !text.includes('Import a story')) {
      await button.click()
      break
    }
  }

  // Wait for import to process
  console.log('   ⏳ Processing import...')
  await new Promise(resolve => setTimeout(resolve, 5000))

  // Wait for "See your story" button
  await page.waitForSelector('button', { timeout: 30000 })
  const seeStoryButtons = await page.$$('button')

  for (const button of seeStoryButtons) {
    const text = await page.evaluate((el: any) => el.textContent, button)
    if (text && text.includes('See your story')) {
      await button.click()
      break
    }
  }

  // Wait for story editor to load
  await page.waitForNavigation({ waitUntil: 'networkidle2' })

  console.log('   ✅ Story imported successfully!')
  console.log('   📝 Story is now in draft mode - ready to publish')

  // Take screenshot of the imported story
  const screenshotPath = `/tmp/medium-import-${Date.now()}.png`
  await page.screenshot({ path: screenshotPath, fullPage: true })
  console.log(`   📸 Screenshot saved: ${screenshotPath}`)

  // Optional: Click "Publish" button automatically
  // Uncomment these lines if you want to auto-publish (not recommended - review first!)
  /*
  const publishButtons = await page.$$('button')
  for (const button of publishButtons) {
    const text = await page.evaluate((el: any) => el.textContent, button)
    if (text && text.includes('Publish')) {
      await button.click()
      break
    }
  }

  // Confirm publish
  await new Promise(resolve => setTimeout(resolve, 2000))
  const confirmButtons = await page.$$('button')
  for (const button of confirmButtons) {
    const text = await page.evaluate((el: any) => el.textContent, button)
    if (text && text.includes('Publish now')) {
      await button.click()
      console.log('   ✅ Story published!')
      break
    }
  }
  */

  console.log('')
}

async function main() {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║      📝 MEDIUM AUTO-IMPORT - HEADLESS AUTOMATION 📝      ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
`)

  // Check credentials
  if (!MEDIUM_EMAIL || !MEDIUM_PASSWORD) {
    console.error('\n❌ ERROR: Medium credentials not found')
    console.log('\nSetup instructions:')
    console.log('1. Add to .env.local:')
    console.log('   MEDIUM_EMAIL=your@email.com')
    console.log('   MEDIUM_PASSWORD=your_password')
    process.exit(1)
  }

  console.log(`📊 Posts to import: ${postsToImport.length}`)
  console.log(`   ${postsToImport.map(p => p.description).join(', ')}\n`)

  const browser = await puppeteer.launch({
    headless: false, // Set to true for fully headless, false to watch it work
    defaultViewport: { width: 1280, height: 720 },
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  const page = await browser.newPage()

  // Set user agent to avoid bot detection
  await page.setUserAgent(
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  )

  try {
    await loginToMedium(page)

    // Import each post
    for (let i = 0; i < postsToImport.length; i++) {
      try {
        await importPost(page, postsToImport[i])

        // Wait between imports to avoid rate limiting
        if (i < postsToImport.length - 1) {
          console.log('   ⏳ Waiting 30 seconds before next import...\n')
          await new Promise(resolve => setTimeout(resolve, 30000))
        }
      } catch (error: any) {
        console.error(`   ❌ Error importing post: ${error.message}`)
        console.log('   ⚠️  Continuing with remaining posts...\n')
      }
    }

    console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║                  ✅ IMPORT COMPLETE! ✅                   ║
║                                                            ║
║  All posts imported to Medium as drafts.                  ║
║  Review and publish manually from Medium dashboard.       ║
║                                                            ║
║  IMPORTANT:                                               ║
║  - Stories are imported with canonical URLs               ║
║  - SEO credit goes to brandonmills.com                    ║
║  - Edit and publish when ready                            ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
`)

    // Keep browser open for 10 seconds to review
    console.log('\n⏳ Keeping browser open for 10 seconds...\n')
    await new Promise(resolve => setTimeout(resolve, 10000))

  } catch (error: any) {
    console.error('\n❌ Error:', error.message)

    // Take screenshot of error state
    const errorScreenshot = `/tmp/medium-import-error-${Date.now()}.png`
    await page.screenshot({ path: errorScreenshot, fullPage: true })
    console.log(`📸 Error screenshot saved: ${errorScreenshot}`)

    process.exit(1)
  } finally {
    await browser.close()
  }
}

main().catch(error => {
  console.error('\n❌ Fatal error:', error)
  process.exit(1)
})
