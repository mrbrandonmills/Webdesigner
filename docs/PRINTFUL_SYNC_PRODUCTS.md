# Printful Sync Products Integration Documentation

## Overview

This implementation enables AI-generated designs to create actual orderable products on Printful through their Sync Products API. When designs are generated using DALL-E 3, they are automatically uploaded to Printful, sync products are created, and mockups are generated.

## Architecture

### Flow Diagram

```
User Request → Generate AI Design → Upload to Printful → Create Sync Product → Generate Mockup → Store in DB
                    ↓                      ↓                    ↓                    ↓              ↓
                 DALL-E 3            Printful Files API    Sync Products API   Mockup Generator  JSON + API
```

## Key Components

### 1. Enhanced PrintfulClient (`/lib/printful-client.ts`)

The client now supports both v1 and v2 API endpoints with these new methods:

#### Sync Product Methods
- `getSyncProducts()` - List all sync products
- `getSyncProduct(id)` - Get specific sync product with variants
- `createSyncProduct(data)` - Create new sync product
- `updateSyncProduct(id, data)` - Update existing sync product
- `deleteSyncProduct(id)` - Delete sync product
- `createSyncVariant()` - Add variant to existing product

#### File & Mockup Methods
- `uploadFileFromUrl(url)` - Upload design from URL to Printful
- `generateMockup(data)` - Start mockup generation task
- `getMockupResult(taskKey)` - Poll for mockup result
- `createProductWithDesign()` - Helper that combines all steps

### 2. Product Generator (`/app/api/admin/generate-products/route.ts`)

Enhanced to create actual Printful products:

```typescript
// Product configurations with variant IDs
const productConfig = {
  'poster-medium': {
    name: '18×24" Gallery Print',
    price: '79.00',
    printfulId: 1,        // Catalog product ID
    variantId: 1,         // Specific variant ID
    placement: 'default'  // Design placement
  }
  // ... more products
}
```

When generating products:
1. AI design is created with DALL-E 3
2. Design is uploaded to Vercel Blob storage
3. Design URL is uploaded to Printful Files API
4. Sync product is created with the design
5. Mockup is generated (optional, continues if fails)
6. Product data is saved locally with sync IDs

### 3. Store Products API (`/app/api/store/products/route.ts`)

Implements a three-tier product sourcing strategy:

**Priority Order:**
1. **Printful Sync Products** - Actual orderable products with custom designs
2. **Local Curated Products** - AI-generated but not yet synced
3. **Printful Catalog Products** - Generic products as fallback

Features:
- 5-minute in-memory cache for performance
- Automatic fallback between tiers
- Source tracking for debugging
- Detailed variant information

### 4. Admin Management API (`/app/api/admin/sync-products/route.ts`)

Provides complete sync product management:

#### Endpoints

**GET /api/admin/sync-products**
- List all sync products
- Optional `?details=true` for full information

**DELETE /api/admin/sync-products**
- Delete one or more sync products
- Updates local database to remove references

**POST /api/admin/sync-products**
Actions:
- `sync` - Sync unsynced local products to Printful
- `refresh-mockups` - Regenerate mockups for products
- `status` - Check sync status and find orphaned products

## Product Variant Mapping

### Posters (Product ID: 1)
- `1349` - 12×16" poster
- `1` - 18×24" poster (default)
- `2` - 24×36" poster

### Canvas (Product ID: 29)
- `6578` - 16×20" canvas
- `6579` - 18×24" canvas
- `6580` - 24×36" canvas

### T-Shirts (Product ID: 71)
- `4012` - Unisex Medium Black
- `4011` - Unisex Small Black
- `4013` - Unisex Large Black

## API Response Formats

### Sync Product Structure
```json
{
  "id": 12345678,
  "external_id": "consciousness-poster-1234567890",
  "name": "Consciousness Collection - 18×24\" Gallery Print",
  "thumbnail_url": "https://files.cdn.printful.com/...",
  "sync_variants": [{
    "id": 87654321,
    "variant_id": 1,
    "retail_price": "79.00",
    "currency": "USD",
    "files": [{
      "type": "default",
      "url": "https://files.cdn.printful.com/...",
      "preview_url": "https://files.cdn.printful.com/..."
    }]
  }]
}
```

### Store API Response
```json
{
  "success": true,
  "products": [...],
  "count": 25,
  "sources": {
    "syncProducts": 10,
    "curatedProducts": 5,
    "catalogProducts": 10
  }
}
```

## Testing

### Manual Testing with cURL

1. **Generate AI Product:**
```bash
curl -X POST http://localhost:3000/api/admin/generate-products \
  -u "Bmilly23:Brandon.mills23" \
  -H "Content-Type: application/json" \
  -d '{"themes":["consciousness"],"products":["poster-medium"]}'
```

2. **Check Sync Status:**
```bash
curl -X POST http://localhost:3000/api/admin/sync-products \
  -u "Bmilly23:Brandon.mills23" \
  -H "Content-Type: application/json" \
  -d '{"action":"status"}'
```

3. **List Sync Products:**
```bash
curl http://localhost:3000/api/admin/sync-products?details=true \
  -u "Bmilly23:Brandon.mills23"
```

4. **Get Store Products:**
```bash
curl http://localhost:3000/api/store/products
```

### Automated Testing

Run the test script:
```bash
node scripts/test-printful-sync.js
```

This tests the complete flow from AI generation to product availability.

## Environment Variables

Required in `.env.local`:
```env
# Printful API credentials
PRINTFUL_API_KEY=your_api_key
PRINTFUL_STORE_ID=your_store_id

# OpenAI for design generation (optional)
OPENAI_API_KEY=sk-...

# Vercel Blob for design storage
BLOB_READ_WRITE_TOKEN=vercel_blob_...
```

## Rate Limits & Best Practices

### Printful API Limits
- **Rate Limit:** 120 requests per minute
- **File Upload:** Max 200MB per file
- **Mockup Generation:** Can take 5-30 seconds

### Optimization Strategies
1. **Caching:** Store API implements 5-minute cache
2. **Batch Operations:** Process multiple products together
3. **Async Processing:** Mockup generation continues in background
4. **Graceful Degradation:** Falls back to placeholders on failure

## Error Handling

The implementation includes comprehensive error handling:

1. **API Failures:** Gracefully continues with local data
2. **Mockup Failures:** Uses design URL as fallback
3. **Rate Limiting:** Returns appropriate error codes
4. **Missing Credentials:** Clear error messages

## Limitations & Known Issues

### Current Limitations
1. **API Version:** Uses v1 API for sync products (v2 not yet available)
2. **Mockup Generation:** Sometimes slow or fails (non-blocking)
3. **Variant Support:** Currently creates single variant per product
4. **Design Placement:** Uses default placement for all products

### Potential Improvements
1. Add support for multiple variants (sizes, colors)
2. Implement webhook support for order processing
3. Add bulk operations for better performance
4. Create UI for managing sync products
5. Add inventory tracking

## Troubleshooting

### Common Issues

**Problem:** Products not appearing in store
- Check Printful API credentials
- Verify sync product creation succeeded
- Check console logs for errors
- Try refreshing with `?refresh=true`

**Problem:** Mockups not generating
- Verify design URL is accessible
- Check variant ID is correct
- Review Printful dashboard for errors
- Mockup generation is optional, products still work

**Problem:** AI design generation fails
- Verify OpenAI API key is set
- Check API quota/billing
- Falls back to placeholder designs

## Printful Dashboard

After creating sync products, you can manage them at:
https://www.printful.com/dashboard/sync-products

Features available:
- View all sync products
- Edit product details
- Generate new mockups
- View order history
- Manage pricing

## Security Considerations

1. **API Keys:** Never commit to version control
2. **Admin Routes:** Protected with basic auth
3. **File Uploads:** Validated and sanitized
4. **Error Messages:** Sanitized for client responses
5. **Rate Limiting:** Implement on production

## Support

For issues or questions:
1. Check Printful API docs: https://developers.printful.com
2. Review error logs in console
3. Test with the provided test script
4. Verify all environment variables are set

## Conclusion

This implementation provides a complete integration between AI-generated designs and Printful's print-on-demand platform. Products created through the admin interface are immediately orderable through Printful's fulfillment network.