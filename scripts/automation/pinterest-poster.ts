/**
 * Pinterest Auto-Poster (Business API)
 *
 * Posts pins to Pinterest boards using the v5 API.
 * Requires Business account and OAuth access token.
 */

import * as fs from 'fs'
import * as path from 'path'
import { pathsConfig } from './config'
import { logger } from './logger'
import { stateManager } from './state-manager'

interface PinterestPin {
  id: string
  title: string
  description: string
  link: string
  imageUrl: string
  boardId?: string
}

// Load pins from markdown file
function loadPins(): PinterestPin[] {
  const pinsPath = path.join(pathsConfig.contentDir, 'pinterest', 'pins.md')

  if (!fs.existsSync(pinsPath)) {
    logger.warn('PINTEREST', 'No pins file found')
    return []
  }

  const content = fs.readFileSync(pinsPath, 'utf-8')
  const pins: PinterestPin[] = []

  // Split by --- separator
  const blocks = content.split(/^---$/m).filter(b => b.trim())

  for (const block of blocks) {
    const lines = block.trim().split('\n')

    // Skip header comments
    if (lines[0]?.trim().startsWith('#')) continue

    let title = ''
    let description = ''
    let link = ''
    let imageUrl = ''
    let boardId = ''

    for (const line of lines) {
      const trimmed = line.trim()
      if (trimmed.toLowerCase().startsWith('title:')) {
        title = trimmed.replace(/^title:\s*/i, '')
      } else if (trimmed.toLowerCase().startsWith('description:')) {
        description = trimmed.replace(/^description:\s*/i, '')
      } else if (trimmed.toLowerCase().startsWith('link:')) {
        link = trimmed.replace(/^link:\s*/i, '')
      } else if (trimmed.toLowerCase().startsWith('image:')) {
        imageUrl = trimmed.replace(/^image:\s*/i, '')
      } else if (trimmed.toLowerCase().startsWith('board:')) {
        boardId = trimmed.replace(/^board:\s*/i, '')
      }
    }

    // Also handle multi-line description
    if (!description) {
      const descStart = block.indexOf('\n\n')
      if (descStart > 0) {
        description = block.substring(descStart).trim()
      }
    }

    if (title && (imageUrl || link)) {
      const id = Buffer.from(title).toString('base64').substring(0, 12)
      pins.push({
        id,
        title,
        description: description || title,
        link: link || 'https://brandonmills.com/dream-decoder',
        imageUrl: imageUrl || 'https://brandonmills.com/images/dream-decoder-pin.jpg',
        boardId: boardId || undefined
      })
    }
  }

  logger.info('PINTEREST', `Loaded ${pins.length} pins`)
  return pins
}

// Get boards
async function getBoards(accessToken: string): Promise<Array<{ id: string; name: string }>> {
  try {
    const response = await fetch('https://api.pinterest.com/v5/boards', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })

    if (!response.ok) {
      logger.error('PINTEREST', `Failed to get boards: ${response.status}`)
      return []
    }

    const data = await response.json()
    return data.items.map((b: any) => ({ id: b.id, name: b.name }))

  } catch (error: any) {
    logger.error('PINTEREST', `Error getting boards: ${error.message}`)
    return []
  }
}

// Create a pin
async function createPin(
  accessToken: string,
  pin: PinterestPin,
  defaultBoardId: string
): Promise<{ success: boolean; pinId?: string; error?: string }> {

  const pinData = {
    board_id: pin.boardId || defaultBoardId,
    title: pin.title,
    description: pin.description,
    link: pin.link,
    media_source: {
      source_type: 'image_url',
      url: pin.imageUrl
    }
  }

  try {
    const response = await fetch('https://api.pinterest.com/v5/pins', {
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

// Main posting function
export async function postToPinterest(pinCount: number = 1): Promise<void> {
  logger.info('PINTEREST', `Starting Pinterest posting (count: ${pinCount})`)

  const accessToken = process.env.PINTEREST_ACCESS_TOKEN
  const defaultBoardId = process.env.PINTEREST_BOARD_ID

  if (!accessToken) {
    logger.error('PINTEREST', 'Missing PINTEREST_ACCESS_TOKEN')
    logger.info('PINTEREST', 'Get token at: https://developers.pinterest.com/')
    return
  }

  // Get boards if no default set
  let boardId = defaultBoardId
  if (!boardId) {
    const boards = await getBoards(accessToken)
    if (boards.length === 0) {
      logger.error('PINTEREST', 'No boards found and no PINTEREST_BOARD_ID set')
      return
    }
    boardId = boards[0].id
    logger.info('PINTEREST', `Using board: ${boards[0].name} (${boardId})`)
  }

  const pins = loadPins()
  if (pins.length === 0) {
    logger.warn('PINTEREST', 'No pins available')
    return
  }

  // Get unposted content
  const postedIds = stateManager.getPostedIds('pinterest')
  const availablePins = pins.filter(p => !postedIds.includes(p.id))

  if (availablePins.length === 0) {
    logger.info('PINTEREST', 'All pins have been used, resetting')
    stateManager.resetPlatform('pinterest')
  }

  const toPost = availablePins.slice(0, pinCount)
  let successCount = 0

  for (const pin of toPost) {
    logger.info('PINTEREST', `Creating pin: ${pin.title}`)

    const result = await createPin(accessToken, pin, boardId!)

    if (result.success) {
      stateManager.recordPost('pinterest', pin.id, true, {
        pinId: result.pinId,
        title: pin.title
      })
      logger.info('PINTEREST', `Pinned successfully: ${result.pinId}`)
      successCount++
    } else {
      stateManager.recordPost('pinterest', pin.id, false, {
        title: pin.title,
        error: result.error
      })
      logger.error('PINTEREST', `Failed: ${result.error}`)
    }

    // Rate limit - wait 10 seconds between pins
    if (toPost.indexOf(pin) < toPost.length - 1) {
      logger.info('PINTEREST', 'Waiting 10s before next pin...')
      await new Promise(resolve => setTimeout(resolve, 10000))
    }
  }

  logger.info('PINTEREST', `Complete: ${successCount}/${toPost.length} successful`)
}

// Get status
export function getPinterestStatus() {
  const stats = stateManager.getStats('pinterest')
  const pins = loadPins()

  return {
    configured: !!process.env.PINTEREST_ACCESS_TOKEN,
    postsToday: stats.postsToday,
    totalPosts: stats.totalPosts,
    availableContent: pins.length
  }
}

// Run directly
if (require.main === module) {
  postToPinterest(1).then(() => {
    console.log('\nPinterest posting completed')
    process.exit(0)
  }).catch(err => {
    console.error('Error:', err)
    process.exit(1)
  })
}
