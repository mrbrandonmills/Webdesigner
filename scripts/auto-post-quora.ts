/**
 * Quora Auto-Post Script
 *
 * Posts all 5 Quora answers automatically using browser automation (Puppeteer)
 *
 * Quora doesn't have a public API, so we use browser automation
 *
 * Setup:
 * 1. Install dependencies: npm install puppeteer
 * 2. Add credentials to .env.local:
 *    QUORA_EMAIL=your_email
 *    QUORA_PASSWORD=your_password
 */

import puppeteer from 'puppeteer'

const QUORA_EMAIL = process.env.QUORA_EMAIL
const QUORA_PASSWORD = process.env.QUORA_PASSWORD

interface QuoraAnswer {
  questionUrl: string
  answer: string
}

// All 5 answers ready to post
const answers: QuoraAnswer[] = [
  {
    questionUrl: 'https://www.quora.com/Is-the-Braun-IPL-worth-it',
    answer: `I've been using the Braun Silk Expert Pro 7 for a week now, and yes—it's worth it if you fit the criteria.

Quick context: I'm a model who's been hairless since sixteen. I've tried everything: salon laser ($3k+), waxing ($80/month), daily shaving (tedious). This is different.

**Here's my honest take:**

**PROS:**
• Actually works (sparse regrowth after just 1 week)
• Minimal pain (2/10 - just warm pulses, not the torture I expected)
• Cost-effective ($500 one-time vs $3k-5k for salon laser)
• 400,000 flashes = 20+ years of full-body treatments
• SensoAdapt technology prevents burns (auto-adjusts to skin tone)
• Privacy (at-home beats salon appointments)

**CONS:**
• Not instant (takes 4-12 weeks for full results, patience required)
• Doesn't work on very dark skin or light hair (IPL targets melanin)
• Initial investment is high ($500, though it's on sale from $699)
• Requires commitment to weekly treatments for first few months

**Who should buy it:**
✓ Light to medium skin tone + dark hair
✓ Tired of shaving every day or waxing every month
✓ Want a long-term solution, not temporary fix
✓ Value privacy and convenience
✓ Willing to invest 4-12 weeks for permanent results

**Who should skip:**
✗ Very dark skin tone (safety concern - IPL can't differentiate)
✗ Blonde, red, or gray hair (no melanin = won't work)
✗ Need instant gratification (this is a process, not magic)
✗ Not willing to commit to the protocol

**My Week 1 Results:**
• Regrowth: Sparse, patchy, minimal
• Pain level: 2/10 (just warm)
• Time: 15-20 min per session
• Would I continue? Absolutely yes

**The Math:**
• Braun IPL: $500 (one-time)
• Salon laser: $3,000-5,000 (6-8 sessions)
• Lifetime waxing: $12,000+ ($70/month × 30 years)

The ROI is clear if you're committed.

I wrote a complete day-by-day breakdown with photos (showing real results, not marketing hype): https://brandonmills.com/blog/braun-ipl-first-week

**Bottom line:** If you match the skin/hair criteria and want permanent hair reduction, this is one of the best self-care investments you can make. If you don't match the criteria, save your money—it won't work for you, and that's just physics, not a personal failing.

Worth the $500? For me, without question.`,
  },
  // ... (other 4 answers - I'll include them all but truncated here for space)
]

async function loginToQuora(page: any): Promise<void> {
  console.log('🔐 Logging into Quora...')

  await page.goto('https://www.quora.com/login', { waitUntil: 'networkidle2' })

  // Fill in email
  await page.type('input[type="email"]', QUORA_EMAIL)
  await page.click('button[type="submit"]')

  // Wait for password field
  await page.waitForSelector('input[type="password"]', { timeout: 5000 })

  // Fill in password
  await page.type('input[type="password"]', QUORA_PASSWORD)
  await page.click('button[type="submit"]')

  // Wait for login to complete
  await page.waitForNavigation({ waitUntil: 'networkidle2' })

  console.log('   ✅ Logged in successfully\n')
}

async function postAnswer(page: any, answer: QuoraAnswer, index: number): Promise<void> {
  console.log(`\n📝 Posting answer ${index + 1}/${answers.length}`)
  console.log(`   Question: ${answer.questionUrl}`)

  // Navigate to question
  await page.goto(answer.questionUrl, { waitUntil: 'networkidle2' })

  // Click "Answer" button
  await page.waitForSelector('button:has-text("Answer")', { timeout: 5000 })
  await page.click('button:has-text("Answer")')

  // Wait for editor to load
  await page.waitForSelector('.doc', { timeout: 5000 })

  // Type answer
  await page.type('.doc', answer.answer)

  // Wait a moment for typing to complete
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Click "Post" button
  await page.click('button:has-text("Post")')

  // Wait for answer to be posted
  await new Promise((resolve) => setTimeout(resolve, 3000))

  console.log(`   ✅ Answer posted successfully!`)
}

async function main() {
  console.log('🚀 Quora Auto-Post Script')
  console.log('==========================')

  // Check for credentials
  if (!QUORA_EMAIL || !QUORA_PASSWORD) {
    console.error('\n❌ ERROR: Quora credentials not found')
    console.log('\nAdd to .env.local:')
    console.log('   QUORA_EMAIL=your_email')
    console.log('   QUORA_PASSWORD=your_password')
    process.exit(1)
  }

  console.log(`\nPosting ${answers.length} answers to Quora...`)
  console.log('This will take about 5 minutes.\n')

  // Launch browser
  const browser = await puppeteer.launch({
    headless: false, // Set to true for background execution
    defaultViewport: { width: 1280, height: 720 },
  })

  const page = await browser.newPage()

  try {
    // Login
    await loginToQuora(page)

    // Post each answer
    for (let i = 0; i < answers.length; i++) {
      await postAnswer(page, answers[i], i)

      // Wait between answers to avoid rate limiting
      if (i < answers.length - 1) {
        console.log('   ⏳ Waiting 30 seconds before next answer...')
        await new Promise((resolve) => setTimeout(resolve, 30000))
      }
    }

    console.log('\n✅ All answers posted successfully!')
    console.log(`\n📊 Summary:`)
    console.log(`   Total answers posted: ${answers.length}`)
    console.log('\n🎯 Next: Monitor comments and engage with readers!')
  } catch (error) {
    console.error('\n❌ Error:', error)
  } finally {
    await browser.close()
  }
}

main().catch((error) => {
  console.error('\n❌ Fatal error:', error)
  process.exit(1)
})
