# 🎯 DNS Setup for brandonmills.com - Tucows/Hover Quick Start

**Your domain is registered with:** Tucows Domains Inc.

This is likely managed through one of these interfaces:
- **Hover** (hover.com)
- **eNom** (enom.com)
- **OpenSRS** (opensrs.com)
- **Tucows Direct** (tucowsdomains.com)

## 🚀 Quick Start (5 Minutes)

### Step 1: Find Your Domain Manager

**Check which service you use:**
- Try logging in to: https://www.hover.com/signin (most common)
- Or: https://www.enom.com/login
- Or check your email for domain renewal notices

### Step 2: Navigate to DNS Settings

**For Hover.com:**
1. Login to https://www.hover.com
2. Click "Domains" in top menu
3. Click on "brandonmills.com"
4. Click "DNS" tab
5. Scroll to "Add New" section

**For eNom:**
1. Login to https://www.enom.com
2. Click "Domains" → "My Domains"
3. Click on "brandonmills.com"
4. Click "Host Records" or "DNS Settings"

### Step 3: Add DNS Records

**Add these 4 records** (click "Add Record" for each):

#### Record 1: DKIM (TXT)
```
Hostname: resend._domainkey
Record Type: TXT
Value: p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDFblATCUvOzAJqm1OFRxMY3AhrQLcz87Dl5CIhv5aVwENVCcicttGHyUwrpZwfh/eb0XXBixam1x0mzpYFZMvnFjW+NS3FS/Z1RUABAI4uZbILi5NZuwJHQdtQLy2HBOqZ6aRKGRZ+ehc/YLxlqVzlWuJsB9mg7cg9fQsWsoXLzQIDAQAB
TTL: 3600
```
Click "Add" or "Save"

#### Record 2: MX
```
Hostname: send
Record Type: MX
Value: feedback-smtp.us-east-1.amazonses.com
Priority: 10
TTL: 3600
```
Click "Add" or "Save"

#### Record 3: SPF (TXT)
```
Hostname: send
Record Type: TXT
Value: v=spf1 include:amazonses.com ~all
TTL: 3600
```
Click "Add" or "Save"

#### Record 4: DMARC (TXT)
```
Hostname: _dmarc
Record Type: TXT
Value: v=DMARC1; p=none;
TTL: 3600
```
Click "Add" or "Save"

### Step 4: Save Changes

- Look for "Save Changes" or "Apply Changes" button
- Click it to commit all DNS records

### Step 5: Verify (Wait 10-60 Minutes)

1. Wait 10-60 minutes for DNS propagation
2. Go to: https://resend.com/domains
3. Click "Verify" button on brandonmills.com
4. Wait for green checkmarks ✅

## ✅ Success Indicators

**You'll know it worked when:**
- Resend dashboard shows green checkmarks
- You can send test email
- Order confirmations work

## ❓ Troubleshooting

**Can't find your login?**
- Check email for "domain renewal" or "domain registration" notices
- Look for emails from Hover, eNom, Tucows, or OpenSRS
- Password reset links are at each service's login page

**Records not verifying?**
- Make sure you saved/applied changes in your DNS manager
- Wait the full 60 minutes for propagation
- Check for typos in the values (copy-paste recommended)

**Still stuck?**
- Contact Hover support: https://help.hover.com/hc/en-us
- Or use DNS_SETUP_GUIDE.md for general instructions

## 📧 After Verification

Once verified, your store will automatically:
- Send order confirmations to customers
- Notify you of new sales
- Send shipping updates when Printful ships products

**All automatic - no code changes needed!**
