# Amazon Product Advertising API Setup Guide

**Purpose:** Get always-current product images and data for your affiliate shop

---

## Step 1: Apply for Product Advertising API Access

### Requirements:
- ✅ Amazon Associates Account (you have this: `brandonmills.com-20`)
- ✅ At least 3 qualified sales in last 180 days
- ⏳ AWS Account (free - we'll create this)

### Apply Here:
**URL:** https://webservices.amazon.com/paapi5/documentation/

Click "Register for PA-API" and fill out the application form.

**Approval Time:** Typically 1-2 business days if you meet requirements

---

## Step 2: Create AWS Account (If You Don't Have One)

1. Go to: https://aws.amazon.com/
2. Click "Create an AWS Account"
3. Follow signup process (free tier is sufficient)
4. **Important:** Use same email as your Amazon Associates account

---

## Step 3: Get Your PA-API Credentials

Once approved, get your credentials:

### Access Key & Secret Key:

1. Go to AWS Console: https://console.aws.amazon.com/
2. Navigate to **IAM** (Identity and Access Management)
3. Click "Users" → "Add User"
4. User name: `pa-api-user`
5. Access type: Check "Programmatic access"
6. Permissions: Attach `ProductAdvertisingAPIFullAccess` policy
7. Click through to create user
8. **SAVE THESE CREDENTIALS:**
   - Access Key ID: `AKIA...` (20 characters)
   - Secret Access Key: `...` (40 characters)

**⚠️ CRITICAL:** You can only see the Secret Key ONCE. Save it immediately!

---

## Step 4: Add Credentials to Your Project

Create `.env.local` file (or add to existing):

```bash
# Amazon PA-API Credentials
AMAZON_PA_API_ACCESS_KEY=your_access_key_here
AMAZON_PA_API_SECRET_KEY=your_secret_key_here
AMAZON_PA_API_PARTNER_TAG=brandonmills.com-20
AMAZON_PA_API_REGION=us-east-1
```

**Never commit these credentials to Git!** (Already in .gitignore)

---

## Step 5: Test the Integration

Once you have credentials, run:

```bash
npm run refresh-amazon-products
```

This will:
1. Connect to Amazon PA-API
2. Fetch current product data for all 33 products
3. Update images, prices, ratings, stock status
4. Save to `lib/affiliate-products.ts`

---

## What PA-API Gives You

### Always-Current Data:
- ✅ **Product images** - Never break (404) again
- ✅ **Current prices** - Real-time Amazon pricing
- ✅ **Stock status** - Know what's available
- ✅ **Ratings & reviews** - Updated customer feedback
- ✅ **Product details** - Accurate descriptions, features

### Automated Updates:
- Set up daily cron job to refresh data
- Products always show current information
- Zero manual maintenance required

---

## Limitations & Best Practices

### Request Limits:
- **8,640 requests per day** (1 request every 10 seconds)
- Each product lookup = 1 request
- 33 products = 33 requests (plenty of headroom)

### Best Practices:
1. Cache product data (we do this in `affiliate-products.ts`)
2. Refresh once daily, not on every page load
3. Handle API errors gracefully (fallback to cached data)
4. Monitor your request usage

---

## Troubleshooting

### "Access Denied" Error
- Check credentials are correct in `.env.local`
- Ensure IAM user has ProductAdvertisingAPI permissions
- Verify you've been approved for PA-API access

### "Too Many Requests" Error
- You've exceeded rate limit (1 request/10 sec)
- Script automatically handles rate limiting with delays

### "Invalid ASIN" Error
- Product has been removed from Amazon
- Update `affiliate-products.ts` with new product

---

## Next Steps

Once you have credentials:

1. Add them to `.env.local`
2. Run `npm run refresh-amazon-products`
3. Verify products load with current images
4. Set up automated daily refresh (I'll create this)

---

## Support Links

- **PA-API Documentation:** https://webservices.amazon.com/paapi5/documentation/
- **PA-API Forum:** https://forums.aws.amazon.com/forum.jspa?forumID=336
- **Associates Program:** https://affiliate-program.amazon.com/
- **AWS IAM Console:** https://console.aws.amazon.com/iam/

---

## Security Notes

- **Never** commit `.env.local` to Git
- **Never** expose credentials in client-side code
- **Never** share credentials publicly
- Use environment variables for all sensitive data
- Rotate keys periodically for security

---

**Ready?** Follow steps 1-4, then let me know when you have your credentials!
