# Monday Tasks - Instagram Token Refresh

## 🚨 CRITICAL: Instagram Automation Currently DOWN

**Status:** Instagram posts (both @dopam.mills and @lab.of.living) have been down since Nov 20
**Impact:** $25/day ad spend running while automation is offline
**Revenue Loss:** 3 days of missed posts = potential lost affiliate sales

---

## Required Before Starting

- [ ] Get EIN (Employer Identification Number)
- [ ] Have Facebook App credentials ready:
  - App ID: `1322977046248770`
  - App Secret: `04567d41bbaee516f732e48493c208e6`

---

## Step 1: Complete Facebook App Requirements

**URL:** https://developers.facebook.com/apps/1322977046248770/settings/basic/

Fill in these 3 required fields:

### A. Privacy Policy URL
```
https://brandonmills.com/privacy
```

### B. App Icon
- **Size:** 1024 x 1024 pixels
- **Options:**
  - Quick: Download from https://placeholder.com/1024x1024
  - Better: Use your logo/profile pic (resize to 1024x1024)

### C. Category
- Select: **"Business and Pages"**

**Action:** Click "Save Changes" at bottom

---

## Step 2: Generate Fresh Instagram Access Tokens

### For Main Account (@dopam.mills)

**URL:** https://developers.facebook.com/tools/explorer

1. Click **"Generate Instagram Access Token"** button
2. Authorize the app when prompted
3. Copy the new short-lived token
4. **Exchange for long-lived token:**

```bash
curl "https://graph.facebook.com/v24.0/oauth/access_token?grant_type=fb_exchange_token&client_id=1322977046248770&client_secret=04567d41bbaee516f732e48493c208e6&fb_exchange_token=SHORT_LIVED_TOKEN_HERE"
```

5. Copy the `access_token` from response (valid for 60 days)

### For Jesse's Account (@lab.of.living)

**Repeat same process:**
1. Switch to Jesse's Instagram account in Graph API Explorer
2. Generate token
3. Exchange for long-lived version
4. Copy the `access_token`

---

## Step 3: Update Vercel Environment Variables

**URL:** https://vercel.com/brandons-projects-c4dfa14a/webdesigner/settings/environment-variables

Update these two variables:

| Variable Name | Value | Account |
|---------------|-------|---------|
| `INSTAGRAM_ACCESS_TOKEN` | [Long-lived token from Step 2A] | @dopam.mills |
| `JESSE_INSTAGRAM_ACCESS_TOKEN` | [Long-lived token from Step 2B] | @lab.of.living |

**Action:** Click "Save" for each variable

---

## Step 4: Redeploy Vercel

```bash
npx vercel --prod
```

Wait for deployment to complete (2-3 minutes).

---

## Step 5: Verify Instagram Automation Working

### Test Main Account
```bash
curl "https://brandonmills.com/api/cron/authentic-social-post?platform=instagram"
```

**Expected:** JSON response with `"posted": true`

### Test Jesse's Account
```bash
curl "https://brandonmills.com/api/cron/jesse-book-post"
```

**Expected:** JSON response with `"success": true`

### Check Health Endpoint
```bash
curl "https://brandonmills.com/api/integrations/health"
```

**Expected:** Instagram status should be `"healthy"`, not `"down"`

---

## Step 6: Set Up Token Refresh Automation (Optional but Recommended)

Instagram tokens expire every 60 days. To avoid this happening again:

### Option A: Manual Reminder
- Set calendar reminder for 50 days from now
- Repeat Steps 2-4

### Option B: Automated Refresh (Future Enhancement)
- Create cron job that refreshes tokens automatically before expiry
- Runs weekly, checks if token expires in < 10 days
- Auto-refreshes and updates Vercel

Want me to build this when we're back online?

---

## Step 7: Enable GitHub Actions Monitoring

**URL:** https://github.com/mrbrandonmills/Webdesigner/settings/secrets/actions

Add these 3 secrets:

| Secret Name | Value | Where to Get |
|-------------|-------|--------------|
| `VERCEL_TOKEN` | Get from https://vercel.com/account/tokens | Click "Create Token" |
| `VERCEL_ORG_ID` | Run `vercel project ls` | Shows as `org_xxx` |
| `VERCEL_PROJECT_ID` | Run `vercel project ls` | Shows as `prj_xxx` |

This enables the monitoring system that will alert you via GitHub Issues if:
- Builds fail
- Cron jobs stop running
- Deployments error out

**Prevents:** Another 60+ hour outage like the apostrophe bug.

---

## Success Checklist

After completing all steps, verify:

- [ ] Health endpoint shows Instagram: "healthy"
- [ ] Main account (@dopam.mills) can post manually
- [ ] Jesse's account (@lab.of.living) can post manually
- [ ] Cron jobs scheduled in Vercel (check vercel.json)
- [ ] GitHub monitoring workflow active
- [ ] Next post scheduled within 24 hours

---

## Quick Reference

**Health Check:**
```bash
curl https://brandonmills.com/api/integrations/health | python3 -m json.tool
```

**Manual Test Post (Main):**
```bash
curl "https://brandonmills.com/api/cron/authentic-social-post?platform=instagram"
```

**Manual Test Post (Jesse):**
```bash
curl "https://brandonmills.com/api/cron/jesse-book-post"
```

**Check Deployment Status:**
```bash
npx vercel ls --prod | head -5
```

---

## What's Working Right Now

✅ **Twitter** - Posting 4x/day (9am, 1pm, 5pm, 9pm)
✅ **Pinterest** - Posting 4x/day (9:15am, 1:15pm, 5:15pm, 9:15pm)
✅ **Blog** - Daily posts at 10am
✅ **Shop** - 30+ Amazon affiliate products restored
✅ **HN/Reddit** - Enhanced error detection with screenshots
✅ **Monitoring** - GitHub Actions workflow ready (needs secrets)
✅ **Stripe** - Payment processing functional
✅ **Printful** - Print-on-demand active

❌ **Instagram (Main)** - Token expired Nov 20
❌ **Instagram (Jesse)** - Token expired Nov 20

---

## Support

If you run into issues:

1. Check `/docs/MONITORING-SETUP.md` for monitoring system details
2. Review health endpoint for specific error messages
3. Check Vercel deployment logs: https://vercel.com/brandons-projects-c4dfa14a/webdesigner
4. Verify environment variables are set correctly

---

**Estimated Time:** 30-45 minutes
**Priority:** HIGH - Revenue systems down
**Next Token Refresh:** 60 days from completion date
