/**
 * Reddit Auto-Post Script
 *
 * Posts content to Reddit using REAL Reddit API
 *
 * Setup:
 * 1. Go to: https://www.reddit.com/prefs/apps
 * 2. Click "create another app..."
 * 3. Select "script"
 * 4. Name: "Brandon Mills Blog Auto-Poster"
 * 5. Redirect URI: http://localhost:8080
 * 6. Click "create app"
 * 7. Note the client ID (under app name) and secret
 * 8. Add to .env.local:
 *    REDDIT_CLIENT_ID=your_client_id
 *    REDDIT_CLIENT_SECRET=your_client_secret
 *    REDDIT_USERNAME=your_username
 *    REDDIT_PASSWORD=your_password
 *
 * API Docs: https://www.reddit.com/dev/api
 */

const CLIENT_ID = process.env.REDDIT_CLIENT_ID
const CLIENT_SECRET = process.env.REDDIT_CLIENT_SECRET
const USERNAME = process.env.REDDIT_USERNAME
const PASSWORD = process.env.REDDIT_PASSWORD

interface RedditPost {
  subreddit: string
  title: string
  text: string
  flairText?: string
}

// Content appropriate for each subreddit
const posts: RedditPost[] = [
  {
    subreddit: 'malegrooming',
    title: 'Week 1 with Braun IPL: Honest review from a male model who\'s tried everything',
    text: `I've been hairless since sixteen. Not genetics—choice.

When the Braun Silk Expert Pro 7 arrived, I committed to documenting honestly. Here's my first week.

**Why I Tried It:**
- Tired of daily shaving
- Salon laser costs $3k-5k
- Braun IPL: $500, 400k flashes, 20+ year lifespan

**Week 1 Results:**

Day 1: Started level 3, ended on 5. Warm pulses, not painful. 15 min for both arms.

Day 3: Hair growing back SLOWER than usual. Patchy regrowth.

Day 7: Sparse regrowth on arms. Legs almost invisible in treated areas.

**Honest Verdict:**

PROS:
✓ Actually works (visible results Week 1)
✓ Minimal pain (2/10)
✓ Cost-effective vs salon
✓ Privacy

CONS:
✗ Not instant (4-12 weeks full results)
✗ Doesn't work on dark skin or light hair
✗ Requires commitment

**Who Should Buy:**
✓ Light to medium skin + dark hair
✓ Tired of shaving/waxing
✓ Want permanent solution

**Who Should Skip:**
✗ Very dark skin (safety concern)
✗ Blonde/red/gray hair (physics—won't work)
✗ Need instant results

The Math:
- Braun IPL: $500 (one-time)
- Salon laser: $3k-5k
- Lifetime waxing: $12k+

Full breakdown with photos: https://brandonmills.com/blog/braun-ipl-first-week

Worth the $500? For me, yes.

Happy to answer questions.`,
  },
  {
    subreddit: 'SkincareAddiction',
    title: '[Review] Braun IPL Silk Expert Pro 7 - Week 1 results (with honest pros/cons)',
    text: `**Product:** Braun Silk Expert Pro 7 IPL
**Skin Type:** Light-medium, not sensitive
**Hair:** Dark brown/black
**Goal:** Permanent hair reduction (arms, legs, chest)

**Background:**
I'm a model, been managing body hair since sixteen. Tried salon laser ($3k), waxing ($80/month), daily shaving. Testing at-home IPL.

**Week 1 Experience:**

*Day 1:* Started conservative (level 3). Warm pulse sensation, not painful. Worked up to level 5. 15 minutes both arms.

*Day 3:* Noticeable slower regrowth. Usually stubble by day 3. This time: barely anything.

*Day 7:* Sparse, patchy regrowth. High-intensity areas almost bare.

**Skincare Observations:**
- No irritation or redness (SensoAdapt tech auto-adjusts)
- Skin feels normal post-treatment
- Important: SUNSCREEN after treatment (more sensitive)

**Technical Specs:**
- 400,000 flashes (20+ year lifespan)
- 10 intensity levels
- SensoAdapt auto-adjustment
- Glide mode for large areas

**Honest Assessment:**

What Works:
✓ Actually reduces hair (Week 1 visible)
✓ Safe for skin (no burns, reactions)
✓ Minimal discomfort

What Doesn't:
✗ Not instant (need patience)
✗ Doesn't work on dark skin (melanin issue)
✗ Doesn't work on light hair (no melanin to target)

**Is it worth $500?**
If you match criteria (light/medium skin + dark hair), yes.

If you don't, save your money—physics says it won't work.

Full day-by-day: https://brandonmills.com/blog/braun-ipl-first-week

AMA about the experience.`,
  },
]

let accessToken: string | null = null

async function getAccessToken(): Promise<string> {
  const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')

  const response = await fetch('https://www.reddit.com/api/v1/access_token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'BrandonMillsBlog/1.0',
    },
    body: `grant_type=password&username=${USERNAME}&password=${PASSWORD}`,
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to get access token: ${error}`)
  }

  const data = await response.json()
  return data.access_token
}

async function submitPost(post: RedditPost): Promise<void> {
  if (!accessToken) {
    accessToken = await getAccessToken()
  }

  console.log(`\n📝 Posting to r/${post.subreddit}...`)
  console.log(`   Title: "${post.title.substring(0, 60)}..."`)

  const response = await fetch('https://oauth.reddit.com/api/submit', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'BrandonMillsBlog/1.0',
    },
    body: new URLSearchParams({
      sr: post.subreddit,
      kind: 'self',
      title: post.title,
      text: post.text,
      api_type: 'json',
    }).toString(),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to submit post: ${error}`)
  }

  const data = await response.json()

  if (data.json.errors && data.json.errors.length > 0) {
    throw new Error(`Reddit API error: ${JSON.stringify(data.json.errors)}`)
  }

  const postUrl = data.json.data.url
  console.log(`   ✅ Posted successfully!`)
  console.log(`   URL: ${postUrl}\n`)
}

async function main() {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║      🔥 REDDIT AUTO-POST - BRAUN IPL REVIEW 🔥           ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
`)

  // Check credentials
  if (!CLIENT_ID || !CLIENT_SECRET || !USERNAME || !PASSWORD) {
    console.error('\n❌ ERROR: Reddit credentials not found')
    console.log('\nSetup instructions:')
    console.log('1. Go to: https://www.reddit.com/prefs/apps')
    console.log('2. Click "create another app..."')
    console.log('3. Select "script"')
    console.log('4. Name: "Brandon Mills Blog Auto-Poster"')
    console.log('5. Redirect URI: http://localhost:8080')
    console.log('6. Click "create app"')
    console.log('7. Add to .env.local:')
    console.log('   REDDIT_CLIENT_ID=your_client_id')
    console.log('   REDDIT_CLIENT_SECRET=your_client_secret')
    console.log('   REDDIT_USERNAME=your_username')
    console.log('   REDDIT_PASSWORD=your_password')
    process.exit(1)
  }

  console.log(`\n🔑 Getting Reddit access token...`)
  accessToken = await getAccessToken()
  console.log(`   ✅ Access token obtained\n`)

  console.log(`📊 Posts to submit: ${posts.length}`)
  console.log(`   Subreddits: ${posts.map(p => `r/${p.subreddit}`).join(', ')}\n`)

  // Submit each post
  for (let i = 0; i < posts.length; i++) {
    try {
      await submitPost(posts[i])

      // Wait between posts to avoid rate limiting
      if (i < posts.length - 1) {
        console.log('   ⏳ Waiting 60 seconds before next post...\n')
        await new Promise(resolve => setTimeout(resolve, 60000))
      }
    } catch (error: any) {
      console.error(`   ❌ Error: ${error.message}\n`)
      console.log('   ⚠️  Continuing with remaining posts...\n')
    }
  }

  console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║                  ✅ POSTING COMPLETE! ✅                  ║
║                                                            ║
║  Expected engagement: 50-200 upvotes per post             ║
║  Expected traffic: 200-500 blog clicks                    ║
║  Expected revenue: $50-150 from Reddit traffic            ║
║                                                            ║
║  IMPORTANT: Reply to comments within 1 hour!              ║
║  Reddit rewards engagement.                               ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
`)
}

main().catch((error) => {
  console.error('\n❌ Fatal error:', error)
  process.exit(1)
})
