import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import Stripe from 'stripe'
import { formatZodErrors } from '@/lib/validations'
import { logger } from '@/lib/logger'
import { getBookById } from '@/lib/books-data'

// Mark as dynamic to prevent static generation
export const dynamic = 'force-dynamic'

// Updated schema - price is no longer accepted from client
const BookUnlockRequestSchema = z.object({
  bookId: z.string().min(1, 'Book ID is required'),
})

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not set')
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-10-29.clover',
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input with Zod - only bookId is required from client
    const validationResult = BookUnlockRequestSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        formatZodErrors(validationResult.error),
        { status: 400 }
      )
    }

    const { bookId } = validationResult.data

    // SECURITY: Look up book price server-side - NEVER trust client-provided prices
    const book = getBookById(bookId)
    if (!book) {
      logger.warn('Invalid book ID requested:', { bookId })
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      )
    }

    // Create Stripe Checkout Session for book purchase using server-side price
    const stripe = getStripe()
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: book.title,
              description: book.description,
              images: ['https://brandonmills.com/og-image.jpg'],
            },
            unit_amount: Math.round(book.price * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/writing/books/${bookId}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/writing/books/${bookId}`,
      metadata: {
        bookId,
        productType: 'book',
      },
    })

    return NextResponse.json({ checkoutUrl: session.url })
  } catch (error) {
    logger.error('Book unlock error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
