# Stripe Integration Guide

## Complete Setup Walkthrough for Brandon Mills E-Commerce Platform

**Version:** 1.0.0
**Last Updated:** 2025-11-05
**Estimated Setup Time:** 2-3 hours

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Stripe Account Setup](#stripe-account-setup)
3. [API Key Configuration](#api-key-configuration)
4. [Installation & Dependencies](#installation--dependencies)
5. [Checkout Session Implementation](#checkout-session-implementation)
6. [Webhook Configuration](#webhook-configuration)
7. [Payment Intent Flow](#payment-intent-flow)
8. [Testing](#testing)
9. [Production Deployment](#production-deployment)
10. [Post-Launch Monitoring](#post-launch-monitoring)

---

## Prerequisites

Before starting, ensure you have:

- [ ] Stripe account (sign up at https://dashboard.stripe.com/register)
- [ ] Next.js 14+ application
- [ ] Node.js 18+ installed
- [ ] Vercel account for deployment
- [ ] SSL certificate (automatic with Vercel)
- [ ] Business information for Stripe verification

---

## Stripe Account Setup

### Step 1: Create Stripe Account

1. Go to https://dashboard.stripe.com/register
2. Enter business email and create password
3. Complete business profile:
   - Business name: Brandon Mills
   - Business type: Individual/Sole Proprietorship
   - Industry: E-commerce - Luxury Goods
   - Website: https://brandonmills.com

### Step 2: Activate Account

1. Navigate to Settings > Account
2. Complete "Activate your account" steps:
   - Business details
   - Bank account information
   - Identity verification
   - Tax information (EIN or SSN)

**Timeline:** Account activation takes 1-2 business days

### Step 3: Configure Payment Methods

1. Go to Settings > Payment methods
2. Enable payment methods:
   - ✅ Cards (Visa, Mastercard, Amex)
   - ✅ Digital wallets (Apple Pay, Google Pay)
   - ✅ Link (recommended)
   - ⚪ ACH Direct Debit (optional)
   - ⚪ Affirm (optional, for financing)

### Step 4: Set Up Radar (Fraud Prevention)

1. Navigate to Radar > Rules
2. Review default fraud rules
3. Enable recommended protections:
   - ✅ Block payments if CVC check fails
   - ✅ Block payments if postal code check fails
   - ✅ Block high-risk cards
   - ✅ Velocity checks for repeat customers

---

## API Key Configuration

### Step 1: Retrieve API Keys

1. Go to Developers > API keys
2. Copy your keys:

**Test Mode:**
```
Publishable key: pk_test_51...
Secret key: sk_test_51...
```

**Live Mode:**
```
Publishable key: pk_live_51...
Secret key: sk_live_51...
```

### Step 2: Store in Environment Variables

Create `.env.local` in project root:

```env
# Stripe API Keys (Test Mode)
STRIPE_SECRET_KEY=sk_test_51...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51...

# Stripe Webhooks
STRIPE_WEBHOOK_SECRET=whsec_...

# Application URLs
NEXT_PUBLIC_URL=http://localhost:3000
STRIPE_SUCCESS_URL=http://localhost:3000/order/success
STRIPE_CANCEL_URL=http://localhost:3000/cart

# Optional Configuration
STRIPE_CURRENCY=usd
STRIPE_COUNTRY=US
STRIPE_TAX_ENABLED=true
```

**Production `.env.production`:**
```env
STRIPE_SECRET_KEY=sk_live_51...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_51...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_URL=https://brandonmills.com
```

### Step 3: Configure Vercel Environment Variables

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Add environment variables
vercel env add STRIPE_SECRET_KEY
vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
vercel env add STRIPE_WEBHOOK_SECRET
```

---

## Installation & Dependencies

### Step 1: Install Stripe SDK

```bash
npm install stripe @stripe/stripe-js
```

### Step 2: Create Stripe Client

Create `lib/stripe.ts`:

```typescript
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-11-20.acacia',
  typescript: true,
  appInfo: {
    name: 'Brandon Mills E-Commerce',
    version: '1.0.0',
    url: 'https://brandonmills.com',
  },
});
```

### Step 3: Create Stripe Client Loader

Create `lib/stripe-client.ts`:

```typescript
import { loadStripe, Stripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null>;

export const getStripeClient = () => {
  if (!stripePromise) {
    if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
      throw new Error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set');
    }
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
};
```

---

## Checkout Session Implementation

### Step 1: Create Checkout API Route

Create `app/api/stripe/checkout/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    const { items, customerEmail, metadata } = await request.json();

    // Validate items
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      );
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map((item) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            description: item.description,
            images: [item.image],
            metadata: {
              product_id: item.id,
              sku: item.sku,
            },
          },
          unit_amount: Math.round(item.price * 100), // Convert to cents
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_URL}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/cart`,
      customer_email: customerEmail,
      metadata: {
        ...metadata,
        platform: 'web',
        version: '1.0',
      },
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'AU', 'NZ', 'FR', 'DE', 'IT', 'ES'],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 0,
              currency: 'usd',
            },
            display_name: 'Free shipping',
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 5,
              },
              maximum: {
                unit: 'business_day',
                value: 7,
              },
            },
          },
        },
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 1500,
              currency: 'usd',
            },
            display_name: 'Express shipping',
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 1,
              },
              maximum: {
                unit: 'business_day',
                value: 3,
              },
            },
          },
        },
      ],
      automatic_tax: {
        enabled: true,
      },
      billing_address_collection: 'required',
      phone_number_collection: {
        enabled: true,
      },
    });

    return NextResponse.json({
      sessionId: session.id,
      url: session.url
    });

  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
```

### Step 2: Create Checkout Component

Create `components/checkout/stripe-checkout.tsx`:

```typescript
'use client';

import { useState } from 'react';
import { getStripeClient } from '@/lib/stripe-client';
import { useCart } from '@/hooks/use-cart';

export function StripeCheckout({ userEmail }: { userEmail?: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { items } = useCart();

  const handleCheckout = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Create checkout session
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: items.map((item) => ({
            id: item.id,
            name: item.name,
            description: item.description,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
            sku: item.sku,
          })),
          customerEmail: userEmail,
          metadata: {
            source: 'cart',
            timestamp: new Date().toISOString(),
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { sessionId } = await response.json();

      // Redirect to Stripe Checkout
      const stripe = await getStripeClient();
      if (!stripe) {
        throw new Error('Stripe failed to load');
      }

      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId,
      });

      if (stripeError) {
        throw stripeError;
      }

    } catch (err) {
      console.error('Checkout error:', err);
      setError(err instanceof Error ? err.message : 'Checkout failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleCheckout}
        disabled={isLoading || items.length === 0}
        className="w-full bg-black text-white py-3 px-6 font-medium hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'Processing...' : 'Proceed to Checkout'}
      </button>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}
    </div>
  );
}
```

### Step 3: Create Success Page

Create `app/order/success/page.tsx`:

```typescript
import { stripe } from '@/lib/stripe';
import { redirect } from 'next/navigation';

interface Props {
  searchParams: {
    session_id?: string;
  };
}

export default async function OrderSuccessPage({ searchParams }: Props) {
  const sessionId = searchParams.session_id;

  if (!sessionId) {
    redirect('/');
  }

  // Retrieve checkout session
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['line_items', 'customer'],
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white p-8 shadow-sm">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-serif mb-2">Order Confirmed!</h1>
            <p className="text-gray-600">Thank you for your purchase</p>
          </div>

          <div className="border-t border-b py-6 mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Order Number:</span>
              <span className="font-medium">{session.id.slice(-8).toUpperCase()}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Email:</span>
              <span className="font-medium">{session.customer_details?.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total:</span>
              <span className="font-medium">${(session.amount_total! / 100).toFixed(2)}</span>
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-6">
            A confirmation email has been sent to {session.customer_details?.email}.
            You will receive shipping updates as your order is processed.
          </p>

          <a
            href="/"
            className="block text-center bg-black text-white py-3 px-6 hover:bg-gray-800 transition-colors"
          >
            Continue Shopping
          </a>
        </div>
      </div>
    </div>
  );
}
```

---

## Webhook Configuration

### Step 1: Create Webhook Handler

Create `app/api/stripe/webhook/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import Stripe from 'stripe';

// Disable body parsing for webhook
export const runtime = 'nodejs';

async function getRawBody(request: NextRequest): Promise<string> {
  const reader = request.body?.getReader();
  const decoder = new TextDecoder();
  let result = '';

  if (!reader) {
    return '';
  }

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    result += decoder.decode(value, { stream: true });
  }

  return result;
}

export async function POST(request: NextRequest) {
  const body = await getRawBody(request);
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature found' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }

  // Handle events
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutComplete(event.data.object as Stripe.Checkout.Session);
        break;

      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event.data.object as Stripe.PaymentIntent);
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
        break;

      case 'charge.refunded':
        await handleRefund(event.data.object as Stripe.Charge);
        break;

      case 'charge.dispute.created':
        await handleDispute(event.data.object as Stripe.Dispute);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (err) {
    console.error('Webhook handler error:', err);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  console.log('Checkout completed:', session.id);

  // TODO: Update database with order
  // TODO: Send confirmation email
  // TODO: Trigger fulfillment process

  const lineItems = await stripe.checkout.sessions.listLineItems(session.id);

  // Example: Save order to database
  // await db.order.create({
  //   stripeSessionId: session.id,
  //   customerEmail: session.customer_details?.email,
  //   amount: session.amount_total,
  //   status: 'paid',
  //   items: lineItems.data,
  // });
}

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  console.log('Payment succeeded:', paymentIntent.id);

  // TODO: Update order status
  // TODO: Send receipt email
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log('Payment failed:', paymentIntent.id);

  // TODO: Notify customer
  // TODO: Log for retry
}

async function handleRefund(charge: Stripe.Charge) {
  console.log('Charge refunded:', charge.id);

  // TODO: Update order status
  // TODO: Send refund confirmation
}

async function handleDispute(dispute: Stripe.Dispute) {
  console.log('Dispute created:', dispute.id);

  // TODO: Alert admin
  // TODO: Gather evidence
}
```

### Step 2: Set Up Webhook Endpoint in Stripe Dashboard

1. Go to Developers > Webhooks
2. Click "Add endpoint"
3. Enter endpoint URL:
   - Test: `http://localhost:3000/api/stripe/webhook` (using Stripe CLI)
   - Production: `https://brandonmills.com/api/stripe/webhook`
4. Select events to listen to:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`
   - `charge.dispute.created`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Click "Add endpoint"
6. Copy webhook signing secret (starts with `whsec_`)
7. Add to environment variables as `STRIPE_WEBHOOK_SECRET`

### Step 3: Test Webhooks Locally with Stripe CLI

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/stripe/webhook

# In another terminal, trigger test events
stripe trigger checkout.session.completed
stripe trigger payment_intent.succeeded
stripe trigger payment_intent.payment_failed
```

---

## Payment Intent Flow

For custom payment flows (not using Checkout):

### Create Payment Intent API

Create `app/api/stripe/payment-intent/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    const { amount, currency = 'usd', metadata } = await request.json();

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata,
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });

  } catch (error) {
    console.error('Payment intent error:', error);
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}
```

---

## Testing

### Test Mode Checklist

- [ ] Create checkout session with test card
- [ ] Complete successful payment (4242 4242 4242 4242)
- [ ] Test declined card (4000 0000 0000 9995)
- [ ] Test 3D Secure authentication (4000 0025 0000 3155)
- [ ] Verify webhook events are received
- [ ] Check order confirmation email
- [ ] Test refund processing
- [ ] Verify tax calculation (if enabled)

### Stripe CLI Testing

```bash
# Listen for webhooks
stripe listen --forward-to localhost:3000/api/stripe/webhook

# Trigger test events
stripe trigger checkout.session.completed
stripe trigger payment_intent.succeeded
stripe trigger charge.refunded

# View recent events
stripe events list --limit 10

# View logs
stripe logs tail
```

---

## Production Deployment

### Pre-Launch Checklist

- [ ] Switch to live API keys
- [ ] Update webhook endpoint to production URL
- [ ] Enable automatic tax (if required)
- [ ] Configure Radar fraud rules
- [ ] Set up email notifications
- [ ] Test with small real transaction
- [ ] Document support procedures
- [ ] Train customer service team
- [ ] Set up monitoring alerts

### Vercel Deployment

```bash
# Deploy to production
vercel --prod

# Verify environment variables
vercel env ls

# Check deployment logs
vercel logs
```

### Post-Deployment Verification

1. Complete a real test purchase (small amount)
2. Verify webhook events are received
3. Check confirmation emails are sent
4. Test refund process
5. Monitor Stripe dashboard for errors

---

## Post-Launch Monitoring

### Daily Checks
- Payment success rate
- Failed payments review
- Webhook delivery rate
- Dispute notifications

### Weekly Reviews
- Revenue trends
- Popular payment methods
- Geographic distribution
- Cart abandonment rate

### Monthly Audits
- PCI compliance status
- Fraud rule effectiveness
- Refund rate analysis
- Customer feedback review

---

## Next Steps

After completing this guide:

1. Review [BEST-PRACTICES.md](./BEST-PRACTICES.md) for optimization
2. Check [API-REFERENCE.md](./API-REFERENCE.md) for detailed API documentation
3. Keep [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) handy for issues
4. Set up subscription billing (if needed)
5. Implement customer portal
6. Configure advanced Radar rules
7. Enable Stripe Tax for automatic calculation

---

## Support Resources

- Stripe Dashboard: https://dashboard.stripe.com
- API Documentation: https://stripe.com/docs/api
- Support: https://support.stripe.com
- Status Page: https://status.stripe.com
- Community: https://stripe.com/community

---

**Integration Complete!** Your payment system is now ready to process secure transactions. 🎉