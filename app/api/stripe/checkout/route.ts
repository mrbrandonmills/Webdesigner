import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { z } from 'zod'
import logger from '@/lib/logger'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Zod validation schema for checkout request
const checkoutItemSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  productTitle: z.string().min(1, 'Product title is required'),
  variantId: z.string().min(1, 'Variant ID is required'),
  variantName: z.string().min(1, 'Variant name is required'),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid price format'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1').max(100, 'Quantity cannot exceed 100'),
  image: z.string().url().optional(),
})

const checkoutRequestSchema = z.object({
  items: z.array(checkoutItemSchema).min(1, 'At least one item is required'),
  customerEmail: z.string().email().optional(),
})

export async function POST(request: Request) {
  try {
    // Check for Stripe key
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Stripe is not configured. Add STRIPE_SECRET_KEY to environment variables.' },
        { status: 500 }
      )
    }

    // Initialize Stripe inside the handler
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-10-29.clover',
    })

    // Parse and validate request body
    const body = await request.json()

    // Validate input using Zod
    const validationResult = checkoutRequestSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid request data',
          details: validationResult.error.flatten()
        },
        { status: 400 }
      )
    }

    const { items, customerEmail } = validationResult.data

    // Additional security: Validate prices against your backend data
    // In production, you should fetch actual prices from your database/Printful
    // and never trust client-provided prices
    for (const item of items) {
      const price = parseFloat(item.price)
      if (price < 0 || price > 10000) {
        return NextResponse.json(
          { error: 'Invalid price detected. Price must be between $0 and $10,000' },
          { status: 400 }
        )
      }
    }

    // Create line items for Stripe with validated data
    const lineItems = items.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.productTitle,
          description: item.variantName,
          images: item.image ? [item.image] : [],
          metadata: {
            productId: item.productId,
            variantId: item.variantId,
          },
        },
        unit_amount: Math.round(parseFloat(item.price) * 100), // Convert to cents
      },
      quantity: item.quantity,
    }))

    // Get the base URL for redirects
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/store`,
      customer_email: customerEmail || undefined,
      metadata: {
        items: JSON.stringify(items), // Store validated cart items for order creation
      },
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'AU', 'NZ'], // Expand as needed
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 0, // Free shipping
              currency: 'usd',
            },
            display_name: 'Free Shipping',
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 5,
              },
              maximum: {
                unit: 'business_day',
                value: 10,
              },
            },
          },
        },
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 1500, // $15 express shipping
              currency: 'usd',
            },
            display_name: 'Express Shipping',
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 2,
              },
              maximum: {
                unit: 'business_day',
                value: 3,
              },
            },
          },
        },
      ],
    })

    // Log success using secure logger
    logger.success(`Stripe checkout session created: ${session.id}`)

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    })
  } catch (error) {
    // Log error using secure logger
    logger.error('Stripe checkout error', error)

    const errorMessage = error instanceof Error ? error.message : 'Failed to create checkout session'

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}