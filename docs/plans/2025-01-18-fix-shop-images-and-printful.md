# Shop Image Display & Printful Integration Fix Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix missing product images on production and complete Printful integration with all 20 products synced

**Architecture:**
1. Verify images are deployed to Vercel and accessible
2. Fix Printful variant IDs to match current catalog
3. Sync all 20 theme factory products to Printful
4. Update shop to fetch and display real Printful products

**Tech Stack:** Next.js 15, Vercel, Printful API v2, TypeScript, Sharp

---

## Task 1: Verify Image Deployment

**Files:**
- Check: `public/designs/rendered/**/*.{png,jpg}`
- Verify: Vercel deployment includes all images

**Step 1: Confirm images are in git**

Run: `git ls-files public/designs/rendered | wc -l`
Expected: Should show 20+ files (all rendered designs)

**Step 2: Test image accessibility on production**

Visit these URLs and verify they load:
- https://brandonmills.com/designs/rendered/poetry/fine-lines/t-shirt.png
- https://brandonmills.com/designs/rendered/photography/am-reed-aqua/poster.jpg
- https://brandonmills.com/designs/rendered/philosophy/enlightenment-science/mug.png

Expected: Images load successfully (not 404)

**Step 3: If images 404, check Vercel build output**

Run: `npx vercel ls`
Check latest deployment logs for image inclusion

**Step 4: Force cache clear if needed**

If images exist but not showing:
- Clear Vercel cache: Settings → Functions → Purge Everything
- Wait 2-3 minutes for propagation

---

## Task 2: Fix Printful Variant IDs

**Files:**
- Modify: `scripts/sync-printful-production.ts`
- Reference: https://developers.printful.com/docs/#tag/Catalog-API

**Current Issues:**
- Mug variant 1321 - NOT AVAILABLE (need correct white glossy mug variant)
- Poster variant 3483 - NOT AVAILABLE (need correct poster size variant)

**Step 1: Fetch available catalog products**

Create temporary test script to discover correct variant IDs:

```typescript
// scripts/test-printful-catalog.ts
import { PrintfulClient } from '../lib/printful-client'

async function testCatalog() {
  const client = new PrintfulClient(process.env.PRINTFUL_API_KEY!)

  // Test mugs
  console.log('\n=== MUGS ===')
  const mugProduct = await client.get('/products/19') // White Glossy Mug
  console.log('Available variants:', mugProduct.result.variants)

  // Test posters
  console.log('\n=== POSTERS ===')
  const posterProduct = await client.get('/products/1') // Poster
  console.log('Available variants:', posterProduct.result.variants)
}

testCatalog()
```

Run: `npx tsx scripts/test-printful-catalog.ts`
Expected: Lists all available variant IDs for mugs and posters

**Step 2: Update variant mappings in sync script**

Modify `scripts/sync-printful-production.ts`:

```typescript
// Update PRODUCT_MAPPINGS with correct variant IDs
const PRODUCT_MAPPINGS = {
  'mug': {
    printfulProductId: 19, // White Glossy Mug
    variants: [
      { size: '11oz', variantId: 1163 }, // Updated from 1321
      { size: '15oz', variantId: 1164 }
    ]
  },
  'poster': {
    printfulProductId: 1, // Poster
    variants: [
      { size: '12×18', variantId: 1555 }, // Updated from 3483
      { size: '18×24', variantId: 1556 }
    ]
  },
  // ... rest of mappings
}
```

**Step 3: Verify updated mappings**

Run: `npx tsx scripts/sync-printful-production.ts --test`
Expected: No "Variant not available" errors

**Step 4: Commit fix**

```bash
git add scripts/sync-printful-production.ts scripts/test-printful-catalog.ts
git commit -m "fix: update Printful variant IDs to match current catalog"
```

---

## Task 3: Sync All 20 Products to Printful

**Files:**
- Run: `scripts/sync-printful-production.ts`
- Output: `public/designs/printful-sync.json`

**Step 1: Run full production sync**

```bash
cd "/Volumes/Super Mastery/Webdesigner"
NODE_ENV=production npx tsx scripts/sync-printful-production.ts
```

Expected output:
```
✅ Successful: 20 products
❌ Failed: 0 products
📁 Total processed: 20 designs
```

**Step 2: Verify products in Printful dashboard**

Visit: https://www.printful.com/dashboard/store/products
Expected: See all 20 products listed:
- 5 Poetry products (Fine Lines, Poet Proponent, The Tourbillon)
- 12 Photography products (AM Reed series)
- 3 Philosophy products (Enlightenment, Self-Esteem, Social Theory)

**Step 3: Check mockup generation**

For each product, verify:
- Mockup images generated
- Product appears correctly on product preview
- Pricing is set (retail prices from our catalog)

**Step 4: Save sync results**

```bash
git add public/designs/printful-sync.json
git commit -m "chore: sync all 20 products to Printful catalog"
```

---

## Task 4: Update Shop to Display Printful Products

**Files:**
- Modify: `app/api/store/products/route.ts`
- Modify: `app/shop/page.tsx`
- Modify: `lib/shop-merger.ts`

**Step 1: Verify API fetches from Printful**

Check `app/api/store/products/route.ts`:

```typescript
export async function GET() {
  try {
    const client = new PrintfulClient(process.env.PRINTFUL_API_KEY!)

    // Fetch sync products from Printful
    const response = await client.get('/store/products')
    const syncProducts = response.result || []

    console.log(`📦 Fetched ${syncProducts.length} products from Printful`)

    // Convert to our product format
    const products = syncProducts.map(convertPrintfulProduct)

    return NextResponse.json({
      success: true,
      products,
      source: 'printful'
    })
  } catch (error) {
    console.error('Printful API error:', error)
    // Fallback to local products
    return NextResponse.json({
      success: false,
      products: [],
      error: 'Printful API unavailable'
    })
  }
}
```

**Step 2: Test API endpoint**

Run dev server: `npm run dev`
Visit: http://localhost:3000/api/store/products
Expected: JSON response with 20+ products from Printful

**Step 3: Update shop page to show source**

Modify `app/shop/shop-client.tsx` to display product source:

```typescript
{product.source === 'printful' && (
  <span className="badge badge-printful">Original Design</span>
)}
{product.source === 'amazon' && (
  <span className="badge badge-amazon">Curated</span>
)}
```

**Step 4: Verify shop displays Printful products**

Visit: http://localhost:3000/shop
Expected:
- See all 20 theme factory products with "Original Design" badges
- See 21 Amazon products with "Curated" badges
- Total: 41 products

**Step 5: Test product images**

Verify each product card shows:
- Design preview image
- Hover state works
- Modal opens with full details
- Mockup images visible

**Step 6: Commit changes**

```bash
git add app/api/store/products/route.ts app/shop/shop-client.tsx
git commit -m "feat: integrate Printful sync products into shop display"
```

---

## Task 5: Remove Old Store Route

**Files:**
- Check: `app/store/` directory should NOT exist
- Verify: No references to `/store` in codebase

**Step 1: Confirm store route is deleted**

Run: `ls -la app/store 2>&1`
Expected: "No such file or directory"

**Step 2: Search for any remaining /store references**

Run: `grep -r "/store" app/ components/ --include="*.tsx" --include="*.ts"`
Expected: No results (or only in comments/docs)

**Step 3: Update navigation if needed**

Check `components/layout/navigation.tsx` for any store links
Ensure all nav points to `/shop`

**Step 4: Verify redirects**

Add redirect in `next.config.js` if not already present:

```javascript
async redirects() {
  return [
    {
      source: '/store',
      destination: '/shop',
      permanent: true,
    },
  ]
}
```

**Step 5: Commit**

```bash
git add next.config.js
git commit -m "feat: redirect /store to /shop permanently"
```

---

## Task 6: Deploy to Production

**Files:**
- Deploy: All changes to Vercel

**Step 1: Run production build locally**

```bash
npm run build
```

Expected: Build succeeds with no errors

**Step 2: Push to GitHub**

```bash
git push origin main
```

Expected: Vercel auto-deploys via GitHub integration

**Step 3: Monitor deployment**

Run: `npx vercel ls`
Expected: New deployment appears as "Ready" after 2-3 minutes

**Step 4: Verify production site**

Visit: https://brandonmills.com/shop

Verify:
- ✅ All product images load
- ✅ 41 products total (20 Printful + 21 Amazon)
- ✅ "Original Design" badges on Printful products
- ✅ Product modals work
- ✅ Filters work (Poetry, Photography, Philosophy)
- ✅ Mobile responsive
- ✅ No console errors

**Step 5: Test /store redirect**

Visit: https://brandonmills.com/store
Expected: Redirects to /shop

**Step 6: Final verification**

Create checklist and verify:
- [ ] Images visible on all products
- [ ] Printful integration active
- [ ] Shop displays 41 products
- [ ] Amazon affiliate links work
- [ ] Add to cart works
- [ ] Mobile experience smooth
- [ ] No broken links

---

## Success Criteria

✅ **All product images load** on https://brandonmills.com/shop
✅ **20 Printful products synced** and visible in Printful dashboard
✅ **Shop displays 41 total products** (20 Printful + 21 Amazon)
✅ **Product sources clearly labeled** (Original vs Curated)
✅ **No /store route** (redirects to /shop)
✅ **Zero console errors** on production
✅ **Mobile responsive** and touch-friendly

---

## Rollback Plan

If issues occur:

1. **Images not loading:**
   - Check Vercel deployment logs
   - Verify `public/designs/rendered/` in build output
   - Clear Vercel cache and redeploy

2. **Printful API errors:**
   - Check PRINTFUL_API_KEY environment variable
   - Verify Printful store is active
   - Check API rate limits (120 requests/min)

3. **Shop not displaying products:**
   - Check `/api/store/products` endpoint
   - Verify API returns valid JSON
   - Check browser console for errors
   - Fallback to local product JSON if needed

---

## Estimated Time

- Task 1: Image verification - 10 minutes
- Task 2: Fix variant IDs - 15 minutes
- Task 3: Sync all products - 20 minutes
- Task 4: Update shop display - 15 minutes
- Task 5: Remove store route - 5 minutes
- Task 6: Deploy & verify - 15 minutes

**Total: ~80 minutes** (1.5 hours)
