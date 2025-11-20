import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { logger } from '@/lib/logger'

export const dynamic = 'force-dynamic'

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not set')
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-10-29.clover',
  })
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const sessionId = searchParams.get('session_id')

  if (!sessionId) {
    return NextResponse.json({ valid: false, error: 'Missing session_id' }, { status: 400 })
  }

  try {
    // Retrieve the Stripe session
    const stripe = getStripe()
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    // Check if payment was successful
    if (session.payment_status === 'paid') {
      return NextResponse.json({
        valid: true,
        meditation: {
          id: session.metadata?.meditationId,
          slug: session.metadata?.meditationSlug,
          voice: session.metadata?.voicePreference,
        },
        customerEmail: session.customer_details?.email,
      })
    }

    return NextResponse.json({ valid: false, error: 'Payment not completed' }, { status: 400 })
  } catch (error) {
    logger.error('Stripe verification error:', error)
    return NextResponse.json({ valid: false, error: 'Verification failed' }, { status: 500 })
  }
}
