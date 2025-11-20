/**
 * Pinterest API Auto-Poster (v5)
 *
 * Posts pins to Pinterest using the official API.
 * Loads content from generated pin batches.
 *
 * Usage:
 *   npx tsx scripts/automation/pinterest-api-poster.ts
 *   npx tsx scripts/automation/pinterest-api-poster.ts --count=5
 *   npx tsx scripts/automation/pinterest-api-poster.ts --boards
 */

import * as fs from 'fs'
import * as path from 'path'
import { config } from 'dotenv'

// Load environment variables
config({ path: path.join(process.cwd(), '.env.local') })

interface PinterestPin {
  title: string
  description: string
  link: string
  imageUrl: string
  hashtags?: string[]
  altText?: string
  board?: string
}

// Determine API base URL (sandbox for trial, production for standard)
const USE_SANDBOX = process.env.PINTEREST_USE_SANDBOX !== 'false'
const API_BASE = USE_SANDBOX ? 'https://api-sandbox.pinterest.com' : 'https://api.pinterest.com'

// Get user's boards
async function getBoards(accessToken: string): Promise<Array<{ id: string; name: string }>> {
  console.log('📋 Fetching Pinterest boards...')
  console.log(`   Using ${USE_SANDBOX ? 'SANDBOX' : 'PRODUCTION'} API`)

  const response = await fetch(`${API_BASE}/v5/boards`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to get boards: ${response.status} - ${error}`)
  }

  const data = await response.json()
  const boards = data.items?.map((b: any) => ({ id: b.id, name: b.name })) || []

  console.log(`   ✅ Found ${boards.length} boards`)
  return boards
}

// Create a pin
async function createPin(
  accessToken: string,
  pin: PinterestPin,
  boardId: string
): Promise<{ success: boolean; pinId?: string; error?: string }> {

  // Combine description with hashtags
  let fullDescription = pin.description
  if (pin.hashtags && pin.hashtags.length > 0) {
    fullDescription += '\n\n' + pin.hashtags.join(' ')
  }

  const pinData: any = {
    board_id: boardId,
    title: pin.title.substring(0, 100), // Pinterest max title
    description: fullDescription.substring(0, 500), // Pinterest max description
    link: pin.link,
    media_source: {
      source_type: 'image_url',
      url: pin.imageUrl
    }
  }

  // Add alt text if provided
  if (pin.altText) {
    pinData.alt_text = pin.altText.substring(0, 500)
  }

  try {
    const response = await fetch(`${API_BASE}/v5/pins`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(pinData)
    })

    if (!response.ok) {
      const errorText = await response.text()
      return { success: false, error: `${response.status}: ${errorText}` }
    }

    const result = await response.json()
    return { success: true, pinId: result.id }

  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// Load pins from generated files
function loadGeneratedPins(): PinterestPin[] {
  const pins: PinterestPin[] = []

  // Load product pins
  const productDir = path.join(process.cwd(), 'data', 'product-pins')
  if (fs.existsSync(productDir)) {
    const files = fs.readdirSync(productDir).filter(f => f.startsWith('product-pins-') && f.endsWith('.json'))
    if (files.length > 0) {
      const latestFile = files.sort().reverse()[0]
      const products = JSON.parse(fs.readFileSync(path.join(productDir, latestFile), 'utf-8'))

      for (const p of products) {
        pins.push({
          title: p.pinTitle,
          description: p.pinDescription,
          link: p.link,
          imageUrl: p.imageUrl,
          hashtags: p.hashtags,
          altText: p.altText,
          board: p.board
        })
      }
      console.log(`📦 Loaded ${products.length} product pins`)
    }
  }

  // Load content pins
  const contentDir = path.join(process.cwd(), 'data', 'content-batches')
  if (fs.existsSync(contentDir)) {
    const files = fs.readdirSync(contentDir).filter(f => f.startsWith('content-batch-') && f.endsWith('.json'))
    if (files.length > 0) {
      const latestFile = files.sort().reverse()[0]
      const batch = JSON.parse(fs.readFileSync(path.join(contentDir, latestFile), 'utf-8'))

      if (batch.pinterest) {
        for (const p of batch.pinterest) {
          pins.push({
            title: p.title,
            description: p.description,
            link: p.link || 'https://brandonmills.com',
            imageUrl: 'https://brandonmills.com/images/og-image.jpg', // Default OG image
            hashtags: p.hashtags,
            altText: p.altText,
            board: p.board
          })
        }
        console.log(`📝 Loaded ${batch.pinterest.length} content pins`)
      }
    }
  }

  return pins
}

// Main posting function
async function postPins(count: number = 5): Promise<void> {
  console.log('\n📌 Pinterest API Poster')
  console.log('=======================\n')

  // Use sandbox token for sandbox mode, production token otherwise
  const accessToken = USE_SANDBOX
    ? process.env.PINTEREST_SANDBOX_ACCESS_TOKEN
    : process.env.PINTEREST_ACCESS_TOKEN
  const defaultBoardId = USE_SANDBOX
    ? process.env.PINTEREST_SANDBOX_BOARD_ID
    : process.env.PINTEREST_BOARD_ID

  if (!accessToken) {
    const tokenVar = USE_SANDBOX ? 'PINTEREST_SANDBOX_ACCESS_TOKEN' : 'PINTEREST_ACCESS_TOKEN'
    console.error(`❌ ${tokenVar} not set`)
    console.log('\nAdd to .env.local:')
    console.log(`  ${tokenVar}=your_token`)
    process.exit(1)
  }

  // Use default board or get from API
  let boardId = defaultBoardId
  let boardName = 'Unknown'

  if (!boardId) {
    // Get boards from API
    const boards = await getBoards(accessToken)
    if (boards.length === 0) {
      console.error('❌ No boards found')
      process.exit(1)
    }
    boardId = boards[0].id
    boardName = boards[0].name
  } else {
    boardName = boardId // Just use ID as name when we have a preset board
  }

  console.log(`📋 Using board: ${boardName} (${boardId})\n`)

  // Load pins
  const pins = loadGeneratedPins()
  if (pins.length === 0) {
    console.error('❌ No pins found')
    console.log('\nRun these commands first:')
    console.log('  npm run pinterest:content')
    console.log('  npm run pinterest:products')
    process.exit(1)
  }

  // Post pins
  const toPost = pins.slice(0, count)
  console.log(`📤 Posting ${toPost.length} pins...\n`)

  let successCount = 0
  for (let i = 0; i < toPost.length; i++) {
    const pin = toPost[i]
    console.log(`[${i + 1}/${toPost.length}] ${pin.title.substring(0, 50)}...`)

    const result = await createPin(accessToken, pin, boardId)

    if (result.success) {
      console.log(`   ✅ Created: ${result.pinId}`)
      successCount++
    } else {
      console.log(`   ❌ Failed: ${result.error}`)
    }

    // Rate limit - wait between pins
    if (i < toPost.length - 1) {
      console.log('   ⏳ Waiting 5s...')
      await new Promise(resolve => setTimeout(resolve, 5000))
    }
  }

  console.log(`\n✅ Complete: ${successCount}/${toPost.length} pins posted`)
}

// Show boards only
async function showBoards(): Promise<void> {
  console.log('\n📋 Pinterest Boards')
  console.log('===================\n')

  const accessToken = USE_SANDBOX
    ? process.env.PINTEREST_SANDBOX_ACCESS_TOKEN
    : process.env.PINTEREST_ACCESS_TOKEN
  if (!accessToken) {
    const tokenVar = USE_SANDBOX ? 'PINTEREST_SANDBOX_ACCESS_TOKEN' : 'PINTEREST_ACCESS_TOKEN'
    console.error(`❌ ${tokenVar} not set`)
    process.exit(1)
  }

  const boards = await getBoards(accessToken)

  console.log('Available boards:\n')
  for (const board of boards) {
    console.log(`  ${board.name}`)
    console.log(`    ID: ${board.id}`)
    console.log('')
  }

  console.log('Add to .env.local:')
  console.log(`  PINTEREST_BOARD_ID=${boards[0]?.id || 'your_board_id'}`)
}

// Parse args and run
const args = process.argv.slice(2)

if (args.includes('--boards')) {
  showBoards().catch(err => {
    console.error('Error:', err.message)
    process.exit(1)
  })
} else {
  const countArg = args.find(a => a.startsWith('--count='))
  const count = countArg ? parseInt(countArg.split('=')[1]) : 5

  postPins(count).catch(err => {
    console.error('Error:', err.message)
    process.exit(1)
  })
}
