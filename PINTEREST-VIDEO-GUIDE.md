# Pinterest Standard Access - Video Recording Guide

## 🎯 Purpose

Pinterest rejected your previous video because it didn't show:
1. **Complete OAuth flow** (login → authorize → code → access token)
2. **API integration** (creating a pin via API)
3. **Verification** (showing the created pin on Pinterest)

This guide will help you record the PERFECT approval video.

---

## ⚙️ Setup (Do This FIRST)

### 1. Get Your App Secret

Go to https://developers.pinterest.com/apps/ and:

1. Click on your app (App ID: 1537033)
2. Copy the **App Secret**
3. Update `.env.local`:
   ```bash
   PINTEREST_APP_SECRET=YOUR_ACTUAL_SECRET_HERE
   ```

### 2. Register Redirect URI

In your Pinterest app settings, make sure this redirect URI is registered:
```
https://brandonmills.com/api/pinterest/oauth/callback
```

### 3. Deploy to Production

The OAuth flow MUST work on your live site (brandonmills.com), not localhost.

```bash
git add -A
git commit -m "Add Pinterest OAuth demo for Standard Access approval"
git push
```

Wait 2-3 minutes for Vercel deployment to complete.

---

## 📹 Recording the Video

### Tools You Need

- **Screen Recorder**: QuickTime (Mac) or OBS Studio (Windows/Mac)
- **Browser**: Chrome or Firefox
- **Duration**: 2-3 minutes max

### Recording Steps

#### **STEP 1: Open Demo Page**

1. Start screen recording
2. Go to: `https://brandonmills.com/admin/pinterest-demo`
3. Show the page loaded with Step 1

#### **STEP 2: OAuth Flow**

1. Click "Connect to Pinterest" button
2. **SHOW:** Pinterest login page
3. **SHOW:** Log in with your Pinterest account
4. **SHOW:** Authorization screen asking for permissions
5. **SHOW:** Click "Allow" or "Give access"
6. **SHOW:** URL bar after redirect - should show `?code=XXXXX`
   - Pause here for 1-2 seconds so Pinterest can see the code
7. **SHOW:** Page automatically processes code and shows "OAuth Success!"
8. **SHOW:** Access token and refresh token displayed

#### **STEP 3: API Integration - Fetch Boards**

1. Click "Fetch Boards (API Call)" button
2. **SHOW:** Loading state
3. **SHOW:** Board dropdown populated with your boards

#### **STEP 4: API Integration - Create Pin**

1. Select a board from dropdown
2. **SHOW:** Pin details (title, description, link)
3. Click "Create Pin on Pinterest" button
4. **SHOW:** Loading state
5. **SHOW:** Success message with Pin ID

#### **STEP 5: Verification**

1. Click "View Pin on Pinterest" button
2. **SHOW:** New tab opens with Pinterest.com
3. **SHOW:** The pin you just created is visible on Pinterest
4. **Optional:** Navigate to the board to show the pin listed there

#### **STEP 6: Wrap Up**

1. Return to demo page
2. Stop screen recording

---

## 🎬 Video Checklist

Before submitting, verify your video shows:

- [ ] Pinterest login page
- [ ] Authorization screen with "Give access" button
- [ ] URL bar showing authorization code (`?code=`)
- [ ] Code exchanged for access token (token visible on screen)
- [ ] API call to fetch boards (board list populated)
- [ ] API call to create pin (loading → success)
- [ ] Pin visible on Pinterest.com (verification)

---

## 📝 What to Say (Optional Voice-Over)

If you want to add narration:

> "Here I'm demonstrating the Pinterest OAuth flow. First, I click Connect to Pinterest, which redirects to the Pinterest login page. After logging in and authorizing the app, Pinterest redirects back with an authorization code, which you can see in the URL. This code is then automatically exchanged for an access token.
>
> Now I'll demonstrate API integration by fetching my boards using the Pinterest API. You can see the boards populate in the dropdown. Next, I'll create a pin programmatically using the API. And finally, I'll verify the pin was successfully created by viewing it on Pinterest.com."

---

## 🚨 Troubleshooting

### Error: "OAuth flow is not complete"
- Make sure you showed the authorization code in the URL bar
- Make sure you showed the token exchange (access token displayed)

### Error: "API usage was not shown"
- You must show BOTH API calls: fetch boards AND create pin
- You must show the loading state and success response

### Error: "Missing verification"
- You MUST open Pinterest.com and show the pin exists
- Navigate to the board if needed to clearly show the pin

### Build fails or page doesn't load
```bash
cd "/Volumes/Super Mastery/Webdesigner"
npm run build
```
Fix any TypeScript errors before recording.

---

## 📤 Submitting the Video

1. **Upload to YouTube** (unlisted) or **Loom**
2. **Email Pinterest Support** (reply to Eloise's email):
   ```
   Hi Eloise,

   I've recorded a new demo video showing the complete OAuth flow and API integration:

   [VIDEO LINK]

   The video demonstrates:
   - Complete OAuth flow (login, authorization, code exchange, access token)
   - API integration (fetching boards, creating a pin)
   - Verification (showing the created pin on Pinterest.com)

   All steps requested in your feedback are now included.

   Thank you!
   Brandon Mills
   ```

3. **Subject Line:** "Re: Pinterest Standard Access - Updated Demo Video"

---

## ⏱️ Expected Timeline

- Video approval: 1-3 business days
- Once approved: Automation goes live at 9:15am, 1:15pm, 5:15pm, 9:15pm PST

---

## 🆘 Need Help?

If you get stuck:
1. Check browser console for errors (F12)
2. Check Vercel logs: `npx vercel logs brandonmills.com`
3. Test the OAuth flow manually first without recording

Good luck! 🎬
