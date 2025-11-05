# Brandon Mills Web Designer - Comprehensive Codebase Analysis

## Executive Summary

This is a **Next.js 15 full-stack application** for Brandon Mills (model, actor, researcher, AI engineer) featuring:
- **Portfolio gallery system** with Webflow CMS integration
- **E-commerce store** powered by Printful (print-on-demand)
- **Admin dashboard** for content management, product generation, and analytics
- **AI-powered content generation** using Claude 3.5 Sonnet
- **Advanced analytics** for product performance tracking and optimization
- **Luxury minimalist design** with black/gold color scheme

**Codebase Size:** 4.4 MB | **Code Files:** 83 TypeScript/TSX | **Components:** 23+ | **API Routes:** 24

---

## 1. Project Structure & Tech Stack

### Framework & Language
- **Framework:** Next.js 15.1.0 (with App Router)
- **Language:** TypeScript 5.7.2
- **Runtime:** Node.js 22.3.0+
- **Deployment:** Vercel (with Blob storage, Analytics, Edge Functions ready)

### Frontend Technologies
- **React:** 19.0.0 (with hooks, context API)
- **Styling:** Tailwind CSS 3.4.17 + Custom CSS
- **Animations:** Framer Motion 12.23.24, GSAP 3.13.0, Lenis 1.3.13 (smooth scroll)
- **UI Components:** Lucide React icons
- **Data Fetching:** SWR 2.3.6, native fetch
- **3D Graphics:** Three.js 0.181.0, React Three Fiber 9.4.0, Drei 10.7.6

### Backend & APIs
- **AI/LLM:** Vercel AI SDK 4.0.14, Anthropic SDK (@ai-sdk/anthropic 1.0.0), OpenAI SDK 4.77.0
- **Database:** Vercel Blob Storage, localStorage (client-side cart)
- **Image Processing:** Sharp 0.34.4, Cloudinary SDK 2.5.1
- **Payment:** Stripe SDK 19.2.0
- **CMS:** Webflow API v2 (REST)
- **Print-on-Demand:** Printful API v2 (REST)

### Development Tools
- **Build:** Next.js built-in (with 50mb serverAction body limit)
- **Linting:** ESLint 9.17.0 with Next.js config
- **Type Checking:** TypeScript with strict mode
- **Package Manager:** npm (package-lock.json: 8710 lines)

### Key Dependencies
```json
{
  "ai": "^4.0.14",                           // Vercel AI SDK
  "@ai-sdk/anthropic": "^1.0.0",            // Claude integration
  "@ai-sdk/openai": "^1.0.0",               // OpenAI integration
  "@modelcontextprotocol/sdk": "^1.0.0",    // MCP support
  "next": "^15.1.0",                        // Framework
  "react": "^19.0.0",                       // UI library
  "stripe": "^19.2.0",                      // Payment processing
  "cloudinary": "^2.5.1",                   // Image optimization
  "framer-motion": "^12.23.24",             // Animations
  "tailwindcss": "^3.4.17",                 // Styling
  "zod": "^3.24.1",                         // Type validation
  "nanoid": "^5.0.9",                       // ID generation
  "date-fns": "^4.1.0",                     // Date utilities
  "fast-xml-parser": "^4.3.3"               // XML parsing (Squarespace imports)
}
```

---

## 2. Application Architecture

### Directory Structure
```
/Users/brandon/Webdesigner/
├── app/                          # Next.js App Router
│   ├── api/                      # 24 API routes
│   │   ├── auth/                 # Authentication (login/logout)
│   │   ├── admin/                # Admin product management
│   │   ├── store/                # Product/cart APIs
│   │   ├── stripe/               # Payment processing
│   │   ├── analytics/            # Event tracking
│   │   ├── generate-content/     # AI content generation
│   │   ├── transcribe/           # Voice transcription (OpenAI Whisper)
│   │   ├── publish/              # Content publishing (Medium, Webflow)
│   │   ├── upload/               # File upload handling
│   │   ├── optimize-images/      # Image optimization
│   │   └── [other routes]        # Autonomous import, audits, etc.
│   ├── admin/                    # Admin dashboard pages
│   │   ├── page.tsx              # Admin hub
│   │   ├── login/                # Auth page
│   │   ├── content/              # Content management
│   │   ├── store/                # Store management
│   │   ├── products/             # Product creation/generation
│   │   ├── analytics/            # Performance analytics
│   │   └── orders/               # Order management
│   ├── gallery/                  # Portfolio gallery
│   ├── store/                    # E-commerce store
│   ├── work/                     # Work showcase (modeling, acting, research, tech)
│   ├── about/                    # About page
│   ├── contact/                  # Contact page
│   ├── checkout/                 # Payment success page
│   ├── review/                   # Content review interface
│   ├── layout.tsx                # Root layout with providers
│   ├── page.tsx                  # Home redirect → /gallery
│   └── globals.css               # Global styles
├── components/                   # 23+ React components
│   ├── gallery/                  # Gallery-specific components
│   │   ├── hero.tsx
│   │   ├── project-grid.tsx
│   │   └── project-detail.tsx
│   ├── navigation.tsx            # Top navigation bar
│   ├── cart-sidebar.tsx          # Shopping cart sidebar
│   ├── photo-uploader.tsx        # Photo upload interface
│   ├── voice-recorder.tsx        # Voice memo recording
│   ├── smooth-scroll.tsx         # Smooth scrolling provider (Lenis)
│   ├── scroll-reveal.tsx         # Scroll-triggered animations
│   ├── page-transition.tsx       # Page transitions
│   ├── error-boundary.tsx        # Error handling
│   ├── toast.tsx / toast-wrapper.tsx  # Notifications
│   └── [other UI components]     # Ripple buttons, cursors, etc.
├── contexts/
│   └── cart-context.tsx          # Shopping cart state management
├── lib/                          # Utility libraries
│   ├── auth.ts                   # Authentication helpers (cookie-based)
│   ├── webflow-client.ts         # Webflow CMS API client
│   ├── printful-client.ts        # Printful print-on-demand API client
│   ├── product-analytics.ts      # Client-side product performance tracking
│   ├── voice-profile.ts          # AI brand voice directive
│   ├── category-prompts.ts       # Category-specific AI prompts
│   └── webflow-richtext.ts       # Rich text formatting for Webflow
├── data/
│   └── curated-products.json     # Local product cache
├── middleware.ts                 # Auth middleware (protects /admin routes)
├── next.config.ts               # Next.js configuration
├── tailwind.config.ts           # Tailwind CSS config
├── tsconfig.json                # TypeScript config
├── postcss.config.mjs           # PostCSS config
└── .env.example                 # Environment variable template
```

### Code Statistics
- **Total Components:** 23+ UI components
- **API Routes:** 24 endpoints
- **Component Code:** 3,232 lines
- **API Route Code:** 3,039 lines
- **Utility Libraries:** 7 core libraries
- **Pages:** 9 main pages + 24 API routes

---

## 3. Backend Architecture & API Endpoints

### Authentication System
**Location:** `/middleware.ts` + `/lib/auth.ts`

- **Type:** Cookie-based session (httpOnly, secure in production)
- **Credentials:** Stored in environment variables
  - `ADMIN_USERNAME=Bmilly23`
  - `ADMIN_PASSWORD=23458023`
- **Cookie Name:** `brandon-admin-auth`
- **Session Duration:** 7 days
- **Protected Routes:** All `/admin/*` paths

**Auth Endpoints:**
- `POST /api/auth/login` - Login with username/password
- `POST /api/auth/logout` - Clear session

### API Routes (24 Total)

#### Authentication
- `POST /api/auth/login` - Authenticate admin
- `POST /api/auth/logout` - Clear session

#### E-Commerce & Store
- `GET /api/store/curated-products` - Fetch cached products (instant, no API calls)
- `GET /api/store/products` - Fetch Printful catalog products
- `POST /api/stripe/checkout` - Create Stripe checkout session
- `POST /api/stripe/webhook` - Handle payment webhooks

#### Admin & Product Management
- `POST /api/admin/generate-products` - Generate product variations using AI
- `POST /api/admin/products/replicate` - Create variations of top performers
- `POST /api/admin/products/remove` - Remove underperforming products
- `GET /api/admin/orders` - Fetch Printful orders

#### Content Management
- `POST /api/generate-content` - AI-powered content generation (Claude)
- `POST /api/upload` - Upload files to Vercel Blob
- `POST /api/upload-collection` - Batch upload multiple files
- `POST /api/transcribe` - Transcribe voice to text (OpenAI Whisper)
- `POST /api/optimize-images` - Optimize images with Cloudinary
- `POST /api/process-content` - Process and optimize content
- `POST /api/process-voice` - Process voice memos

#### Publishing
- `POST /api/publish/medium` - Auto-post essays to Medium
- `POST /api/webflow/publish` - Publish to Webflow CMS

#### Analytics & Automation
- `POST /api/analytics/track` - Track user events (server-side backup)
- `POST /api/audit-site` - Analyze site for brand voice extraction
- `POST /api/autonomous-import` - Single project import
- `POST /api/autonomous-import-all` - Batch import from Squarespace

#### AI & Utilities
- `POST /api/ai-design-placeholder` - Generate placeholder designs
- `POST /api/analyze-*` - Various analysis endpoints

### Key API Features

#### Stripe Integration
**File:** `/app/api/stripe/checkout/route.ts`
- Accepts cart items with product data
- Supports international shipping (US, CA, GB, AU, NZ)
- Offers free and express shipping options
- Returns checkout session URL
- Stores cart items in Stripe metadata

#### Printful Integration
**File:** `/lib/printful-client.ts`
- Full REST API wrapper for Printful V2 API
- **Store ID:** 17145314
- **Supported Categories:** Posters (24), Canvas (29), Apparel (10), Mugs (19), Home (26)
- **Functions:**
  - `getCatalogProducts()` - Fetch available products
  - `getCatalogVariants()` - Get size/color options
  - `getVariantPrice()` - Get pricing
  - `uploadFile()` - Upload portfolio images
  - `createOrder()` - Create orders when customer purchases
  - `confirmOrder()` - Confirm for fulfillment
  - `getOrders()` - Fetch order history
  - `calculateShipping()` - Get shipping rates
  - `createMockupTask()` - Generate product mockups

#### Webflow Integration
**File:** `/lib/webflow-client.ts`
- Fetches portfolio projects from Webflow CMS
- **Collection Fields:** name, slug, description, category, tags, seo-keywords, meta-description, main-image, gallery-images
- **Cache Duration:** 1 hour (Next.js revalidate)
- **Fallback:** Returns empty array if credentials missing

#### AI Content Generation
**File:** `/app/api/generate-content/route.ts`
- Uses Claude 3.5 Sonnet via Vercel AI SDK
- Generates structured content using Zod validation
- Outputs: Title, slug, description, meta description, tags, captions, alt text, keywords, category
- **Features:**
  - Custom brand voice injection
  - Style guide integration (from site audit)
  - Category auto-detection
  - SEO optimization
  - Photo-by-photo captions

#### Voice Transcription
**File:** `/app/api/transcribe/route.ts`
- Uses OpenAI Whisper API
- Converts voice memos to text
- Used for content context/inspiration

#### Analytics Tracking
**File:** `/app/api/analytics/track/route.ts`
- Server-side event logging (JSONL format)
- Daily log files stored in `/data/analytics/`
- Tracks: product views, clicks, cart additions, purchases

---

## 4. Frontend Components & Pages

### Pages (9 Main Routes)

#### 1. **Gallery** (`/gallery`)
- **Component:** `/app/gallery/page.tsx` + `/components/gallery/`
- **Purpose:** Portfolio showcase (main landing)
- **Features:**
  - Fetches projects from Webflow CMS
  - Bento grid layout with varying card sizes
  - Hover animations (zoom, overlay reveal)
  - Responsive design (1-2-3 columns)
  - Project count display

#### 2. **Work** (`/work`)
- **Component:** `/app/work/page.tsx`
- **Categories:** Modeling, Acting, Research, Creative Tech
- **Features:** Category cards with icons and descriptions
- **Links to:** `/gallery`, `/work/acting`, `/work/research`, `/work/tech`

#### 3. **Store** (`/store`)
- **Component:** `/app/store/page.tsx`
- **Features:**
  - Product grid with search filtering
  - Category filtering (All, Gallery Prints, Canvas, Apparel, Lifestyle)
  - Product skeletons during loading
  - "Add to Cart" buttons with product analytics
  - Curated products from local cache (fast loading)

#### 4. **About** (`/about`)
- **Component:** `/app/about/page.tsx`
- **Sections:**
  - Hero with title
  - Personal story (3 paragraphs)
  - Philosophy quote
  - Areas of interest (5 categories)
  - Instagram link

#### 5. **Contact** (`/contact`)
- **Component:** `/app/contact/page.tsx`
- **Features:**
  - Contact form (name, email, subject, message)
  - Client-side submission (TODO: email service integration)
  - Success confirmation message
  - Instagram link

#### 6. **Admin Hub** (`/admin`)
- **Component:** `/app/admin/page.tsx`
- **Features:**
  - Two main sections: Content Studio + Store Management
  - Links to sub-pages
  - Logout button
  - Gradient card UI with icons

#### 7. **Admin Content** (`/admin/content`)
- Content management interface
- Photo/video upload
- Voice descriptions
- Collection management

#### 8. **Admin Store** (`/admin/store`)
- Product management
- Curated product editor
- Analytics dashboard

#### 9. **Checkout Success** (`/checkout/success`)
- Post-purchase confirmation page
- Retrieves Stripe session info

### Key Components (23+)

#### Navigation & Layout
- **`navigation.tsx`** - Top navbar with scroll detection, mobile menu
- **`smooth-scroll.tsx`** - Lenis integration for smooth scrolling
- **`page-transition.tsx`** - Page transition animations with Framer Motion
- **`custom-cursor.tsx`** - Custom cursor tracking

#### Content Interaction
- **`photo-uploader.tsx`** - Drag-and-drop photo upload
- **`batch-uploader.tsx`** - Batch file upload with progress
- **`file-uploader.tsx`** - Generic file upload
- **`upload-interface.tsx`** - File upload UI wrapper
- **`uploaded-files-preview.tsx`** - Preview uploaded files

#### Audio/Voice
- **`voice-recorder.tsx`** - Record voice memos in browser
- **`voice-memo-recorder.tsx`** - Enhanced voice memo interface

#### Store & Cart
- **`cart-sidebar.tsx`** - Shopping cart sidebar with item management
- **`product-skeleton.tsx`** - Loading placeholders for products

#### UI Elements
- **`ripple-button.tsx`** - Button with ripple effect
- **`toast.tsx`** / **`toast-wrapper.tsx`** - Notification system
- **`error-boundary.tsx`** - Error handling wrapper
- **`scroll-reveal.tsx`** - Scroll-triggered reveal animations
- **`parallax-section.tsx`** - Parallax scrolling effects

#### Gallery Specific
- **`gallery/hero.tsx`** - Hero section for gallery
- **`gallery/project-grid.tsx`** - Bento grid layout
- **`gallery/project-detail.tsx`** - Individual project detail view

#### Other
- **`video-hero.tsx`** - Video background hero section
- **`review-interface.tsx`** - Content review UI
- **`editable-field.tsx`** - Inline field editing

---

## 5. E-Commerce Functionality

### Current Status
- **Payment Processing:** ✅ Stripe integration complete
- **Product Catalog:** ✅ Printful integration with 5 product categories
- **Shopping Cart:** ✅ localStorage-based cart with context API
- **Order Management:** ✅ Printful order creation and tracking
- **Product Analytics:** ✅ Client-side performance tracking
- **Inventory:** ✅ Printful manages (print-on-demand)

### Architecture

#### Shopping Cart (Context)
**File:** `/contexts/cart-context.tsx`
- **State Management:** React Context + useState
- **Persistence:** localStorage (`bmills-cart`)
- **Cart Item Structure:**
  ```typescript
  {
    productId: number
    variantId: number
    productTitle: string
    variantName: string
    image: string
    price: string
    quantity: number
    type: string
    brand: string
  }
  ```
- **Functions:** addItem, removeItem, updateQuantity, clearCart
- **Toast Notifications:** Auto-notify on cart changes

#### Product Categories
1. **Gallery Prints** (Posters - ID: 24)
2. **Canvas Art** (Canvas Prints - ID: 29)
3. **Apparel** (T-shirts & Apparel - ID: 10)
4. **Lifestyle** (Mugs & Home - IDs: 19, 26)
5. **All Products** (Mixed)

#### Product Analytics
**File:** `/lib/product-analytics.ts`

Tracks per-product metrics:
- Views, clicks, add-to-cart actions, purchases
- Revenue per product
- Conversion rates
- Performance scores (0-100)

**Features:**
- `trackView()` - Log product view
- `trackClick()` - Log product click
- `trackAddToCart()` - Log cart addition with price
- `trackPurchase()` - Log purchase with revenue
- `getUnderperformers()` - Find products to remove
- `getTopPerformers()` - Find products to replicate
- `getInsights()` - Dashboard analytics
- `autoOptimize()` - Auto-remove bad products, replicate winners

**Performance Thresholds:**
- Min views: 50
- Min conversion rate: 2%
- Stale threshold: 30 days no views
- Top performer: Top 20%

#### Checkout Flow
1. User adds items to cart
2. Cart sidebar updates via context
3. User clicks "Checkout"
4. `POST /api/stripe/checkout` creates session
5. Redirects to Stripe hosted checkout
6. On success: `/checkout/success?session_id={ID}`
7. Stripe webhook (TODO) → Create Printful order

### Limitations & TODOs
- Stripe webhook handling (incomplete)
- Order persistence (orders stored in Printful but not in local DB)
- Email notifications (not implemented)
- Inventory tracking (fully delegated to Printful)
- Customer accounts (not implemented)
- Order history (requires customer login)

---

## 6. Configuration Files & Environment Variables

### Environment Variables (`.env.example`)

#### AI/LLM APIs
- `OPENAI_API_KEY` - OpenAI (Whisper transcription)
- `ANTHROPIC_API_KEY` - Anthropic/Claude (content generation)

#### Webflow CMS
- `WEBFLOW_API_TOKEN` - API authentication
- `WEBFLOW_SITE_ID` - Site identifier
- `WEBFLOW_COLLECTION_ID` - Portfolio collection
- `NEXT_PUBLIC_WEBFLOW_SITE_URL` - Public site URL

#### Cloudinary (Image CDN)
- `CLOUDINARY_CLOUD_NAME` - Account identifier
- `CLOUDINARY_API_KEY` - API key
- `CLOUDINARY_API_SECRET` - Secret key

#### Printful (Print-on-Demand)
- `PRINTFUL_API_KEY=vbrzkAu9dnvIO6AAikezjsczratgW3FWjhDAOuWo`
- `PRINTFUL_STORE_ID=17145314`

#### Stripe (Payment Processing)
- `STRIPE_SECRET_KEY` - Secret key (test/live)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Public key

#### Admin Authentication
- `ADMIN_USERNAME=Bmilly23`
- `ADMIN_PASSWORD=23458023`

#### URLs & Deployment
- `NEXT_PUBLIC_BASE_URL` - App base URL (for redirects)
- `NEXT_PUBLIC_SITE_URL` - Public site URL (TODO: usage)

#### Optional Features
- `MEDIUM_ACCESS_TOKEN` - Medium.com integration (essays)
- `MEDIUM_AUTHOR_ID` - Medium author identifier
- `DATAFORSEO_LOGIN` - Advanced SEO (optional)
- `DATAFORSEO_PASSWORD` - SEO features (optional)

#### Storage (Auto-Configured by Vercel)
- `BLOB_READ_WRITE_TOKEN` - Vercel Blob (auto-generated on Vercel)

### TypeScript Configuration
**File:** `tsconfig.json`
- **Target:** ES2022
- **Strict Mode:** Enabled
- **Path Aliases:** `@/*` → root directory
- **Plugins:** Next.js type plugin

### Tailwind Configuration
**File:** `tailwind.config.ts`
- **Color Scheme:** CSS variables (--background, --foreground, --accent)
- **Fonts:** Cormorant Garamond (serif), Playfair Display (serif), Inter (sans)
- **Plugins:** @tailwindcss/typography

### Next.js Configuration
**File:** `next.config.ts`
- **Server Actions:** 50MB body size limit
- **Image Domains:** Cloudinary, Vercel Blob, Webflow CDN, Squarespace CDN
- **Redirects:** `/` → `/gallery`

### PostCSS Configuration
**File:** `postcss.config.mjs`
- **Plugins:** Tailwind CSS, Autoprefixer

---

## 7. Design System & Styling

### Color Palette (CSS Variables in `globals.css`)

```css
:root {
  --background: #000000;           /* Pure black */
  --foreground: #ffffff;            /* Pure white */
  --accent: #c9a050;               /* Gold/bronze */
  --accent-hover: #b89040;         /* Darker gold */
  --border: rgba(255, 255, 255, 0.1);  /* Subtle white border */
  --muted: rgba(255, 255, 255, 0.6);   /* Muted white text */
}
```

### Typography Stack
- **Headings:** Playfair Display (400 weight), Cormorant Garamond (serif)
- **Body:** Inter (sans-serif)
- **Font Imports:** Google Fonts with various weights

### Design Characteristics
- **Aesthetic:** Luxury minimalist, museum-quality
- **Spacing:** Clamp-based fluid padding (responsive without media queries)
- **Animations:** Smooth cubic-bezier easing (0.16, 1, 0.3, 1)
- **Visual Effects:**
  - Fade-in animations
  - Zoom effects on hover
  - Gradient overlays
  - Gold accent underlines
  - Text reveal animations
  - Ripple button effects
  - Image hover zoom (1.05x scale)
  - Luxury card hover lift (translateY -4px)

### Custom CSS Classes
- `.container-wide` - Responsive max-width container
- `.luxury-divider` - Gradient divider line
- `.accent-gold` / `.bg-accent-gold` / `.border-accent-gold` - Gold theming
- `.image-hover-zoom` - Subtle zoom effect
- `.image-hover-overlay` - Dark gradient overlay on hover
- `.link-underline` - Animated underline on hover
- `.luxury-card` - Card with hover lift and gold border
- `.gallery-item` - Gallery item with scale animation
- `.text-reveal` - Word-by-word reveal animation
- `.animate-fadeIn` - Fade-in from bottom
- `.animate-slideInRight` - Slide-in from right

### Custom Animations
- `@keyframes fadeIn` - Bottom-to-top fade
- `@keyframes slideInRight` - Right-to-left slide
- `@keyframes textReveal` - Word reveal
- `@keyframes ripple` - Button ripple effect
- `@keyframes pulse-slow` - Slow pulse for loading

---

## 8. Existing Tests & Testing Infrastructure

### Current Status
- **Test Framework:** ❌ None configured
- **Test Files:** ❌ No test files found
- **Test Infrastructure:** ❌ Not set up (no jest.config, vitest.config)
- **Test Scripts:** ❌ No test scripts in package.json

### Recommendations
1. Add Jest or Vitest configuration
2. Create unit tests for utility functions (auth, analytics, Webflow client)
3. Add integration tests for API routes
4. Add E2E tests with Playwright/Cypress for user flows

---

## 9. Brand Identity Elements

### Visual Identity
- **Primary Color:** Gold/Bronze (`#c9a050`) - luxury, prestige
- **Secondary Color:** Black (`#000000`) - sophisticated
- **Accent Colors:** White, subtle grays
- **Aesthetic:** Museum-quality, high-fashion, minimalist

### Typography
- **Display Font:** Playfair Display (editorial, premium feel)
- **Serif Font:** Cormorant Garamond (elegant, traditional)
- **Sans Font:** Inter (modern, clean, readable)

### Brand Voice (from `/lib/voice-profile.ts`)
- **Tone:** Therapeutic, introspective, renaissance gentleman
- **Keywords:** Performance, embodiment, presence, consciousness, creative expression
- **Positioning:** Multi-faceted creative (not a service seller)
- **Target Audience:** Art directors, creative professionals, intellectuals
- **Values:** Authenticity, depth, innovation, embodiment

### Logos & Assets
- **Site Logo:** "BRANDON MILLS" text (serif font, tracked)
- **Navigation:** Minimalist text-based navigation
- **Social:** Instagram link to @mrbrandonmills
- **Contact:** Email (brandon@brandonmills.com)

### Brand Personality Dimensions
1. **Professional:** Model, actor, researcher, AI engineer
2. **Creative:** Fashion, performance, embodied cognition
3. **Intellectual:** Cognitive research, writing, teaching
4. **Technical:** AI development, creative automation

---

## 10. Third-Party Integrations & Services

### Core Integrations

#### 1. **Webflow** (CMS)
- **Purpose:** Portfolio gallery content management
- **Integration:** API v2 REST client
- **Features:** Fetch, create, update portfolio items
- **Status:** ✅ Implemented
- **API Docs:** https://developers.webflow.com/

#### 2. **Printful** (E-Commerce)
- **Purpose:** Print-on-demand product fulfillment
- **Integration:** API v2 REST client with custom wrapper
- **Store ID:** 17145314
- **Features:** Product catalog, variants, pricing, orders, mockups, file uploads
- **Status:** ✅ Fully implemented
- **Product Categories:** Posters, Canvas, Apparel, Mugs, Home goods

#### 3. **Stripe** (Payments)
- **Purpose:** Accept credit card payments
- **Integration:** Stripe SDK v19.2.0
- **Features:** Checkout sessions, shipping options, customer emails
- **Shipping Options:** Free (5-10 days), Express (2-3 days)
- **Status:** ✅ Checkout implemented (webhooks TODO)

#### 4. **Anthropic/Claude** (AI)
- **Purpose:** Content generation (titles, descriptions, SEO)
- **Integration:** Vercel AI SDK + @ai-sdk/anthropic
- **Model:** Claude 3.5 Sonnet
- **Features:** Structured output (Zod validation), brand voice customization
- **Status:** ✅ Fully implemented

#### 5. **OpenAI** (AI)
- **Purpose:** Voice transcription (Whisper API)
- **Integration:** OpenAI SDK
- **Features:** Convert audio → text
- **Status:** ✅ Implemented in `/api/transcribe`

#### 6. **Cloudinary** (Image CDN)
- **Purpose:** Image optimization, resizing, format conversion
- **Integration:** Cloudinary SDK
- **Features:** WebP/AVIF conversion, responsive sizing, URL-based transformation
- **Status:** ✅ Integrated for image optimization

#### 7. **Vercel**
- **Hosting:** App deployment
- **Blob Storage:** File storage (for uploads)
- **Analytics:** Page performance analytics
- **Status:** ✅ Configured

#### 8. **Medium** (Publishing - Optional)
- **Purpose:** Auto-publish essays
- **Integration:** Medium API
- **Status:** 🟡 Configured but untested
- **Location:** `/api/publish/medium`

#### 9. **DataForSEO** (SEO - Optional)
- **Purpose:** Advanced SEO analysis
- **Integration:** REST API
- **Status:** 🟡 Not yet implemented

### Integration Points in Codebase

| Service | Location | Status | Key Files |
|---------|----------|--------|-----------|
| Webflow | Gallery, Admin | ✅ Live | `/lib/webflow-client.ts` |
| Printful | Store, Admin | ✅ Live | `/lib/printful-client.ts` |
| Stripe | Store checkout | ✅ Implemented | `/app/api/stripe/` |
| Claude | Content generation | ✅ Live | `/app/api/generate-content/` |
| OpenAI Whisper | Voice transcription | ✅ Live | `/app/api/transcribe/` |
| Cloudinary | Image optimization | ✅ Live | `/app/api/optimize-images/` |
| Medium | Essay publishing | 🟡 Config only | `/app/api/publish/medium/` |
| DataForSEO | SEO analysis | ❌ Not implemented | N/A |

---

## 11. Advanced Features & Infrastructure

### AI Features
1. **Content Generation** - Claude generates portfolio content from photos + voice notes
2. **Brand Voice** - Custom voice extraction from existing site for AI consistency
3. **Site Audit** - Analyze competitor/existing site for style guide
4. **Category Detection** - Auto-categorize photos (Portrait, Fashion, Editorial, etc.)
5. **Voice Transcription** - Convert voice memos to text using Whisper
6. **Product Analytics** - Track performance and auto-optimize inventory

### Automation Features
1. **Autonomous Import** - Batch import from Squarespace/WordPress
2. **Auto-Optimization** - Remove underperformers, replicate winners
3. **Batch Processing** - Bulk upload and process multiple files
4. **Scheduled Tasks** - (Infrastructure ready, implementation pending)

### Analytics & Monitoring
1. **Product Performance Tracking** (client-side + server logging)
2. **Event Tracking** (views, clicks, cart additions, purchases)
3. **Daily Analytics Logs** (JSONL format in `/data/analytics/`)
4. **Vercel Analytics** (Page performance, Core Web Vitals)

### Accessibility & Performance
- **SEO:** Meta tags, og: tags, structured data ready
- **Images:** Responsive, WebP/AVIF support, lazy loading
- **Fonts:** System font fallbacks, proper font loading
- **Color Contrast:** WCAG AA compliant (white on black)
- **Alt Text:** AI-generated alt text for images
- **Mobile:** Responsive design (mobile-first)

---

## 12. Current State & Deployment Status

### Deployment Setup
- **Hosting:** Vercel configured
- **Domain:** Ready for custom domain
- **SSL:** Auto-enabled on Vercel
- **CI/CD:** Git-based (Vercel auto-deploys)
- **Environment:** Production-ready

### Feature Completion Status

| Feature | Status | Notes |
|---------|--------|-------|
| Portfolio Gallery | ✅ 95% | Webflow integration working, needs content |
| E-Commerce Store | ✅ 85% | Stripe + Printful integrated, webhook pending |
| Admin Dashboard | ✅ 80% | Core features complete, some admin pages incomplete |
| AI Content Generation | ✅ 90% | Working with brand voice customization |
| Voice Transcription | ✅ 100% | OpenAI Whisper integrated |
| Image Optimization | ✅ 90% | Cloudinary ready, integration working |
| Authentication | ✅ 100% | Cookie-based auth for admin |
| Analytics | ✅ 90% | Tracking implemented, dashboard partial |
| Contact Form | ⚠️ 30% | Form UI ready, email service not integrated |
| Mobile Responsive | ✅ 95% | Mobile-first design |
| Accessibility | ✅ 80% | Alt text, ARIA labels ready |
| Performance | ✅ 90% | Image optimization, lazy loading implemented |
| SEO | ✅ 85% | Meta tags, structured data ready |
| Testing | ❌ 0% | No test infrastructure |

### Files Not Fully Analyzed
- Product generation algorithms (complex AI integration)
- Advanced admin features
- Some API route details

---

## Key Files Summary

### Critical Path
1. `package.json` - Dependencies
2. `middleware.ts` - Auth protection
3. `/app/layout.tsx` - Root layout + providers
4. `/lib/webflow-client.ts` - Portfolio data
5. `/lib/printful-client.ts` - E-commerce data
6. `/contexts/cart-context.tsx` - Shopping cart
7. `/app/api/stripe/checkout/route.ts` - Payment processing
8. `/app/api/generate-content/route.ts` - AI content

### Configuration
- `.env.example` - All required API keys
- `next.config.ts` - Image domains, redirects
- `tailwind.config.ts` - Color theme
- `tsconfig.json` - TypeScript settings
- `middleware.ts` - Auth middleware

### Styling
- `/app/globals.css` - Design system (colors, animations, utilities)
- `tailwind.config.ts` - Tailwind theme

### Core Utilities
- `/lib/auth.ts` - Authentication helpers
- `/lib/webflow-client.ts` - Webflow API wrapper
- `/lib/printful-client.ts` - Printful API wrapper
- `/lib/product-analytics.ts` - Analytics system
- `/lib/voice-profile.ts` - Brand voice directive
- `/contexts/cart-context.tsx` - State management

---

## Development Notes

### How the App Works
1. **Landing:** Visitor lands on `/gallery` (redirected from `/`)
2. **Browse:** View portfolio projects fetched from Webflow
3. **Navigate:** User can browse work categories, about, store
4. **Shop:** User browses products from Printful, adds to cart
5. **Checkout:** Stripe checkout session created, user pays
6. **Admin:** Brandon logs in at `/admin` to manage content
7. **Upload:** Upload photos + voice memos
8. **AI:** Claude generates content using brand voice
9. **Review:** Review and edit AI-generated content
10. **Publish:** One-click publish to Webflow CMS
11. **Analytics:** Track product performance, optimize inventory

### Quick Start Commands
```bash
npm install                  # Install dependencies
npm run dev                 # Start dev server (localhost:3000)
npm run build              # Build for production
npm run start              # Start production server
npm run lint               # Run ESLint
npm run type-check         # TypeScript check
```

### Important Notes
- All timestamps, IDs, and API keys are stored securely in environment variables
- Cart data persists in localStorage
- Analytics logged daily in JSONL format
- Webflow projects cached for 1 hour
- Image optimization happens automatically via Cloudinary
- Stripe webhook integration incomplete (needs backend database)

---

## Recommendations for Enhancement

1. **Add Testing** - Jest/Vitest with unit + integration tests
2. **Database** - Add Postgres/MongoDB for order history
3. **Email Service** - Integrate Resend/SendGrid for notifications
4. **Auth** - Add NextAuth.js for advanced auth features
5. **Search** - Add Algolia for product/project search
6. **Comments/Ratings** - Add product reviews system
7. **Wishlist** - Save favorite products
8. **Newsletter** - Subscribe to email list
9. **Rate Limiting** - Add API rate limiting
10. **Monitoring** - Add Sentry for error tracking
