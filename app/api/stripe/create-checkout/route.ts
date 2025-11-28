import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import Stripe from 'stripe'
import { getMeditationBySlug } from '@/lib/meditations-data'
import { logger } from '@/lib/logger'
import { CreateCheckoutSchema, formatZodErrors } from '@/lib/validations'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY

  // Detailed validation
  if (!key || key.trim() === '') {
    logger.error('STRIPE_SECRET_KEY environment variable is missing or empty')
    throw new Error('STRIPE_SECRET_KEY is not set')
  }

  // Check if using test key in production
  if (key.startsWith('sk_test_')) {
    logger.warn('Using Stripe TEST key - should use sk_live_ in production')
  }

  logger.info(`Initializing Stripe with key type: ${key.startsWith('sk_live_') ? 'LIVE' : key.startsWith('sk_test_') ? 'TEST' : 'UNKNOWN'}`)

  return new Stripe(key)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input with Zod
    const validationResult = CreateCheckoutSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        formatZodErrors(validationResult.error),
        { status: 400 }
      )
    }

    const { meditationId, slug, voice } = validationResult.data

    // Get meditation details
    const meditation = getMeditationBySlug(slug)

    if (!meditation) {
      return NextResponse.json(
        { error: 'Meditation not found' },
        { status: 404 }
      )
    }

    // Create Stripe Checkout Session
    const stripe = getStripe()

    // Get base URL - prefer environment variable, fall back to request headers
    const protocol = request.headers.get('x-forwarded-proto') || 'https'
    const host = request.headers.get('host') || request.headers.get('x-forwarded-host') || 'www.brandonmills.com'
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${protocol}://${host}`

    const successUrl = `${baseUrl}/meditations/${slug}/success?session_id={CHECKOUT_SESSION_ID}`
    const cancelUrl = `${baseUrl}/meditations/${slug}`

    logger.info('Creating Stripe checkout session', {
      envBaseUrl: process.env.NEXT_PUBLIC_BASE_URL,
      protocol,
      host,
      baseUrl,
      successUrl,
      cancelUrl,
    })

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: meditation.title,
              description: `${meditation.subtitle} - Guided meditation with ${voice} voice`,
              images: ['https://brandonmills.com/og-image.jpg'], // Replace with actual meditation image
            },
            unit_amount: meditation.price * 100, // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        meditationId: meditation.id,
        meditationSlug: slug,
        voicePreference: voice,
        productType: 'meditation',
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    logger.error('Stripe checkout error', error)

    // Provide more specific error messages
    let errorMessage = 'Failed to create checkout session'
    if (error instanceof Error) {
      if (error.message.includes('Invalid API Key')) {
        errorMessage = 'Payment system configuration error'
      } else if (error.message.includes('apiVersion')) {
        errorMessage = 'Payment API version error'
      } else {
        errorMessage = error.message
      }
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
