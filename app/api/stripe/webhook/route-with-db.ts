import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { writeFile, readFile, mkdir } from 'fs/promises'
import path from 'path'
import {
  createOrder as createOrderInDb,
  USE_DATABASE,
  isDatabaseAvailable,
} from '@/lib/db/client'
import type { CreateOrderInput } from '@/lib/db/types'
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
      logger.error('Webhook signature verification failed:', err)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        logger.info('Payment successful:', { data: session.id })

        // Create order with fallback mechanism
        await createOrder(session)

        break
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        logger.info('PaymentIntent succeeded:', { data: paymentIntent.id })
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        logger.info('PaymentIntent failed:', { data: paymentIntent.id })
        break
      }

      default:
        logger.debug('Unhandled event type: ${event.type}')
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    logger.error('Webhook handler error:', error)
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

    // Get shipping address (with type assertion for compatibility)
    const shippingAddress = (session as any).shipping_details?.address ||
                           session.customer_details?.address ||
                           null

    // Create order object
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const orderData = {
      id: orderId,
      stripeSessionId: session.id,
      stripePaymentIntent: session.payment_intent as string,
      customerEmail: session.customer_details?.email || '',
      customerName: session.customer_details?.name || '',
      shippingAddress,
      items,
      totalAmount: session.amount_total ? session.amount_total / 100 : 0, // Convert from cents
      currency: session.currency || 'usd',
      status: 'paid' as const,
      printfulStatus: 'pending' as const, // Will be updated when sent to Printful
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Determine storage strategy based on feature flag and database availability
    const shouldUseDatabase = USE_DATABASE && (await isDatabaseAvailable())

    if (shouldUseDatabase) {
      // Store in database
      try {
        logger.info('Storing order in database...')

        const dbInput: CreateOrderInput = {
          stripeSessionId: orderData.stripeSessionId,
          stripePaymentIntent: orderData.stripePaymentIntent,
          customerEmail: orderData.customerEmail,
          customerName: orderData.customerName,
          shippingAddress: orderData.shippingAddress,
          items: orderData.items,
          totalAmount: orderData.totalAmount,
          currency: orderData.currency,
          status: orderData.status,
          printfulStatus: orderData.printfulStatus,
        }

        const dbOrder = await createOrderInDb(dbInput)
        logger.info('Order stored in database:', { data: dbOrder.id })

        // Also save to filesystem as backup during transition
        await saveOrderToFilesystem(orderData)
        logger.info('Backup copy saved to filesystem')

        return dbOrder
      } catch (dbError) {
        logger.error('Database storage failed, falling back to filesystem:', dbError)
        // Fall through to filesystem storage
      }
    }

    // Fallback to filesystem storage
    logger.info('Storing order in filesystem...')
    await saveOrderToFilesystem(orderData)
    logger.info('Order created:', { data: orderData.id })

    // TODO: Send order to Printful for fulfillment
    // await fulfillOrder(orderData)

    return orderData
  } catch (error) {
    logger.error('Failed to create order:', error)
    throw error
  }
}

/**
 * Save order to filesystem (legacy method + backup)
 */
async function saveOrderToFilesystem(order: any) {
  try {
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
  } catch (error) {
    logger.error('Failed to save order to filesystem:', error)
    throw error
  }
}
