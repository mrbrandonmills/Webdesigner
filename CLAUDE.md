# Brandon Mills Website - Development Guide

## Project Overview

Brandon Mills' luxury personal brand website featuring photography portfolio, modeling archive, writing collections, meditation products, and e-commerce store.

**Tech Stack:**
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- Stripe (Payments)
- Printful (Print-on-demand)
- Vercel (Hosting)

---

## Critical Build Patterns

### API Routes with Third-Party SDKs (Stripe, Resend, etc.)

**IMPORTANT:** Never initialize third-party SDK clients at the module level in API routes.

#### ❌ Wrong Pattern (Causes Build Errors)

```typescript
import Stripe from 'stripe'

// This will FAIL during build when env vars aren't available
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-10-29.clover',
})

export async function POST(request: Request) {
  const session = await stripe.checkout.sessions.create({...})
}
```

**Error:**
```
Error: Neither apiKey nor config.authenticator provided
```

#### ✅ Correct Pattern (Lazy Initialization)

```typescript
import Stripe from 'stripe'

// Always add this to API routes
export const dynamic = 'force-dynamic'

// Lazy initialization - SDK created only when route is called
function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not set')
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-10-29.clover',
  })
}

export async function POST(request: Request) {
  // Initialize Stripe inside the handler
  const stripe = getStripe()
  const session = await stripe.checkout.sessions.create({...})
}
```

#### Why This Matters

1. **Build Time vs Runtime:** Module-level code runs during Next.js build when environment variables may not be available
2. **Environment Variables:** `process.env` values are only guaranteed at runtime in API routes
3. **Dynamic Routes:** `export const dynamic = 'force-dynamic'` ensures the route is never statically generated

#### When to Use This Pattern

Apply lazy initialization to ANY third-party SDK that requires API keys:
- Stripe
- Resend (email)
- Printful
- OpenAI
- Database clients
- Any service requiring authentication

#### Files Using This Pattern

Current implementations:
- `app/api/stripe/create-checkout/route.ts`
- `app/api/stripe/verify-purchase/route.ts`
- `app/api/stripe/checkout/route.ts`
- `app/api/stripe/webhook/route.ts`
- `app/api/webhooks/stripe/route.ts`
- `app/api/books/unlock/route.ts`

---

## Architecture

### Directory Structure

```
/app                      # Next.js App Router
  /api                   # API routes (force-dynamic)
    /stripe              # Payment processing
    /books               # Book unlock functionality
    /webhooks            # External service webhooks
  /blog                  # Blog pages (force-dynamic layout)
  /admin                 # Admin dashboard (force-dynamic layout)
  /gallery               # Photography portfolio
  /writing               # Essays, poetry, research
  /store                 # E-commerce storefront
/components              # React components
  /ui                    # Reusable UI components
/lib                     # Utilities and helpers
/data                    # Static data files
```

### Dynamic vs Static Routes

**Force Dynamic Routes:**
- All `/api/*` routes (via `app/api/layout.tsx`)
- All `/blog/*` pages (via `app/blog/layout.tsx`)
- All `/admin/*` pages (via `app/admin/layout.tsx`)

These use `export const dynamic = 'force-dynamic'` to prevent static generation during build.

---

## Key Features

### Geometric Backgrounds

Site-wide background system with path-based variant selection:

**Component:** `components/ui/page-background.tsx`

Automatically applies different geometric patterns based on route:
- Homepage: Luxury gold pattern
- Genesis pages: Sacred geometry with Vitruvian Man circles
- Blog: Minimal smoke effect
- Store: Particle system
- Default: Subtle minimal pattern

**Variants:**
- `luxury` - Golden ratio geometric patterns
- `sacred-geometry` - Concentric circles with phi nodes
- `vitruvian` - Vitruvian Man inspired design
- `minimal` - Subtle lines
- `smoke` - Ethereal smoke effect
- `particles` - Floating particle system
- `waves` - Animated wave patterns

### Genesis Modeling Archive

Professional modeling portfolio featuring backstories and campaign documentation.

**Location:** `/app/gallery/genesis` and `/app/blog/genesis/[slug]`

**Database:** `data/genesis-stories.ts`

Includes:
- High-fashion editorial campaigns
- Vulnerability-focused artistic shoots
- Professional collaborations
- Full narrative context for each project

### Payment Processing

Stripe integration for digital products (books, meditations) and physical products (print-on-demand).

**Key Routes:**
- `/api/stripe/checkout` - Create checkout sessions
- `/api/stripe/verify-purchase` - Verify successful payments
- `/api/webhooks/stripe` - Handle Stripe webhooks

**Pattern:** All Stripe routes use lazy initialization (see above).

### Performance Optimizations

**Page Transitions:** 0.2s duration for snappy feel
- File: `components/page-transition.tsx`

**Smooth Scroll:** 0.8s duration with 1.2x wheel multiplier
- File: `components/smooth-scroll.tsx`

---

## Environment Variables

Required for production:

```bash
# Stripe
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...

# Resend (Email)
RESEND_API_KEY=re_...

# Printful (E-commerce)
PRINTFUL_API_KEY=...

# Base URL
NEXT_PUBLIC_BASE_URL=https://brandonmills.com

# Blob Storage (Vercel)
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...

# Cartesia (Text-to-Speech)
CARTESIA_API_KEY=sk_car_...
```

---

## Build & Deployment

### Local Build

```bash
npm run build
```

All 79+ pages should generate successfully without errors.

### Deployment

Automatic deployment via Vercel on push to `main` branch.

**Critical:** Ensure all environment variables are set in Vercel dashboard before deployment.

---

## Common Issues

### Build Failing with Stripe Errors

**Symptom:** `Error: Neither apiKey nor config.authenticator provided`

**Cause:** Stripe SDK initialized at module level

**Fix:** Use lazy initialization pattern (see above)

### Window is Not Defined

**Symptom:** `ReferenceError: window is not defined`

**Cause:** Client-side code running during server-side rendering

**Fix:** Add `export const dynamic = 'force-dynamic'` to the page or create a layout file with the dynamic export

### Missing Content on Production

**Symptom:** Content visible locally but not on live site

**Cause:** Changes not committed/pushed to Git

**Fix:**
```bash
git add -A
git commit -m "Description of changes"
git push
```

---

## Development Workflow

1. **Local Development:**
   ```bash
   npm run dev
   ```

2. **Test Build:**
   ```bash
   npm run build
   ```

3. **Commit Changes:**
   ```bash
   git add -A
   git commit -m "Descriptive commit message"
   ```

4. **Deploy:**
   ```bash
   git push
   ```
   (Vercel auto-deploys)

---

## Code Standards

### TypeScript

- Use strict TypeScript for all new code
- Avoid `any` types - prefer `unknown` or proper typing
- Use interfaces for data structures

### API Routes

- Always use `export const dynamic = 'force-dynamic'`
- Use lazy initialization for SDK clients
- Validate all inputs with Zod or similar
- Return proper HTTP status codes
- Use try/catch for error handling

### Components

- Prefer server components unless client interactivity needed
- Use `'use client'` directive only when necessary
- Extract reusable logic into custom hooks
- Keep components focused and single-purpose

---

## Testing Checklist

Before deployment:
- [ ] Local build completes successfully (`npm run build`)
- [ ] All TypeScript errors resolved
- [ ] API routes use lazy initialization
- [ ] Environment variables set in Vercel
- [ ] Changes committed and pushed to Git
- [ ] Test critical user flows on staging

---

## Vercel Deployment Issues

### Context Compaction Breaks Auto-Deployment

**Symptom:** After context compaction, Vercel deployments go to preview URLs but don't auto-promote to production domain (brandonmills.com)

**Root Cause:** Context compaction can disrupt the session state that maintains Vercel's auto-promotion configuration

**Solution:**

1. **Manual Promotion via Vercel Dashboard:**
   - Go to https://vercel.com/brandons-projects-c4dfa14a/webdesigner/deployments
   - Find the latest "Ready" deployment
   - Click "Promote to Production"

2. **Vercel CLI Promotion:**
   ```bash
   cd "/Volumes/Super Mastery/Webdesigner"
   npx vercel ls  # Find the latest ready deployment URL
   npx vercel promote https://webdesigner-xxxxx.vercel.app --yes
   ```

3. **Check Domain Configuration:**
   ```bash
   npx vercel domains ls
   ```
   Ensure `brandonmills.com` is listed and pointing to the correct project

**Prevention:**
- Monitor deployments after context compaction
- Verify production domain shows updates after each deployment
- Keep Vercel dashboard open during active development sessions

---

Last Updated: 2025-11-17
