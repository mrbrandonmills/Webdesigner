/**
 * Medium Auto-Post Script
 *
 * Posts blog content to Medium using REAL Medium API
 *
 * Setup:
 * 1. Go to: https://medium.com/me/settings/security
 * 2. Scroll to "Integration tokens"
 * 3. Click "Get integration token"
 * 4. Add to .env.local: MEDIUM_ACCESS_TOKEN=your_token
 *
 * API Docs: https://github.com/Medium/medium-api-docs
 */

const MEDIUM_API_BASE = 'https://api.medium.com/v1'
const ACCESS_TOKEN = process.env.MEDIUM_ACCESS_TOKEN

interface MediumPost {
  title: string
  content: string // Markdown or HTML
  contentFormat: 'markdown' | 'html'
  tags: string[]
  canonicalUrl?: string
  publishStatus: 'public' | 'draft' | 'unlisted'
}

// Blog post to publish on Medium
const braunIPLPost: MediumPost = {
  title: 'The Hairless Rabbit Diaries: My First Week With the Braun IPL Skin i-Expert',
  contentFormat: 'markdown',
  tags: ['Product Review', 'Grooming', 'IPL', 'Hair Removal', 'Self Care'],
  canonicalUrl: 'https://brandonmills.com/blog/braun-ipl-first-week', // Tells Google this is the original
  publishStatus: 'public',
  content: `
I've been hairless since sixteen.

Not genetics—choice. When the Braun IPL arrived, I committed to documenting honestly.

Here's my first week with at-home laser hair removal.

## Why I Tried It

• Tired of daily shaving
• Salon laser costs $3k-5k
• Want permanent solution
• Braun IPL: $500, 400k flashes, 20+ year lifespan

Math checks out. But does it work?

## Week 1 Results

**Day 1 (Friday):**
Started conservative—level 3 on arm. Sensation? Warm pulse. Tiny rubber band snap + heat. Not painful. Not pleasant. Just functional. 15 minutes for both arms. Ended on level 5.

**Day 3 (Sunday):**
Hair grows SLOWER. Usually by day 3: stubble. This time: barely anything. Regrowth pattern already patchy. Some areas completely bare.

**Day 7 (Thursday):**
• Arm (first treated area): smooth, sparse regrowth
• Legs: finer hair, almost invisible in high-intensity areas
• It's not instant. But it's WORKING.

Exactly as advertised.

## The Surprise

There's something meditative about IPL. Deliberate. Methodical. Each pulse is a choice. Self-curation. The same satisfaction as choosing the right book, the right espresso. You're crafting your form, intentionally.

## Honest Verdict

**PROS:**
✓ Works as advertised (sparse regrowth after 1 week)
✓ Minimal pain (2/10 - just warm)
✓ Cost-effective ($500 vs $3k-5k salon)
✓ Privacy + convenience

**CONS:**
✗ Not instant (takes 4-12 weeks)
✗ Doesn't work on dark skin or light hair
✗ Requires commitment

## Who Should Buy

**YES if:**
✓ Light to medium skin + dark hair
✓ Tired of shaving/waxing
✓ Want permanent solution
✓ Value privacy

**NO if:**
✗ Very dark skin (safety concern)
✗ Blonde/red/gray hair (won't work)
✗ Need instant results

## The Math

• Braun IPL: $500 (one-time)
• Salon laser: $3,000-5,000
• Lifetime waxing: $12,000+ ($70/month × 30 years)

Worth the $500? For me, without question.

---

**Read the complete day-by-day breakdown with photos:**
https://brandonmills.com/blog/braun-ipl-first-week
`,
}

async function getMediumUserId(): Promise<string> {
  const response = await fetch(`${MEDIUM_API_BASE}/me`, {
    headers: {
      'Authorization': `Bearer ${ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to get user ID: ${error}`)
  }

  const data = await response.json()
  return data.data.id
}

async function publishToMedium(post: MediumPost): Promise<void> {
  console.log('📝 Getting Medium user ID...')
  const userId = await getMediumUserId()
  console.log(`   ✅ User ID: ${userId}\n`)

  console.log(`📤 Publishing post to Medium...`)
  console.log(`   Title: "${post.title}"`)
  console.log(`   Tags: ${post.tags.join(', ')}`)
  console.log(`   Status: ${post.publishStatus}`)
  console.log(`   Canonical URL: ${post.canonicalUrl}\n`)

  const response = await fetch(`${MEDIUM_API_BASE}/users/${userId}/posts`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      title: post.title,
      contentFormat: post.contentFormat,
      content: post.content,
      tags: post.tags,
      canonicalUrl: post.canonicalUrl,
      publishStatus: post.publishStatus,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to publish post: ${error}`)
  }

  const data = await response.json()
  const postUrl = data.data.url

  console.log('   ✅ Post published successfully!')
  console.log(`   URL: ${postUrl}\n`)

  return data.data
}

async function main() {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║      📝 MEDIUM AUTO-POST - BRAUN IPL BLOG 📝             ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
`)

  // Check for access token
  if (!ACCESS_TOKEN) {
    console.error('\n❌ ERROR: Medium access token not found')
    console.log('\nSetup instructions:')
    console.log('1. Go to: https://medium.com/me/settings/security')
    console.log('2. Scroll to "Integration tokens"')
    console.log('3. Enter description: "Brandon Mills Blog Auto-Poster"')
    console.log('4. Click "Get integration token"')
    console.log('5. Copy the token')
    console.log('6. Add to .env.local:')
    console.log('   MEDIUM_ACCESS_TOKEN=your_token_here')
    process.exit(1)
  }

  try {
    await publishToMedium(braunIPLPost)

    console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║                  ✅ SUCCESS! ✅                           ║
║                                                            ║
║  Your blog post is now live on Medium!                    ║
║                                                            ║
║  Expected traffic: 500-1,000 views in first week          ║
║  Expected blog clicks: 50-100                              ║
║                                                            ║
║  Canonical URL tells Google the original is on your site  ║
║  = SEO credit goes to brandonmills.com                    ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
`)
  } catch (error: any) {
    console.error('\n❌ Error:', error.message)
    process.exit(1)
  }
}

main().catch((error) => {
  console.error('\n❌ Fatal error:', error)
  process.exit(1)
})
