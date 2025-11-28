import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { writeFile, readFile, mkdir } from 'fs/promises'
import path from 'path'
import { sendOrderConfirmation, sendAdminNotification, sendMeditationPurchaseConfirmation } from '@/lib/email'
import { getMeditationBySlug } from '@/lib/meditations-data'
import { LocalOrder, CartItem, StripeShippingAddress } from '@/types/common'
import { logger } from '@/lib/logger'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    // Check for required environment variables
    if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
    }

    // Initialize Stripe inside the handler
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-10-29.clover',
    })

    const body = await request.text()
    const headersList = await headers()
    const signature = headersList.get('stripe-signature')!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET)
    } catch (err) {
      logger.error('Webhook signature verification failed', err)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    // Validate timestamp to prevent replay attacks (5-minute tolerance)
    const eventTimestamp = event.created // Unix timestamp in seconds
    const currentTimestamp = Math.floor(Date.now() / 1000)
    const timestampDifference = currentTimestamp - eventTimestamp
    const TIMESTAMP_TOLERANCE_SECONDS = 300 // 5 minutes

    if (timestampDifference > TIMESTAMP_TOLERANCE_SECONDS) {
      logger.warn('Webhook timestamp too old, rejecting to prevent replay attack', {
        eventTimestamp,
        currentTimestamp,
        difference: timestampDifference,
      })
      return NextResponse.json({ error: 'Webhook timestamp too old' }, { status: 400 })
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        logger.info('Payment successful', { sessionId: session.id })

        // Check if this is a meditation purchase
        const purchaseType = session.metadata?.type

        if (purchaseType === 'meditation_single' || purchaseType === 'meditation_bundle') {
          // Handle meditation purchase - send confirmation email
          logger.info('Meditation purchase confirmed via webhook', { sessionId: session.id })

          const meditationSlug = session.metadata?.meditationSlug
          const customerEmail = session.customer_details?.email

          if (meditationSlug && customerEmail) {
            const meditation = getMeditationBySlug(meditationSlug)

            if (meditation) {
              try {
                await sendMeditationPurchaseConfirmation({
                  customerEmail,
                  meditationName: meditation.title,
                  meditationSlug: meditation.slug,
                  pricePaid: session.amount_total ? session.amount_total / 100 : meditation.price,
                })
                logger.info('Meditation purchase confirmation email sent', {
                  email: customerEmail,
                  meditation: meditationSlug,
                })
              } catch (emailError) {
                logger.error('Failed to send meditation purchase confirmation email', emailError)
                // Don't throw - email is non-critical
              }
            } else {
              logger.warn('Meditation not found for email confirmation', { meditationSlug })
            }
          } else {
            logger.warn('Missing data for meditation email confirmation', {
              hasSlug: !!meditationSlug,
              hasEmail: !!customerEmail,
            })
          }
        } else {
          // Create order from session data (for physical products)
          await createOrder(session)
        }

        break
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        logger.info('PaymentIntent succeeded', { paymentIntentId: paymentIntent.id })
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        logger.warn('PaymentIntent failed', { paymentIntentId: paymentIntent.id })
        break
      }

      default:
        logger.debug('Unhandled event type', { eventType: event.type })
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    logger.error('Webhook handler error', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

async function createOrder(session: Stripe.Checkout.Session) {
  try {
    // Parse items from session metadata
    const items = JSON.parse(session.metadata?.items || '[]')

    // Get shipping address from session
    // Note: shipping_details is available on Checkout.Session when shipping is collected
    const sessionWithShipping = session as Stripe.Checkout.Session & {
      shipping_details?: {
        address?: StripeShippingAddress | null
        name?: string | null
      } | null
    }
    const shippingAddress: StripeShippingAddress | null =
      sessionWithShipping.shipping_details?.address ||
      session.customer_details?.address ||
      null

    // Create order object
    const order = {
      id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      stripeSessionId: session.id,
      stripePaymentIntent: session.payment_intent as string,
      customerEmail: session.customer_details?.email || '',
      customerName: session.customer_details?.name || '',
      shippingAddress,
      items,
      totalAmount: session.amount_total ? session.amount_total / 100 : 0, // Convert from cents
      currency: session.currency || 'usd',
      status: 'paid',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Save order to file
    const ordersDir = path.join(process.cwd(), 'data', 'orders')
    await mkdir(ordersDir, { recursive: true })

    const orderFile = path.join(ordersDir, `${order.id}.json`)
    await writeFile(orderFile, JSON.stringify(order, null, 2))

    // Also maintain an orders index
    const indexFile = path.join(ordersDir, 'index.json')
    let orders = []
    try {
      const indexContent = await readFile(indexFile, 'utf-8')
      orders = JSON.parse(indexContent)
    } catch {
      // File doesn't exist yet
    }

    orders.unshift({ // Add to beginning (most recent first)
      id: order.id,
      email: order.customerEmail,
      total: order.totalAmount,
      status: order.status,
      createdAt: order.createdAt,
    })

    await writeFile(indexFile, JSON.stringify(orders, null, 2))

    logger.info('Order created', { orderId: order.id })

    // Send confirmation emails
    try {
      await sendOrderConfirmation({
        orderId: order.id,
        customerEmail: order.customerEmail,
        customerName: order.customerName,
        items: order.items,
        totalAmount: order.totalAmount,
        shippingAddress: order.shippingAddress,
      })
      logger.info('Order confirmation email sent to customer')

      await sendAdminNotification({
        orderId: order.id,
        customerEmail: order.customerEmail,
        customerName: order.customerName,
        items: order.items,
        totalAmount: order.totalAmount,
        shippingAddress: order.shippingAddress,
      })
      logger.info('Admin notification email sent')
    } catch (emailError) {
      logger.error('Failed to send emails', emailError)
      // Don't throw - emails are non-critical
    }

    return order
  } catch (error) {
    logger.error('Failed to create order', error)
    throw error
  }
}

