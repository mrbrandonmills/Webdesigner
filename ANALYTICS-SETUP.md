# Google Analytics 4 Setup Guide

This guide will help you set up Google Analytics 4 (GA4) tracking on your Brandon Mills website to track user behavior, conversions, and revenue.

## Table of Contents

1. [Overview](#overview)
2. [Create GA4 Property](#create-ga4-property)
3. [Get Your Measurement ID](#get-your-measurement-id)
4. [Configure Environment Variables](#configure-environment-variables)
5. [Deploy to Production](#deploy-to-production)
6. [Set Up Conversion Tracking](#set-up-conversion-tracking)
7. [Events Being Tracked](#events-being-tracked)
8. [Verify Tracking](#verify-tracking)
9. [View Reports](#view-reports)

---

## Overview

The website now has comprehensive Google Analytics 4 tracking integrated across all key pages and interactions. This gives you complete visibility into:

- **User Behavior**: Page views, session duration, bounce rates
- **Affiliate Performance**: Amazon product clicks and revenue
- **Digital Product Sales**: Meditation purchases and revenue
- **Content Engagement**: Audio plays, reading time, gallery interactions
- **Conversion Funnels**: From visit to purchase

---

## Create GA4 Property

1. **Go to Google Analytics**
   - Visit https://analytics.google.com/
   - Sign in with your Google account

2. **Create a New Property**
   - Click "Admin" (bottom left gear icon)
   - In the Property column, click "Create Property"
   - Property name: `Brandon Mills Website`
   - Reporting time zone: Select your timezone
   - Currency: USD
   - Click "Next"

3. **Configure Property Details**
   - Industry category: `Arts & Entertainment` or `Professional Services`
   - Business size: Select appropriate size
   - Click "Next"

4. **Set Business Objectives**
   - Select: "Generate leads" and "Examine user behavior"
   - Click "Create"

5. **Accept Terms of Service**
   - Review and accept the GA4 Terms of Service
   - Complete the data processing agreement

---

## Get Your Measurement ID

1. **Set Up Data Stream**
   - After creating the property, you'll be prompted to set up a data stream
   - Choose "Web"
   - Website URL: `https://brandonmills.com`
   - Stream name: `Brandon Mills Main Site`
   - Click "Create stream"

2. **Copy Your Measurement ID**
   - Your Measurement ID will be displayed at the top
   - Format: `G-XXXXXXXXXX` (e.g., `G-ABC123XYZ`)
   - Copy this ID - you'll need it in the next step

---

## Configure Environment Variables

### Development (.env.local)

1. **Add to Your Local Environment**
   ```bash
   # In your .env.local file (do NOT commit this file)
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```
   Replace `G-XXXXXXXXXX` with your actual measurement ID.

### Production (Vercel)

1. **Add to Vercel Environment Variables**
   - Go to https://vercel.com/dashboard
   - Select your project
   - Go to "Settings" → "Environment Variables"
   - Add new variable:
     - **Name**: `NEXT_PUBLIC_GA_MEASUREMENT_ID`
     - **Value**: Your GA4 measurement ID (G-XXXXXXXXXX)
     - **Environment**: Production (and Preview if desired)
   - Click "Save"

2. **Redeploy**
   - After adding the environment variable, trigger a new deployment
   - GA4 tracking will only be active in production builds

---

## Deploy to Production

1. **Commit Your Changes** (if not already done)
   ```bash
   git add .
   git commit -m "feat: add Google Analytics 4 tracking"
   git push origin main
   ```

2. **Verify Deployment**
   - Vercel will automatically deploy your changes
   - Wait for deployment to complete
   - Visit your live site to verify tracking is active

---

## Set Up Conversion Tracking

Google Analytics 4 automatically tracks many events, but you should mark key events as "conversions" for better reporting.

### Mark Events as Conversions

1. **Go to Events Configuration**
   - In GA4 Admin → Property → Data display → Events
   - Wait 24-48 hours for events to start appearing

2. **Mark These Events as Conversions:**
   - ✅ `purchase` - Meditation and book purchases
   - ✅ `amazon_click` - Affiliate link clicks
   - ✅ `begin_checkout` - Users starting checkout
   - ✅ `form_submit` - Contact form submissions
   - ✅ `sign_up` - Newsletter signups

3. **How to Mark as Conversion:**
   - Find the event in the list
   - Toggle the "Mark as conversion" switch to ON
   - The event will now appear in conversion reports

### Set Up Enhanced Ecommerce (Optional)

For detailed product performance tracking:

1. **Enable Enhanced Measurement**
   - Go to Admin → Data Streams → Your web stream
   - Click "Enhanced measurement"
   - Ensure these are enabled:
     - Page views
     - Scrolls
     - Outbound clicks
     - Site search
     - Video engagement

---

## Events Being Tracked

The website automatically tracks these events:

### Ecommerce Events

| Event | Description | When Triggered |
|-------|-------------|---------------|
| `purchase` | Meditation/book purchase completed | After successful Stripe checkout |
| `begin_checkout` | User starts checkout process | Click "Unlock" on meditation page |
| `add_to_cart` | Product added to cart | Add item to shopping cart |
| `amazon_click` | Amazon affiliate link clicked | Click "View Product" on gear page |

### Engagement Events

| Event | Description | When Triggered |
|-------|-------------|---------------|
| `audio_play` | Audio content played | Play button clicked on any audio |
| `audio_complete` | Audio playback finished | User listens to entire audio file |
| `form_submit` | Contact form submitted | Submit contact/inquiry form |
| `sign_up` | Newsletter signup | User subscribes to newsletter |
| `social_interaction` | Social media interaction | Click social media links |
| `video_start` | Video playback started | User plays video content |
| `gallery_interaction` | Gallery image interaction | View/zoom/download images |

### Custom Events

| Event | Description | Parameters Sent |
|-------|-------------|----------------|
| `amazon_click` | Affiliate product click | product_name, product_price, category |
| `audio_play` | Audio playback | content_type, content_id, content_name |
| `audio_complete` | Audio finished | content_type, content_id, duration_seconds |

---

## Verify Tracking

### Real-Time Verification

1. **Use GA4 Real-Time Report**
   - Go to Reports → Realtime
   - Visit your live website
   - Perform actions (click affiliate links, play audio, etc.)
   - Events should appear in real-time report within 30 seconds

2. **Check DebugView (Advanced)**
   - Install Google Analytics Debugger Chrome extension
   - Visit your site with debugger enabled
   - Go to Admin → DebugView in GA4
   - See detailed event tracking in real-time

### Test Key Events

✅ **Test Checklist:**
- [ ] Visit homepage → Check page_view event
- [ ] Click Amazon product link → Check amazon_click event
- [ ] Play audio content → Check audio_play event
- [ ] Start meditation checkout → Check begin_checkout event
- [ ] Complete purchase (test mode) → Check purchase event
- [ ] Submit contact form → Check form_submit event

---

## View Reports

### Key Reports to Monitor

1. **Acquisition Overview**
   - Reports → Acquisition → Overview
   - See where your traffic comes from

2. **Engagement Overview**
   - Reports → Engagement → Overview
   - See most viewed pages and user engagement

3. **Monetization Overview**
   - Reports → Monetization → Overview
   - Track revenue from meditation sales
   - View purchase funnel and conversion rates

4. **Ecommerce Purchases**
   - Reports → Monetization → Ecommerce purchases
   - Detailed transaction data
   - Product performance metrics

5. **Events**
   - Reports → Engagement → Events
   - See all tracked events and their counts
   - Analyze custom events (audio_play, amazon_click, etc.)

### Create Custom Reports

1. **Amazon Affiliate Performance**
   - Go to Explore → Create new exploration
   - Add dimension: Event name = `amazon_click`
   - Add metrics: Event count, product_name, product_price
   - View which products get the most clicks

2. **Audio Engagement**
   - Dimension: content_type, content_name
   - Metrics: audio_play count, audio_complete count
   - Calculate completion rate: completes / plays

3. **Revenue by Source**
   - Dimension: Source/Medium
   - Metrics: Purchase revenue, Transactions
   - See which traffic sources generate sales

---

## Data Privacy Compliance

The GA4 implementation follows privacy best practices:

- ✅ Loads only in production environment
- ✅ Uses Google's recommended script loading method
- ✅ No personally identifiable information (PII) is collected
- ✅ Respects user privacy settings
- ✅ Anonymous IP collection (GA4 default)

### Privacy Policy Update

Ensure your privacy policy mentions:
- Use of Google Analytics for website analytics
- Data collected (cookies, usage data)
- Link to Google's privacy policy
- User opt-out options

---

## Troubleshooting

### Events Not Appearing

1. **Check Environment Variable**
   ```bash
   # Verify it's set in production
   echo $NEXT_PUBLIC_GA_MEASUREMENT_ID
   ```

2. **Verify Production Build**
   - GA4 only loads in production (NODE_ENV=production)
   - Test in production environment, not localhost

3. **Clear Browser Cache**
   - Hard refresh your site (Cmd+Shift+R / Ctrl+Shift+F5)
   - Clear cookies and cached data

4. **Check Browser Console**
   - Open browser DevTools → Console
   - Look for any GA4-related errors
   - Verify gtag.js loaded successfully

### Revenue Not Tracking

1. **Verify Purchase Events**
   - Check that purchase event fires on success page
   - Ensure transaction_id is unique
   - Verify value and currency are set correctly

2. **Check Event Parameters**
   - Go to DebugView in GA4
   - Complete a test purchase
   - Verify all ecommerce parameters are present

---

## Advanced Features

### Set Up Goals/Conversions

1. **Conversion Path Analysis**
   - Track user journey from landing to purchase
   - Identify drop-off points in funnel

2. **Audience Segmentation**
   - Create segments for buyers vs browsers
   - Target remarketing campaigns

3. **Custom Dimensions**
   - Track meditation voice preference
   - Track product categories
   - Analyze user preferences

### Integration with Google Ads

1. **Link GA4 to Google Ads**
   - Admin → Product links → Google Ads
   - Import conversions to Google Ads
   - Use GA4 audiences for remarketing

---

## Support

### Need Help?

- **Google Analytics Help**: https://support.google.com/analytics
- **GA4 Documentation**: https://developers.google.com/analytics/devguides/collection/ga4
- **Implementation Issues**: Check `/lib/analytics.ts` for tracking code

### Useful Resources

- [GA4 Event Reference](https://support.google.com/analytics/answer/9267735)
- [GA4 Ecommerce Events](https://developers.google.com/analytics/devguides/collection/ga4/ecommerce)
- [GA4 Real-Time Report](https://support.google.com/analytics/answer/9271392)

---

## Summary

You now have comprehensive analytics tracking across your entire website! 🎉

**What's Tracked:**
✅ All page views and user sessions
✅ Amazon affiliate link clicks with product data
✅ Meditation purchases with revenue tracking
✅ Audio playback and engagement metrics
✅ Contact form submissions
✅ Social media interactions

**Next Steps:**
1. Get your GA4 measurement ID
2. Add to Vercel environment variables
3. Deploy and verify tracking
4. Mark key events as conversions
5. Start analyzing your data!

Your analytics will start collecting data immediately after deployment. Reports become more valuable over time as you accumulate historical data.
