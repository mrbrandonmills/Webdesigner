/**
 * Twitter Auto-Post Script
 *
 * Posts the Braun IPL thread to Twitter automatically using Twitter API v2
 *
 * Setup:
 * 1. Create Twitter developer account: https://developer.twitter.com/
 * 2. Create project and get API keys
 * 3. Upgrade to Basic plan ($100/month) for write access
 * 4. Add credentials to .env.local:
 *    TWITTER_API_KEY=your_api_key
 *    TWITTER_API_SECRET=your_api_secret
 *    TWITTER_ACCESS_TOKEN=your_access_token
 *    TWITTER_ACCESS_SECRET=your_access_secret
 */

interface Tweet {
  text: string
}

const API_KEY = process.env.TWITTER_API_KEY
const API_SECRET = process.env.TWITTER_API_SECRET
const ACCESS_TOKEN = process.env.TWITTER_ACCESS_TOKEN
const ACCESS_SECRET = process.env.TWITTER_ACCESS_SECRET

// The complete 8-tweet thread
const thread: Tweet[] = [
  {
    text: `I've been hairless since sixteen.

Not genetics—choice.

When the Braun IPL arrived, I committed to documenting honestly.

Here's my first week with at-home laser hair removal:

🧵 (7-part thread)`,
  },
  {
    text: `1/ Why I tried it:

• Tired of daily shaving
• Salon laser costs $3k-5k
• Want permanent solution
• Braun IPL: $500, 400k flashes, 20+ year lifespan

Math checks out. But does it work?`,
  },
  {
    text: `2/ First Impressions:

The device feels premium. Weighted. German engineering.

SensoAdapt tech = auto-adjusts to skin tone
10 intensity levels
Glide mode for large areas

Not a toy. This is serious hardware.`,
  },
  {
    text: `3/ Day 1 Treatment:

Started conservative—level 3 on arm.

Sensation? Warm pulse. Tiny rubber band snap + heat.

Not painful. Not pleasant. Just functional.

15 minutes for both arms. Ended on level 5.`,
  },
  {
    text: `4/ Day 3:

Hair grows slower.

Usually by day 3: stubble.
This time: barely anything.

Regrowth pattern already patchy. Some areas completely bare.

This is working.`,
  },
  {
    text: `5/ Day 7 Results:

Arm (first treated area): smooth, sparse regrowth
Legs: finer hair, almost invisible in high-intensity areas

It's not instant. But it's WORKING.

Exactly as advertised.`,
  },
  {
    text: `6/ The Surprise:

There's something meditative about IPL.

Deliberate. Methodical. Each pulse is a choice.

Self-curation. The same satisfaction as choosing the right book, the right espresso.

You're crafting your form, intentionally.`,
  },
  {
    text: `7/ Honest Verdict:

✓ Works as advertised
✓ Minimal discomfort
✓ Cost-effective vs salon
✗ Not instant results
✗ Doesn't work on dark skin or light hair

Full day-by-day breakdown + photos:
brandonmills.com/blog/braun-ipl…

Worth the $500? For me, absolutely.`,
  },
]

async function postThread(): Promise<void> {
  console.log('🚀 Twitter Auto-Post Script')
  console.log('============================')

  // Check for credentials
  if (!API_KEY || !API_SECRET || !ACCESS_TOKEN || !ACCESS_SECRET) {
    console.error('\n❌ ERROR: Twitter API credentials not found')
    console.log('\nSetup instructions:')
    console.log('1. Go to: https://developer.twitter.com/')
    console.log('2. Create app and get credentials')
    console.log('3. Upgrade to Basic plan ($100/month) for posting')
    console.log('4. Add to .env.local:')
    console.log('   TWITTER_API_KEY=your_api_key')
    console.log('   TWITTER_API_SECRET=your_api_secret')
    console.log('   TWITTER_ACCESS_TOKEN=your_access_token')
    console.log('   TWITTER_ACCESS_SECRET=your_access_secret')
    process.exit(1)
  }

  console.log(`\nPosting thread with ${thread.length} tweets...\n`)

  let previousTweetId: string | null = null

  for (let i = 0; i < thread.length; i++) {
    const tweet = thread[i]

    console.log(`📝 Posting tweet ${i + 1}/${thread.length}:`)
    console.log(`   "${tweet.text.substring(0, 50)}..."`)

    try {
      const tweetData: any = {
        text: tweet.text,
      }

      // If this is a reply to previous tweet (thread)
      if (previousTweetId) {
        tweetData.reply = {
          in_reply_to_tweet_id: previousTweetId,
        }
      }

      // Post tweet using Twitter API v2
      const response = await fetch('https://api.twitter.com/2/tweets', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tweetData),
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(`Failed to post tweet: ${error}`)
      }

      const data = await response.json()
      previousTweetId = data.data.id

      console.log(`   ✅ Posted! Tweet ID: ${data.data.id}`)
      console.log(`   URL: https://twitter.com/user/status/${data.data.id}\n`)

      // Rate limiting: wait 3 seconds between tweets
      if (i < thread.length - 1) {
        console.log('   ⏳ Waiting 3 seconds before next tweet...\n')
        await new Promise((resolve) => setTimeout(resolve, 3000))
      }
    } catch (error) {
      console.error(`\n❌ Error posting tweet ${i + 1}:`, error)
      console.log('Thread posting stopped.')
      process.exit(1)
    }
  }

  console.log('\n✅ Thread posted successfully!')
  console.log(`\n📊 Summary:`)
  console.log(`   Total tweets posted: ${thread.length}`)
  console.log(`   Thread URL: https://twitter.com/user/status/${previousTweetId}`)
  console.log('\n🎯 Next: Reply to comments and engage with followers!')
}

postThread().catch((error) => {
  console.error('\n❌ Fatal error:', error)
  process.exit(1)
})
