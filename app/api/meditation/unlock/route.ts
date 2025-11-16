import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { z } from 'zod'
import logger from '@/lib/logger'
import { writeFile, readFile, mkdir } from 'fs/promises'
import path from 'path'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Validation schema for unlock verification request
const unlockRequestSchema = z.object({
  sessionId: z.string().min(1, 'Session ID is required'),
})

export async function POST(request: Request) {
  try {
    // Check for Stripe key
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Stripe is not configured.' },
        { status: 500 }
      )
    }

    // Initialize Stripe
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-10-29.clover',
    })

    // Parse and validate request body
    const body = await request.json()
    const validationResult = unlockRequestSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid request data',
          details: validationResult.error.flatten()
        },
        { status: 400 }
      )
    }

    const { sessionId } = validationResult.data

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    // Verify payment was successful
    if (session.payment_status !== 'paid') {
      return NextResponse.json(
        { error: 'Payment not completed', unlocked: false },
        { status: 400 }
      )
    }

    // Get meditation information from session metadata
    const meditationSlug = session.metadata?.meditationSlug
    const meditationId = session.metadata?.meditationId
    const purchaseType = session.metadata?.type || 'meditation_single'

    if (!meditationSlug) {
      return NextResponse.json(
        { error: 'Invalid session data' },
        { status: 400 }
      )
    }

    // Create unlock record
    const unlockRecord = {
      sessionId,
      meditationId,
      meditationSlug,
      purchaseType,
      customerEmail: session.customer_details?.email || '',
      customerName: session.customer_details?.name || '',
      amount: session.amount_total ? session.amount_total / 100 : 0,
      currency: session.currency || 'usd',
      createdAt: new Date().toISOString(),
    }

    // Save unlock record to file system
    const unlocksDir = path.join(process.cwd(), 'data', 'meditation-unlocks')
    await mkdir(unlocksDir, { recursive: true })

    // Save individual unlock record
    const unlockFile = path.join(unlocksDir, `${sessionId}.json`)
    await writeFile(unlockFile, JSON.stringify(unlockRecord, null, 2))

    // Update unlock index (by email for future lookup)
    const email = session.customer_details?.email
    if (email) {
      const emailIndexFile = path.join(unlocksDir, 'by-email.json')
      let emailIndex: Record<string, string[]> = {}

      try {
        const indexContent = await readFile(emailIndexFile, 'utf-8')
        emailIndex = JSON.parse(indexContent)
      } catch {
        // File doesn't exist yet
      }

      if (!emailIndex[email]) {
        emailIndex[email] = []
      }

      // Add meditation to user's unlocked list
      if (purchaseType === 'meditation_bundle') {
        // Bundle unlocks all meditations
        emailIndex[email].push('all')
      } else if (!emailIndex[email].includes(meditationSlug) && !emailIndex[email].includes('all')) {
        emailIndex[email].push(meditationSlug)
      }

      await writeFile(emailIndexFile, JSON.stringify(emailIndex, null, 2))
    }

    logger.success(`Meditation unlocked: ${meditationSlug} for ${email || 'unknown'}`)

    // Generate unlock token (simple JWT-like structure)
    const unlockToken = Buffer.from(JSON.stringify({
      sessionId,
      meditationSlug,
      timestamp: Date.now(),
    })).toString('base64')

    return NextResponse.json({
      unlocked: true,
      meditationSlug,
      purchaseType,
      unlockToken,
    })
  } catch (error) {
    logger.error('Meditation unlock verification error', error)

    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    if (errorMessage.includes('No such checkout.session')) {
      return NextResponse.json(
        { error: 'Invalid session ID', unlocked: false },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Unable to verify unlock. Please contact support.', unlocked: false },
      { status: 500 }
    )
  }
}

// GET endpoint to check unlock status by email
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    const meditationSlug = searchParams.get('slug')

    if (!email) {
      return NextResponse.json({ unlocked: false, meditations: [] })
    }

    // Check unlock index
    const unlocksDir = path.join(process.cwd(), 'data', 'meditation-unlocks')
    const emailIndexFile = path.join(unlocksDir, 'by-email.json')

    let emailIndex: Record<string, string[]> = {}

    try {
      const indexContent = await readFile(emailIndexFile, 'utf-8')
      emailIndex = JSON.parse(indexContent)
    } catch {
      return NextResponse.json({ unlocked: false, meditations: [] })
    }

    const unlockedMeditations = emailIndex[email] || []

    // Check if specific meditation is unlocked
    if (meditationSlug) {
      const isUnlocked = unlockedMeditations.includes('all') || unlockedMeditations.includes(meditationSlug)
      return NextResponse.json({ unlocked: isUnlocked, meditations: unlockedMeditations })
    }

    // Return all unlocked meditations
    return NextResponse.json({ unlocked: unlockedMeditations.length > 0, meditations: unlockedMeditations })
  } catch (error) {
    logger.error('Unlock status check error', error)
    return NextResponse.json({ unlocked: false, meditations: [] })
  }
}
