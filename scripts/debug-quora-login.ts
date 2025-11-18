/**
 * Debug Quora Login Flow
 *
 * This script opens Quora login page in visible browser and logs all selectors
 * so we can see what's actually on the page and fix the automation.
 */

import puppeteer from 'puppeteer'

async function debugQuoraLogin() {
  console.log('🔍 Debugging Quora Login Flow...\n')

  const browser = await puppeteer.launch({
    headless: false, // Show browser so we can see what's happening
    defaultViewport: { width: 1280, height: 720 },
    slowMo: 100, // Slow down so we can see each step
  })

  const page = await browser.newPage()

  try {
    console.log('📱 Navigating to Quora login page...')
    await page.goto('https://www.quora.com/', { waitUntil: 'networkidle2' })

    console.log('⏳ Waiting 2 seconds for page to fully load...\n')
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Take screenshot of initial page
    await page.screenshot({ path: '/tmp/quora-initial.png' })
    console.log('📸 Screenshot saved: /tmp/quora-initial.png\n')

    // Log all buttons on the page
    console.log('🔘 All buttons on page:')
    const buttons = await page.$$('button')
    for (let i = 0; i < Math.min(buttons.length, 10); i++) {
      const button = buttons[i]
      const text = await page.evaluate(el => el.textContent, button)
      const type = await page.evaluate(el => el.type, button)
      const className = await page.evaluate(el => el.className, button)
      console.log(`  ${i + 1}. Text: "${text?.trim()}" | Type: "${type}" | Class: "${className}"`)
    }

    console.log('\n📝 All input fields:')
    const inputs = await page.$$('input')
    for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i]
      const type = await page.evaluate(el => el.type, input)
      const name = await page.evaluate(el => el.name, input)
      const placeholder = await page.evaluate(el => el.placeholder, input)
      console.log(`  ${i + 1}. Type: "${type}" | Name: "${name}" | Placeholder: "${placeholder}"`)
    }

    console.log('\n🔗 All links with "login" or "sign" in text:')
    const links = await page.$$('a')
    for (const link of links) {
      const text = await page.evaluate(el => el.textContent, link)
      const href = await page.evaluate(el => el.href, link)
      if (text && (text.toLowerCase().includes('login') || text.toLowerCase().includes('sign'))) {
        console.log(`  Link: "${text.trim()}" → ${href}`)
      }
    }

    console.log('\n✅ Browser left open for manual inspection.')
    console.log('Press Ctrl+C when done.\n')

    // Keep browser open for inspection
    await new Promise(() => {}) // Never resolves

  } catch (error) {
    console.error('❌ Error:', error)
  }
}

debugQuoraLogin().catch(console.error)
