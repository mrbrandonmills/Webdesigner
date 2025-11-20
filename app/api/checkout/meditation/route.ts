import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { z } from 'zod'
import logger from '@/lib/logger'
import { getMeditationBySlug } from '@/lib/meditations-data'
import { MeditationCheckoutSchema, formatZodErrors } from '@/lib/validations'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    // Check for Stripe key
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Stripe is not configured. Add STRIPE_SECRET_KEY to environment variables.' },
        { status: 500 }
      )
    }

    // Initialize Stripe
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-10-29.clover',
    })

    // Parse and validate request body
    const body = await request.json()
    const validationResult = MeditationCheckoutSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        formatZodErrors(validationResult.error),
        { status: 400 }
      )
    }

    const { meditationSlug, customerEmail } = validationResult.data

    // Get meditation from data
    const meditation = getMeditationBySlug(meditationSlug)

    if (!meditation) {
      return NextResponse.json(
        { error: 'Meditation not found' },
        { status: 404 }
      )
    }

    // CRITICAL SECURITY: Use server-side price, never trust client
    const price = meditation.price

    // Get the base URL for redirects
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: meditation.title,
              description: `${meditation.subtitle} - ${meditation.duration} meditation`,
              metadata: {
                meditationId: meditation.id,
                meditationSlug: meditation.slug,
                type: 'meditation_single',
              },
            },
            unit_amount: Math.round(price * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${baseUrl}/meditations/${meditationSlug}?session_id={CHECKOUT_SESSION_ID}&unlock=true`,
      cancel_url: `${baseUrl}/meditations/${meditationSlug}`,
      customer_email: customerEmail || undefined,
      metadata: {
        meditationId: meditation.id,
        meditationSlug: meditation.slug,
        type: 'meditation_single',
      },
    })

    // Log success
    logger.success(`Stripe checkout session created for meditation: ${meditation.title}`)

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    })
  } catch (error) {
    // Log detailed error server-side
    logger.error('Stripe meditation checkout error', error)

    // Extract error type for pattern matching
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    // Return sanitized error message to client
    if (errorMessage.includes('API key') || errorMessage.includes('apiKey')) {
      return NextResponse.json(
        { error: 'Payment system configuration error. Please contact support.' },
        { status: 500 }
      )
    }

    if (errorMessage.includes('rate limit') || errorMessage.includes('429')) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a moment and try again.' },
        { status: 429 }
      )
    }

    // Generic sanitized error for all other cases
    return NextResponse.json(
      { error: 'Unable to process checkout. Please try again or contact support.' },
      { status: 500 }
    )
  }
}
