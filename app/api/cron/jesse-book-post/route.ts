/**
 * Jesse's Book Post Cron - @lab.of.living
 *
 * Posts ONLY self-actualization content from Random Acts of Self-Actualization trilogy
 * Runs 4x daily alongside main account
 */

import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

const QUOTES_PATH = './scripts/automation/content/books/self-actualization-quotes.json'
const STATE_PATH = './data/jesse-instagram-state.json'

interface Quote {
  text: string
  book: string
  theme: string
  tags: string[]
}

interface QuotesData {
  quotes: Quote[]
}

interface PostState {
  lastPostedIndex: number
  lastPostedDate: string
  totalPosts: number
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    console.log('[Jesse Book Cron] No auth - manual trigger')
  }

  console.log('[Jesse Book Cron] Starting self-actualization book post...')

  try {
    // Load quotes
    const quotesData = await fs.readFile(QUOTES_PATH, 'utf-8')
    const { quotes }: QuotesData = JSON.parse(quotesData)

    if (quotes.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No quotes available'
      }, { status: 404 })
    }

    // Load state
    let state: PostState
    try {
      const stateData = await fs.readFile(STATE_PATH, 'utf-8')
      state = JSON.parse(stateData)
    } catch {
      state = {
        lastPostedIndex: -1,
        lastPostedDate: '',
        totalPosts: 0
      }
    }

    // Get next quote (cycle through)
    const nextIndex = (state.lastPostedIndex + 1) % quotes.length
    const quote = quotes[nextIndex]

    console.log(`[Jesse Book Cron] Posting quote ${nextIndex + 1}/${quotes.length}`)

    // Create Instagram post caption
    const hashtags = [
      '#SelfActualization',
      '#PersonalGrowth',
      '#Philosophy',
      '#IntentionalLiving',
      '#AddictionRecovery',
      '#TheLaboratoryOfLiving',
      '#RandomActs',
      ...quote.tags.map(tag => `#${tag.replace(/_/g, '')}`)
    ].slice(0, 15) // Instagram limit

    const caption = `"${quote.text}"

— ${quote.book}

The Laboratory of Living trilogy explores breaking free from addiction and building an intentional life through radical self-actualization.

📖 Read Block 3 free: brandonmills.com/book/block-3
📚 Get Volumes 1 & 2: amazon.com/author/brandonmills

${hashtags.join(' ')}`

    // Post to Instagram
    const posted = await postToInstagram(caption)

    if (!posted) {
      throw new Error('Failed to post to Instagram')
    }

    // Update state
    state.lastPostedIndex = nextIndex
    state.lastPostedDate = new Date().toISOString()
    state.totalPosts++

    await fs.writeFile(STATE_PATH, JSON.stringify(state, null, 2))

    return NextResponse.json({
      success: true,
      quote: {
        text: quote.text.substring(0, 100),
        book: quote.book,
        theme: quote.theme
      },
      posted: true,
      nextQuoteIndex: (nextIndex + 1) % quotes.length,
      totalPosts: state.totalPosts
    })

  } catch (error) {
    console.error('[Jesse Book Cron] Error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

async function postToInstagram(caption: string): Promise<boolean> {
  try {
    const accessToken = process.env.JESSE_INSTAGRAM_ACCESS_TOKEN
    const accountId = process.env.JESSE_INSTAGRAM_BUSINESS_ACCOUNT_ID

    if (!accessToken || !accountId) {
      console.error('[Jesse Book Cron] Missing Instagram credentials')
      return false
    }

    // Use book cover as image (create one or use existing)
    const imageUrl = 'https://brandonmills.com/og-block-3.jpg'

    // Create media container
    const createUrl = `https://graph.facebook.com/v18.0/${accountId}/media`
    const createResponse = await fetch(createUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image_url: imageUrl,
        caption,
        access_token: accessToken
      })
    })

    if (!createResponse.ok) {
      const error = await createResponse.json()
      throw new Error(`Instagram create failed: ${JSON.stringify(error)}`)
    }

    const { id: creationId } = await createResponse.json()

    // Publish
    const publishUrl = `https://graph.facebook.com/v18.0/${accountId}/media_publish`
    const publishResponse = await fetch(publishUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        creation_id: creationId,
        access_token: accessToken
      })
    })

    if (!publishResponse.ok) {
      const error = await publishResponse.json()
      throw new Error(`Instagram publish failed: ${JSON.stringify(error)}`)
    }

    const { id: mediaId } = await publishResponse.json()
    console.log(`[Jesse Book Cron] Posted to Instagram: ${mediaId}`)

    return true
  } catch (error) {
    console.error('[Jesse Book Cron] Instagram posting failed:', error)
    return false
  }
}
