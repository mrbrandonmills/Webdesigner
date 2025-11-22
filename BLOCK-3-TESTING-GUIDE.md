# Block 3 Landing Page - Testing Guide

## 🎯 Overview

The Block 3 landing page is a high-converting sales funnel designed to:
1. **Capture emails** for Block 3 launch notifications
2. **Drive Amazon sales** for Books 1 & 2
3. **Generate affiliate revenue** from recommended products
4. **Track all conversions** via Google Analytics

---

## 📂 Files Created

### Main Page
- `/app/book/block-3/page.tsx` - Main landing page with all conversion elements

### Components
- `/components/email/block-3-signup-form.tsx` - Email capture form (3 variants: hero, inline, footer)
- `/components/block-3-content.tsx` - Iframe wrapper for Block 3 HTML content
- `/components/reading-progress.tsx` - Reading progress indicator

### API Routes
- `/app/api/email/subscribe/route.ts` - Resend email subscription endpoint

---

## 🧪 Testing Checklist

### 1. Email Capture Forms

#### Hero Form (Top of page)
- [ ] Enter name and email → Click "Notify Me When It Launches"
- [ ] Verify form shows loading state
- [ ] Verify success message appears with green checkmark
- [ ] Check inbox for welcome email from "Brandon Mills <brandon@brandonmills.com>"
- [ ] Verify email has proper formatting and links work
- [ ] Try submitting same email again → Should show "already subscribed" message

#### Inline Form (Middle of page)
- [ ] Test same flow as hero form
- [ ] Verify it has compact styling

#### Footer Form (Bottom of page)
- [ ] Test same flow as hero form
- [ ] Verify it appears after content

#### Error Handling
- [ ] Submit without name → Should show required field error
- [ ] Submit without email → Should show required field error
- [ ] Submit invalid email (no @) → Should show validation error
- [ ] Turn off internet → Should show error message

### 2. Amazon Book CTAs

#### "Get Books 1 & 2" Section
- [ ] Click "Volume 1: Building a Non-Addictive Life" card
- [ ] Verify opens Amazon product page in new tab
- [ ] Verify URL contains affiliate tag: `?tag=brandonmil0e-20`
- [ ] Click "Block B" card
- [ ] Verify same behavior

#### Sticky Bottom Bar
- [ ] Scroll down page → Verify bar sticks to bottom
- [ ] Click "Buy on Amazon" button
- [ ] Verify opens Volume 1 Amazon page with affiliate tag

#### Final CTA Section
- [ ] Click "Start with Book 1" card
- [ ] Verify Amazon link with affiliate tracking

### 3. Affiliate Products Section

- [ ] Scroll to "Tools for Your Journey" section
- [ ] Verify 4 featured products display with images
- [ ] Hover over product → Should scale up slightly
- [ ] Click any product
- [ ] Verify opens Amazon with correct affiliate tag: `?tag=brandonmills.com-20`
- [ ] Verify product price, rating, and image display correctly

### 4. Block 3 Content Display

- [ ] Scroll to "Read Now" section
- [ ] Verify iframe loads `/public/block-3-content.html`
- [ ] Verify Da Vinci parchment styling is preserved
- [ ] Verify fonts render correctly (Cormorant Garamond, Cinzel)
- [ ] Verify sacred geometry background patterns show
- [ ] Test on mobile → Content should be readable
- [ ] Verify iframe auto-resizes to content height

### 5. Social Share

#### Share Button (Sticky Bar)
- [ ] Click share icon in bottom sticky bar
- [ ] On mobile → Should open native share sheet
- [ ] On desktop → Should copy link to clipboard
- [ ] Verify copied URL is: `https://www.brandonmills.com/book/block-3`

### 6. Reading Progress Indicator

- [ ] Load page → Verify thin gold bar at top is at 0%
- [ ] Scroll halfway → Verify bar is ~50% width
- [ ] Scroll to bottom → Verify bar is 100% width
- [ ] Bar should be gradient: gold → amber → gold

### 7. SEO & Metadata

- [ ] View page source → Verify `<title>` tag: "Read Block 3 Free - Random Acts of Self-Actualization"
- [ ] Verify meta description present
- [ ] Verify Open Graph tags present (og:title, og:description, og:image)
- [ ] Verify Twitter Card tags present
- [ ] Verify JSON-LD schema for Book present in source
- [ ] Test with [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [ ] Test with [Twitter Card Validator](https://cards-dev.twitter.com/validator)

### 8. Analytics Tracking

Open browser console → Network tab → Filter: gtag

#### Email Signups
- [ ] Submit email form
- [ ] Verify `gtag('event', 'block3_email_signup')` fires

#### Amazon Book Clicks
- [ ] Click any Book 1 or Book 2 link
- [ ] Verify `gtag('event', 'click')` with `event_label: 'Block 3 Page - Volume 1'`

#### Affiliate Product Clicks
- [ ] Click any affiliate product
- [ ] Verify `gtag('event', 'click')` with `event_label: 'Block 3 - [Product Name]'`

#### Reading Progress
- [ ] Scroll to 25%, 50%, 75%, 100% of page
- [ ] Verify `gtag('event', 'reading_progress')` fires at each milestone

#### Share Button
- [ ] Click share button
- [ ] Verify `gtag('event', 'share')` fires

### 9. Mobile Responsiveness

#### Test on iPhone/Android (or Chrome DevTools mobile view)
- [ ] Hero section stacks vertically on mobile
- [ ] Email form is easily usable with thumb
- [ ] "Get Books 1 & 2" cards stack vertically
- [ ] Affiliate products grid becomes 1-2 columns
- [ ] Sticky bar is readable and buttons are tappable
- [ ] Block 3 content iframe is readable (no horizontal scroll)
- [ ] All CTAs have minimum 44x44px touch targets

### 10. Performance

- [ ] Run [PageSpeed Insights](https://pagespeed.web.dev/)
- [ ] Verify Core Web Vitals are good (green)
- [ ] Verify images are lazy-loaded
- [ ] Verify no layout shift on load

### 11. Cross-Browser Testing

Test in:
- [ ] Chrome (latest)
- [ ] Safari (latest)
- [ ] Firefox (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

---

## 🔧 Common Issues & Fixes

### Email Form Not Submitting
**Issue:** Form stuck on loading
**Check:**
- Verify `RESEND_API_KEY` is set in `.env.local`
- Verify `RESEND_AUDIENCE_ID` is set in `.env.local`
- Check browser console for errors
- Check `/app/api/email/subscribe/route.ts` logs

### Amazon Links Missing Affiliate Tag
**Issue:** Links don't have `?tag=brandonmil0e-20`
**Check:**
- Verify `ebook-config.ts` has correct `AFFILIATE_TAG`
- Verify template literal includes `?tag=${AFFILIATE_TAG}`

### Iframe Not Loading
**Issue:** Block 3 content doesn't display
**Check:**
- Verify `/public/block-3-content.html` exists
- Check browser console for CORS errors
- Verify iframe `src` path is correct

### Analytics Not Tracking
**Issue:** No events in GA4
**Check:**
- Verify Google Analytics is configured in `app/layout.tsx`
- Check `window.gtag` is defined in console
- Verify GA4 property ID is correct
- Check Network tab for `collect?` requests

---

## 📊 Analytics Goals to Monitor

### Google Analytics 4 Events

1. **block3_email_signup** - Email form submissions
2. **click** (category: affiliate) - Amazon book clicks
3. **click** (category: affiliate) - Affiliate product clicks
4. **reading_progress** - 25%, 50%, 75%, 100% milestones
5. **share** - Social share button clicks

### Conversion Funnel

```
Page View → Email Signup → Amazon Book Click → Purchase (tracked via affiliate dashboard)
```

### Key Metrics to Track

- **Email Conversion Rate:** (Email signups / Page views) × 100
- **Amazon CTR:** (Amazon clicks / Page views) × 100
- **Affiliate CTR:** (Affiliate clicks / Page views) × 100
- **Reading Depth:** % of visitors reaching each milestone
- **Bounce Rate:** Should be <40% (high-quality content)
- **Time on Page:** Should be >5 minutes (long-form content)

---

## 🎨 Design Elements

### Color Palette
- **Primary Gold:** `#D4AF37` (CTAs, highlights)
- **Amber:** `#CD7F32` (gradients)
- **Black:** Background gradients
- **Purple/Blue:** Accent gradients for email forms

### Typography
- **Headings:** `font-serif` (Next.js default serif)
- **Body:** Default sans-serif
- **Block 3 Content:** Cormorant Garamond, Cinzel (from iframe)

### Key UI Patterns
- **Glass morphism:** Email forms with backdrop blur
- **Gradient CTAs:** Gold to amber on hover
- **Hover effects:** Scale 1.05 transform
- **Sticky bar:** Black/90 with backdrop blur
- **Reading progress:** Fixed top, 1px height, gold gradient

---

## 🚀 Deployment Checklist

Before pushing to production:

- [ ] All forms tested and working
- [ ] All Amazon links include affiliate tag
- [ ] All affiliate product links include correct tag
- [ ] Analytics tracking verified
- [ ] Email welcome template looks good in Gmail, Apple Mail, Outlook
- [ ] Mobile experience is smooth
- [ ] Block 3 HTML content displays properly
- [ ] No console errors
- [ ] Lighthouse score >90
- [ ] SEO meta tags verified
- [ ] Resend audience is configured
- [ ] Test email address removed from audience

---

## 📧 Email Service Configuration

### Resend Setup

1. **API Key:** Already configured in `.env.local`
   ```
   RESEND_API_KEY=re_jnCH5nh5_QAoEHnCM1uk2r1JEuUbvtgEd
   ```

2. **Audience ID:** Already configured
   ```
   RESEND_AUDIENCE_ID=061e6526-2633-4f24-a21d-f7fdbe33d95d
   ```

3. **Verify Domain:** Ensure `brandon@brandonmills.com` is verified in Resend
   - Go to [Resend Dashboard → Domains](https://resend.com/domains)
   - Verify `brandonmills.com` is verified

4. **Check Audience:**
   - Go to [Resend Dashboard → Audiences](https://resend.com/audiences)
   - Verify audience exists: `061e6526-2633-4f24-a21d-f7fdbe33d95d`
   - View contacts to confirm signups are being added

---

## 🔍 Debugging Commands

### Test Email API Locally

```bash
curl -X POST http://localhost:3000/api/email/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "name": "Test User", "source": "block-3-landing"}'
```

### Check Resend Logs

```bash
# View recent Resend API calls
curl https://api.resend.com/emails \
  -H "Authorization: Bearer re_jnCH5nh5_QAoEHnCM1uk2r1JEuUbvtgEd"
```

### Verify Environment Variables

```bash
# In project root
cat .env.local | grep RESEND
```

---

## 💰 Revenue Tracking

### Amazon Associates Dashboard

- **Login:** [associates.amazon.com](https://affiliate-program.amazon.com/)
- **Tag:** `brandonmil0e-20`
- **Check:** Earnings → Filter by tag
- **Monitor:** CTR, conversion rate, revenue per click

### Affiliate Product Tracking

- **Tag:** `brandonmills.com-20`
- **Products:** AirPods Max, iPad Pro, Sony Headphones, YETI, etc.
- **Track:** Same Amazon Associates dashboard

### Email List Growth

- **Platform:** Resend
- **Metric:** Total contacts in audience
- **Goal:** 100 signups in first month
- **Monetize:** Email list when Block 3 publishes on Amazon

---

## 🎯 Conversion Optimization Tips

### A/B Test Ideas (Future)

1. **Email CTA:** "Notify Me" vs "Get Early Access"
2. **Hero Image:** Show book cover vs author photo
3. **Amazon CTA:** "Buy Now" vs "Start Reading"
4. **Email Form Placement:** Above fold vs after intro content
5. **Affiliate Products:** 3 vs 4 vs 6 products

### Heat Mapping

- Install [Microsoft Clarity](https://clarity.microsoft.com/) for free heat maps
- Identify where users click, scroll, and drop off
- Optimize CTAs based on engagement data

### Exit Intent

- Consider exit-intent popup with email form (if bounce rate is high)
- Only show to users who've scrolled >50%

---

## ✅ Success Criteria

After 1 week of traffic:

- **Email Signups:** >50 new contacts
- **Amazon CTR:** >10% of visitors
- **Reading Depth:** >60% reach 50% milestone
- **Bounce Rate:** <50%
- **Mobile Traffic:** >40% of total
- **Affiliate Clicks:** >5% of visitors

---

## 📞 Support

If you encounter issues:

1. Check browser console for errors
2. Verify `.env.local` variables are correct
3. Check Resend dashboard for API errors
4. Review Network tab for failed requests
5. Test in incognito mode (clear cache)

**Contact:** brandon@brandonmills.com

---

## 🎉 Launch Day Tasks

When Block 3 publishes on Amazon:

1. **Update Page:**
   - Change hero CTA from "Coming Soon" to "Buy Now on Amazon"
   - Add Amazon link to Block 3
   - Update email form: "Get launch updates" → "Get exclusive content"

2. **Email Subscribers:**
   - Send launch announcement to entire audience
   - Include Amazon link with affiliate tag
   - Offer limited-time discount if available

3. **Social Media:**
   - Share link to `/book/block-3` page
   - Announce availability on Amazon
   - Use share button to track social traffic

4. **Monitor:**
   - Watch email open rates
   - Track Amazon conversion rate
   - Monitor revenue in Associates dashboard

---

**Good luck! This page is designed to CONVERT. 🚀**
