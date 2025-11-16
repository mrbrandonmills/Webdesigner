# 🎯 Squarespace DNS Setup for brandonmills.com Email

## 🚀 Quick Start (5 Minutes)

### Step 1: Open Squarespace DNS Settings

1. **Login to Squarespace:** https://login.squarespace.com
2. **Click:** Home → Settings → Domains
3. **Click:** brandonmills.com
4. **Click:** "DNS Settings" or "Advanced Settings"
5. **Scroll to:** "Custom Records" section

### Step 2: Add These 4 DNS Records

For each record below, click **"Add Record"** in Squarespace:

---

## 📋 RECORD 1: DKIM Verification (TXT)

**In Squarespace DNS panel:**

```
Record Type: TXT
Host: resend._domainkey
Data: p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDFblATCUvOzAJqm1OFRxMY3AhrQLcz87Dl5CIhv5aVwENVCcicttGHyUwrpZwfh/eb0XXBixam1x0mzpYFZMvnFjW+NS3FS/Z1RUABAI4uZbILi5NZuwJHQdtQLy2HBOqZ6aRKGRZ+ehc/YLxlqVzlWuJsB9mg7cg9fQsWsoXLzQIDAQAB
```

**Click "Add" or "Save"**

---

## 📋 RECORD 2: Email Routing (MX)

**In Squarespace DNS panel:**

```
Record Type: MX
Host: send
Data: feedback-smtp.us-east-1.amazonses.com
Priority: 10
```

**Click "Add" or "Save"**

---

## 📋 RECORD 3: Sender Authentication (TXT)

**In Squarespace DNS panel:**

```
Record Type: TXT
Host: send
Data: v=spf1 include:amazonses.com ~all
```

**Click "Add" or "Save"**

---

## 📋 RECORD 4: DMARC Policy (TXT) - Optional

**In Squarespace DNS panel:**

```
Record Type: TXT
Host: _dmarc
Data: v=DMARC1; p=none;
```

**Click "Add" or "Save"**

---

## ✅ After Adding All 4 Records

### Save Your Changes
- Look for "Save" button at bottom of DNS page
- Click it to commit all changes

### Wait for Propagation
- **Time:** 10-60 minutes (usually 20-30 min)
- **Why:** DNS changes need to spread globally

### Verify Email Works
1. Wait 30 minutes minimum
2. Go to: https://resend.com/domains
3. Click **"Verify"** button on brandonmills.com
4. Look for **green checkmarks** ✅

## 🎯 Squarespace-Specific Notes

**Host Field:**
- Squarespace shows "Host" (other services may call it "Name")
- Enter exactly as shown above
- Do NOT add @brandonmills.com - Squarespace adds it automatically

**Data Field:**
- Squarespace shows "Data" (other services may call it "Value" or "Content")
- Copy entire value including all characters
- Do NOT add quotes around the value

**Priority Field:**
- Only appears for MX records
- Enter: 10

**TTL (Time to Live):**
- Squarespace usually sets this automatically
- If asked, use: 3600 (1 hour)

## ⚠️ Common Squarespace Issues

**Issue:** "Host already exists"
**Fix:** Check if a record with same Host already exists. You may need to edit instead of add.

**Issue:** "Invalid characters in Data"
**Fix:** Make sure you copied the entire value with no extra spaces at beginning/end.

**Issue:** Can't find "Custom Records"
**Fix:** Make sure you're in the DNS Settings for brandonmills.com specifically, not general settings.

## 📱 Squarespace Mobile App

If using Squarespace mobile app:
1. DNS settings are available on mobile
2. Follow same steps as desktop
3. May need to switch to desktop view for easier data entry

## 🧪 Verify DNS Records Are Added

**After 30 minutes, check with this command:**
```bash
# On Mac/Linux terminal:
dig TXT resend._domainkey.brandonmills.com
dig MX send.brandonmills.com
dig TXT send.brandonmills.com
```

**Or use online tool:**
- https://mxtoolbox.com
- Search: resend._domainkey.brandonmills.com
- Type: TXT Lookup

## ✅ Success Indicators

You'll know it worked when:
- ✅ Resend dashboard shows green checkmarks
- ✅ All 4 records visible in Squarespace DNS settings
- ✅ MXToolbox or dig commands return the values you entered
- ✅ Test email sends successfully

## 📧 What Happens Next

**Once verified, your store automatically sends:**
- Order confirmations to customers when they purchase
- Admin notifications to you for new sales
- Shipping updates when Printful ships products

**All emails will:**
- Come from your domain (@brandonmills.com)
- Look professional and branded
- Have high deliverability (won't go to spam)
- Be sent automatically (no manual work needed)

## 🆘 Squarespace Support

**Need help with Squarespace DNS?**
- Help Center: https://support.squarespace.com/hc/en-us/articles/360002101888
- Live Chat: Available in Squarespace dashboard
- Search: "Add custom DNS records"

**Resend Support:**
- Documentation: https://resend.com/docs
- Support: https://resend.com/support

## 🎉 You're Almost Live!

**Current Status:**
- ✅ Store deployed and working
- ✅ Stripe payments configured
- ✅ Printful integration ready
- ⏳ Email (waiting for DNS)

**Next Steps:**
1. Add these 4 DNS records in Squarespace (5 min)
2. Wait 30-60 min for propagation
3. Verify at https://resend.com/domains
4. Generate products in admin dashboard
5. Make your first sale! 💰
