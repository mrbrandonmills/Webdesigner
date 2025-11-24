# Pinterest OAuth Integration - Root Cause Analysis & Rundown for ChatGPT

**CRITICAL BUSINESS CONTEXT**: This integration is blocking revenue generation. Pinterest Standard Access approval is required to programmatically post content at scale.

## The Fundamental Problem

Pinterest rejected the first approval video submission because it didn't show "the integration within your app" and "the full OAuth flow in a browser". They require seeing:
1. User clicks "Connect to Pinterest" in a web app
2. Browser redirects to Pinterest login
3. User authorizes the app
4. App receives authorization code
5. App exchanges code for access token
6. App creates a pin using the token
7. Pin appears on Pinterest.com

## Current Status: OAuth Token Exchange Failing

After 10+ hours of troubleshooting, the OAuth flow consistently fails with **"Authentication failed"** error during the token exchange step (step 4 above).

### Error Details
- **URL Error**: `https://www.brandonmills.com/pinterest-oauth-demo?error=Authentication%20failed`
- **Server Logs**: Pinterest API returns 401 Unauthorized when exchanging authorization code for access token
- **Endpoint**: `POST https://api.pinterest.com/v5/oauth/token`

## What's Been Tried (All Failed)

1. ✅ Created public OAuth demo page at `/pinterest-oauth-demo`
2. ✅ Fixed redirect loops (www vs non-www)
3. ✅ Fixed callback routes (admin vs public)
4. ✅ Regenerated app secret multiple times
5. ✅ Updated Vercel environment variables
6. ✅ Verified redirect URI matches Pinterest app settings: `https://brandonmills.com/api/pinterest/oauth/callback`
7. ✅ Implemented proper Basic Auth header (Base64 encoded app_id:app_secret)
8. ✅ Verified OAuth code is being received from Pinterest
9. ❌ Token exchange continues to fail with "Authentication failed"

## Root Cause Hypotheses (Not Yet Tested)

### Hypothesis 1: Redirect URI Mismatch (www vs non-www)
**Pinterest app dashboard might have ONLY** `https://brandonmills.com/api/pinterest/oauth/callback` registered, but the OAuth flow might be sending users to `https://www.brandonmills.com`, causing Pinterest to reject the authorization code when it's used from a different domain.

**Test**: Add BOTH redirect URIs to Pinterest app:
- `https://brandonmills.com/api/pinterest/oauth/callback`
- `https://www.brandonmills.com/api/pinterest/oauth/callback`

### Hypothesis 2: Trial Access Limitations
The Pinterest app is still in "Trial Access" mode. While OAuth is technically supported, there may be additional verification or app configuration required on Pinterest's developer dashboard that isn't documented.

**Test**: Check Pinterest developer dashboard for:
- App verification status
- API access tier (Trial vs Standard)
- Any pending verification steps
- Error logs or warnings

### Hypothesis 3: Authorization Code Timeout
Pinterest authorization codes expire quickly (typically 60 seconds). If there's any delay in the redirect chain or token exchange, the code becomes invalid.

**Test**: Add timestamp logging to measure time between:
- Pinterest redirect (code received)
- Token exchange POST request

### Hypothesis 4: CORS or Origin Issues
The OAuth callback is server-side (Next.js API route), but there might be CORS issues or origin validation failing because the app is making requests from a Vercel deployment.

**Test**: Try OAuth flow from `localhost:3000` to see if the token exchange succeeds locally.

### Hypothesis 5: App Secret Encoding Issue
The app secret contains special characters that might need URL encoding or different handling in the Basic Auth header.

**Current App Secret**: `5622572870c8bb2d30afd94394ef5db31196f78c`
**Current App ID**: `1537033`
**Current Basic Auth**: `Buffer.from(`${appId}:${appSecret}`).toString('base64')`

**Test**: Verify the exact format Pinterest expects for Basic Auth (some APIs use different encoding schemes).

## Alternative Approach: Sandbox Token

User provided a working sandbox access token that can create pins directly without OAuth. However, **this won't satisfy Pinterest's approval requirements** because it skips the OAuth flow entirely.

**Sandbox Token**: `pina_AMAQS5AXABS7EBAAGDANUDAFVNR3PGQBQBIQCZFIDAMGMP2ERSWTM4AIP7ARGP265X7F6XFEGLRI4YKBMPTWHD6WGRO32TYA`

This token works for API calls but doesn't demonstrate the "full OAuth flow" that Pinterest wants to see in the approval video.

## Technical Stack

- **Framework**: Next.js 15 (App Router)
- **Deployment**: Vercel Production
- **Domain**: brandonmills.com (no www redirect)
- **Demo Page**: `/pinterest-oauth-demo` (public, no auth required)
- **Callback Route**: `/app/api/pinterest/oauth/callback/route.ts`
- **Environment Variables**: Set in both `.env.local` and Vercel Production

## Files Involved

### `/app/pinterest-oauth-demo/page.tsx`
Public OAuth demo page with 4-step flow UI. Currently modified to use sandbox token (skips OAuth).

### `/app/api/pinterest/oauth/callback/route.ts`
Receives authorization code from Pinterest and exchanges it for access token. **This is where token exchange fails with "Authentication failed"**.

Key code snippet:
```typescript
const tokenUrl = 'https://api.pinterest.com/v5/oauth/token'
const credentials = Buffer.from(`${appId}:${appSecret}`).toString('base64')

const body = new URLSearchParams({
  grant_type: 'authorization_code',
  code: code,
  redirect_uri: redirectUri
})

const response = await fetch(tokenUrl, {
  method: 'POST',
  headers: {
    'Authorization': `Basic ${credentials}`,
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  body: body.toString()
})

// response.ok is false, data contains "Authentication failed"
```

### Environment Variables
```
PINTEREST_APP_ID=1537033
PINTEREST_APP_SECRET=5622572870c8bb2d30afd94394ef5db31196f78c
PINTEREST_REDIRECT_URI=https://brandonmills.com/api/pinterest/oauth/callback
```

## What ChatGPT Should Focus On

1. **Why is Pinterest API returning "Authentication failed" during token exchange?**
   - Is the redirect URI exact match critical?
   - Is there a Trial Access limitation we're hitting?
   - Is the Basic Auth header format correct?
   - Is the authorization code timing out?

2. **What's the actual root cause of the token exchange failure?**
   - Not surface-level fixes like "update environment variables"
   - Need to identify the exact reason Pinterest is rejecting the credentials

3. **How can we verify the Pinterest app configuration?**
   - What settings on Pinterest developer dashboard might be wrong?
   - Are there any app verification steps needed?
   - Should we delete and recreate the app?

4. **Is there a way to get detailed error logs from Pinterest?**
   - The current error message "Authentication failed" is too vague
   - How can we get more specific error codes or reasons?

## Success Criteria

A working flow where:
1. User visits `https://brandonmills.com/pinterest-oauth-demo`
2. Clicks "Connect to Pinterest"
3. Logs into Pinterest and authorizes the app
4. Gets redirected back to the demo page with a valid access token
5. Can select a board and create a pin
6. Pin appears on Pinterest.com
7. **No "Authentication failed" errors**

## Time Spent: 10+ hours with no resolution

The user is extremely frustrated because every attempted fix has been superficial (updating env vars, regenerating secrets, fixing redirects) without addressing the root cause of why Pinterest API rejects the token exchange.
