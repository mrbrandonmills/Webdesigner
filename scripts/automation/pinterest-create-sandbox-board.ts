/**
 * Create a board in Pinterest Sandbox
 */

import { config } from 'dotenv'
import * as path from 'path'

config({ path: path.join(process.cwd(), '.env.local') })

async function createBoard() {
  const accessToken = process.env.PINTEREST_SANDBOX_ACCESS_TOKEN

  if (!accessToken) {
    console.error('❌ PINTEREST_SANDBOX_ACCESS_TOKEN not set')
    process.exit(1)
  }

  console.log('Creating board in sandbox...')

  const response = await fetch('https://api-sandbox.pinterest.com/v5/boards', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: 'Genesis Collection',
      description: 'Sacred geometry art prints by Brandon Mills'
    })
  })

  if (!response.ok) {
    const error = await response.text()
    console.error('❌ Failed:', response.status, error)
    process.exit(1)
  }

  const board = await response.json()
  console.log('✅ Board created!')
  console.log('Board ID:', board.id)
  console.log('Name:', board.name)
}

createBoard()
