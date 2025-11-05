# Stripe Quick Start Guide

**Get your payment system up and running in 30 minutes.**

---

## Overview

This guide will walk you through setting up Stripe payments for the Brandon Mills e-commerce platform from scratch. By the end, you'll have:

- ✅ Stripe account configured
- ✅ Payment processing live
- ✅ Webhooks working
- ✅ Test purchases working
- ✅ Production deployment ready

**Time required:** 30-45 minutes

---

## Step 1: Stripe Account Setup (5 minutes)

### Create Stripe Account

1. Go to https://dashboard.stripe.com/register
2. Sign up with email and password
3. Complete business profile:
   - **Business name:** Brandon Mills
   - **Business type:** Individual
   - **Industry:** E-commerce - Luxury Goods
   - **Website:** https://brandonmills.com

### Get API Keys

1. Navigate to **Developers > API keys**
2. Copy your **Test mode** keys:
   ```
   Publishable key: pk_test_51...
   Secret key: sk_test_51...
   ```

**Note:** We'll use test mode initially. Switch to live mode later.

---

## Step 2: Local Environment Setup (5 minutes)

### Install Dependencies

```bash
cd /Users/brandon/Webdesigner
npm install stripe @stripe/stripe-js
```

### Configure Environment Variables

Create `.env.local`:

```env
# Stripe API Keys (Test Mode)
STRIPE_SECRET_KEY=sk_test_51...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51...

# Application URLs
NEXT_PUBLIC_URL=http://localhost:3000

# Webhook Secret (we'll add this later)
STRIPE_WEBHOOK_SECRET=
```

### Verify API Key

Test your configuration:

```bash
node scripts/stripe/test-checkout.js
```

You should see:
```
✓ API key is valid
✓ Running in TEST mode
```

---

## Step 3: Implement Checkout (10 minutes)

### Create Stripe Client

Already created at `lib/stripe.ts`:

```typescript
import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
  typescript: true,
});
```

### Create Checkout API Route

Create `app/api/stripe/checkout/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    const { items, customerEmail } = await request.json();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map((item: any) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            images: [item.image],
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_URL}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/cart`,
      customer_email: customerEmail,
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
```

### Update Cart Component

In your existing `components/cart-sidebar-enhanced.tsx`, add checkout handler:

```typescript
const handleCheckout = async () => {
  setIsLoading(true);

  try {
    const response = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        customerEmail: user?.email,
      }),
    });

    const { url } = await response.json();

    if (url) {
      window.location.href = url; // Redirect to Stripe Checkout
    }
  } catch (error) {
    console.error('Checkout error:', error);
  } finally {
    setIsLoading(false);
  }
};
```

---

## Step 4: Set Up Webhooks (10 minutes)

### Install Stripe CLI

```bash
# macOS
brew install stripe/stripe-cli/stripe

# Login
stripe login
```

### Create Webhook Handler

Create `app/api/stripe/webhook/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook error:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session;
      console.log('Payment successful:', session.id);
      // TODO: Fulfill order, send confirmation email
      break;

    case 'payment_intent.payment_failed':
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log('Payment failed:', paymentIntent.id);
      // TODO: Notify customer
      break;
  }

  return NextResponse.json({ received: true });
}
```

### Start Local Webhook Forwarding

In a separate terminal:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Copy the webhook signing secret (starts with `whsec_`) and add to `.env.local`:

```env
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Verify Webhooks

```bash
node scripts/stripe/verify-webhook.js
```

---

## Step 5: Test Payment Flow (5 minutes)

### Start Development Server

```bash
npm run dev
```

### Run Test Checkout

```bash
node scripts/stripe/test-checkout.js
```

Follow the prompts:
1. Script creates test customer
2. Generates checkout URL
3. Open URL in browser
4. Use test card: **4242 4242 4242 4242**
5. Expiry: Any future date (e.g., 12/34)
6. CVC: Any 3 digits (e.g., 123)
7. Complete payment

### Verify Success

1. Check terminal for webhook event
2. View payment in Stripe Dashboard
3. Verify order success page displays

---

## Step 6: Production Deployment (5 minutes)

### Configure Live Mode

1. Go to Stripe Dashboard
2. Switch to **Live mode** (toggle in top left)
3. Go to **Developers > API keys**
4. Copy live keys

### Update Vercel Environment Variables

```bash
vercel env add STRIPE_SECRET_KEY
# Paste: sk_live_...

vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
# Paste: pk_live_...

vercel env add STRIPE_WEBHOOK_SECRET
# We'll add this after webhook setup
```

### Configure Production Webhook

1. Go to **Developers > Webhooks**
2. Click **Add endpoint**
3. Enter endpoint URL: `https://brandonmills.com/api/stripe/webhook`
4. Select events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`
   - `charge.dispute.created`
5. Click **Add endpoint**
6. Copy **Signing secret** (whsec_...)
7. Add to Vercel:
   ```bash
   vercel env add STRIPE_WEBHOOK_SECRET
   # Paste: whsec_...
   ```

### Deploy

```bash
vercel --prod
```

### Verify Production Setup

```bash
node scripts/stripe/verify-webhook.js --url https://brandonmills.com/api/stripe/webhook
```

---

## Post-Launch Checklist

After going live, verify:

- [ ] Test purchase completes successfully
- [ ] Confirmation email sent (if implemented)
- [ ] Webhook events received
- [ ] Order recorded in database
- [ ] Receipt email sent by Stripe
- [ ] Refund process works
- [ ] Dispute handling configured

---

## Quick Reference

### Test Cards

```
Success:          4242 4242 4242 4242
Declined:         4000 0000 0000 9995
3D Secure:        4000 0025 0000 3155
Insufficient:     4000 0000 0000 9995
```

### Useful Commands

```bash
# Test checkout
node scripts/stripe/test-checkout.js

# Verify webhooks
node scripts/stripe/verify-webhook.js

# Process refund
node scripts/stripe/refund-order.js --charge ch_...

# Export transactions
node scripts/stripe/export-transactions.js --days 30

# Check disputes
node scripts/stripe/check-disputes.js --urgent
```

### Important URLs

- **Dashboard:** https://dashboard.stripe.com
- **Test Cards:** https://stripe.com/docs/testing
- **API Docs:** https://stripe.com/docs/api
- **Status:** https://status.stripe.com

---

## Troubleshooting

### "API key is invalid"

Check `.env.local` has correct keys:
```bash
cat .env.local | grep STRIPE
```

### "Webhook signature verification failed"

Ensure you're using correct webhook secret:
- **Local:** From `stripe listen` output
- **Production:** From Stripe Dashboard webhook settings

### "Payment failed"

Check:
1. Using test card (4242 4242 4242 4242)
2. API key mode matches (test/live)
3. Amount is valid (> $0.50)

### "Checkout redirects to blank page"

Verify:
1. `success_url` is correct
2. Success page exists
3. Session ID parameter is passed

---

## Next Steps

Now that your basic payment system is working:

1. **Read:** [BEST-PRACTICES.md](./BEST-PRACTICES.md) for optimization
2. **Review:** [API-REFERENCE.md](./API-REFERENCE.md) for advanced features
3. **Implement:** Order fulfillment workflow
4. **Set up:** Customer portal for subscription management
5. **Enable:** Stripe Tax for automatic tax calculation
6. **Configure:** Radar rules for fraud prevention
7. **Add:** Additional payment methods (Apple Pay, etc.)

---

## Support

Need help?

- **Documentation:** [docs/stripe/](../stripe/)
- **Scripts:** [scripts/stripe/README.md](../../scripts/stripe/README.md)
- **Stripe Support:** support@stripe.com
- **Status Page:** https://status.stripe.com

---

**Congratulations!** Your payment system is live. 🎉

**Time to first payment:** ~30 minutes
**Security:** PCI compliant
**Scalability:** Ready for millions in transactions

Focus on building your business—Stripe handles the payments.