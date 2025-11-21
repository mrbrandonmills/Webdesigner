/**
 * Automated Pinterest OAuth Demo Video Recorder
 *
 * This script:
 * 1. Starts QuickTime screen recording
 * 2. Opens demo page
 * 3. Automates the complete OAuth flow
 * 4. Records everything for Pinterest approval
 */

import puppeteer from 'puppeteer'
import { exec } from 'child_process'
import { promisify } from 'util'
import { config } from 'dotenv'

// Load environment variables
config({ path: '.env.local' })

const execAsync = promisify(exec)

async function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function startQuickTimeRecording() {
  console.log('📹 Starting QuickTime screen recording...')

  // AppleScript to start QuickTime recording
  const script = `
    tell application "QuickTime Player"
      activate
      new screen recording
      delay 2
      tell application "System Events"
        keystroke return
      end tell
    end tell
  `

  await execAsync(`osascript -e '${script.replace(/\n/g, ' ')}'`)
  await wait(3000) // Wait for recording to start

  console.log('✅ Recording started!')
}

async function stopQuickTimeRecording() {
  console.log('🛑 Stopping recording...')

  const script = `
    tell application "QuickTime Player"
      tell front document
        stop
      end tell
    end tell
  `

  await execAsync(`osascript -e '${script.replace(/\n/g, ' ')}'`)
  await wait(1000)

  console.log('✅ Recording stopped!')
}

async function recordPinterestDemo() {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1920, height: 1080 },
    args: ['--start-fullscreen']
  })

  const page = await browser.newPage()

  try {
    // Start recording
    await startQuickTimeRecording()
    await wait(2000)

    console.log('Step 1: Opening demo page...')
    await page.goto('https://brandonmills.com/admin/pinterest-demo', {
      waitUntil: 'networkidle0'
    })
    await wait(3000)

    console.log('Step 2: Clicking "Connect to Pinterest"...')
    const [connectButton] = await page.$x("//button[contains(text(), 'Connect to Pinterest')]")
    await connectButton.click()
    await wait(2000)

    // Wait for Pinterest login page
    console.log('Step 3: Waiting for Pinterest login page...')
    await page.waitForNavigation({ waitUntil: 'networkidle0' })
    await wait(2000)

    // Log in to Pinterest
    console.log('Step 4: Logging in to Pinterest...')
    const email = process.env.PINTEREST_EMAIL!
    const password = process.env.PINTEREST_PASSWORD!

    await page.type('input[type="email"]', email, { delay: 100 })
    await wait(500)
    await page.type('input[type="password"]', password, { delay: 100 })
    await wait(1000)

    await page.click('button[type="submit"]')
    await wait(3000)

    // Wait for authorization page
    console.log('Step 5: Authorizing app...')
    await wait(3000)

    // IMPORTANT: Pause here to show authorization code in URL
    console.log('📍 SHOWING URL BAR (authorization in progress)...')
    await wait(3000)

    // Click authorize button
    try {
      const [allowButton] = await page.$x("//button[contains(text(), 'Allow') or contains(text(), 'Give access') or contains(text(), 'Authorize')]")
      if (allowButton) {
        await allowButton.click()
      }
    } catch (e) {
      console.log('Authorization button not found, may already be authorized')
    }
    await wait(2000)

    // Wait for redirect back to demo page
    console.log('Step 6: Processing OAuth callback...')
    await page.waitForNavigation({ waitUntil: 'networkidle0' })
    await wait(3000)

    // Should now show access token
    console.log('Step 7: Showing access token...')
    await wait(3000)

    // Fetch boards
    console.log('Step 8: Fetching boards...')
    const [fetchButton] = await page.$x("//button[contains(text(), 'Fetch Boards')]")
    await fetchButton.click()
    await wait(3000)

    // Select board and create pin
    console.log('Step 9: Creating pin...')
    const selectElement = await page.$('select')
    if (selectElement) {
      await page.evaluate((select) => {
        select.selectedIndex = 0
        select.dispatchEvent(new Event('change', { bubbles: true }))
      }, selectElement)
    }
    await wait(1000)

    const [createButton] = await page.$x("//button[contains(text(), 'Create Pin')]")
    await createButton.click()
    await wait(5000)

    // Click to view pin on Pinterest
    console.log('Step 10: Opening pin on Pinterest...')
    const [viewLink] = await page.$x("//a[contains(text(), 'View Pin on Pinterest')]")
    if (viewLink) {
      const [newPage] = await Promise.all([
        new Promise<any>(resolve => browser.once('targetcreated', async target => {
          const p = await target.page()
          resolve(p)
        })),
        viewLink.click()
      ])

      await newPage.waitForNavigation({ waitUntil: 'networkidle0' })
      await wait(5000)
    }

    console.log('✅ Demo complete!')

  } catch (error) {
    console.error('❌ Error during demo:', error)
  } finally {
    // Stop recording
    await stopQuickTimeRecording()
    await wait(2000)

    await browser.close()
    console.log('🎬 Video recording saved to ~/Desktop')
  }
}

// Run the demo
recordPinterestDemo().catch(console.error)
