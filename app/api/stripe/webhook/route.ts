import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { writeFile, readFile, mkdir } from 'fs/promises'
import path from 'path'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-10-29.clover',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: Request) {
  try {
    const body = await request.text()
    const headersList = await headers()
    const signature = headersList.get('stripe-signature')!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('❌ Webhook signature verification failed:', err)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        console.log('💰 Payment successful:', session.id)

        // Create order from session data
        await createOrder(session)

        break
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log('✅ PaymentIntent succeeded:', paymentIntent.id)
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log('❌ PaymentIntent failed:', paymentIntent.id)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('❌ Webhook handler error:', error)
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

    // Create order object
    const order = {
      id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      stripeSessionId: session.id,
      stripePaymentIntent: session.payment_intent as string,
      customerEmail: session.customer_details?.email || '',
      customerName: session.customer_details?.name || '',
      shippingAddress: session.shipping_details?.address || null,
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

    console.log('✅ Order created:', order.id)

    // TODO: Send order to Printful for fulfillment
    // await fulfillOrder(order)

    return order
  } catch (error) {
    console.error('❌ Failed to create order:', error)
    throw error
  }
}
