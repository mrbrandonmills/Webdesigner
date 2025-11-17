# QUICK FIX GUIDE: Page Loading Flash/Lag

**Issue:** Pages flash/pause when navigating - feels laggy
**Root Cause:** 500ms page fade-in animation creates visible "half-loaded" state
**Priority:** HIGH (Brand Experience Impact)

---

## Immediate Fix (5 minutes)

### Fix 1: Reduce PageTransition Animation Duration
**File:** `/Volumes/Super Mastery/Webdesigner/components/page-transition.tsx`

**Change line 18:**
```tsx
// BEFORE:
duration: 0.5,

// AFTER:
duration: 0.15,
```

**Expected Result:** 70% reduction in perceived lag

---

### Fix 2: Change AnimatePresence Mode
**File:** `/Volumes/Super Mastery/Webdesigner/components/page-transition.tsx`

**Change line 11:**
```tsx
// BEFORE:
<AnimatePresence mode="wait">

// AFTER:
<AnimatePresence mode="sync">
```

**Expected Result:** Eliminates sequential animation delays

---

## Complete Fixed Component

Replace entire `/Volumes/Super Mastery/Webdesigner/components/page-transition.tsx` with:

```tsx
'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  return (
    <AnimatePresence mode="sync">
      <motion.div
        key={pathname}
        initial={{ opacity: 0.3 }}      // Subtle fade instead of invisible
        animate={{ opacity: 1 }}
        exit={{ opacity: 0.3 }}
        transition={{
          duration: 0.15,                // Fast, imperceptible
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
```

---

## Testing After Fix

1. **Restart development server:**
   ```bash
   npm run dev
   ```

2. **Test navigation:**
   - Click between Gallery, Work, About, Contact
   - Should feel instant and snappy
   - No visible "half-loaded" pause

3. **Test on slow network:**
   - Open Chrome DevTools
   - Network tab → Throttle to "Slow 3G"
   - Navigation should still feel responsive

---

## Additional Optimizations (If Still Not Perfect)

### Option A: Remove PageTransition Entirely
If the flash persists, consider removing the PageTransition wrapper completely and letting individual pages control their animations.

**File:** `/Volumes/Super Mastery/Webdesigner/app/layout.tsx`

```tsx
// BEFORE:
<PageTransition>
  <main className="min-h-screen">
    {children}
  </main>
</PageTransition>

// AFTER:
<main className="min-h-screen">
  {children}
</main>
```

### Option B: Optimize Images (High Impact)
Replace `<img>` with Next.js Image component throughout the site.

**Example - Gallery page:**
**File:** `/Volumes/Super Mastery/Webdesigner/app/gallery/page.tsx`

```tsx
// BEFORE:
<img
  src="/images/collaborations/andrew-gerard-vancouver/image-01.jpg"
  alt="Genesis Archive"
  className="w-full h-full object-cover"
/>

// AFTER:
import Image from 'next/image'

<Image
  src="/images/collaborations/andrew-gerard-vancouver/image-01.jpg"
  alt="Genesis Archive"
  width={800}
  height={1200}
  priority={true}
  className="w-full h-full object-cover"
/>
```

---

## Expected Performance Improvement

| Metric | Before | After |
|--------|--------|-------|
| Page transition time | 1000ms | <150ms |
| User perception | Laggy, half-loaded | Instant, polished |
| Brand experience | Undermined | Premium luxury |

---

## Questions?

Refer to full analysis: `/Volumes/Super Mastery/Webdesigner/ai-management/bug-records/2025-11-16-page-loading-flash-lag.md`
