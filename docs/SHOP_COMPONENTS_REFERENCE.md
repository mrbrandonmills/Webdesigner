# Shop Components Reference Guide

Quick reference for using the luxury shop components in Brandon Mills' e-commerce platform.

---

## Component Import Map

```typescript
// Import all shop components
import {
  EnhancedProductCard,
  ProductCardSkeleton,
  ProductDetailModal,
  ProductGallery,
  MockupGenerator,
  FilterSortBar
} from '@/components/shop'

// Or import individually
import { EnhancedProductCard } from '@/components/shop/enhanced-product-card'
```

---

## 1. EnhancedProductCard

### Usage

```tsx
<EnhancedProductCard
  product={product}
  onQuickView={(product) => setSelectedProduct(product)}
  featured={false}
/>
```

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `product` | `UnifiedProduct` | ✅ | Product data object |
| `onQuickView` | `(product: UnifiedProduct) => void` | ✅ | Callback when Quick View clicked |
| `featured` | `boolean` | ❌ | If true, card spans 2 columns/rows |

### Product Object Structure

```typescript
{
  id: string
  source: 'printful' | 'amazon'
  title: string
  description: string
  price: number
  originalPrice?: number
  image: string
  images?: string[]
  tags?: string[]
  rating?: number
  reviewCount?: number
  variantCount?: number
  variants?: ProductVariant[]
  amazonUrl?: string
  inStock: boolean
  featured: boolean
  category: string
}
```

### Styling Variants

**Category Badges:**
- Poetry: Gold background
- Photography: Blue background
- Philosophy: Purple background

**States:**
- Default: White/5 background
- Hover: Scale 1.02, border glow
- Active: Border changes to gold

---

## 2. ProductDetailModal

### Usage

```tsx
const [selectedProduct, setSelectedProduct] = useState<UnifiedProduct | null>(null)

<ProductDetailModal
  product={selectedProduct}
  isOpen={!!selectedProduct}
  onClose={() => setSelectedProduct(null)}
/>
```

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `product` | `UnifiedProduct \| null` | ✅ | Product to display (null = closed) |
| `isOpen` | `boolean` | ✅ | Controls modal visibility |
| `onClose` | `() => void` | ✅ | Callback when modal closes |

### Features
- Full-screen on mobile, centered on desktop
- Swipeable image gallery
- Variant selection (sizes, colors)
- Quantity controls
- Add to cart with success animation
- Favorite/share buttons
- ESC key to close
- Body scroll lock when open

### Layout

```
┌─────────────────────────────────────────┐
│  [Close] [Favorite] [Share]             │
│                                         │
│  ┌──────────────┐  Product Title       │
│  │              │  ⭐⭐⭐⭐⭐ 4.8 (120)  │
│  │   Gallery    │  $39.95               │
│  │   Carousel   │                       │
│  │              │  Description...       │
│  └──────────────┘                       │
│  [Thumbnails]     • Select Size         │
│                   • Quantity: [-] 1 [+] │
│                   [Add to Cart $39.95]  │
└─────────────────────────────────────────┘
```

---

## 3. ProductGallery

### Usage

```tsx
<ProductGallery
  images={[
    '/image1.jpg',
    '/image2.jpg',
    '/image3.jpg'
  ]}
  productTitle="Product Name"
/>
```

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `images` | `string[]` | ✅ | Array of image URLs |
| `productTitle` | `string` | ✅ | Product name for alt text |

### Gestures
- **Desktop:** Arrow keys, mouse drag, thumbnail click
- **Mobile:** Swipe left/right, tap thumbnails
- **Both:** Click main image to zoom

### UI Elements
- Previous/Next arrows (hidden when at start/end)
- Image counter (e.g., "2 / 5")
- Thumbnail strip with active state
- Zoom indicator icon
- Swipe hint on mobile (fades after 3s)

---

## 4. MockupGenerator

### Usage

```tsx
<MockupGenerator
  designImage="/design.jpg"
  productType="tshirt"
  productTitle="Product Name"
/>
```

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `designImage` | `string` | ✅ | URL of the design to display |
| `productType` | `'tshirt' \| 'poster' \| 'mug' \| 'hoodie' \| 'totebag'` | ✅ | Type of mockup to render |
| `productTitle` | `string` | ✅ | Product name for alt text |

### Product Types

**T-Shirt:**
- Dark background (neutral-900)
- Design centered with lighten blend mode
- 70% width, 60% height
- Subtle shadow for depth

**Poster:**
- White mat border (framed print look)
- Wall texture background (gradient beige)
- 8-12px padding for frame
- Inner border for elegance

**Mug:**
- 3D cylindrical perspective
- White ceramic texture
- Handle on right side
- Design wrapped with -8deg rotation
- Top rim highlight

**Hoodie:**
- Dark background (neutral-800)
- Design centered slightly lower
- Hood shadow at top
- 75% width, 65% height

**Tote Bag:**
- Canvas beige background
- Trapezoid clip-path for bag shape
- Two handles at top
- Design centered in middle

---

## 5. FilterSortBar

### Usage

```tsx
const [category, setCategory] = useState('All')
const [sort, setSort] = useState('featured')
const [search, setSearch] = useState('')

<FilterSortBar
  categories={['All', 'Poetry', 'Photography', 'Philosophy', 'Tech', 'Books']}
  selectedCategory={category}
  onCategoryChange={setCategory}
  sortBy={sort}
  onSortChange={setSort}
  searchQuery={search}
  onSearchChange={setSearch}
  productCount={products.length}
/>
```

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `categories` | `string[]` | ✅ | List of category filter options |
| `selectedCategory` | `string` | ✅ | Currently active category |
| `onCategoryChange` | `(category: string) => void` | ✅ | Callback when category changes |
| `sortBy` | `string` | ✅ | Current sort option |
| `onSortChange` | `(sort: string) => void` | ✅ | Callback when sort changes |
| `searchQuery` | `string` | ✅ | Current search text |
| `onSearchChange` | `(query: string) => void` | ✅ | Callback when search changes |
| `productCount` | `number` | ✅ | Number of products (for display) |

### Sort Options

```typescript
const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest First' },
  { value: 'name-asc', label: 'Name: A-Z' },
  { value: 'name-desc', label: 'Name: Z-A' },
]
```

### Responsive Behavior

**Desktop (> 768px):**
- All filters in horizontal bar
- Search bar (256px width)
- Sort dropdown (200px width)
- Sticky at top-20 (below header)

**Mobile (< 768px):**
- Filter button opens slide-up drawer
- Search bar in header
- Sort button opens dropdown
- Product count below buttons
- Sticky at top-16

---

## 6. ProductCardSkeleton

### Usage

```tsx
{isLoading && (
  <div className="grid grid-cols-3 gap-6">
    {[...Array(6)].map((_, i) => (
      <ProductCardSkeleton key={i} featured={i === 0} />
    ))}
  </div>
)}
```

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `featured` | `boolean` | ❌ | If true, skeleton spans 2 columns |

### Visual
- Animated gradient shimmer
- Matches EnhancedProductCard layout
- Image area, title, description, price placeholders
- Smooth loading state transition

---

## Complete Example: Shop Page

```tsx
'use client'

import { useState, useMemo } from 'react'
import { UnifiedProduct } from '@/lib/types/shop'
import {
  EnhancedProductCard,
  ProductDetailModal,
  FilterSortBar,
  ProductCardSkeleton
} from '@/components/shop'

export function ShopPageClient({ products }: { products: UnifiedProduct[] }) {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortBy, setSortBy] = useState('featured')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProduct, setSelectedProduct] = useState<UnifiedProduct | null>(null)

  const categories = ['All', 'Poetry', 'Photography', 'Philosophy', 'Tech', 'Books']

  // Filter and sort logic
  const filteredProducts = useMemo(() => {
    let filtered = [...products]

    // Apply filters
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(p =>
        p.tags?.includes(selectedCategory.toLowerCase())
      )
    }

    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low': return a.price - b.price
        case 'price-high': return b.price - a.price
        case 'newest': return b.id.localeCompare(a.id)
        case 'name-asc': return a.title.localeCompare(b.title)
        case 'name-desc': return b.title.localeCompare(a.title)
        default: // featured
          if (a.featured && !b.featured) return -1
          if (!a.featured && b.featured) return 1
          return b.price - a.price
      }
    })

    return filtered
  }, [products, selectedCategory, sortBy, searchQuery])

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Filter Bar */}
      <FilterSortBar
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        sortBy={sortBy}
        onSortChange={setSortBy}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        productCount={filteredProducts.length}
      />

      {/* Product Grid */}
      <section className="py-16 container-wide">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product, index) => (
            <EnhancedProductCard
              key={product.id}
              product={product}
              onQuickView={setSelectedProduct}
              featured={index === 0 && product.featured}
            />
          ))}
        </div>
      </section>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  )
}
```

---

## Styling Guidelines

### Hover States
```css
/* Cards */
.hover\:scale-105 { transform: scale(1.05) }
.hover\:border-accent-gold { border-color: #C9A050 }

/* Buttons */
.hover\:bg-accent-hover { background: #B89040 }
.hover\:translate-y--2px { transform: translateY(-2px) }
```

### Transitions
```css
/* Fast (200ms) - Button presses, quick interactions */
transition: all 0.2s cubic-bezier(0.22, 1, 0.36, 1)

/* Normal (400ms) - Overlays, reveals */
transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1)

/* Slow (700ms) - Image zooms, cross-fades */
transition: all 0.7s cubic-bezier(0.22, 1, 0.36, 1)
```

### Grid Layouts
```css
/* Product Grid */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

/* Featured products span 2 columns */
.featured {
  grid-column: span 2;
  grid-row: span 2;
}

/* Responsive */
@media (max-width: 768px) {
  .grid { grid-template-columns: 1fr; }
  .featured { grid-column: span 1; grid-row: span 1; }
}
```

---

## Animation Recipes

### Stagger Children

```tsx
<motion.div
  initial="hidden"
  animate="visible"
  variants={{
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }}
>
  {items.map(item => (
    <motion.div
      key={item.id}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
    >
      {item}
    </motion.div>
  ))}
</motion.div>
```

### Magnetic Button

```tsx
const x = useMotionValue(0)
const y = useMotionValue(0)

<motion.button
  style={{ x, y }}
  onMouseMove={(e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - rect.left - rect.width / 2) * 0.3)
    y.set((e.clientY - rect.top - rect.height / 2) * 0.3)
  }}
  onMouseLeave={() => {
    x.set(0)
    y.set(0)
  }}
>
  Add to Cart
</motion.button>
```

### Smooth Scroll to Element

```typescript
const scrollToProduct = (productId: string) => {
  const element = document.getElementById(productId)
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    })
  }
}
```

---

## Troubleshooting

### Images not loading
1. Check image paths are correct (absolute or relative)
2. Verify images exist in `/public` directory
3. Use Next.js Image component for optimization
4. Check console for 404 errors

### Animations are janky
1. Add `will-change: transform` to animated elements
2. Use `transform` instead of `left/top`
3. Check browser DevTools Performance tab
4. Reduce animation complexity on mobile
5. Add `GPU-accelerated` class

### Modal not closing
1. Verify `onClose` callback is provided
2. Check ESC key listener is attached
3. Ensure backdrop click handler is present
4. Check browser console for errors

### Filters not working
1. Verify category names match product tags
2. Check search is case-insensitive
3. Ensure `useMemo` dependencies are correct
4. Log filtered array to debug

---

## Browser Compatibility

| Browser | Version | Support |
|---------|---------|---------|
| Chrome | 90+ | ✅ Full |
| Safari | 14+ | ✅ Full |
| Firefox | 88+ | ✅ Full |
| Edge | 90+ | ✅ Full |
| Samsung Internet | 14+ | ✅ Full |
| IE 11 | - | ❌ Not supported |

### Polyfills Needed
- None (all features are modern browser native)

### Progressive Enhancement
- Animations disabled on `prefers-reduced-motion`
- Fallback for `backdrop-filter` on older browsers
- Touch events with mouse fallback

---

*Built with precision. Designed with elegance. Optimized for delight.*
