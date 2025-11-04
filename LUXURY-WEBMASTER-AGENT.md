# 🏆 Luxury Webmaster Agent - Implementation Guide

## What This Agent Does:

Builds **high-fashion, high-tech e-commerce websites** with:
- Museum-quality design (Louis Vuitton level)
- Full e-commerce (Shopify integration)
- Marketing automation (Klaviyo, analytics)
- AI-powered content generation
- Cutting-edge animations and interactions

---

## Tech Stack Blueprint:

### **Frontend (Cutting-Edge)**
```
Next.js 15 (App Router, React 19)
├── Framer Motion (cinematic animations)
├── GSAP ScrollTrigger (parallax effects)
├── Lenis (smooth momentum scroll)
├── React Three Fiber (3D elements)
├── Swiper (touch galleries)
└── Custom cursor + magnetic buttons
```

### **E-Commerce**
```
Shopify
├── Product catalog
├── Inventory management
├── Checkout & payments
├── Order tracking
└── Customer accounts
```

### **Content Management**
```
Webflow CMS API v2
├── Blog posts
├── Case studies
├── Portfolio projects
└── Dynamic content
```

### **Marketing Automation**
```
Klaviyo (email marketing)
├── Welcome series
├── Abandoned cart recovery
├── Post-purchase flows
├── Customer segmentation
└── A/B testing

Analytics
├── Google Analytics 4
├── Meta Pixel
├── Hotjar (heatmaps)
└── Segment (analytics hub)
```

### **Hosting & Deployment**
```
Vercel Pro
├── Edge functions
├── Worldwide CDN
├── Auto-scaling
├── 60s timeouts
└── Git integration
```

---

## Agent Workflow:

### **Phase 1: Project Setup** (5 mins)

```bash
# Create luxury e-commerce site
npx create-next-app@latest luxury-site --typescript --tailwind --app
cd luxury-site

# Install cutting-edge dependencies
npm install framer-motion gsap lenis @react-three/fiber @react-three/drei
npm install swiper swr sharp
npm install @shopify/shopify-api stripe
npm install @klaviyo/klaviyo-api
npm install zod date-fns nanoid
```

### **Phase 2: Design System** (10 mins)

**Create:** `lib/design-system.ts`
```typescript
export const designSystem = {
  typography: {
    heading: 'Cormorant Garamond',
    body: 'Inter',
    mono: 'JetBrains Mono',
  },
  colors: {
    primary: '#000000',
    secondary: '#FFFFFF',
    accent: '#D4AF37', // Luxury gold
    muted: '#F5F5F5',
  },
  spacing: {
    xs: '0.5rem',
    sm: '1rem',
    md: '2rem',
    lg: '4rem',
    xl: '8rem',
  },
  animations: {
    duration: {
      fast: 0.2,
      normal: 0.4,
      slow: 0.8,
    },
    easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
  },
}
```

### **Phase 3: Shopify Integration** (30 mins)

**Create:** `lib/shopify.ts`
```typescript
import { shopifyApi } from '@shopify/shopify-api'

const shopify = shopifyApi({
  apiKey: process.env.SHOPIFY_API_KEY!,
  apiSecretKey: process.env.SHOPIFY_API_SECRET!,
  scopes: ['read_products', 'write_orders'],
  hostName: process.env.SHOPIFY_SHOP_NAME!,
})

export async function getProducts() {
  const products = await shopify.rest.Product.all({
    session: /* session */,
  })
  return products
}

export async function getProduct(id: string) {
  const product = await shopify.rest.Product.find({
    session: /* session */,
    id,
  })
  return product
}

export async function createCheckout(lineItems: LineItem[]) {
  // Create Shopify checkout session
  const checkout = await shopify.rest.Checkout.create({
    session: /* session */,
    lineItems,
  })
  return checkout.webUrl
}
```

### **Phase 4: Shopping Cart** (45 mins)

**Create:** `components/cart/shopping-cart.tsx`
```typescript
'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
}

interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  total: number
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const items = get().items
        const existing = items.find(i => i.id === item.id)

        if (existing) {
          set({
            items: items.map(i =>
              i.id === item.id
                ? { ...i, quantity: i.quantity + 1 }
                : i
            )
          })
        } else {
          set({ items: [...items, { ...item, quantity: 1 }] })
        }
      },

      removeItem: (id) => {
        set({ items: get().items.filter(i => i.id !== id) })
      },

      updateQuantity: (id, quantity) => {
        if (quantity === 0) {
          get().removeItem(id)
        } else {
          set({
            items: get().items.map(i =>
              i.id === id ? { ...i, quantity } : i
            )
          })
        }
      },

      clearCart: () => set({ items: [] }),

      get total() {
        return get().items.reduce((sum, item) =>
          sum + (item.price * item.quantity), 0
        )
      },
    }),
    { name: 'luxury-cart' }
  )
)

export function ShoppingCart() {
  const { items, removeItem, updateQuantity, total } = useCart()

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl">
      <h2>Shopping Cart</h2>
      {items.map(item => (
        <div key={item.id}>
          <img src={item.image} alt={item.name} />
          <h3>{item.name}</h3>
          <p>${item.price}</p>
          <input
            type="number"
            value={item.quantity}
            onChange={(e) => updateQuantity(item.id, +e.target.value)}
          />
          <button onClick={() => removeItem(item.id)}>Remove</button>
        </div>
      ))}
      <div>Total: ${total}</div>
      <button>Checkout</button>
    </div>
  )
}
```

### **Phase 5: Marketing Automation** (30 mins)

**Create:** `lib/klaviyo.ts`
```typescript
export async function subscribeToNewsletter(email: string) {
  const response = await fetch('https://a.klaviyo.com/api/v2/list/LIST_ID/subscribe', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      api_key: process.env.KLAVIYO_API_KEY,
      profiles: [{ email }],
    }),
  })
  return response.json()
}

export async function trackEvent(event: string, properties: any) {
  await fetch('https://a.klaviyo.com/api/track', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      token: process.env.KLAVIYO_PUBLIC_KEY,
      event,
      customer_properties: {
        $email: properties.email,
      },
      properties,
    }),
  })
}

// Trigger abandoned cart email
export async function sendAbandonedCartEmail(email: string, cartItems: any[]) {
  await trackEvent('Abandoned Cart', {
    email,
    items: cartItems,
    total: cartItems.reduce((sum, item) => sum + item.price, 0),
  })
}
```

### **Phase 6: Analytics** (15 mins)

**Create:** `lib/analytics.ts`
```typescript
export function trackPageView(url: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_ID!, {
      page_path: url,
    })
  }
}

export function trackEvent(action: string, params: any) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, params)
  }
}

// E-commerce tracking
export function trackPurchase(transaction: any) {
  trackEvent('purchase', {
    transaction_id: transaction.id,
    value: transaction.total,
    currency: 'USD',
    items: transaction.items,
  })
}

export function trackAddToCart(item: any) {
  trackEvent('add_to_cart', {
    currency: 'USD',
    value: item.price,
    items: [item],
  })
}
```

---

## Example: Build Luxury Fashion Store

### **User Prompt:**
"Build me a high-end fashion e-commerce site for a luxury handbag brand"

### **Agent Response:**

```
🏆 Building luxury handbag e-commerce experience...

TECH STACK:
✅ Next.js 15 + Framer Motion (cinematic animations)
✅ Shopify (products, checkout, inventory)
✅ Klaviyo (email marketing automation)
✅ Stripe (payment processing)
✅ Vercel Pro (worldwide CDN)

FEATURES:
✅ Cinematic hero with 3D product viewer
✅ Product grid with hover magnification
✅ Detail pages with AR try-on
✅ Personalized recommendations
✅ Abandoned cart recovery (automated)
✅ VIP customer tiers
✅ Gift wrapping option
✅ Size/color variants
✅ Reviews & ratings
✅ Wishlist functionality

MARKETING:
✅ Welcome email series (3 emails)
✅ Abandoned cart recovery (24hr delay)
✅ Post-purchase thank you + upsell
✅ VIP customer rewards
✅ Birthday discounts
✅ Google Analytics 4 tracking
✅ Meta Pixel for retargeting

PERFORMANCE:
✅ Lighthouse score: 95+
✅ Load time: < 1.2s
✅ Mobile-first responsive
✅ Accessibility (WCAG AA)

BUILDING NOW...
[Agent creates entire site structure]

✅ COMPLETE!

Next steps:
1. Add Shopify API credentials
2. Upload product catalog
3. Connect custom domain
4. Configure payment gateway
5. Launch! 🚀

What's your brand name and domain?
```

---

## Deployment Checklist:

### **Environment Variables:**
```env
# Shopify
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=xxx
SHOPIFY_ADMIN_API_TOKEN=xxx

# Klaviyo
KLAVIYO_API_KEY=xxx
KLAVIYO_PUBLIC_KEY=xxx

# Stripe
STRIPE_PUBLISHABLE_KEY=pk_live_xxx
STRIPE_SECRET_KEY=sk_live_xxx

# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_META_PIXEL_ID=xxx

# Domain
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

### **Vercel Setup:**
1. Connect GitHub repository
2. Add environment variables
3. Set production branch
4. Enable automatic deployments
5. Configure custom domain
6. Enable SSL

### **Domain Configuration:**
```
A Record: @ → 76.76.21.21 (Vercel IP)
CNAME: www → cname.vercel-dns.com
```

---

## Performance Optimization:

### **Images:**
```typescript
import Image from 'next/image'

<Image
  src="/product.jpg"
  alt="Product name"
  width={800}
  height={1200}
  quality={90}
  priority // For above-the-fold images
  placeholder="blur"
  blurDataURL="data:image/..." // Low-quality placeholder
/>
```

### **Fonts:**
```typescript
import { Cormorant_Garamond, Inter } from 'next/font/google'

const heading = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-heading',
  display: 'swap',
})

const body = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})
```

### **Code Splitting:**
```typescript
import dynamic from 'next/dynamic'

// Lazy load heavy components
const ThreeDViewer = dynamic(() => import('@/components/3d-viewer'), {
  loading: () => <LoadingSpinner />,
  ssr: false, // Client-side only
})
```

---

## Monthly Cost Breakdown:

**Infrastructure:**
- Vercel Pro: $20/mo (fast worldwide CDN, 60s timeouts)
- Shopify Basic: $29/mo (unlimited products, SSL, POS)
- Webflow CMS: $23/mo (10,000 CMS items, API access)

**Marketing:**
- Klaviyo: $20-60/mo (based on contacts, email automation)
- Google Workspace: $6/mo (professional email)

**Optional:**
- Shopify Plus: $2,000/mo (enterprise features)
- Advanced analytics: $50-200/mo

**Total: $98-138/mo for a world-class luxury e-commerce site**

Compare to: $10,000-50,000 custom development + maintenance

---

## Success Metrics:

**Performance:**
- Lighthouse score: 90+ (all categories)
- Load time: < 1.5s
- Core Web Vitals: All green

**E-Commerce:**
- Conversion rate: 2-5%
- Average order value: Track and optimize
- Cart abandonment: < 70% (industry avg 80%)
- Repeat purchase rate: 20-30%

**Marketing:**
- Email open rate: 20-30%
- Click-through rate: 2-5%
- Abandoned cart recovery: 10-15% conversion
- Newsletter growth: 5-10% monthly

---

## 🚀 Ready to Build?

This agent can create museum-quality luxury e-commerce sites in 4-6 hours that would normally take months and $50k+.

**Next Steps:**
1. Define brand identity
2. Gather product photos
3. Set up Shopify account
4. Configure Klaviyo
5. Launch and scale!

**Let's build something extraordinary.** 🏆
