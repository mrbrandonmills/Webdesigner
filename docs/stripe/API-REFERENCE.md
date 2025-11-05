# Stripe API Reference

## Complete API Documentation for Brandon Mills E-Commerce

**Version:** 1.0.0
**Stripe API Version:** 2024-11-20.acacia
**Last Updated:** 2025-11-05

---

## Table of Contents

1. [Checkout Sessions API](#checkout-sessions-api)
2. [Payment Intents API](#payment-intents-api)
3. [Webhooks & Events](#webhooks--events)
4. [Customer Management](#customer-management)
5. [Refunds API](#refunds-api)
6. [Dispute Handling](#dispute-handling)
7. [Subscriptions API](#subscriptions-api)
8. [Products & Prices](#products--prices)

---

## Checkout Sessions API

### Create Checkout Session

**Endpoint:** `POST /v1/checkout/sessions`

Creates a Stripe Hosted Checkout session for one-time or subscription payments.

**Example Implementation:**

```typescript
// app/api/stripe/checkout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const session: Stripe.Checkout.Session = await stripe.checkout.sessions.create({
      // Payment configuration
      payment_method_types: ['card', 'link'],
      mode: 'payment', // or 'subscription' or 'setup'

      // Line items
      line_items: body.items.map((item: any) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            description: item.description,
            images: [item.image],
            metadata: {
              product_id: item.id,
              sku: item.sku,
              category: item.category,
            },
          },
          unit_amount: Math.round(item.price * 100), // Amount in cents
        },
        quantity: item.quantity,
        adjustable_quantity: {
          enabled: true,
          minimum: 1,
          maximum: 10,
        },
      })),

      // Customer information
      customer_email: body.customerEmail,
      customer: body.customerId, // If existing customer

      // URLs
      success_url: `${process.env.NEXT_PUBLIC_URL}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/cart`,

      // Shipping
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'AU', 'NZ', 'FR', 'DE', 'IT', 'ES', 'NL', 'BE'],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 0,
              currency: 'usd',
            },
            display_name: 'Free Shipping',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 5 },
              maximum: { unit: 'business_day', value: 7 },
            },
          },
        },
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 1500, // $15.00
              currency: 'usd',
            },
            display_name: 'Express Shipping',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 1 },
              maximum: { unit: 'business_day', value: 3 },
            },
          },
        },
      ],

      // Tax
      automatic_tax: {
        enabled: true,
      },

      // Billing
      billing_address_collection: 'required',

      // Phone
      phone_number_collection: {
        enabled: true,
      },

      // Discounts
      allow_promotion_codes: true,

      // Metadata (for tracking)
      metadata: {
        order_id: body.orderId,
        customer_email: body.customerEmail,
        source: 'web',
        ...body.metadata,
      },

      // Payment intent data
      payment_intent_data: {
        metadata: {
          order_id: body.orderId,
        },
        description: `Order #${body.orderId}`,
        receipt_email: body.customerEmail,
      },

      // Expires after 24 hours
      expires_at: Math.floor(Date.now() / 1000) + (24 * 60 * 60),
    });

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });

  } catch (error) {
    console.error('Checkout session creation error:', error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to create checkout session',
      },
      { status: 500 }
    );
  }
}
```

**Response:**
```json
{
  "sessionId": "cs_test_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0",
  "url": "https://checkout.stripe.com/c/pay/cs_test_..."
}
```

### Retrieve Checkout Session

**Endpoint:** `GET /v1/checkout/sessions/:id`

```typescript
// app/order/success/page.tsx
import { stripe } from '@/lib/stripe';

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
  if (!searchParams.session_id) {
    redirect('/');
  }

  const session = await stripe.checkout.sessions.retrieve(
    searchParams.session_id,
    {
      expand: ['line_items', 'customer', 'payment_intent'],
    }
  );

  return (
    <div>
      <h1>Order Confirmed!</h1>
      <p>Order ID: {session.id}</p>
      <p>Total: ${(session.amount_total! / 100).toFixed(2)}</p>
      <p>Email: {session.customer_details?.email}</p>
    </div>
  );
}
```

### List Checkout Sessions

```typescript
// Get recent checkout sessions
const sessions = await stripe.checkout.sessions.list({
  limit: 100,
  created: {
    gte: Math.floor(Date.now() / 1000) - (30 * 24 * 60 * 60), // Last 30 days
  },
});
```

---

## Payment Intents API

For custom payment flows (alternative to Checkout Sessions).

### Create Payment Intent

**Endpoint:** `POST /v1/payment_intents`

```typescript
// app/api/stripe/payment-intent/route.ts
export async function POST(request: NextRequest) {
  const { amount, currency = 'usd', metadata } = await request.json();

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency,

    // Automatic payment methods
    automatic_payment_methods: {
      enabled: true,
    },

    // Or specific payment methods
    // payment_method_types: ['card', 'us_bank_account'],

    // Customer
    customer: metadata?.customerId,

    // Description
    description: metadata?.description || 'Purchase from Brandon Mills',

    // Receipt email
    receipt_email: metadata?.email,

    // Shipping
    shipping: metadata?.shipping ? {
      name: metadata.shipping.name,
      address: {
        line1: metadata.shipping.address.line1,
        line2: metadata.shipping.address.line2,
        city: metadata.shipping.address.city,
        state: metadata.shipping.address.state,
        postal_code: metadata.shipping.address.postal_code,
        country: metadata.shipping.address.country,
      },
    } : undefined,

    // Metadata
    metadata: {
      order_id: metadata?.orderId,
      ...metadata,
    },

    // Capture method
    capture_method: 'automatic', // or 'manual' for delayed capture

    // Setup future usage
    setup_future_usage: 'off_session', // Save for future payments
  });

  return NextResponse.json({
    clientSecret: paymentIntent.client_secret,
  });
}
```

### Confirm Payment Intent

```typescript
// Client-side confirmation
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

function PaymentForm({ clientSecret }: { clientSecret: string }) {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: elements.getElement(CardElement)!,
          billing_details: {
            name: 'Customer Name',
            email: 'customer@example.com',
            address: {
              line1: '123 Main St',
              city: 'San Francisco',
              state: 'CA',
              postal_code: '94111',
              country: 'US',
            },
          },
        },
        return_url: `${window.location.origin}/payment/complete`,
      }
    );

    if (error) {
      console.error(error);
    } else if (paymentIntent?.status === 'succeeded') {
      // Payment successful
      window.location.href = '/order/success';
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" disabled={!stripe}>
        Pay
      </button>
    </form>
  );
}
```

### Retrieve Payment Intent

```typescript
const paymentIntent = await stripe.paymentIntents.retrieve('pi_1ABC2DEF3GHI4JKL');

console.log({
  status: paymentIntent.status, // 'succeeded', 'processing', 'requires_payment_method', etc.
  amount: paymentIntent.amount,
  currency: paymentIntent.currency,
  customer: paymentIntent.customer,
});
```

### Update Payment Intent

```typescript
const paymentIntent = await stripe.paymentIntents.update('pi_1ABC2DEF3GHI4JKL', {
  metadata: {
    updated_field: 'new_value',
  },
});
```

### Cancel Payment Intent

```typescript
const paymentIntent = await stripe.paymentIntents.cancel('pi_1ABC2DEF3GHI4JKL', {
  cancellation_reason: 'requested_by_customer',
});
```

---

## Webhooks & Events

### Webhook Event Handler

**Endpoint:** `POST /api/stripe/webhook`

```typescript
// app/api/stripe/webhook/route.ts
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
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // Handle events
  try {
    switch (event.type) {
      // Checkout completed
      case 'checkout.session.completed':
        await handleCheckoutComplete(event.data.object as Stripe.Checkout.Session);
        break;

      // Payment succeeded
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event.data.object as Stripe.PaymentIntent);
        break;

      // Payment failed
      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
        break;

      // Charge succeeded
      case 'charge.succeeded':
        await handleChargeSuccess(event.data.object as Stripe.Charge);
        break;

      // Charge failed
      case 'charge.failed':
        await handleChargeFailed(event.data.object as Stripe.Charge);
        break;

      // Refund created
      case 'charge.refunded':
        await handleRefund(event.data.object as Stripe.Charge);
        break;

      // Dispute created
      case 'charge.dispute.created':
        await handleDisputeCreated(event.data.object as Stripe.Dispute);
        break;

      // Dispute closed
      case 'charge.dispute.closed':
        await handleDisputeClosed(event.data.object as Stripe.Dispute);
        break;

      // Customer created
      case 'customer.created':
        await handleCustomerCreated(event.data.object as Stripe.Customer);
        break;

      // Customer updated
      case 'customer.updated':
        await handleCustomerUpdated(event.data.object as Stripe.Customer);
        break;

      // Subscription created
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;

      // Subscription updated
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      // Subscription deleted
      case 'customer.subscription.deleted':
        await handleSubscriptionCanceled(event.data.object as Stripe.Subscription);
        break;

      // Invoice paid
      case 'invoice.paid':
        await handleInvoicePaid(event.data.object as Stripe.Invoice);
        break;

      // Invoice payment failed
      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (err) {
    console.error('Webhook processing error:', err);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

// Event handlers
async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  console.log('Checkout completed:', session.id);

  // Get line items
  const lineItems = await stripe.checkout.sessions.listLineItems(session.id);

  // Update database
  // await db.order.create({
  //   stripeSessionId: session.id,
  //   customerEmail: session.customer_details?.email,
  //   amount: session.amount_total,
  //   status: 'paid',
  //   items: lineItems.data,
  // });

  // Send confirmation email
  // await sendOrderConfirmation(session);
}

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  console.log('Payment succeeded:', paymentIntent.id);

  // Update order status
  // await db.order.update({
  //   where: { paymentIntentId: paymentIntent.id },
  //   data: { status: 'paid' },
  // });
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log('Payment failed:', paymentIntent.id);

  // Notify customer
  // await sendPaymentFailedEmail(paymentIntent);

  // Log for retry
  // await db.failedPayment.create({
  //   paymentIntentId: paymentIntent.id,
  //   reason: paymentIntent.last_payment_error?.message,
  // });
}

async function handleRefund(charge: Stripe.Charge) {
  console.log('Charge refunded:', charge.id);

  // Update order status
  // await db.order.update({
  //   where: { chargeId: charge.id },
  //   data: { status: 'refunded' },
  // });

  // Send refund confirmation
  // await sendRefundConfirmation(charge);
}

async function handleDisputeCreated(dispute: Stripe.Dispute) {
  console.log('Dispute created:', dispute.id);

  // Alert admin immediately
  // await sendAdminAlert('dispute_created', dispute);

  // Start evidence gathering
  // await gatherDisputeEvidence(dispute);
}
```

### Common Event Types

| Event Type | Description | When to Use |
|------------|-------------|-------------|
| `checkout.session.completed` | Checkout session completed | Fulfill order, send confirmation |
| `payment_intent.succeeded` | Payment confirmed | Update order status |
| `payment_intent.payment_failed` | Payment failed | Notify customer, retry |
| `charge.succeeded` | Charge created | Log transaction |
| `charge.refunded` | Refund processed | Update order, notify customer |
| `charge.dispute.created` | Customer disputed charge | Gather evidence, alert admin |
| `customer.subscription.created` | New subscription | Provision access |
| `customer.subscription.updated` | Subscription changed | Update access level |
| `customer.subscription.deleted` | Subscription canceled | Revoke access |
| `invoice.paid` | Subscription invoice paid | Extend access |
| `invoice.payment_failed` | Subscription payment failed | Notify customer, retry |

---

## Customer Management

### Create Customer

```typescript
const customer = await stripe.customers.create({
  email: 'customer@example.com',
  name: 'John Doe',
  description: 'Loyal customer',
  metadata: {
    user_id: 'user_123',
    signup_date: new Date().toISOString(),
  },
  address: {
    line1: '123 Main St',
    city: 'San Francisco',
    state: 'CA',
    postal_code: '94111',
    country: 'US',
  },
  phone: '+14155551234',
});
```

### Retrieve Customer

```typescript
const customer = await stripe.customers.retrieve('cus_ABC123', {
  expand: ['subscriptions', 'default_source'],
});

console.log({
  email: customer.email,
  name: customer.name,
  balance: customer.balance,
  subscriptions: customer.subscriptions?.data,
});
```

### Update Customer

```typescript
const customer = await stripe.customers.update('cus_ABC123', {
  email: 'newemail@example.com',
  metadata: {
    vip: 'true',
    lifetime_value: '5000',
  },
});
```

### Delete Customer

```typescript
const deleted = await stripe.customers.del('cus_ABC123');
console.log(deleted.deleted); // true
```

### List Customers

```typescript
const customers = await stripe.customers.list({
  limit: 100,
  email: 'customer@example.com', // Filter by email
  created: {
    gte: Math.floor(Date.now() / 1000) - (30 * 24 * 60 * 60), // Last 30 days
  },
});
```

### Attach Payment Method

```typescript
const paymentMethod = await stripe.paymentMethods.attach('pm_ABC123', {
  customer: 'cus_ABC123',
});

// Set as default
await stripe.customers.update('cus_ABC123', {
  invoice_settings: {
    default_payment_method: 'pm_ABC123',
  },
});
```

---

## Refunds API

### Create Refund

```typescript
// Full refund
const refund = await stripe.refunds.create({
  charge: 'ch_ABC123',
  reason: 'requested_by_customer', // or 'duplicate', 'fraudulent'
  metadata: {
    refund_reason: 'Customer not satisfied',
    processed_by: 'admin_user_id',
  },
});

// Partial refund
const partialRefund = await stripe.refunds.create({
  charge: 'ch_ABC123',
  amount: 500, // $5.00 (in cents)
  reason: 'requested_by_customer',
});

// Refund with reversed transfer (for Connect)
const refundWithReversal = await stripe.refunds.create({
  charge: 'ch_ABC123',
  reverse_transfer: true, // Reverse transfer to connected account
});
```

### Retrieve Refund

```typescript
const refund = await stripe.refunds.retrieve('re_ABC123');

console.log({
  status: refund.status, // 'succeeded', 'pending', 'failed'
  amount: refund.amount,
  charge: refund.charge,
  reason: refund.reason,
});
```

### List Refunds

```typescript
const refunds = await stripe.refunds.list({
  limit: 100,
  charge: 'ch_ABC123', // Filter by charge
});
```

### Refund Reasons

| Reason | Description | When to Use |
|--------|-------------|-------------|
| `requested_by_customer` | Customer requested refund | Most common reason |
| `duplicate` | Duplicate charge | Accidental double charge |
| `fraudulent` | Fraudulent transaction | Confirmed fraud |

---

## Dispute Handling

### Retrieve Dispute

```typescript
const dispute = await stripe.disputes.retrieve('dp_ABC123');

console.log({
  status: dispute.status,
  reason: dispute.reason,
  amount: dispute.amount,
  evidence_details: dispute.evidence_details,
});
```

### Submit Evidence

```typescript
const dispute = await stripe.disputes.update('dp_ABC123', {
  evidence: {
    customer_name: 'John Doe',
    customer_email_address: 'customer@example.com',
    customer_purchase_ip: '192.168.1.1',
    billing_address: '123 Main St, San Francisco, CA 94111',
    receipt: 'receipt_url',
    customer_signature: 'signature_file_id',
    shipping_carrier: 'USPS',
    shipping_tracking_number: '1Z999AA1012345678',
    shipping_date: '2025-11-01',
    shipping_documentation: 'shipping_label_file_id',
    product_description: 'Limited edition art print',
    refund_policy: 'refund_policy_file_id',
    refund_policy_disclosure: 'Clearly displayed on website',
    cancellation_policy: 'No cancellation after shipment',
    customer_communication: 'email_thread_file_id',
  },
  metadata: {
    submitted_by: 'admin_user_id',
    submission_date: new Date().toISOString(),
  },
});
```

### Close Dispute

```typescript
const dispute = await stripe.disputes.close('dp_ABC123');
```

### List Disputes

```typescript
const disputes = await stripe.disputes.list({
  limit: 100,
  created: {
    gte: Math.floor(Date.now() / 1000) - (30 * 24 * 60 * 60),
  },
});
```

### Dispute Status Codes

| Status | Description |
|--------|-------------|
| `warning_needs_response` | Evidence needed |
| `warning_under_review` | Evidence submitted, under review |
| `warning_closed` | Dispute closed (won or lost) |
| `needs_response` | Response required |
| `under_review` | Being reviewed |
| `charge_refunded` | Refund issued |
| `won` | Dispute won |
| `lost` | Dispute lost |

---

## Subscriptions API

### Create Subscription

```typescript
const subscription = await stripe.subscriptions.create({
  customer: 'cus_ABC123',
  items: [
    {
      price: 'price_ABC123', // Price ID from Stripe Dashboard
    },
  ],
  payment_behavior: 'default_incomplete',
  payment_settings: {
    save_default_payment_method: 'on_subscription',
  },
  expand: ['latest_invoice.payment_intent'],
});

// Return client secret for payment
const clientSecret = subscription.latest_invoice.payment_intent.client_secret;
```

### Update Subscription

```typescript
// Change plan
const subscription = await stripe.subscriptions.update('sub_ABC123', {
  items: [
    {
      id: 'si_ABC123', // Subscription item ID
      price: 'price_NEW123', // New price ID
    },
  ],
  proration_behavior: 'create_prorations', // or 'none'
});

// Cancel at period end
const subscription = await stripe.subscriptions.update('sub_ABC123', {
  cancel_at_period_end: true,
});

// Add metadata
const subscription = await stripe.subscriptions.update('sub_ABC123', {
  metadata: {
    plan_name: 'Premium',
    upgraded_at: new Date().toISOString(),
  },
});
```

### Cancel Subscription

```typescript
// Cancel immediately
const subscription = await stripe.subscriptions.cancel('sub_ABC123');

// Cancel at period end
const subscription = await stripe.subscriptions.update('sub_ABC123', {
  cancel_at_period_end: true,
});
```

### Retrieve Subscription

```typescript
const subscription = await stripe.subscriptions.retrieve('sub_ABC123', {
  expand: ['latest_invoice', 'customer'],
});

console.log({
  status: subscription.status,
  current_period_end: subscription.current_period_end,
  cancel_at_period_end: subscription.cancel_at_period_end,
});
```

---

## Products & Prices

### Create Product

```typescript
const product = await stripe.products.create({
  name: 'Limited Edition Art Print',
  description: 'Hand-signed museum-quality print',
  images: ['https://example.com/image.jpg'],
  metadata: {
    sku: 'PRINT-001',
    category: 'art',
  },
  shippable: true,
  url: 'https://brandonmills.com/shop/print-001',
});
```

### Create Price

```typescript
// One-time price
const price = await stripe.prices.create({
  product: 'prod_ABC123',
  unit_amount: 9900, // $99.00
  currency: 'usd',
  metadata: {
    sale_price: 'false',
  },
});

// Recurring price
const recurringPrice = await stripe.prices.create({
  product: 'prod_ABC123',
  unit_amount: 2900, // $29.00
  currency: 'usd',
  recurring: {
    interval: 'month', // or 'day', 'week', 'year'
    interval_count: 1,
  },
});
```

---

## Response Object Examples

### Checkout Session Object

```typescript
{
  id: 'cs_test_a1...',
  object: 'checkout.session',
  amount_total: 9900,
  amount_subtotal: 9900,
  currency: 'usd',
  customer: 'cus_ABC123',
  customer_details: {
    email: 'customer@example.com',
    name: 'John Doe',
    phone: '+14155551234',
  },
  line_items: {
    data: [
      {
        id: 'li_ABC123',
        amount_total: 9900,
        amount_subtotal: 9900,
        description: 'Art Print',
        price: { ... },
        quantity: 1,
      }
    ]
  },
  payment_status: 'paid',
  status: 'complete',
  url: 'https://checkout.stripe.com/c/pay/cs_test_...',
}
```

### Payment Intent Object

```typescript
{
  id: 'pi_ABC123',
  object: 'payment_intent',
  amount: 9900,
  currency: 'usd',
  status: 'succeeded',
  customer: 'cus_ABC123',
  payment_method: 'pm_ABC123',
  charges: {
    data: [
      {
        id: 'ch_ABC123',
        amount: 9900,
        status: 'succeeded',
        receipt_url: 'https://...',
      }
    ]
  },
  metadata: {
    order_id: 'order_123',
  },
}
```

---

## Error Codes

| Code | Description | How to Handle |
|------|-------------|---------------|
| `card_declined` | Card was declined | Ask for different card |
| `insufficient_funds` | Not enough balance | Ask for different card |
| `expired_card` | Card has expired | Ask for different card |
| `incorrect_cvc` | Wrong CVV/CVC | Ask to re-enter |
| `processing_error` | Processing error | Retry |
| `rate_limit_error` | Too many requests | Wait and retry |
| `api_error` | Stripe server error | Retry later |

---

## Testing

### Test Card Numbers

```typescript
// Successful payment
4242 4242 4242 4242

// 3D Secure authentication required
4000 0025 0000 3155

// Declined
4000 0000 0000 9995

// Insufficient funds
4000 0000 0000 9995

// Expired card
4000 0000 0000 0069

// Incorrect CVC
4000 0000 0000 0127
```

### Test Webhook Events

```bash
stripe trigger checkout.session.completed
stripe trigger payment_intent.succeeded
stripe trigger charge.refunded
```

---

## Rate Limits

- **Default:** 100 requests per second
- **Webhooks:** 1,000 events per second
- **Idempotent requests:** Cached for 24 hours

**Best Practice:** Implement exponential backoff for rate limit errors.

---

**Next Steps:**
- Review [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for common issues
- Implement webhook handlers
- Set up monitoring
- Test thoroughly before going live