# Printful Integration Best Practices

Comprehensive guide to implementing Printful the right way for optimal performance, cost, and user experience.

## TABLE OF CONTENTS

1. [Product Catalog Management](#product-catalog-management)
2. [Image & Design Requirements](#image--design-requirements)
3. [Pricing Strategies](#pricing-strategies)
4. [Order Processing](#order-processing)
5. [Shipping & Fulfillment](#shipping--fulfillment)
6. [Tax & International](#tax--international)
7. [Performance Optimization](#performance-optimization)
8. [Quality Control](#quality-control)
9. [Customer Experience](#customer-experience)
10. [Cost Management](#cost-management)

---

## PRODUCT CATALOG MANAGEMENT

### Product Selection Strategy

**DO:**
- ✓ Start with 10-20 core products
- ✓ Focus on popular, high-margin items
- ✓ Choose products with fast fulfillment (2-5 days)
- ✓ Select products from same fulfillment center when possible
- ✓ Test products yourself before selling
- ✓ Use Bella + Canvas for premium quality

**DON'T:**
- ✗ List every product Printful offers
- ✗ Offer products you haven't tested
- ✗ Mix low/high-quality brands
- ✗ Include products with long fulfillment times
- ✗ Add products without checking reviews

### Recommended Product Mix

```
Apparel (60%):
- Bella + Canvas 3001 Unisex T-Shirt (bestseller)
- Gildan 18000 Heavy Blend Crewneck Sweatshirt
- Port & Company PC90H Core Fleece Pullover Hoodie

Home & Living (25%):
- Ceramic Mug 11oz
- Canvas Print
- Throw Pillow

Accessories (15%):
- Stickers (high margin)
- Tote Bag
- Phone Cases
```

### Variant Management

**Best Practices:**
- Only offer sizes that sell (skip 3XL+ unless there's demand)
- Limit color options to 5-8 per design
- Display most popular color first
- Show size chart on every product page
- Indicate "bestseller" sizes

**Optimal Color Palette:**
```typescript
const popularColors = [
  'Black',      // Always #1 seller
  'White',      // Clean, versatile
  'Navy',       // Professional
  'Heather Grey', // Soft, comfortable
  'Forest Green', // Unique
]
```

### Catalog Sync Strategy

**Frequency:**
- Products: Once per day (off-peak hours)
- Pricing: When Printful costs change (webhook)
- Stock: Real-time via webhooks
- Mockups: On-demand or pre-generate top 20%

**Implementation:**
```typescript
// Good: Incremental sync
async function syncCatalog() {
  const lastSync = await getLastSyncTime()
  const updates = await printful.fetchUpdatedProducts(lastSync)

  for (const product of updates) {
    await upsertProduct(product)
  }

  await setLastSyncTime(new Date())
}

// Bad: Full catalog replacement
async function syncCatalog() {
  const allProducts = await printful.fetchAllProducts()
  await deleteAllProducts()  // ❌ Loses historical data
  await insertProducts(allProducts)
}
```

---

## IMAGE & DESIGN REQUIREMENTS

### Print File Specifications

| Aspect | Requirement | Recommendation |
|--------|-------------|----------------|
| Resolution | 300 DPI minimum | 300-600 DPI |
| Color Space | sRGB | sRGB with embedded profile |
| Format | PNG or JPG | PNG with transparency |
| File Size | < 20MB | 5-10MB ideal |
| Bit Depth | 8-bit minimum | 8-bit (16-bit unnecessary) |

### Design Placement Guide

**T-Shirt Front (Bella + Canvas 3001):**
```javascript
{
  "placement": "front",
  "position": {
    "area_width": 1800,   // Full printable width
    "area_height": 2400,  // Full printable height
    "width": 1800,        // Design width
    "height": 1800,       // Design height (square)
    "top": 300,           // 3" from top
    "left": 0             // Centered
  }
}
```

**T-Shirt Back:**
```javascript
{
  "placement": "back",
  "position": {
    "area_width": 1800,
    "area_height": 2400,
    "width": 1600,        // Slightly smaller
    "height": 1600,
    "top": 400,
    "left": 100
  }
}
```

### Mockup Generation Best Practices

**DO:**
- ✓ Generate 3-5 angles per product
- ✓ Use lifestyle mockups for featured products
- ✓ Show product on model when possible
- ✓ Include close-up of print quality
- ✓ Use consistent background (white or lifestyle)

**DON'T:**
- ✗ Generate mockups for every color/size combo
- ✗ Use low-quality source images
- ✗ Over-compress mockup images
- ✗ Mix mockup styles on same product page

**Optimization:**
```typescript
// Good: Selective mockup generation
const popularVariants = products
  .filter(p => p.sales > 10)  // Only popular items
  .slice(0, 3)                // Top 3 colors

for (const variant of popularVariants) {
  await generateMockup(variant, ['front', 'lifestyle'])
}

// Bad: Generate everything
for (const variant of allVariants) {  // ❌ Expensive!
  await generateMockup(variant, ['front', 'back', 'detail', 'lifestyle'])
}
```

### Image Quality Checklist

Before uploading any design:
- [ ] Resolution is 300 DPI or higher
- [ ] Color mode is sRGB
- [ ] File format is PNG (preferred) or high-quality JPG
- [ ] Transparent areas are truly transparent (not white)
- [ ] Design fits within safe zone (0.25" from edges)
- [ ] Text is at least 6pt (8pt recommended)
- [ ] Small details are visible at print size
- [ ] Colors are vibrant (slightly oversaturate for print)

---

## PRICING STRATEGIES

### Markup Formula

**Standard Markup:**
```typescript
// Conservative (safe margins)
const retailPrice = printfulCost * 2.5

// Competitive (balanced)
const retailPrice = printfulCost * 2.8

// Premium (luxury positioning)
const retailPrice = printfulCost * 3.2

// Round to psychological pricing
const finalPrice = Math.ceil(retailPrice / 5) * 5  // Round to nearest $5
```

### Real Example:

```typescript
// Bella + Canvas 3001 T-Shirt
const printfulCost = 13.00   // From API

// Conservative: $13 * 2.5 = $32.50 → $35.00
// Competitive: $13 * 2.8 = $36.40 → $35.00
// Premium: $13 * 3.2 = $41.60 → $40.00

// Recommended: $35 (2.7x markup)
```

### Price Tiers by Product Type

| Product Type | Cost Range | Recommended Retail | Margin |
|--------------|------------|-------------------|---------|
| T-Shirts | $10-15 | $28-42 | ~$20 |
| Hoodies | $25-35 | $65-95 | ~$45 |
| Mugs | $8-12 | $22-32 | ~$15 |
| Stickers | $2-5 | $5-12 | ~$5 |
| Canvas Prints | $15-40 | $45-110 | ~$35 |

### Dynamic Pricing Strategies

**Volume Discounts:**
```typescript
function calculatePrice(basePrice: number, quantity: number): number {
  if (quantity >= 5) return basePrice * 0.90      // 10% off
  if (quantity >= 3) return basePrice * 0.95      // 5% off
  return basePrice
}
```

**Seasonal Adjustments:**
```typescript
// Higher margins during peak seasons
const seasonalMultiplier = {
  'Q4': 1.1,      // Holiday season
  'Q1': 0.95,     // Post-holiday sales
  'Q2': 1.0,      // Standard
  'Q3': 1.05,     // Back-to-school
}
```

**Shipping Costs:**
```typescript
// Option 1: Build into price
const priceWithShipping = basePrice + averageShipping

// Option 2: Free shipping threshold
const freeShippingThreshold = 75  // $75+ orders

// Option 3: Flat rate
const flatShipping = 5.99  // Under $50
```

### Competitive Analysis

Research competitors:
1. Find 3-5 similar stores
2. Compare prices for same products
3. Position yourself accordingly:
   - **Budget:** 10-20% below average
   - **Mid-range:** At average
   - **Premium:** 20-40% above average

---

## ORDER PROCESSING

### Order Flow Best Practices

**1. Order Creation:**
```typescript
async function createPrintfulOrder(cartItems: CartItem[], customer: Customer) {
  // Step 1: Validate cart
  const validation = await validateCartStock(cartItems)
  if (!validation.valid) {
    throw new Error('Some items are out of stock')
  }

  // Step 2: Create draft order
  const draftOrder = await printful.createOrder({
    external_id: generateOrderId(),  // Your internal ID
    recipient: formatAddress(customer),
    items: cartItems.map(formatOrderItem),
  })

  // Step 3: Calculate shipping
  const shipping = await printful.estimateShipping(draftOrder.id)

  // Step 4: Calculate tax (if applicable)
  const tax = await printful.calculateTax(draftOrder.id)

  // Step 5: Confirm order
  const confirmedOrder = await printful.confirmOrder(draftOrder.id, {
    confirm: true,
    shipping: shipping.fastest,  // or customer choice
  })

  // Step 6: Store in database
  await saveOrder({
    id: confirmedOrder.id,
    printfulId: confirmedOrder.printful_id,
    status: 'confirmed',
    customer: customer.id,
    total: confirmedOrder.total,
  })

  return confirmedOrder
}
```

**2. Error Handling:**
```typescript
try {
  const order = await createPrintfulOrder(cart, customer)
} catch (error) {
  if (error.code === 'OUT_OF_STOCK') {
    // Notify customer, suggest alternatives
    await sendOutOfStockEmail(customer, error.items)
  } else if (error.code === 'INVALID_ADDRESS') {
    // Request address correction
    await requestAddressCorrection(customer)
  } else if (error.code === 'PAYMENT_FAILED') {
    // Retry payment or request new method
    await handlePaymentFailure(customer, order)
  } else {
    // Log and notify admin
    await logError(error)
    await notifyAdmin('Order creation failed', error)
  }
}
```

### Order Timing Optimization

**When to Submit to Printful:**
```typescript
// Good: Wait for payment confirmation
stripe.webhooks.on('payment_intent.succeeded', async (event) => {
  await createPrintfulOrder(event.metadata.orderId)
})

// Bad: Submit before payment
app.post('/checkout', async (req, res) => {
  await createPrintfulOrder(req.body)  // ❌ What if payment fails?
  await processPayment(req.body)
})
```

### Batch Order Processing

For high volume:
```typescript
// Process orders in batches during off-peak hours
async function processPendingOrders() {
  const pending = await getPendingOrders()
  const batches = chunk(pending, 10)  // 10 orders per batch

  for (const batch of batches) {
    await Promise.all(batch.map(submitToPrintful))
    await delay(1000)  // Respect rate limits
  }
}

// Run every hour
cron.schedule('0 * * * *', processPendingOrders)
```

---

## SHIPPING & FULFILLMENT

### Shipping Method Selection

**Available Methods:**
| Method | Speed | Cost | Use Case |
|--------|-------|------|----------|
| Standard | 5-7 days | $4-8 | Default |
| Expedited | 2-5 days | $12-18 | Rush orders |
| Overnight | 1-2 days | $25-40 | Emergency |

**Best Practices:**
- Set Standard as default (best value)
- Offer Expedited for $10-15 upgrade
- Only show Overnight for high-value orders (>$100)
- Display estimated delivery date, not shipping time
- Build shipping into price when possible

### Shipping Cost Strategies

**Strategy 1: Free Shipping Threshold**
```typescript
const freeShippingThreshold = 75

function getShippingCost(subtotal: number): number {
  if (subtotal >= freeShippingThreshold) return 0
  return 5.99  // Flat rate
}

// Encourage larger orders
const remainingForFree = freeShippingThreshold - subtotal
// "Add $15 more for free shipping!"
```

**Strategy 2: Build Into Price**
```typescript
// Add average shipping to product price
const avgShipping = 6.50
const priceWithShipping = basePrice + (avgShipping / avgItemsPerOrder)

// Then offer "free shipping" on all orders
```

**Strategy 3: Flat Rate**
```typescript
const shippingCost = {
  'US': 5.99,
  'CA': 9.99,
  'EU': 12.99,
  'ROW': 14.99,
}
```

### International Fulfillment

**Printful Fulfillment Centers:**
- USA (California, North Carolina, Texas)
- Mexico (Tijuana)
- Europe (Latvia, Spain)
- Canada (Toronto)
- Japan (Tokyo)

**Strategy:**
```typescript
// Route orders to nearest fulfillment center
function selectFulfillmentCenter(country: string): string {
  const regions = {
    'US': 'USA',
    'CA': 'Canada',
    'MX': 'Mexico',
    'EU': ['Latvia', 'Spain'],  // Auto-selected by Printful
    'JP': 'Japan',
  }

  return regions[country] || 'USA'  // Default to USA
}
```

### Delivery Time Estimates

**Formula:**
```typescript
function estimateDelivery(country: string, method: string): string {
  const production = 3  // Business days
  const shipping = {
    'US_STANDARD': 5,
    'US_EXPEDITED': 3,
    'INTERNATIONAL': 12,
  }

  const total = production + shipping[`${country}_${method}`]
  const date = addBusinessDays(new Date(), total)

  return `Estimated delivery: ${formatDate(date)}`
}
```

### Order Tracking

**Best Practices:**
```typescript
// 1. Store tracking info from webhook
webhook.on('package_shipped', async (event) => {
  await updateOrder(event.order.id, {
    trackingNumber: event.shipment.tracking_number,
    trackingUrl: event.shipment.tracking_url,
    carrier: event.shipment.carrier,
    shippedAt: new Date(event.shipment.shipped_at),
  })

  // 2. Send customer notification
  await sendShippingEmail(event.order.recipient.email, {
    trackingNumber: event.shipment.tracking_number,
    trackingUrl: event.shipment.tracking_url,
  })
})

// 3. Provide tracking page
app.get('/track/:orderId', async (req, res) => {
  const order = await getOrder(req.params.orderId)
  res.render('tracking', { order })
})
```

---

## TAX & INTERNATIONAL

### Tax Configuration

**US Sales Tax:**
```typescript
// Printful handles tax calculation
const taxable = await printful.calculateTax({
  recipient: {
    country_code: 'US',
    state_code: 'CA',  // California
    zip: '90210',
  },
  items: orderItems,
})

// Apply to order
const orderTotal = subtotal + shipping + taxable.tax
```

**States Requiring Tax Collection:**
- All states where you have nexus (physical presence)
- States where you meet economic nexus ($100k+ sales)
- Check: https://www.taxjar.com/sales-tax-calculator

### International Taxes & Duties

**VAT (Europe):**
```typescript
// Printful can collect VAT for EU orders
const orderWithVAT = await printful.createOrder({
  ...orderData,
  retail_costs: {
    currency: 'EUR',
    subtotal: calculateSubtotal(),
    discount: 0,
    shipping: shippingCost,
    tax: calculatedVAT,  // 19-27% depending on country
  }
})
```

**Customs & Duties:**
- Orders >€150 to EU: Customs fees apply
- Orders to UK: 20% VAT + potential duties
- Orders to Canada: GST/HST + provincial taxes
- Orders to Australia: GST on orders >AUD 1000

**Best Practice:**
```typescript
// Warn customers about potential fees
function getInternationalWarning(country: string): string {
  if (country === 'GB') {
    return 'UK orders may be subject to 20% VAT and customs duties'
  }
  if (EU_COUNTRIES.includes(country)) {
    return 'Orders over €150 may incur customs fees'
  }
  // etc...
}
```

### Currency Handling

**Multi-Currency Pricing:**
```typescript
const prices = {
  'USD': 35.00,
  'EUR': 32.00,  // Not just conversion!
  'GBP': 28.00,
  'CAD': 45.00,
}

// Account for:
// - Local purchasing power
// - Shipping costs
// - Tax implications
// - Currency conversion fees
```

---

## PERFORMANCE OPTIMIZATION

### Caching Strategy

**Product Catalog:**
```typescript
// Cache products for 24 hours
const CACHE_TTL = 24 * 60 * 60 * 1000

async function getProducts(): Promise<Product[]> {
  const cached = await redis.get('products:all')

  if (cached) {
    return JSON.parse(cached)
  }

  const products = await printful.fetchProducts()
  await redis.setex('products:all', CACHE_TTL / 1000, JSON.stringify(products))

  return products
}
```

**Mockup URLs:**
```typescript
// Cache mockups permanently (don't regenerate)
const mockupKey = `mockup:${productId}:${variantId}`
const cached = await redis.get(mockupKey)

if (!cached) {
  const mockup = await printful.generateMockup(productId, variantId)
  await redis.set(mockupKey, mockup.url)  // No expiration
}
```

### API Request Optimization

**Batch Requests:**
```typescript
// Good: Batch product details
const productIds = [71, 72, 73, 74]
const products = await printful.fetchProductsBulk(productIds)

// Bad: Individual requests
for (const id of productIds) {
  await printful.fetchProduct(id)  // ❌ 4x slower, 4x API calls
}
```

**Parallel Processing:**
```typescript
// Good: Parallel independent requests
const [products, categories, shipping] = await Promise.all([
  printful.fetchProducts(),
  printful.fetchCategories(),
  printful.getShippingMethods(),
])

// Bad: Sequential
const products = await printful.fetchProducts()
const categories = await printful.fetchCategories()  // ❌ Waited unnecessarily
```

### Rate Limit Management

```typescript
class RateLimiter {
  private requests: number[] = []
  private limit = 120  // requests per minute

  async throttle() {
    const now = Date.now()
    const windowStart = now - 60000

    // Remove old requests
    this.requests = this.requests.filter(t => t > windowStart)

    if (this.requests.length >= this.limit) {
      const oldestRequest = this.requests[0]
      const waitTime = 60000 - (now - oldestRequest)
      await delay(waitTime)
    }

    this.requests.push(now)
  }
}

// Usage
await rateLimiter.throttle()
const result = await printful.api(endpoint)
```

### Database Optimization

**Index Strategy:**
```sql
-- Index frequently queried fields
CREATE INDEX idx_products_printful_id ON products(printful_id);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_in_stock ON products(in_stock);
CREATE INDEX idx_orders_printful_id ON orders(printful_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
```

**Query Optimization:**
```typescript
// Good: Select only needed fields
const products = await db.select({
  id: products.id,
  name: products.name,
  price: products.price,
}).from(products)

// Bad: Select everything
const products = await db.select().from(products)  // ❌ Wasteful
```

---

## QUALITY CONTROL

### Pre-Production Checks

**Automated Validation:**
```typescript
async function validatePrintFile(file: File): Promise<ValidationResult> {
  const errors: string[] = []

  // Check resolution
  const dpi = await getImageDPI(file)
  if (dpi < 300) {
    errors.push(`Resolution too low: ${dpi} DPI (need 300+)`)
  }

  // Check dimensions
  const dimensions = await getImageDimensions(file)
  if (dimensions.width < 1800 || dimensions.height < 1800) {
    errors.push(`Image too small: ${dimensions.width}x${dimensions.height}`)
  }

  // Check color space
  const colorSpace = await getColorSpace(file)
  if (colorSpace !== 'sRGB') {
    errors.push(`Wrong color space: ${colorSpace} (need sRGB)`)
  }

  // Check file size
  if (file.size > 20 * 1024 * 1024) {
    errors.push(`File too large: ${formatBytes(file.size)} (max 20MB)`)
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}
```

### Test Orders

**Sample Everything:**
```typescript
// Before launching, order samples of:
const testProducts = [
  'Bella + Canvas 3001 (Black, S)',
  'Gildan 18000 (Navy, M)',
  'Ceramic Mug',
  'Sticker Sheet',
]

// Checklist for each:
// - Print quality acceptable?
// - Colors accurate?
// - Sizing correct?
// - Material as expected?
// - Packaging adequate?
```

### Customer Feedback Loop

**Monitor Quality Issues:**
```typescript
// Track quality complaints
interface QualityIssue {
  orderId: string
  productId: string
  issue: 'print_quality' | 'sizing' | 'damage' | 'color_mismatch'
  severity: 'minor' | 'major'
  resolution: 'reprint' | 'refund' | 'discount'
}

// Alert if quality rate drops
const qualityRate = (totalOrders - qualityIssues) / totalOrders
if (qualityRate < 0.95) {
  await alertAdmin('Quality rate below 95%', qualityIssues)
}
```

---

## CUSTOMER EXPERIENCE

### Order Updates

**Communication Timeline:**
```typescript
const notifications = {
  'order_placed': {
    timing: 'Immediate',
    message: 'Order confirmed! We\'re preparing your items.',
  },
  'in_production': {
    timing: '1-2 days',
    message: 'Your order is now in production.',
  },
  'shipped': {
    timing: '3-5 days',
    message: 'Your order has shipped! Track: {tracking_url}',
  },
  'delivered': {
    timing: '5-12 days',
    message: 'Your order was delivered. How does it look?',
  },
  'review_request': {
    timing: '7 days after delivery',
    message: 'Love your purchase? Leave a review!',
  },
}
```

### Returns & Exchanges

**Policy:**
```markdown
## Return Policy

We want you to love your purchase! If you're not satisfied:

- **Damaged/Defective:** We'll replace or refund within 30 days
- **Wrong Item:** We'll send the correct item at no charge
- **Don't Like It:** Returns accepted within 14 days (customer pays return shipping)

Process:
1. Contact support@brandonmills.com
2. Provide order # and photos (if damaged)
3. We'll send a return label or replacement
4. Refund processed within 5 business days
```

**Implementation:**
```typescript
async function handleReturn(orderId: string, reason: string) {
  const order = await getOrder(orderId)

  if (reason === 'damaged' || reason === 'wrong_item') {
    // Printful's fault - they cover it
    await printful.requestReturn(order.printfulId, {
      reason,
      notes: 'Quality issue',
    })

    // Immediately send replacement
    await printful.createOrder({
      ...order.originalData,
      external_id: `${order.id}-replacement`,
    })

  } else {
    // Customer return - they pay shipping
    await sendReturnLabel(order.customer.email, order.id)
  }
}
```

### Size Guide

**Provide Detailed Measurements:**
```typescript
const sizeGuide = {
  'Bella + Canvas 3001': {
    'S': { chest: 34-37, length: 28 },
    'M': { chest: 38-41, length: 29 },
    'L': { chest: 42-45, length: 30 },
    'XL': { chest: 46-49, length: 31 },
    '2XL': { chest: 50-53, length: 32 },
  }
}

// Show fit recommendations
const fitGuide = {
  'slim': 'Size down for a tighter fit',
  'regular': 'True to size',
  'relaxed': 'Size up for a looser fit',
}
```

---

## COST MANAGEMENT

### Profit Margin Analysis

**Track Per-Product Margins:**
```typescript
interface ProductMetrics {
  productId: string
  unitsSold: number
  revenue: number
  printfulCost: number
  shippingCost: number
  marketingCost: number
  profit: number
  margin: number  // (profit / revenue) * 100
}

// Identify best/worst performers
const topProducts = products
  .filter(p => p.unitsSold > 10)
  .sort((a, b) => b.margin - a.margin)
  .slice(0, 10)

// Focus on high-margin items
```

### Bulk Ordering

**Printful Discounts:**
```typescript
// Volume discounts (10+ same item)
const bulkPricing = {
  1: 13.00,    // Regular price
  10: 11.70,   // 10% off
  50: 10.40,   // 20% off
  100: 9.75,   // 25% off
}

// Strategy: Pre-order popular items
// Store inventory yourself
// Fulfill faster + higher margins
```

### Shipping Cost Optimization

**Strategies:**
```typescript
// 1. Combine items from same fulfillment center
function optimizeOrder(items: OrderItem[]): Order[] {
  const byCenter = groupBy(items, 'fulfillmentCenter')

  return Object.values(byCenter).map(items => ({
    items,
    shipping: calculateShipping(items),  // Cheaper together
  }))
}

// 2. Offer multi-item discounts
const discount = items.length >= 3 ? 0.10 : 0  // 10% off 3+

// 3. Build shipping into price
const productPrice = cost * 2.8 + (avgShipping / avgItemsPerOrder)
```

### Marketing Cost Tracking

```typescript
// Track customer acquisition cost (CAC)
const cac = marketingSpend / newCustomers

// Calculate customer lifetime value (LTV)
const ltv = avgOrderValue * purchaseFrequency * avgLifespan

// Ensure LTV > 3x CAC for healthy growth
if (ltv / cac < 3) {
  // Reduce marketing spend or improve retention
}
```

---

## CHECKLIST: READY TO LAUNCH?

### Product Setup
- [ ] 10-20 core products selected
- [ ] All products tested personally
- [ ] High-quality mockups generated
- [ ] Accurate size guides provided
- [ ] Pricing reviewed (2.5-3x markup)

### Technical Implementation
- [ ] Printful API connected
- [ ] Products sync daily
- [ ] Orders submit automatically
- [ ] Webhooks configured
- [ ] Error handling tested

### Customer Experience
- [ ] Order confirmation emails working
- [ ] Shipping notifications sending
- [ ] Tracking links functional
- [ ] Return policy clear
- [ ] Support email active

### Financial
- [ ] Profit margins calculated
- [ ] Shipping strategy decided
- [ ] Tax collection configured
- [ ] Payment processing tested
- [ ] Printful billing set up

### Quality Assurance
- [ ] Sample orders placed
- [ ] Print quality verified
- [ ] Sizing accurate
- [ ] Colors match expectations
- [ ] Packaging acceptable

---

**Remember:** Start small, test thoroughly, scale gradually. Focus on quality over quantity. Happy customers lead to sustainable growth.

**Last Updated:** November 5, 2025
**Version:** 1.0
**Maintained By:** Printful Integration Specialist