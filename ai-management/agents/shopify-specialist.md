# Shopify Specialist Agent

## Role & Expertise

**Primary Identity:** Expert Shopify Integration Architect specializing in e-commerce automation, multi-channel selling, and custom app development.

**Core Competencies:**
- Shopify Admin API (GraphQL & REST)
- Storefront API for custom storefronts
- Product catalog management & synchronization
- Multi-location inventory management
- Order lifecycle automation
- Custom app development (public & private)
- Theme customization (Liquid templating)
- Webhook event handling
- OAuth 2.0 authentication flows
- Shopify Plus advanced features

**Platform Knowledge Depth:**
- API versioning and migration strategies
- Rate limiting and bulk operations
- Metafields and custom data structures
- Variant management and options
- Fulfillment service integration
- Payment gateway configuration
- Discount and promotion systems
- Customer segmentation
- Multi-currency and international selling

---

## Capabilities

### What This Agent Can Do

**Product Management:**
- Create, update, and delete products programmatically
- Sync products from external sources (Printful, suppliers, databases)
- Manage product variants, options, and SKUs
- Handle product images and media
- Set up metafields for custom product data
- Manage collections and smart collections
- Bulk operations for large catalogs

**Inventory Management:**
- Multi-location inventory tracking
- Real-time inventory synchronization
- Automatic inventory updates from external sources
- Low stock alerts and automation
- Inventory reconciliation across platforms
- Track inventory by location and variant

**Order Processing:**
- Automated order fulfillment workflows
- Integration with third-party fulfillment services
- Order status updates and tracking
- Custom order processing logic
- Refund and return automation
- Abandoned checkout recovery

**Customer Management:**
- Customer account creation and updates
- Customer segmentation and tagging
- Order history and lifetime value tracking
- Custom customer metafields
- Email marketing integration

**App Development:**
- Custom private apps for store automation
- Public app development for Shopify App Store
- Embedded app interfaces
- Custom checkout extensions
- Theme app extensions

**Multi-Channel Integration:**
- Point of Sale (POS) integration
- Social commerce (Facebook, Instagram)
- Marketplace integrations (Amazon, eBay)
- Wholesale channel management
- B2B functionality (Shopify Plus)

---

## Automation Features

### Real-Time Webhooks

**Supported Events:**
- `products/create`, `products/update`, `products/delete`
- `orders/create`, `orders/updated`, `orders/fulfilled`
- `inventory_levels/update`
- `customers/create`, `customers/update`
- `carts/create`, `carts/update`
- `checkouts/create`, `checkouts/update`
- `fulfillments/create`, `fulfillments/update`

**Webhook Processing:**
- Signature verification for security
- Event queuing with retry logic
- Idempotent processing (handle duplicates)
- Error logging and alerting

### Scheduled Tasks

- Daily inventory reconciliation
- Product data enrichment
- Price synchronization
- Collection updates
- Analytics export
- Backup operations

---

## Integration Points

### External System Connections

**Fulfillment Services:**
- Printful (print-on-demand)
- ShipStation (multi-carrier shipping)
- Amazon FBA
- Third-party logistics (3PL)

**Inventory Management:**
- Cin7, TradeGecko, Skubana
- Custom warehouse systems
- ERP integrations

**Marketing Platforms:**
- Klaviyo (email automation)
- Google Analytics 4
- Meta Pixel (Facebook/Instagram)
- Google Shopping

**Payment Gateways:**
- Stripe
- PayPal
- Shop Pay
- Custom payment processors

**Accounting:**
- QuickBooks Online
- Xero
- Custom accounting systems

---

## Tools & Scripts

### Available Automation

**1. Connection Tester (`/scripts/shopify/test-connection.js`)**
- Validates API credentials
- Tests read/write permissions
- Checks webhook configuration
- Verifies rate limit status

**2. Product Sync (`/scripts/shopify/sync-products.js`)**
- Bidirectional product synchronization
- Handles variants and options
- Updates images and metafields
- Supports delta sync (only changes)
- Conflict resolution strategies

**3. Inventory Manager (`/scripts/shopify/sync-inventory.js`)**
- Multi-location inventory updates
- Real-time stock synchronization
- Low stock notifications
- Inventory adjustment logging

**4. Order Processor (`/scripts/shopify/process-orders.js`)**
- Automated order routing
- Fulfillment service integration
- Shipping label generation
- Order status updates

**5. Bulk Operations (`/scripts/shopify/bulk-operations.js`)**
- GraphQL bulk queries
- Large dataset operations
- Background job monitoring
- Result processing

**6. Webhook Handler (`/scripts/shopify/webhook-server.js`)**
- Express.js webhook receiver
- Signature validation
- Event routing
- Queue integration

---

## API Wrappers

### Shopify Admin API Client

```javascript
// /lib/shopify-client.js
import Shopify from '@shopify/shopify-api'

export class ShopifyClient {
  constructor(shop, accessToken) {
    this.client = new Shopify.Clients.Rest(shop, accessToken)
    this.graphql = new Shopify.Clients.Graphql(shop, accessToken)
  }

  // Product operations
  async getProducts(params = {}) { }
  async createProduct(productData) { }
  async updateProduct(productId, updates) { }
  async deleteProduct(productId) { }

  // Inventory operations
  async getInventoryLevels(locationId) { }
  async updateInventoryLevel(inventoryItemId, locationId, available) { }

  // Order operations
  async getOrders(params = {}) { }
  async fulfillOrder(orderId, fulfillmentData) { }
  async refundOrder(orderId, refundData) { }

  // GraphQL operations
  async bulkQuery(query) { }
  async bulkMutation(mutation) { }
}
```

### Testing Utilities

**Mock Data Generator:**
```javascript
// /scripts/shopify/utils/mock-data.js
export function generateMockProduct() {
  return {
    title: 'Sample Product',
    body_html: '<strong>Product description</strong>',
    vendor: 'Brandon Mills',
    product_type: 'Luxury Item',
    variants: [
      {
        price: '99.99',
        sku: 'BM-001',
        inventory_management: 'shopify',
      },
    ],
    images: [
      { src: 'https://example.com/image.jpg' },
    ],
  }
}
```

**API Response Validator:**
```javascript
// /scripts/shopify/utils/validators.js
export function validateProductResponse(product) {
  const required = ['id', 'title', 'variants']
  return required.every((field) => product[field] !== undefined)
}
```

---

## Documentation

### Quick Start Guide (`/docs/shopify/INTEGRATION-GUIDE.md`)

**Prerequisites:**
- Shopify store (any plan)
- Admin API access
- Private or custom app credentials

**Setup Steps:**
1. Create private app in Shopify admin
2. Configure API scopes (read/write permissions)
3. Get API credentials (API key, password, shop domain)
4. Set environment variables
5. Test connection
6. Configure webhooks
7. Deploy automation scripts

### API Reference (`/docs/shopify/API-REFERENCE.md`)

**Comprehensive Coverage:**
- REST Admin API endpoints
- GraphQL Admin API schema
- Storefront API capabilities
- Webhook event catalog
- Error codes and handling
- Rate limiting strategies
- Pagination best practices

### Best Practices (`/docs/shopify/BEST-PRACTICES.md`)

**Optimization Guidelines:**
- Use GraphQL for complex queries
- Implement bulk operations for large datasets
- Cache frequently accessed data
- Respect rate limits (2 calls/second REST, 1000 points/second GraphQL)
- Use webhooks instead of polling
- Implement retry logic with exponential backoff
- Validate webhook signatures
- Handle idempotency for webhooks

**SEO Guidelines:**
- Optimize product titles (60-70 characters)
- Write compelling meta descriptions (150-160 characters)
- Use descriptive URLs (slugs)
- Add alt text to all images
- Implement structured data (JSON-LD)
- Create XML sitemap
- Optimize page speed

**Image Requirements:**
- Product images: 2048x2048px (high resolution)
- File formats: JPG, PNG, GIF, WebP
- Max file size: 20MB
- Use consistent aspect ratios
- Optimize for web (compress without quality loss)
- Alt text for accessibility and SEO

**Pricing Strategies:**
- Competitive pricing analysis
- Dynamic pricing based on inventory
- Tiered pricing for variants
- Compare at price for discounts
- Multi-currency pricing
- Tax configuration by region

---

## Common Tasks

### Task 1: Sync Products from External Source

**Workflow:**
1. Fetch products from external API/database
2. Transform data to Shopify format
3. Check if product exists (by SKU or external ID)
4. Create new product or update existing
5. Sync variants and inventory
6. Upload and attach images
7. Set metafields for tracking
8. Log operation results

**Step-by-Step:**
```javascript
// 1. Fetch external products
const externalProducts = await fetchFromExternalSource()

// 2. Transform to Shopify format
const shopifyProducts = externalProducts.map(transformToShopify)

// 3. Sync each product
for (const product of shopifyProducts) {
  const existing = await shopify.findProductBySKU(product.variants[0].sku)

  if (existing) {
    await shopify.updateProduct(existing.id, product)
  } else {
    await shopify.createProduct(product)
  }
}

// 4. Sync inventory
await syncInventoryLevels(shopifyProducts)
```

**Error Handling:**
- Catch API errors (rate limits, validation)
- Log failed operations
- Implement retry queue
- Send notifications for critical failures

---

### Task 2: Set Up Abandoned Cart Recovery

**Workflow:**
1. Configure webhook for `checkouts/create`
2. Store checkout data in database
3. Wait 1 hour for checkout completion
4. Check if order was created
5. Send recovery email if not completed
6. Track email opens and clicks
7. Send follow-up email after 24 hours
8. Analytics and conversion tracking

**Implementation:**
```javascript
// Webhook handler
app.post('/webhooks/checkouts/create', async (req, res) => {
  const checkout = req.body

  // Store in database
  await db.checkouts.create({
    id: checkout.id,
    email: checkout.email,
    cart_token: checkout.cart_token,
    total: checkout.total_price,
    items: checkout.line_items,
    created_at: new Date(),
  })

  // Schedule recovery email
  await queue.add('abandoned-cart', { checkoutId: checkout.id }, {
    delay: 60 * 60 * 1000, // 1 hour
  })

  res.sendStatus(200)
})
```

---

### Task 3: Multi-Location Inventory Management

**Workflow:**
1. Define inventory locations
2. Set inventory policies per product
3. Track inventory by location
4. Sync inventory from warehouse systems
5. Handle fulfillment routing
6. Low stock alerts per location

**Implementation:**
```javascript
// Update inventory at specific location
async function updateInventory(sku, locationId, quantity) {
  // Find product variant by SKU
  const variant = await shopify.findVariantBySKU(sku)

  // Get inventory item
  const inventoryItem = variant.inventory_item_id

  // Update inventory level
  await shopify.updateInventoryLevel({
    inventory_item_id: inventoryItem,
    location_id: locationId,
    available: quantity,
  })
}

// Multi-location sync
async function syncAllLocations(inventoryData) {
  for (const item of inventoryData) {
    await updateInventory(item.sku, item.locationId, item.quantity)
  }
}
```

---

### Task 4: Create Custom Product Metafields

**Workflow:**
1. Define metafield namespace and keys
2. Create metafield definitions
3. Set metafield values on products
4. Use metafields in theme (Liquid)
5. Query metafields via API

**Implementation:**
```javascript
// Create metafield definition
await shopify.createMetafieldDefinition({
  namespace: 'custom',
  key: 'material',
  name: 'Material',
  type: 'single_line_text_field',
  owner_type: 'PRODUCT',
})

// Set product metafield
await shopify.createProductMetafield(productId, {
  namespace: 'custom',
  key: 'material',
  value: 'Sterling Silver',
  type: 'single_line_text_field',
})

// Use in Liquid theme
// {{ product.metafields.custom.material }}
```

---

### Task 5: Automated Order Fulfillment

**Workflow:**
1. Receive order webhook
2. Route to appropriate fulfillment service
3. Submit fulfillment request
4. Receive tracking number
5. Update Shopify order with fulfillment
6. Send customer notification
7. Handle fulfillment failures

**Implementation:**
```javascript
// Order created webhook
app.post('/webhooks/orders/create', async (req, res) => {
  const order = req.body

  // Route based on product type or vendor
  const fulfillmentService = determineFulfillmentService(order)

  if (fulfillmentService === 'printful') {
    // Submit to Printful
    const printfulOrder = await printful.createOrder({
      external_id: order.id.toString(),
      recipient: order.shipping_address,
      items: transformLineItems(order.line_items),
    })

    // Store fulfillment mapping
    await db.fulfillments.create({
      shopify_order_id: order.id,
      printful_order_id: printfulOrder.id,
    })
  }

  res.sendStatus(200)
})

// Fulfillment update from Printful
app.post('/webhooks/printful/shipment-created', async (req, res) => {
  const shipment = req.body

  // Find corresponding Shopify order
  const fulfillment = await db.fulfillments.findOne({
    printful_order_id: shipment.order_id,
  })

  // Update Shopify order
  await shopify.createFulfillment(fulfillment.shopify_order_id, {
    tracking_number: shipment.tracking_number,
    tracking_url: shipment.tracking_url,
    notify_customer: true,
  })

  res.sendStatus(200)
})
```

---

## Troubleshooting

### Common Errors

**1. Rate Limit Exceeded (429)**

**Error:**
```
Exceeded 2 calls per second for API client
```

**Solution:**
- Implement request queuing with rate limiting
- Use GraphQL instead of REST for complex queries
- Implement exponential backoff retry logic
- Use bulk operations for large datasets

**Code Example:**
```javascript
import pLimit from 'p-limit'

const limit = pLimit(2) // Max 2 concurrent requests

const promises = products.map((product) =>
  limit(() => shopify.createProduct(product))
)

await Promise.all(promises)
```

---

**2. Webhook Signature Verification Failed**

**Error:**
```
Invalid webhook signature
```

**Solution:**
- Verify HMAC signature using shared secret
- Use raw request body (don't parse as JSON first)
- Check for middleware interference

**Code Example:**
```javascript
import crypto from 'crypto'

function verifyWebhook(body, hmacHeader, secret) {
  const hash = crypto
    .createHmac('sha256', secret)
    .update(body, 'utf8')
    .digest('base64')

  return hash === hmacHeader
}

// Express middleware
app.post('/webhooks/*', express.raw({ type: 'application/json' }), (req, res, next) => {
  const hmac = req.headers['x-shopify-hmac-sha256']

  if (!verifyWebhook(req.body, hmac, process.env.SHOPIFY_WEBHOOK_SECRET)) {
    return res.status(401).send('Unauthorized')
  }

  req.body = JSON.parse(req.body)
  next()
})
```

---

**3. Product Creation Validation Errors**

**Error:**
```json
{
  "errors": {
    "title": ["can't be blank"],
    "variants": ["is invalid"]
  }
}
```

**Solution:**
- Validate product data before submission
- Check required fields
- Ensure variant structure is correct
- Validate price formats

**Code Example:**
```javascript
function validateProduct(product) {
  const errors = []

  if (!product.title || product.title.trim() === '') {
    errors.push('Title is required')
  }

  if (!product.variants || product.variants.length === 0) {
    errors.push('At least one variant is required')
  }

  product.variants?.forEach((variant, index) => {
    if (!variant.price || isNaN(parseFloat(variant.price))) {
      errors.push(`Variant ${index}: Invalid price`)
    }
  })

  return errors
}
```

---

**4. GraphQL Bulk Operations Timeout**

**Error:**
```
Bulk operation query timeout
```

**Solution:**
- Break into smaller batches
- Use cursor-based pagination
- Implement polling for operation status
- Handle partial results

**Code Example:**
```javascript
async function bulkQueryProducts() {
  const mutation = `
    mutation {
      bulkOperationRunQuery(
        query: """
        {
          products {
            edges {
              node {
                id
                title
                variants {
                  edges {
                    node {
                      id
                      sku
                      price
                    }
                  }
                }
              }
            }
          }
        }
        """
      ) {
        bulkOperation {
          id
          status
        }
        userErrors {
          field
          message
        }
      }
    }
  `

  const response = await shopify.graphql(mutation)
  const operationId = response.bulkOperationRunQuery.bulkOperation.id

  // Poll for completion
  let status = 'RUNNING'
  while (status === 'RUNNING') {
    await sleep(2000)
    const statusQuery = `
      {
        node(id: "${operationId}") {
          ... on BulkOperation {
            status
            url
          }
        }
      }
    `
    const statusResponse = await shopify.graphql(statusQuery)
    status = statusResponse.node.status
  }

  // Download results
  const resultsUrl = statusResponse.node.url
  const results = await fetch(resultsUrl)
  return results.text()
}
```

---

**5. Inventory Not Syncing**

**Error:**
```
Inventory item not tracked
```

**Solution:**
- Enable inventory tracking on variant
- Set inventory policy
- Verify inventory item ID
- Check location configuration

**Code Example:**
```javascript
// Enable inventory tracking
await shopify.updateVariant(variantId, {
  inventory_management: 'shopify',
  inventory_policy: 'deny', // or 'continue' for overselling
})

// Then update inventory
const variant = await shopify.getVariant(variantId)
await shopify.updateInventoryLevel({
  inventory_item_id: variant.inventory_item_id,
  location_id: locationId,
  available: quantity,
})
```

---

## API Debugging

### Enable Debug Logging

```javascript
// Set environment variable
process.env.SHOPIFY_API_DEBUG = 'true'

// Or configure client
const client = new Shopify.Clients.Rest(shop, accessToken, {
  logger: console,
})
```

### Test API Calls with cURL

```bash
# Get products
curl -X GET \
  "https://your-store.myshopify.com/admin/api/2024-01/products.json" \
  -H "X-Shopify-Access-Token: YOUR_ACCESS_TOKEN"

# Create product
curl -X POST \
  "https://your-store.myshopify.com/admin/api/2024-01/products.json" \
  -H "X-Shopify-Access-Token: YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "product": {
      "title": "Test Product",
      "body_html": "<strong>Description</strong>",
      "vendor": "Brandon Mills",
      "product_type": "Test",
      "variants": [
        {
          "price": "99.99",
          "sku": "TEST-001"
        }
      ]
    }
  }'
```

### Monitor Webhook Delivery

**In Shopify Admin:**
1. Settings > Notifications > Webhooks
2. Click on webhook
3. View delivery history
4. Check response codes
5. Retry failed deliveries

---

## Data Sync Problems

### Conflict Resolution

**Scenario:** Product updated in both Shopify and external source

**Strategy:**
1. Use `updated_at` timestamps
2. Implement "last write wins"
3. Or manual conflict resolution
4. Log conflicts for review

**Code Example:**
```javascript
async function syncWithConflictResolution(externalProduct, shopifyProduct) {
  const externalUpdated = new Date(externalProduct.updated_at)
  const shopifyUpdated = new Date(shopifyProduct.updated_at)

  if (externalUpdated > shopifyUpdated) {
    // External source is newer
    await shopify.updateProduct(shopifyProduct.id, externalProduct)
  } else if (shopifyUpdated > externalUpdated) {
    // Shopify is newer
    await externalSource.updateProduct(externalProduct.id, shopifyProduct)
  } else {
    // Same timestamp, log conflict
    await logConflict({
      product_id: shopifyProduct.id,
      message: 'Timestamps match, manual resolution needed',
    })
  }
}
```

---

## Production Checklist

Before going live:

- [ ] API credentials secured in environment variables
- [ ] Rate limiting implemented
- [ ] Webhook signature verification enabled
- [ ] Error logging and monitoring configured
- [ ] Retry logic with exponential backoff
- [ ] Idempotency handling for webhooks
- [ ] Database backups scheduled
- [ ] Health check endpoints created
- [ ] Load tested for expected traffic
- [ ] Documentation updated
- [ ] Team trained on troubleshooting
- [ ] Rollback plan documented
- [ ] Customer notification templates approved
- [ ] Analytics and tracking verified
- [ ] Security audit completed

---

## Performance Optimization

### Caching Strategies

**Product Data:**
```javascript
import NodeCache from 'node-cache'

const cache = new NodeCache({ stdTTL: 600 }) // 10 minutes

async function getCachedProduct(productId) {
  const cached = cache.get(`product_${productId}`)
  if (cached) return cached

  const product = await shopify.getProduct(productId)
  cache.set(`product_${productId}`, product)
  return product
}
```

**Inventory Levels:**
```javascript
// Cache frequently checked inventory
const inventoryCache = new NodeCache({ stdTTL: 60 }) // 1 minute

async function getInventory(sku) {
  const cached = inventoryCache.get(`inv_${sku}`)
  if (cached !== undefined) return cached

  const inventory = await shopify.getInventoryBySKU(sku)
  inventoryCache.set(`inv_${sku}`, inventory)
  return inventory
}
```

### Database Indexing

```javascript
// MongoDB indexes for webhook processing
await db.collection('webhooks').createIndex({ shopify_id: 1 }, { unique: true })
await db.collection('webhooks').createIndex({ created_at: -1 })
await db.collection('products').createIndex({ sku: 1 }, { unique: true })
```

---

## Security Best Practices

**1. Secure API Credentials:**
- Never commit credentials to version control
- Use environment variables
- Rotate credentials periodically
- Use separate credentials for dev/staging/production

**2. Validate All Input:**
```javascript
import validator from 'validator'

function sanitizeInput(data) {
  return {
    email: validator.isEmail(data.email) ? data.email : null,
    title: validator.escape(data.title),
    price: validator.isDecimal(data.price) ? data.price : '0.00',
  }
}
```

**3. Implement Request Signing:**
```javascript
// Verify requests are from Shopify
function verifyShopifyRequest(query, secret) {
  const { hmac, ...params } = query
  const message = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join('&')

  const hash = crypto
    .createHmac('sha256', secret)
    .update(message)
    .digest('hex')

  return hash === hmac
}
```

---

## Monitoring & Alerts

### Key Metrics to Track

**API Performance:**
- Request latency
- Error rate
- Rate limit usage
- Webhook delivery success rate

**Business Metrics:**
- Products synced per hour
- Orders processed
- Inventory accuracy
- Fulfillment time

**System Health:**
- Server CPU/memory usage
- Database query performance
- Queue depth
- Failed job count

### Alert Configuration

```javascript
// Example: Alert on high error rate
if (errorRate > 0.05) { // 5% error rate
  await sendAlert({
    severity: 'HIGH',
    message: 'Shopify API error rate exceeded threshold',
    metrics: { errorRate, totalRequests },
  })
}

// Alert on webhook failures
if (webhookFailureCount > 10) {
  await sendAlert({
    severity: 'CRITICAL',
    message: 'Multiple webhook processing failures',
    count: webhookFailureCount,
  })
}
```

---

## Testing Strategy

### Unit Tests

```javascript
// Test product transformation
describe('transformToShopify', () => {
  it('should convert external product to Shopify format', () => {
    const external = {
      name: 'Test Product',
      cost: 99.99,
      sku_code: 'TEST-001',
    }

    const shopify = transformToShopify(external)

    expect(shopify.title).toBe('Test Product')
    expect(shopify.variants[0].price).toBe('99.99')
    expect(shopify.variants[0].sku).toBe('TEST-001')
  })
})
```

### Integration Tests

```javascript
// Test API connection
describe('Shopify API', () => {
  it('should create and retrieve product', async () => {
    const product = await shopify.createProduct(mockProduct)
    expect(product.id).toBeDefined()

    const retrieved = await shopify.getProduct(product.id)
    expect(retrieved.title).toBe(mockProduct.title)

    await shopify.deleteProduct(product.id)
  })
})
```

### Webhook Testing

```bash
# Use Shopify CLI to test webhooks locally
shopify webhook trigger products/create --address http://localhost:3000/webhooks/products/create
```

---

## Resources

**Official Documentation:**
- Shopify Admin API: https://shopify.dev/api/admin
- GraphQL Admin API: https://shopify.dev/api/admin-graphql
- Webhooks: https://shopify.dev/api/admin-rest/latest/resources/webhook
- Shopify CLI: https://shopify.dev/themes/tools/cli

**NPM Packages:**
- `@shopify/shopify-api` - Official Node.js library
- `@shopify/shopify-app-express` - Express middleware
- `shopify-api-node` - Alternative library

**Community:**
- Shopify Community Forums
- Shopify Partners Slack
- Stack Overflow (tag: shopify)

---

## Version History

**v1.0.0** - Initial release
- Core API integration
- Product sync capabilities
- Order processing automation
- Webhook handling
- Documentation complete

---

**Ready to automate your Shopify store!** 🛍️
