# Instagram Automation - Quick Reference

## 🚀 Quick Commands

```bash
# Test without posting (dry run)
npm run automate:instagram:dry

# Post once and exit
npm run automate:instagram:once

# Sync products from Printful
npm run automate:instagram:sync

# View analytics report
npm run automate:instagram:report

# Start full automation (runs continuously)
npm run automate:instagram
```

## 📋 Required Environment Variables

```bash
META_APP_ID=your_app_id
META_APP_SECRET=your_app_secret
INSTAGRAM_BUSINESS_ACCOUNT_ID=your_ig_business_id
INSTAGRAM_ACCESS_TOKEN=your_long_lived_token
FACEBOOK_PAGE_ID=your_fb_page_id
INSTAGRAM_WEBHOOK_VERIFY_TOKEN=brandonmills_instagram_webhook_2024
OPENAI_API_KEY=sk-...
```

## ⏰ Default Posting Schedule

| Window | Time | Probability |
|--------|------|-------------|
| Morning | 9:00-9:30am | 70% |
| Lunch | 12:15-1:00pm | 70% |
| Evening | 6:30-7:30pm | 70% |
| Night | 8:45-9:30pm | 70% |

**Note**: Random delays 0-30min added to each time

## 📁 File Structure

```
lib/instagram/
├── official-api.ts          # Meta Graph API wrapper
├── caption-generator.ts     # GPT-4 caption generation
├── posting-scheduler.ts     # Randomized scheduling
├── product-queue.ts         # Product promotion queue
├── engagement-bot.ts        # Comment automation
└── analytics.ts             # Performance tracking

scripts/automation/
└── instagram-smart-poster.ts  # Main automation script

app/api/instagram/
├── webhook/route.ts         # Webhook handler
└── analytics/route.ts       # Analytics API

data/
├── instagram-history.json
├── instagram-product-queue.json
├── instagram-engagement.json
├── instagram-analytics.json
├── instagram-comment-queue.json
└── instagram-mentions.json
```

## 🎨 Caption Style Guide

**Brandon's Voice:**
- Casual, lowercase sometimes
- Sentence fragments OK
- Only use 🔥 ✨ emojis (rarely)
- Personal context: "shot this in milan"
- Natural typos (20% of posts)

**Examples:**
```
✅ "been wearing this nonstop since i got back"
✅ "ok but the fit on this tho"
✅ "this color 🔥"
✅ "new drop. thats it thats the post"

❌ "Elevate your wardrobe with this stunning piece!"
❌ "Who else loves this look? 💯🔥✨"
❌ "Link in bio to shop now! 👆"
```

## 🔄 Two-Step Posting Process

1. **Create Media Container** (draft)
   - Uploads image
   - Sets caption
   - Returns container ID

2. **Wait 3-15 minutes** (random)

3. **Publish Media** (go live)
   - Container becomes live post
   - Returns media ID

This mimics human behavior (create, review, post).

## 📊 Analytics API

```bash
# Dashboard metrics
curl https://brandonmills.com/api/instagram/analytics?type=dashboard

# Product performance
curl https://brandonmills.com/api/instagram/analytics?type=product&productId=123

# Time-based analytics
curl https://brandonmills.com/api/instagram/analytics?type=time&days=30

# Export CSV
curl https://brandonmills.com/api/instagram/analytics?type=export
```

## 🎯 Content Type Distribution

| Type | Percentage | Description |
|------|------------|-------------|
| Product | 50% | Direct product showcase |
| Lifestyle | 25% | Product in use/context |
| BTS | 15% | Behind the scenes |
| Casual | 10% | Throwaway observations |

## 💬 Engagement Settings

```typescript
replyProbability: 0.8      // Reply to 80% of comments
minDelayMinutes: 5         // Wait at least 5 min
maxDelayMinutes: 30        // Wait at most 30 min
maxRepliesPerHour: 10      // Max 10 replies/hour
```

## 🔐 Token Expiration

Access tokens expire after **60 days**.

**Check expiration:**
```bash
curl -i -X GET "https://graph.facebook.com/debug_token?input_token=YOUR_TOKEN&access_token=YOUR_TOKEN"
```

**Refresh token:**
```typescript
const api = new InstagramGraphAPI();
const newToken = await api.refreshAccessToken();
```

## 🚨 Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| "No products in queue" | `npm run automate:instagram:sync` |
| "Invalid access token" | Refresh token (expires every 60 days) |
| "Media container failed" | Check image URL is accessible |
| "Rate limit exceeded" | Built-in rate limiting should prevent this |
| "Webhook not working" | Verify URL and verify token match |

## 📈 Performance Benchmarks (30 days)

| Metric | Expected |
|--------|----------|
| Posts | 60-80 |
| Engagement Rate | 15-25% |
| Profile Visits | 500-1,000 |
| Website Clicks | 100-200 |
| Reply Rate | 80-90% |

## 🛡️ Anti-Detection Checklist

- ✅ Random delays everywhere
- ✅ Variable caption lengths
- ✅ Mixed content types
- ✅ Occasional typos
- ✅ Skip posts randomly
- ✅ Natural reply patterns
- ✅ Inconsistent hashtag usage
- ✅ Personal context in captions
- ✅ No fixed time patterns

## 🔧 Customization Paths

**Adjust posting times:**
`/Volumes/Super Mastery/Webdesigner/lib/instagram/posting-scheduler.ts`

**Modify Brandon's voice:**
`/Volumes/Super Mastery/Webdesigner/lib/instagram/caption-generator.ts`

**Change engagement settings:**
`/Volumes/Super Mastery/Webdesigner/lib/instagram/engagement-bot.ts`

**Update product priority:**
`/Volumes/Super Mastery/Webdesigner/lib/instagram/product-queue.ts`

## 📱 Mobile App Compatibility

You can still:
- Post manually
- Reply to comments
- Use Stories/Reels
- Edit profile

Bot will:
- Not interfere
- Skip already-replied comments
- Continue scheduled posts

## 🎯 Best Practices

**DO:**
- Let automation run continuously
- Monitor analytics weekly
- Sync products after Printful updates
- Keep tokens refreshed
- Review auto-replies occasionally

**DON'T:**
- Reply to every comment (80% is natural)
- Post at exact same times
- Use same caption style always
- Disable random delays
- Spam hashtags

## 📞 Quick Troubleshooting

```bash
# Check if automation is running
ps aux | grep instagram

# View logs (if using PM2)
pm2 logs instagram-bot

# Test API connection
curl "https://graph.facebook.com/v21.0/me?access_token=YOUR_TOKEN"

# Verify webhook
curl "https://brandonmills.com/api/instagram/webhook?hub.mode=subscribe&hub.verify_token=brandonmills_instagram_webhook_2024&hub.challenge=test"
```

## 🔗 Useful Links

- Setup Guide: `INSTAGRAM_AUTOMATION_SETUP.md`
- [Graph API Explorer](https://developers.facebook.com/tools/explorer/)
- [Access Token Debugger](https://developers.facebook.com/tools/debug/accesstoken)
- [Instagram API Docs](https://developers.facebook.com/docs/instagram-api)

## 📅 Maintenance Schedule

**Weekly:**
- Check analytics dashboard
- Review engagement stats
- Verify product queue

**Monthly:**
- Export analytics CSV
- Analyze top content
- Adjust schedule if needed
- Check token expiration

**Every 60 Days:**
- Refresh access token

---

**Need help?** See full setup guide in `INSTAGRAM_AUTOMATION_SETUP.md`
