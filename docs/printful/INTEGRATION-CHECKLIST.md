# Printful Integration Checklist

Complete step-by-step guide for integrating Printful with Brandon Mills' e-commerce platform.

## PRE-INTEGRATION REQUIREMENTS

### 1. Printful Account Setup
- [ ] Create Printful account at printful.com
- [ ] Complete store profile
- [ ] Add billing information
- [ ] Verify email address
- [ ] Enable two-factor authentication

### 2. API Access
- [ ] Navigate to Settings > Stores > Add Store
- [ ] Select "Custom Integration (API)"
- [ ] Generate API key
- [ ] Store API key securely
- [ ] Note Store ID
- [ ] Test API connectivity

### 3. Environment Configuration
- [ ] Add to `.env.local`:
  ```env
  PRINTFUL_API_KEY=your_api_key_here
  PRINTFUL_STORE_ID=your_store_id
  PRINTFUL_WEBHOOK_SECRET=your_webhook_secret
  PRINTFUL_SANDBOX_MODE=true  # Start in sandbox
  ```
- [ ] Add to Vercel environment variables
- [ ] Verify environment variables load

### 4. Dependencies
- [ ] Install required packages:
  ```bash
  npm install axios
  npm install @types/node --save-dev
  ```
- [ ] Verify TypeScript configuration
- [ ] Check Node.js version (>= 18.0.0)

## PHASE 1: API CLIENT SETUP

### 1.1 Create Core Client
- [ ] Create `/lib/printful-client.ts`
- [ ] Implement authentication
- [ ] Add rate limiting (120 req/min)
- [ ] Add error handling
- [ ] Add retry logic with exponential backoff
- [ ] Test basic connectivity

```typescript
// Example test
const client = new PrintfulClient(process.env.PRINTFUL_API_KEY!)
const products = await client.fetchProducts()
console.log(`Fetched ${products.length} products`)
```

### 1.2 Implement Core Methods
- [ ] `fetchProducts(category?: number)`
- [ ] `fetchProductDetails(id: number)`
- [ ] `fetchVariantDetails(id: number)`
- [ ] `createOrder(orderData: OrderRequest)`
- [ ] `confirmOrder(orderId: string)`
- [ ] `getOrderStatus(orderId: string)`
- [ ] `estimateShipping(orderData: ShippingRequest)`
- [ ] `calculateTax(orderData: TaxRequest)`

### 1.3 Test Client
- [ ] Run test suite
- [ ] Verify all endpoints
- [ ] Check error handling
- [ ] Test rate limiting
- [ ] Validate response parsing

## PHASE 2: PRODUCT CATALOG SYNC

### 2.1 Product Fetching
- [ ] Fetch full catalog from Printful API
- [ ] Filter by category (if applicable)
- [ ] Map Printful products to internal schema
- [ ] Handle pagination (if needed)
- [ ] Cache results

```typescript
// Categories
// 24 - Apparel
// 27 - Home & Living
// 32 - Accessories
```

### 2.2 Variant Management
- [ ] Fetch all variants for each product
- [ ] Parse size/color options
- [ ] Check stock availability
- [ ] Map variant IDs correctly
- [ ] Handle out-of-stock items

### 2.3 Pricing Strategy
- [ ] Calculate cost from Printful API
- [ ] Apply markup (recommended: 2.5x - 3x)
- [ ] Add shipping estimates
- [ ] Consider tax implications
- [ ] Set final retail price

```typescript
// Pricing formula
const retailPrice = Math.ceil((printfulCost * 2.8) / 5) * 5
// Rounds to nearest $5
```

### 2.4 Data Storage
- [ ] Create product database schema
- [ ] Store products with variants
- [ ] Cache product images
- [ ] Save mockup URLs
- [ ] Set cache expiration (24 hours)

```json
// Example structure
{
  "id": "printful_71_4011",
  "printfulProductId": 71,
  "printfulVariantId": 4011,
  "name": "Bella + Canvas 3001 Unisex T-Shirt",
  "brand": "Bella + Canvas",
  "color": "Black",
  "size": "S",
  "price": 3500,  // cents
  "cost": 1300,   // cents
  "inStock": true,
  "images": ["url1", "url2"],
  "lastSynced": "2025-11-05T10:00:00Z"
}
```

## PHASE 3: MOCKUP GENERATION

### 3.1 Design File Preparation
- [ ] Verify artwork resolution (300 DPI minimum)
- [ ] Convert to sRGB color space
- [ ] Export as PNG with transparency
- [ ] Check file size (< 20MB)
- [ ] Validate dimensions per product template

### 3.2 Upload Files
- [ ] Use Printful File API
- [ ] Upload design files
- [ ] Store file IDs
- [ ] Verify upload success
- [ ] Handle upload errors

```typescript
POST /files
Content-Type: multipart/form-data

{
  "file": <binary>,
  "type": "default"  // or "preview", "back", etc.
}
```

### 3.3 Generate Mockups
- [ ] Create mockup generation task
- [ ] Set product template ID
- [ ] Position artwork correctly
- [ ] Select mockup views (front, back, lifestyle)
- [ ] Poll for task completion
- [ ] Download mockup URLs

```typescript
// Mockup task
POST /mockup-generator/create-task/{id}
{
  "variant_ids": [4011, 4012],
  "format": "jpg",
  "files": [
    {
      "placement": "front",
      "image_url": "https://...",
      "position": {
        "area_width": 1800,
        "area_height": 2400,
        "width": 1800,
        "height": 1800,
        "top": 300,
        "left": 0
      }
    }
  ]
}
```

### 3.4 Store Mockups
- [ ] Download generated mockups
- [ ] Upload to CDN (Vercel Blob/Cloudinary)
- [ ] Store URLs in database
- [ ] Associate with products
- [ ] Set alt text for SEO

## PHASE 4: ORDER PROCESSING

### 4.1 Order Flow Setup
- [ ] Create order API endpoint
- [ ] Integrate with Stripe webhooks
- [ ] Map customer data to Printful format
- [ ] Validate shipping address
- [ ] Handle international addresses

### 4.2 Order Creation
- [ ] Build order object from cart
- [ ] Map product variants to Printful IDs
- [ ] Add customer shipping info
- [ ] Create draft order in Printful
- [ ] Calculate shipping cost
- [ ] Add tax if applicable

```typescript
// Order structure
{
  "recipient": {
    "name": "John Doe",
    "address1": "123 Main St",
    "city": "New York",
    "state_code": "NY",
    "country_code": "US",
    "zip": "10001",
    "phone": "+1234567890",
    "email": "john@example.com"
  },
  "items": [
    {
      "variant_id": 4011,
      "quantity": 1,
      "files": [
        {
          "url": "https://example.com/design.png"
        }
      ]
    }
  ]
}
```

### 4.3 Order Confirmation
- [ ] Review order details
- [ ] Confirm order with Printful
- [ ] Store Printful order ID
- [ ] Send confirmation email
- [ ] Update order status in DB

### 4.4 Order Tracking
- [ ] Implement status polling
- [ ] Handle fulfillment updates
- [ ] Store tracking numbers
- [ ] Send shipping notifications
- [ ] Handle delivery confirmation

## PHASE 5: WEBHOOK INTEGRATION

### 5.1 Webhook Setup
- [ ] Create webhook endpoint `/api/printful/webhook`
- [ ] Generate webhook secret
- [ ] Configure in Printful dashboard
- [ ] Verify signature validation
- [ ] Test webhook delivery

### 5.2 Event Handlers
- [ ] `package_shipped`: Update order status, send email
- [ ] `package_returned`: Handle returns
- [ ] `order_failed`: Notify customer, refund
- [ ] `order_canceled`: Update status
- [ ] `product_synced`: Update catalog
- [ ] `stock_updated`: Update availability

```typescript
// Webhook signature validation
import crypto from 'crypto'

function validateWebhook(payload: string, signature: string): boolean {
  const hash = crypto
    .createHmac('sha256', process.env.PRINTFUL_WEBHOOK_SECRET!)
    .update(payload)
    .digest('hex')

  return hash === signature
}
```

### 5.3 Event Processing
- [ ] Queue webhook events
- [ ] Process asynchronously
- [ ] Handle retries
- [ ] Log all events
- [ ] Monitor failures

## PHASE 6: SHIPPING & TAX

### 6.1 Shipping Configuration
- [ ] Fetch available shipping methods
- [ ] Set default shipping method
- [ ] Offer expedited options
- [ ] Calculate costs accurately
- [ ] Handle international shipping

```typescript
// Common shipping methods
{
  "STANDARD": "Standard (5-7 business days)",
  "EXPEDITED": "Expedited (2-5 business days)",
  "OVERNIGHT": "Overnight"
}
```

### 6.2 Tax Calculation
- [ ] Enable tax calculation API
- [ ] Check tax requirements by state/country
- [ ] Calculate tax pre-checkout
- [ ] Include in order total
- [ ] Store tax amount

### 6.3 International Support
- [ ] Verify country support
- [ ] Handle customs forms
- [ ] Calculate duties/taxes
- [ ] Show total landed cost
- [ ] Provide clear disclaimers

## PHASE 7: TESTING

### 7.1 Sandbox Testing
- [ ] Enable sandbox mode
- [ ] Test product fetching
- [ ] Test order creation
- [ ] Test mockup generation
- [ ] Test webhook delivery
- [ ] Verify all error scenarios

### 7.2 Integration Testing
- [ ] End-to-end order flow
- [ ] Payment integration (Stripe)
- [ ] Email notifications
- [ ] Order tracking
- [ ] Returns/refunds
- [ ] Multi-item orders

### 7.3 Edge Cases
- [ ] Out of stock products
- [ ] Invalid addresses
- [ ] Failed payments
- [ ] Duplicate orders
- [ ] Rate limit handling
- [ ] Network timeouts

### 7.4 Performance Testing
- [ ] Load test API endpoints
- [ ] Test concurrent orders
- [ ] Verify caching works
- [ ] Check database performance
- [ ] Monitor API rate limits

## PHASE 8: PRODUCTION DEPLOYMENT

### 8.1 Pre-Launch
- [ ] Disable sandbox mode
- [ ] Update environment variables
- [ ] Clear test data
- [ ] Verify production API key
- [ ] Test with real products

### 8.2 Monitoring Setup
- [ ] Set up error logging (Sentry)
- [ ] Configure alerts for failures
- [ ] Monitor API usage
- [ ] Track order success rate
- [ ] Monitor fulfillment times

### 8.3 Documentation
- [ ] Document all API endpoints
- [ ] Create troubleshooting guide
- [ ] Write deployment runbook
- [ ] Document webhook events
- [ ] Create FAQ

### 8.4 Launch
- [ ] Deploy to production
- [ ] Test first real order
- [ ] Monitor closely for 24h
- [ ] Fix any issues immediately
- [ ] Collect customer feedback

## PHASE 9: OPTIMIZATION

### 9.1 Performance
- [ ] Implement caching strategy
- [ ] Optimize API calls
- [ ] Batch requests where possible
- [ ] Pre-generate popular mockups
- [ ] Use CDN for images

### 9.2 Cost Optimization
- [ ] Review markup strategy
- [ ] Analyze shipping costs
- [ ] Negotiate bulk discounts
- [ ] Optimize product selection
- [ ] Track profit margins

### 9.3 User Experience
- [ ] Add size guides
- [ ] Show delivery estimates
- [ ] Provide tracking updates
- [ ] Handle customer inquiries
- [ ] Collect reviews

## MAINTENANCE CHECKLIST

### Daily
- [ ] Monitor order processing
- [ ] Check webhook delivery
- [ ] Review error logs
- [ ] Track fulfillment status

### Weekly
- [ ] Sync product catalog
- [ ] Update pricing if costs changed
- [ ] Review out-of-stock items
- [ ] Analyze sales data

### Monthly
- [ ] Audit profit margins
- [ ] Review shipping performance
- [ ] Update product selection
- [ ] Optimize conversion funnel

## TROUBLESHOOTING QUICK REFERENCE

| Issue | Likely Cause | Solution |
|-------|-------------|----------|
| 401 Unauthorized | Invalid API key | Check environment variables |
| 429 Too Many Requests | Rate limit exceeded | Implement backoff, reduce frequency |
| Product not found | Variant ID mismatch | Re-sync catalog |
| Order creation fails | Invalid address | Validate address format |
| Mockup generation fails | Invalid file | Check DPI and dimensions |
| Webhook not received | Signature mismatch | Verify webhook secret |

## SUCCESS CRITERIA

Integration is complete when:
- ✓ Products sync successfully
- ✓ Mockups generate correctly
- ✓ Orders submit without errors
- ✓ Webhooks process reliably
- ✓ Shipping calculates accurately
- ✓ Customers receive tracking info
- ✓ Error rate < 1%
- ✓ Order fulfillment > 99%

## SUPPORT RESOURCES

- Printful API Docs: https://developers.printful.com
- Support Email: support@printful.com
- Status Page: https://status.printful.com
- Community Forum: https://forum.printful.com
- GitHub Examples: https://github.com/printful

---

**Last Updated:** November 5, 2025
**Version:** 1.0
**Maintained By:** Printful Integration Specialist