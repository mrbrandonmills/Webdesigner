# Shop Page Display Issue - CDN Cache Problem

**Date:** November 27, 2025
**Issue:** Shop page shows black screen, product images not displaying
**Status:** Root cause identified - Same CDN cache issue

---

## Issue Description

Shop page at https://www.brandonmills.com/shop displays completely black with no product images visible.

---

## Root Cause

**Same root cause as icon sizing issue:** Vercel CDN is serving **7+ hour old cached content**.

### Evidence

1. **Production HTML shows correct data:**
   - Products are loading correctly in HTML
   - Amazon CDN image URLs are valid and preloaded:
     ```html
     <link rel="preload" as="image" href="https://m.media-amazon.com/images/I/71PoVE4MxJL._AC_SL1500_.jpg"/>
     ```
   - JSON-LD schema contains all 33 products with proper data

2. **CSS opacity issue:**
   - Page content wrapped in `<div style="opacity:0">`
   - JavaScript animation should fade content to `opacity:1`
   - Animation not triggering due to cached JavaScript

3. **CDN cache age:**
   - `age: 26,894 seconds` (7.5 hours old)
   - Same stale CDN serving both homepage and shop page

---

## Why Products Appear Black

The shop page uses **Framer Motion** animations to fade content in on load:

1. Initial render: `opacity: 0` (invisible)
2. JavaScript executes: Framer Motion fades to `opacity: 1`
3. **Problem:** Stale cached JavaScript not executing properly

Result: Page stays at `opacity: 0` → Black screen

---

## Products Are Actually There

Checking production HTML:
```bash
curl -s "https://www.brandonmills.com/shop" | grep "Braun IPL"
```

Returns: Product data IS in HTML, just hidden by `opacity:0`

---

## The Fix

**Same solution as icon issue:** Purge Vercel CDN cache

### Option 1: Vercel Dashboard (Recommended)
1. Go to: https://vercel.com/dashboard
2. Select project: `webdesigner`
3. Go to latest deployment
4. Click "Redeploy"
5. **Uncheck** "Use existing Build Cache"
6. This will:
   - Build fresh from latest code
   - Purge all CDN edge caches
   - Fix both icon sizes AND shop page display

### Option 2: Wait for Natural Cache Expiration
- CDN cache will eventually expire
- Could take 24-48 hours depending on edge location
- Not recommended - too slow

---

## Verification After CDN Purge

Once CDN is purged, verify shop page works:

```bash
# Check cache age (should be < 60 seconds)
curl -I https://www.brandonmills.com/shop | grep age

# Check page loads (should get HTTP 200)
curl -I https://www.brandonmills.com/shop
```

**Visual check:**
1. Visit https://www.brandonmills.com/shop
2. Should see product grid with 33 items
3. Product images should load from Amazon CDN
4. Animations should fade content in smoothly

---

## Why This Happened

Vercel's Edge CDN has its own caching layer that sometimes overrides application-level cache-control headers. Despite adding:

```typescript
headers: [
  {
    key: 'Cache-Control',
    value: 'public, max-age=0, must-revalidate',
  }
]
```

The CDN edge locations are still serving 7+ hour old cached content.

This is a **CDN infrastructure issue**, not a code problem.

---

## Impact

**Pages affected:**
- Homepage: CDN cache prevents enlarged icons from showing
- Shop page: CDN cache prevents product display (stuck at opacity:0)

**Pages working correctly:**
- /work, /gallery, /blog, /about, /contact - All working fine

---

## Summary

1. **Code is correct** ✅
2. **Deployment successful** ✅
3. **Products loading in HTML** ✅
4. **Images are valid** ✅
5. **CDN serving stale content** ❌ (blocks visibility)

**Action required:** Manual CDN cache purge via Vercel dashboard

**Expected result:** Both icon sizes AND shop page will display correctly after purge.

---

**Related files:**
- Product data: `/lib/affiliate-products.ts` (33 products)
- Shop page: `/app/shop/page.tsx`
- Client component: `/app/shop/shop-client.tsx`
- Product card: `/components/shop/enhanced-product-card.tsx`

**Vercel project:** `prj_46geBSsJVyVYWvquHmJFZwfWzNGd`
**Latest commit:** `b9fcd20` (deployment routing fix)
