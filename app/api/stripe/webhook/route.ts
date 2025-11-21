import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { writeFile, readFile, mkdir } from 'fs/promises'
import path from 'path'
import { printfulClient } from '@/lib/printful-client'
import { sendOrderConfirmation, sendAdminNotification, sendMeditationPurchaseConfirmation } from '@/lib/email'
import { getMeditationBySlug } from '@/lib/meditations-data'
import { LocalOrder, CartItem, StripeShippingAddress, PrintfulOrderItem } from '@/types/common'
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
      printfulStatus: 'pending', // Will be updated when sent to Printful
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

    // Send order to Printful for fulfillment
    try {
      await fulfillOrder(order)
      logger.info('Order sent to Printful for fulfillment')
    } catch (fulfillError) {
      logger.error('Failed to send order to Printful', fulfillError)
      // Don't throw - order is still saved, we can retry fulfillment manually
    }

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

async function fulfillOrder(order: LocalOrder) {
  try {
    logger.info('Preparing Printful order', { orderId: order.id })

    // Parse address from Stripe format to Printful format
    const shippingAddress = order.shippingAddress
    if (!shippingAddress) {
      throw new Error('No shipping address provided')
    }

    // Build Printful order items from cart items
    const orderItems: PrintfulOrderItem[] = order.items.map((item: CartItem) => {
      // For catalog products (no custom designs), we just need variant ID
      // If you add custom designs later, you'll need to include file URLs
      return {
        source: 'catalog' as const,
        catalog_variant_id: item.variantId,
        quantity: item.quantity,
        retail_price: item.price,
        // If you have designs for this item, add placements:
        // placements: [{
        //   placement: 'default',
        //   technique: 'SUBLIMATION',
        //   layers: [{ type: 'file', url: item.designUrl }]
        // }]
      }
    })

    // Create Printful order
    const printfulOrder = await printfulClient.createOrder({
      external_id: order.id,
      shipping: 'STANDARD', // or get from order metadata
      recipient: {
        name: order.customerName || 'Customer',
        address1: shippingAddress.line1 || '',
        city: shippingAddress.city || '',
        state_code: shippingAddress.state || undefined,
        country_code: shippingAddress.country || 'US',
        zip: shippingAddress.postal_code || '',
        email: order.customerEmail,
        phone: shippingAddress.phone || undefined,
      },
      order_items: orderItems as any,
      retail_costs: {
        currency: order.currency.toUpperCase(),
        subtotal: order.totalAmount.toFixed(2),
        shipping: '0.00', // Already included in Stripe
        tax: '0.00',
        total: order.totalAmount.toFixed(2),
      },
    })

    logger.info('Printful order created', { printfulOrderId: printfulOrder.id })

    // Confirm the order for fulfillment (this sends it to production)
    const confirmedOrder = await printfulClient.confirmOrder(printfulOrder.id)
    logger.info('Printful order confirmed for fulfillment', { confirmedOrderId: confirmedOrder.id })

    // Update our local order with Printful ID
    order.printfulOrderId = printfulOrder.id
    order.printfulStatus = confirmedOrder.status
    order.updatedAt = new Date().toISOString()

    // Save updated order
    const ordersDir = path.join(process.cwd(), 'data', 'orders')
    const orderFile = path.join(ordersDir, `${order.id}.json`)
    await writeFile(orderFile, JSON.stringify(order, null, 2))

    return printfulOrder
  } catch (error) {
    logger.error('Printful fulfillment failed', error)
    throw error
  }
}
