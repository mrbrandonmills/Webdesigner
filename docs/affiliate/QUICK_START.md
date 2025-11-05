# Affiliate Automation - Quick Start Guide

Get your affiliate accounts set up in 30 minutes or less.

## Prerequisites Checklist

Before starting, make sure you have:

- [ ] Live website at brandonmills.com (or your domain)
- [ ] At least 10 pieces of quality content (photos/posts)
- [ ] Business email address
- [ ] Phone number for verification
- [ ] Tax information (EIN or SSN)
- [ ] Bank account info (for payment)

## Step 1: Run the Signup Wizard (10 min)

```bash
npm run affiliate:create
```

**What you'll be asked:**

1. **Master Password** - Create a strong password (20+ characters)
   - This encrypts all credentials
   - Store it in your password manager
   - You'll need it to view credentials later

2. **Business Information** - Confirm or update:
   - Business Name: Brandon Mills Photography
   - Website: brandonmills.com
   - Email: affiliates@brandonmills.com

3. **Select Platforms** - Choose which ones to sign up for
   - ✅ Start with "very-high" priority (pre-selected)
   - ✅ Add "high" priority if you want
   - ⏭️ Skip "medium" for now

**Recommended Order:**

1. **Printful** (instant approval if you're a customer)
2. **B&H Photo** (fast approval for photography sites)
3. **Amazon Associates** (need 3 sales in 180 days)
4. **ShareASale** (2-5 day approval)

## Step 2: Complete Each Signup (5-10 min per platform)

For each platform, the wizard will:

1. **Generate credentials**
   - Username: `brandonmills_photography_abc1`
   - Email: `affiliates+platform@brandonmills.com`
   - Password: `X7k#mN9$pQ2...` (strong & unique)

2. **Copy password to clipboard automatically**

3. **Open signup page in browser**

4. **Guide you through fields**
   ```
   1. Business Name: Brandon Mills Photography
   2. Website: brandonmills.com
   3. Email: [shown on screen]
   4. Password: [already in clipboard - Cmd+V]
   5. Content Type: Photography/Art/Lifestyle
   ```

5. **Wait for email verification**
   - Check your email
   - Click verification link
   - Come back and press Enter

6. **Save credentials (encrypted)**

## Step 3: Verify Emails (2 min per platform)

After submitting each application:

1. **Check your email** (usually instant)
2. **Click verification link**
3. **Complete any additional steps**
4. **Return to wizard and press Enter**

## Step 4: Wait for Approvals (1-7 days)

Different platforms have different approval times:

- **Printful**: Instant (if existing customer)
- **B&H Photo**: 1-3 days
- **Amazon**: 1-2 days
- **ShareASale**: 2-5 days
- **CJ Affiliate**: 3-7 days

**Check status anytime:**

```bash
npm run affiliate:status
```

## Step 5: Configure Approved Accounts (5 min per platform)

Once approved, run:

```bash
npm run affiliate:configure
```

This will:

1. **Detect approved accounts** automatically
2. **Ask for platform-specific info**:
   - Amazon: Associate Tag
   - B&H: Affiliate ID
   - ShareASale: Affiliate ID
   - Printful: Affiliate Link

3. **Generate sample affiliate links**
4. **Create .env.affiliate file** with all credentials
5. **Save everything for easy access**

## Step 6: Start Promoting!

### Amazon Example

Generated link:
```
https://www.amazon.com/dp/B08D15RNG8/?tag=brandonmills-20
```

Use in your content:
```html
<a href="https://www.amazon.com/dp/B08D15RNG8/?tag=brandonmills-20">
  Canon EOS R5 Camera
</a>
<p class="disclosure">
  This is an affiliate link. I earn a commission if you purchase.
</p>
```

### B&H Photo Example

```html
<a href="https://www.bhphotovideo.com/c/product/1595021-REG/BI/12345/KBID/1234">
  Canon EOS R5 at B&H
</a>
```

## Common Commands

```bash
# Create new accounts
npm run affiliate:create

# View/manage credentials
npm run affiliate:manage

# Configure approved accounts
npm run affiliate:configure

# Check status
npm run affiliate:status
```

## Troubleshooting

### "Email already registered"

Use email aliases:
```
affiliates+amazon@brandonmills.com
affiliates+bhphoto@brandonmills.com
```

All emails go to `affiliates@brandonmills.com` but appear unique to platforms.

### "Website not accessible"

1. Make sure brandonmills.com is live
2. Check in incognito browser
3. Verify DNS is working
4. Wait 24 hours and try again

### "Application rejected"

**Common reasons:**
- Not enough content (need 10+ posts)
- No traffic yet (need 100+ visitors/month)
- Incomplete application
- Website looks incomplete

**Fix:**
1. Add more quality content
2. Build traffic for 30 days
3. Complete all fields accurately
4. Reapply after 30 days

### "Can't find credentials"

```bash
# Check if file exists
ls data/affiliate/credentials.json

# View status
npm run affiliate:status

# If missing, create accounts again
npm run affiliate:create
```

## Security Reminders

1. **Never commit credentials to git**
   - Already in .gitignore
   - Double-check before commits

2. **Back up your credentials**
   ```bash
   npm run affiliate:manage
   # Select: Export → 1Password CSV
   # Import to password manager
   ```

3. **Store master password safely**
   - Use a password manager
   - Don't write it down
   - Don't share it

## Next Steps

Once your accounts are active:

1. **Create affiliate content**
   - Product reviews
   - Equipment recommendations
   - Tutorial posts
   - Comparison articles

2. **Add FTC disclosures**
   ```html
   <div class="affiliate-disclosure">
     This post contains affiliate links. I earn a commission
     if you purchase, at no additional cost to you.
   </div>
   ```

3. **Track performance**
   - Check platform dashboards weekly
   - Monitor click-through rates
   - Track conversions
   - Optimize based on data

4. **Scale up**
   - Apply to more platforms
   - Test different products
   - Create more content
   - Build email list

## Expected Timeline

- **Day 1**: Sign up for 4-6 platforms (2-3 hours)
- **Day 2-3**: Email verifications, check status
- **Day 3-7**: Approvals start coming in
- **Day 7**: Configure approved accounts (1 hour)
- **Day 8+**: Start creating affiliate content

## Support

**Documentation:**
- Full Guide: `docs/affiliate/AFFILIATE_SIGNUP_GUIDE.md`
- Technical Details: `docs/affiliate/AFFILIATE_AUTOMATION_README.md`

**Commands:**
```bash
npm run affiliate:status    # Quick overview
npm run affiliate:manage    # Full credential manager
```

**Platform Support:**
- Amazon: associates-support@amazon.com
- ShareASale: support@shareasale.com
- B&H Photo: affiliates@bhphoto.com

---

**Ready to start?**

```bash
npm run affiliate:create
```

Good luck! 🚀
