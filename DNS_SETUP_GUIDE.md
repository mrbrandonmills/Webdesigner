# 📧 DNS Setup Guide - Enable Email for brandonmills.com

## ⚠️ IMPORTANT
These DNS records **CANNOT** be added to your code. They must be added at your **domain registrar** (where you purchased brandonmills.com).

## 🎯 Where to Add DNS Records

**Common Domain Registrars:**
- **GoDaddy:** Login → My Products → Domains → DNS
- **Namecheap:** Login → Domain List → Manage → Advanced DNS
- **Cloudflare:** Login → Select Domain → DNS → Records
- **Google Domains:** Login → My Domains → DNS
- **Vercel:** If domain is on Vercel, go to project → Domains → DNS Records

## 📋 DNS Records to Add (Copy These Exactly)

### 1. Domain Verification (DKIM) - REQUIRED
```
Type:     TXT
Name:     resend._domainkey
Value:    p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDFblATCUvOzAJqm1OFRxMY3AhrQLcz87Dl5CIhv5aVwENVCcicttGHyUwrpZwfh/eb0XXBixam1x0mzpYFZMvnFjW+NS3FS/Z1RUABAI4uZbILi5NZuwJHQdtQLy2HBOqZ6aRKGRZ+ehc/YLxlqVzlWuJsB9mg7cg9fQsWsoXLzQIDAQAB
TTL:      Auto (or 3600)
```

### 2. Email Routing (MX) - REQUIRED
```
Type:     MX
Name:     send
Value:    feedback-smtp.us-east-1.amazonses.com
Priority: 10
TTL:      Auto (or 3600)
```

### 3. Sender Policy Framework (SPF) - REQUIRED
```
Type:     TXT
Name:     send
Value:    v=spf1 include:amazonses.com ~all
TTL:      Auto (or 3600)
```

### 4. DMARC Policy - OPTIONAL (Recommended)
```
Type:     TXT
Name:     _dmarc
Value:    v=DMARC1; p=none;
TTL:      Auto (or 3600)
```

## 📝 Step-by-Step Instructions

### For Most Registrars:

1. **Login to your domain registrar** (where you bought brandonmills.com)

2. **Find DNS Management**
   - Look for: "DNS", "DNS Management", "Name Servers", "Advanced DNS"

3. **Add Record #1 - DKIM (Domain Verification)**
   - Click "Add Record" or "Add New Record"
   - Select type: **TXT**
   - Host/Name: `resend._domainkey`
   - Value: `p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDFblATCUvOzAJqm1OFRxMY3AhrQLcz87Dl5CIhv5aVwENVCcicttGHyUwrpZwfh/eb0XXBixam1x0mzpYFZMvnFjW+NS3FS/Z1RUABAI4uZbILi5NZuwJHQdtQLy2HBOqZ6aRKGRZ+ehc/YLxlqVzlWuJsB9mg7cg9fQsWsoXLzQIDAQAB`
   - TTL: Auto (or 3600)
   - Click "Save"

4. **Add Record #2 - MX Record**
   - Click "Add Record"
   - Select type: **MX**
   - Host/Name: `send`
   - Value: `feedback-smtp.us-east-1.amazonses.com`
   - Priority: `10`
   - TTL: Auto (or 3600)
   - Click "Save"

5. **Add Record #3 - SPF Record**
   - Click "Add Record"
   - Select type: **TXT**
   - Host/Name: `send`
   - Value: `v=spf1 include:amazonses.com ~all`
   - TTL: Auto (or 3600)
   - Click "Save"

6. **Add Record #4 - DMARC (Optional)**
   - Click "Add Record"
   - Select type: **TXT**
   - Host/Name: `_dmarc`
   - Value: `v=DMARC1; p=none;`
   - TTL: Auto (or 3600)
   - Click "Save"

## ⏱️ Verification Timeline

After adding DNS records:
- **Propagation Time:** 10 minutes to 48 hours (usually 10-60 minutes)
- **Check Status:** https://resend.com/domains
- **Look for:** Green checkmark next to brandonmills.com

## 🧪 How to Verify DNS Records Are Working

**Option 1: Use Resend Dashboard**
```
1. Go to: https://resend.com/domains
2. Click on brandonmills.com
3. Click "Verify" button
4. Wait for green checkmarks
```

**Option 2: Use Command Line (Mac/Linux)**
```bash
# Check DKIM record
dig TXT resend._domainkey.brandonmills.com

# Check MX record
dig MX send.brandonmills.com

# Check SPF record
dig TXT send.brandonmills.com
```

**Option 3: Online DNS Checker**
- Visit: https://mxtoolbox.com/SuperTool.aspx
- Enter: `resend._domainkey.brandonmills.com`
- Select "TXT Lookup"

## 🎯 What Each Record Does

| Record | Purpose | Why It's Needed |
|--------|---------|-----------------|
| **DKIM (TXT)** | Verifies emails come from your domain | Prevents spam classification |
| **MX** | Routes bounced emails | Required by Resend |
| **SPF (TXT)** | Authorizes Resend to send emails | Improves deliverability |
| **DMARC (TXT)** | Email authentication policy | Optional but recommended |

## ✅ After Verification

Once DNS records are verified (green checkmarks in Resend):

1. **Test Email System:**
   ```bash
   # Make a test purchase on your site
   # Or use the admin to trigger an email
   ```

2. **Check Email Delivery:**
   - Order confirmations will be sent automatically
   - Admin notifications for new orders
   - Shipping updates when products ship

3. **Monitor Email Status:**
   - Resend Dashboard: https://resend.com/emails
   - See delivery status, opens, clicks

## ❌ Common Issues

**Issue:** "Record not found after 24 hours"
**Fix:** Check you added the record at the correct registrar (where domain is registered, not where it's hosted)

**Issue:** "Record exists but verification fails"
**Fix:** Make sure there are NO quotes around the value when entering it

**Issue:** "Multiple TXT records conflict"
**Fix:** Some registrars require you to edit existing TXT records instead of adding new ones

## 📞 Need Help?

**Find Your Registrar:**
```bash
# Run this to see where brandonmills.com is registered:
whois brandonmills.com | grep -i registrar
```

**Common Registrar Support:**
- GoDaddy: https://www.godaddy.com/help/add-a-txt-record-19232
- Namecheap: https://www.namecheap.com/support/knowledgebase/article.aspx/317/2237/how-do-i-add-txtspfdkimdmarc-records-for-my-domain/
- Cloudflare: https://developers.cloudflare.com/dns/manage-dns-records/how-to/create-dns-records/

## 🚀 What Happens After Setup

Once DNS is verified:
- ✅ Order confirmation emails work automatically
- ✅ Admin notifications for new sales
- ✅ Shipping updates when Printful ships
- ✅ Professional branded emails from @brandonmills.com
- ✅ High deliverability (won't go to spam)

---

**Quick Reference:** All 4 DNS records need to be added at your domain registrar, NOT in code.
**Verification:** Check https://resend.com/domains after 10-60 minutes.
**Support:** If stuck, provide your registrar name and I can give specific instructions.
