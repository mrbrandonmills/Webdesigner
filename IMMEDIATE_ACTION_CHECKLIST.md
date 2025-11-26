# IMMEDIATE ACTION CHECKLIST
**Brandon Mills Website - Critical Fixes**
**Date**: November 26, 2025

---

## 🔴 CRITICAL - DO THESE NOW (30 minutes)

### ✅ Action 1: Push Git Commit (1 minute)
**Why**: Local main is 1 commit ahead of GitHub
**Impact**: Vercel may not have latest code

```bash
cd "/Volumes/Super Mastery/Webdesigner"
git push origin main
```

**Verify**:
```bash
git status
# Should show: "Your branch is up to date with 'origin/main'"
```

---

### ✅ Action 2: Start Automation (5 minutes)
**Why**: Marketing campaign posts are NOT running (first post missed at 9am today!)
**Impact**: No social media posts going out

```bash
cd "/Volumes/Super Mastery/Webdesigner"
nohup npx tsx scripts/automation/watchdog.ts > logs/watchdog-output.log 2>&1 &
```

**Verify**:
```bash
# Check if running
ps aux | grep watchdog.ts | grep -v grep

# View logs
tail -f logs/watchdog-output.log
# Should see: "🚀 Campaign Daemon started"
```

---

### ✅ Action 3: Update Vercel Environment Variables (10 minutes)
**Why**: Missing critical variables for checkout and store
**Impact**: Payments and product loading may fail

**Steps**:
1. Go to: https://vercel.com/dashboard
2. Select your project: `webdesigner`
3. Click: Settings → Environment Variables
4. Add these variables:

```bash
NEXT_PUBLIC_BASE_URL=https://www.brandonmills.com
STRIPE_SECRET_KEY=<get_from_stripe_dashboard>
PRINTFUL_API_KEY=<get_from_printful>
PRINTFUL_STORE_ID=<get_from_printful>
STRIPE_WEBHOOK_SECRET=<get_from_stripe_webhooks>
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=<get_from_stripe>
```

5. Click "Redeploy" to apply changes

**Get Your Keys**:
- Stripe: https://dashboard.stripe.com/apikeys
- Printful: https://www.printful.com/dashboard/store
- Webhook: https://dashboard.stripe.com/webhooks

**Verify**:
- Wait for Vercel deployment to complete (~2 minutes)
- Visit: https://www.brandonmills.com/shop
- Products should load with images

---

### ✅ Action 4: Test Critical Flows (14 minutes)

**Test 1: Checkout Cancel Page** (2 min)
```bash
# Visit in browser
https://www.brandonmills.com/checkout/cancel
# Should show: Cancel page (NOT 404)
```

**Test 2: Store Products** (3 min)
```bash
# Visit in browser
https://www.brandonmills.com/shop
# Should show: Products with images and prices
```

**Test 3: Full Checkout Flow** (9 min)
1. Go to: https://www.brandonmills.com/shop
2. Click on any product
3. Click "Add to Cart" or "Buy Now"
4. Should redirect to Stripe checkout
5. Use test card: `4242 4242 4242 4242`
6. Enter any future expiry date
7. Complete checkout
8. Should redirect to `/checkout/success`

---

## 🟡 HIGH PRIORITY - DO TODAY (2 hours)

### ✅ Action 5: Deploy to Railway (30 minutes)
**Why**: Local automation stops when computer restarts
**Impact**: Need 24/7 cloud automation

**Steps**:
1. Go to: https://railway.com/project/531789bd-5e77-41ad-aea9-40d74ec491ca
2. Click: "+ New" → "Empty Service"
3. Name it: `campaign-daemon`
4. Settings → Connect GitHub repository
5. Select: `mrbrandonmills/Webdesigner`
6. Build command: `npm install`
7. Start command: `npx tsx scripts/automation/watchdog.ts`
8. Add environment variables (see Railway section below)
9. Click "Deploy"

**Environment Variables for Railway**:
```bash
TWITTER_API_KEY=<from_.env.local>
TWITTER_API_SECRET=<from_.env.local>
TWITTER_ACCESS_TOKEN=<from_.env.local>
TWITTER_ACCESS_SECRET=<from_.env.local>
PINTEREST_ACCESS_TOKEN=<from_.env.local>
PINTEREST_BOARD_ID=926263917051256107
ANTHROPIC_API_KEY=<from_.env.local>
NODE_ENV=production
```

**Verify**:
```bash
railway logs --follow
# Should see: "🚀 Campaign Daemon started"
```

---

### ✅ Action 6: Fix Webflow Portfolio Data (30 minutes)
**Why**: Portfolio shows wrong project names
**Impact**: Visitors see incorrect information

**Steps**:
1. Login to: https://webflow.com
2. Go to CMS → Portfolio Collection
3. Find and edit these items:
   - "Underwear Campaign" → Correct name
   - "TETU Magazine Cover" → Verify category
   - "Global Campaign" → Verify details
4. Fix any duplicates
5. Correct categories (CAMPAIGN vs EDITORIAL)
6. Publish changes

**Reference**: See `FIX_WEBFLOW_PORTFOLIO_DATA.md` for detailed instructions

---

### ✅ Action 7: Configure Rate Limiting (20 minutes)
**Why**: API routes are unprotected
**Impact**: Potential abuse of API endpoints

**Steps**:
1. Sign up: https://console.upstash.com/
2. Create new Redis database
3. Copy REST URL and TOKEN
4. Add to Vercel environment variables:
```bash
UPSTASH_REDIS_REST_URL=<your_url>
UPSTASH_REDIS_REST_TOKEN=<your_token>
```
5. Redeploy Vercel

---

### ✅ Action 8: Remove Tracked .env.jesse (5 minutes)
**Why**: Security risk if contains secrets
**Impact**: Clean up git history

```bash
cd "/Volumes/Super Mastery/Webdesigner"
git rm .env.jesse
echo ".env.jesse" >> .gitignore
git commit -m "security: Remove .env.jesse from tracking"
git push
```

---

### ✅ Action 9: Final Testing (35 minutes)

**Test Suite**:
1. ✅ Automation logs (5 min)
   ```bash
   tail -f logs/watchdog-output.log
   # Verify: Posts are being checked every 5 minutes
   ```

2. ✅ Website homepage (3 min)
   - Visit: https://www.brandonmills.com
   - Check: All sections load
   - Check: Images display correctly

3. ✅ Gallery (5 min)
   - Visit: https://www.brandonmills.com/gallery
   - Visit: https://www.brandonmills.com/gallery/genesis
   - Check: Portfolio items show correct names

4. ✅ Shop (7 min)
   - Visit: https://www.brandonmills.com/shop
   - Check: Products load with images
   - Check: Prices display correctly
   - Test: Add to cart functionality

5. ✅ Checkout flow (10 min)
   - Test full checkout (see Action 4, Test 3)
   - Test cancel flow
   - Verify success and cancel pages work

6. ✅ API health (5 min)
   ```bash
   curl https://www.brandonmills.com/api/integrations/health
   # Should return: {"status":"healthy"}
   ```

---

## 📊 COMPLETION CHECKLIST

Track your progress:

**Critical (30 min)**:
- [ ] Pushed git commit to GitHub
- [ ] Started automation locally
- [ ] Updated Vercel environment variables
- [ ] Tested critical flows

**High Priority (2 hours)**:
- [ ] Deployed to Railway
- [ ] Fixed Webflow portfolio data
- [ ] Configured rate limiting
- [ ] Removed .env.jesse
- [ ] Completed final testing

---

## 🎯 SUCCESS CRITERIA

You'll know everything is working when:

✅ **Git**:
- `git status` shows "up to date with origin/main"

✅ **Automation**:
- `ps aux | grep watchdog` shows running process
- Logs show "Campaign Daemon started"
- Twitter/Pinterest posts appear on schedule

✅ **Website**:
- Shop loads products with images
- Checkout works with test card
- Cancel page displays (no 404)
- Portfolio shows correct project names

✅ **Railway**:
- Dashboard shows service "Running"
- Logs show automation activity
- Health checks passing

---

## 🆘 TROUBLESHOOTING

**If automation won't start**:
```bash
# Check for errors
npx tsx scripts/automation/watchdog.ts
# If it runs without errors, background it with nohup
```

**If Vercel won't redeploy**:
- Go to Deployments tab
- Click "..." on latest deployment
- Click "Redeploy"

**If checkout fails**:
- Verify environment variables are set
- Check Stripe dashboard for errors
- Review browser console for client errors

**If Railway deploy fails**:
- Check build logs in Railway dashboard
- Verify start command is correct
- Ensure environment variables are set

---

## 📞 HELP RESOURCES

**Documentation Files**:
- Full diagnostic: `COMPREHENSIVE_SYSTEM_DIAGNOSTIC_REPORT.md`
- Webflow fix guide: `FIX_WEBFLOW_PORTFOLIO_DATA.md`
- Railway deploy: `RAILWAY_DEPLOYMENT_INSTRUCTIONS.md`
- Automation status: `AUTOMATION_RUNNING.md`

**External Resources**:
- Vercel Docs: https://vercel.com/docs
- Railway Docs: https://docs.railway.app
- Stripe Docs: https://stripe.com/docs
- Printful API: https://www.printful.com/docs

---

**Start Time**: __________
**Completion Time**: __________
**Total Time**: __________

**Notes**:
_____________________________________________
_____________________________________________
_____________________________________________

---

*Generated: November 26, 2025*
*Based on: COMPREHENSIVE_SYSTEM_DIAGNOSTIC_REPORT.md*
