# Printful Integration Documentation

Complete documentation for the Printful print-on-demand integration in Brandon Mills' e-commerce platform.

## OVERVIEW

This integration connects your Next.js e-commerce store with Printful's print-on-demand fulfillment service, enabling automatic product sync, order processing, and mockup generation.

**Features:**
- Automatic product catalog synchronization
- Real-time inventory tracking
- Automated order fulfillment
- Product mockup generation
- Dynamic pricing with markup calculation
- Webhook event handling
- Comprehensive error handling and retry logic

## DOCUMENTATION

### Core Guides

1. **[Integration Checklist](./INTEGRATION-CHECKLIST.md)**
   - Step-by-step setup instructions
   - Phase-by-phase implementation guide
   - Testing procedures
   - Production deployment checklist

2. **[Best Practices](./BEST-PRACTICES.md)**
   - Product catalog management
   - Image and design requirements
   - Pricing strategies
   - Order processing workflows
   - Shipping optimization
   - Quality control

3. **[API Reference](./API-REFERENCE.md)**
   - All endpoint documentation
   - Request/response examples
   - Authentication methods
   - Rate limiting details
   - Error handling
   - Webhook events

4. **[Troubleshooting Guide](./TROUBLESHOOTING.md)**
   - Common errors and solutions
   - Debug procedures
   - Performance optimization
   - FAQ

## QUICK START

### 1. Prerequisites

```bash
# Node.js 18+ required
node --version  # v18.0.0 or higher

# Install dependencies
npm install
```

### 2. API Credentials

1. Create Printful account at [printful.com](https://www.printful.com)
2. Go to Dashboard > Stores > Add Store
3. Select "Custom Integration (API)"
4. Generate API key
5. Copy Store ID

### 3. Environment Setup

Create `.env.local`:
```env
# Printful API
PRINTFUL_API_KEY=pk_your_api_key_here
PRINTFUL_STORE_ID=your_store_id
PRINTFUL_WEBHOOK_SECRET=your_webhook_secret
PRINTFUL_SANDBOX_MODE=false

# Site URL (for webhooks)
NEXT_PUBLIC_SITE_URL=https://brandonmills.com
```

Add to Vercel:
```bash
vercel env add PRINTFUL_API_KEY
vercel env add PRINTFUL_STORE_ID
vercel env add PRINTFUL_WEBHOOK_SECRET
```

### 4. Test Connection

```bash
# Verify API credentials and connectivity
node scripts/printful/test-connection.js
```

Expected output:
```
═══════════════════════════════════════
   Printful Connection Test
═══════════════════════════════════════

Environment Check:
  ✓ PRINTFUL_API_KEY is set
  ✓ PRINTFUL_STORE_ID is set

Testing authentication...
  ✓ Authentication successful
  Response time: 234ms
  Store: Brandon Mills (ID: 12345)

Testing product catalog...
  ✓ Product catalog accessible
  Total products: 312

✓ All tests passed - Printful integration ready!
```

## AUTOMATION SCRIPTS

All scripts are located in `/scripts/printful/` and can be run directly:

### sync-products.js
Synchronizes product catalog from Printful.

```bash
# Sync all products
node scripts/printful/sync-products.js

# Sync specific category
node scripts/printful/sync-products.js --category=apparel

# Force full sync (ignore cache)
node scripts/printful/sync-products.js --force

# Preview changes without saving
node scripts/printful/sync-products.js --dry-run
```

**When to run:**
- Daily (automated via cron)
- After adding new products in Printful
- When stock levels change

**Output:** `/data/curated-products.json`

---

### create-mockups.js
Generates product mockup images.

```bash
# Generate mockups for a product
node scripts/printful/create-mockups.js \
  --product=71 \
  --design=./designs/logo.png

# Specific variants
node scripts/printful/create-mockups.js \
  --product=71 \
  --design=./designs/logo.png \
  --variants=4011,4012,4013

# PNG format instead of JPG
node scripts/printful/create-mockups.js \
  --product=71 \
  --design=./designs/logo.png \
  --format=png
```

**When to run:**
- After uploading new designs
- For new product releases
- When updating branding

**Output:** `/public/mockups/{product_id}/`

---

### update-pricing.js
Updates product pricing based on current Printful costs.

```bash
# Update all product pricing
node scripts/printful/update-pricing.js

# Custom markup (default: 2.8x)
node scripts/printful/update-pricing.js --markup=3.0

# Round to nearest $10 instead of $5
node scripts/printful/update-pricing.js --round=10

# Update specific product
node scripts/printful/update-pricing.js --product=71

# Preview changes
node scripts/printful/update-pricing.js --dry-run
```

**When to run:**
- Weekly (automated)
- When Printful changes costs
- Before sales/promotions
- When adjusting margins

**Output:** Updates `/data/curated-products.json`

---

### check-inventory.js
Checks stock availability across all regions.

```bash
# Check all products
node scripts/printful/check-inventory.js

# Specific product
node scripts/printful/check-inventory.js --product=71

# Specific region
node scripts/printful/check-inventory.js --region=US

# Send alerts if issues found
node scripts/printful/check-inventory.js --alert
```

**When to run:**
- Daily (automated)
- Before major sales
- When customers report "out of stock"

**Output:** `/data/inventory-log.json`

---

### test-connection.js
Verifies API connection and credentials.

```bash
node scripts/printful/test-connection.js
```

**When to run:**
- Initial setup
- After changing API keys
- Troubleshooting connection issues
- In CI/CD pipeline

---

## AUTOMATION

### Daily Cron Jobs

Add to your server's crontab or use Vercel Cron:

```bash
# Sync products daily at 2 AM
0 2 * * * cd /path/to/project && node scripts/printful/sync-products.js

# Check inventory daily at 3 AM
0 3 * * * cd /path/to/project && node scripts/printful/check-inventory.js --alert

# Update pricing weekly on Mondays at 4 AM
0 4 * * 1 cd /path/to/project && node scripts/printful/update-pricing.js
```

### Vercel Cron (vercel.json)

```json
{
  "crons": [
    {
      "path": "/api/cron/sync-products",
      "schedule": "0 2 * * *"
    },
    {
      "path": "/api/cron/check-inventory",
      "schedule": "0 3 * * *"
    },
    {
      "path": "/api/cron/update-pricing",
      "schedule": "0 4 * * 1"
    }
  ]
}
```

Then create API routes:

```typescript
// app/api/cron/sync-products/route.ts
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  // Run sync logic
  await syncProducts()

  return Response.json({ success: true })
}
```

## ARCHITECTURE

### Data Flow

```
┌─────────────────┐
│  Printful API   │
└────────┬────────┘
         │
         ↓ (Daily sync)
┌─────────────────┐
│  sync-products  │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│ curated-products│ ← Cache layer
│     .json       │
└────────┬────────┘
         │
         ↓ (On request)
┌─────────────────┐
│  Next.js API    │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│   Frontend      │
└─────────────────┘
```

### Order Flow

```
┌─────────────────┐
│   Customer      │
│  Places Order   │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  Stripe Payment │
└────────┬────────┘
         │
         ↓ (webhook)
┌─────────────────┐
│  Create Order   │
│  in Printful    │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│   Printful      │
│  Fulfillment    │
└────────┬────────┘
         │
         ↓ (webhook)
┌─────────────────┐
│ Update Status   │
│ Notify Customer │
└─────────────────┘
```

## FILE STRUCTURE

```
/Users/brandon/Webdesigner/
├── docs/printful/
│   ├── README.md                      # This file
│   ├── INTEGRATION-CHECKLIST.md       # Setup guide
│   ├── BEST-PRACTICES.md              # Best practices
│   ├── API-REFERENCE.md               # API documentation
│   └── TROUBLESHOOTING.md             # Problem solving
│
├── scripts/printful/
│   ├── sync-products.js               # Product sync
│   ├── create-mockups.js              # Mockup generator
│   ├── update-pricing.js              # Pricing updates
│   ├── check-inventory.js             # Stock check
│   └── test-connection.js             # Connection test
│
├── data/
│   ├── curated-products.json          # Product cache
│   ├── product-mockups.json           # Mockup URLs
│   ├── pricing-history.json           # Price changes
│   └── inventory-log.json             # Stock history
│
├── lib/
│   └── printful-client.ts             # API client
│
└── app/api/
    ├── store/products/route.ts        # Product API
    ├── orders/create/route.ts         # Order API
    └── printful/webhook/route.ts      # Webhooks
```

## INTEGRATION TIMELINE

### Week 1: Foundation
- [x] API client implementation
- [x] Environment setup
- [x] Connection testing
- [ ] Product sync automation

### Week 2: Products
- [ ] Product catalog integration
- [ ] Mockup generation
- [ ] Pricing strategy
- [ ] Frontend display

### Week 3: Orders
- [ ] Order creation flow
- [ ] Stripe integration
- [ ] Fulfillment tracking
- [ ] Customer notifications

### Week 4: Polish
- [ ] Webhook handling
- [ ] Error monitoring
- [ ] Performance optimization
- [ ] Documentation complete

## MONITORING

### Key Metrics

Track these metrics in your analytics:

- **Product Sync Success Rate:** >99%
- **Order Creation Success Rate:** >99%
- **Average API Response Time:** <500ms
- **Mockup Generation Success:** >95%
- **Stock Availability Rate:** >90%

### Error Tracking

Set up alerts for:
- Authentication failures
- Rate limit exceeded
- Order creation failures
- Webhook delivery failures
- Out-of-stock products

### Logging

```typescript
// Structured logging
logger.info('Product synced', {
  productId: 71,
  variants: 265,
  duration: 1234,
})

logger.error('Order creation failed', {
  orderId: 'ORDER-123',
  error: error.message,
  customer: customer.email,
})
```

## COST OPTIMIZATION

### Reduce API Calls
- Cache product catalog (24hr TTL)
- Batch requests when possible
- Use webhooks instead of polling
- Pre-generate popular mockups

### Optimize Margins
```typescript
// Cost analysis
const avgCost = 13.00      // Printful cost
const avgShipping = 4.99   // Standard shipping
const markup = 2.8         // Your markup
const retailPrice = 35.00  // Final price

const profit = retailPrice - (avgCost + avgShipping)
const margin = (profit / retailPrice) * 100  // ~48%
```

### Shipping Strategy
- Free shipping over $75
- Build shipping into product price
- Offer flat rate option
- Use cheapest fulfillment center

## SECURITY

### API Keys
- Never commit API keys to git
- Use environment variables
- Rotate keys quarterly
- Different keys for dev/prod

### Webhooks
- Always validate signatures
- Use HTTPS only
- Verify payload format
- Rate limit requests

### Customer Data
- Encrypt sensitive data
- Follow PCI compliance
- GDPR compliant
- Secure data transmission

## SUPPORT

### Get Help

1. **Documentation**
   - Read this README
   - Check specific guides
   - Review troubleshooting

2. **Scripts**
   ```bash
   node scripts/printful/test-connection.js
   ```

3. **Logs**
   ```bash
   tail -f logs/printful.log
   ```

4. **Printful Support**
   - Email: support@printful.com
   - Phone: +1 (855) 558-1816
   - Status: https://status.printful.com

### Resources

- **Official Docs:** https://developers.printful.com
- **API Explorer:** https://developers.printful.com/explorer
- **Community Forum:** https://forum.printful.com
- **Status Page:** https://status.printful.com
- **GitHub Examples:** https://github.com/printful

## CHANGELOG

### Version 1.0 (November 2025)
- Initial integration setup
- Product sync automation
- Mockup generation
- Pricing management
- Inventory tracking
- Complete documentation

---

**Maintained By:** Printful Integration Specialist
**Last Updated:** November 5, 2025
**Project:** Brandon Mills E-commerce Platform
**Status:** Ready for Implementation