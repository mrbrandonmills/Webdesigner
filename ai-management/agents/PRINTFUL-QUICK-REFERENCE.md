# Printful Specialist - Quick Reference Card

Fast lookup for common tasks and commands.

## INSTANT DIAGNOSTICS

```bash
# Test everything
node scripts/printful/test-connection.js

# Check what's broken
curl -X GET "https://api.printful.com/catalog/products?limit=1" \
  -H "Authorization: Bearer $PRINTFUL_API_KEY"
```

## COMMON COMMANDS

### Product Management
```bash
# Sync all products
./scripts/printful/sync-products.js

# Sync specific category
./scripts/printful/sync-products.js --category=apparel

# Force complete refresh
./scripts/printful/sync-products.js --force

# Preview without saving
./scripts/printful/sync-products.js --dry-run
```

### Pricing
```bash
# Update all prices
./scripts/printful/update-pricing.js

# Change markup
./scripts/printful/update-pricing.js --markup=3.0

# Preview price changes
./scripts/printful/update-pricing.js --dry-run
```

### Inventory
```bash
# Check all stock
./scripts/printful/check-inventory.js

# Check specific product
./scripts/printful/check-inventory.js --product=71

# Check US region only
./scripts/printful/check-inventory.js --region=US
```

### Mockups
```bash
# Generate mockups
./scripts/printful/create-mockups.js \
  --product=71 \
  --design=./logo.png

# Specific variants
./scripts/printful/create-mockups.js \
  --product=71 \
  --design=./logo.png \
  --variants=4011,4012
```

## QUICK FIXES

### "401 Unauthorized"
```bash
# Check API key
echo $PRINTFUL_API_KEY

# Should start with "pk_" (not "sandbox_")
# Update in .env.local and Vercel
```

### "429 Rate Limited"
```typescript
// Add delay between requests
await sleep(500)  // 500ms = 120 req/min limit
```

### "Product not found"
```bash
# Re-sync catalog
./scripts/printful/sync-products.js --force
```

### "Mockups timeout"
```typescript
// Increase wait time
async function waitForMockups(taskKey, maxAttempts = 60) {
  // 60 attempts * 2 seconds = 2 minutes
}
```

## API ENDPOINTS

### Products
```bash
GET /catalog/products              # All products
GET /catalog/products/71           # Product details
GET /catalog/variants/4011         # Variant details
GET /catalog/categories            # Categories
```

### Orders
```bash
POST /orders                       # Create order
POST /orders/{id}/confirm          # Confirm order
GET /orders/{id}                   # Order status
DELETE /orders/{id}                # Cancel order
POST /orders/estimate-costs        # Estimate costs
```

### Shipping
```bash
POST /shipping/rates               # Get shipping methods
```

### Mockups
```bash
POST /mockup-generator/create-task/{id}
GET /mockup-generator/task?task_key={key}
```

## POPULAR PRODUCTS

| ID | Name | Brand | Cost | Recommended Price |
|----|------|-------|------|-------------------|
| 71 | T-Shirt | Bella + Canvas 3001 | $11.50 | $32 |
| 146 | Hoodie | Gildan 18000 | $26.50 | $74 |
| 19 | Mug | Ceramic 11oz | $8.50 | $24 |
| 377 | Tote Bag | Cotton Canvas | $9.00 | $25 |

## VARIANT IDS

### Bella + Canvas 3001 (Product 71)
```
Black / S:    4011
Black / M:    4012
Black / L:    4013
Black / XL:   4014

White / S:    4016
White / M:    4017
White / L:    4018
White / XL:   4019

Navy / S:     4021
Navy / M:     4022
Navy / L:     4023
Navy / XL:    4024
```

## PRICING FORMULAS

### Standard Markup
```typescript
const retailPrice = printfulCost * 2.8
const rounded = Math.ceil(retailPrice / 5) * 5
```

### Margin Calculation
```typescript
const profit = retailPrice - printfulCost
const margin = (profit / retailPrice) * 100
```

### Example
```
Cost: $11.50
Markup: 2.8x
Price: $11.50 * 2.8 = $32.20 → $35
Profit: $35 - $11.50 = $23.50
Margin: ($23.50 / $35) * 100 = 67%
```

## IMAGE REQUIREMENTS

| Property | Requirement |
|----------|-------------|
| Resolution | 300 DPI minimum |
| Color Space | sRGB |
| Format | PNG (preferred) or JPG |
| Max Size | 20 MB |
| Max Dimensions | 12000 x 12000 px |

### T-Shirt Print Area
```javascript
{
  area_width: 1800,   // Printable width
  area_height: 2400,  // Printable height
  width: 1800,        // Design width
  height: 1800,       // Design height (square)
  top: 300,           // 3" from top
  left: 0             // Centered
}
```

## RATE LIMITS

- **Standard:** 120 requests/minute
- **Mockup Generator:** 60 requests/minute
- **File Upload:** 10 requests/minute

**Safe interval:** 500ms between requests

## WEBHOOK EVENTS

```typescript
package_shipped      // Order shipped
package_returned     // Order returned
order_failed        // Order failed
order_canceled      // Order canceled
product_synced      // Product updated
stock_updated       // Inventory changed
```

## FILE LOCATIONS

```
/docs/printful/
  ├── README.md                    # Main docs
  ├── INTEGRATION-CHECKLIST.md     # Setup guide
  ├── BEST-PRACTICES.md            # Guidelines
  ├── API-REFERENCE.md             # API docs
  └── TROUBLESHOOTING.md           # Solutions

/scripts/printful/
  ├── sync-products.js             # Product sync
  ├── create-mockups.js            # Mockups
  ├── update-pricing.js            # Pricing
  ├── check-inventory.js           # Inventory
  └── test-connection.js           # Testing

/data/
  ├── curated-products.json        # Product cache
  ├── product-mockups.json         # Mockup URLs
  ├── pricing-history.json         # Price log
  └── inventory-log.json           # Stock log
```

## ERROR CODES

| Code | Meaning | Action |
|------|---------|--------|
| 200 | Success | Continue |
| 400 | Bad Request | Check payload |
| 401 | Unauthorized | Check API key |
| 404 | Not Found | Check ID |
| 429 | Rate Limited | Add delay |
| 500 | Server Error | Retry |

## SUPPORT CONTACTS

- **Email:** support@printful.com
- **Phone:** +1 (855) 558-1816
- **Status:** https://status.printful.com
- **Docs:** https://developers.printful.com

## ENVIRONMENT VARIABLES

```env
PRINTFUL_API_KEY=pk_xxxxx
PRINTFUL_STORE_ID=12345
PRINTFUL_WEBHOOK_SECRET=xxxxx
PRINTFUL_SANDBOX_MODE=false
NEXT_PUBLIC_SITE_URL=https://brandonmills.com
```

## DEBUGGING TIPS

1. **Enable verbose logging**
   ```typescript
   console.log('API Request:', { endpoint, method, body })
   console.log('API Response:', { status, data })
   ```

2. **Check raw API response**
   ```bash
   curl -v "https://api.printful.com/catalog/products" \
     -H "Authorization: Bearer $PRINTFUL_API_KEY"
   ```

3. **Validate JSON**
   ```bash
   cat data/curated-products.json | jq .
   ```

4. **Test webhook locally**
   ```bash
   # Use ngrok for local testing
   ngrok http 3000
   # Use ngrok URL in Printful dashboard
   ```

## PERFORMANCE TIPS

- Cache products for 24 hours
- Batch API requests
- Pre-generate popular mockups
- Use CDN for images
- Implement rate limiter
- Queue background tasks

## QUICK TROUBLESHOOTING

**Products not showing?**
```bash
./scripts/printful/sync-products.js --force
```

**Prices wrong?**
```bash
./scripts/printful/update-pricing.js
```

**Out of stock?**
```bash
./scripts/printful/check-inventory.js --product=71
```

**API not responding?**
```bash
./scripts/printful/test-connection.js
```

**Webhooks not working?**
- Check signature validation
- Verify webhook URL is public
- Test with ngrok locally
- Check Printful dashboard for delivery errors

---

**Print this card** and keep it handy for quick reference!

**Last Updated:** November 5, 2025