# Product Schema Implementation for SEO Rich Snippets

## Overview

This document details the implementation of comprehensive JSON-LD structured data for all 21 product pages on brandonmills.com. The schema markup enables Google rich results, displaying star ratings, prices, availability, and other product information directly in search results.

## Implementation Details

### Files Created/Modified

1. **`/components/seo/ProductSchema.tsx`** (NEW)
   - `ProductSchema`: Generates Product schema with offers, ratings, brand info
   - `BreadcrumbSchema`: Generates breadcrumb navigation for search results
   - `OrganizationSchema`: Defines site owner/organization (for future use)

2. **`/app/shop/[slug]/page.tsx`** (MODIFIED)
   - Integrated ProductSchema and BreadcrumbSchema components
   - Updated to Next.js 15 async params pattern
   - Enhanced metadata with keywords and improved SEO titles

3. **`/tsconfig.json`** (MODIFIED)
   - Excluded scripts directory from TypeScript compilation

4. **API Routes** (MODIFIED for Stripe API version compatibility)
   - `/app/api/books/unlock/route.ts`
   - `/app/api/stripe/create-checkout/route.ts`
   - `/app/api/webhooks/stripe/route.ts`
   - `/app/api/stripe/verify-purchase/route.ts`

## Schema Structure

### Product Schema
```json
{
  "@context": "https://schema.org/",
  "@type": "Product",
  "name": "Product Name",
  "description": "Product description",
  "brand": {
    "@type": "Brand",
    "name": "Brand Name"
  },
  "sku": "product-id",
  "productID": "product-id",
  "image": ["https://brandonmills.com/images/product.jpg"],
  "offers": {
    "@type": "Offer",
    "url": "https://brandonmills.com/shop/product-slug",
    "price": "99.99",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock",
    "priceValidUntil": "2025-12-17",
    "seller": {
      "@type": "Organization",
      "name": "Brandon Mills",
      "url": "https://brandonmills.com"
    }
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.7",
    "reviewCount": 12345,
    "bestRating": "5",
    "worstRating": "1"
  },
  "category": "Product Category"
}
```

### Breadcrumb Schema
```json
{
  "@context": "https://schema.org/",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://brandonmills.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Shop",
      "item": "https://brandonmills.com/shop"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Category",
      "item": "https://brandonmills.com/shop?category=Category"
    },
    {
      "@type": "ListItem",
      "position": 4,
      "name": "Product Name",
      "item": "https://brandonmills.com/shop/product-slug"
    }
  ]
}
```

## Products with Schema Markup

All 21 products now have complete schema markup:

### Beauty & Skincare
1. Braun IPL Laser Hair Removal (`/shop/braun-ipl-laser-hair-removal`)
2. La Mer Moisturizing Cream (`/shop/la-mer-moisturizing-cream`)
3. SkinCeuticals Vitamin C Serum (`/shop/skinceuticals-vitamin-c-serum`)

### Technology
4. MacBook Pro 16" M3 Max (`/shop/macbook-pro-16-m3-max`)
5. iPhone 16 Pro Max (`/shop/iphone-16-pro-max`)

### Photography & Studio
6. Godox LED Video Light (`/shop/godox-led-video-light`)

### Philosophy & Books
7. Atomic Habits (`/shop/atomic-habits-book`)
8. Meditations by Marcus Aurelius (`/shop/meditations-marcus-aurelius`)
9. Sapiens by Yuval Noah Harari (`/shop/sapiens-harari`)
10. The Republic by Plato (`/shop/the-republic-plato`)

### Model & Lifestyle
11. NASA Vintage Hoodie (`/shop/nasa-vintage-hoodie`)
12. NASA Worm Logo Shirt (`/shop/nasa-worm-logo-shirt`)

### Plant Care
13. Spider Farmer LED Grow Light (`/shop/spider-farmer-led-grow-light`)

### Premium Tech & Audio
14. AirPods Max (`/shop/airpods-max`)
15. iPad Pro 13" M4 (`/shop/ipad-pro-13-m4`)
16. Sony WH-1000XM5 Headphones (`/shop/sony-wh-1000xm5-headphones`)
17. Apple Watch Ultra 2 (`/shop/apple-watch-ultra-2`)

### Luxury Lifestyle & Quality
18. YETI Rambler 30 oz (`/shop/yeti-rambler-30oz`)
19. Kindle Oasis (`/shop/kindle-oasis`)
20. Moleskine Classic Notebook (`/shop/moleskine-classic-notebook`)
21. Rocketbook Everlast (`/shop/rocketbook-everlast`)

## Testing & Validation

### 1. Google Rich Results Test

Test individual product pages using Google's official tool:

**URL**: https://search.google.com/test/rich-results

**Example URLs to test**:
- https://brandonmills.com/shop/airpods-max
- https://brandonmills.com/shop/braun-ipl-laser-hair-removal
- https://brandonmills.com/shop/atomic-habits-book

**Expected Results**:
- ✅ Product schema detected
- ✅ Breadcrumb schema detected
- ✅ Valid offers with price and availability
- ✅ Aggregate rating with review count
- ✅ Brand information

### 2. Schema.org Validator

**URL**: https://validator.schema.org/

1. Visit any product page
2. View page source (Cmd+U or Ctrl+U)
3. Copy the entire JSON-LD script content
4. Paste into validator
5. Verify no errors

### 3. Local Testing

```bash
# Start development server
npm run dev

# Test a specific product
curl -s http://localhost:3000/shop/airpods-max | grep -A 50 'application/ld+json'
```

### 4. Manual Inspection

Visit any product page and:
1. Right-click > "View Page Source"
2. Search for `application/ld+json`
3. Verify two schema blocks appear:
   - Product schema
   - Breadcrumb schema

## Expected SEO Benefits

### Rich Snippets in Google Search

Once indexed, products will display:

1. **Star Ratings**: ⭐⭐⭐⭐⭐ 4.7 (18,234 reviews)
2. **Price**: $549.00 - In Stock
3. **Availability**: Available online
4. **Breadcrumbs**: Home > Shop > Premium Tech > AirPods Max
5. **Brand**: Apple

### Improved Click-Through Rates (CTR)

- **Before**: Plain text listing
- **After**: Eye-catching rich snippet with ratings, price, availability
- **Expected CTR increase**: 15-30% based on industry benchmarks

### Better Search Visibility

- Products eligible for Google Shopping results
- Enhanced mobile search appearance
- Featured in product carousels
- Better matching for product-specific searches

## Monitoring & Maintenance

### 1. Google Search Console

Monitor rich results performance:
1. Go to Search Console > Enhancements > Products
2. Check for errors or warnings
3. Track impressions and clicks on rich results

### 2. Monthly Review

- Verify all 21 products still have valid schema
- Update `priceValidUntil` dates if needed (currently set to 30 days)
- Check for new Google schema requirements

### 3. When Adding New Products

For any new products added to `/lib/affiliate-products.ts`:

1. Schema is **automatically generated** from product data
2. No additional code changes required
3. Test new product URL with Google Rich Results Test
4. Submit URL to Google Search Console for indexing

## Technical Notes

### Next.js 15 Compatibility

- Updated to use async params pattern: `params: Promise<{ slug: string }>`
- Both `generateMetadata` and page component are now async
- Fully compatible with Next.js 15.5.6

### Dynamic Schema Generation

Schema is **dynamically generated** from product data:
- No hardcoded values
- Automatically pulls from `affiliate-products.ts`
- Updates when product data changes
- Supports all product types and categories

### Image Handling

- Uses product images if available: `product.images[0]`
- Falls back to site OG image if product images not set
- Supports multiple product images in array format

### Price Validity

- `priceValidUntil` automatically set to 30 days from current date
- Google requires this field to prevent showing outdated prices
- Update interval can be adjusted in ProductSchema component

## Troubleshooting

### Schema Not Appearing in Search

1. **Wait for indexing**: Can take 2-4 weeks for Google to crawl and index
2. **Submit to Search Console**: Manually request indexing
3. **Check robots.txt**: Ensure product pages aren't blocked
4. **Verify schema validity**: Use Rich Results Test tool

### Validation Errors

Common errors and fixes:

**Error**: "Missing required field 'image'"
- **Fix**: Ensure product has at least one image in `product.images[]`

**Error**: "Invalid price format"
- **Fix**: Price must be formatted as string: `"549.00"`

**Error**: "Availability URL invalid"
- **Fix**: Must use full schema.org URL: `https://schema.org/InStock`

### Development Server Issues

If schema doesn't appear in dev:
1. Clear `.next` cache: `rm -rf .next`
2. Restart dev server: `npm run dev`
3. Hard refresh browser: Cmd+Shift+R or Ctrl+Shift+F5

## Future Enhancements

### Potential Additions

1. **Review Schema**: Add individual customer reviews
2. **Video Schema**: Add product demo videos
3. **FAQ Schema**: Product-specific Q&A
4. **How-To Schema**: Usage guides for complex products
5. **Organization Schema**: Enhanced site-wide branding

### A/B Testing

Consider testing:
- Different description lengths
- Including/excluding sale prices
- Rating thresholds (hide if below 4.0?)
- Image variations

## Resources

- [Google Product Schema Documentation](https://developers.google.com/search/docs/appearance/structured-data/product)
- [Schema.org Product Specification](https://schema.org/Product)
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Google Search Console](https://search.google.com/search-console)

## Commit Information

**Commit Message**: `feat: add product schema markup for SEO rich snippets`

**Files Changed**:
- `components/seo/ProductSchema.tsx` (new)
- `app/shop/[slug]/page.tsx` (modified)
- `tsconfig.json` (modified)
- `app/api/books/unlock/route.ts` (modified)
- `app/api/stripe/create-checkout/route.ts` (modified)
- `app/api/webhooks/stripe/route.ts` (modified)
- `app/api/stripe/verify-purchase/route.ts` (modified)
- `app/meditations/[slug]/layout.tsx` (modified)
- `app/meditations/[slug]/success/page.tsx` (modified)

---

**Last Updated**: November 17, 2025
**Author**: Brandon Mills
**Status**: ✅ Implemented and Tested
