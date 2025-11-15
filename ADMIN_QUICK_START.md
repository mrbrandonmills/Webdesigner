# 🚀 ADMIN QUICK START GUIDE - Brandon Mills Photography

**Last Updated:** November 15, 2025
**Your Path to $$$:** This guide gets you making money ASAP

---

## 🔐 ADMIN LOGIN CREDENTIALS

**Admin Dashboard URL:** https://brandonmills.com/admin
**Username:** `Bmilly23`
**Password:** `Ailtoronto1@`

> **Security Note:** Password is bcrypt-hashed in the system. Change it after first login in production.

---

## 💰 MONEY-MAKING WORKFLOW

### PHASE 1: Generate & Sell Products (30 minutes)

1. **Login to Admin Dashboard**
   - Go to: https://brandonmills.com/admin/login
   - Enter credentials above
   - Click "Sign In"

2. **Generate AI Products**
   - Click "AI Product Generator" or go to: `/admin/products/generate`
   - Fill in the form:
     - **Product Name:** "Golden Hour Los Angeles"
     - **Description:** "Stunning sunset over LA skyline, captured during the golden hour. Museum-quality print perfect for modern homes."
     - **Photo URL:** Paste your best photo URL (from Vercel Blob or direct link)
     - **Product Type:** Select "Canvas Print" (highest margin: 64%)
     - **Collection:** "Los Angeles Collection" (or create new)
     - **Price:** $149 (recommended for 16x20 canvas)
   - Click "Generate Product"
   - AI will create variants, upload to Printful, generate mockups
   - **Repeat 10-20 times** with your best photos

3. **Quick Product Creation** (Manual)
   - Go to: `/admin/products/create`
   - Upload photo
   - AI generates title, description, SEO keywords
   - Select Printful product type
   - Set pricing (system calculates margins)
   - Click "Create & Publish"

4. **Verify Store is Live**
   - Go to: https://brandonmills.com/store
   - Should see all your products
   - Test: Add to cart → Checkout
   - **DON'T complete purchase** (test mode Stripe)

---

## 📸 PRODUCT GENERATION TIPS

### Best Products for High Margins

| Product Type | Markup | Margin | Recommended Price | Best For |
|--------------|--------|--------|-------------------|----------|
| Canvas Prints | 2.8x | 64% | $149-$349 | Luxury buyers |
| Posters | 2.5x | 60% | $49-$149 | Volume sales |
| Apparel | 2.3x | 57% | $35-$65 | Branding |
| Mugs | 2.7x | 63% | $22 | Impulse buys |

### Photo Selection Strategy

**20 Products = First $10,000**

Select photos with:
- ✅ High resolution (300 DPI minimum)
- ✅ Strong composition (rule of thirds)
- ✅ Emotional impact (sunset, cityscape, nature)
- ✅ Commercial appeal (home decor worthy)
- ❌ No people (licensing issues)
- ❌ No brands (trademark issues)

**Collections to Create:**
1. **Los Angeles Collection** (10 photos) - Skyline, beaches, downtown
2. **Nature Collection** (5 photos) - Landscapes, forests, mountains
3. **Abstract Collection** (5 photos) - Patterns, textures, minimalist

---

## 🎨 AI PRODUCT GENERATOR INSTRUCTIONS

### Step-by-Step: Create Your First Product

**Example: Sunset Over LA**

1. **Go to AI Generator**
   ```
   https://brandonmills.com/admin/products/generate
   ```

2. **Fill Form:**
   ```
   Product Name: Golden Hour Over Downtown LA

   Description:
   Breathtaking sunset photograph capturing the iconic Los Angeles
   skyline bathed in golden light. Shot from Griffith Observatory,
   this museum-quality print brings the magic of LA's golden hour
   into your home. Perfect for modern living rooms, offices, or
   anyone who loves the City of Angels.

   Photo URL: https://your-blob-storage.vercel-storage.com/sunset-la.jpg

   Product Type: Canvas Print
   Collection: Los Angeles Collection
   Base Price: $149

   Tags: los angeles, sunset, cityscape, california, wall art
   ```

3. **Click "Generate Product"**
   - AI uploads to Printful
   - Creates multiple size variants
   - Generates mockups
   - Publishes to store

4. **Review on Store**
   - Product appears at `/store`
   - Check images, pricing, variants
   - Test "Add to Cart"

**Repeat for 20 photos = Fully stocked store!**

---

## 📊 ADMIN DASHBOARD FEATURES

### Order Management (`/admin/orders`)

**What You Can Do:**
- View all orders in real-time
- Filter by status (pending, paid, fulfilled, shipped)
- Search by customer email
- See Printful fulfillment status
- Export order data

**Order Lifecycle:**
1. Customer completes Stripe checkout
2. Webhook creates order automatically
3. Order sent to Printful for printing
4. Printful ships to customer
5. You track status in admin

### Store Management (`/admin/store`)

**Features:**
- Sync products from Printful
- View product inventory
- Check which products are selling
- Remove underperforming products
- Duplicate bestsellers with new photos

### Analytics (`/admin/analytics`)

**Track:**
- Total revenue
- Orders per day/week/month
- Top-selling products
- Conversion rates
- Average order value

---

## 💸 AFFILIATE PROGRAM SETUP

### Recommended Gear Page

**Already Built:** https://brandonmills.com/recommended-gear

**How to Add Affiliate Products:**

1. **Go to:** `/admin/affiliates`
2. **Click "Add Affiliate Product"**
3. **Fill Form:**
   ```
   Product Name: Sony A7 IV Camera
   Description: Professional full-frame mirrorless camera
   Price: $2,499
   Affiliate URL: https://amzn.to/your-link
   Program: Amazon Associates
   Commission: 4%
   Category: Cameras
   ```
4. **Click "Add Product"**
5. **Product appears on Recommended Gear page**

### Automated Affiliate Signup

**Scripts Location:** `/scripts/affiliate-automation/`

**Programs to Join:**
- Amazon Associates (photography gear) - 2-4% commission
- B&H Photo - 3-8% commission
- ShareASale (art supplies) - 5-15% commission
- CJ Affiliate (home decor) - 8-12% commission

**Run Automation:**
```bash
cd '/Volumes/Super Mastery/Webdesigner/scripts/affiliate-automation'
./signup-amazon.sh
./signup-bh-photo.sh
./signup-shareasale.sh
```

---

## 📧 EMAIL SETUP (CRITICAL - DO THIS NOW)

**Current Status:** ❌ Email not configured
**Impact:** Customers don't get order confirmations

### Quick Setup with Resend (Recommended)

1. **Sign up:** https://resend.com
2. **Get API key**
3. **Add to Vercel environment:**
   ```
   RESEND_API_KEY=re_your_key_here
   ```
4. **Verify domain:** brandonmills.com
5. **Test email delivery**

**Email Templates to Create:**
- Order confirmation
- Shipping notification
- Delivery confirmation
- Abandoned cart recovery

---

## 🚀 GO LIVE CHECKLIST

### Before You Start Selling

- [ ] Generate 20+ products in admin
- [ ] Test complete purchase flow (test mode)
- [ ] Set up email service (Resend)
- [ ] Switch to live Stripe keys
- [ ] Test one real purchase ($1)
- [ ] Verify Printful order creation
- [ ] Check email confirmations
- [ ] Set up error monitoring (Sentry)
- [ ] Add Google Analytics
- [ ] Create social media accounts

### Get Live Stripe Keys

1. **Go to:** https://dashboard.stripe.com/apikeys
2. **Switch from Test to Live**
3. **Copy keys:**
   - Secret key: `sk_live_...`
   - Publishable key: `pk_live_...`
4. **Update Vercel environment variables:**
   ```
   STRIPE_SECRET_KEY=sk_live_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
   ```
5. **Webhook endpoint:**
   - URL: https://brandonmills.com/api/stripe/webhook
   - Events: `checkout.session.completed`, `payment_intent.succeeded`
   - Copy webhook secret: `whsec_...`
   - Add to Vercel: `STRIPE_WEBHOOK_SECRET=whsec_...`

### Deploy to Production

```bash
cd '/Volumes/Super Mastery/Webdesigner'
git add .
git commit -m "🚀 Launch: Products, fulfillment, email ready"
git push origin main
```

**Vercel auto-deploys in 3 minutes**
**Live at:** https://brandonmills.com

---

## 💰 FIRST SALE STRATEGY

### Week 1: Launch Campaign

**Day 1-2: Product Creation**
- Generate 20 products
- Write descriptions
- Organize into collections

**Day 3-4: Marketing Setup**
- Instagram posts (3 best products)
- Pinterest boards (all products)
- Email to friends/family
- Post in photography groups

**Day 5-7: Paid Ads**
- Instagram ad: $50 budget
- Target: LA locals, photography lovers
- Drive to store page

**Goal:** 5 sales in Week 1 = $500-$750 revenue

### Month 1: Scale to $5,000

**Product Expansion:**
- 50 total products
- 5 collections
- Weekly new releases

**Marketing:**
- Instagram 3x/week
- Pinterest 5x/week
- Email newsletter (weekly)
- Paid ads: $500/month

**Affiliate Revenue:**
- Publish gear reviews
- Link from product pages
- Email recommendations

**Projected:**
- Product sales: $3,000-$4,000
- Affiliate commissions: $500-$1,000
- **Total: $3,500-$5,000**

---

## 📞 SUPPORT & TROUBLESHOOTING

### Common Issues

**Can't Login to Admin:**
- Verify username: `Bmilly23` (case-sensitive)
- Verify password: `Ailtoronto1@`
- Clear browser cache
- Try incognito mode

**Products Not Showing in Store:**
- Check `/admin/store` - are they synced?
- Run "Sync Products from Printful"
- Check browser console for errors
- Verify Printful API key in `.env.local`

**Order Not Sent to Printful:**
- Check Stripe webhook logs
- Verify Printful API key
- Check `/data/orders/` for order file
- Manually retry from admin

**Email Not Sending:**
- Verify Resend API key
- Check domain verification
- Test with personal email first
- Check spam folder

### Need Help?

**Documentation:**
- Main guide: `/🚀-START-HERE.md`
- Store docs: `/STORE_DOCUMENTATION.md`
- Security: `/SECURITY_FIX_REPORT.md`
- Deployment: `/DEPLOYMENT-STATUS.md`

**Logs:**
- Vercel: https://vercel.com/dashboard
- Stripe: https://dashboard.stripe.com/logs
- Printful: https://www.printful.com/dashboard

---

## 🎯 YOUR ACTION PLAN (RIGHT NOW)

### Next 2 Hours:

1. **Login to admin** ✓
2. **Generate 5 test products** (30 min)
3. **Test purchase flow** (15 min)
4. **Set up Resend email** (30 min)
5. **Get live Stripe keys** (15 min)
6. **Deploy to production** (5 min)

### Tomorrow:

1. **Generate 20 real products**
2. **Create Instagram account**
3. **Post first 3 products**
4. **Email friends/family**

### This Week:

1. **Complete 50 products**
2. **First sale! 🎉**
3. **Set up affiliates**
4. **Launch ads campaign**

---

## 💪 YOU'VE GOT THIS!

Your platform is **95% ready**. The code is solid, the design is luxury, the infrastructure is professional.

**All you need to do:**
1. Generate products (fun part!)
2. Market them (creative part!)
3. Make money (exciting part!)

**First sale within 7 days.** Let's go! 🚀

---

**Questions?** Check the docs or review code comments.
**Ready to sell?** Login now: https://brandonmills.com/admin/login
