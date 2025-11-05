# Marketplace Specialist Agents - Quick Reference

## When to Use Which Agent

### Need to work with Shopify?
→ **[Shopify Specialist](./agents/shopify-specialist.md)**
- Managing Shopify store products
- Syncing inventory to Shopify
- Processing Shopify orders
- Customizing themes
- Building Shopify apps

### Need to sell on Amazon?
→ **[Amazon Specialist](./agents/amazon-specialist.md)**
- Creating Amazon product listings
- Managing FBA inventory
- Running sponsored ads
- Optimizing for Buy Box
- Processing Amazon orders

### Need social media shopping?
→ **[Social Commerce Specialist](./agents/social-commerce-specialist.md)**
- Setting up Instagram Shopping
- Managing Facebook Shops
- Creating TikTok Shop
- Pinterest Shopping
- Tagging products in posts
- Running UGC campaigns

### Need print-on-demand?
→ **[Printful Specialist](./agents/printful-specialist.md)**
- Setting up POD products
- Automating fulfillment
- Generating mockups
- Managing POD variants

### Need payment processing?
→ **[Stripe Specialist](./agents/stripe-specialist.md)**
- Processing payments
- Managing subscriptions
- Handling refunds
- Customer portal

### Need to coordinate multiple platforms?
→ **[Marketplace Coordinator](./agents/marketplace-coordinator.md)**
- Syncing products across all platforms
- Managing multi-channel inventory
- Processing orders from any platform
- Unified analytics and reporting
- Preventing overselling
- Resolving data conflicts

---

## Quick Command Reference

### Product Operations

```bash
# Sync products to Shopify
node scripts/shopify/sync-products.js

# List products on Amazon
node scripts/amazon/list-products.js

# Upload to social platforms
node scripts/social-commerce/sync-catalog.js

# Sync to ALL platforms
node scripts/coordinator/sync-all.js
```

### Inventory Operations

```bash
# Update Shopify inventory
node scripts/shopify/sync-inventory.js --sku BM-001 --qty 100

# Update Amazon FBA inventory
node scripts/amazon/sync-inventory.js --sku BM-001 --qty 50

# Sync inventory across all platforms
node scripts/coordinator/sync-inventory.js --sku BM-001
```

### Order Operations

```bash
# Process Shopify orders
node scripts/shopify/process-orders.js

# Process Amazon orders
node scripts/amazon/process-orders.js

# Unified order processing
node scripts/coordinator/process-all-orders.js
```

### Testing & Monitoring

```bash
# Test platform connections
node scripts/shopify/test-connection.js
node scripts/amazon/test-connection.js
node scripts/social-commerce/test-connections.js

# Platform health check
node scripts/coordinator/health-check.js

# Generate analytics report
node scripts/coordinator/generate-report.js --period 30days
```

---

## Directory Structure

```
/Users/brandon/Webdesigner/
├── ai-management/
│   └── agents/
│       ├── README.md                           ← Start here
│       ├── shopify-specialist.md               ← Shopify expert
│       ├── amazon-specialist.md                ← Amazon expert
│       ├── social-commerce-specialist.md       ← Social platforms
│       ├── printful-specialist.md              ← POD fulfillment
│       ├── stripe-specialist.md                ← Payments
│       └── marketplace-coordinator.md          ← Multi-platform orchestrator
│
├── docs/
│   ├── shopify/
│   │   ├── INTEGRATION-GUIDE.md               ← Setup instructions
│   │   ├── API-REFERENCE.md                   ← API docs
│   │   └── BEST-PRACTICES.md                  ← Optimization tips
│   ├── amazon/
│   │   ├── INTEGRATION-GUIDE.md
│   │   ├── API-REFERENCE.md
│   │   └── BEST-PRACTICES.md
│   └── social-commerce/
│       ├── INSTAGRAM-SHOPPING.md
│       ├── TIKTOK-SHOP.md
│       └── PINTEREST-BUYABLE.md
│
└── scripts/
    ├── shopify/
    │   ├── test-connection.js
    │   ├── sync-products.js
    │   └── sync-inventory.js
    ├── amazon/
    │   ├── test-connection.js
    │   ├── list-products.js
    │   └── sync-inventory.js
    ├── social-commerce/
    │   ├── test-connections.js
    │   ├── sync-catalog.js
    │   ├── instagram-tags.js
    │   └── tiktok-products.js
    └── coordinator/
        ├── sync-all.js
        ├── health-check.js
        └── generate-report.js
```

---

## Environment Variables Checklist

Create `.env.local` with these variables:

```bash
# Shopify
SHOPIFY_SHOP_DOMAIN=
SHOPIFY_ACCESS_TOKEN=

# Amazon
AMAZON_SELLER_ID=
AMAZON_REFRESH_TOKEN=
AMAZON_CLIENT_ID=
AMAZON_CLIENT_SECRET=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=

# Facebook/Instagram
FACEBOOK_ACCESS_TOKEN=
FACEBOOK_CATALOG_ID=
INSTAGRAM_BUSINESS_ACCOUNT_ID=

# TikTok
TIKTOK_SHOP_ACCESS_TOKEN=
TIKTOK_SHOP_ID=

# Pinterest
PINTEREST_ACCESS_TOKEN=

# Printful
PRINTFUL_API_KEY=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

---

## Common Workflows

### 1. Launch New Product

```javascript
// Use Marketplace Coordinator
const product = {
  sku: 'BM-NEW-001',
  title: 'New Product',
  description: 'Product description',
  price: 99.99,
  inventory: 100,
  images: ['url1.jpg', 'url2.jpg'],
  category: 'Jewelry',
}

// Sync to all platforms
await coordinator.publishProductEverywhere(product)

// Result: Product live on Shopify, Amazon, Instagram, Facebook, TikTok, Pinterest
```

### 2. Process Order

```javascript
// Automatic via webhooks
// When order arrives on any platform:
// 1. Coordinator receives webhook
// 2. Reserves inventory
// 3. Routes to fulfillment (Printful, FBA, or warehouse)
// 4. Updates all platforms
// 5. Sends customer confirmation
```

### 3. Update Inventory

```javascript
// When inventory changes (sale, restock, adjustment)
await coordinator.syncInventoryAfterSale('BM-001', quantitySold, 'shopify')

// Coordinator:
// 1. Updates master inventory
// 2. Reallocates across platforms
// 3. Syncs to all platforms
// 4. Checks for low stock
// 5. Triggers reorder if needed
```

---

## Troubleshooting Quick Guide

| Issue | Solution |
|-------|----------|
| Product not syncing to platform | Check specialist logs, verify API credentials, review validation errors |
| Inventory mismatch | Run `reconcile-inventory.js`, check sync logs, manual audit |
| Webhooks not received | Verify URL is public, check signature verification, review webhook logs |
| API rate limit errors | Check rate limiting implementation, reduce batch size, add delays |
| Order not processing | Check fulfillment routing logic, verify inventory availability, review error logs |
| Platform connection failed | Test connection script, verify credentials, check platform status page |

---

## Support Resources

**Documentation:**
- [Shopify Docs](./docs/shopify/)
- [Amazon Docs](./docs/amazon/)
- [Social Commerce Docs](./docs/social-commerce/)

**Scripts:**
- [Shopify Scripts](./scripts/shopify/)
- [Amazon Scripts](./scripts/amazon/)
- [Social Scripts](./scripts/social-commerce/)
- [Coordinator Scripts](./scripts/coordinator/)

**Agent Configurations:**
- [All Agents](./agents/)

---

## Getting Started Checklist

- [ ] Read [Marketplace Coordinator](./agents/marketplace-coordinator.md) overview
- [ ] Review [Shopify Specialist](./agents/shopify-specialist.md) if using Shopify
- [ ] Review [Amazon Specialist](./agents/amazon-specialist.md) if selling on Amazon
- [ ] Review [Social Commerce Specialist](./agents/social-commerce-specialist.md) if using social platforms
- [ ] Set up all environment variables
- [ ] Run connection tests for each platform
- [ ] Test product sync with one product
- [ ] Set up webhooks for real-time updates
- [ ] Configure inventory allocation rules
- [ ] Run health check to verify all systems
- [ ] Deploy to production

---

## Key Principles

1. **Single Source of Truth**: Marketplace Coordinator maintains master data
2. **Platform Specialization**: Each specialist knows their platform deeply
3. **Conflict Resolution**: Coordinator handles data conflicts automatically
4. **Graceful Degradation**: System continues if one platform fails
5. **Unified Interface**: Consistent API across all platforms
6. **Real-time Sync**: Webhooks for instant updates
7. **Performance Optimization**: Platform-specific best practices
8. **Error Recovery**: Automatic retry with exponential backoff

---

**Last Updated:** December 2024

**Version:** 1.0.0

---

**Questions?** Refer to individual agent documentation or platform-specific guides.
