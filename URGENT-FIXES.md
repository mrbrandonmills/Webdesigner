# 🚨 URGENT FIXES FOR BRANDONMILLS.COM

## Issue #1: STORE IS EMPTY ❌ (CRITICAL)

**Problem:** Printful API key is invalid
**Symptom:** Store page shows no products
**Error:** `401 Unauthorized - The access token provided is invalid`

### FIX (5 minutes):

**1. Generate New Printful API Key:**
- Go to: https://www.printful.com/dashboard/store
- Click your store → Settings → API
- **Revoke** old token (security best practice)
- Click "Generate New API Token"
- Name: "Production Site Nov 2025"
- **COPY THE KEY** immediately

**2. Update Vercel:**
- Go to: https://vercel.com/mrbrandonmills/webdesigner/settings/environment-variables
- Find `PRINTFUL_API_KEY`
- Click "Edit" → Paste NEW key → Save

**3. Redeploy:**
- Go to: https://vercel.com/mrbrandonmills/webdesigner
- Deployments tab → Latest deployment
- Click "..." → "Redeploy"

**4. Wait 2-3 minutes, then test:**
- Visit: https://brandonmills.com/store
- **Should show products!**

---

## Issue #2: GLITCHY ANIMATIONS ON LOAD ⚠️

**Problem:** Animations feel janky during initial page load
**Cause:** JavaScript/fonts loading

### FIX A: Quick Browser Fix (Immediate):
```
Hard refresh the page:
- Mac: Cmd + Shift + R
- Windows: Ctrl + Shift + R
- Or: Clear browser cache
```

### FIX B: Optimize Loading (5 minutes):

**Add to `/app/layout.tsx` (line ~15):**
```typescript
// Add font display swap for faster loading
import { Playfair_Display } from 'next/font/google'

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap', // ← ADD THIS
  variable: '--font-playfair'
})
```

**This ensures fonts don't block page render.**

### FIX C: Reduce Motion Sensitivity:

**Add to `/app/globals.css` (at bottom):**
```css
/* Reduce animation on slow connections */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Issue #3: "PHOTOGRAPHY PORTFOLIO" BUTTON ❓

**Status:** Need more info

**Please provide:**
1. Which page? (Homepage, Gallery, Store, etc.)
2. Exact location? (Navigation, Hero, Footer, etc.)
3. Screenshot if possible

**Temporary check:**
- Search code: `grep -ri "photography.*portfolio" . --include="*.tsx"`
- Check: `/components/navigation.tsx`
- Check: `/components/gallery/hero.tsx`
- Check: `/app/page.tsx`

---

## Issue #4: SITE LOOKS MOSTLY THE SAME 🤔

**Possible causes:**

### A. Browser Cache
**Fix:**
- Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
- Clear cache and hard reload
- Try incognito/private mode

### B. Vercel Deployment Issue
**Check:**
1. Go to: https://vercel.com/mrbrandonmills/webdesigner/deployments
2. Latest deployment should show:
   - Status: "Ready" (green checkmark)
   - Build time: ~2-3 minutes
   - Functions: 43 compiled

**If deployment failed:**
- Click deployment → View logs
- Look for errors
- Most common: Environment variable missing

### C. Features May Not Be Visible on All Pages

**Luxury features are on specific pages:**

**Homepage/Gallery:**
- Floating gradient orbs ✅
- Custom cursor (desktop only) ✅
- Parallax scrolling ✅

**Store Page:**
- Premium product cards ✅
- Enhanced cart ✅
- But needs products (see Issue #1)

**Navigation:**
- Glassmorphism blur when scrolled ✅
- Smooth transitions ✅

**To see ALL features:**
1. Visit: https://brandonmills.com/gallery
2. Move mouse (desktop) - should see custom cursor
3. Scroll down - parallax effects
4. Look for floating orbs in background

---

## 🎯 PRIORITY ORDER:

**Do this first:**
1. ✅ Fix Printful API key (Issue #1) - **CRITICAL**
2. ✅ Hard refresh browser (Issue #4)
3. ✅ Locate unwanted button (Issue #3)
4. ⏸️ Optimize animations (Issue #2) - Can wait

---

## 📊 VERIFICATION CHECKLIST:

After fixing Printful API:

**Store Page:**
- [ ] Visit https://brandonmills.com/store
- [ ] Should see product grid with images
- [ ] Products have prices
- [ ] Can click product to see details
- [ ] Can add to cart
- [ ] Cart counter updates

**Homepage:**
- [ ] Visit https://brandonmills.com
- [ ] See floating gradient orbs (subtle gold/white)
- [ ] Custom cursor appears (desktop - move mouse)
- [ ] Scroll down - content parallaxes
- [ ] Navigation blurs when scrolling

**Checkout Flow:**
- [ ] Add product to cart
- [ ] Open cart (shopping bag icon)
- [ ] Apply promo: WELCOME10
- [ ] See 10% discount
- [ ] Click checkout
- [ ] Redirects to Stripe
- [ ] Stripe page loads (with test card: 4242 4242 4242 4242)

---

## 🆘 IF STORE STILL EMPTY AFTER FIX:

**Check Vercel Logs:**
1. https://vercel.com/mrbrandonmills/webdesigner
2. Click latest deployment
3. Click "View Function Logs"
4. Look for errors in `/api/store/products`

**Common errors:**
- `401` = API key still wrong
- `403` = API key doesn't have permission
- `429` = Rate limited (wait 1 minute)
- `500` = Server error (check logs)

**Test API directly:**
```bash
curl https://brandonmills.com/api/store/products
```

Should return JSON with products array.

---

## 💡 QUICK WINS:

While waiting for Printful fix, test these features:

**1. Admin Panel:**
- https://brandonmills.com/admin/login
- Username: Bmilly23
- Password: 23458023
- Should see dashboard

**2. Affiliate Disclosure:**
- https://brandonmills.com/affiliate-disclosure
- Should see FTC-compliant disclosure

**3. Collection Pages:**
- https://brandonmills.com/collections/gallery-prints
- Should see collection layout (even without products)

**4. Security:**
- Visit: https://brandonmills.com/api/admin/orders (logged out)
- Should return: `{"error":"Unauthorized"}`
- This proves security is working! ✅

---

## 📞 NEXT STEPS:

1. **Fix Printful API** (follow Issue #1 steps)
2. **Screenshot the unwanted button** (so I can find and remove it)
3. **Hard refresh browser** (Cmd+Shift+R)
4. **Check Vercel deployment status**
5. **Test store page** (should show products after steps 1-4)

---

**Once Printful is fixed, your store will have products and everything will work!**

The empty store is the main issue blocking everything else.
