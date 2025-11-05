# Stripe Best Practices

## Security, Optimization & Compliance Guide

**Version:** 1.0.0
**Last Updated:** 2025-11-05

---

## Table of Contents

1. [Security Hardening](#security-hardening)
2. [Error Handling Strategies](#error-handling-strategies)
3. [Retry Logic](#retry-logic)
4. [Idempotency Keys](#idempotency-keys)
5. [Webhook Signature Verification](#webhook-signature-verification)
6. [Currency Handling](#currency-handling)
7. [Tax Automation](#tax-automation)
8. [Performance Optimization](#performance-optimization)
9. [PCI Compliance](#pci-compliance)
10. [Fraud Prevention](#fraud-prevention)

---

## Security Hardening

### API Key Management

**DO:**
```typescript
// ✅ Use environment variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// ✅ Validate keys exist
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is required');
}

// ✅ Use restricted keys for client-side
const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
```

**DON'T:**
```typescript
// ❌ Never hardcode keys
const stripe = new Stripe('sk_live_abc123');

// ❌ Never commit keys to git
// ❌ Never use secret keys in client-side code
// ❌ Never log API keys
console.log(process.env.STRIPE_SECRET_KEY);
```

### Secure Data Transmission

**Always use HTTPS:**
```typescript
// ✅ Enforce HTTPS in production
export const config = {
  api: {
    bodyParser: false,
  },
};

// Middleware to enforce HTTPS
export function middleware(request: NextRequest) {
  const protocol = request.headers.get('x-forwarded-proto');

  if (protocol !== 'https' && process.env.NODE_ENV === 'production') {
    return NextResponse.redirect(
      `https://${request.headers.get('host')}${request.nextUrl.pathname}`,
      301
    );
  }
}
```

### Sensitive Data Handling

**DO:**
```typescript
// ✅ Never store card numbers
// Let Stripe handle card data collection

// ✅ Use Stripe.js for card input
<Elements stripe={stripePromise}>
  <CardElement />
</Elements>

// ✅ Store only tokenized references
const customer = {
  email: 'customer@example.com',
  stripeCustomerId: 'cus_abc123', // Safe to store
  defaultPaymentMethod: 'pm_abc123', // Safe to store
};
```

**DON'T:**
```typescript
// ❌ Never store raw card data
const cardData = {
  number: '4242424242424242',
  cvv: '123',
  exp_month: 12,
  exp_year: 2025,
};

// ❌ Never log sensitive data
console.log(paymentIntent.payment_method_details);
```

### Rate Limiting

Implement rate limiting to prevent abuse:

```typescript
// lib/rate-limit.ts
import { LRUCache } from 'lru-cache';

const ratelimit = new LRUCache({
  max: 500,
  ttl: 60000, // 1 minute
});

export function checkRateLimit(identifier: string): boolean {
  const tokenCount = (ratelimit.get(identifier) as number) || 0;

  if (tokenCount > 10) {
    return false;
  }

  ratelimit.set(identifier, tokenCount + 1);
  return true;
}

// In API route
export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || 'anonymous';

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429 }
    );
  }

  // Continue processing...
}
```

---

## Error Handling Strategies

### Comprehensive Error Handling

```typescript
// lib/stripe-errors.ts
import Stripe from 'stripe';

export function handleStripeError(error: unknown): {
  message: string;
  code: string;
  statusCode: number;
} {
  if (error instanceof Stripe.errors.StripeError) {
    switch (error.type) {
      case 'StripeCardError':
        // Card was declined
        return {
          message: error.message || 'Your card was declined',
          code: error.code || 'card_declined',
          statusCode: 400,
        };

      case 'StripeRateLimitError':
        // Too many requests
        return {
          message: 'Too many requests. Please try again later.',
          code: 'rate_limit',
          statusCode: 429,
        };

      case 'StripeInvalidRequestError':
        // Invalid parameters
        return {
          message: 'Invalid request. Please check your information.',
          code: error.code || 'invalid_request',
          statusCode: 400,
        };

      case 'StripeAPIError':
        // Stripe API error
        return {
          message: 'Payment service error. Please try again.',
          code: 'api_error',
          statusCode: 500,
        };

      case 'StripeConnectionError':
        // Network error
        return {
          message: 'Network error. Please check your connection.',
          code: 'connection_error',
          statusCode: 503,
        };

      case 'StripeAuthenticationError':
        // Authentication error (bad API key)
        return {
          message: 'Authentication error. Please contact support.',
          code: 'authentication_error',
          statusCode: 401,
        };

      default:
        return {
          message: 'An unexpected error occurred.',
          code: 'unknown_error',
          statusCode: 500,
        };
    }
  }

  // Non-Stripe error
  return {
    message: 'An unexpected error occurred.',
    code: 'unknown_error',
    statusCode: 500,
  };
}

// Usage in API route
export async function POST(request: NextRequest) {
  try {
    const session = await stripe.checkout.sessions.create({...});
    return NextResponse.json({ sessionId: session.id });

  } catch (error) {
    const stripeError = handleStripeError(error);

    // Log error for monitoring
    console.error('Stripe error:', {
      message: stripeError.message,
      code: stripeError.code,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      { error: stripeError.message, code: stripeError.code },
      { status: stripeError.statusCode }
    );
  }
}
```

### User-Friendly Error Messages

```typescript
// components/checkout/error-message.tsx
export function getCustomerFriendlyMessage(code: string): string {
  const messages: Record<string, string> = {
    card_declined: 'Your card was declined. Please try a different payment method.',
    insufficient_funds: 'Your card has insufficient funds. Please use a different card.',
    expired_card: 'Your card has expired. Please use a different card.',
    incorrect_cvc: 'Your card\'s security code is incorrect. Please check and try again.',
    processing_error: 'An error occurred while processing your card. Please try again.',
    rate_limit: 'Too many payment attempts. Please wait a moment and try again.',
    generic_decline: 'Your card was declined. Please contact your bank for more information.',
  };

  return messages[code] || 'Payment failed. Please try again or use a different payment method.';
}
```

---

## Retry Logic

### Exponential Backoff

```typescript
// lib/retry.ts
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      // Don't retry certain errors
      if (error instanceof Stripe.errors.StripeCardError) {
        throw error; // Card errors shouldn't be retried
      }

      if (error instanceof Stripe.errors.StripeInvalidRequestError) {
        throw error; // Invalid requests won't succeed on retry
      }

      // Calculate delay with exponential backoff
      const delay = baseDelay * Math.pow(2, attempt);
      const jitter = Math.random() * 1000; // Add jitter to prevent thundering herd

      console.log(`Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms`);

      await new Promise(resolve => setTimeout(resolve, delay + jitter));
    }
  }

  throw lastError!;
}

// Usage
const session = await retryWithBackoff(
  () => stripe.checkout.sessions.create({...}),
  3,
  1000
);
```

### Webhook Retry Handling

Stripe automatically retries failed webhook deliveries:

```typescript
// app/api/stripe/webhook/route.ts
export async function POST(request: NextRequest) {
  let event: Stripe.Event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    // Return 400 for signature failures (no retry)
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }

  try {
    // Process event
    await handleWebhookEvent(event);

    // Return 200 to acknowledge receipt
    return NextResponse.json({ received: true });

  } catch (err) {
    console.error('Webhook processing error:', err);

    // Return 500 to trigger Stripe's automatic retry
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
```

---

## Idempotency Keys

Prevent duplicate charges:

```typescript
// lib/idempotency.ts
import { v4 as uuidv4 } from 'uuid';

export function generateIdempotencyKey(operation: string, data: any): string {
  // Create a deterministic key based on operation and data
  const hash = createHash('sha256');
  hash.update(JSON.stringify({ operation, data }));
  return hash.digest('hex');
}

// Usage in payment creation
export async function POST(request: NextRequest) {
  const { amount, customerId } = await request.json();

  const idempotencyKey = generateIdempotencyKey('create_payment', {
    amount,
    customerId,
    timestamp: Date.now(),
  });

  const paymentIntent = await stripe.paymentIntents.create(
    {
      amount: amount * 100,
      currency: 'usd',
      customer: customerId,
    },
    {
      idempotencyKey, // Prevents duplicate charges
    }
  );

  return NextResponse.json({ clientSecret: paymentIntent.client_secret });
}
```

### Client-Side Idempotency

```typescript
// components/checkout/checkout-button.tsx
'use client';

import { useState, useRef } from 'react';

export function CheckoutButton() {
  const [isProcessing, setIsProcessing] = useState(false);
  const requestIdRef = useRef<string>(uuidv4());

  const handleCheckout = async () => {
    if (isProcessing) return; // Prevent double-click

    setIsProcessing(true);

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Idempotency-Key': requestIdRef.current,
        },
        body: JSON.stringify({...}),
      });

      // Generate new key for next request
      requestIdRef.current = uuidv4();

    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <button onClick={handleCheckout} disabled={isProcessing}>
      {isProcessing ? 'Processing...' : 'Checkout'}
    </button>
  );
}
```

---

## Webhook Signature Verification

**Always verify webhook signatures:**

```typescript
// app/api/stripe/webhook/route.ts
export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    console.error('Missing Stripe signature header');
    return NextResponse.json(
      { error: 'Missing signature' },
      { status: 400 }
    );
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('Missing STRIPE_WEBHOOK_SECRET environment variable');
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 500 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  // Log event receipt
  console.log('Webhook received:', {
    type: event.type,
    id: event.id,
    timestamp: new Date(event.created * 1000).toISOString(),
  });

  // Process event...
}
```

### Webhook Testing Best Practices

```bash
# Use Stripe CLI for local testing
stripe listen --forward-to localhost:3000/api/stripe/webhook

# Verify signature with test event
stripe trigger checkout.session.completed

# Check webhook logs
stripe webhooks list
```

---

## Currency Handling

### Multi-Currency Support

```typescript
// lib/currency.ts
export const SUPPORTED_CURRENCIES = {
  USD: { symbol: '$', decimals: 2, name: 'US Dollar' },
  EUR: { symbol: '€', decimals: 2, name: 'Euro' },
  GBP: { symbol: '£', decimals: 2, name: 'British Pound' },
  CAD: { symbol: 'CA$', decimals: 2, name: 'Canadian Dollar' },
  AUD: { symbol: 'A$', decimals: 2, name: 'Australian Dollar' },
  JPY: { symbol: '¥', decimals: 0, name: 'Japanese Yen' }, // Zero decimal
} as const;

export function formatAmount(
  amount: number,
  currency: keyof typeof SUPPORTED_CURRENCIES
): string {
  const currencyInfo = SUPPORTED_CURRENCIES[currency];

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: currencyInfo.decimals,
    maximumFractionDigits: currencyInfo.decimals,
  }).format(amount);
}

export function convertToStripeAmount(
  amount: number,
  currency: keyof typeof SUPPORTED_CURRENCIES
): number {
  const currencyInfo = SUPPORTED_CURRENCIES[currency];

  // Zero-decimal currencies (JPY, KRW) don't need conversion
  if (currencyInfo.decimals === 0) {
    return Math.round(amount);
  }

  // Convert to cents/smallest unit
  return Math.round(amount * Math.pow(10, currencyInfo.decimals));
}

export function convertFromStripeAmount(
  amount: number,
  currency: keyof typeof SUPPORTED_CURRENCIES
): number {
  const currencyInfo = SUPPORTED_CURRENCIES[currency];

  if (currencyInfo.decimals === 0) {
    return amount;
  }

  return amount / Math.pow(10, currencyInfo.decimals);
}

// Usage
const priceInDollars = 29.99;
const stripeAmount = convertToStripeAmount(priceInDollars, 'USD'); // 2999
const displayPrice = formatAmount(priceInDollars, 'USD'); // $29.99
```

### Currency Conversion

```typescript
// Never convert currencies yourself - use Stripe's automatic conversion
const session = await stripe.checkout.sessions.create({
  line_items: [{
    price_data: {
      currency: 'eur', // Stripe handles conversion
      product_data: { name: 'Product' },
      unit_amount: 2999,
    },
    quantity: 1,
  }],
  mode: 'payment',
  // Stripe will handle currency conversion based on customer location
});
```

---

## Tax Automation

### Stripe Tax Integration

```typescript
// Enable automatic tax calculation
const session = await stripe.checkout.sessions.create({
  line_items: [{
    price_data: {
      currency: 'usd',
      product_data: {
        name: 'Luxury Art Print',
        tax_code: 'txcd_99999999', // Physical goods
      },
      unit_amount: 9900,
    },
    quantity: 1,
  }],
  mode: 'payment',
  automatic_tax: {
    enabled: true, // Enable automatic tax calculation
  },
  customer_details: {
    tax_exempt: 'none', // or 'exempt', 'reverse'
  },
  // Required for tax calculation
  shipping_address_collection: {
    allowed_countries: ['US', 'CA', 'GB'],
  },
});
```

### Tax Code Reference

```typescript
// Common tax codes for Brandon Mills products
export const TAX_CODES = {
  PHYSICAL_GOODS: 'txcd_99999999', // Default physical goods
  ARTWORK: 'txcd_10501000',        // Fine art
  DIGITAL_GOODS: 'txcd_10103000',  // Digital downloads
  PRINTS: 'txcd_99999999',         // Photo prints
  SHIPPING: 'txcd_92010001',       // Shipping charges
} as const;

// Apply correct tax code
const lineItems = products.map(product => ({
  price_data: {
    currency: 'usd',
    product_data: {
      name: product.name,
      tax_code: TAX_CODES[product.category] || TAX_CODES.PHYSICAL_GOODS,
    },
    unit_amount: product.price * 100,
  },
  quantity: product.quantity,
}));
```

### Manual Tax Calculation (Alternative)

```typescript
// lib/tax.ts
interface TaxRate {
  state: string;
  rate: number;
}

const US_TAX_RATES: TaxRate[] = [
  { state: 'CA', rate: 0.0725 },
  { state: 'NY', rate: 0.0400 },
  { state: 'TX', rate: 0.0625 },
  // Add more states...
];

export function calculateTax(
  amount: number,
  state: string
): { tax: number; total: number } {
  const taxRate = US_TAX_RATES.find(t => t.state === state);

  if (!taxRate) {
    return { tax: 0, total: amount };
  }

  const tax = Math.round(amount * taxRate.rate * 100) / 100;
  const total = amount + tax;

  return { tax, total };
}
```

---

## Performance Optimization

### Caching Customer Data

```typescript
// lib/customer-cache.ts
import { LRUCache } from 'lru-cache';

const customerCache = new LRUCache<string, Stripe.Customer>({
  max: 1000,
  ttl: 1000 * 60 * 15, // 15 minutes
});

export async function getCustomer(customerId: string): Promise<Stripe.Customer> {
  // Check cache first
  const cached = customerCache.get(customerId);
  if (cached) {
    return cached;
  }

  // Fetch from Stripe
  const customer = await stripe.customers.retrieve(customerId);

  // Cache result
  customerCache.set(customerId, customer as Stripe.Customer);

  return customer as Stripe.Customer;
}
```

### Batch Operations

```typescript
// Efficiently fetch multiple resources
export async function getMultipleCustomers(
  customerIds: string[]
): Promise<Map<string, Stripe.Customer>> {
  const customers = new Map<string, Stripe.Customer>();

  // Use Promise.all for parallel fetching
  const results = await Promise.allSettled(
    customerIds.map(id => getCustomer(id))
  );

  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      customers.set(customerIds[index], result.value);
    }
  });

  return customers;
}
```

### Webhook Processing Optimization

```typescript
// Process webhooks asynchronously
import { Queue } from 'bullmq';

const webhookQueue = new Queue('stripe-webhooks', {
  connection: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  },
});

export async function POST(request: NextRequest) {
  const event = await verifyWebhook(request);

  // Add to queue for async processing
  await webhookQueue.add('process-webhook', {
    eventId: event.id,
    eventType: event.type,
    data: event.data,
  });

  // Return immediately
  return NextResponse.json({ received: true });
}

// Worker processes events in background
const worker = new Worker('stripe-webhooks', async (job) => {
  await handleWebhookEvent(job.data);
});
```

---

## PCI Compliance

### Using Stripe Elements

```typescript
// ✅ CORRECT: Never handle card data directly
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

function PaymentForm() {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    // Stripe handles card data securely
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (error) {
      console.error(error);
    } else {
      // Send paymentMethod.id to server (safe)
      await processPayment(paymentMethod.id);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit">Pay</button>
    </form>
  );
}
```

### PCI Compliance Checklist

- [ ] Use Stripe.js or Elements for card collection
- [ ] Never store card numbers, CVV, or full magnetic stripe data
- [ ] Use HTTPS for all transactions
- [ ] Implement webhook signature verification
- [ ] Use restricted API keys when possible
- [ ] Log security events
- [ ] Regularly update dependencies
- [ ] Conduct security audits
- [ ] Train team on PCI requirements
- [ ] Document compliance procedures

---

## Fraud Prevention

### Radar Configuration

```typescript
// Enable Radar for fraud detection (automatic in Stripe)
// Configure rules in Dashboard > Radar > Rules

// Example: Block high-risk cards
const paymentIntent = await stripe.paymentIntents.create({
  amount: 5000,
  currency: 'usd',
  payment_method_types: ['card'],
  metadata: {
    risk_level: 'elevated', // Track internally
  },
});

// Check Radar risk score
if (paymentIntent.charges.data[0]?.outcome?.risk_level === 'elevated') {
  // Require additional verification
  await requireAdditionalVerification(paymentIntent);
}
```

### Custom Fraud Rules

```typescript
// lib/fraud-detection.ts
export function assessOrderRisk(order: {
  amount: number;
  customerEmail: string;
  ipAddress: string;
  shippingAddress: any;
  billingAddress: any;
}): 'low' | 'medium' | 'high' {
  let riskScore = 0;

  // Check order amount
  if (order.amount > 1000) riskScore += 2;
  if (order.amount > 5000) riskScore += 3;

  // Check email domain
  const emailDomain = order.customerEmail.split('@')[1];
  const suspiciousDomains = ['tempmail.com', '10minutemail.com'];
  if (suspiciousDomains.includes(emailDomain)) {
    riskScore += 5;
  }

  // Check address mismatch
  if (order.shippingAddress.country !== order.billingAddress.country) {
    riskScore += 3;
  }

  // Determine risk level
  if (riskScore >= 8) return 'high';
  if (riskScore >= 4) return 'medium';
  return 'low';
}

// Apply in checkout
export async function POST(request: NextRequest) {
  const order = await request.json();

  const riskLevel = assessOrderRisk(order);

  if (riskLevel === 'high') {
    // Require manual review
    return NextResponse.json(
      { error: 'Order requires verification' },
      { status: 403 }
    );
  }

  // Proceed with payment...
}
```

### 3D Secure Implementation

```typescript
// Automatically trigger 3D Secure when needed
const paymentIntent = await stripe.paymentIntents.create({
  amount: 10000,
  currency: 'usd',
  payment_method_types: ['card'],
  // Stripe automatically triggers 3DS when required by card issuer or regulations
  payment_method_options: {
    card: {
      request_three_d_secure: 'automatic', // 'any' to always request
    },
  },
});
```

---

## Monitoring & Logging

### Structured Logging

```typescript
// lib/logger.ts
interface LogEntry {
  level: 'info' | 'warn' | 'error';
  message: string;
  context?: Record<string, any>;
  timestamp: string;
}

export function log(entry: Omit<LogEntry, 'timestamp'>) {
  const logEntry: LogEntry = {
    ...entry,
    timestamp: new Date().toISOString(),
  };

  if (process.env.NODE_ENV === 'production') {
    // Send to logging service (e.g., Datadog, LogRocket)
    console.log(JSON.stringify(logEntry));
  } else {
    console.log(logEntry);
  }
}

// Usage
log({
  level: 'info',
  message: 'Payment processed successfully',
  context: {
    paymentIntentId: 'pi_123',
    amount: 5000,
    customer: 'cus_123',
  },
});
```

### Health Checks

```typescript
// app/api/health/stripe/route.ts
export async function GET() {
  try {
    // Test Stripe connection
    await stripe.balance.retrieve();

    return NextResponse.json({
      status: 'healthy',
      service: 'stripe',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      service: 'stripe',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, { status: 503 });
  }
}
```

---

## Conclusion

Following these best practices ensures:
- ✅ Secure payment processing
- ✅ PCI compliance
- ✅ Optimal performance
- ✅ Reliable webhook handling
- ✅ Effective fraud prevention
- ✅ Clear error messages
- ✅ Scalable architecture

**Remember:** Security and user experience go hand in hand. Never compromise on either.

---

**Next Steps:**
- Review [API-REFERENCE.md](./API-REFERENCE.md) for detailed API docs
- Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for common issues
- Implement monitoring and alerting
- Set up automated testing
- Schedule regular security audits