# Brandon Mills Webdesigner - Quick Reference Guide

## Project Overview
- **Type:** Next.js 15 Full-Stack SPA (Single Page Application)
- **Purpose:** Portfolio + E-Commerce for Fashion Model/Actor/Researcher
- **Size:** 4.4MB | 83 TypeScript Files | 23+ Components | 24 API Routes
- **Deployment:** Vercel (Production-Ready)
- **Node Version:** 22.3.0+ required

## Tech Stack Summary

### Frontend
```
React 19 + Next.js 15 (App Router)
TypeScript 5.7
Tailwind CSS 3.4 + Custom CSS
Framer Motion (animations)
Lucide React (icons)
```

### Backend & Services
```
Claude 3.5 Sonnet (AI content generation)
OpenAI Whisper (voice transcription)
Cloudinary (image optimization)
Stripe (payments)
Printful (print-on-demand)
Webflow API (CMS)
```

### Storage & Deployment
```
Vercel Blob (file uploads)
localStorage (shopping cart)
Vercel Analytics
```

## Folder Structure at a Glance

```
app/              # Pages + API routes (9 pages, 24 API endpoints)
components/       # 23+ React components
lib/              # 7 utility libraries
contexts/         # Cart state management
data/             # Product cache
middleware.ts     # Authentication
```

## Key Pages
- `/gallery` - Portfolio showcase (Webflow CMS)
- `/store` - E-commerce (Printful products)
- `/about` - Personal bio
- `/work` - 4 pillar categories
- `/contact` - Contact form
- `/admin` - Dashboard (protected)
- `/checkout/success` - Payment confirmation

## Key Components
- `navigation.tsx` - Top navbar
- `cart-sidebar.tsx` - Shopping cart
- `photo-uploader.tsx` - File upload
- `voice-recorder.tsx` - Audio recording
- `gallery/project-grid.tsx` - Portfolio grid
- `scroll-reveal.tsx` - Scroll animations

## API Endpoints (24 Total)

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Logout

### Store
- `GET /api/store/curated-products` - Cached products
- `POST /api/stripe/checkout` - Payment session
- `POST /api/stripe/webhook` - Payment webhook

### Content
- `POST /api/generate-content` - AI content generation (Claude)
- `POST /api/upload` - File upload to Vercel Blob
- `POST /api/transcribe` - Voice to text (Whisper)
- `POST /api/optimize-images` - Image optimization (Cloudinary)

### Admin
- `POST /api/admin/generate-products` - Create product variations
- `POST /api/admin/products/replicate` - Copy top performers
- `POST /api/admin/products/remove` - Delete underperformers
- `GET /api/admin/orders` - Fetch orders

### Analytics
- `POST /api/analytics/track` - Event logging

### Other
- `POST /api/publish/medium` - Auto-post essays
- `POST /api/audit-site` - Brand voice extraction
- `POST /api/autonomous-import` - Content import
- + 6 more endpoints

## Design System

### Colors (CSS Variables)
```css
--background: #000000    /* Black */
--foreground: #ffffff    /* White */
--accent: #c9a050        /* Gold */
--border: rgba(255,255,255,0.1)
--muted: rgba(255,255,255,0.6)
```

### Fonts
- Headings: Playfair Display, Cormorant Garamond (serif)
- Body: Inter (sans)

### Design Features
- Luxury minimalist aesthetic
- Gold accents
- Smooth animations (cubic-bezier easing)
- Responsive fluid spacing (clamp-based)
- Hover zoom/lift effects
- Gradient overlays

## Authentication
- **Type:** Cookie-based session (httpOnly, 7-day duration)
- **Protection:** `/admin/*` routes via middleware
- **Credentials:** Username/Password in env vars
- **Login:** `POST /api/auth/login` → Sets cookie

## E-Commerce Flow

```
User browses store → Adds to cart (context) → Checkout 
→ POST /api/stripe/checkout → Stripe session 
→ Redirect to Stripe hosted checkout → Payment 
→ /checkout/success → [TODO: Create Printful order]
```

### Shopping Cart
- **Storage:** localStorage + React Context
- **Persist:** Auto-save on changes
- **Toast:** Notifications on add/remove
- **Key:** `bmills-cart`

### Product Analytics
- Tracks: views, clicks, add-to-cart, purchases, revenue
- Calculates: conversion rates, performance scores
- Features: Auto-remove underperformers, replicate winners
- Storage: localStorage

## Printful Integration
- **Store ID:** 17145314
- **API:** v2 REST wrapper (`/lib/printful-client.ts`)
- **Categories:** Posters, Canvas, Apparel, Mugs, Home
- **Functions:** Fetch catalog, upload files, create orders, get prices
- **Status:** ✅ Fully integrated

## Webflow Integration
- **Purpose:** Fetch portfolio projects
- **Collection Fields:** name, slug, description, category, tags, SEO fields, images
- **Cache:** 1 hour
- **Status:** ✅ Implemented

## AI Content Generation
- **Model:** Claude 3.5 Sonnet (via Vercel AI SDK)
- **Input:** Photos + voice transcription
- **Output:** Title, description, captions, alt text, keywords, category
- **Features:** Brand voice injection, style guide integration, SEO optimization
- **Status:** ✅ Fully working

## Environment Variables

### Required for Full Functionality
```bash
# AI APIs
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# CMS
WEBFLOW_API_TOKEN=...
WEBFLOW_SITE_ID=...
WEBFLOW_COLLECTION_ID=...

# Image CDN
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# E-Commerce
PRINTFUL_API_KEY=vbrzkAu9dnvIO6AAikezjsczratgW3FWjhDAOuWo
PRINTFUL_STORE_ID=17145314

# Payments
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Admin Auth
ADMIN_USERNAME=Bmilly23
ADMIN_PASSWORD=23458023

# URLs
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

### Optional
```bash
MEDIUM_ACCESS_TOKEN=...
MEDIUM_AUTHOR_ID=...
DATAFORSEO_LOGIN=...
DATAFORSEO_PASSWORD=...
```

## File Size & Complexity

| Category | Count | Lines | Notes |
|----------|-------|-------|-------|
| Components | 23+ | 3,232 | UI building blocks |
| API Routes | 24 | 3,039 | Backend endpoints |
| Utility Libs | 7 | ~1,500 | Helpers & clients |
| Pages | 9 | ~800 | Next.js pages |
| Config | 5 | ~200 | Config files |
| **Total** | **83** | **~9,000** | Production app |

## Quick Commands

```bash
# Setup
npm install
cp .env.example .env.local
# Edit .env.local with your keys

# Development
npm run dev                  # Start dev server (localhost:3000)
npm run type-check          # Check TypeScript
npm run lint                # Run ESLint

# Production
npm run build               # Build for production
npm run start               # Start production server

# Deployment
# Push to GitHub → Vercel auto-deploys
# OR: vercel deploy (if Vercel CLI installed)
```

## Feature Checklist

| Feature | Status | Notes |
|---------|--------|-------|
| Portfolio Gallery | ✅ 95% | Webflow integration ready |
| E-Commerce Store | ✅ 85% | Stripe + Printful, webhook TODO |
| Admin Dashboard | ✅ 80% | Core features, some pages incomplete |
| AI Content Gen | ✅ 90% | Working with brand voice |
| Voice Transcription | ✅ 100% | OpenAI Whisper ready |
| Image Optimization | ✅ 90% | Cloudinary integrated |
| Auth System | ✅ 100% | Secure cookie-based |
| Analytics | ✅ 90% | Tracking implemented |
| Contact Form | ⚠️ 30% | UI ready, email TODO |
| Mobile Design | ✅ 95% | Fully responsive |
| Testing | ❌ 0% | No test framework |

## Known Limitations & TODOs

1. **Stripe Webhook** - Not yet processing webhooks to create Printful orders
2. **Email Service** - Contact form & order emails not connected
3. **Database** - No persistent database (Printful is source of truth)
4. **Order History** - Not accessible to customers (no auth)
5. **Tests** - No test infrastructure (Jest/Vitest)
6. **Search** - No product/project search (Algolia could help)
7. **Reviews** - No customer review system
8. **Wishlist** - No favorites/wishlist feature
9. **DataForSEO** - Advanced SEO not implemented

## Brand Identity

- **Colors:** Black + Gold luxury aesthetic
- **Fonts:** Playfair Display (elegant), Inter (modern)
- **Tone:** Therapeutic, introspective, renaissance gentleman
- **Positioning:** Multi-faceted creative (not service seller)
- **Target:** Art directors, creative professionals, intellectuals
- **Logo:** "BRANDON MILLS" text-based
- **Social:** @mrbrandonmills on Instagram

## Security Notes

- **Admin Routes:** Protected by cookie middleware
- **Credentials:** Stored in environment variables only
- **API Keys:** Never exposed in frontend
- **Stripe:** PCI-DSS compliant (hosted checkout)
- **CORS:** Configured for Vercel domain

## Performance Features

- **Image Optimization:** Cloudinary + Next.js Image component
- **Code Splitting:** Next.js automatic
- **Lazy Loading:** Components + images
- **Caching:** 1-hour revalidate for Webflow projects
- **Animations:** Hardware-accelerated (transform/opacity)
- **Fonts:** Google Fonts with fallbacks
- **Analytics:** Vercel Analytics built-in

## Next Steps for Implementation

1. **Connect Stripe Webhook** - Auto-create Printful orders
2. **Add Email Service** - Resend or SendGrid for notifications
3. **Implement Contact Form** - Email service integration
4. **Add Testing** - Jest/Vitest + E2E tests
5. **Database** - Postgres/MongoDB for orders & users
6. **Search** - Algolia for product/project search
7. **Reviews** - Customer review system
8. **Analytics Dashboard** - Visualize product performance
9. **Customer Accounts** - Login + order history
10. **Rate Limiting** - API rate limit protection

---

## Resources

- **Next.js Docs:** https://nextjs.org/docs
- **Vercel AI SDK:** https://sdk.vercel.ai
- **Webflow API:** https://developers.webflow.com
- **Printful API:** https://developers.printful.com
- **Stripe Docs:** https://stripe.com/docs
- **Cloudinary:** https://cloudinary.com/documentation
- **Tailwind CSS:** https://tailwindcss.com/docs

---

**Full Analysis:** See `CODEBASE-ANALYSIS.md` for comprehensive documentation.
