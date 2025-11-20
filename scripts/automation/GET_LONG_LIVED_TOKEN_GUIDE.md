# Get Long-Lived PAGE Access Token for Instagram

## Problem

You keep getting **short-lived USER tokens** that expire in 1-2 hours. Instagram automation needs a **long-lived PAGE token** that lasts 60 days.

## Solution

This script converts your short-lived USER token into a long-lived PAGE token automatically.

---

## Quick Start

### 1. Get Your Current Token

Go to the Facebook Graph API Explorer:
- **URL**: https://developers.facebook.com/tools/explorer/
- Select your app: `Dopamills` (App ID: 1322977046248770)
- Click **"Generate Access Token"**
- Copy the token that appears

### 2. Run the Script

```bash
npm run automate:instagram:token
```

### 3. Follow the Prompts

The script will:
1. Ask you to paste your current token
2. Exchange it for a long-lived USER token (60 days)
3. Get your Facebook Pages
4. Find the Dopamills page (ID: 918484411342370)
5. Get the PAGE access token for that page
6. Test the connection to Instagram
7. Update your `.env.local` file

### 4. Done!

Your `.env.local` will be updated with:
```env
INSTAGRAM_ACCESS_TOKEN=<long-lived-page-token>
```

---

## How It Works

### Token Types Explained

| Token Type | Duration | Use Case | What You Have |
|------------|----------|----------|---------------|
| **Short-lived USER** | 1-2 hours | Testing | ❌ Current problem |
| **Long-lived USER** | 60 days | Personal use | ⚠️ Not ideal |
| **PAGE** | 60 days | Business/Automation | ✅ What you need |

### Why PAGE Tokens?

1. **Longer Duration**: 60 days vs 1-2 hours
2. **Auto-Refresh**: Can be refreshed to never expire
3. **Proper Permissions**: Tied to your Facebook Page → Instagram Business Account
4. **Stability**: Won't expire when you log out

---

## What The Script Does

```
Your Short-Lived USER Token (1-2 hours)
         ↓
   [Exchange with FB Graph API]
         ↓
Long-Lived USER Token (60 days)
         ↓
   [Get Your Facebook Pages]
         ↓
Find Dopamills Page (918484411342370)
         ↓
   [Get PAGE Access Token]
         ↓
Long-Lived PAGE Token (60 days) ✅
         ↓
   [Test Instagram Connection]
         ↓
Save to .env.local
```

---

## API Endpoints Used

1. **Exchange for Long-Lived USER Token**
   ```
   GET https://graph.facebook.com/v18.0/oauth/access_token
   ?grant_type=fb_exchange_token
   &client_id=1322977046248770
   &client_secret=176dc5e6afaabc9c22e59708218a1f14
   &fb_exchange_token=<your-token>
   ```

2. **Get Your Pages**
   ```
   GET https://graph.facebook.com/v18.0/me/accounts
   ?access_token=<long-lived-user-token>
   ```

3. **Get Instagram Business Account**
   ```
   GET https://graph.facebook.com/v18.0/918484411342370
   ?fields=instagram_business_account
   &access_token=<page-token>
   ```

---

## Credentials from .env.local

The script uses these from your `.env.local`:

```env
META_APP_ID=1322977046248770
META_APP_SECRET=176dc5e6afaabc9c22e59708218a1f14
FACEBOOK_PAGE_ID=918484411342370
```

---

## Troubleshooting

### Error: "Invalid token"

**Problem**: Token is too short or malformed

**Solution**:
- Go back to Graph API Explorer
- Make sure you clicked "Generate Access Token"
- Copy the entire token (100+ characters)

### Error: "Dopamills page not found"

**Problem**: You're not an admin of the page, or using wrong account

**Solution**:
- Make sure you're logged into Facebook as the page owner
- Verify the Page ID matches: 918484411342370
- Check you have admin access to the Dopamills page

### Error: "No Instagram Business Account"

**Problem**: Instagram not connected to Facebook Page

**Solution**:
1. Go to your Facebook Page settings
2. Click "Instagram" in left sidebar
3. Connect your Instagram Business account
4. Run the script again

### Error: "App ID or Secret incorrect"

**Problem**: Wrong credentials in `.env.local`

**Solution**:
- Verify credentials at: https://developers.facebook.com/apps/1322977046248770/settings/basic/
- Update `.env.local` with correct values

---

## Next Steps After Getting Token

### 1. Test the Token

```bash
npm run automate:instagram:dry
```

This does a dry-run post (doesn't actually post).

### 2. Start Automated Posting

```bash
npm run automate:instagram
```

Posts 4x per day automatically.

### 3. Set Up Auto-Refresh

```bash
npm run automate:instagram:sync
```

Automatically refreshes the token before it expires (60 days).

---

## Manual Token Refresh (Advanced)

If you want to manually refresh the token before it expires:

```bash
# Get current token info
curl "https://graph.facebook.com/v18.0/debug_token?input_token=YOUR_TOKEN&access_token=YOUR_TOKEN"

# Check expiration date in response
```

---

## Files Modified

- **Created**: `/scripts/automation/get-long-lived-token.ts`
- **Updated**: `/package.json` (added `automate:instagram:token` script)
- **Updates**: `/.env.local` (saves new token)

---

## Security Notes

- ✅ Token is stored in `.env.local` (not committed to git)
- ✅ `.env.local` is in `.gitignore`
- ✅ Script never exposes your app secret
- ⚠️ Never share your access token publicly
- ⚠️ Never commit `.env.local` to version control

---

## Support

If you encounter issues:

1. Check the troubleshooting section above
2. Verify credentials in `.env.local`
3. Check Facebook App settings
4. Make sure Instagram is connected to page

---

## Summary

**Before**: Short-lived USER token (1-2 hours) ❌
**After**: Long-lived PAGE token (60 days) ✅

**Command**: `npm run automate:instagram:token`

**Time**: ~2 minutes

**Credentials Needed**:
- Current short-lived token from Graph API Explorer
- Credentials already in `.env.local`

**Result**:
- Working 60-day PAGE access token
- Updated `.env.local`
- Ready for Instagram automation

🎉 **You're ready to automate Instagram!**
