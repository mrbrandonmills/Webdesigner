# Block 3 Landing Page - Quick Reference Card

## 🚀 Quick Start

```bash
# Start dev server
npm run dev

# Visit page
open http://localhost:3000/book/block-3
```

---

## 📂 File Locations

```
Main Page:           /app/book/block-3/page.tsx
Email Form:          /components/email/block-3-signup-form.tsx
Content Iframe:      /components/block-3-content.tsx
Progress Bar:        /components/reading-progress.tsx
Email API:           /app/api/email/subscribe/route.ts
Block 3 HTML:        /public/block-3-content.html
```

---

## 🔑 Environment Variables

```bash
RESEND_API_KEY=re_jnCH5nh5_QAoEHnCM1uk2r1JEuUbvtgEd
RESEND_AUDIENCE_ID=061e6526-2633-4f24-a21d-f7fdbe33d95d
```

---

## 🧪 Test Email API

```bash
curl -X POST http://localhost:3000/api/email/subscribe \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "name": "Test User",
    "source": "block-3-landing"
  }'
```

---

## 📊 Analytics Events

| Event Name | When It Fires | Category | Label |
|------------|---------------|----------|-------|
| `block3_email_signup` | Email form submitted | engagement | Block 3 Email Capture |
| `click` | Amazon book link clicked | affiliate | Block 3 Page - Volume 1 |
| `click` | Affiliate product clicked | affiliate | Block 3 - [Product Name] |
| `reading_progress` | Scroll to 25/50/75/100% | engagement | Block 3 [%] read |
| `share` | Share button clicked | engagement | Block 3 Share |

---

## 💰 Affiliate Tags

| Link Type | Affiliate Tag | Revenue Split |
|-----------|---------------|---------------|
| Amazon Books 1 & 2 | `brandonmil0e-20` | ~4% commission |
| Affiliate Products | `brandonmills.com-20` | ~3-4% commission |

---

## 🎯 Conversion Goals

| Metric | Goal | Formula |
|--------|------|---------|
| Email Conversion | 10% | (Signups / Page Views) × 100 |
| Amazon CTR | 15% | (Book Clicks / Page Views) × 100 |
| Affiliate CTR | 5% | (Product Clicks / Page Views) × 100 |
| Reading Depth | 60% | % reaching 50% scroll |
| Bounce Rate | <50% | Google Analytics |

---

## 🔗 Important URLs

| Resource | URL |
|----------|-----|
| **Live Page** | https://www.brandonmills.com/book/block-3 |
| **Resend Dashboard** | https://resend.com/audiences |
| **Amazon Associates** | https://affiliate-program.amazon.com/ |
| **Google Analytics** | https://analytics.google.com |
| **Facebook Debugger** | https://developers.facebook.com/tools/debug/ |
| **Twitter Card Validator** | https://cards-dev.twitter.com/validator |

---

## ✅ Pre-Launch Checklist

- [ ] Test hero email form
- [ ] Test inline email form
- [ ] Test footer email form
- [ ] Verify all Amazon links have `?tag=brandonmil0e-20`
- [ ] Verify all product links have `?tag=brandonmills.com-20`
- [ ] Check Block 3 iframe loads
- [ ] Test on mobile (iOS/Android)
- [ ] Verify analytics events fire
- [ ] Test share button (mobile + desktop)
- [ ] Check SEO meta tags in source
- [ ] Create OG image (1200x630px)
- [ ] Clear test emails from Resend

---

## 🐛 Quick Fixes

### Email Form Not Working
```bash
# Check environment variables
cat .env.local | grep RESEND

# Restart dev server
npm run dev
```

### Analytics Not Tracking
```javascript
// Check in browser console
console.log(window.gtag)  // Should be a function
```

### Iframe Not Loading
```bash
# Verify file exists
ls -la public/block-3-content.html

# Check dev server console for errors
```

---

## 📞 Support

- **Resend Issues:** support@resend.com
- **Amazon Associates:** https://affiliate-program.amazon.com/help
- **Developer:** brandon@brandonmills.com

---

## 🎨 Design Tokens

```css
/* Colors */
--gold: #D4AF37
--amber: #CD7F32
--black: #000000
--gray-900: #111827

/* Typography */
--font-serif: Georgia, serif
--font-sans: -apple-system, sans-serif

/* Spacing */
--spacing-sm: 0.5rem
--spacing-md: 1rem
--spacing-lg: 2rem
--spacing-xl: 4rem
```

---

## 🚀 Common Commands

```bash
# Development
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Type check
npm run type-check

# Test email signup
curl -X POST http://localhost:3000/api/email/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","name":"Test","source":"block-3-landing"}'
```

---

## 📈 KPIs to Monitor

**Daily:**
- Email signups
- Page views
- Bounce rate

**Weekly:**
- Amazon clicks
- Affiliate clicks
- Reading depth

**Monthly:**
- Email list growth
- Amazon revenue
- Affiliate revenue
- Total conversions

---

## 🎯 When Block 3 Publishes

1. **Update Hero CTA:**
   ```tsx
   // Change from:
   "Get notified when Block 3 is published"
   // To:
   "Buy Block 3 on Amazon Now"
   ```

2. **Add Amazon Link:**
   ```typescript
   // In ebook-config.ts, add:
   {
     name: 'Block 3: The Laboratory of Living',
     asin: 'YOUR_ASIN_HERE',
     amazonUrl: `https://www.amazon.com/dp/YOUR_ASIN_HERE?tag=brandonmil0e-20`,
   }
   ```

3. **Email Subscribers:**
   - Subject: "Block 3 is LIVE on Amazon 🎉"
   - Body: Include affiliate link
   - CTA: "Get Your Copy Now"

4. **Update SEO:**
   - Title: "Buy Block 3 - Random Acts of Self-Actualization"
   - Description: Include "Available now on Amazon"

---

**Print this page and keep it handy! 📄**
