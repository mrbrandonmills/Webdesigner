# CRITICAL FIXES REQUIRED - Priority Actions
**Generated:** November 16, 2025
**Status:** 🔴 BLOCKING PRODUCTION

---

## Quick Fix Checklist

- [ ] Fix book-reader.tsx undefined variables (5 min)
- [ ] Install or remove Cartesia dependency (5 min)
- [ ] Add hero video or fallback (1 hour)
- [ ] Create book unlock API route (2 hours)
- [ ] Fix logo navigation link (1 min)
- [ ] Fix AM Reed date error (1 min)

**Total Estimated Time:** 3-4 hours

---

## CRITICAL FIX #1: Book Reader Component (5 minutes)

**File:** `/Volumes/Super Mastery/Webdesigner/components/book-reader.tsx`

**Action:** Delete line 82

```typescript
// ❌ REMOVE THIS LINE:
const displayElements = isUnlocked ? fullElements : teaserElements
```

**Why:** These variables don't exist. The component already works correctly using `displayHtml` state.

**Verify:**
```bash
npm run type-check
# Should pass without errors
```

---

## CRITICAL FIX #2: Cartesia Dependency (5 minutes)

**File:** `/Volumes/Super Mastery/Webdesigner/app/api/text-to-speech/route.ts`

**Option A - Install Package:**
```bash
npm install @cartesia/cartesia-js
```

**Option B - Remove TTS Route (if not using):**
```bash
# Comment out or delete the entire file
# app/api/text-to-speech/route.ts
```

**Verify:**
```bash
npm run type-check
# Should pass without errors
```

---

## CRITICAL FIX #3: Hero Video (1 hour)

**File:** `/Volumes/Super Mastery/Webdesigner/components/home/hero-video.tsx`

**Problem:** Video file missing at `/public/videos/hero-loop.mp4`

**Option A - Add Video:**
1. Place hero video at `/public/videos/hero-loop.mp4`
2. Video should be:
   - Format: MP4 (H.264)
   - Resolution: 1920x1080 or higher
   - Duration: 10-30 seconds loop
   - File size: Under 10MB if possible

**Option B - Use Static Hero (Quick Fix):**

Replace hero-video.tsx content with static version:

```typescript
'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

export default function HeroVideo() {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Static Background Image */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-900 to-black" />

      {/* Or use an actual image: */}
      {/* <Image
        src="/images/hero-background.jpg"
        alt="Brandon Mills"
        fill
        className="object-cover"
        priority
      /> */}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />

      {/* Content - same as before */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center container-wide text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="space-y-8"
        >
          <motion.p className="text-sm md:text-base tracking-[0.3em] uppercase text-accent-gold font-light">
            Renaissance Man — Modern Era
          </motion.p>

          <h1 className="text-6xl md:text-8xl lg:text-9xl font-light font-serif leading-none text-white">
            Brandon Mills
          </h1>

          <div className="w-24 h-px bg-gradient-to-r from-transparent via-accent-gold to-transparent mx-auto" />

          <p className="text-xl md:text-2xl lg:text-3xl font-light text-white/90 max-w-3xl leading-relaxed">
            Model · Author · AI Architect · Visual Artist
          </p>

          <motion.div className="pt-8">
            <a
              href="#collections"
              className="inline-flex items-center gap-3 px-10 py-5 bg-accent-gold text-black font-medium tracking-wider uppercase hover:bg-accent-hover transition-all duration-300"
            >
              Explore Collections
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
```

**Verify:**
Visit home page - hero section should display properly.

---

## HIGH PRIORITY FIX #1: Logo Navigation (1 minute)

**File:** `/Volumes/Super Mastery/Webdesigner/components/navigation.tsx`

**Line 47 - Change:**
```typescript
// ❌ BEFORE:
<Link href="/gallery" ...>

// ✅ AFTER:
<Link href="/" ...>
```

**Full Fix:**
```typescript
<Link
  href="/"  // Changed from "/gallery"
  className="text-white text-xl md:text-2xl font-light tracking-[0.2em] hover:text-white/80 transition-colors font-serif"
>
  BRANDON MILLS
</Link>
```

**Verify:**
Click logo from any page - should return to home.

---

## HIGH PRIORITY FIX #2: AM Reed Date (1 minute)

**File:** `/Volumes/Super Mastery/Webdesigner/app/gallery/collaborations/am-reed/page.tsx`

**Line 189 - Change:**
```typescript
// ❌ BEFORE:
August 2025 — Los Angeles

// ✅ AFTER:
August 2024 — Los Angeles
```

**Line 210 - Change:**
```typescript
// ❌ BEFORE:
This August 2025 session south of Los Angeles...

// ✅ AFTER:
This August 2024 session south of Los Angeles...
```

---

## MEDIUM PRIORITY: Book Unlock API (2 hours)

**File:** Create `/Volumes/Super Mastery/Webdesigner/app/api/books/unlock/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
})

export async function POST(request: NextRequest) {
  try {
    const { bookId, title, price } = await request.json()

    if (!bookId || !title || !price) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: title,
              description: `Digital book access - ${title}`,
            },
            unit_amount: price * 100, // Convert dollars to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/writing/books/${bookId}?unlocked=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/writing/books/${bookId}`,
      metadata: {
        bookId,
        type: 'book-unlock',
      },
    })

    return NextResponse.json({ checkoutUrl: session.url })
  } catch (error) {
    console.error('Book unlock error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
```

**Environment Variables Required:**
Add to `.env.local`:
```bash
STRIPE_SECRET_KEY=sk_test_... # Your Stripe secret key
NEXT_PUBLIC_BASE_URL=http://localhost:3003 # Or production URL
```

**Verify:**
1. Visit `/writing/books/block-b`
2. Click "Unlock for $5"
3. Should redirect to Stripe checkout
4. Complete test purchase
5. Redirect back with unlock status

---

## MEDIUM PRIORITY: Contact Form Backend (1 hour)

**File:** Create `/Volumes/Super Mastery/Webdesigner/app/api/contact/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json()

    // Send email via Resend
    await resend.emails.send({
      from: 'contact@brandonmills.com', // Update with your domain
      to: 'brandon@brandonmills.com', // Your email
      replyTo: email,
      subject: `Contact Form: ${subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>From:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <hr />
        <p>${message.replace(/\n/g, '<br />')}</p>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}
```

**Update contact page:** `/app/contact/page.tsx`

```typescript
// Line 15 - Replace handleSubmit function:
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()

  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })

    if (response.ok) {
      setSubmitted(true)
      setFormData({ name: '', email: '', subject: '', message: '' })
      setTimeout(() => setSubmitted(false), 5000)
    } else {
      alert('Failed to send message. Please try again.')
    }
  } catch (error) {
    console.error('Error:', error)
    alert('Failed to send message. Please try again.')
  }
}
```

**Environment Variables:**
Add to `.env.local`:
```bash
RESEND_API_KEY=re_... # Your Resend API key
```

---

## Testing Checklist After Fixes

### TypeScript Build
```bash
npm run type-check
# Expected: ✓ No errors
```

### Development Server
```bash
npm run dev
# Expected: Runs without errors on port 3003
```

### Production Build
```bash
npm run build
# Expected: Builds successfully
```

### Manual Testing
- [ ] Home page loads with hero (video or static)
- [ ] Logo click returns to home
- [ ] Navigate to `/writing/books/block-c`
- [ ] Book reader displays without errors
- [ ] Click "Unlock" button - Stripe checkout loads
- [ ] Gallery AM Reed page shows "August 2024"
- [ ] Contact form sends email successfully

---

## Notes for Developer

**Why These Are Critical:**

1. **Book Reader Bug** - TypeScript compilation fails, blocks production build
2. **Cartesia Import** - TypeScript error, blocks production build
3. **Hero Video** - First impression on home page is broken
4. **Book Unlock API** - Core monetization feature doesn't work
5. **Logo Navigation** - Breaks universal web UX pattern
6. **Date Error** - Factual mistake damages credibility

**Safe to Deploy After:**
All 3 CRITICAL fixes are complete. The site will function but with reduced features (no book unlocking, no contact form).

**Fully Functional After:**
All CRITICAL + HIGH + MEDIUM priority fixes are complete.

---

**Questions or Issues?**
Check the full QA audit report at:
`/ai-management/bug-records/QA-AUDIT-2025-11-16.md`
