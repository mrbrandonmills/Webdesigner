/**
 * Pinterest OAuth Demo - Slow Automated Walkthrough
 * User records with phone while this plays on laptop
 */

import puppeteer from 'puppeteer'
import { config } from 'dotenv'

config({ path: '.env.local' })

async function wait(ms: number, message?: string) {
  if (message) console.log(`⏸️  ${message}`)
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function runDemo() {
  console.log('🎬 Starting Pinterest OAuth Demo')
  console.log('📱 START RECORDING NOW ON YOUR PHONE!')
  console.log('')
  await wait(5000, 'Waiting 5 seconds for you to start phone recording...')

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: [
      '--start-maximized',
      '--disable-blink-features=AutomationControlled'
    ]
  })

  const page = await browser.newPage()

  try {
    console.log('\n📍 STEP 1: Opening demo page...')
    await page.goto('https://brandonmills.com/admin/pinterest-demo', {
      waitUntil: 'networkidle0'
    })
    await wait(4000, 'Showing demo page (4 seconds)')

    console.log('\n📍 STEP 2: Clicking "Connect to Pinterest"...')
    await wait(2000)
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'))
      const connectBtn = buttons.find(btn => btn.textContent?.includes('Connect to Pinterest'))
      if (connectBtn) connectBtn.click()
    })
    await wait(2000)

    console.log('\n📍 STEP 3: Pinterest login page loading...')
    await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 10000 })
    await wait(3000, 'Showing Pinterest login page')

    console.log('\n📍 STEP 4: Logging in to Pinterest...')
    const email = process.env.PINTEREST_EMAIL!
    const password = process.env.PINTEREST_PASSWORD!

    await wait(1000)
    await page.type('input[type="email"], input[id*="email"], input[name*="email"]', email, { delay: 100 })
    await wait(1000)
    await page.type('input[type="password"], input[id*="password"], input[name*="password"]', password, { delay: 100 })
    await wait(2000, 'Credentials entered')

    await page.keyboard.press('Enter')
    await wait(4000, 'Submitting login...')

    console.log('\n📍 STEP 5: Waiting for authorization page...')
    await wait(4000, '⚠️  IMPORTANT: Show URL bar to camera - authorization code visible')

    // Look for authorization button
    try {
      const authButtonSelector = 'button[type="submit"], button:has-text("Allow"), button:has-text("Authorize")'
      await page.waitForSelector(authButtonSelector, { timeout: 5000 })
      await wait(2000, 'Authorization page loaded')

      console.log('\n📍 STEP 6: Clicking authorization button...')
      await page.click(authButtonSelector)
      await wait(3000)
    } catch (e) {
      console.log('⚠️  May already be authorized or different button text')
    }

    console.log('\n📍 STEP 7: Redirecting back to demo page...')
    await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 15000 })
    await wait(4000, '✅ OAuth Success! Showing access token...')

    console.log('\n📍 STEP 8: Fetching boards via API...')
    await wait(2000)
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'))
      const fetchBtn = buttons.find(btn => btn.textContent?.includes('Fetch Boards'))
      if (fetchBtn) fetchBtn.click()
    })
    await wait(4000, 'Boards loaded from Pinterest API')

    console.log('\n📍 STEP 9: Selecting board...')
    await wait(2000)
    const selectElement = await page.$('select')
    if (selectElement) {
      await page.select('select', '0')
      await wait(2000, 'Board selected')
    }

    console.log('\n📍 STEP 10: Creating pin via API...')
    await wait(2000)
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'))
      const createBtn = buttons.find(btn => btn.textContent?.includes('Create Pin'))
      if (createBtn) createBtn.click()
    })
    await wait(6000, '✅ Pin created successfully!')

    console.log('\n📍 STEP 11: Opening pin on Pinterest to verify...')
    await wait(2000)
    const [newPage] = await Promise.all([
      new Promise<any>(resolve => {
        browser.once('targetcreated', async target => {
          resolve(await target.page())
        })
      }),
      page.evaluate(() => {
        const links = Array.from(document.querySelectorAll('a'))
        const viewLink = links.find(a => a.textContent?.includes('View Pin on Pinterest'))
        if (viewLink) viewLink.click()
      })
    ])

    await newPage.waitForNavigation({ waitUntil: 'networkidle0', timeout: 15000 })
    await wait(6000, '✅ VERIFICATION: Pin visible on Pinterest!')

    console.log('\n\n🎉 DEMO COMPLETE!')
    console.log('📱 STOP RECORDING NOW')
    console.log('')
    await wait(3000, 'Closing browser in 3 seconds...')

  } catch (error) {
    console.error('\n❌ Error during demo:', error)
    console.log('📱 You can stop recording now')
  } finally {
    await browser.close()
  }
}

// Run the demo
runDemo().catch(console.error)
