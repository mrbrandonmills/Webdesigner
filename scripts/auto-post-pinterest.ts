/**
 * Pinterest Auto-Post Script
 *
 * Posts all 5 Braun IPL pins to Pinterest automatically using Pinterest API v5
 *
 * Setup:
 * 1. Create Pinterest developer account: https://developers.pinterest.com/
 * 2. Create app and get credentials
 * 3. Add credentials to .env.local:
 *    PINTEREST_ACCESS_TOKEN=your_access_token
 *    PINTEREST_BOARD_ID=your_board_id
 */

import fs from 'fs'
import path from 'path'

interface PinData {
  title: string
  description: string
  link: string
  imagePath: string
  boardId: string
}

const PINTEREST_API_BASE = 'https://api.pinterest.com/v5'
const ACCESS_TOKEN = process.env.PINTEREST_ACCESS_TOKEN
const BLOG_POST_URL = 'https://brandonmills.com/blog/braun-ipl-first-week'

// Pinterest Board IDs (you'll get these after creating boards)
const BOARDS = {
  athomeBeauty: process.env.PINTEREST_BOARD_ID_ATHOME_BEAUTY || '',
  productReviews: process.env.PINTEREST_BOARD_ID_REVIEWS || '',
  selfCare: process.env.PINTEREST_BOARD_ID_SELFCARE || '',
  buyingGuides: process.env.PINTEREST_BOARD_ID_GUIDES || '',
}

// All 5 pins ready to post
const pins: PinData[] = [
  {
    title: 'Braun IPL Results After 1 Week (With Photos) | Real Male Model Review',
    description: `Real results from my first week using the Braun Silk Expert Pro 7.

As a model who's been hairless since 16, I documented everything honestly.

✓ Sparse regrowth after 7 days
✓ Pain level: 2/10 (just warm pulses)
✓ Time: 15-20 min per session
✓ Would I continue? Absolutely

Is at-home IPL worth $500? Read my complete day-by-day breakdown with photos.

Full honest review → brandonmills.com/blog/braun-ipl-first-week

#braunipl #athomelaserremoval #laserremovalresults #iplbeforeandafter #malegrooming #skincareformen #athomebeauty #productreview #braun #hairremoval`,
    link: BLOG_POST_URL,
    imagePath: '/blog/braun-ipl/braun-ipl-results-1.jpg',
    boardId: BOARDS.athomeBeauty,
  },
  {
    title: 'The Hairless Rabbit Diaries: My First Week With Braun IPL (Honest Review)',
    description: `What happens when a male model tries at-home laser hair removal?

Here's my unfiltered first week with the Braun Silk Expert Pro 7.

Week 1 discoveries:
→ Regrowth is sparse, patchy, minimal
→ Pain level way less than expected
→ There's something meditative about the process
→ It actually works (not just marketing)

Day-by-day breakdown:
• Day 1: First treatment (nervous but functional)
• Day 3: Slower regrowth already noticeable
• Day 5: Second treatment (more confident)
• Day 7: Visible results

Pain level? Results? Worth it? All answered in my full review.

Read the complete diary → brandonmills.com/blog/braun-ipl-first-week

#productreview #braunipl #skincare #malemodel #selfcare #athomebeauty #honestreviews #laserremoval #beautytech`,
    link: BLOG_POST_URL,
    imagePath: '/blog/braun-ipl/braun-ipl-results-2.jpg',
    boardId: BOARDS.productReviews,
  },
  {
    title: 'Braun IPL vs Salon Laser vs Waxing: Real Cost Comparison 2025',
    description: `I did the math so you don't have to.

BRAUN IPL ($499):
✓ One-time investment
✓ 400,000 flashes (20+ years)
✓ At-home privacy
✓ No appointments
✓ Total savings: $2,500-4,500

SALON LASER ($3,000-5,000):
✗ Multiple sessions required
✗ Travel + scheduling
✗ Expensive per treatment
✗ Still painful

WAXING ($50-80 every 4-6 weeks):
✗ Lifetime cost: $12,000+
✗ Ongoing pain
✗ Constant maintenance
✗ Never permanent

The math favors Braun if you're committed to the process.

But does it actually WORK? I tested it for a week and documented everything.

Full analysis + my personal results after 7 days → brandonmills.com/blog/braun-ipl-first-week

#savemoney #beauty #laserremoval #productcomparison #costanalysis #braun #smartshopping #athomebeauty #budgettips`,
    link: BLOG_POST_URL,
    imagePath: '/blog/braun-ipl/braun-ipl-results-1.jpg',
    boardId: BOARDS.buyingGuides,
  },
  {
    title: '7 Days of Braun IPL: What Actually Happens (Real Timeline)',
    description: `Day-by-day breakdown of my first week using Braun IPL at-home laser removal.

No BS. No sponsored hype. Just real experience.

DAY 1: Started conservative (level 3). Warm pulses. Not painful. 15 minutes.

DAY 3: Hair grows SLOWER. Usually stubble by day 3. This time? Barely anything.

DAY 5: Second treatment. Level 7. More confident. The glide mode is a game-changer.

DAY 7: Arm regrowth is sparse, patchy. Legs are finer. Some areas have almost no hair.

The verdict? It's not instant. But it's WORKING.

What I didn't expect:
• The meditative quality of the process
• How fast you build confidence with intensity
• The joy of self-curation
• That German engineering would actually respect my intelligence

Full breakdown with photos and honest assessment → brandonmills.com/blog/braun-ipl-first-week

#weekbyweek #progresspics #transformation #braun #ipl #laserremoval #realresults #beforeandafter #athomebeauty`,
    link: BLOG_POST_URL,
    imagePath: '/blog/braun-ipl/braun-ipl-results-2.jpg',
    boardId: BOARDS.athomeBeauty,
  },
  {
    title: 'Should YOU Buy the Braun IPL? Honest Assessment (Not Everyone Should)',
    description: `It's not for everyone. Here's who should buy it and who should skip it.

BUY THE BRAUN IPL IF YOU:
✓ Have light to medium skin tone with dark hair
✓ Are tired of daily shaving or monthly waxing
✓ Want a permanent solution (not just temporary)
✓ Value privacy (at-home beats salon appointments)
✓ Don't mind investing 4-12 weeks for results
✓ Want to save $2,500-4,500 vs salon laser

SKIP IT IF YOU:
✗ Have very dark skin tone (IPL targets melanin - safety concern)
✗ Have blonde, red, or gray hair (won't be effective)
✗ Need instant gratification (this takes weeks)
✗ Don't mind shaving/waxing regularly
✗ Aren't willing to commit to the protocol

I'm a model who's been hairless since sixteen. I've tried EVERYTHING.

After one week with Braun IPL:
• Sparse regrowth ✓
• Minimal pain (2/10) ✓
• Actually working ✓
• Would I buy again? Yes ✓

But it's not magic. It's science + commitment.

Read my full honest review with photos (including who should avoid this) → brandonmills.com/blog/braun-ipl-first-week

#buyingguide #beautytips #recommended #productreview #honestreviews #braun #ipl #smartshopping #knowbeforeyoubuy`,
    link: BLOG_POST_URL,
    imagePath: '/blog/braun-ipl/braun-ipl-results-1.jpg',
    boardId: BOARDS.buyingGuides,
  },
]

async function uploadImageToPinterest(imagePath: string): Promise<string> {
  const fullPath = path.join(process.cwd(), 'public', imagePath)

  if (!fs.existsSync(fullPath)) {
    throw new Error(`Image not found: ${fullPath}`)
  }

  // Upload image to Pinterest
  const imageBuffer = fs.readFileSync(fullPath)
  const base64Image = imageBuffer.toString('base64')

  const response = await fetch(`${PINTEREST_API_BASE}/media`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      media_type: 'image',
      media: `data:image/jpeg;base64,${base64Image}`,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to upload image: ${error}`)
  }

  const data = await response.json()
  return data.media_id
}

async function createPin(pin: PinData): Promise<void> {
  console.log(`\n📌 Creating pin: ${pin.title}`)

  // Upload image first
  console.log(`   Uploading image: ${pin.imagePath}`)
  const mediaId = await uploadImageToPinterest(pin.imagePath)

  // Create pin
  const response = await fetch(`${PINTEREST_API_BASE}/pins`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      board_id: pin.boardId,
      media_source: {
        source_type: 'image_base64',
        media_id: mediaId,
      },
      title: pin.title,
      description: pin.description,
      link: pin.link,
      alt_text: pin.title,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to create pin: ${error}`)
  }

  const data = await response.json()
  console.log(`   ✅ Pin created successfully! ID: ${data.id}`)
  console.log(`   URL: https://pinterest.com/pin/${data.id}`)
}

async function createPinterestBoards(): Promise<void> {
  console.log('\n📋 Creating Pinterest boards...')

  const boards = [
    { name: 'At-Home Beauty Tools', description: 'Professional beauty tools and devices for at-home use' },
    { name: 'Product Reviews 2025', description: 'Honest, in-depth reviews of quality products' },
    { name: 'Self-Care for Men', description: 'Grooming, wellness, and self-care for modern men' },
    { name: 'Buying Guides', description: 'Smart shopping guides and product comparisons' },
  ]

  for (const board of boards) {
    try {
      const response = await fetch(`${PINTEREST_API_BASE}/boards`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: board.name,
          description: board.description,
          privacy: 'PUBLIC',
        }),
      })

      if (response.ok) {
        const data = await response.json()
        console.log(`   ✅ Created board: ${board.name} (ID: ${data.id})`)
        console.log(`      Add this to .env.local: PINTEREST_BOARD_ID_${board.name.toUpperCase().replace(/[^A-Z]/g, '_')}=${data.id}`)
      } else {
        const error = await response.text()
        console.log(`   ⚠️  Board "${board.name}" may already exist or error: ${error}`)
      }
    } catch (error) {
      console.log(`   ❌ Error creating board ${board.name}:`, error)
    }
  }
}

async function main() {
  console.log('🚀 Pinterest Auto-Post Script')
  console.log('===============================')

  // Check for access token
  if (!ACCESS_TOKEN) {
    console.error('\n❌ ERROR: PINTEREST_ACCESS_TOKEN not found in environment variables')
    console.log('\nSetup instructions:')
    console.log('1. Go to: https://developers.pinterest.com/')
    console.log('2. Create a new app')
    console.log('3. Get your access token')
    console.log('4. Add to .env.local:')
    console.log('   PINTEREST_ACCESS_TOKEN=your_token_here')
    process.exit(1)
  }

  // Create boards if they don't exist
  if (!BOARDS.athomeBeauty) {
    console.log('\n⚠️  Board IDs not found. Creating boards...')
    await createPinterestBoards()
    console.log('\n📝 Please add the board IDs to your .env.local file and run this script again.')
    process.exit(0)
  }

  // Post all 5 pins
  console.log(`\nPosting ${pins.length} pins to Pinterest...`)

  for (let i = 0; i < pins.length; i++) {
    try {
      await createPin(pins[i])

      // Rate limiting: wait 2 seconds between pins
      if (i < pins.length - 1) {
        console.log('   ⏳ Waiting 2 seconds...')
        await new Promise(resolve => setTimeout(resolve, 2000))
      }
    } catch (error) {
      console.error(`\n❌ Error creating pin ${i + 1}:`, error)
      console.log('Continuing with next pin...')
    }
  }

  console.log('\n✅ Pinterest posting complete!')
  console.log('\n📊 Summary:')
  console.log(`   Total pins posted: ${pins.length}`)
  console.log(`   Blog URL: ${BLOG_POST_URL}`)
  console.log('\n🎯 Next: Check your Pinterest profile to see the pins!')
}

main().catch((error) => {
  console.error('\n❌ Fatal error:', error)
  process.exit(1)
})
