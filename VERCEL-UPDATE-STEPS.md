# 🚀 VERCEL UPDATE - FOLLOW THESE EXACT STEPS

## ✅ **NEW PRINTFUL API KEY:**
```
OIigriw2Yh4YgEHVYOKeBPHf5g75zIRhx4G4yhAx
```

---

## 📋 **STEP 1: UPDATE ENVIRONMENT VARIABLE (2 min)**

### **1.1** Open Vercel Settings:
👉 **Click this link:** https://vercel.com/mrbrandonmills/webdesigner/settings/environment-variables

### **1.2** Find PRINTFUL_API_KEY:
- Scroll down the list of environment variables
- Look for: **`PRINTFUL_API_KEY`**

### **1.3** Edit the Variable:
- Click the **"Edit"** button (pencil icon ✏️) on the right
- Or click the **"..."** menu → **"Edit"**

### **1.4** Replace the Value:
- **Old value:** `vbrzkAu9dnvIO6AAikezjsczratgW3FWjhDAOuWo` (expired)
- **New value:** `OIigriw2Yh4YgEHVYOKeBPHf5g75zIRhx4G4yhAx`

**COPY THIS:**
```
OIigriw2Yh4YgEHVYOKeBPHf5g75zIRhx4G4yhAx
```

### **1.5** Save:
- Click **"Save"** button
- ✅ You should see "Environment variable updated" confirmation

---

## 🔄 **STEP 2: REDEPLOY SITE (1 min)**

### **2.1** Go to Deployments:
👉 **Click this link:** https://vercel.com/mrbrandonmills/webdesigner

### **2.2** Click "Deployments" Tab:
- At the top of the page, click **"Deployments"**
- You'll see a list of deployments

### **2.3** Find Latest Deployment:
- Look for the most recent one (top of the list)
- Should say "Ready" with a green checkmark
- Created a few minutes ago

### **2.4** Open Menu:
- On the right side, click the **"..." (three dots)** button
- A menu will appear

### **2.5** Click "Redeploy":
- Click **"Redeploy"** from the menu
- A popup will appear

### **2.6** Confirm Redeploy:
- Click **"Redeploy"** button in the popup
- ✅ Deployment will start immediately

---

## ⏱️ **STEP 3: WAIT FOR DEPLOYMENT (2-3 min)**

### **3.1** Watch Progress:
- You'll see: **"Building"** status (yellow)
- Wait ~2-3 minutes
- Status will change to: **"Ready"** (green checkmark ✅)

### **3.2** Check Build Logs (Optional):
- Click the deployment while it's building
- Click **"Building"** or **"View Function Logs"**
- Should see: "✓ Compiled successfully"
- No errors about Printful

---

## ✅ **STEP 4: TEST THE STORE (1 min)**

### **4.1** Visit Store Page:
👉 **Click this link:** https://brandonmills.com/store

### **4.2** What You Should See:
- ✅ **Product grid** with multiple items
- ✅ **Product images** loading
- ✅ **Prices** showing (e.g., $24, $32, $74)
- ✅ **Product names** (T-shirts, Hoodies, Mugs, etc.)
- ✅ **"Add to Cart"** buttons

### **4.3** If Products Load:
🎉 **SUCCESS!** Store is working!

### **4.4** If Store Still Empty:
Check Vercel logs:
1. Go to: https://vercel.com/mrbrandonmills/webdesigner
2. Click latest deployment
3. Click "View Function Logs"
4. Look for errors about Printful

---

## 🧪 **STEP 5: FULL CHECKOUT TEST (Optional)**

### **5.1** Add Product to Cart:
- Click any product
- Click **"Add to Cart"**
- Cart counter should update (shows number)

### **5.2** View Cart:
- Click shopping bag icon (top right)
- Cart drawer should open
- Product should be listed

### **5.3** Apply Promo Code:
- In cart, find promo code input
- Type: **`WELCOME10`**
- Click apply
- Price should decrease by 10%

### **5.4** Test Checkout:
- Click **"Checkout"** button
- Should redirect to Stripe
- Stripe checkout page loads
- **Use test card:** `4242 4242 4242 4242`
- Any future date, any CVC
- Can complete test purchase

---

## 📊 **VERIFICATION CHECKLIST:**

After redeploy completes:

**Store Page:**
- [ ] Visit https://brandonmills.com/store
- [ ] Products visible in grid
- [ ] Product images load
- [ ] Prices show correctly
- [ ] Can click product for details

**Product Details:**
- [ ] Click any product
- [ ] Detail page loads
- [ ] Image gallery works
- [ ] Can select size/color variants
- [ ] Add to cart works

**Shopping Cart:**
- [ ] Click cart icon
- [ ] Cart drawer opens
- [ ] Products listed
- [ ] Can update quantity
- [ ] Can apply promo code

**Checkout:**
- [ ] Click checkout
- [ ] Redirects to Stripe
- [ ] Stripe page loads
- [ ] Can enter test card info

---

## 🆘 **TROUBLESHOOTING:**

### **Issue: Can't find PRINTFUL_API_KEY in Vercel**
**Solution:**
- Make sure you're on the right project: "Webdesigner"
- Check you're in Settings → Environment Variables
- Scroll through the list (might be alphabetical)
- If missing, click "Add New" and create it

### **Issue: Store still empty after redeploy**
**Check:**
1. Go to Vercel → Deployments → Latest
2. Click "View Function Logs"
3. Look for `/api/store/products` errors
4. If 401 error still appears:
   - Double-check API key was saved correctly
   - Try redeploying again
   - Verify key works: Test in browser console

### **Issue: Deployment failed**
**Check:**
1. View build logs
2. Look for error message
3. Most common: Different environment variable missing
4. Fix the missing variable
5. Redeploy

### **Issue: Products load but images broken**
**Solution:**
- This is normal - some Printful images take time
- Refresh page
- Check image URLs in browser console
- Verify Printful API has "View store files" permission

---

## 🎯 **QUICK REFERENCE:**

**New API Key:**
```
OIigriw2Yh4YgEHVYOKeBPHf5g75zIRhx4G4yhAx
```

**Update Vercel:**
https://vercel.com/mrbrandonmills/webdesigner/settings/environment-variables

**Redeploy:**
https://vercel.com/mrbrandonmills/webdesigner → Deployments → "..." → Redeploy

**Test Store:**
https://brandonmills.com/store

**Test Promo Code:**
`WELCOME10` (10% off)

**Test Card:**
`4242 4242 4242 4242`

---

## ✨ **AFTER SUCCESSFUL DEPLOYMENT:**

Your store will have:
- ✅ 300+ Printful products available
- ✅ Working shopping cart
- ✅ Stripe checkout integration
- ✅ Promo code system
- ✅ Admin dashboard access
- ✅ Complete luxury design

**Ready to start selling!** 🚀

---

**Follow steps 1-4 in order. Tell me when deployment is complete!**
