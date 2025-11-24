# Pinterest "Redirect URI Does Not Match" - Complete Fix

## 🔍 Research from Other Developers

Based on Stack Overflow and GitHub issues from developers who solved this EXACT error:

### Root Cause (From Multiple Sources)

1. **Pinterest's UI Bug**: The developer console has a known bug where the Save button doesn't actually persist changes
2. **Multiple URIs Cause Conflicts**: Having multiple redirect URIs registered (with/without www, with/without trailing slash) causes validation errors
3. **Changes Don't Save Properly**: Pinterest's interface doesn't clearly show when URIs are actually registered vs. just typed

---

## ✅ The Complete Solution (From Working Developers)

### Step 1: Clean Slate
**Go to:** https://developers.pinterest.com/apps/1537033/settings

**In the "Redirect URIs" section:**
1. **DELETE ALL existing redirect URIs** (click the X on each one)
2. Make sure the section is completely empty
3. Click "Save" with everything deleted
4. **REFRESH the page** to confirm they're all gone

### Step 2: Add ONE URI Correctly
1. In the "Redirect URIs" text field, type EXACTLY:
   ```
   https://brandonmills.com/api/pinterest/oauth/callback
   ```

2. **PRESS THE ENTER KEY** (or click "Add" button if visible)
   - This is CRITICAL - typing alone doesn't register it
   - You should see the URI appear BELOW the text field
   - You should see "You have unsaved changes" message

3. Click "Save" button

4. **REFRESH THE ENTIRE PAGE** (CMD+R or F5)

5. **VERIFY**: Go back to the redirect URIs section and confirm you see:
   ```
   ✓ https://brandonmills.com/api/pinterest/oauth/callback
   ```
   - ONLY this one URI
   - No www
   - No trailing slash
   - No other variations

### Step 3: Verify the Configuration

**Checklist:**
- [ ] Only ONE redirect URI registered
- [ ] It's exactly: `https://brandonmills.com/api/pinterest/oauth/callback`
- [ ] No www
- [ ] No trailing slash
- [ ] After refreshing the page, it's still there

---

## 🚨 Common Mistakes (From Developer Reports)

### Mistake 1: Not Pressing ENTER
**Problem:** Typing the URI and clicking Save doesn't work
**Solution:** You MUST press ENTER after typing to add it to the list

### Mistake 2: Multiple URIs Registered
**Problem:** Having multiple variations causes Pinterest's validator to fail
**Solution from Stack Overflow:** "I resolved the problem by reducing the set URLs registered at developer.pinterest.com to just the one I need, then reloaded the page"

### Mistake 3: Not Reloading the Page
**Problem:** Pinterest's UI bug means changes don't always persist
**Solution:** Always refresh the page after saving to verify the URI is actually saved

### Mistake 4: Slight Variations
**Problem:** Even minor differences cause rejection:
- `https://brandonmills.com/api/pinterest/oauth/callback` ✅
- `https://www.brandonmills.com/api/pinterest/oauth/callback` ❌ (www)
- `https://brandonmills.com/api/pinterest/oauth/callback/` ❌ (trailing slash)

---

## 🔧 What We Fixed in the Code

### File: `/app/admin/pinterest-demo/page.tsx`

**Before (line 31-33):**
```typescript
const REDIRECT_URI = typeof window !== 'undefined'
  ? `${window.location.origin}/api/pinterest/oauth/callback`  // Dynamic - changes with www
  : 'https://brandonmills.com/api/pinterest/oauth/callback'
```

**After:**
```typescript
// Always use brandonmills.com (no www) to match Pinterest app settings
const REDIRECT_URI = 'https://brandonmills.com/api/pinterest/oauth/callback'
```

**Why:** The dynamic URI was causing issues when accessing via www.brandonmills.com

---

## 📋 Step-by-Step Testing Process

### 1. Verify Pinterest Console (DO THIS FIRST!)

Go to: https://developers.pinterest.com/apps/1537033/settings

Screenshot or copy-paste EXACTLY what you see in the "Redirect URIs" section.

**Should look like:**
```
Redirect URIs
https://brandonmills.com/api/pinterest/oauth/callback
```

**Should NOT look like:**
```
Redirect URIs
https://www.brandonmills.com/api/pinterest/oauth/callback
https://brandonmills.com/api/pinterest/oauth/callback
http://localhost:8085/
```

### 2. Wait for Deployment (Already Done)

The code fix is deployed. Vercel shows latest commit.

### 3. Test the OAuth Flow

1. Go to: https://brandonmills.com/admin/login
2. Login with your credentials
3. Navigate to: https://brandonmills.com/admin/pinterest-demo
4. Open browser DevTools (F12) → Network tab
5. Click "Connect to Pinterest"
6. Watch the redirect happen

**Expected Flow:**
```
brandonmills.com/admin/pinterest-demo
   ↓ (redirects to)
pinterest.com/oauth/?client_id=1537033&redirect_uri=https%3A%2F%2Fbrandonmills.com%2Fapi%2Fpinterest%2Foauth%2Fcallback
   ↓ (after authorization)
brandonmills.com/api/pinterest/oauth/callback?code=xxx
   ↓ (after token exchange)
brandonmills.com/admin/pinterest-demo?success=true&access_token=xxx
```

### 4. If You Still Get 400 Error

**Capture this information:**

1. **Screenshot of Pinterest Developer Console** showing all registered redirect URIs
2. **Screenshot of the Pinterest error page** showing the exact error
3. **Copy the URL from the browser** when the error happens
4. **Check browser console** (F12) for any JavaScript errors

---

## 🎯 Most Likely Issue Right Now

Based on other developers' experience, the most likely problem is:

**Pinterest Console Still Has Old URIs**

Even after following the steps, Pinterest sometimes caches old redirect URIs.

**Additional Steps to Try:**

1. **Log out of Pinterest Developer Console**
2. **Clear browser cache** (or use incognito/private window)
3. **Log back in** to Pinterest Developer Console
4. **Check redirect URIs again**
5. **If any old URIs are there**, delete them and repeat the process

---

## 📞 If It STILL Doesn't Work

**Create a NEW Pinterest App:**

Sometimes Pinterest apps get into a broken state. Create a fresh app:

1. Go to: https://developers.pinterest.com/apps
2. Click "Create app"
3. Name it: "Brandon Mills Website V2"
4. Add ONLY ONE redirect URI: `https://brandonmills.com/api/pinterest/oauth/callback`
5. Press ENTER
6. Save
7. Refresh page to verify
8. Copy the new App ID
9. Update `.env.local` with new App ID and Secret
10. Redeploy

---

## 📚 Sources

- Stack Overflow: https://stackoverflow.com/questions/43421225/pinterest-oauth-redirect-uri-not-working
- Stack Overflow: https://stackoverflow.com/questions/58160169/how-can-i-get-the-pinterest-api-to-accept-my-redirect-url
- GitHub: https://github.com/pinterest/pinterest-api-demo/issues/4
- Pinterest Docs: https://developers.pinterest.com/docs/getting-started/connect-app/

---

## ✅ Success Criteria

You'll know it's working when:

1. Click "Connect to Pinterest" on `/admin/pinterest-demo`
2. Pinterest authorization page loads (no 400 error)
3. Click "Allow"
4. Redirects back to your site with `?success=true&access_token=xxx`
5. Step 2 shows "OAuth Success! 🎉"

Then you can proceed to record the video for Standard Access approval.
