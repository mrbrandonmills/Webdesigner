import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { z } from 'zod'
import logger from '@/lib/logger'
import { validatePrice } from '@/lib/pricing'

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

    // CRITICAL SECURITY: Validate all prices server-side against Printful API
    // NEVER trust client-provided prices - users can manipulate browser data
    logger.info(`Validating prices for ${items.length} items in checkout`)

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = []

    for (const item of items) {
      // Parse client-provided price
      const clientPrice = parseFloat(item.price)
      const productId = parseInt(item.productId, 10)
      const variantId = parseInt(item.variantId, 10)

      // Sanity check - catch obviously invalid data early
      if (isNaN(productId) || isNaN(variantId) || isNaN(clientPrice)) {
        logger.error('Invalid item data in checkout', {
          productId: item.productId,
          variantId: item.variantId,
          price: item.price,
        })
        return NextResponse.json(
          { error: 'Invalid product data. Please refresh the page and try again.' },
          { status: 400 }
        )
      }

      // Validate price against server-calculated price from Printful
      try {
        const validation = await validatePrice(clientPrice, productId, variantId)

        if (!validation.valid) {
          // Price mismatch detected - possible tampering or stale data
          logger.error('Price validation failed - security breach attempt or stale data', {
            productId,
            variantId,
            clientPrice,
            serverPrice: validation.serverPrice,
            difference: validation.difference,
            productTitle: item.productTitle,
          })

          return NextResponse.json(
            {
              error: 'Price verification failed. Prices may have changed. Please refresh the page and try again.',
              details: 'The price in your cart does not match current pricing.',
            },
            { status: 400 }
          )
        }

        // Price validated successfully - use SERVER price for Stripe (not client price)
        logger.success(
          `Price validated for ${item.productTitle}: $${validation.serverPrice.toFixed(2)}`,
          { productId, variantId }
        )

        // Create Stripe line item using SERVER-CALCULATED price
        lineItems.push({
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
            // CRITICAL: Use server price, not client price
            unit_amount: Math.round(validation.serverPrice * 100), // Convert to cents
          },
          quantity: item.quantity,
        })
      } catch (error) {
        // Failed to validate price (API error, network issue, etc.)
        logger.error('Failed to validate price during checkout', {
          error,
          productId,
          variantId,
        })

        return NextResponse.json(
          {
            error: 'Unable to verify product pricing. Please try again in a moment.',
            details: 'Price validation service temporarily unavailable.',
          },
          { status: 503 }
        )
      }
    }

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
    // Log detailed error server-side using secure logger
    logger.error('Stripe checkout error', error)

    // Extract error type for pattern matching (keep internal)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    // Return sanitized error message to client
    // Never expose Stripe API details, keys, or internal error messages
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