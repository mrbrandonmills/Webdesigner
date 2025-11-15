# Marketplace Specialist Agents

## Overview

This directory contains specialized AI agent configurations for managing multi-platform e-commerce operations. Each agent is an expert in their respective platform/service, working together under the coordination of the Marketplace Coordinator.

---

## Agent Architecture

```
┌─────────────────────────────────────────────────────┐
│         MARKETPLACE COORDINATOR                      │
│  (Orchestrates all specialist agents)               │
└────────────┬─────────────────────────────────┬──────┘
             │                                 │
    ┌────────┴────────┐              ┌────────┴────────┐
    │                 │              │                 │
    v                 v              v                 v
┌─────────┐   ┌─────────────┐   ┌─────────┐   ┌─────────────┐
│ SHOPIFY │   │   AMAZON    │   │  SOCIAL │   │  PRINTFUL   │
│SPECIALIST   │  SPECIALIST │   │COMMERCE │   │  SPECIALIST │
│         │   │             │   │SPECIALIST   │             │
└─────────┘   └─────────────┘   └─────────┘   └─────────────┘
     │                │                │               │
     └────────────────┴────────────────┴───────────────┘
                      │
              ┌───────┴────────┐
              │  STRIPE        │
              │  SPECIALIST    │
              └────────────────┘
```

---

## Available Agents

> **New**: Full workflow specs ("Genius Agent" playbooks) live alongside these briefs. See [`genius_agent_1_workflow.md`](./genius_agent_1_workflow.md) for the 6-stage Forensic Researcher Profile Builder pipeline.

### 1. [Shopify Specialist](./shopify-specialist.md)

**Focus:** Shopify store management and automation

**Key Capabilities:**
- Product catalog management
- Multi-location inventory
- Order processing and fulfillment
- Theme customization
- App development
- Multi-channel integration

**Use When:**
- Managing Shopify store products
- Syncing inventory
- Processing Shopify orders
- Customizing store features
- Building Shopify apps

**Documentation:** [/docs/shopify/](../../docs/shopify/)

---

### 2. [Amazon Specialist](./amazon-specialist.md)

**Focus:** Amazon marketplace selling and optimization

**Key Capabilities:**
- SP-API integration
- Product listing optimization
- FBA (Fulfillment by Amazon)
- Sponsored Products advertising
- Buy Box optimization
- Multi-marketplace management

**Use When:**
- Listing products on Amazon
- Managing FBA inventory
- Running Amazon ads
- Optimizing product listings
- Processing Amazon orders

**Documentation:** [/docs/amazon/](../../docs/amazon/)

---

### 3. [Social Commerce Specialist](./social-commerce-specialist.md)

**Focus:** Social media shopping platforms

**Key Capabilities:**
- Instagram Shopping
- Facebook Shops
- TikTok Shop
- Pinterest Shopping
- Product tagging automation
- UGC campaigns
- Social listening

**Use When:**
- Setting up Instagram Shopping
- Managing TikTok Shop
- Creating shoppable posts
- Running social campaigns
- Engaging with customers on social

**Documentation:** [/docs/social-commerce/](../../docs/social-commerce/)

---

### 4. [Printful Specialist](./printful-specialist.md)

**Focus:** Print-on-demand fulfillment

**Key Capabilities:**
- Product catalog sync
- Order fulfillment automation
- Mockup generation
- Variant mapping
- Shipping integration

**Use When:**
- Setting up print-on-demand products
- Automating POD fulfillment
- Generating product mockups
- Managing POD inventory

---

### 5. [Stripe Specialist](./stripe-specialist.md)

**Focus:** Payment processing and subscriptions

**Key Capabilities:**
- Payment processing
- Subscription management
- Customer portal
- Webhook handling
- Payment analytics

**Use When:**
- Processing payments
- Managing subscriptions
- Handling refunds
- Setting up payment methods

---

### 6. [Marketplace Coordinator](./marketplace-coordinator.md)

**Focus:** Multi-platform orchestration

**Key Responsibilities:**
- Route requests to appropriate specialists
- Ensure data consistency across platforms
- Prevent conflicts and overselling
- Unified order management
- Cross-platform analytics
- Performance optimization

**Use When:**
- Syncing products across all platforms
- Managing multi-channel inventory
- Processing orders from multiple sources
- Generating unified analytics
- Resolving data conflicts

---

## How to Use

### Working with a Single Platform

If you need help with a specific platform, directly consult the relevant specialist agent:

```bash
# Example: Shopify-specific task
"I need to create a product on Shopify with variants and custom metafields"
→ Use Shopify Specialist

# Example: Amazon-specific task
"How do I optimize my Amazon listing for better conversion?"
→ Use Amazon Specialist
```

### Working Across Multiple Platforms

For operations spanning multiple platforms, consult the Marketplace Coordinator:

```bash
# Example: Multi-platform sync
"Sync this product to Shopify, Amazon, and Instagram Shopping"
→ Use Marketplace Coordinator
  → Delegates to Shopify, Amazon, and Social Commerce specialists

# Example: Unified inventory
"Update inventory across all platforms when this product sells"
→ Use Marketplace Coordinator
  → Manages centralized inventory and syncs to all platforms
```

---

## Common Workflows

### Workflow 1: Launch New Product Everywhere

**Goal:** Publish a new product to all sales channels

**Agents Involved:**
1. Marketplace Coordinator (orchestrator)
2. Shopify Specialist (main store)
3. Amazon Specialist (marketplace)
4. Social Commerce Specialist (social platforms)
5. Printful Specialist (if POD)

**Steps:**
```javascript
// 1. Coordinator creates master product
await coordinator.createMasterProduct(productData)

// 2. Coordinator syncs to all platforms
await coordinator.syncToAllPlatforms(product, {
  platforms: ['shopify', 'amazon', 'facebook', 'instagram', 'tiktok']
})

// 3. Coordinator allocates inventory
await coordinator.allocateInventory(product.sku, initialInventory)

// 4. Coordinator enables product
await coordinator.enableProduct(product.sku)
```

---

### Workflow 2: Process Multi-Channel Order

**Goal:** Fulfill an order that came from any platform

**Agents Involved:**
1. Marketplace Coordinator (orchestrator)
2. Platform Specialist (source platform)
3. Printful Specialist (if POD items)
4. Stripe Specialist (payment processing)

**Steps:**
```javascript
// 1. Order arrives via webhook
// 2. Coordinator fetches full order details
await coordinator.fetchOrder(orderId, sourcePlatform)

// 3. Coordinator reserves inventory
await coordinator.reserveInventory(order.items)

// 4. Coordinator routes to fulfillment
if (order.hasPODItems) {
  await printful.createOrder(order)
} else {
  await warehouse.createShipment(order)
}

// 5. Coordinator updates all platforms
await coordinator.syncOrderStatus(orderId, 'processing')
```

---

### Workflow 3: Sync Inventory After Sale

**Goal:** Update inventory everywhere when product sells

**Agents Involved:**
1. Marketplace Coordinator (orchestrator)
2. All platform specialists

**Steps:**
```javascript
// 1. Sale detected on any platform
// 2. Coordinator decrements master inventory
await coordinator.decrementInventory(sku, quantitySold)

// 3. Coordinator reallocates inventory
await coordinator.reallocateInventory(sku)

// 4. Coordinator syncs to all platforms
await coordinator.syncInventoryToAllPlatforms(sku)

// 5. Coordinator checks for low stock
await coordinator.checkLowStock(sku)
```

---

## Agent Communication Protocol

### Request Format

```javascript
{
  action: 'create_product' | 'update_inventory' | 'process_order',
  platform: 'shopify' | 'amazon' | 'social' | 'all',
  data: {
    // Platform-specific data
  },
  options: {
    syncToAll: true,
    validateFirst: true,
    dryRun: false
  }
}
```

### Response Format

```javascript
{
  success: true,
  platform: 'shopify',
  data: {
    // Result data
  },
  errors: [],
  warnings: [],
  metadata: {
    executionTime: 1234,
    apiCallsMade: 5
  }
}
```

---

## Configuration

### Environment Variables

Each specialist requires specific environment variables:

```bash
# Shopify
SHOPIFY_SHOP_DOMAIN=your-store.myshopify.com
SHOPIFY_ACCESS_TOKEN=shpat_xxxxx

# Amazon
AMAZON_SELLER_ID=xxxxx
AMAZON_REFRESH_TOKEN=xxxxx
AMAZON_CLIENT_ID=xxxxx
AMAZON_CLIENT_SECRET=xxxxx

# Facebook/Instagram
FACEBOOK_ACCESS_TOKEN=xxxxx
FACEBOOK_CATALOG_ID=xxxxx
INSTAGRAM_BUSINESS_ACCOUNT_ID=xxxxx

# TikTok
TIKTOK_SHOP_ACCESS_TOKEN=xxxxx
TIKTOK_SHOP_ID=xxxxx

# Pinterest
PINTEREST_ACCESS_TOKEN=xxxxx

# Printful
PRINTFUL_API_KEY=xxxxx

# Stripe
STRIPE_SECRET_KEY=sk_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

### Platform Priorities

Configure in `/config/marketplace-coordinator.yml`:

```yaml
platforms:
  shopify:
    priority: 1  # Highest priority (source of truth)
    inventory_allocation: 40%

  amazon:
    priority: 2
    inventory_allocation: 30%

  socialCommerce:
    priority: 3
    inventory_allocation: 20%

  reserve:
    priority: 4
    inventory_allocation: 10%  # Safety stock
```

---

## Scripts & Automation

### Available Scripts

**Shopify:**
- `/scripts/shopify/test-connection.js` - Test API connection
- `/scripts/shopify/sync-products.js` - Sync products to Shopify
- `/scripts/shopify/sync-inventory.js` - Update inventory levels

**Amazon:**
- `/scripts/amazon/test-connection.js` - Test SP-API connection
- `/scripts/amazon/list-products.js` - Create product listings
- `/scripts/amazon/sync-inventory.js` - Update FBA/FBM inventory

**Social Commerce:**
- `/scripts/social-commerce/test-connections.js` - Test all social APIs
- `/scripts/social-commerce/sync-catalog.js` - Sync to Facebook Catalog
- `/scripts/social-commerce/instagram-tags.js` - Auto-tag products
- `/scripts/social-commerce/tiktok-products.js` - Upload to TikTok Shop

**Coordinator:**
- `/scripts/coordinator/sync-all.js` - Sync products to all platforms
- `/scripts/coordinator/health-check.js` - Check all platform health
- `/scripts/coordinator/generate-report.js` - Cross-platform analytics

---

## Monitoring & Health Checks

### Platform Health Dashboard

Run health checks for all platforms:

```bash
node scripts/coordinator/health-check.js
```

Expected output:
```
Platform Health Check
═══════════════════════════════════════

✓ Shopify        HEALTHY    (latency: 123ms, errors: 0)
✓ Amazon         HEALTHY    (latency: 234ms, errors: 0)
✓ Instagram      HEALTHY    (latency: 189ms, errors: 0)
✓ TikTok         HEALTHY    (latency: 156ms, errors: 0)
✓ Printful       HEALTHY    (latency: 198ms, errors: 0)
✓ Stripe         HEALTHY    (latency: 101ms, errors: 0)

Overall Status: ALL SYSTEMS OPERATIONAL
```

### Error Handling

All agents implement:
- Automatic retry with exponential backoff
- Error logging to database
- Alert notifications for critical failures
- Graceful degradation (continue with other platforms if one fails)

---

## Best Practices

### 1. Always Use Coordinator for Multi-Platform Operations

```javascript
// ✓ GOOD
await coordinator.syncProduct(product, ['shopify', 'amazon', 'social'])

// ✗ BAD
await shopify.createProduct(product)
await amazon.createListing(product)
await facebook.addProduct(product)
// This can lead to inconsistencies and doesn't handle conflicts
```

### 2. Validate Before Syncing

```javascript
// Validate product data
const validation = await coordinator.validateProduct(productData)
if (!validation.isValid) {
  console.error('Validation errors:', validation.errors)
  return
}

// Proceed with sync
await coordinator.syncProduct(productData)
```

### 3. Handle Conflicts Explicitly

```javascript
// Coordinator automatically detects and resolves conflicts
const result = await coordinator.syncProduct(product, {
  conflictResolution: 'last-write-wins', // or 'manual', 'platform-priority'
})

if (result.conflicts.length > 0) {
  console.log('Resolved conflicts:', result.conflicts)
}
```

### 4. Monitor Platform Performance

```javascript
// Track which platforms perform best
const analytics = await coordinator.getPlatformAnalytics({
  startDate: '2024-01-01',
  endDate: '2024-12-31',
  metrics: ['revenue', 'conversion', 'aov', 'roas'],
})

// Adjust inventory allocation based on performance
await coordinator.updateAllocationRules(analytics)
```

### 5. Implement Graceful Degradation

```javascript
try {
  await coordinator.syncToAllPlatforms(product)
} catch (error) {
  // Log error but don't fail completely
  console.error('Some platforms failed:', error.failedPlatforms)

  // Continue with successful platforms
  if (error.successfulPlatforms.length > 0) {
    console.log('Successfully synced to:', error.successfulPlatforms)
  }
}
```

---

## Troubleshooting

### Common Issues

**Issue:** "Product synced to Shopify but not Amazon"

**Solution:**
1. Check Amazon specialist logs for errors
2. Verify Amazon API credentials
3. Check if product meets Amazon category requirements
4. Review Amazon-specific validation rules

---

**Issue:** "Inventory mismatch across platforms"

**Solution:**
1. Run inventory reconciliation: `node scripts/coordinator/reconcile-inventory.js`
2. Check sync logs for failed operations
3. Verify allocation rules in coordinator config
4. Manual audit and correction if needed

---

**Issue:** "Webhooks not being received"

**Solution:**
1. Verify webhook URLs are publicly accessible (not localhost)
2. Check webhook signature verification
3. Review webhook logs in platform admin panels
4. Test webhook delivery manually
5. Ensure HTTPS and valid SSL certificate

---

## Testing

### Unit Tests

```bash
# Test individual specialists
npm test -- shopify-specialist
npm test -- amazon-specialist

# Test coordinator
npm test -- marketplace-coordinator
```

### Integration Tests

```bash
# Test full workflows
npm test -- integration/product-sync
npm test -- integration/order-processing
npm test -- integration/inventory-management
```

### End-to-End Tests

```bash
# Use sandbox/test environments
npm run test:e2e
```

---

## Deployment

### Production Checklist

- [ ] All environment variables configured
- [ ] Webhooks registered and tested
- [ ] Rate limiting implemented
- [ ] Error monitoring enabled
- [ ] Backup systems in place
- [ ] Rollback plan documented
- [ ] Team trained on troubleshooting
- [ ] Health checks configured
- [ ] Analytics tracking verified
- [ ] Security audit completed

---

## Contributing

When creating a new specialist agent:

1. Follow the existing agent structure
2. Document all capabilities and use cases
3. Provide integration guides
4. Create automation scripts
5. Add tests
6. Update coordinator routing logic
7. Document in this README

---

## Support

**Documentation:**
- Individual specialist guides in `/docs/[platform]/`
- API references in each platform doc folder
- Best practices guides included

**Community:**
- Internal team wiki
- Platform-specific support channels
- Developer forums for each platform

---

## License

Proprietary - Brandon Mills E-commerce Platform

---

**Ready to manage your marketplace empire!** 🚀
