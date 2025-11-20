/**
 * Create Hacker News Account
 *
 * Automatically creates an HN account for automation purposes.
 */

import puppeteer from 'puppeteer'

async function createHNAccount(): Promise<void> {
  const username = 'brandonmillsai'
  const password = 'Dm$2024!Secure'

  console.log('🚀 Creating Hacker News account...')
  console.log(`   Username: ${username}`)

  const browser = await puppeteer.launch({
    headless: false, // Show browser for CAPTCHA if needed
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })

  try {
    const page = await browser.newPage()
    await page.setViewport({ width: 1280, height: 800 })

    // Go to signup page
    await page.goto('https://news.ycombinator.com/login', { waitUntil: 'networkidle2' })

    // Find the create account link and click it
    const createLink = await page.$('a[href="login?creating=t"]')
    if (createLink) {
      await createLink.click()
      await new Promise(resolve => setTimeout(resolve, 2000))
    }

    // Fill the create account form
    await page.waitForSelector('input[name="acct"]', { timeout: 10000 })

    // Clear and fill username
    const usernameInput = await page.$('input[name="acct"]')
    if (usernameInput) {
      await usernameInput.click({ clickCount: 3 })
      await usernameInput.type(username, { delay: 50 })
    }

    // Fill password
    const passwordInput = await page.$('input[name="pw"]')
    if (passwordInput) {
      await passwordInput.type(password, { delay: 50 })
    }

    // Click create account button
    await page.click('input[type="submit"]')

    // Wait and check result
    await new Promise(resolve => setTimeout(resolve, 5000))

    const pageContent = await page.content()

    if (pageContent.includes('logout')) {
      console.log('\n✅ Account created successfully!')
      console.log('\nAdd these to your .env.local:')
      console.log(`HN_USERNAME=${username}`)
      console.log(`HN_PASSWORD=${password}`)
    } else if (pageContent.includes('exists')) {
      console.log('\n⚠️  Username already exists')
      console.log('Try logging in with these credentials or use a different username')
    } else {
      console.log('\n⚠️  Could not verify account creation')
      console.log('Check the browser window for any CAPTCHAs or errors')

      // Keep browser open for manual verification
      console.log('\nBrowser will stay open for 30 seconds...')
      await new Promise(resolve => setTimeout(resolve, 30000))
    }

  } finally {
    await browser.close()
  }
}

// Run
createHNAccount().then(() => {
  process.exit(0)
}).catch(err => {
  console.error('Error:', err)
  process.exit(1)
})
