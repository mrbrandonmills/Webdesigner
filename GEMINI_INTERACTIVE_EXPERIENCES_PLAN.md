# Implementation Plan: Gemini-Powered Interactive Experiences

## Executive Summary

This plan provides a comprehensive blueprint for building Gemini 3-powered interactive experiences as a monetizable product suite. The system extends the existing Webdesigner platform (which already has meditation products, Stripe integration, and blog infrastructure) with:

1. **Experience Generation & Management** - Create, store, and publish 3D games, visualizations, voxel art
2. **Monetization Layer** - Sell experiences individually ($5-15 each) or in bundles
3. **Creator Tools** - Dashboard to generate, edit, publish, and monetize
4. **Distribution** - Gallery, blog integration, embeddable experiences
5. **Lead Capture** - Email sequences to grow audience and drive conversions

## Quick Facts

- **Existing Tech Stack:** React 19, Next.js 15, Three.js, Framer Motion, Stripe, Resend
- **Reference Model:** Meditation products (10 × $5 items, $30 bundle) - proven pattern
- **Estimated Timeline:** 12 weeks (4 weeks per phase)
- **Target Revenue:** $2,000-10,000/month by month 4

---

## Table of Contents

1. [Existing Gemini Integration Reference](#1-existing-gemini-integration-reference)
2. [Current Tech Stack Analysis](#2-current-tech-stack-analysis)
3. [Meditation Products - Reference Implementation](#3-meditation-products---current-implementation)
4. [Email Integration Analysis](#4-email-integration-analysis)
5. [Blog Post Structure](#5-blog-post-structure)
6. [Implementation Roadmap (4 Phases)](#7-implementation-roadmap)
7. [Database Schema](#8-database-schema-if-using-postgres)
8. [Critical Implementation Notes](#11-critical-implementation-notes)

---

## 1. EXISTING GEMINI INTEGRATION REFERENCE

### Current Implementation Location
**File:** `/Volumes/Super Mastery/Webdesigner/app/lab/gemini-3d/page.tsx`

### Key Components Currently Implemented

#### 1.1 Luxury Design System (Built-in)
```typescript
const luxuryDesignSystem = {
  systemPrompt: `You are a luxury visual designer with museum-quality aesthetics rivaling Louis Vuitton, Hermès, and Gucci...`
  
  principles: [
    { id: 'color', title: 'Color Palette', tokens: '#000000, #C9A050, #FFFFFF' }
    { id: 'motion', title: 'Cinematic Motion', tokens: 'cubic-bezier(0.22, 1, 0.36, 1)' }
    { id: 'materials', title: '3D Materials', tokens: 'brushed gold, matte black, frosted glass' }
    { id: 'geometry', title: 'Sacred Geometry', tokens: '1.618 ratio, concentric circles' }
  ]
}
```

#### 1.2 Preset Prompts (6 Templates)
- Spaceship Game (Games)
- Philosophy Visualizer (Philosophy)
- Poetry Voxel Art (Art)
- Meditation Space (Wellness)
- Archetype World (Psychology)
- Essay to 3D (Research)

#### 1.3 Current Limitations
- Redirects to Google AI Studio (no embedded generation)
- No output capture/storage
- No monetization
- No gallery system
- No sharing/distribution

---

## 2. CURRENT TECH STACK ANALYSIS

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | ^19.0.0 | UI framework |
| **Next.js** | ^15.1.0 | Full-stack with API routes |
| **Three.js** | ^0.181.0 | 3D rendering |
| **Framer Motion** | ^12.23.24 | Animations |
| **Stripe** | ^19.3.1 | Payments (already configured) |
| **Resend** | ^6.4.2 | Email (already configured) |
| **TailwindCSS** | ^3.4.17 | Styling |

---

## 3. MEDITATION PRODUCTS - CURRENT IMPLEMENTATION

**Key Learning:** Use this as the reference pattern for experiences.

### Product Structure
- 10 meditations, $5 each
- Bundle: $30 (all 10, 40% discount)
- 4 premium voices per meditation

### Payment Flow
1. User visits `/meditations/[slug]`
2. Clicks "Buy Now"
3. POST to `/api/checkout/meditation`
4. Redirects to Stripe
5. After payment: `/meditations/[slug]?session_id=...&unlock=true`
6. Client verifies unlock via `/api/meditation/unlock`
7. Stores unlock in localStorage
8. Shows meditation player

### Reference Files
- **Data:** `/lib/meditations-data.ts`
- **Unlock Logic:** `/lib/meditation-unlock.ts`
- **Checkout:** `/app/api/checkout/meditation/route.ts`
- **Verification:** `/app/api/meditation/unlock/route.ts`
- **UI Gate:** `/components/meditation-unlock-gate.tsx`

---

## 4. EMAIL INTEGRATION ANALYSIS

### Current Status
- **Email Service:** Resend (configured via `RESEND_API_KEY`)
- **Use Cases:** Order confirmations, admin notifications
- **Newsletter:** Placeholder UI exists, not fully implemented

### Gaps to Fill
- Newsletter subscription API
- Email sequences (welcome, recommendations, abandoned cart)
- Email templates
- Resend contact/audience management

---

## 5. BLOG POST STRUCTURE

### Example: Gemini 3 Blog Post
**File:** `/app/blog/gemini-3-interactive-experiences/page.tsx`

Structure:
- Release badge
- Hero title + subtitle
- Capabilities grid
- Use cases narrative
- Pricing section
- Getting started guide
- Example prompts (code blocks)
- CTA buttons
- Share section

### Blog-to-Product Linking
Blog post → CTA → Experience gallery or specific experience

---

## 7. IMPLEMENTATION ROADMAP

### Phase 1: Gemini Experience Pipeline (Week 1)

**Files to Create:**
1. `/app/api/gemini/generate/route.ts` - Generation API
2. `/lib/db/types.ts` - Experience schema
3. `/app/experiences/page.tsx` - Gallery
4. `/app/experiences/[slug]/page.tsx` - Detail page
5. `/app/creator-studio/generate/page.tsx` - Generation dashboard

**Key Functionality:**
- Accept prompt + experience type
- Prepend luxury design system
- Call Google AI/Vertex AI API
- Store in Vercel Blob
- Return experience URL

### Phase 2: Monetization Layer (Week 2)

**Files to Create:**
1. `/app/api/checkout/experience/route.ts` - Checkout
2. `/app/api/experience/unlock/route.ts` - Unlock verification
3. `/lib/experience-unlock.ts` - Unlock helpers
4. `/components/experience-unlock-gate.tsx` - Payment gate UI
5. Update `/app/api/stripe/webhook/route.ts` - Handle experiences

**Key Functionality:**
- Stripe integration (reuse meditation pattern)
- Experience bundles (5 for $25 → $15)
- Unlock gate component
- Server-side price validation

### Phase 3: Content Creation Features (Week 3)

**Files to Create:**
1. `/app/creator-studio/experiences/[id]/edit/page.tsx` - Publish form
2. `/app/experiences/[slug]/embed/page.tsx` - Embed version
3. `/components/experience-share-modal.tsx` - Share options
4. `/app/creator-studio/page.tsx` - Creator dashboard

**Key Functionality:**
- Edit title, description, tags, price
- Embed code generation
- Share on social media
- Analytics dashboard

### Phase 4: Blog Integration & Lead Capture (Week 4)

**Files to Create:**
1. Update `/app/blog/[slug]/page.tsx` - Add experience embeds
2. `/components/experience-lead-modal.tsx` - Email capture
3. `/lib/email-sequences.ts` - Automated emails
4. `/lib/email-templates/` - Email HTML templates
5. Update `/lib/email.ts` - Resend integration

**Key Functionality:**
- Embed experiences in blog posts
- Lead capture modal (triggered on first free view)
- Welcome sequence (3 emails)
- Recommendations sequence
- Abandoned cart sequence

---

## 8. DATABASE SCHEMA (If Using Postgres)

### experiences table

```sql
CREATE TABLE experiences (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  experience_type TEXT NOT NULL,
  prompt TEXT NOT NULL,
  generated_code TEXT NOT NULL,
  blob_url TEXT NOT NULL,
  thumbnail_url TEXT,
  embed_code TEXT,
  category TEXT NOT NULL,
  tags TEXT[],
  is_published BOOLEAN DEFAULT false,
  is_paid BOOLEAN DEFAULT false,
  price DECIMAL(10, 2),
  license_type TEXT DEFAULT 'free',
  views INT DEFAULT 0,
  likes INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  published_at TIMESTAMP
);
```

### experience_bundles table

```sql
CREATE TABLE experience_bundles (
  id TEXT PRIMARY KEY,
  creator_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  original_value DECIMAL(10, 2) NOT NULL,
  experience_ids TEXT[] NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### email_subscriptions table

```sql
CREATE TABLE email_subscriptions (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  status TEXT DEFAULT 'subscribed',
  preferences JSONB,
  resend_contact_id TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 9. FILE STRUCTURE

```
/app/
├── /experiences/                      [NEW]
│   ├── page.tsx                       # Gallery
│   ├── [slug]/page.tsx                # Detail page
│   ├── [slug]/embed/page.tsx          # Embed version
│   └── [slug]/success/page.tsx        # Post-unlock success
├── /creator-studio/                   [NEW]
│   ├── page.tsx                       # Dashboard
│   ├── /generate/page.tsx             # Generation
│   ├── /experiences/[id]/edit/page.tsx # Publish
│   └── /settings/page.tsx             # Profile
├── /api/
│   ├── /gemini/generate/route.ts      [NEW]
│   ├── /checkout/
│   │   ├── experience/route.ts        [NEW]
│   │   └── experience-bundle/route.ts [NEW]
│   ├── /experience/unlock/route.ts    [NEW]
│   └── /stripe/webhook/route.ts       [UPDATED]
└── /blog/[slug]/page.tsx              [UPDATED]

/lib/
├── experience-unlock.ts               [NEW]
├── experience-db.ts                   [NEW]
├── email-sequences.ts                 [NEW]
├── email-templates/                   [NEW]
└── email.ts                           [UPDATED]

/components/
├── experience-unlock-gate.tsx         [NEW]
├── experience-lead-modal.tsx          [NEW]
├── experience-share-modal.tsx         [NEW]
└── experience-embed.tsx               [NEW]
```

---

## 10. ENVIRONMENT VARIABLES

```bash
# Google AI / Gemini 3 API
GOOGLE_AI_API_KEY=AIzaSy...
GOOGLE_AI_PROJECT_ID=your-project-id

# Stripe (existing, ensure populated)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Resend (existing)
RESEND_API_KEY=re_...

# Vercel Blob (existing)
BLOB_READ_WRITE_TOKEN=vercel_blob_...

# Database (if using Postgres)
POSTGRES_URL=postgres://...
```

---

## 11. CRITICAL IMPLEMENTATION NOTES

### Security
1. **Never trust client prices** - Always validate on server
2. **Prompt injection prevention** - Sanitize all user input before calling Gemini
3. **Payment security** - Use Stripe webhook as source of truth
4. **Content rights** - Track license type and creator permissions

### Luxury Brand Consistency
- Color: Black (#000000), Gold (#C9A050), White
- Typography: Serif headings, sans-serif UI
- Spacing: Generous white space
- Animations: 300-700ms cinematic easing

### Pattern Reuse
Reference meditation implementation for:
- Payment flow (use same Stripe patterns)
- Unlock system (same localStorage + server verification)
- UI components (similar gate/offer components)
- Email integration (same Resend patterns)

---

## 12. SUCCESS METRICS

| Phase | Metric | Target |
|-------|--------|--------|
| **Phase 1** | Experiences generated & stored | 5+ test |
| **Phase 2** | Paid experiences revenue | $100+ |
| **Phase 3** | Creator dashboard DAU | 5+ |
| **Phase 4** | Newsletter subscribers | 50+ |
| **Month 4** | Monthly revenue | $2,000+ |

---

## 13. NEXT STEPS FOR DEVELOPER

1. **Understand Current System** (1 hour)
   - Read meditation implementation
   - Study meditation-unlock.ts
   - Trace Stripe flow

2. **Set Up Environment** (30 min)
   - Get Google AI credentials
   - Add env variables
   - Test Gemini API

3. **Build Phase 1** (40 hours)
   - Gemini generation API
   - Experience storage
   - Gallery pages
   - Dashboard

4. **Build Phases 2-4** (50 hours)
   - Monetization (20h)
   - Creator tools (15h)
   - Blog integration & email (15h)

**Total: 12 weeks, ~130 hours of focused development**

---

## Absolute File Paths Reference

**Existing Core Files:**
- `/Volumes/Super Mastery/Webdesigner/app/lab/gemini-3d/page.tsx` - Gemini lab
- `/Volumes/Super Mastery/Webdesigner/lib/meditations-data.ts` - Meditation products
- `/Volumes/Super Mastery/Webdesigner/lib/meditation-unlock.ts` - Unlock pattern
- `/Volumes/Super Mastery/Webdesigner/app/api/checkout/meditation/route.ts` - Checkout pattern
- `/Volumes/Super Mastery/Webdesigner/app/api/stripe/webhook/route.ts` - Webhook pattern
- `/Volumes/Super Mastery/Webdesigner/lib/email.ts` - Email service
- `/Volumes/Super Mastery/Webdesigner/app/meditations/[slug]/page.tsx` - Product detail pattern
- `/Volumes/Super Mastery/Webdesigner/app/blog/gemini-3-interactive-experiences/page.tsx` - Blog post example

**Tech Stack Source:**
- `/Volumes/Super Mastery/Webdesigner/package.json` - Dependencies
- `/Volumes/Super Mastery/Webdesigner/.env.example` - Environment variables
