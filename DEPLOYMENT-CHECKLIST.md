# 🚀 DEPLOYMENT CHECKLIST

## Launch Your Luxury E-Commerce Platform in 3 Hours

---

## ✅ PRE-DEPLOYMENT (30 minutes)

### Step 1: Install Dependencies
```bash
cd /Users/brandon/Webdesigner
npm install
```

**Verify these were installed:**
- ✅ bcryptjs (password hashing)
- ✅ zod (input validation)
- ✅ @vercel/postgres (database)
- ✅ framer-motion (animations)

---

### Step 2: Generate Admin Password

```bash
# Generate secure password hash
node scripts/generate-password-hash.js YourSecurePassword123!

# Copy the output hash - you'll need it for .env.local
```

**Save this somewhere safe!**

---

### Step 3: Create Environment Variables

Create `/Users/brandon/Webdesigner/.env.local`:

```bash
# ===================================
# REQUIRED FOR LAUNCH
# ===================================

# Admin Authentication
ADMIN_USERNAME=brandon_admin
ADMIN_PASSWORD_HASH=<paste_hash_from_step_2>

# Printful (Get from: https://www.printful.com/dashboard/store)
PRINTFUL_API_KEY=your_real_printful_api_key_here
PRINTFUL_STORE_ID=your_store_id_here

# Stripe (Get from: https://dashboard.stripe.com/apikeys)
STRIPE_SECRET_KEY=sk_test_... # Use sk_live_ for production
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_... # Use pk_live_ for production

# Stripe Webhooks (Get from: https://dashboard.stripe.com/webhooks)
STRIPE_WEBHOOK_SECRET=whsec_...

# Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000 # Change to your domain in production

# ===================================
# OPTIONAL (But Recommended)
# ===================================

# OpenAI (for AI product generation)
OPENAI_API_KEY=sk-...

# Webflow (for portfolio content)
WEBFLOW_API_TOKEN=...
WEBFLOW_COLLECTION_ID=...

# Database (Vercel Postgres - set up later)
POSTGRES_URL=postgres://...
POSTGRES_PRISMA_URL=postgres://...
POSTGRES_URL_NON_POOLING=postgres://...
USE_DATABASE=false # Change to true after database setup
```

**Critical: Never commit `.env.local` to git!**

---

## ✅ LOCAL TESTING (20 minutes)

### Step 4: Build the Project

```bash
npm run build
```

**Expected output:**
- ✅ Build completes in ~24 seconds
- ✅ Zero TypeScript errors
- ✅ No critical warnings

**If build fails:**
- Check error message
- Verify all dependencies installed
- Ensure Node.js version >= 18

---

### Step 5: Start Development Server

```bash
npm run dev
```

**Test these URLs:**
- ✅ Homepage: http://localhost:3000
- ✅ Gallery: http://localhost:3000/gallery
- ✅ Store: http://localhost:3000/store
- ✅ Admin Login: http://localhost:3000/admin/login

---

### Step 6: Test Core Features

**Admin Panel:**
1. Go to http://localhost:3000/admin/login
2. Login with your credentials
3. Verify dashboard loads
4. Check orders page works

**Shopping Cart:**
1. Browse products on /store
2. Add item to cart
3. Update quantity
4. Apply promo code: `WELCOME10`
5. Verify 10% discount applied

**Security:**
1. Try accessing `/api/admin/orders` without login
2. Should return 401 Unauthorized ✅
3. Login and try again
4. Should return 200 OK ✅

---

## ✅ VERCEL SETUP (15 minutes)

### Step 7: Create Vercel Project

**Option A: GitHub Integration (Recommended)**
```bash
# Push to GitHub
git add .
git commit -m "Production ready - luxury e-commerce platform"
git push origin main

# Then:
# 1. Go to https://vercel.com
# 2. Click "Import Project"
# 3. Connect GitHub repository
# 4. Vercel auto-detects Next.js
# 5. Click "Deploy"
```

**Option B: Vercel CLI**
```bash
npm install -g vercel
vercel login
vercel
```

---

### Step 8: Configure Vercel Environment Variables

**Go to:** https://vercel.com/[your-project]/settings/environment-variables

**Add ALL variables from your `.env.local`:**

| Variable | Value | Environment |
|----------|-------|-------------|
| `ADMIN_USERNAME` | your_username | Production |
| `ADMIN_PASSWORD_HASH` | $2a$12$... | Production |
| `PRINTFUL_API_KEY` | your_key | Production |
| `PRINTFUL_STORE_ID` | your_id | Production |
| `STRIPE_SECRET_KEY` | sk_live_... | Production |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | pk_live_... | Production, Preview, Development |
| `STRIPE_WEBHOOK_SECRET` | whsec_... | Production |
| `NEXT_PUBLIC_BASE_URL` | https://yourdomain.com | Production |

**Important:**
- Use `sk_live_` and `pk_live_` for production (NOT test keys!)
- Public keys (`NEXT_PUBLIC_*`) need to be in all environments
- Save after each variable

---

### Step 9: Set Up Stripe Webhook

**Configure webhook endpoint:**
1. Go to: https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. Endpoint URL: `https://yourdomain.com/api/stripe/webhook`
4. Select events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
5. Click "Add endpoint"
6. Copy "Signing secret" (starts with `whsec_`)
7. Add to Vercel environment variables as `STRIPE_WEBHOOK_SECRET`

---

## ✅ DATABASE SETUP (30 minutes) - OPTIONAL BUT RECOMMENDED

### Step 10: Create Vercel Postgres Database

**In Vercel Dashboard:**
1. Go to your project
2. Click "Storage" tab
3. Click "Create Database"
4. Select "Postgres"
5. Choose region (same as your app)
6. Click "Create"

**Connect to your project:**
1. After creation, click "Connect"
2. Copy all environment variables
3. Add to Vercel (auto-populates)

---

### Step 11: Run Database Migration

```bash
# Pull environment variables locally
vercel env pull .env.local

# Run migration script
npx tsx lib/db/migrations/run-migration.ts

# Import existing orders (if any)
npx tsx scripts/migrate-orders-to-db.ts
```

**Enable database in Vercel:**
1. Go to environment variables
2. Add: `USE_DATABASE=true`
3. Redeploy application

---

## ✅ PRODUCTION DEPLOYMENT (5 minutes)

### Step 12: Deploy to Production

**If using GitHub:**
- Just push to main branch
- Vercel auto-deploys
- Wait ~2 minutes

**If using CLI:**
```bash
vercel --prod
```

**Verify deployment:**
- ✅ Build succeeds
- ✅ No errors in function logs
- ✅ Site loads at your domain

---

### Step 13: Smoke Test Production

**Test these critical flows:**

1. **Homepage loads**
   - Visit https://yourdomain.com
   - Check animations work
   - Verify images load

2. **Store works**
   - Browse products
   - Product images load from Printful
   - Cart functionality

3. **Admin access**
   - Login at https://yourdomain.com/admin/login
   - Verify dashboard works
   - Check orders page

4. **Checkout (DO NOT COMPLETE)**
   - Add test item to cart
   - Proceed to checkout
   - Verify Stripe checkout loads
   - **DO NOT ENTER REAL CARD**
   - Use test card: `4242 4242 4242 4242`

---

## ✅ POST-DEPLOYMENT (1 hour)

### Step 14: Configure Domain (Optional)

**If using custom domain:**
1. Go to Vercel project settings
2. Click "Domains"
3. Add your domain
4. Update DNS records as instructed
5. Wait for propagation (~5 minutes)

**Update environment variables:**
- Change `NEXT_PUBLIC_BASE_URL` to `https://yourdomain.com`
- Redeploy

---

### Step 15: Set Up Analytics

**Google Analytics (Recommended):**
1. Go to https://analytics.google.com
2. Create property for your site
3. Copy measurement ID (G-XXXXXXXXXX)
4. Add to environment variables: `NEXT_PUBLIC_GA_ID`
5. Redeploy

**Vercel Analytics (Built-in):**
1. Already enabled automatically
2. View in Vercel dashboard
3. Track page views, performance

---

### Step 16: Test Real Checkout

**Use Stripe test mode first:**
1. Add product to cart
2. Proceed to checkout
3. Use test card: `4242 4242 4242 4242`
4. Complete checkout
5. Verify order appears in admin panel
6. Check Stripe dashboard for payment

**If successful:**
- Switch to live keys
- Test with real $1 transaction
- Refund immediately
- You're ready for real customers!

---

### Step 17: Set Up Affiliate Accounts

**Run the automation:**
```bash
npm run affiliate:create
```

**Follow the wizard for:**
1. Amazon Associates (2-3 days approval)
2. B&H Photo (instant for Printful customers)
3. ShareASale (3-5 days)
4. Printful Affiliate (instant)

**See:** `docs/affiliate/QUICK_START.md` for details

---

## ✅ LAUNCH PREPARATION (30 minutes)

### Step 18: Content Check

**Customize these:**
- ✅ Brand story in `/content/brand-story.md`
- ✅ Product descriptions
- ✅ About page copy
- ✅ Social media links
- ✅ Contact information

---

### Step 19: Create Business Email

**Set up professional email:**
```
brandon@brandonmills.com (main)
shop@brandonmills.com (store inquiries)
affiliates@brandonmills.com (partnerships)
hello@brandonmills.com (general)
```

**Update in code:**
- Contact form recipient
- Order confirmation "from" address
- Footer email links

---

### Step 20: Social Media Setup

**Create accounts on:**
- Instagram (primary for visual content)
- Pinterest (drives e-commerce traffic)
- TikTok (behind-the-scenes content)
- LinkedIn (professional network)

**Link in website:**
- Update footer social links
- Add social share buttons
- Verify icons work

---

## ✅ FINAL VERIFICATION (15 minutes)

### Step 21: Pre-Launch Checklist

**Security:**
- ✅ Admin login works
- ✅ API routes protected
- ✅ No hardcoded credentials
- ✅ HTTPS enabled
- ✅ Environment variables secure

**Functionality:**
- ✅ All pages load
- ✅ Products display correctly
- ✅ Cart works
- ✅ Checkout creates Stripe session
- ✅ Admin panel accessible
- ✅ Mobile responsive

**Content:**
- ✅ Brand story customized
- ✅ Product descriptions complete
- ✅ Contact info correct
- ✅ Social links work
- ✅ Legal pages (privacy, terms)

**Performance:**
- ✅ Images optimized
- ✅ Page load < 3 seconds
- ✅ No console errors
- ✅ Animations smooth

---

### Step 22: Soft Launch

**Before announcing:**
1. Test on real devices (iPhone, Android)
2. Share with 5-10 friends for feedback
3. Process 1-2 test orders
4. Verify email notifications
5. Check order fulfillment with Printful

**Fix any issues before public launch.**

---

## ✅ GO LIVE! (5 minutes)

### Step 23: Launch Announcement

**Channels to announce on:**
- 📧 Email list (if you have one)
- 📱 Instagram story + post
- 🐦 Twitter/X announcement
- 💼 LinkedIn update
- 👨‍👩‍👧‍👦 Personal Facebook
- 📌 Pinterest board

**Launch post template:**
```
🎉 Excited to announce the launch of my new photography store!

After months of work, I'm thrilled to share museum-quality fine art prints, limited editions, and exclusive collections.

Every piece is printed on premium materials with a lifetime quality guarantee.

Shop now: [your-domain.com]

#photography #fineart #limitededition
```

---

### Step 24: Monitor First 24 Hours

**Watch for:**
- Traffic spikes (Google Analytics)
- Errors (Vercel Function Logs)
- Orders (Admin dashboard)
- Customer questions (email/social)
- Payment issues (Stripe dashboard)

**Be ready to:**
- Respond to inquiries quickly
- Fix any bugs immediately
- Celebrate first sale! 🎉

---

## 🎯 POST-LAUNCH OPTIMIZATION (Ongoing)

### Week 1:
- ✅ Analyze traffic sources
- ✅ Optimize top-performing pages
- ✅ A/B test pricing
- ✅ Gather customer feedback
- ✅ Fix any reported bugs

### Week 2:
- ✅ Add more products
- ✅ Create first blog post
- ✅ Email marketing campaign
- ✅ Affiliate link optimization
- ✅ Social media content calendar

### Month 1:
- ✅ Review revenue metrics
- ✅ Customer testimonials
- ✅ SEO optimization
- ✅ Paid advertising (if budget)
- ✅ Partnership outreach

---

## 🆘 TROUBLESHOOTING

### Build Errors:
- Check Node.js version (>= 18)
- Delete `.next` folder and rebuild
- Verify all dependencies installed
- Check TypeScript errors

### Deployment Fails:
- Check Vercel function logs
- Verify environment variables set
- Check build command in Vercel
- Review error messages

### Stripe Checkout Not Working:
- Verify API keys are correct (pk_live_, sk_live_)
- Check webhook is configured
- Test with Stripe test mode first
- Review Stripe dashboard logs

### Database Connection Fails:
- Verify Postgres URL is correct
- Check connection pooling settings
- Ensure migration ran successfully
- Try toggling USE_DATABASE flag

### Products Not Loading:
- Check Printful API credentials
- Verify Printful store is active
- Check API rate limits
- Review server logs

---

## 📞 SUPPORT

**Documentation:**
- 📖 Full docs in `/docs/*`
- 🛍️ Store guide: `STORE_DOCUMENTATION.md`
- 💾 Database: `docs/DATABASE_INSTALLATION.md`
- 💰 Affiliates: `docs/affiliate/QUICK_START.md`

**Testing:**
- ✅ Test reports in `/ai-management/bug-records/`
- 🔍 Run tests: Check testing checklist files

**Community:**
- Next.js docs: https://nextjs.org/docs
- Stripe docs: https://stripe.com/docs
- Vercel docs: https://vercel.com/docs

---

## 🎉 CONGRATULATIONS!

You've successfully deployed a **luxury e-commerce platform** that rivals $100k+ designer websites.

**What you accomplished:**
- ✅ Secure, production-ready application
- ✅ Museum-quality design
- ✅ Multiple revenue streams
- ✅ Automated systems
- ✅ Professional infrastructure

**Now focus on:**
- 📸 Creating amazing content
- 🎯 Marketing your brand
- 💰 Making sales
- 📈 Growing your business

**This is just the beginning. You've got this!** 🚀

---

*Deployment Guide Version 1.0*
*Last Updated: 2025-11-05*
*Total Deployment Time: ~3 hours*
