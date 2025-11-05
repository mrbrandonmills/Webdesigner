# Stripe Troubleshooting Guide

## Common Issues & Solutions

**Version:** 1.0.0
**Last Updated:** 2025-11-05

---

## Table of Contents

1. [Payment Failures](#payment-failures)
2. [Webhook Issues](#webhook-issues)
3. [3D Secure Problems](#3d-secure-problems)
4. [Card Declined Errors](#card-declined-errors)
5. [Dispute Resolution](#dispute-resolution)
6. [Integration Errors](#integration-errors)
7. [Testing Issues](#testing-issues)
8. [Performance Problems](#performance-problems)

---

## Payment Failures

### Issue: "Payment failed - Card was declined"

**Symptoms:**
- Payment fails at checkout
- Error: "Your card was declined"
- Payment Intent status: `requires_payment_method`

**Possible Causes:**
1. Insufficient funds
2. Card issuer blocking payment
3. Incorrect card details
4. Fraud prevention triggered
5. Card expired

**Solutions:**

```typescript
// Implement better error handling
try {
  const paymentIntent = await stripe.paymentIntents.create({...});
} catch (error) {
  if (error instanceof Stripe.errors.StripeCardError) {
    // Specific card error
    const decline_code = error.decline_code;

    switch (decline_code) {
      case 'insufficient_funds':
        return 'Your card has insufficient funds. Please use a different card.';
      case 'lost_card':
      case 'stolen_card':
        return 'This card cannot be used. Please use a different card.';
      case 'generic_decline':
        return 'Your card was declined. Please contact your bank.';
      default:
        return 'Payment failed. Please try a different card.';
    }
  }
}
```

**Prevention:**
- Display clear error messages
- Offer multiple payment methods
- Implement retry logic for temporary failures
- Use Stripe Radar for fraud prevention

---

### Issue: "Payment processing takes too long"

**Symptoms:**
- Checkout hangs on "Processing..."
- No response from Stripe API
- Timeout errors

**Diagnosis:**

```typescript
// Add timeout handling
const createSessionWithTimeout = async (data: any, timeout = 10000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch('/api/stripe/checkout', {
      method: 'POST',
      body: JSON.stringify(data),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request timeout. Please try again.');
    }
    throw error;
  }
};
```

**Solutions:**
1. Check Stripe status: https://status.stripe.com
2. Implement timeout handling (10-15 seconds)
3. Add loading states to UI
4. Retry failed requests with exponential backoff
5. Check network connectivity

---

### Issue: "Duplicate payments created"

**Symptoms:**
- Customer charged multiple times
- Multiple Payment Intents for same order
- Duplicate checkout sessions

**Diagnosis:**

```typescript
// Check for duplicate sessions
const recentSessions = await stripe.checkout.sessions.list({
  limit: 10,
  customer: 'cus_ABC123',
});

const duplicates = recentSessions.data.filter(session =>
  session.metadata.order_id === 'order_123' &&
  session.status === 'complete'
);

console.log(`Found ${duplicates.length} duplicate payments`);
```

**Solutions:**

```typescript
// Implement idempotency
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  const { orderId, items } = await request.json();

  // Generate idempotency key
  const idempotencyKey = `checkout_${orderId}_${Date.now()}`;

  const session = await stripe.checkout.sessions.create(
    {
      line_items: items,
      mode: 'payment',
      metadata: { order_id: orderId },
    },
    {
      idempotencyKey, // Prevents duplicate creation
    }
  );

  return NextResponse.json({ sessionId: session.id });
}

// Client-side: Prevent double-click
const [isProcessing, setIsProcessing] = useState(false);

const handleCheckout = async () => {
  if (isProcessing) return; // Prevent double-click
  setIsProcessing(true);

  try {
    await createCheckoutSession();
  } finally {
    setIsProcessing(false);
  }
};
```

**Prevention:**
- Use idempotency keys
- Disable buttons during processing
- Check for existing sessions before creating new ones

---

## Webhook Issues

### Issue: "Webhooks not being received"

**Symptoms:**
- Orders not being fulfilled
- No webhook events in logs
- Database not updating after payment

**Diagnosis:**

```bash
# Check webhook endpoint status
curl -X POST https://brandonmills.com/api/stripe/webhook \
  -H "Content-Type: application/json" \
  -d '{"test": true}'

# Expected: 400 (signature verification failed)
# Bad: 404 or 500

# Check Stripe Dashboard
# Developers > Webhooks > Select endpoint > View events
```

**Solutions:**

1. **Verify endpoint is accessible:**
```typescript
// app/api/stripe/webhook/route.ts
export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    endpoint: '/api/stripe/webhook',
  });
}
```

2. **Check webhook secret:**
```bash
# Verify environment variable is set
echo $STRIPE_WEBHOOK_SECRET

# Should output: whsec_...
```

3. **Enable proper logging:**
```typescript
export async function POST(request: NextRequest) {
  console.log('Webhook received at:', new Date().toISOString());
  console.log('Headers:', Object.fromEntries(request.headers));

  // ... rest of handler
}
```

4. **Test locally with Stripe CLI:**
```bash
# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/stripe/webhook

# Trigger test event
stripe trigger checkout.session.completed
```

**Common Issues:**
- Wrong webhook secret (test vs live mode)
- Endpoint not publicly accessible
- Firewall blocking Stripe IPs
- Wrong HTTP method (must be POST)

---

### Issue: "Webhook signature verification failed"

**Symptoms:**
- Error: "No signatures found matching the expected signature"
- Webhook returns 400 error
- Events not being processed

**Diagnosis:**

```typescript
// Add detailed error logging
try {
  event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
} catch (err) {
  console.error('Webhook verification failed:', {
    error: err.message,
    signature: signature?.substring(0, 20) + '...',
    bodyLength: body.length,
    secretPresent: !!webhookSecret,
  });

  return NextResponse.json({ error: err.message }, { status: 400 });
}
```

**Solutions:**

1. **Verify raw body is used:**
```typescript
// ✅ CORRECT
const body = await request.text(); // Raw string

// ❌ WRONG
const body = await request.json(); // Parsed JSON
```

2. **Check webhook secret:**
```typescript
// Verify secret exists and is correct
if (!process.env.STRIPE_WEBHOOK_SECRET) {
  throw new Error('STRIPE_WEBHOOK_SECRET not configured');
}

// Check you're using the right secret (test vs live)
console.log('Using webhook secret starting with:',
  process.env.STRIPE_WEBHOOK_SECRET.substring(0, 10)
);
```

3. **Disable body parsing:**
```typescript
// Next.js App Router: No special config needed
// Just use request.text() to get raw body

// For Pages Router:
export const config = {
  api: {
    bodyParser: false,
  },
};
```

4. **Verify signature header:**
```typescript
const signature = request.headers.get('stripe-signature');

if (!signature) {
  console.error('Missing stripe-signature header');
  return NextResponse.json({ error: 'No signature' }, { status: 400 });
}
```

---

### Issue: "Webhook events processing slowly"

**Symptoms:**
- Orders take minutes to fulfill
- Webhook endpoint timing out
- 500 errors in Stripe Dashboard

**Solutions:**

```typescript
// Use async queue for processing
import { Queue } from 'bullmq';

const webhookQueue = new Queue('stripe-webhooks');

export async function POST(request: NextRequest) {
  const event = await verifyWebhook(request);

  // Add to queue instead of processing immediately
  await webhookQueue.add('process-event', {
    eventId: event.id,
    eventType: event.type,
    data: event.data,
  });

  // Return 200 immediately
  return NextResponse.json({ received: true });
}

// Separate worker processes events
const worker = new Worker('stripe-webhooks', async (job) => {
  try {
    await processWebhookEvent(job.data);
  } catch (error) {
    console.error('Webhook processing failed:', error);
    throw error; // Will be retried
  }
});
```

**Prevention:**
- Keep webhook handlers fast (< 500ms)
- Process heavy tasks asynchronously
- Return 200 immediately after verification
- Use queues for complex operations

---

## 3D Secure Problems

### Issue: "3D Secure authentication fails"

**Symptoms:**
- Payment requires authentication but fails
- Redirect to bank page doesn't work
- Authentication popup doesn't appear

**Diagnosis:**

```typescript
// Check payment intent status
const paymentIntent = await stripe.paymentIntents.retrieve('pi_ABC123');

console.log({
  status: paymentIntent.status,
  next_action: paymentIntent.next_action,
  last_payment_error: paymentIntent.last_payment_error,
});

// If status is 'requires_action', 3DS is needed
```

**Solutions:**

```typescript
// Properly handle 3D Secure on client
import { useStripe } from '@stripe/react-stripe-js';

function CheckoutForm() {
  const stripe = useStripe();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Confirm payment with 3DS handling
    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: cardElement,
        },
        return_url: `${window.location.origin}/payment/complete`, // Required for 3DS
      }
    );

    if (error) {
      // Authentication failed
      console.error(error.message);
    } else if (paymentIntent.status === 'succeeded') {
      // Payment successful after authentication
      window.location.href = '/order/success';
    }
  };
}
```

**Common Issues:**
- Missing `return_url` parameter
- Popup blockers preventing authentication window
- Not handling redirect properly
- Testing with non-3DS test cards

**Test Cards for 3DS:**
```
4000 0025 0000 3155 - Requires 3D Secure authentication
4000 0027 6000 3184 - Requires 3DS (Visa)
4000 0082 6000 3178 - Requires 3DS (Mastercard)
```

---

## Card Declined Errors

### Issue: Understanding decline codes

**Common Decline Codes:**

| Code | Meaning | Customer Action |
|------|---------|-----------------|
| `approve_with_id` | Needs approval | Contact bank |
| `call_issuer` | Card blocked | Contact bank |
| `card_not_supported` | Card type not accepted | Use different card |
| `card_velocity_exceeded` | Too many transactions | Wait and retry |
| `currency_not_supported` | Currency mismatch | Check currency settings |
| `do_not_honor` | Generic decline | Contact bank |
| `do_not_try_again` | Permanent decline | Use different card |
| `duplicate_transaction` | Already processed | Check recent charges |
| `expired_card` | Card expired | Update card details |
| `fraudulent` | Fraud suspected | Contact bank |
| `generic_decline` | Unknown reason | Contact bank |
| `incorrect_number` | Invalid card number | Check card number |
| `incorrect_cvc` | Wrong CVV | Re-enter CVV |
| `insufficient_funds` | Not enough balance | Use different card |
| `invalid_account` | Account closed | Use different card |
| `invalid_amount` | Amount error | Check amount |
| `lost_card` | Card reported lost | Use different card |
| `new_account_information_available` | Need updated info | Update card |
| `no_action_taken` | Not processed | Retry |
| `not_permitted` | Transaction not allowed | Contact bank |
| `pickup_card` | Card restricted | Contact bank |
| `pin_try_exceeded` | Too many PIN attempts | Contact bank |
| `processing_error` | Temporary error | Retry |
| `restricted_card` | Card restricted | Use different card |
| `revocation_of_all_authorizations` | Auth revoked | Use different card |
| `stolen_card` | Card reported stolen | Use different card |
| `stop_payment_order` | Payment stopped | Contact bank |
| `testmode_decline` | Test mode decline | Expected in test mode |
| `transaction_not_allowed` | Not permitted | Contact bank |
| `try_again_later` | Temporary issue | Retry later |
| `withdrawal_count_limit_exceeded` | Too many withdrawals | Try tomorrow |

**Implementation:**

```typescript
// lib/decline-messages.ts
export function getDeclineMessage(code: string): string {
  const messages: Record<string, string> = {
    insufficient_funds: 'Your card has insufficient funds. Please try a different payment method.',
    lost_card: 'This card has been reported as lost. Please use a different card.',
    stolen_card: 'This card has been reported as stolen. Please use a different card.',
    expired_card: 'Your card has expired. Please update your payment information.',
    incorrect_cvc: 'The security code you entered is incorrect. Please try again.',
    processing_error: 'A temporary error occurred. Please try again in a moment.',
    card_not_supported: 'This card type is not supported. Please try a different card.',
    fraudulent: 'This transaction was declined for security reasons. Please contact your bank.',
    generic_decline: 'Your card was declined. Please contact your bank for more information.',
    do_not_try_again: 'This card cannot be used. Please try a different payment method.',
  };

  return messages[code] || 'Your payment could not be processed. Please try a different payment method.';
}

// Usage in error handler
catch (error) {
  if (error instanceof Stripe.errors.StripeCardError) {
    const message = getDeclineMessage(error.decline_code || error.code);
    return NextResponse.json({ error: message }, { status: 402 });
  }
}
```

---

## Dispute Resolution

### Issue: "Dispute filed by customer"

**Immediate Actions:**

1. **Gather evidence quickly (respond within 7 days):**

```typescript
// Gather all order information
const evidence = {
  // Customer information
  customer_name: 'John Doe',
  customer_email_address: 'customer@example.com',
  customer_purchase_ip: '192.168.1.1',

  // Product information
  product_description: 'Limited edition art print, hand-signed by artist',

  // Shipping information
  shipping_carrier: 'USPS',
  shipping_tracking_number: '9400111899562843367876',
  shipping_date: '2025-11-02',
  shipping_address: '123 Main St, San Francisco, CA 94111',

  // Communication
  customer_communication: 'Email thread showing customer was satisfied',

  // Policies
  refund_policy: 'https://brandonmills.com/refund-policy',
  refund_policy_disclosure: 'Clearly displayed on checkout page and confirmation email',

  // Receipt
  receipt: 'https://brandonmills.com/receipts/order_123',

  // Additional
  billing_address: '123 Main St, San Francisco, CA 94111',
};

// Submit evidence
await stripe.disputes.update('dp_ABC123', { evidence });
```

2. **Document everything:**
- Order confirmation emails
- Shipping tracking
- Customer communications
- Product photos
- Delivery confirmation
- Refund policy acceptance

3. **Upload supporting files:**
```typescript
// Upload file to Stripe
const file = await stripe.files.create({
  purpose: 'dispute_evidence',
  file: {
    data: Buffer.from(fileContent),
    name: 'shipping_label.pdf',
    type: 'application/pdf',
  },
});

// Add to evidence
await stripe.disputes.update('dp_ABC123', {
  evidence: {
    shipping_documentation: file.id,
  },
});
```

**Prevention:**
- Clear product descriptions
- Visible refund policy
- Send tracking information
- Respond to customer inquiries promptly
- Keep detailed records
- Use signature confirmation for high-value items

---

## Integration Errors

### Issue: "API key not working"

**Symptoms:**
- Error: "Invalid API Key provided"
- All requests returning 401

**Diagnosis:**

```typescript
// Test API key
const testKey = async () => {
  try {
    const balance = await stripe.balance.retrieve();
    console.log('API key valid ✅');
    console.log('Available balance:', balance.available);
  } catch (error) {
    console.error('API key invalid ❌');
    console.error(error.message);
  }
};

testKey();
```

**Solutions:**
1. Verify key is correct (starts with `sk_test_` or `sk_live_`)
2. Check environment variables are set
3. Ensure using correct mode (test vs live)
4. Verify key hasn't been rolled/deleted
5. Check key restrictions in Dashboard

---

### Issue: "CORS errors with Stripe.js"

**Symptoms:**
- Error: "Blocked by CORS policy"
- Stripe.js not loading
- Payment form not working

**Solutions:**

```typescript
// Ensure Stripe.js is loaded from CDN
<script src="https://js.stripe.com/v3/"></script>

// Or use @stripe/stripe-js
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
```

**Note:** Stripe.js must be loaded from Stripe's CDN for PCI compliance.

---

## Testing Issues

### Issue: "Test payments not working"

**Checklist:**

```typescript
// 1. Verify test mode
console.log('Using test key:', process.env.STRIPE_SECRET_KEY?.startsWith('sk_test_'));

// 2. Use test card numbers
const TEST_CARDS = {
  success: '4242 4242 4242 4242',
  declined: '4000 0000 0000 9995',
  requires_3ds: '4000 0025 0000 3155',
};

// 3. Check webhook secret
console.log('Webhook secret mode:',
  process.env.STRIPE_WEBHOOK_SECRET?.startsWith('whsec_')
);

// 4. Use Stripe CLI for local webhooks
// stripe listen --forward-to localhost:3000/api/stripe/webhook
```

---

### Issue: "Webhooks not triggering locally"

**Solution:**

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/stripe/webhook

# Copy webhook signing secret (whsec_...) to .env.local
# STRIPE_WEBHOOK_SECRET=whsec_...

# In another terminal, trigger events
stripe trigger checkout.session.completed
stripe trigger payment_intent.succeeded
```

---

## Performance Problems

### Issue: "Checkout page loading slowly"

**Diagnosis:**

```typescript
// Measure Stripe.js load time
const start = performance.now();
const stripe = await loadStripe(publishableKey);
const end = performance.now();
console.log(`Stripe.js loaded in ${end - start}ms`);
```

**Solutions:**

1. **Preload Stripe.js:**
```typescript
// app/layout.tsx
<link rel="preconnect" href="https://js.stripe.com" />
<link rel="dns-prefetch" href="https://js.stripe.com" />
```

2. **Load Stripe.js early:**
```typescript
// app/checkout/page.tsx
const stripePromise = loadStripe(publishableKey); // Outside component

export default function CheckoutPage() {
  // Use stripePromise
}
```

3. **Optimize images:**
```typescript
// Use Next.js Image for product images
import Image from 'next/image';

<Image
  src={product.image}
  alt={product.name}
  width={300}
  height={300}
  priority={true}
/>
```

---

## Quick Reference: Error Status Codes

| Code | Meaning | Action |
|------|---------|--------|
| 200 | Success | Continue |
| 400 | Bad Request | Check request parameters |
| 401 | Unauthorized | Check API key |
| 402 | Request Failed | Card declined |
| 404 | Not Found | Check resource ID |
| 429 | Too Many Requests | Implement rate limiting |
| 500 | Server Error | Retry with backoff |
| 503 | Service Unavailable | Check Stripe status |

---

## Getting Help

### Support Channels

1. **Stripe Dashboard:**
   - Logs: Developers > Logs
   - Webhooks: Developers > Webhooks
   - Events: Developers > Events

2. **Stripe Support:**
   - Email: support@stripe.com
   - Chat: Available in Dashboard
   - Docs: https://stripe.com/docs

3. **Community:**
   - Stack Overflow: Tag with [stripe-payments]
   - Stripe Community: https://stripe.com/community

4. **Status:**
   - Status Page: https://status.stripe.com
   - Twitter: @stripestatus

---

## Debugging Checklist

When experiencing issues:

- [ ] Check Stripe status page
- [ ] Verify API keys are correct
- [ ] Confirm environment (test vs live)
- [ ] Check webhook endpoint is accessible
- [ ] Review error logs in Stripe Dashboard
- [ ] Test with Stripe CLI locally
- [ ] Verify request parameters
- [ ] Check network connectivity
- [ ] Review recent code changes
- [ ] Test with different payment method

---

**Remember:** Most payment issues are temporary. Implement proper error handling, retry logic, and clear customer communication for the best experience.