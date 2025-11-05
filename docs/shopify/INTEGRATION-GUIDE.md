# Shopify Integration Guide

## Quick Start

This guide will walk you through setting up Shopify integration for Brandon Mills' e-commerce platform.

---

## Prerequisites

- Shopify store (any plan - Basic, Shopify, or Advanced)
- Admin access to Shopify store
- Node.js 18+ installed
- Basic understanding of REST and GraphQL APIs

---

## Step 1: Create Private App

**Option A: Custom App (Recommended)**

1. Log in to your Shopify Admin
2. Navigate to **Settings** → **Apps and sales channels**
3. Click **Develop apps** (top right)
4. Click **Create an app**
5. Name it "Brandon Mills Integration"
6. Click **Create app**

**Option B: Private App (Legacy - if available)**

1. Settings → Apps and sales channels → Develop apps
2. Allow custom app development (if prompted)
3. Create custom app

---

## Step 2: Configure API Scopes

Click on **Configure Admin API scopes** and select:

**Product & Inventory:**
- `read_products`
- `write_products`
- `read_inventory`
- `write_inventory`

**Orders:**
- `read_orders`
- `write_orders`
- `read_all_orders`

**Customers:**
- `read_customers`
- `write_customers`

**Other:**
- `read_locations`
- `read_shipping`
- `read_analytics`
- `read_checkouts`
- `write_checkouts`

Click **Save**

---

## Step 3: Install App and Get Credentials

1. Click **Install app** (top right)
2. Confirm installation
3. Reveal **Admin API access token**
4. Copy and save securely (you won't see it again!)

**You now have:**
- Shop domain: `your-store.myshopify.com`
- Admin API access token: `shpat_xxxxxxxxxxxxx`

---

## Step 4: Set Up Environment Variables

Create or update `.env.local`:

```bash
# Shopify Configuration
SHOPIFY_SHOP_DOMAIN=your-store.myshopify.com
SHOPIFY_ACCESS_TOKEN=shpat_xxxxxxxxxxxxx
SHOPIFY_API_VERSION=2024-01

# Optional: For public apps
SHOPIFY_API_KEY=your_api_key
SHOPIFY_API_SECRET=your_api_secret
```

---

## Step 5: Install Dependencies

```bash
npm install @shopify/shopify-api
# or
yarn add @shopify/shopify-api
```

---

## Step 6: Initialize Shopify Client

Create `/lib/shopify-client.ts`:

```typescript
import '@shopify/shopify-api/adapters/node'
import { shopifyApi, LATEST_API_VERSION } from '@shopify/shopify-api'

const shopify = shopifyApi({
  apiKey: process.env.SHOPIFY_API_KEY!,
  apiSecretKey: process.env.SHOPIFY_API_SECRET!,
  scopes: ['read_products', 'write_products', 'read_orders', 'write_orders'],
  hostName: process.env.SHOPIFY_APP_URL!.replace(/https:\/\//, ''),
  apiVersion: LATEST_API_VERSION,
  isEmbeddedApp: false,
  isCustomStoreApp: true,
})

// Create REST client
const session = shopify.session.customAppSession(process.env.SHOPIFY_SHOP_DOMAIN!)
session.accessToken = process.env.SHOPIFY_ACCESS_TOKEN!

export const restClient = new shopify.clients.Rest({
  session,
  apiVersion: LATEST_API_VERSION,
})

// Create GraphQL client
export const graphqlClient = new shopify.clients.Graphql({
  session,
})

export { shopify }
```

---

## Step 7: Test Connection

Create `/scripts/shopify/test-connection.js`:

```javascript
import { restClient, graphqlClient } from '../../lib/shopify-client.js'

async function testConnection() {
  console.log('Testing Shopify connection...\n')

  try {
    // Test REST API
    console.log('1. Testing REST API...')
    const restResponse = await restClient.get({
      path: 'shop',
    })

    console.log('✓ REST API connected successfully')
    console.log('Shop:', restResponse.body.shop.name)
    console.log('Domain:', restResponse.body.shop.domain)
    console.log('')

    // Test GraphQL API
    console.log('2. Testing GraphQL API...')
    const graphqlQuery = `{
      shop {
        name
        email
        currencyCode
      }
    }`

    const graphqlResponse = await graphqlClient.query({
      data: graphqlQuery,
    })

    console.log('✓ GraphQL API connected successfully')
    console.log('Shop:', graphqlResponse.body.data.shop.name)
    console.log('Email:', graphqlResponse.body.data.shop.email)
    console.log('Currency:', graphqlResponse.body.data.shop.currencyCode)
    console.log('')

    // Test product access
    console.log('3. Testing product access...')
    const productsResponse = await restClient.get({
      path: 'products',
      query: { limit: 1 },
    })

    console.log('✓ Product access confirmed')
    console.log('Products found:', productsResponse.body.products.length)
    console.log('')

    console.log('🎉 All tests passed! Shopify integration is ready.')
  } catch (error) {
    console.error('❌ Connection test failed:', error.message)
    if (error.response) {
      console.error('Status:', error.response.code)
      console.error('Details:', error.response.body)
    }
  }
}

testConnection()
```

Run the test:

```bash
node scripts/shopify/test-connection.js
```

Expected output:
```
Testing Shopify connection...

1. Testing REST API...
✓ REST API connected successfully
Shop: Brandon Mills
Domain: brandonmills.myshopify.com

2. Testing GraphQL API...
✓ GraphQL API connected successfully
Shop: Brandon Mills
Email: brandon@brandonmills.com
Currency: USD

3. Testing product access...
✓ Product access confirmed
Products found: 1

🎉 All tests passed! Shopify integration is ready.
```

---

## Step 8: Set Up Webhooks

Webhooks allow real-time updates from Shopify.

**Create webhook receiver:**

```typescript
// app/api/webhooks/shopify/route.ts
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

function verifyWebhook(body: string, hmacHeader: string): boolean {
  const secret = process.env.SHOPIFY_WEBHOOK_SECRET!
  const hash = crypto
    .createHmac('sha256', secret)
    .update(body, 'utf8')
    .digest('base64')

  return hash === hmacHeader
}

export async function POST(request: NextRequest) {
  const body = await request.text()
  const hmac = request.headers.get('x-shopify-hmac-sha256')
  const topic = request.headers.get('x-shopify-topic')

  // Verify webhook signature
  if (!hmac || !verifyWebhook(body, hmac)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Parse webhook data
  const data = JSON.parse(body)

  // Route to appropriate handler
  switch (topic) {
    case 'orders/create':
      await handleOrderCreated(data)
      break

    case 'products/update':
      await handleProductUpdated(data)
      break

    case 'inventory_levels/update':
      await handleInventoryUpdated(data)
      break

    default:
      console.log('Unhandled webhook topic:', topic)
  }

  return NextResponse.json({ received: true })
}

async function handleOrderCreated(order: any) {
  console.log('New order:', order.id)
  // Process order...
}

async function handleProductUpdated(product: any) {
  console.log('Product updated:', product.id)
  // Sync product...
}

async function handleInventoryUpdated(inventory: any) {
  console.log('Inventory updated:', inventory.inventory_item_id)
  // Update inventory...
}
```

**Register webhooks in Shopify Admin:**

1. Settings → Notifications → Webhooks
2. Create webhook:
   - Event: `Order creation`
   - Format: `JSON`
   - URL: `https://yourdomain.com/api/webhooks/shopify`
   - API version: `2024-01`

Repeat for:
- `Product update`
- `Inventory level update`
- `Order fulfillment`
- `Customer creation`

---

## Common Operations

### Create Product

```typescript
async function createProduct(productData: any) {
  const response = await restClient.post({
    path: 'products',
    data: {
      product: {
        title: productData.title,
        body_html: productData.description,
        vendor: 'Brandon Mills',
        product_type: productData.category,
        variants: [
          {
            price: productData.price,
            sku: productData.sku,
            inventory_management: 'shopify',
            inventory_policy: 'deny',
          },
        ],
        images: productData.images.map((url: string) => ({ src: url })),
      },
    },
  })

  return response.body.product
}
```

### Update Inventory

```typescript
async function updateInventory(sku: string, quantity: number) {
  // 1. Find variant by SKU
  const variantsResponse = await graphqlClient.query({
    data: `{
      productVariants(first: 1, query: "sku:${sku}") {
        edges {
          node {
            id
            inventoryItem {
              id
            }
          }
        }
      }
    }`,
  })

  const variant = variantsResponse.body.data.productVariants.edges[0]?.node
  if (!variant) {
    throw new Error(`Variant with SKU ${sku} not found`)
  }

  // 2. Get location ID
  const locationsResponse = await restClient.get({
    path: 'locations',
  })
  const locationId = locationsResponse.body.locations[0].id

  // 3. Update inventory level
  await restClient.post({
    path: 'inventory_levels/set',
    data: {
      location_id: locationId,
      inventory_item_id: variant.inventoryItem.id,
      available: quantity,
    },
  })

  return { sku, quantity }
}
```

### Get Orders

```typescript
async function getRecentOrders(limit = 50) {
  const response = await restClient.get({
    path: 'orders',
    query: {
      limit,
      status: 'any',
      created_at_min: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
  })

  return response.body.orders
}
```

---

## Rate Limits

**REST API:**
- 2 requests per second
- Bucket system: 40 points bucket, refills at 2/sec

**GraphQL API:**
- Calculated query cost (max 1000 points per query)
- 1000 points refilled every second

**Best Practices:**
- Implement request queuing
- Use GraphQL for complex queries
- Batch operations when possible
- Monitor `X-Shopify-Shop-Api-Call-Limit` header

---

## Troubleshooting

### Error: "Access token is invalid"
- Regenerate access token in Shopify admin
- Ensure token is correctly set in environment variables
- Check API scopes are sufficient

### Error: "Exceeded 2 calls per second"
- Implement rate limiting in your code
- Use queue system (Bull, BullMQ)
- Add delays between requests

### Webhook signature verification fails
- Use raw request body (don't parse JSON first)
- Check webhook secret matches
- Ensure using correct HMAC algorithm (SHA256, base64)

---

## Next Steps

1. [API Reference](./API-REFERENCE.md) - Detailed API documentation
2. [Best Practices](./BEST-PRACTICES.md) - Optimization tips
3. Example scripts in `/scripts/shopify/`

---

## Resources

- [Shopify API Documentation](https://shopify.dev/api)
- [Shopify Developer Changelog](https://shopify.dev/changelog)
- [API Status Page](https://www.shopifystatus.com/)
- [Community Forums](https://community.shopify.com/c/shopify-apis-and-sdks/)

---

**Integration complete!** Your Shopify store is now connected. 🎉
