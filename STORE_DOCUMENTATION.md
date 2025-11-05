# Luxury E-Commerce Store Documentation

## Overview

This documentation covers the premium e-commerce experience built for the Brandon Mills Photography portfolio. The store features museum-quality product pages, advanced shopping features, and a luxury design aesthetic that rivals high-end online retailers.

## 📁 Project Structure

```
/Webdesigner/
├── app/
│   ├── store/
│   │   ├── [productId]/
│   │   │   └── page.tsx          # Product detail page
│   │   └── page.tsx               # Main store listing
│   ├── collections/
│   │   └── [collectionId]/
│   │       └── page.tsx           # Collection pages
│   └── wishlist/
│       └── page.tsx               # Wishlist management
├── components/
│   ├── store/
│   │   ├── ProductGallery.tsx     # Image gallery with zoom
│   │   ├── ProductInfo.tsx        # Product details
│   │   ├── VariantSelector.tsx    # Size/color selection
│   │   ├── AddToCartButton.tsx    # Enhanced add to cart
│   │   ├── SizeGuide.tsx          # Size guide modal
│   │   └── RelatedProducts.tsx    # Product recommendations
│   ├── cart-sidebar.tsx           # Original cart
│   └── cart-sidebar-enhanced.tsx  # Enhanced cart with promo codes
├── types/
│   └── store.ts                   # TypeScript definitions
├── lib/
│   └── store-utils.ts             # Utility functions
└── contexts/
    └── cart-context.tsx           # Cart state management
```

## 🎨 Key Features

### Product Detail Pages (`/store/[productId]`)

**Components:**
- **ProductGallery**: Interactive image gallery with:
  - Zoom on hover (desktop)
  - Swipe gestures (mobile)
  - Fullscreen lightbox
  - Thumbnail navigation
  - Keyboard controls

- **ProductInfo**: Comprehensive product information:
  - Title, artist, and brand
  - Limited edition badges
  - Detailed descriptions
  - Specifications (dimensions, materials)
  - Care instructions
  - Trust signals (guarantees, shipping, returns)

- **VariantSelector**: Smart variant selection:
  - Size options with previews
  - Color swatches
  - Material selection
  - Stock status indicators
  - Price updates

- **AddToCartButton**: Enhanced purchase controls:
  - Quantity selector
  - Add to cart with animation
  - Buy now (direct checkout)
  - Add to wishlist
  - Success states

**Features:**
- Sticky gallery on scroll
- Breadcrumb navigation
- Share functionality
- View count tracking
- Related products
- Recently viewed tracking

### Collection Pages (`/collections/[collectionId]`)

**Available Collections:**
- `gallery-prints` - Museum-quality prints
- `canvas-art` - Gallery-wrapped canvas
- `lifestyle` - Premium everyday items

**Features:**
- Hero section with collection story
- Grid/List view toggle
- Advanced filtering and sorting
- Quick add to cart
- Collection narrative sections:
  - Creative process
  - Inspiration
  - Technical details

### Wishlist (`/wishlist`)

**Features:**
- Save favorite products
- Move items to cart
- Remove items
- Share wishlist
- Recently viewed section
- Price tracking
- Empty state with CTA

### Enhanced Cart Sidebar

**New Features:**
- Free shipping progress bar
- Promo code input
- Discount calculation
- Product recommendations
- Estimated delivery date
- Price breakdown
- Smooth animations
- Mobile optimized

**Valid Promo Codes:**
- `WELCOME10` - 10% off
- `SAVE15` - 15% off
- `LUXURY20` - 20% off
- `FIRSTORDER` - 25% off

## 🔧 Usage Guide

### Adding a New Product

Products are managed through the existing admin system. The enhanced pages automatically:
1. Transform product data to rich types
2. Generate multiple images from variants
3. Apply strategic pricing
4. Add enhanced metadata

### Strategic Pricing

Prices are automatically calculated based on product type:

```typescript
// Prints
Small (< $12 base) → $49
Medium (< $15 base) → $79
Large (< $20 base) → $99
Extra Large → $149

// Canvas
Small (< $35 base) → $149
Medium (< $50 base) → $179
Large → $249

// Apparel
T-Shirts → $35
Hoodies → $65
Mugs → $22
```

### Using Store Utils

```typescript
import {
  getStrategicPrice,
  formatPrice,
  wishlistUtils,
  recentlyViewedUtils
} from '@/lib/store-utils'

// Get pricing
const price = getStrategicPrice('10.00', 'poster')

// Format currency
const formatted = formatPrice(49.99, 'USD')

// Wishlist operations
wishlistUtils.add(productId, product)
wishlistUtils.isInWishlist(productId)

// Track views
recentlyViewedUtils.add(productId)
```

### Type Safety

All components use strict TypeScript types:

```typescript
import { Product, ProductVariant, WishlistItem } from '@/types/store'

// Product with full metadata
const product: Product = {
  id: 1,
  title: 'Mountain Landscape',
  artist: 'Brandon Mills',
  images: [...],
  variants: [...],
  materials: [...],
  // ... more fields
}
```

## 🎯 Component API

### ProductGallery

```tsx
<ProductGallery
  images={productImages}
  productTitle="Product Name"
/>
```

**Props:**
- `images`: Array of ProductImage objects
- `productTitle`: String for alt text

**Features:**
- Automatic image optimization
- Lazy loading
- Keyboard navigation
- Touch gestures

### VariantSelector

```tsx
<VariantSelector
  variants={productVariants}
  selectedVariant={currentVariant}
  onSelectVariant={handleSelect}
  showImages={false}
/>
```

**Props:**
- `variants`: Array of ProductVariant
- `selectedVariant`: Currently selected variant
- `onSelectVariant`: Callback function
- `showImages`: Boolean to show variant images

### AddToCartButton

```tsx
<AddToCartButton
  productId={1}
  variantId={10}
  productTitle="Mountain Print"
  variantName="18x24 inches"
  image="https://..."
  price="49.00"
  type="poster"
  brand="Brandon Mills"
  inStock={true}
  onAddToWishlist={handleWishlist}
/>
```

### SizeGuide

```tsx
<SizeGuide
  isOpen={isOpen}
  onClose={handleClose}
  productType="poster"
/>
```

**Supported Types:**
- Prints/Posters (with room comparisons)
- Apparel (with measurements)

## 🎨 Design System

### Colors
- Primary: `#D4AF37` (accent-gold)
- Background: `#000000` (black)
- Text: `#FFFFFF` (white)
- Borders: `rgba(255, 255, 255, 0.1)`

### Typography
- Headers: Font Serif (Playfair Display)
- Body: Sans-serif (Inter)
- Tracking: 0.2em for uppercase

### Spacing
- Container: `container-wide` class
- Section padding: `py-20`
- Card padding: `p-6`

### Animations
- Hover scale: `scale-105`
- Transition: `duration-300` or `duration-500`
- Blur effects: `backdrop-blur-xl`

## 📱 Responsive Design

### Breakpoints
- Mobile: `< 768px`
- Tablet: `768px - 1024px`
- Desktop: `> 1024px`

### Mobile Optimizations
- Touch-friendly buttons (min 44px)
- Swipe gestures on galleries
- Bottom sheet modals
- Simplified layouts
- Optimized images

## ⚡ Performance

### Optimizations
1. **Images**
   - Next.js Image component
   - Lazy loading
   - Blur placeholders
   - WebP format

2. **Code Splitting**
   - Dynamic imports for modals
   - Route-based splitting
   - Component lazy loading

3. **State Management**
   - Local storage caching
   - Optimistic updates
   - Debounced inputs

4. **SEO**
   - Semantic HTML
   - Meta tags
   - Structured data ready
   - Accessible markup

## ♿ Accessibility

### WCAG 2.1 AA Compliance
- All interactive elements keyboard accessible
- ARIA labels on buttons and links
- Focus indicators visible
- Color contrast ratio > 4.5:1
- Screen reader announcements
- Alt text on images

### Keyboard Navigation
- `Tab` - Navigate elements
- `Enter` - Activate buttons
- `Escape` - Close modals
- `Arrow keys` - Navigate gallery

## 🔄 State Management

### Cart Context

```typescript
const {
  items,           // CartItem[]
  addItem,         // Add to cart
  removeItem,      // Remove from cart
  updateQuantity,  // Update quantity
  clearCart,       // Clear all items
  totalItems,      // Total item count
  totalPrice,      // Total price
  isOpen,          // Cart open state
  openCart,        // Open cart
  closeCart,       // Close cart
} = useCart()
```

### Local Storage
- Cart: `bmills-cart`
- Wishlist: `wishlist`
- Recently Viewed: `recentlyViewed`

## 🚀 Deployment

### Environment Variables
```env
# Stripe (for checkout)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# API URLs
NEXT_PUBLIC_API_URL=https://api.example.com
```

### Build Command
```bash
npm run build
```

### Production Checklist
- [ ] Environment variables configured
- [ ] Images optimized
- [ ] Analytics integrated
- [ ] Error tracking enabled
- [ ] SSL certificate active
- [ ] Stripe webhooks configured
- [ ] Sitemap generated
- [ ] Robots.txt configured

## 🔒 Security

### Best Practices
1. **Payment Processing**
   - Stripe Checkout (PCI compliant)
   - No card data stored
   - Webhook signature validation

2. **Data Validation**
   - Input sanitization
   - Type checking
   - XSS protection

3. **API Security**
   - Rate limiting
   - CORS configuration
   - Authentication tokens

## 📊 Analytics

### Tracked Events
- Product views
- Add to cart
- Checkout initiated
- Purchase completed
- Wishlist additions
- Search queries

### Implementation
```typescript
import { ProductAnalytics } from '@/lib/product-analytics'

// Track view
ProductAnalytics.trackView(productId)

// Track add to cart
ProductAnalytics.trackAddToCart(productId, price)
```

## 🐛 Troubleshooting

### Common Issues

**Cart not persisting:**
- Check local storage is enabled
- Verify cart context is wrapped in app

**Images not loading:**
- Check image URLs are valid
- Verify CORS configuration
- Test image optimization

**Checkout fails:**
- Verify Stripe keys
- Check webhook configuration
- Confirm product prices valid

**Mobile gestures not working:**
- Ensure touch events enabled
- Check viewport meta tag
- Test on physical device

## 🎓 Best Practices

### Component Development
1. Use TypeScript strict mode
2. Implement error boundaries
3. Add loading states
4. Handle empty states
5. Test on multiple devices

### Performance
1. Lazy load below fold content
2. Optimize images before upload
3. Use React.memo for expensive components
4. Debounce search inputs
5. Implement virtual scrolling for long lists

### UX Design
1. Clear CTAs
2. Consistent spacing
3. Meaningful animations
4. Error messages that guide
5. Loading states that inform

## 📝 Future Enhancements

### Phase 2 Features
- [ ] AR product preview
- [ ] Size visualizer with room photos
- [ ] Advanced filtering
- [ ] Product comparison tool
- [ ] Customer reviews
- [ ] Gift cards
- [ ] Subscriptions
- [ ] Loyalty program

### Technical Improvements
- [ ] Server-side rendering
- [ ] Edge caching
- [ ] Real-time inventory
- [ ] A/B testing framework
- [ ] Advanced analytics
- [ ] Personalization engine

## 💡 Tips & Tricks

### Quick Product Testing
```typescript
// Test product with mock data
const mockProduct = {
  id: 999,
  title: 'Test Product',
  basePrice: '15.00',
  type: 'poster',
  // ... rest of fields
}
```

### Debugging Cart Issues
```typescript
// Log cart state
console.log('Cart items:', items)
console.log('Local storage:', localStorage.getItem('bmills-cart'))
```

### Testing Promo Codes
All codes are case-insensitive and validated on the client side.

## 📞 Support

For issues or questions:
1. Check this documentation
2. Review component source code
3. Test in different browsers
4. Check console for errors

## 🎉 Credits

Built with:
- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide Icons

---

**Version:** 1.0.0
**Last Updated:** December 2024
**Author:** Brandon Mills Portfolio Team
