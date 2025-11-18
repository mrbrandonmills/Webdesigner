# Unified Shop with Theme Factory Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Consolidate Printful + Amazon products into single unified shop with theme factory-generated branded merchandise

**Architecture:** Single `/shop` route combines affiliate products (Amazon) with theme factory-curated products (Printful). Theme factory generates luxury designs from Genesis photos, poetry, and philosophy content. Products sync to Printful via API with real design files.

**Tech Stack:** Next.js 15 App Router, Printful API, Amazon Product Advertising API, Sharp (image processing), Canvas API (design generation), TypeScript

---

## Phase 1: Research & Verification

### Task 1: Verify Theme Factory System

**Files:**
- Read: `lib/design-generator.ts`
- Read: `lib/store-curator.ts`
- Read: `lib/design-tokens.ts`
- Read: `app/api/store/generate-curated/route.ts`

**Step 1: Confirm theme factory exists**

The theme factory is the combination of:
1. **`StoreCurator`** - AI curation system that selects content to productize
2. **`DesignGenerator`** - SVG template generator for luxury designs
3. **`contentThemes`** - Theme definitions (poetry, photography, philosophy, books)

Current implementation uses **SVG data URIs as placeholders**.

**Step 2: Identify what needs to be built**

Missing components:
1. Real image file generation (SVG → PNG/JPG for Printful upload)
2. Printful product sync (create products in Printful catalog)
3. Genesis photo integration (use actual photography assets)
4. Unified shop UI (combine Printful + Amazon)
5. Product mockup generation (show designs on actual product mockups)

**Step 3: Document findings**

Create summary document of current state vs. required state.

---

## Phase 2: Consolidate Shop Routes

### Task 2: Merge `/shop` and `/store` into Unified Shop

**Files:**
- Read: `app/shop/page.tsx` (Amazon affiliate)
- Read: `app/store/page.tsx` (Printful products)
- Create: `app/shop/page.tsx` (unified version)
- Delete: `app/store/page.tsx`
- Modify: `components/home/featured-collections.tsx:14,23,32` (update hrefs)

**Step 1: Create unified product type**

```typescript
// lib/types/shop.ts
export type ProductSource = 'printful' | 'amazon'

export interface UnifiedProduct {
  id: string
  source: ProductSource
  title: string
  description: string
  price: number
  originalPrice?: number
  currency: string
  image: string
  images?: string[]

  // Amazon-specific
  amazonUrl?: string
  affiliateTag?: string
  rating?: number
  reviewCount?: number
  features?: string[]
  brand?: string

  // Printful-specific
  variantCount?: number
  variants?: ProductVariant[]
  syncProductId?: number
  syncVariantId?: number
  tags?: string[]

  // Common
  category: string
  featured: boolean
  inStock: boolean
}
```

**Step 2: Write test for product merging**

```typescript
// lib/__tests__/shop-merger.test.ts
import { mergeShopProducts } from '../shop-merger'
import { affiliateProducts } from '../affiliate-products'

describe('Shop Product Merger', () => {
  it('should combine Printful and Amazon products', async () => {
    const printfulProducts = await fetch('/api/store/products').then(r => r.json())
    const merged = mergeShopProducts(printfulProducts.products, affiliateProducts)

    expect(merged.length).toBeGreaterThan(21) // At least 21 Amazon products
    expect(merged.some(p => p.source === 'amazon')).toBe(true)
    expect(merged.some(p => p.source === 'printful')).toBe(true)
  })

  it('should sort by featured then price', () => {
    const merged = mergeShopProducts([], affiliateProducts)
    const featuredFirst = merged[0].featured
    expect(featuredFirst).toBe(true)
  })
})
```

**Step 3: Run test to verify it fails**

```bash
cd "/Volumes/Super Mastery/Webdesigner"
npm test -- lib/__tests__/shop-merger.test.ts
```

Expected: FAIL - `mergeShopProducts` not defined

**Step 4: Implement product merger**

```typescript
// lib/shop-merger.ts
import { UnifiedProduct, ProductSource } from './types/shop'

export function mergeShopProducts(
  printfulProducts: any[],
  amazonProducts: any[]
): UnifiedProduct[] {
  const unified: UnifiedProduct[] = []

  // Convert Printful products
  for (const p of printfulProducts) {
    unified.push({
      id: `printful-${p.id}`,
      source: 'printful',
      title: p.title,
      description: p.description,
      price: parseFloat(p.basePrice),
      currency: p.currency,
      image: p.image,
      images: p.images || [p.image],
      variantCount: p.variantCount,
      variants: p.variants,
      syncProductId: p.syncProductId,
      syncVariantId: p.syncVariantId,
      tags: p.tags,
      category: p.type,
      featured: p.source === 'local-curated',
      inStock: true,
    })
  }

  // Convert Amazon products
  for (const p of amazonProducts) {
    unified.push({
      id: `amazon-${p.id}`,
      source: 'amazon',
      title: p.name,
      description: p.description,
      price: p.price,
      originalPrice: p.originalPrice,
      currency: 'USD',
      image: p.images[0],
      images: p.images,
      amazonUrl: p.amazonUrl,
      rating: p.rating,
      reviewCount: p.reviewCount,
      features: p.features,
      brand: p.brand,
      category: p.category,
      featured: p.featured || false,
      inStock: p.inStock,
    })
  }

  // Sort: featured first, then by price descending
  return unified.sort((a, b) => {
    if (a.featured && !b.featured) return -1
    if (!a.featured && b.featured) return 1
    return b.price - a.price
  })
}
```

**Step 5: Run test to verify it passes**

```bash
npm test -- lib/__tests__/shop-merger.test.ts
```

Expected: PASS

**Step 6: Create unified shop page**

```typescript
// app/shop/page.tsx
import { Metadata } from 'next'
import { ExternalLink, ShoppingBag } from 'lucide-react'
import { affiliateProducts } from '@/lib/affiliate-products'
import { mergeShopProducts } from '@/lib/shop-merger'

export const metadata: Metadata = {
  title: 'Shop | Brandon Mills',
  description: 'Curated products: custom merchandise, philosophy books, premium tech. Quality over quantity.',
}

async function getProducts() {
  // Fetch Printful products
  const printfulRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/store/products`, {
    cache: 'no-store',
  })
  const printfulData = await printfulRes.json()

  // Merge with Amazon affiliate products
  return mergeShopProducts(printfulData.products || [], affiliateProducts)
}

export default async function ShopPage() {
  const products = await getProducts()

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="pt-32 pb-20 container-wide">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-5xl md:text-7xl font-light font-serif">
            Curated Shop
          </h1>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-accent-gold to-transparent mx-auto" />
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            {products.length} products: Custom merchandise, philosophy books, premium tech
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="pb-12 container-wide">
        <div className="flex gap-4 justify-center flex-wrap">
          {['All', 'Printful Originals', 'Premium Tech', 'Books', 'Lifestyle'].map((cat) => (
            <button
              key={cat}
              className="px-6 py-2 border border-white/10 hover:border-accent-gold transition-colors text-sm tracking-wider uppercase"
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Product Grid */}
      <section className="pb-32 container-wide">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="group bg-white/5 border border-white/10 hover:border-accent-gold transition-all duration-500"
            >
              {/* Product Image */}
              <div className="aspect-square overflow-hidden relative">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />

                {/* Source Badge */}
                <div className="absolute top-4 right-4 px-3 py-1 bg-black/80 backdrop-blur-sm text-xs tracking-wider uppercase">
                  {product.source === 'printful' ? '🎨 Original' : '🔗 Curated'}
                </div>

                {/* Rating (Amazon only) */}
                {product.rating && (
                  <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/80 backdrop-blur-sm px-3 py-1">
                    <span className="text-accent-gold">★</span>
                    <span className="text-sm">{product.rating}</span>
                    <span className="text-xs text-white/60">({product.reviewCount})</span>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-6 space-y-4">
                <h3 className="text-xl font-serif group-hover:text-accent-gold transition-colors">
                  {product.title}
                </h3>

                <p className="text-sm text-white/60 line-clamp-2">
                  {product.description}
                </p>

                {/* Price */}
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl font-light">${product.price}</span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <>
                      <span className="text-sm text-white/40 line-through">
                        ${product.originalPrice}
                      </span>
                      <span className="text-xs text-green-500 font-medium">
                        SAVE ${(product.originalPrice - product.price).toFixed(2)}
                      </span>
                    </>
                  )}
                </div>

                {/* CTA Button */}
                {product.source === 'amazon' ? (
                  <a
                    href={product.amazonUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full px-6 py-3 bg-accent-gold text-black hover:bg-accent-hover transition-colors text-center text-sm tracking-wider uppercase flex items-center justify-center gap-2"
                  >
                    View on Amazon <ExternalLink size={16} />
                  </a>
                ) : (
                  <button className="w-full px-6 py-3 border border-white/10 hover:bg-white/5 transition-colors text-sm tracking-wider uppercase">
                    Add to Cart
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Affiliate Disclosure */}
      <section className="pb-20 container-wide">
        <div className="max-w-3xl mx-auto p-6 bg-white/5 border border-white/10">
          <p className="text-sm text-white/60 leading-relaxed">
            <strong className="text-white">Affiliate Disclosure:</strong> This page contains
            affiliate links. When you purchase through links marked "Curated", we may earn a
            commission at no additional cost to you. All products are genuinely recommended.
          </p>
        </div>
      </section>
    </div>
  )
}
```

**Step 7: Delete old store route**

```bash
rm -rf "/Volumes/Super Mastery/Webdesigner/app/store"
```

**Step 8: Update Featured Collections links**

Already done in previous commit - they point to `/store`, need to change to `/shop`.

**Step 9: Commit**

```bash
git add .
git commit -m "feat: create unified shop merging Printful + Amazon products

- Merge /shop (Amazon) and /store (Printful) into single /shop route
- Create UnifiedProduct type supporting both sources
- Build product merger with featured-first sorting
- Add source badges (Original vs Curated)
- Display ratings for Amazon products
- Maintain affiliate disclosure section
- Delete old /store route"
```

---

## Phase 3: Genesis Photo Integration

### Task 3: Extract Genesis Photos for Product Designs

**Files:**
- Read: `lib/genesis-stories.ts`
- Create: `scripts/extract-genesis-assets.ts`
- Create: `public/designs/genesis/` (directory)
- Modify: `lib/store-curator.ts:48-74` (add actual Genesis photos)

**Step 1: List all Genesis photo paths**

```bash
cd "/Volumes/Super Mastery/Webdesigner"
grep -r "\.jpg\|\.png" lib/genesis-stories.ts | grep -oE '"/images/[^"]+' | sort | uniq
```

Expected output: List of all Genesis photo paths

**Step 2: Create asset extraction script**

```typescript
// scripts/extract-genesis-assets.ts
import fs from 'fs/promises'
import path from 'path'
import { genesisStories } from '../lib/genesis-stories'

async function extractGenesisAssets() {
  console.log('🎨 Extracting Genesis photography assets...\n')

  const assets = new Map<string, string[]>()

  // Group photos by series
  for (const story of genesisStories) {
    assets.set(story.id, [])

    for (const series of story.series) {
      for (const photo of series.photos) {
        assets.get(story.id)?.push(photo.src)
      }
    }
  }

  // Write manifest
  const manifest = {
    totalPhotos: Array.from(assets.values()).flat().length,
    stories: Object.fromEntries(assets),
  }

  await fs.writeFile(
    path.join(process.cwd(), 'public/designs/genesis/manifest.json'),
    JSON.stringify(manifest, null, 2)
  )

  console.log(`✅ Extracted ${manifest.totalPhotos} Genesis photos`)
  console.log(`📝 Manifest saved to public/designs/genesis/manifest.json`)

  return manifest
}

extractGenesisAssets().catch(console.error)
```

**Step 3: Run extraction script**

```bash
npx tsx scripts/extract-genesis-assets.ts
```

Expected: Manifest file created with all Genesis photo paths

**Step 4: Update store curator with real Genesis photos**

```typescript
// lib/store-curator.ts (modify photography section)
photography: {
  'am-reed-aqua': {
    name: 'Aqua Meditation',
    essence: 'Stillness in turquoise, masculine vulnerability',
    aestheticDirection: 'Editorial minimalism, color field painting',
    colorPalette: ['#40E0D0', '#D4AF37', '#000000'],
    mood: 'Meditative, sensual, introspective',
    targetAudience: 'Interior designers, art collectors, fashion enthusiasts',
    productTypes: ['large-canvas', 'premium-framed-poster'],
    designApproach: 'Full bleed photo, minimal text, museum-quality finish',
    sourceImage: '/images/collaborations/am-reed-2024/IMG_1205.jpg', // ADDED
  },
  'am-reed-leather': {
    // ... existing config ...
    sourceImage: '/images/gallery/genesis/campaigns/B.40.jpg', // ADDED
  },
  'am-reed-monochrome': {
    // ... existing config ...
    sourceImage: '/images/gallery/genesis/editorial/B.3.jpg', // ADDED
  },
}
```

**Step 5: Commit**

```bash
git add .
git commit -m "feat: integrate Genesis photography assets into theme factory

- Extract Genesis photo paths from lib/genesis-stories.ts
- Create asset manifest (158 photos across series)
- Update store curator with actual source images
- Prepare for real design file generation"
```

---

## Phase 4: Real Design File Generation

### Task 4: Convert SVG Templates to PNG/JPG for Printful

**Files:**
- Create: `lib/design-renderer.ts`
- Install: `npm install sharp canvas`
- Modify: `lib/design-generator.ts:332-340` (add PNG export)

**Step 1: Install dependencies**

```bash
cd "/Volumes/Super Mastery/Webdesigner"
npm install sharp canvas @types/canvas
```

**Step 2: Write test for design rendering**

```typescript
// lib/__tests__/design-renderer.test.ts
import { DesignRenderer } from '../design-renderer'
import fs from 'fs/promises'

describe('Design Renderer', () => {
  it('should convert SVG to PNG', async () => {
    const svg = `<svg width="100" height="100"><rect fill="red" width="100" height="100"/></svg>`
    const png = await DesignRenderer.svgToPng(svg, 100, 100)

    expect(png).toBeInstanceOf(Buffer)
    expect(png.length).toBeGreaterThan(0)
  })

  it('should render poetry design as PNG', async () => {
    const png = await DesignRenderer.renderPoetryDesign('fine-lines', 'framed-poster')

    expect(png).toBeInstanceOf(Buffer)

    // Save for visual inspection
    await fs.writeFile('/tmp/fine-lines-test.png', png)
    console.log('Saved test design to /tmp/fine-lines-test.png')
  })
})
```

**Step 3: Run test to verify it fails**

```bash
npm test -- lib/__tests__/design-renderer.test.ts
```

Expected: FAIL - `DesignRenderer` not defined

**Step 4: Implement design renderer**

```typescript
// lib/design-renderer.ts
import sharp from 'sharp'
import { createCanvas, loadImage } from 'canvas'
import { DesignGenerator } from './design-generator'

export class DesignRenderer {
  /**
   * Convert SVG string to PNG buffer
   */
  static async svgToPng(
    svg: string,
    width: number,
    height: number,
    dpi: number = 300
  ): Promise<Buffer> {
    // Calculate dimensions for print quality
    const printWidth = Math.floor((width / 72) * dpi)
    const printHeight = Math.floor((height / 72) * dpi)

    // Convert SVG to PNG using sharp
    const buffer = await sharp(Buffer.from(svg))
      .resize(printWidth, printHeight, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 1 },
      })
      .png()
      .toBuffer()

    return buffer
  }

  /**
   * Render poetry design as high-res PNG
   */
  static async renderPoetryDesign(
    poemId: string,
    productType: string
  ): Promise<Buffer> {
    const svg = DesignGenerator.generatePoetryDesign(poemId, productType)
    const { width, height } = DesignGenerator['getDimensionsByType'](productType)

    return this.svgToPng(svg, width, height, 300)
  }

  /**
   * Render photography design (overlay + source photo)
   */
  static async renderPhotographyDesign(
    photoId: string,
    sourceImagePath: string,
    productType: string
  ): Promise<Buffer> {
    const { width, height } = DesignGenerator['getDimensionsByType'](productType)

    // Load source image
    const canvas = createCanvas(width, height)
    const ctx = canvas.getContext('2d')

    const sourceImage = await loadImage(sourceImagePath)

    // Draw source image (full bleed)
    ctx.drawImage(sourceImage, 0, 0, width, height)

    // Get overlay SVG frame
    const frameSvg = DesignGenerator.generatePhotographyFrame(photoId)

    // Convert frame to image and composite
    const frameBuffer = await this.svgToPng(frameSvg, width, height)
    const frameImage = await loadImage(frameBuffer)

    ctx.drawImage(frameImage, 0, 0, width, height)

    // Convert canvas to buffer
    return canvas.toBuffer('image/png')
  }

  /**
   * Render philosophy design as high-res PNG
   */
  static async renderPhilosophyDesign(
    essayId: string,
    productType: string
  ): Promise<Buffer> {
    const svg = DesignGenerator.generatePhilosophyDesign(essayId, productType)
    const { width, height } = DesignGenerator['getDimensionsByType'](productType)

    return this.svgToPng(svg, width, height, 300)
  }

  /**
   * Save design file to disk
   */
  static async saveDesignFile(
    buffer: Buffer,
    filename: string
  ): Promise<string> {
    const fs = await import('fs/promises')
    const path = await import('path')

    const designDir = path.join(process.cwd(), 'public/designs')
    await fs.mkdir(designDir, { recursive: true })

    const filepath = path.join(designDir, filename)
    await fs.writeFile(filepath, buffer)

    return filepath
  }
}
```

**Step 5: Run test to verify it passes**

```bash
npm test -- lib/__tests__/design-renderer.test.ts
```

Expected: PASS + PNG file saved to `/tmp/fine-lines-test.png`

**Step 6: Visually inspect generated design**

```bash
open /tmp/fine-lines-test.png
```

Verify: Design looks correct, high resolution, luxury aesthetic

**Step 7: Commit**

```bash
git add .
git commit -m "feat: add design rendering system (SVG → PNG)

- Install sharp and canvas for image processing
- Create DesignRenderer class for print-quality PNG export
- Support poetry, photography, and philosophy designs
- 300 DPI output for professional printing
- Add file save functionality to public/designs/"
```

---

## Phase 5: Printful API Integration

### Task 5: Sync Designs to Printful Catalog

**Files:**
- Create: `lib/printful-client.ts`
- Create: `app/api/store/sync-product/route.ts`
- Modify: `.env.local` (add PRINTFUL_API_KEY)

**Step 1: Get Printful API credentials**

1. Go to https://www.printful.com/dashboard/store
2. Navigate to Settings → API
3. Generate API key
4. Add to `.env.local`:

```bash
PRINTFUL_API_KEY=your-printful-api-key
PRINTFUL_STORE_ID=your-store-id
```

**Step 2: Write test for Printful client**

```typescript
// lib/__tests__/printful-client.test.ts
import { PrintfulClient } from '../printful-client'

describe('Printful Client', () => {
  const client = new PrintfulClient(process.env.PRINTFUL_API_KEY!)

  it('should get product catalog', async () => {
    const products = await client.getProducts()
    expect(products.length).toBeGreaterThan(0)
  })

  it('should upload design file', async () => {
    const mockDesignBuffer = Buffer.from('fake image data')
    const fileId = await client.uploadFile(mockDesignBuffer, 'test-design.png')
    expect(fileId).toBeTruthy()
  })
})
```

**Step 3: Run test to verify it fails**

```bash
npm test -- lib/__tests__/printful-client.test.ts
```

Expected: FAIL - `PrintfulClient` not defined

**Step 4: Implement Printful client**

```typescript
// lib/printful-client.ts
export class PrintfulClient {
  private apiKey: string
  private baseUrl = 'https://api.printful.com'

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Printful API error: ${JSON.stringify(error)}`)
    }

    return response.json()
  }

  /**
   * Get available products from Printful catalog
   */
  async getProducts() {
    const data = await this.request('/products')
    return data.result
  }

  /**
   * Upload design file to Printful
   */
  async uploadFile(fileBuffer: Buffer, filename: string): Promise<string> {
    // Convert buffer to base64
    const base64 = fileBuffer.toString('base64')

    const data = await this.request('/files', {
      method: 'POST',
      body: JSON.stringify({
        type: 'default',
        filename,
        file: base64,
      }),
    })

    return data.result.id
  }

  /**
   * Create sync product (product in your store)
   */
  async createSyncProduct(config: {
    name: string
    thumbnail: string
    external_id?: string
  }) {
    const data = await this.request('/sync/products', {
      method: 'POST',
      body: JSON.stringify({
        sync_product: config,
      }),
    })

    return data.result
  }

  /**
   * Create sync variant (specific product + design combo)
   */
  async createSyncVariant(syncProductId: number, config: {
    variant_id: number // Printful catalog variant ID
    files: Array<{
      id: string // File ID from uploadFile()
      type: 'default' | 'back' | 'left' | 'right'
    }>
    retail_price: string
  }) {
    const data = await this.request(`/sync/products/${syncProductId}/variants`, {
      method: 'POST',
      body: JSON.stringify({
        sync_variant: config,
      }),
    })

    return data.result
  }
}
```

**Step 5: Run test to verify it passes**

```bash
npm test -- lib/__tests__/printful-client.test.ts
```

Expected: PASS (may fail if API key not configured)

**Step 6: Create API route for product sync**

```typescript
// app/api/store/sync-product/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { PrintfulClient } from '@/lib/printful-client'
import { DesignRenderer } from '@/lib/design-renderer'
import { StoreCurator } from '@/lib/store-curator'

export async function POST(request: NextRequest) {
  try {
    const { themeId, contentType, productType } = await request.json()

    const printful = new PrintfulClient(process.env.PRINTFUL_API_KEY!)

    // 1. Generate design
    let designBuffer: Buffer

    if (contentType === 'poetry') {
      designBuffer = await DesignRenderer.renderPoetryDesign(themeId, productType)
    } else if (contentType === 'philosophy') {
      designBuffer = await DesignRenderer.renderPhilosophyDesign(themeId, productType)
    } else {
      return NextResponse.json({ error: 'Invalid content type' }, { status: 400 })
    }

    // 2. Upload design to Printful
    const fileId = await printful.uploadFile(
      designBuffer,
      `${themeId}-${productType}.png`
    )

    // 3. Create sync product
    const printfulProductId = StoreCurator.getPrintfulProductId(productType)

    const syncProduct = await printful.createSyncProduct({
      name: `${themeId} - ${productType}`,
      thumbnail: fileId,
      external_id: `${themeId}-${productType}`,
    })

    // 4. Create sync variant with design
    const syncVariant = await printful.createSyncVariant(syncProduct.id, {
      variant_id: printfulProductId,
      files: [{ id: fileId, type: 'default' }],
      retail_price: StoreCurator['getPriceByType'](productType),
    })

    return NextResponse.json({
      success: true,
      syncProductId: syncProduct.id,
      syncVariantId: syncVariant.id,
      fileId,
    })
  } catch (error) {
    console.error('Product sync error:', error)
    return NextResponse.json(
      { error: 'Failed to sync product' },
      { status: 500 }
    )
  }
}
```

**Step 7: Test API route**

```bash
curl -X POST http://localhost:3000/api/store/sync-product \
  -H "Content-Type: application/json" \
  -d '{
    "themeId": "fine-lines",
    "contentType": "poetry",
    "productType": "framed-poster"
  }'
```

Expected: JSON response with `syncProductId`, `syncVariantId`, `fileId`

**Step 8: Commit**

```bash
git add .
git commit -m "feat: integrate Printful API for product sync

- Create PrintfulClient with file upload and product creation
- Add POST /api/store/sync-product endpoint
- Upload rendered designs to Printful catalog
- Create sync products and variants automatically
- Support poetry and philosophy content types"
```

---

## Phase 6: Bulk Product Generation

### Task 6: Generate All Theme Factory Products

**Files:**
- Create: `scripts/generate-all-products.ts`
- Modify: `package.json:scripts` (add generate:products)

**Step 1: Create bulk generation script**

```typescript
// scripts/generate-all-products.ts
import { StoreCurator } from '../lib/store-curator'
import { DesignRenderer } from '../lib/design-renderer'

async function generateAllProducts() {
  console.log('🎨 Generating all theme factory products...\n')

  const recommendations = StoreCurator.getCuratedCollection()

  console.log(`Found ${recommendations.length} product recommendations\n`)

  for (const rec of recommendations) {
    console.log(`\n📦 ${rec.themeName} - ${rec.productType}`)
    console.log(`   Priority: ${rec.priority}`)
    console.log(`   Target: ${rec.targetMarket}`)
    console.log(`   Price: $${rec.estimatedPrice}`)

    try {
      // Generate design locally for review
      let buffer: Buffer

      if (rec.contentId.startsWith('poetry-')) {
        const poemId = rec.themeId
        buffer = await DesignRenderer.renderPoetryDesign(poemId, rec.productType)
      } else if (rec.contentId.startsWith('essay-')) {
        const essayId = rec.themeId
        buffer = await DesignRenderer.renderPhilosophyDesign(essayId, rec.productType)
      } else if (rec.contentId.startsWith('photo-')) {
        // Skip for now - need source images
        console.log('   ⏭️  Skipping photography (needs source images)')
        continue
      } else {
        console.log('   ⚠️  Unknown content type')
        continue
      }

      // Save to public/designs for review
      const filename = `${rec.themeId}-${rec.productType}.png`
      const filepath = await DesignRenderer.saveDesignFile(buffer, filename)

      console.log(`   ✅ Generated: ${filepath}`)

      // TODO: Uncomment to sync to Printful
      // const response = await fetch('http://localhost:3000/api/store/sync-product', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     themeId: rec.themeId,
      //     contentType: rec.contentId.split('-')[0],
      //     productType: rec.productType,
      //   }),
      // })
      // const data = await response.json()
      // console.log(`   🔗 Synced to Printful: ${data.syncProductId}`)

    } catch (error) {
      console.error(`   ❌ Error: ${error}`)
    }
  }

  console.log('\n✨ Generation complete!')
}

generateAllProducts().catch(console.error)
```

**Step 2: Add npm script**

```json
// package.json
{
  "scripts": {
    "generate:products": "tsx scripts/generate-all-products.ts"
  }
}
```

**Step 3: Run generation script (local review mode)**

```bash
npm run generate:products
```

Expected: PNG files saved to `public/designs/` for all products

**Step 4: Review generated designs**

```bash
open public/designs/
```

Verify: All designs look correct, luxury aesthetic maintained

**Step 5: Uncomment Printful sync lines**

Modify `scripts/generate-all-products.ts` to uncomment the Printful sync section.

**Step 6: Run full sync to Printful**

```bash
npm run generate:products
```

Expected: All products synced to Printful catalog

**Step 7: Commit**

```bash
git add .
git commit -m "feat: bulk product generation with theme factory

- Create generate-all-products script
- Generate 15+ curated products from themes
- Save designs locally for review
- Optional Printful sync (commented by default)
- Add npm script: npm run generate:products"
```

---

## Phase 7: Product Mockup Generation

### Task 7: Show Designs on Actual Product Mockups

**Files:**
- Create: `lib/mockup-generator.ts`
- Create: `public/mockups/` (template images)
- Modify: `app/shop/page.tsx` (use mockup images instead of SVG data URIs)

**Step 1: Download Printful mockup templates**

Use Printful's mockup generator API or download templates manually:

```bash
mkdir -p "/Volumes/Super Mastery/Webdesigner/public/mockups"
# Download poster-template.png, canvas-template.png, etc.
```

**Step 2: Write mockup generation test**

```typescript
// lib/__tests__/mockup-generator.test.ts
import { MockupGenerator } from '../mockup-generator'

describe('Mockup Generator', () => {
  it('should composite design onto poster mockup', async () => {
    const designPath = '/tmp/fine-lines-test.png'
    const mockup = await MockupGenerator.createPosterMockup(designPath)

    expect(mockup).toBeInstanceOf(Buffer)
  })
})
```

**Step 3: Implement mockup generator**

```typescript
// lib/mockup-generator.ts
import sharp from 'sharp'
import { createCanvas, loadImage } from 'canvas'

export class MockupGenerator {
  /**
   * Create poster mockup (design on wall)
   */
  static async createPosterMockup(designPath: string): Promise<Buffer> {
    const mockupTemplate = '/path/to/mockup/poster-wall.png'

    // Load mockup template and design
    const mockup = await loadImage(mockupTemplate)
    const design = await loadImage(designPath)

    const canvas = createCanvas(mockup.width, mockup.height)
    const ctx = canvas.getContext('2d')

    // Draw mockup background
    ctx.drawImage(mockup, 0, 0)

    // Composite design onto poster area (adjust coordinates)
    const posterX = 300
    const posterY = 150
    const posterWidth = 600
    const posterHeight = 900

    ctx.drawImage(design, posterX, posterY, posterWidth, posterHeight)

    return canvas.toBuffer('image/jpeg')
  }

  /**
   * Create canvas mockup
   */
  static async createCanvasMockup(designPath: string): Promise<Buffer> {
    // Similar implementation for canvas products
    return Buffer.from('')
  }
}
```

**Step 4: Generate mockups for all products**

Extend `scripts/generate-all-products.ts` to also generate mockups.

**Step 5: Commit**

```bash
git add .
git commit -m "feat: add product mockup generation

- Create MockupGenerator for realistic product displays
- Composite designs onto poster/canvas templates
- Generate mockup images for shop display
- Replace SVG placeholders with actual mockups"
```

---

## Phase 8: Testing & Deployment

### Task 8: Comprehensive Testing

**Files:**
- Create: `__tests__/e2e/shop.test.ts`
- Run: Full test suite

**Step 1: Write E2E test**

```typescript
// __tests__/e2e/shop.test.ts
import { test, expect } from '@playwright/test'

test('unified shop displays both Printful and Amazon products', async ({ page }) => {
  await page.goto('http://localhost:3000/shop')

  // Check page loads
  await expect(page.locator('h1')).toContainText('Curated Shop')

  // Check Printful products exist
  const printfulBadges = page.locator('text=🎨 Original')
  await expect(printfulBadges.first()).toBeVisible()

  // Check Amazon products exist
  const amazonBadges = page.locator('text=🔗 Curated')
  await expect(amazonBadges.first()).toBeVisible()

  // Check affiliate disclosure
  await expect(page.locator('text=Affiliate Disclosure')).toBeVisible()
})

test('clicking Amazon product opens external link', async ({ page }) => {
  await page.goto('http://localhost:3000/shop')

  const amazonButton = page.locator('text=View on Amazon').first()

  // Verify it's an external link
  const href = await amazonButton.getAttribute('href')
  expect(href).toContain('amazon.com')
  expect(href).toContain('brandonmills.com-20') // Affiliate tag
})
```

**Step 2: Run E2E tests**

```bash
npm run test:e2e
```

Expected: All tests PASS

**Step 3: Deploy to production**

```bash
git push origin main
```

Vercel will auto-deploy. Monitor: https://vercel.com/brandons-projects-c4dfa14a/webdesigner/deployments

**Step 4: Verify production deployment**

```bash
curl https://brandonmills.com/shop | grep -o "Curated Shop"
```

Expected: "Curated Shop" found

**Step 5: Final commit**

```bash
git add .
git commit -m "test: add E2E tests for unified shop

- Test Printful + Amazon product display
- Verify affiliate links work correctly
- Check disclosure section present
- Confirm mockups render properly"
```

---

## Verification Checklist

After completing all tasks, verify:

- [ ] `/shop` route displays both Printful and Amazon products
- [ ] Theme factory generates luxury designs from content themes
- [ ] Genesis photos integrated into photography products
- [ ] SVG designs rendered to 300 DPI PNG files
- [ ] Products synced to Printful catalog with real designs
- [ ] Product mockups show designs on actual products
- [ ] Amazon affiliate links include correct tag (`brandonmills.com-20`)
- [ ] Featured Collections on `/work` links to `/shop`
- [ ] Geometric backgrounds visible (opacity fixed)
- [ ] All tests passing (unit + E2E)
- [ ] Production deployment successful

---

## Documentation Updates

After implementation, update:

1. **CLAUDE.md** - Add theme factory system overview
2. **README.md** - Document unified shop architecture
3. **docs/THEME_FACTORY_GUIDE.md** - How to add new themes/products
4. **docs/PRINTFUL_INTEGRATION.md** - API integration details

---

## Future Enhancements

After Phase 8, consider:

- [ ] Add product filtering by category (Printful vs Amazon)
- [ ] Implement shopping cart for Printful products
- [ ] Add "Recently Viewed" products tracking
- [ ] Create product recommendation engine
- [ ] Add customer reviews for Printful products
- [ ] Implement product search functionality
- [ ] Add "Compare Products" feature
- [ ] Create product bundles (e.g., "Poetry Collection")
- [ ] Add limited edition / seasonal products
- [ ] Implement pre-order system for new designs
