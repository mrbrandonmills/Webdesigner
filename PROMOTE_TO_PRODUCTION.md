# 🚀 Promote Preview to Production

## ⚠️ CRITICAL ISSUE IDENTIFIED

Your **Production** deployment is running **OLD CODE** (rebuild of commit 7oVtManAk)
Your **Preview** deployment has **NEW FIXES** (commit 5471052)

**This is why you're still seeing issues in production!**

---

## ✅ SOLUTION: Promote Preview to Production

### Method 1: Via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**:
   - Navigate to: https://vercel.com/dashboard
   - Select your project

2. **Find the Preview Deployment**:
   - Look for deployment: **7oVtManAk** (Preview, Ready)
   - Branch: **main**
   - Commit: **5471052** - "🔧 Fix Stripe API version for successful build"
   - Status: Ready ✅

3. **Promote to Production**:
   - Click on the Preview deployment (7oVtManAk)
   - Click the **"⋮"** (three dots) menu
   - Select **"Promote to Production"**
   - Confirm the promotion

4. **Verify**:
   - Production should now show commit 5471052
   - URL: https://www.brandonmills.com should have all fixes

---

### Method 2: Force New Production Deployment

If promote doesn't work, trigger a new production deployment:

1. **Via Vercel Dashboard**:
   - Go to your project
   - Click **"Deployments"** tab
   - Click **"Redeploy"** button
   - Select **"Use existing Build Cache"**: NO
   - Click **"Redeploy"**

2. **Via GitHub** (Alternative):
   - Make a small change to trigger deployment
   - Or create an empty commit:
   ```bash
   cd "/Volumes/Super Mastery/Webdesigner"
   git commit --allow-empty -m "chore: Trigger production deployment"
   git push origin main
   ```

---

### Method 3: CLI (If you login first)

```bash
# Login to Vercel
npx vercel login

# Link project
npx vercel link

# Deploy to production
cd "/Volumes/Super Mastery/Webdesigner"
npx vercel --prod
```

---

## 🔍 VERIFY THE DEPLOYMENT

After promoting to production, verify these fixes are live:

### 1. Check Cancel Page (Was 404, Now Should Work)
```bash
curl -I https://www.brandonmills.com/checkout/cancel
# Should return: HTTP/2 200
```

### 2. Check Build Includes Latest Code
- Visit: https://www.brandonmills.com
- Open browser dev tools → Network tab
- Look for any 404 errors on /checkout/cancel

### 3. Verify Stripe API Version
- Try adding product to cart
- Proceed to checkout
- Should not see TypeScript/build errors

---

## 📊 WHAT'S IN EACH DEPLOYMENT

### ❌ OLD Production (HzCjA6bnV - rebuild of 7oVtManAk)
**Missing**:
- ❌ Cancel page fix
- ❌ Stripe API version update
- ❌ Comprehensive testing fixes
- ❌ Environment variable updates

### ✅ NEW Preview (7oVtManAk - commit 5471052)
**Includes**:
- ✅ Cancel page created (/checkout/cancel/page.tsx)
- ✅ Stripe API version updated (2025-10-29.clover)
- ✅ Build compiles successfully
- ✅ All checkout flow improvements

---

## ⚠️ AFTER PROMOTION: STILL NEED ENV VARS

Even after promoting to production, you **MUST** update environment variables:

**Go to**: Vercel Dashboard → Settings → Environment Variables

**Update**:
```
NEXT_PUBLIC_BASE_URL=https://www.brandonmills.com
```

**Verify Set**:
```
PRINTFUL_API_KEY=<your_key>
PRINTFUL_STORE_ID=<your_id>
STRIPE_SECRET_KEY=<your_key>
STRIPE_WEBHOOK_SECRET=<your_secret>
```

Then **redeploy** after updating env vars.

---

## 🎯 STEP-BY-STEP CHECKLIST

- [ ] Go to Vercel dashboard
- [ ] Find Preview deployment (commit 5471052)
- [ ] Promote Preview to Production
- [ ] Wait for deployment to complete
- [ ] Test /checkout/cancel returns 200
- [ ] Update environment variables
- [ ] Trigger final redeploy
- [ ] Test complete checkout flow

---

## 🆘 TROUBLESHOOTING

### If Promote Button Not Visible
- Deployment must be in "Ready" state
- Must have proper permissions
- Try Method 2 (Force Redeploy) instead

### If Builds Keep Using Old Code
- Check **Git Integration** settings
- Verify **Production Branch** is set to `main`
- Clear build cache and redeploy

### If Environment Variables Don't Apply
- Must redeploy after changing env vars
- Check they're set for "Production" environment
- Verify no typos in variable names

---

## 📞 QUICK STEPS (TL;DR)

1. **Vercel Dashboard** → Your Project → Deployments
2. Click Preview deployment (commit 5471052)
3. Click "⋮" menu → **Promote to Production**
4. Wait for deployment
5. Update environment variables
6. Redeploy one more time
7. Test checkout flow

---

**Generated**: November 26, 2025
**Current Production**: Old commit (7oVtManAk rebuild)
**Correct Preview**: Commit 5471052 ✅
**Action**: PROMOTE PREVIEW TO PRODUCTION
