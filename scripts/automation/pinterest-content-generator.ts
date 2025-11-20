/**
 * Pinterest & Instagram Content Batch Generator
 *
 * Generates 30 days of AI-powered content for:
 * - Pinterest product pins
 * - Pinterest idea pins (value content)
 * - Instagram posts & reels captions
 * - Instagram stories
 *
 * Usage:
 *   npx tsx scripts/automation/pinterest-content-generator.ts
 *   npx tsx scripts/automation/pinterest-content-generator.ts --days=30
 *   npx tsx scripts/automation/pinterest-content-generator.ts --export=csv
 */

import * as fs from 'fs'
import * as path from 'path'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Load environment variables
import { config } from 'dotenv'
config({ path: path.join(process.cwd(), '.env.local') })

// Content types for different platforms
interface PinterestPin {
  type: 'product' | 'idea' | 'blog'
  title: string
  description: string
  hashtags: string[]
  altText: string
  board: string
  link?: string
  scheduledDate: string
}

interface InstagramPost {
  type: 'feed' | 'reel' | 'story' | 'carousel'
  caption: string
  hashtags: string[]
  callToAction: string
  contentIdea: string
  scheduledDate: string
}

interface ContentBatch {
  pinterest: PinterestPin[]
  instagram: InstagramPost[]
  generatedAt: string
  totalPins: number
  totalPosts: number
}

// Brand voice and content themes
const brandContext = {
  brandName: 'Brandon Mills',
  tagline: 'Truth Through Every Medium',
  targetAudience: 'Affluent polymaths 25-50 who value depth over decoration',
  products: [
    'Genesis Canvas Prints ($149-$349)',
    '5-Minute Meditations ($5)',
    'Mentoring Sessions ($150-$250)'
  ],
  themes: [
    'Sacred geometry and mathematical beauty',
    'Jungian psychology and dream interpretation',
    'AI-enhanced creativity',
    'Consciousness exploration',
    'Visual poetry and symbolism'
  ],
  pinterestBoards: [
    'Genesis Collection - Sacred Art',
    'Dream Decoder Insights',
    'Meditation & Mindfulness',
    'AI Art Process',
    'Consciousness & Jung'
  ],
  websiteUrl: 'https://brandonmills.com'
}

// Content templates for consistent quality
const contentTemplates = {
  pinterest: {
    product: {
      titleFormulas: [
        '{product} - Sacred Geometry Art',
        '{product} | Museum-Quality Canvas',
        'Transform Your Space with {product}',
        '{product} - Limited Edition Print'
      ],
      descriptionFormulas: [
        'Each piece in the Genesis Collection embodies mathematical precision and spiritual depth. {product} explores {theme}. Premium canvas, archival inks, ready to hang. Free shipping on orders $100+.',
        'More than decoration—this is visual philosophy. {product} captures {theme}. Museum-quality materials, satisfaction guaranteed.',
        '{product} brings {theme} to life through sacred geometry. This isn\'t just art; it\'s a daily reminder of the patterns underlying reality.'
      ]
    },
    idea: {
      titleFormulas: [
        'The Meaning Behind {theme}',
        'Why {theme} Matters',
        'Understanding {theme}',
        '{theme} Explained Simply'
      ]
    },
    blog: {
      titleFormulas: [
        'New: {title}',
        'Deep Dive: {title}',
        'Just Published: {title}'
      ]
    }
  },
  instagram: {
    callToActions: [
      'Link in bio for the full collection 🔗',
      'Tap link in bio to explore 🔗',
      'Full story at brandonmills.com (link in bio)',
      'More on this at the link in bio',
      'Explore the collection → link in bio'
    ]
  }
}

// High-performing Pinterest hashtags
const pinterestHashtags = {
  art: ['#sacredgeometry', '#geometricart', '#consciousart', '#spiritualart', '#modernart', '#abstractart', '#walldecor', '#homedecor', '#artprint', '#canvasart'],
  psychology: ['#jungianpsychology', '#carljung', '#archetypes', '#shadowwork', '#dreams', '#unconscious', '#selfawareness', '#innerwork', '#psychology', '#depth'],
  meditation: ['#meditation', '#mindfulness', '#innerpeace', '#consciousness', '#spirituality', '#wellness', '#mentalhealth', '#calm', '#breathe', '#present'],
  general: ['#artcollector', '#interiordesign', '#homedecor', '#wallart', '#artlovers', '#contemporaryart', '#luxuryhome', '#minimalistdecor']
}

// High-performing Instagram hashtags
const instagramHashtags = {
  art: ['#digitalart', '#aiart', '#sacredgeometry', '#geometricart', '#contemporaryart', '#artoftheday', '#artistsoninstagram', '#artcollector', '#fineart', '#modernart'],
  spirituality: ['#consciousness', '#spiritualart', '#sacredart', '#awakening', '#mindfulness', '#meditation', '#innerpeace', '#soulart', '#spiritualgrowth', '#enlightenment'],
  lifestyle: ['#homedecor', '#interiordesign', '#luxurylifestyle', '#homedesign', '#wallart', '#artprint', '#minimalist', '#intentionalliving', '#consciousliving'],
  engagement: ['#artcommunity', '#supportartists', '#independentartist', '#artforsale', '#originalart', '#limitededition', '#artinvestment']
}

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '')

async function generateContentBatch(days: number = 30): Promise<ContentBatch> {
  console.log(`\n🎨 Generating ${days} days of content...\n`)

  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

  const pinterestPins: PinterestPin[] = []
  const instagramPosts: InstagramPost[] = []

  // Generate Pinterest pins (2-3 per day)
  console.log('📌 Generating Pinterest pins...')

  const pinterestPrompt = `You are a social media content creator for Brandon Mills, a luxury AI art brand.

Brand Context:
- Creates sacred geometry and consciousness-themed art
- Target: Affluent polymaths 25-50 who value depth
- Products: Genesis Canvas Prints ($149-$349), Meditations ($5), Mentoring ($150-$250)
- Voice: Sophisticated but accessible, philosophical but practical

Generate 15 Pinterest pins with this JSON structure:
[
  {
    "type": "product" | "idea" | "blog",
    "title": "max 100 chars, SEO-optimized",
    "description": "max 500 chars, includes value prop and call to action",
    "hashtags": ["5-10 relevant hashtags"],
    "altText": "Descriptive alt text for accessibility",
    "board": "one of: Genesis Collection - Sacred Art, Dream Decoder Insights, Meditation & Mindfulness, AI Art Process, Consciousness & Jung",
    "link": "https://brandonmills.com/relevant-page"
  }
]

Content mix:
- 40% product pins (Genesis Collection canvas prints)
- 30% idea pins (educational content about sacred geometry, Jung, consciousness)
- 30% blog/value pins (dream interpretation, meditation tips, art process)

Each pin should:
- Have a compelling, keyword-rich title
- Include emotional benefits + practical value in description
- Use a mix of niche and broad hashtags
- Drive traffic to relevant pages

Return ONLY valid JSON array, no markdown formatting.`

  try {
    const pinterestResult = await model.generateContent(pinterestPrompt)
    const pinterestText = pinterestResult.response.text()

    // Parse JSON from response - clean up common issues
    let jsonMatch = pinterestText.match(/\[[\s\S]*\]/)
    if (jsonMatch) {
      let jsonStr = jsonMatch[0]
        .replace(/,\s*}/g, '}')  // Remove trailing commas in objects
        .replace(/,\s*\]/g, ']')  // Remove trailing commas in arrays
        .replace(/\n/g, ' ')      // Remove newlines
        // Fix unescaped quotes inside strings
        .replace(/"([^"]*)":\s*"([^"]*)"/g, (match, key, value) => {
          return `"${key}": "${value.replace(/(?<!\\)"/g, '\\"')}"`
        })

      // Try to parse, if fails, try to extract individual objects
      let parsedPins
      try {
        parsedPins = JSON.parse(jsonStr)
      } catch {
        // Fallback: try to parse without the problematic response
        console.log('   ⚠️ JSON parse failed, using template content')
        parsedPins = []
      }

      if (parsedPins.length === 0) {
        // Generate template-based content as fallback
        const templates = [
          { type: 'product', title: 'Genesis Collection - Sacred Geometry Canvas Art', description: 'Transform your space with museum-quality prints that capture mathematical beauty. Premium materials, ready to hang.', hashtags: ['#sacredgeometry', '#canvasart', '#wallart', '#homedecor'], altText: 'Sacred geometry canvas print', board: 'Genesis Collection - Sacred Art', link: 'https://brandonmills.com/shop' },
          { type: 'idea', title: 'Understanding Dream Symbols - A Jungian Approach', description: 'Your dreams speak in symbols. Learn to decode what your unconscious is telling you through Jungian analysis.', hashtags: ['#dreams', '#jung', '#psychology', '#selfawareness'], altText: 'Dream interpretation guide', board: 'Dream Decoder Insights', link: 'https://brandonmills.com/dream-decoder' },
          { type: 'blog', title: 'The Mathematics of Consciousness', description: 'Sacred geometry reveals patterns underlying reality. Explore the connection between mathematics and spiritual awakening.', hashtags: ['#consciousness', '#sacredgeometry', '#spirituality', '#mathematics'], altText: 'Sacred geometry patterns', board: 'Consciousness & Jung', link: 'https://brandonmills.com/blog' }
        ]
        parsedPins = Array(15).fill(null).map((_, i) => templates[i % templates.length])
      }

      const typedPins = parsedPins as any[]

      // Distribute pins across the date range
      const today = new Date()
      parsedPins.forEach((pin: any, index: number) => {
        const dayOffset = Math.floor(index / 3) // 3 pins per day
        const scheduleDate = new Date(today)
        scheduleDate.setDate(scheduleDate.getDate() + dayOffset)

        pinterestPins.push({
          ...pin,
          scheduledDate: scheduleDate.toISOString().split('T')[0]
        })
      })

      console.log(`   ✅ Generated ${pinterestPins.length} Pinterest pins`)
    }
  } catch (error: any) {
    console.error(`   ❌ Pinterest generation failed: ${error.message}`)
  }

  // Generate Instagram posts (1-2 per day)
  console.log('📸 Generating Instagram posts...')

  const instagramPrompt = `You are a social media content creator for Brandon Mills, a luxury AI art brand.

Brand Context:
- Creates sacred geometry and consciousness-themed art
- Target: Affluent polymaths 25-50 who value depth
- Products: Genesis Canvas Prints ($149-$349), Meditations ($5), Mentoring ($150-$250)
- Voice: Sophisticated but warm, philosophical but relatable

Generate 15 Instagram posts with this JSON structure:
[
  {
    "type": "feed" | "reel" | "story" | "carousel",
    "caption": "Engaging caption with line breaks, 150-300 words for feed/carousel, shorter for stories/reels",
    "hashtags": ["20-30 relevant hashtags"],
    "callToAction": "Clear CTA like 'Link in bio' or 'Save this post'",
    "contentIdea": "Brief description of what visual content to create"
  }
]

Content mix:
- 30% product showcases (Genesis Collection)
- 25% educational (sacred geometry, Jung, symbolism)
- 20% behind-the-scenes (AI art process, studio, creative journey)
- 15% community engagement (questions, polls, shares)
- 10% promotional (limited offers, new releases)

Each post should:
- Start with a hook that stops scrolling
- Provide genuine value or emotion
- Include a clear call to action
- Suggest visual content that can be created in Canva

Return ONLY valid JSON array, no markdown formatting.`

  try {
    const instagramResult = await model.generateContent(instagramPrompt)
    const instagramText = instagramResult.response.text()

    let jsonMatch = instagramText.match(/\[[\s\S]*\]/)
    if (jsonMatch) {
      let jsonStr = jsonMatch[0]
        .replace(/,\s*}/g, '}')
        .replace(/,\s*\]/g, ']')
        .replace(/\n/g, ' ')

      let parsedPosts
      try {
        parsedPosts = JSON.parse(jsonStr)
      } catch {
        console.log('   ⚠️ JSON parse failed, using template content')
        parsedPosts = []
      }

      if (parsedPosts.length === 0) {
        const templates = [
          { type: 'feed', caption: 'The patterns underlying reality reveal themselves to those who look. This piece from the Genesis Collection captures the mathematical precision of consciousness.\n\nSacred geometry isn\'t just decoration—it\'s visual philosophy.', hashtags: ['#sacredgeometry', '#consciousart', '#wallart', '#interiordesign', '#digitalart', '#spiritualart', '#artcollector', '#homedecor', '#modernart', '#luxuryhome'], callToAction: 'Link in bio for the full collection', contentIdea: 'Hero shot of Genesis canvas print in elegant room setting' },
          { type: 'reel', caption: 'What your dreams are trying to tell you 🌙\n\nWater = emotions\nFlying = freedom/escape\nFalling = loss of control\nTeeth = anxiety/self-image\n\nBut generic meanings only scratch the surface. True analysis requires context.', hashtags: ['#dreams', '#dreaminterpretation', '#jungianpsychology', '#psychology', '#selfawareness', '#unconscious', '#archetypes', '#shadowwork', '#innerwork', '#consciousness'], callToAction: 'Free dream decoder in bio', contentIdea: 'Quick cuts showing dream symbols with text overlays' },
          { type: 'carousel', caption: 'The mathematics of beauty:\n\nSlide 1: The Golden Ratio\nSlide 2: Fibonacci in nature\nSlide 3: Sacred geometry patterns\nSlide 4: How I use these in art\n\nBeauty isn\'t subjective—it\'s mathematical.', hashtags: ['#goldenratio', '#fibonacci', '#sacredgeometry', '#mathematics', '#artprocess', '#behindthescenes', '#digitalart', '#aiart', '#contemporaryart', '#artistsoninstagram'], callToAction: 'Save this post for reference', contentIdea: '4-slide educational carousel with clear visuals' }
        ]
        parsedPosts = Array(15).fill(null).map((_, i) => templates[i % templates.length])
      }

      const today = new Date()
      parsedPosts.forEach((post: any, index: number) => {
        const dayOffset = Math.floor(index / 2) // 2 posts per day
        const scheduleDate = new Date(today)
        scheduleDate.setDate(scheduleDate.getDate() + dayOffset)

        instagramPosts.push({
          ...post,
          scheduledDate: scheduleDate.toISOString().split('T')[0]
        })
      })

      console.log(`   ✅ Generated ${instagramPosts.length} Instagram posts`)
    }
  } catch (error: any) {
    console.error(`   ❌ Instagram generation failed: ${error.message}`)
  }

  return {
    pinterest: pinterestPins,
    instagram: instagramPosts,
    generatedAt: new Date().toISOString(),
    totalPins: pinterestPins.length,
    totalPosts: instagramPosts.length
  }
}

function exportToCSV(batch: ContentBatch, outputDir: string): void {
  // Export Pinterest pins to CSV
  const pinterestCSV = [
    'Date,Type,Title,Description,Hashtags,Alt Text,Board,Link',
    ...batch.pinterest.map(pin =>
      `"${pin.scheduledDate}","${pin.type}","${pin.title.replace(/"/g, '""')}","${pin.description.replace(/"/g, '""')}","${pin.hashtags.join(' ')}","${pin.altText.replace(/"/g, '""')}","${pin.board}","${pin.link || ''}"`
    )
  ].join('\n')

  fs.writeFileSync(path.join(outputDir, 'pinterest-content.csv'), pinterestCSV)
  console.log(`   📄 Exported Pinterest pins to pinterest-content.csv`)

  // Export Instagram posts to CSV
  const instagramCSV = [
    'Date,Type,Caption,Hashtags,CTA,Content Idea',
    ...batch.instagram.map(post =>
      `"${post.scheduledDate}","${post.type}","${post.caption.replace(/"/g, '""')}","${post.hashtags.join(' ')}","${post.callToAction.replace(/"/g, '""')}","${post.contentIdea.replace(/"/g, '""')}"`
    )
  ].join('\n')

  fs.writeFileSync(path.join(outputDir, 'instagram-content.csv'), instagramCSV)
  console.log(`   📄 Exported Instagram posts to instagram-content.csv`)
}

function exportToTailwindFormat(batch: ContentBatch, outputDir: string): void {
  // Tailwind uses a specific format for bulk upload
  // Format: Title | Description | Link | Board
  const tailwindContent = batch.pinterest.map(pin =>
    `${pin.title} | ${pin.description} ${pin.hashtags.join(' ')} | ${pin.link || brandContext.websiteUrl} | ${pin.board}`
  ).join('\n')

  fs.writeFileSync(path.join(outputDir, 'tailwind-bulk-upload.txt'), tailwindContent)
  console.log(`   📄 Exported Tailwind bulk upload file`)
}

async function main() {
  const args = process.argv.slice(2)

  // Parse arguments
  const daysArg = args.find(a => a.startsWith('--days='))
  const days = daysArg ? parseInt(daysArg.split('=')[1]) : 30

  const exportFormat = args.find(a => a.startsWith('--export='))?.split('=')[1]

  console.log('\n🚀 Pinterest & Instagram Content Generator')
  console.log('==========================================\n')

  if (!process.env.GOOGLE_AI_API_KEY) {
    console.error('❌ GOOGLE_AI_API_KEY not set in environment')
    process.exit(1)
  }

  // Generate content
  const batch = await generateContentBatch(days)

  // Create output directory
  const outputDir = path.join(process.cwd(), 'data', 'content-batches')
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  // Save JSON
  const timestamp = new Date().toISOString().split('T')[0]
  const jsonPath = path.join(outputDir, `content-batch-${timestamp}.json`)
  fs.writeFileSync(jsonPath, JSON.stringify(batch, null, 2))
  console.log(`\n💾 Saved batch to ${jsonPath}`)

  // Export formats
  if (exportFormat === 'csv' || exportFormat === 'all') {
    console.log('\n📊 Exporting CSV files...')
    exportToCSV(batch, outputDir)
  }

  if (exportFormat === 'tailwind' || exportFormat === 'all') {
    console.log('\n📋 Exporting Tailwind format...')
    exportToTailwindFormat(batch, outputDir)
  }

  // Summary
  console.log('\n✅ Content Generation Complete!')
  console.log('================================')
  console.log(`   📌 Pinterest pins: ${batch.totalPins}`)
  console.log(`   📸 Instagram posts: ${batch.totalPosts}`)
  console.log(`   📅 Coverage: ${days} days`)
  console.log(`   💾 Output: ${outputDir}`)

  console.log('\n📋 Next Steps:')
  console.log('   1. Sign up for Tailwind at tailwindapp.com')
  console.log('   2. Connect your Pinterest Business account')
  console.log('   3. Upload the bulk content file')
  console.log('   4. Use SmartSchedule to auto-schedule')
  console.log('   5. Create visuals in Canva Pro')
  console.log('')
}

// Run
main().catch(err => {
  console.error('Error:', err.message)
  process.exit(1)
})
