# ⚙️ UPDATE VERCEL ENVIRONMENT VARIABLES

## 🚨 CRITICAL: Missing Production Environment Variables

Your local `.env.local` has values, but Vercel production doesn't.

**Impact**:
- ❌ Checkout may fail (no Stripe key)
- ❌ Products won't load (no Printful key)
- ❌ Wrong redirect URLs (placeholder BASE_URL)

---

## 🎯 IMMEDIATE ACTION (10 minutes)

### Step 1: Go to Vercel Dashboard

1. Open: https://vercel.com/dashboard
2. Click on your project (likely "webdesigner" or "brandon-mills")
3. Click **Settings** (top navigation)
4. Click **Environment Variables** (left sidebar)

---

### Step 2: Add These Variables

Click **"Add New"** and enter each variable:

#### 1. NEXT_PUBLIC_BASE_URL ⚡ CRITICAL
```
Key: NEXT_PUBLIC_BASE_URL
Value: https://www.brandonmills.com
Environment: Production, Preview, Development (select all)
```

#### 2. STRIPE_SECRET_KEY ⚡ CRITICAL
```
Key: STRIPE_SECRET_KEY
Value: [Copy from your .env.local file - starts with sk_test_ or sk_live_]
Environment: Production (ONLY Production for security)
```

#### 3. NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
```
Key: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
Value: [Copy from your .env.local file - starts with pk_test_ or pk_live_]
Environment: Production, Preview, Development
```

#### 4. STRIPE_WEBHOOK_SECRET
```
Key: STRIPE_WEBHOOK_SECRET
Value: [Copy from your .env.local file - starts with whsec_]
Environment: Production (ONLY Production)
```

#### 5. PRINTFUL_API_KEY ⚡ CRITICAL
```
Key: PRINTFUL_API_KEY
Value: [Get from https://www.printful.com/dashboard/store]
Environment: Production (ONLY Production)
```

#### 6. PRINTFUL_STORE_ID
```
Key: PRINTFUL_STORE_ID
Value: [Get from Printful dashboard]
Environment: Production
```

#### 7. WEBFLOW_API_TOKEN
```
Key: WEBFLOW_API_TOKEN
Value: [Copy from your .env.local - starts with long hex string]
Environment: Production
```

#### 8. WEBFLOW_COLLECTION_ID
```
Key: WEBFLOW_COLLECTION_ID
Value: [Copy from your .env.local]
Environment: Production
```

#### 9. ANTHROPIC_API_KEY
```
Key: ANTHROPIC_API_KEY
Value: [Copy from your .env.local - starts with sk-ant-]
Environment: Production (ONLY Production)
```

#### 10. OPENAI_API_KEY
```
Key: OPENAI_API_KEY
Value: [Copy from your .env.local - starts with sk-]
Environment: Production (ONLY Production)
```

---

### Step 3: Check Your .env.local for Real Values

⚠️ **WARNING**: Your `.env.local` has PLACEHOLDER values for some variables!

**Check these and replace placeholders**:

```bash
# In your terminal
cd "/Volumes/Super Mastery/Webdesigner"
grep "your_" .env.local
```

**If you see "your_api_key_here"**, you need to get the real values from:

- **Stripe**: https://dashboard.stripe.com/apikeys
- **Printful**: https://www.printful.com/dashboard/store
- **Webflow**: https://designers.webflow.com/workspace/integrations
- **Anthropic**: https://console.anthropic.com/settings/keys
- **OpenAI**: https://platform.openai.com/api-keys

---

### Step 4: Trigger Redeploy

After adding ALL variables:

1. Go to **Deployments** tab in Vercel
2. Click the **"⋮"** menu on latest deployment
3. Click **"Redeploy"**
4. **Uncheck** "Use existing Build Cache"
5. Click **"Redeploy"**

This forces a fresh build with your new environment variables.

---

## ✅ VERIFY IT WORKED

After redeploy completes (3-5 minutes):

### Test 1: Check Environment Variables Loaded
```bash
curl https://www.brandonmills.com/api/debug-env
```

Should show environment variables are set (masked for security).

### Test 2: Test Store Products
```bash
curl https://www.brandonmills.com/api/store/products
```

Should return product data (not "API key missing" error).

### Test 3: Test Checkout
1. Visit https://www.brandonmills.com/store
2. Add item to cart
3. Click "Checkout"
4. Should redirect to Stripe (not error)

---

## 📋 QUICK CHECKLIST

- [ ] Go to Vercel Dashboard
- [ ] Click Settings → Environment Variables
- [ ] Add NEXT_PUBLIC_BASE_URL = https://www.brandonmills.com
- [ ] Add STRIPE_SECRET_KEY (from .env.local)
- [ ] Add PRINTFUL_API_KEY (get from Printful if needed)
- [ ] Add PRINTFUL_STORE_ID (get from Printful if needed)
- [ ] Add WEBFLOW_API_TOKEN (from .env.local)
- [ ] Add ANTHROPIC_API_KEY (from .env.local)
- [ ] Add OPENAI_API_KEY (from .env.local)
- [ ] Add all other keys from .env.local
- [ ] Trigger redeploy (uncheck "Use existing cache")
- [ ] Wait for deployment to complete (3-5 min)
- [ ] Test store and checkout

---

## 🔒 SECURITY NOTES

**NEVER** add to Git:
- ❌ API keys
- ❌ Secret tokens
- ❌ Passwords
- ❌ Private keys

**Environment Variable Security**:
- ✅ Production-only for secrets (Stripe, Printful)
- ✅ Use test keys in Preview/Development
- ✅ Rotate keys if exposed
- ✅ Keep .env.local in .gitignore

---

## 🆘 TROUBLESHOOTING

### "Variable already exists"
- Delete the existing one first
- Then add the new value

### "Deployment failed"
- Check Vercel deployment logs
- Look for "Missing environment variable" errors
- Verify variable names match exactly (case-sensitive)

### "Stripe checkout still fails"
- Make sure STRIPE_SECRET_KEY is correct
- Check it's the LIVE key (starts with sk_live_) for production
- Test key (sk_test_) for Preview/Development only

### "Products not loading"
- Verify PRINTFUL_API_KEY is set
- Get real key from https://www.printful.com/dashboard/store
- Check PRINTFUL_STORE_ID is your actual store ID

---

## 📞 GET MISSING API KEYS

If you don't have these yet:

**Stripe** (required for checkout):
1. Go to https://dashboard.stripe.com/register
2. Complete onboarding
3. Get keys from https://dashboard.stripe.com/apikeys
4. Use TEST keys first (sk_test_, pk_test_)

**Printful** (required for products):
1. Go to https://www.printful.com/auth/register
2. Create store
3. Get API key from Settings → API
4. Get Store ID from dashboard URL

**Webflow** (optional - for portfolio):
1. Go to https://designers.webflow.com/
2. Navigate to Workspace → Integrations
3. Generate API token
4. Get Collection ID from CMS

---

**TIME ESTIMATE**: 10-15 minutes
**DIFFICULTY**: Easy (just copy/paste)
**PRIORITY**: 🔴 CRITICAL - Do this NOW

Go to: https://vercel.com/dashboard
