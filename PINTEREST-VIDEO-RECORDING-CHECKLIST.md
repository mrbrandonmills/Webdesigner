# 🎬 Pinterest Standard Access - Video Recording Checklist

## ✅ BEFORE YOU START

### 1. Pinterest Developer Console Setup (DO THIS FIRST!)
Go to: https://developers.pinterest.com/apps/1537033/settings

**Redirect URIs:** Remove ALL except this ONE:
```
https://brandonmills.com/api/pinterest/oauth/callback
```

**Important:**
- Type it in
- Press ENTER
- Click "Save"
- REFRESH the page to verify it saved
- Make sure there's NO `www.` in front

### 2. Deploy to Production
```bash
cd "/Volumes/Super Mastery/Webdesigner"
git add .
git commit -m "Fix Pinterest Standard Access demo: use production API"
git push
```

Wait 2-3 minutes for Vercel to deploy.

### 3. Test Manually FIRST (Don't Record Yet!)
1. Go to: https://brandonmills.com/admin/pinterest-demo
2. Click "Connect to Pinterest"
3. Authorize the app
4. Make sure you see Step 2 (token displayed)
5. Click "Fetch Boards"
6. Make sure boards load
7. Create a pin
8. Verify it appears on Pinterest

**If ANY step fails, STOP and fix it before recording.**

---

## 🎥 RECORDING THE VIDEO

### Tools Needed:
- **Screen Recorder**: QuickTime (Mac) or OBS
- **Browser**: Chrome or Safari
- **Duration Target**: 2-3 minutes

### Recording Steps:

**[START RECORDING]**

#### 1. Show the Demo Page (5 seconds)
- Navigate to: https://brandonmills.com/admin/pinterest-demo
- Show the header: "Pinterest OAuth & API Demo"
- Show Step 1 visible

#### 2. Start OAuth Flow (30 seconds)
- Click "Connect to Pinterest" button
- **SHOW:** Pinterest login page (if prompted)
- **SHOW:** Pinterest authorization page
- **SHOW:** Scopes requested (boards:read, boards:write, pins:read, pins:write)
- Click "Allow" or "Give access"

#### 3. Show Redirect & Token Exchange (15 seconds)
- **PAUSE on the URL bar** - show the `?code=xxxxx` parameter (2-3 seconds)
- **SHOW:** Page automatically redirects back to brandonmills.com
- **SHOW:** Step 2 displays "OAuth Success! 🎉"
- **SHOW:** Access token displayed in green box

#### 4. Fetch Boards via API (15 seconds)
- Click "Fetch Boards (API Call)" button
- **SHOW:** Loading state
- **SHOW:** Step 3 appears with board dropdown populated
- **SHOW:** Your boards listed in the dropdown

#### 5. Create Pin (30 seconds)
- **SHOW:** Pin details displayed (title, description, link, image)
- Select a board from the dropdown
- Click "Create Pin on Pinterest" button
- **SHOW:** Loading state
- **SHOW:** Step 4 displays "Pin Created! 🎉"
- **SHOW:** Pin ID and details displayed

#### 6. Verify on Pinterest (30 seconds)
- Click "View Pin on Pinterest →" button
- **SHOW:** New tab opens to Pinterest.com
- **SHOW:** The pin you just created is visible
- **SHOW:** Pin title, description, and image match what you created
- **OPTIONAL:** Navigate to the board to show the pin listed there

**[STOP RECORDING]**

---

## 📝 WHAT PINTEREST NEEDS TO SEE

Make sure your video clearly shows:

- ✅ **Browser-based OAuth** (not terminal or Postman)
- ✅ **Pinterest login page** (if you're logged out)
- ✅ **Authorization screen** with "Allow" button
- ✅ **Authorization code** in URL bar (`?code=`)
- ✅ **Token exchange** happening (access token displayed)
- ✅ **API integration within your app** (boards fetch, pin creation)
- ✅ **User-facing interface** (dropdowns, buttons, forms)
- ✅ **Verification** (pin actually exists on Pinterest.com)

---

## 🚫 COMMON MISTAKES TO AVOID

- ❌ Don't show terminal/Postman OAuth flows
- ❌ Don't rush through the OAuth authorization page
- ❌ Don't skip showing the authorization code in the URL
- ❌ Don't skip showing the access token
- ❌ Don't just show API endpoints - show the UI
- ❌ Don't skip verification on Pinterest.com

---

## 📤 AFTER RECORDING

### 1. Upload Video
- **YouTube (Unlisted)**: https://youtube.com/upload
- **OR Loom**: https://loom.com

### 2. Reply to Pinterest Email
Find the rejection email from Pinterest (from Eloise or Pinterest API team).

**Email Template:**
```
Subject: Re: Pinterest Standard Access - Updated Demo Video

Hi [Name],

I've updated my demo video to show the complete Pinterest integration within my web application.

Video Link: [YOUR VIDEO LINK]

The video demonstrates:

1. Complete OAuth flow in browser (login → authorize → code → token exchange)
2. Pinterest integration within my application's user interface
3. API calls to fetch boards and create pins
4. User-facing interaction (selecting boards via dropdown, viewing pin details)
5. Verification that the pin was successfully created on Pinterest.com

This is a production application at brandonmills.com where users can connect their Pinterest account and create pins directly through the web interface without leaving the site.

Please let me know if you need any additional information.

Thank you!
Brandon Mills
brandonmills.com
```

---

## ⏱️ ESTIMATED TIMELINE

- Video recording: 15 minutes (including 1-2 retakes)
- Upload to YouTube/Loom: 5 minutes
- Email response: 2 minutes
- **Pinterest review**: 1-3 business days

---

## 🆘 TROUBLESHOOTING

### If OAuth fails with "redirect_uri mismatch":
1. Check Pinterest Developer Console has ONLY: `https://brandonmills.com/api/pinterest/oauth/callback`
2. No www, no trailing slash, exact match
3. Make sure it saved (refresh the page to verify)

### If you get a 404 after authorization:
1. Verify `.env.local` has: `PINTEREST_REDIRECT_URI=https://brandonmills.com/api/pinterest/oauth/callback`
2. Redeploy to Vercel
3. Clear browser cache

### If boards don't load:
1. Check browser console for errors (F12)
2. Make sure you're using production API (not sandbox)
3. Verify access token has correct scopes

### If pin creation fails:
1. Make sure board_id is from the dropdown
2. Check that image URL is valid and accessible
3. Verify you're using production API: `api.pinterest.com`

---

## ✅ FINAL CHECKLIST

Before you hit record:

- [ ] Pinterest Developer Console has correct redirect URI
- [ ] Code deployed to production
- [ ] Tested manually end-to-end (all 4 steps work)
- [ ] Logged into Pinterest in browser
- [ ] Screen recorder ready
- [ ] Browser window clean (close extra tabs)
- [ ] Ready to show complete flow in 2-3 minutes

**YOU GOT THIS!** 🎬

The demo page already has everything Pinterest wants to see. Just record it working.
