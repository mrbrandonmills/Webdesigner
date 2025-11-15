# 🔑 GET YOUR API KEYS - STEP BY STEP GUIDE

**Brandon, follow this guide EXACTLY. I'll walk you through each service.**

**Time Required:** 45 minutes total
**Result:** Fully configured production store!

---

## 📧 STEP 1: RESEND (EMAIL SERVICE) - 30 Minutes

### Why Resend?
- Best email deliverability (99%+ inbox rate)
- Free tier: 3,000 emails/month
- Simple API, great for transactional emails
- Used by major companies

### Part A: Create Account (5 minutes)

**Go to:** https://resend.com/signup

**Steps:**
1. Click "Start for free"
2. Enter your email: `bmilly23@gmail.com`
3. Check your email for verification link
4. Click the link
5. Set password (save it!)
6. Choose plan: **Free** (3,000 emails/month is perfect for now)

✅ **Checkpoint:** You should now be logged into Resend dashboard

---

### Part B: Verify Your Domain (15 minutes)

**CRITICAL:** You must verify brandonmills.com to send emails from it.

**In Resend Dashboard:**

1. **Click "Domains" in left sidebar**

2. **Click "Add Domain" button**

3. **Enter your domain:**
   ```
   brandonmills.com
   ```
   (NOT www.brandonmills.com - just brandonmills.com)

4. **Click "Add"**

5. **You'll see DNS records to add** - Keep this page open!

**Now go to your domain registrar** (Where you bought brandonmills.com - GoDaddy, Namecheap, etc.)

---

### Part C: Add DNS Records (10 minutes)

**Resend will give you these records to add:**

**Record 1: SPF (TXT Record)**
```
Type: TXT
Name: @ (or leave blank)
Value: v=spf1 include:resend.com ~all
TTL: 3600
```

**Record 2: DKIM (TXT Record)**
```
Type: TXT
Name: resend._domainkey
Value: [Long string from Resend - copy exactly]
TTL: 3600
```

**Record 3: DMARC (TXT Record) - Optional but recommended**
```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none; rua=mailto:bmilly23@gmail.com
TTL: 3600
```

**How to Add (Generic Steps - Adjust for your registrar):**

1. Log into your domain registrar (GoDaddy, Namecheap, etc.)
2. Find DNS settings / DNS management
3. Click "Add Record" or "Add DNS Record"
4. For each record above:
   - Select Type (TXT)
   - Enter Name
   - Paste Value (EXACTLY as shown in Resend)
   - Set TTL to 3600
   - Save

**Wait Time:** DNS can take 10-60 minutes to propagate

---

### Part D: Get API Key (2 minutes)

**Back in Resend Dashboard:**

1. **Click "API Keys" in left sidebar**

2. **Click "Create API Key" button**

3. **Name it:** `Production - Brandon Mills Store`

4. **Permission:** Full Access (default)

5. **Click "Create"**

6. **COPY THE KEY IMMEDIATELY** - You can't see it again!
   ```
   It looks like: re_AbCdEfGh123456789...
   ```

7. **Save it here temporarily:**
   ```
   RESEND_API_KEY=re_[paste your key here]
   ```

✅ **Checkpoint:** You have your Resend API key saved

---

### Part E: Verify Domain Status

**In Resend Dashboard → Domains:**

**Check the status:**
- ⏳ **Pending:** DNS not propagated yet (wait 10-60 min)
- ✅ **Verified:** You're good to go!
- ❌ **Failed:** Double-check DNS records

**If Pending:** Wait a bit, then click "Verify" button

**If Failed:** Click "View Details" to see which record is wrong

---

## 💳 STEP 2: STRIPE (PAYMENT PROCESSING) - 15 Minutes

### Why Stripe?
- Industry standard for payments
- Handles everything (cards, Apple Pay, Google Pay)
- Automatic fraud detection
- Built-in reporting

### Part A: Switch to Live Mode (2 minutes)

**You already have a Stripe account!** (You're using test mode)

**Steps:**

1. **Go to:** https://dashboard.stripe.com

2. **Login** with your account

3. **Top right corner:** You'll see a toggle switch that says **"Test mode"**

4. **Click the toggle** to switch to **"Live mode"**

5. **You might see:** "Complete your account setup"
   - If so, follow their steps (bank account, business info)
   - Takes ~5 minutes

✅ **Checkpoint:** You're now in Live mode

---

### Part B: Get Your Live API Keys (3 minutes)

**In Stripe Dashboard (LIVE MODE):**

1. **Click "Developers" in top menu**

2. **Click "API Keys" in left sidebar**

3. **You'll see two keys:**

   **A) Publishable Key** (Starts with `pk_live_...`)
   ```
   Example: pk_live_51InphQLh14M3iXcG...
   ```
   - This is PUBLIC - goes in frontend code
   - Click "Reveal test key" button
   - **Copy it and save:**
   ```
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_[paste here]
   ```

   **B) Secret Key** (Starts with `sk_live_...`)
   ```
   Example: sk_live_51InphQLh14M3iXcG...
   ```
   - This is SECRET - never share!
   - Click "Reveal test key" button
   - **Copy it and save:**
   ```
   STRIPE_SECRET_KEY=sk_live_[paste here]
   ```

✅ **Checkpoint:** You have both Stripe keys saved

---

### Part C: Set Up Webhook (10 minutes)

**CRITICAL:** This tells Stripe to notify your site when payments happen

**In Stripe Dashboard → Developers → Webhooks:**

1. **Click "Add endpoint" button**

2. **Endpoint URL:** Enter this EXACTLY:
   ```
   https://brandonmills.com/api/stripe/webhook
   ```

3. **Description:** `Production webhook for order processing`

4. **Events to send:** Click "Select events"

5. **Select these 3 events:**
   - ✅ `checkout.session.completed`
   - ✅ `payment_intent.succeeded`
   - ✅ `payment_intent.payment_failed`

6. **Click "Add events"**

7. **Click "Add endpoint"**

8. **Copy the Signing Secret:**
   - You'll see: `whsec_...`
   - Click "Reveal" button
   - **Copy it and save:**
   ```
   STRIPE_WEBHOOK_SECRET=whsec_[paste here]
   ```

✅ **Checkpoint:** Webhook is set up, you have the secret

---

## ☁️ STEP 3: ADD KEYS TO VERCEL - 10 Minutes

**Now we put all these keys into Vercel so your site can use them!**

### Go to Vercel Dashboard

1. **Go to:** https://vercel.com/dashboard

2. **Find your Webdesigner project** and click it

3. **Click "Settings" tab** at the top

4. **Click "Environment Variables"** in left sidebar

---

### Add Each Key

**For EACH key below, do this:**
1. Click "Add New" button
2. Enter the Name (exactly as shown)
3. Paste the Value (your actual key)
4. Select: **Production** (very important!)
5. Click "Save"

---

### Keys to Add:

**1. Resend Email Key**
```
Name: RESEND_API_KEY
Value: re_[your resend key from step 1]
Environment: Production ✓
```

**2. Stripe Publishable Key**
```
Name: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
Value: pk_live_[your stripe key from step 2]
Environment: Production ✓
```

**3. Stripe Secret Key**
```
Name: STRIPE_SECRET_KEY
Value: sk_live_[your stripe secret from step 2]
Environment: Production ✓
```

**4. Stripe Webhook Secret**
```
Name: STRIPE_WEBHOOK_SECRET
Value: whsec_[your webhook secret from step 2]
Environment: Production ✓
```

**5. Base URL (Update this)**
```
Name: NEXT_PUBLIC_BASE_URL
Value: https://brandonmills.com
Environment: Production ✓
```

---

### Keys That Should ALREADY Be There:

**Check these are set (from your .env.local):**

```
✓ ADMIN_USERNAME=Bmilly23
✓ ADMIN_PASSWORD_HASH=[your hash]
✓ PRINTFUL_API_KEY=[your printful key]
✓ PRINTFUL_STORE_ID=17145314
```

**If any are missing, add them from your local `.env.local` file!**

---

### Trigger Redeploy

**IMPORTANT:** After adding keys, you must redeploy!

**In Vercel Dashboard:**

1. **Click "Deployments" tab**

2. **Find the latest deployment**

3. **Click the three dots (•••)**

4. **Click "Redeploy"**

5. **Check "Use existing Build Cache"** ← UNCHECK THIS!

6. **Click "Redeploy"**

**Wait:** 2-3 minutes for build to complete

✅ **Checkpoint:** New deployment with all your keys!

---

## ✅ STEP 4: VERIFY EVERYTHING WORKS - 5 Minutes

### Test 1: Check Deployment

**Go to:** https://brandonmills.com

**You should see:** Your beautiful luxury photography site

**If you see an error:** Check Vercel deployment logs

---

### Test 2: Check Admin Login

**Go to:** https://brandonmills.com/admin/login

**Login:**
- Username: `Bmilly23`
- Password: `Ailtoronto1@`

**You should see:** Admin dashboard

✅ **Working!**

---

### Test 3: Check Email (Once Resend Verified)

**Wait for:** Resend domain to show "Verified" status

**Then test by:** Making a test purchase (we'll do this next)

---

### Test 4: Check Stripe Connection

**In Stripe Dashboard:**

1. Go to: https://dashboard.stripe.com/developers/webhooks

2. You should see your webhook endpoint

3. Status should be: ✅ **Enabled**

---

## 📋 CHECKLIST - DID YOU GET EVERYTHING?

**Resend:**
- [ ] Account created
- [ ] Domain added (brandonmills.com)
- [ ] DNS records added to domain registrar
- [ ] Domain verified (or pending)
- [ ] API key copied
- [ ] API key added to Vercel

**Stripe:**
- [ ] Switched to Live mode
- [ ] Publishable key copied
- [ ] Secret key copied
- [ ] Webhook endpoint created
- [ ] Webhook secret copied
- [ ] All 3 keys added to Vercel

**Vercel:**
- [ ] All environment variables added
- [ ] Redeployed with new keys
- [ ] Deployment successful
- [ ] Site loads at brandonmills.com
- [ ] Admin login works

---

## 🎯 YOUR KEYS SUMMARY

**Save these somewhere safe (password manager):**

```bash
# Email Service (Resend)
RESEND_API_KEY=re_[your key]

# Payment Processing (Stripe - LIVE)
STRIPE_SECRET_KEY=sk_live_[your key]
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_[your key]
STRIPE_WEBHOOK_SECRET=whsec_[your key]

# Site URL
NEXT_PUBLIC_BASE_URL=https://brandonmills.com

# Already Configured (Don't change)
ADMIN_USERNAME=Bmilly23
ADMIN_PASSWORD_HASH=[your hash]
PRINTFUL_API_KEY=[your key]
PRINTFUL_STORE_ID=17145314
```

---

## 🚨 TROUBLESHOOTING

### Resend Domain Won't Verify

**Check:**
1. Did you add ALL 3 DNS records?
2. Are the values copied EXACTLY?
3. Did you wait 10-60 minutes?
4. Try clicking "Verify" button again

**Still failing?**
- Click "View Details" to see which record is wrong
- Double-check in your domain registrar
- Contact Resend support (they're very helpful)

---

### Stripe Webhook Not Working

**Check:**
1. URL is exactly: `https://brandonmills.com/api/stripe/webhook`
2. You selected the right events
3. You're in LIVE mode (not test mode)
4. You copied the webhook secret to Vercel

**Test it:**
- Make a test purchase
- Check Stripe Dashboard → Developers → Webhooks
- Click your endpoint
- See "Recent deliveries"
- Should show successful deliveries

---

### Vercel Deployment Failed

**Check:**
1. Go to Vercel → Deployments
2. Click failed deployment
3. Read error logs
4. Usually: Missing environment variable

**Fix:**
- Add missing variables
- Redeploy

---

### Email Not Sending

**Check:**
1. Resend domain is verified
2. RESEND_API_KEY in Vercel
3. Check Resend Dashboard → Logs
4. See if emails were attempted
5. Check spam folder

---

## 🎊 NEXT STEPS AFTER KEYS ARE SET

**Once all keys are configured:**

1. **Test a $1 Purchase**
   - Add product to cart
   - Go to checkout
   - Use test card: 4242 4242 4242 4242
   - Verify email arrives
   - Check admin dashboard for order

2. **Generate 20 Products**
   - Login to admin
   - Use AI product generator
   - Upload your best photos
   - Publish to store

3. **Launch Marketing**
   - Post on social media
   - Email friends/family
   - First sale! 🎉

---

## 💪 YOU'RE ALMOST THERE!

**This is the ONLY thing standing between you and making money.**

**45 minutes of setup = Lifetime of revenue** 💰

**Start with Step 1 (Resend) and work through each step carefully.**

**I'm here if you get stuck on any step!**

---

## 📞 NEED HELP?

**If you get stuck:**

1. **Check this guide again** - Read carefully
2. **Check Vercel logs** - See deployment errors
3. **Ask me** - Describe the exact error you see

**Common issues:**
- DNS takes time (be patient)
- Keys must be copied exactly (no extra spaces)
- Must redeploy after adding keys
- Webhook URL must be exact

---

**Ready? Let's start with Resend!** 🚀

Go to: https://resend.com/signup
