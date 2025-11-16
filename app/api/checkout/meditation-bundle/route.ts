import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { z } from 'zod'
import logger from '@/lib/logger'
import { MEDITATIONS } from '@/lib/meditations-data'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Validation schema for bundle checkout request
const bundleCheckoutRequestSchema = z.object({
  customerEmail: z.string().email().optional(),
})

// Bundle pricing configuration
const BUNDLE_CONFIG = {
  name: 'Complete Meditation Collection',
  description: 'Unlock all 10 premium guided meditations with lifetime access',
  price: 30, // $30 instead of $50 (40% discount)
  originalPrice: 50,
  discount: 20,
  discountPercent: 40,
  meditationCount: 10,
}

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
    const validationResult = bundleCheckoutRequestSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid request data',
          details: validationResult.error.flatten()
        },
        { status: 400 }
      )
    }

    const { customerEmail } = validationResult.data

    // Get the base URL for redirects
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

    // Create list of all meditation slugs for metadata
    const meditationSlugs = MEDITATIONS.map(m => m.slug).join(',')

    // Create Stripe checkout session for bundle
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: BUNDLE_CONFIG.name,
              description: BUNDLE_CONFIG.description,
              images: [], // You can add a bundle image URL here
              metadata: {
                type: 'meditation_bundle',
                meditationCount: BUNDLE_CONFIG.meditationCount.toString(),
                originalPrice: BUNDLE_CONFIG.originalPrice.toString(),
                discount: BUNDLE_CONFIG.discount.toString(),
              },
            },
            unit_amount: Math.round(BUNDLE_CONFIG.price * 100), // $30 in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${baseUrl}/meditations?session_id={CHECKOUT_SESSION_ID}&bundle_unlocked=true`,
      cancel_url: `${baseUrl}/meditations`,
      customer_email: customerEmail || undefined,
      metadata: {
        type: 'meditation_bundle',
        meditationSlugs,
        meditationCount: BUNDLE_CONFIG.meditationCount.toString(),
        discountPercent: BUNDLE_CONFIG.discountPercent.toString(),
      },
      // Add discount display in checkout
      discounts: [],
    })

    // Log success
    logger.success('Stripe checkout session created for meditation bundle')

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
      bundle: BUNDLE_CONFIG,
    })
  } catch (error) {
    // Log detailed error server-side
    logger.error('Stripe bundle checkout error', error)

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

// GET endpoint to retrieve bundle information
export async function GET() {
  return NextResponse.json({
    bundle: BUNDLE_CONFIG,
    meditations: MEDITATIONS.map(m => ({
      id: m.id,
      slug: m.slug,
      title: m.title,
      duration: m.duration,
      price: m.price,
    })),
    totalSavings: BUNDLE_CONFIG.discount,
    discountPercent: BUNDLE_CONFIG.discountPercent,
  })
}
