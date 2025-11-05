# Price Validation Guide

## Overview

All product prices MUST be validated server-side before processing payments. Never trust client-provided prices.

## Quick Start

### Import the Pricing Service

```typescript
import { calculateProductPrice, validatePrice } from '@/lib/pricing'
```

### Calculate Server-Side Price

```typescript
// Get the real price from Printful API
const serverPrice = await calculateProductPrice(productId, variantId)
// Returns: 149.99 (in USD dollars)
```

### Validate Client Price

```typescript
// Validate client-provided price against server price
const validation = await validatePrice(clientPrice, productId, variantId)

if (!validation.valid) {
  // Price mismatch - reject transaction
  return NextResponse.json(
    { error: 'Price verification failed. Please refresh and try again.' },
    { status: 400 }
  )
}

// Always use SERVER price for Stripe
const stripeAmount = Math.round(validation.serverPrice * 100)
```

## API Reference

### `calculateProductPrice(productId, variantId)`

Calculates the retail price for a product variant.

**Parameters:**
- `productId` (number): Printful catalog product ID
- `variantId` (number): Printful catalog variant ID

**Returns:** `Promise<number>` - Price in USD dollars (not cents)

**Example:**
```typescript
const price = await calculateProductPrice(301, 10513)
// Returns: 149.99
```

**Throws:** Error if unable to fetch from Printful API

---

### `validatePrice(clientPrice, productId, variantId)`

Validates client-provided price against server-calculated price.

**Parameters:**
- `clientPrice` (number): Price provided by client in USD dollars
- `productId` (number): Printful catalog product ID
- `variantId` (number): Printful catalog variant ID

**Returns:** `Promise<ValidationResult>`

```typescript
interface ValidationResult {
  valid: boolean          // true if prices match (within 1 cent)
  serverPrice: number     // Actual price from Printful
  clientPrice: number     // Price provided by client
  difference: number      // Absolute difference
}
```

**Example:**
```typescript
const result = await validatePrice(149.99, 301, 10513)

if (result.valid) {
  console.log('✅ Price validated')
} else {
  console.log('❌ Price mismatch detected')
  console.log(`Client: $${result.clientPrice}`)
  console.log(`Server: $${result.serverPrice}`)
  console.log(`Difference: $${result.difference}`)
}
```

---

### `validateCartPrices(items)`

Batch validation for multiple cart items (more efficient).

**Parameters:**
```typescript
items: Array<{
  productId: number
  variantId: number
  price: number
}>
```

**Returns:** `Promise<ValidationResult[]>`

**Example:**
```typescript
const items = [
  { productId: 301, variantId: 10513, price: 149.99 },
  { productId: 302, variantId: 10520, price: 89.99 },
]

const results = await validateCartPrices(items)

const allValid = results.every(r => r.valid)
if (!allValid) {
  const invalid = results.filter(r => !r.valid)
  console.error('Invalid prices detected:', invalid)
}
```

---

### `clearPriceCache()`

Clears the price cache (useful for testing or manual updates).

**Example:**
```typescript
import { clearPriceCache } from '@/lib/pricing'

clearPriceCache()
console.log('Cache cleared')
```

---

### `getCacheStats()`

Returns cache statistics for monitoring.

**Returns:**
```typescript
{
  size: number
  entries: Array<{
    key: string      // "productId-variantId"
    price: number    // Cached price
    age: number      // Age in seconds
  }>
}
```

**Example:**
```typescript
import { getCacheStats } from '@/lib/pricing'

const stats = getCacheStats()
console.log(`Cache size: ${stats.size}`)
console.log(`Entries:`, stats.entries)
```

## Pricing Strategy

Prices are calculated using luxury art pricing:

| Product Type | Markup | Margin | Base $50 → Retail |
|-------------|--------|--------|-------------------|
| Canvas      | 2.8x   | 64%    | $140.00          |
| Posters     | 2.5x   | 60%    | $125.00          |
| Apparel     | 2.3x   | 57%    | $115.00          |
| Mugs        | 2.7x   | 63%    | $135.00          |
| Home Decor  | 2.6x   | 62%    | $130.00          |

**Minimum Price:** $19.99 (enforced on all products)

## Caching

Prices are cached for **5 minutes** to reduce API calls:

- First request: Fetches from Printful API (~300-500ms)
- Cached requests: Returns immediately (~<1ms)
- Cache hit rate: ~95% in typical usage
- TTL: 5 minutes (300 seconds)
- Automatic invalidation after TTL

## Error Handling

### Client-Side Errors

**Invalid Product Data:**
```json
{
  "error": "Invalid product data. Please refresh the page and try again."
}
```
HTTP Status: 400

**Price Mismatch:**
```json
{
  "error": "Price verification failed. Prices may have changed. Please refresh the page and try again.",
  "details": "The price in your cart does not match current pricing."
}
```
HTTP Status: 400

### Server-Side Errors

**Printful API Failure:**
```json
{
  "error": "Unable to verify product pricing. Please try again in a moment.",
  "details": "Price validation service temporarily unavailable."
}
```
HTTP Status: 503

## Security Logging

All price validations are logged:

**Successful Validation:**
```
✅ Price validated for Premium Canvas: $149.99
{ productId: 301, variantId: 10513 }
```

**Failed Validation:**
```
[ERROR] Price validation failed - security breach attempt or stale data
{
  productId: 301,
  variantId: 10513,
  clientPrice: 0.01,
  serverPrice: 149.99,
  difference: 149.98,
  productTitle: "Premium Canvas Print"
}
```

Monitor logs for repeated failures - may indicate attack attempts.

## Testing

### Test Endpoint

```bash
# Run automated tests
curl -X POST http://localhost:3000/api/test-pricing
```

### Manual Testing

```typescript
import { validatePrice } from '@/lib/pricing'

// Test 1: Valid price (should pass)
const test1 = await validatePrice(149.99, 301, 10513)
console.assert(test1.valid === true, 'Valid price should pass')

// Test 2: Tampered price (should fail)
const test2 = await validatePrice(0.01, 301, 10513)
console.assert(test2.valid === false, 'Tampered price should fail')

// Test 3: Cache hit (should be fast)
const start = Date.now()
await calculateProductPrice(301, 10513)
const duration = Date.now() - start
console.assert(duration < 10, 'Cache hit should be <10ms')
```

## Best Practices

### ✅ DO

- Always validate prices server-side before payment
- Use server-calculated price for Stripe/payment processors
- Log all validation attempts for monitoring
- Handle errors gracefully with user-friendly messages
- Use batch validation for multiple items
- Cache prices to improve performance

### ❌ DON'T

- Never trust client-provided prices
- Don't skip validation "just this once"
- Don't use client price for Stripe amount
- Don't expose raw API errors to users
- Don't bypass cache in production
- Don't ignore validation failures

## Example: Complete Checkout Flow

```typescript
import { validatePrice } from '@/lib/pricing'
import Stripe from 'stripe'

export async function POST(request: Request) {
  const { items } = await request.json()

  const lineItems = []

  for (const item of items) {
    // Parse client data
    const clientPrice = parseFloat(item.price)
    const productId = parseInt(item.productId)
    const variantId = parseInt(item.variantId)

    // Validate price server-side
    const validation = await validatePrice(
      clientPrice,
      productId,
      variantId
    )

    // Reject if price doesn't match
    if (!validation.valid) {
      return NextResponse.json(
        { error: 'Price verification failed. Please refresh and try again.' },
        { status: 400 }
      )
    }

    // Use SERVER price for Stripe
    lineItems.push({
      price_data: {
        currency: 'usd',
        product_data: { name: item.title },
        unit_amount: Math.round(validation.serverPrice * 100),
      },
      quantity: item.quantity,
    })
  }

  // Create Stripe checkout session
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
  const session = await stripe.checkout.sessions.create({
    line_items: lineItems,
    mode: 'payment',
    // ... other options
  })

  return NextResponse.json({ url: session.url })
}
```

## Troubleshooting

### Price validation failing for valid prices

**Cause:** Stale cache or Printful API price change

**Solution:**
```typescript
import { clearPriceCache } from '@/lib/pricing'
clearPriceCache()
```

### Slow checkout performance

**Cause:** Cache not working or TTL too short

**Solution:**
- Check cache stats: `getCacheStats()`
- Verify cache TTL (should be 5 minutes)
- Consider increasing TTL for stable products

### Printful API errors

**Cause:** Invalid API credentials or rate limiting

**Solution:**
- Verify `PRINTFUL_API_KEY` and `PRINTFUL_STORE_ID`
- Check Printful API status
- Implement exponential backoff for retries

## Support

For questions or issues:
1. Check `/lib/pricing.ts` implementation
2. Review `SECURITY_FIX_REPORT.md` for details
3. Run test endpoint: `POST /api/test-pricing`
4. Check application logs for validation failures
