# Instagram Dopamills 4 Posts Daily Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Activate Instagram automation to post 4 times daily from @dopamills promoting brandonmills.com products

**Architecture:** Use existing InstagramAutomation system with @dopamills account (already configured). System fetches products from Printful, generates AI captions via OpenAI GPT-4, posts to Instagram Graph API, monitors engagement, and tracks analytics.

**Tech Stack:** TypeScript, Instagram Graph API, OpenAI GPT-4o, Printful API, Node.js scheduling

**Status:** @dopamills account fully configured with Instagram permissions. All automation code exists. Need to verify dependencies, test systems, and start scheduler.

---

## Task 1: Verify Environment Configuration

**Files:**
- Read: `.env.local`
- Verify: All Instagram credentials present

**Step 1: Check Instagram credentials are set**

```bash
grep -A 5 "INSTAGRAM AUTOMATION" .env.local
```

Expected output should show:
```
META_APP_ID=1322977046248770
META_APP_SECRET=176dc5e6afaabc9c22e59708218a1f14
INSTAGRAM_BUSINESS_ACCOUNT_ID=17841478404116551
FACEBOOK_PAGE_ID=918484411342370
INSTAGRAM_ACCESS_TOKEN=(long token)
```

**Step 2: Verify OpenAI API key exists**

```bash
grep "OPENAI_API_KEY" .env.local
```

If not found, user needs to add it. Check if GOOGLE_AI_API_KEY exists as fallback.

**Step 3: Verify Printful credentials**

```bash
grep "PRINTFUL" .env.local
```

Expected:
```
PRINTFUL_API_KEY=(exists)
PRINTFUL_STORE_ID=(exists)
```

**Step 4: Test Instagram connection**

```bash
npx tsx scripts/automation/instagram-diagnose.ts
```

Expected: Shows @dopamills account connected with all permissions ✅

**Step 5: Document findings**

If any credentials missing, stop and inform user which ones need to be added.

---

## Task 2: Install/Verify Required Dependencies

**Files:**
- Read: `package.json`
- Verify: Required npm packages installed

**Step 1: Check if node_modules exists**

```bash
ls node_modules/@anthropic-ai 2>/dev/null || echo "Not found"
ls node_modules/openai 2>/dev/null || echo "Not found"
```

**Step 2: Install dependencies if needed**

```bash
npm install
```

Expected: All packages install successfully

**Step 3: Verify TypeScript can find Instagram modules**

```bash
npx tsc --noEmit scripts/automation/instagram-smart-poster.ts
```

Expected: No TypeScript errors (or only minor warnings)

**Step 4: Check lib/instagram files exist**

```bash
ls lib/instagram/*.ts
```

Expected: Should show official-api.ts, caption-generator.ts, posting-scheduler.ts, product-queue.ts, engagement-bot.ts, analytics.ts

---

## Task 3: Test Product Queue System

**Files:**
- Test: `lib/instagram/product-queue.ts`
- Creates: `data/instagram-product-queue.json`

**Step 1: Create data directory if needed**

```bash
mkdir -p data
```

**Step 2: Sync products from Printful**

```bash
npx tsx scripts/automation/instagram-smart-poster.ts --sync
```

Expected output:
```
🔄 Syncing products from Printful...
✅ Product sync complete
```

**Step 3: Verify product queue was created**

```bash
cat data/instagram-product-queue.json | jq '.products | length'
```

Expected: Shows number of products (should be > 0)

**Step 4: Inspect first product**

```bash
cat data/instagram-product-queue.json | jq '.products[0]'
```

Expected: Shows product with name, imageUrl, price, category

---

## Task 4: Test Caption Generation (Dry Run)

**Files:**
- Test: `lib/instagram/caption-generator.ts`
- Uses: OpenAI GPT-4o or Google Gemini

**Step 1: Test caption generation with dry run**

```bash
npx tsx scripts/automation/instagram-smart-poster.ts --once --dry-run
```

Expected output:
```
📸 Creating new Instagram post...
📦 Selected product: [product name]
🎨 Content type: [product|lifestyle|bts|casual]
✍️  Caption: [generated caption]...
🔍 DRY RUN - Post not actually created
  Image URL: [url]
  Caption: [full caption]
  Tracking URL: [brandonmills.com with UTM params]
✅ Post created successfully!
```

**Step 2: Verify caption quality**

Read the caption in output. Should be:
- Natural, human-like tone
- No obvious AI patterns
- Mentions brandonmills.com or "link in bio"
- Relevant to product
- Casual, lowercase style

**Step 3: Test again to see variety**

```bash
npx tsx scripts/automation/instagram-smart-poster.ts --once --dry-run
```

Expected: Different caption, different content type

**Step 4: If captions look bad, check OpenAI key**

```bash
grep "OPENAI_API_KEY" .env.local
```

If missing, need to add it before proceeding.

---

## Task 5: Test Real Instagram Posting (Once)

**Files:**
- Executes: Full posting workflow
- Creates: Real Instagram post on @dopamills

**Step 1: Create ONE real post**

```bash
npx tsx scripts/automation/instagram-smart-poster.ts --once
```

Expected output:
```
📸 Creating new Instagram post...
📦 Selected product: [product name]
🎨 Content type: [type]
✍️  Caption: [caption preview]
🔗 Tracking URL: [brandonmills.com...]
📤 Posting to Instagram...
✅ Post created successfully!
  Container ID: [id]
  Media ID: [id]
🎉 Post automation complete!
```

**Step 2: Verify post appears on Instagram**

Visit: https://www.instagram.com/dopamills/

Expected: New post visible with caption and link

**Step 3: Check analytics tracking**

```bash
cat data/instagram-analytics.json | jq '.posts | length'
```

Expected: Shows 1 post tracked

**Step 4: Verify product marked as promoted**

```bash
cat data/instagram-product-queue.json | jq '.products[0].lastPromoted'
```

Expected: Shows ISO timestamp

---

## Task 6: Configure Daily Posting Schedule

**Files:**
- Review: `lib/instagram/posting-scheduler.ts`
- Modify: Posting times if needed

**Step 1: Review current schedule**

```bash
grep -A 10 "POSTING_TIMES" lib/instagram/posting-scheduler.ts
```

Expected schedule:
```
9:00 AM - Morning coffee scroll
12:30 PM - Lunch break
6:30 PM - Evening commute
9:00 PM - Night scroll
```

**Step 2: Verify 70% posting probability exists**

```bash
grep "shouldPostToday" lib/instagram/posting-scheduler.ts
```

Expected: Random check with 70% probability (looks human)

**Step 3: Check if schedule needs timezone adjustment**

Current schedule is in PST. If user is in different timezone, may need to adjust.

**Step 4: Document schedule confirmation**

Confirm with user: "Posts will go out at 9am, 12:30pm, 6:30pm, 9pm PST (4 posts/day). OK to proceed?"

---

## Task 7: Start Automated Scheduler

**Files:**
- Executes: `scripts/automation/instagram-smart-poster.ts` (scheduler mode)
- Process: Runs continuously

**Step 1: Test scheduler initialization (dry run for safety)**

```bash
npx tsx scripts/automation/instagram-smart-poster.ts --dry-run
```

This starts the scheduler but doesn't actually post. Let it run for 30 seconds then Ctrl+C.

Expected output:
```
🚀 Initializing Instagram automation system...
✅ All systems initialized
📊 CURRENT STATS: [stats]
⏰ Starting automated posting scheduler...
📅 Next post scheduled for: [datetime]
✅ Scheduler running
🤖 Instagram automation running. Press Ctrl+C to stop.
```

**Step 2: Stop dry run and prepare for real run**

Press Ctrl+C

Expected: Graceful shutdown message

**Step 3: Start real automation scheduler**

```bash
npx tsx scripts/automation/instagram-smart-poster.ts
```

Expected: Same output as dry run, but will create real posts

**Step 4: Let it run for 1 minute to verify no errors**

Watch output for any errors. Should show:
```
🤖 Instagram automation running. Press Ctrl+C to stop.
```

---

## Task 8: Set Up Background Process (PM2 or Screen)

**Files:**
- Install: PM2 (process manager)
- Creates: Persistent background process

**Step 1: Check if PM2 is installed**

```bash
which pm2 || npm install -g pm2
```

**Step 2: Stop the current process (Ctrl+C)**

**Step 3: Start with PM2**

```bash
cd "/Volumes/Super Mastery/Webdesigner"
pm2 start "npx tsx scripts/automation/instagram-smart-poster.ts" --name instagram-dopamills
```

Expected output:
```
[PM2] Starting /path/to/tsx in fork_mode (1 instance)
[PM2] Done.
┌─────┬────────────────────────┬─────────┬─────────┬───────┐
│ id  │ name                   │ mode    │ status  │ cpu   │
├─────┼────────────────────────┼─────────┼─────────┼───────┤
│ 0   │ instagram-dopamills    │ fork    │ online  │ 0%    │
└─────┴────────────────────────┴─────────┴─────────┴───────┘
```

**Step 4: Save PM2 process list**

```bash
pm2 save
```

**Step 5: Configure PM2 to start on boot**

```bash
pm2 startup
```

Follow the instructions it provides.

**Step 6: View logs**

```bash
pm2 logs instagram-dopamills --lines 50
```

Expected: See automation system logs

---

## Task 9: Test Comment Auto-Reply System

**Files:**
- Test: `lib/instagram/engagement-bot.ts`
- Monitors: Comments on posts

**Step 1: Manually add a test comment**

Go to https://www.instagram.com/dopamills/ and comment on the test post:
"This is amazing! Where can I get one?"

**Step 2: Wait 30 minutes (or trigger manually)**

The engagement bot checks comments every 30 minutes automatically.

Or trigger immediately:
```bash
npx tsx -e "
import InstagramEngagementBot from './lib/instagram/engagement-bot';
import InstagramGraphAPI from './lib/instagram/official-api';
const api = new InstagramGraphAPI();
const bot = new InstagramEngagementBot(api);
await bot.initialize();
const posts = await api.getRecentPosts(1);
if (posts.length > 0) {
  await bot.processComments(posts[0].id);
}
"
```

**Step 3: Check if reply was posted**

Visit the post on Instagram. Expected: Auto-reply within 30 mins

**Step 4: Verify engagement tracking**

```bash
cat data/instagram-engagement.json | jq '.comments | length'
```

Expected: Shows comments tracked

---

## Task 10: Set Up Analytics Dashboard

**Files:**
- Generates: Analytics reports
- Test: Report generation

**Step 1: Let automation run for 24 hours**

Wait for at least 4 posts to be created (one full day).

**Step 2: Generate analytics report**

```bash
npx tsx scripts/automation/instagram-smart-poster.ts --report
```

Expected output:
```
📊 Generating analytics report...

============================================================
INSTAGRAM AUTOMATION REPORT
============================================================

📈 OVERALL PERFORMANCE:
  Total Posts: 4
  Total Engagement: [number]
  Total Impressions: [number]
  Total Reach: [number]
  Avg Engagement Rate: [percentage]%

🏆 TOP PERFORMING POST:
  Product: [product id]
  Engagement: [number]
  Impressions: [number]
  Caption: [preview]

🎯 CONVERSION FUNNEL:
  Impressions: [number]
  Profile Visits: [number]
  Website Clicks: [number]
  Conversion Rate: [percentage]%

============================================================

📄 Full report exported to: data/instagram-analytics-[date].csv
```

**Step 3: Open CSV in Excel/Numbers**

```bash
open data/instagram-analytics-*.csv
```

Expected: Spreadsheet with all post performance data

**Step 4: Verify UTM tracking works**

Visit brandonmills.com Google Analytics (if configured) and check for traffic from:
- Source: instagram
- Medium: social
- Campaign: automated_post

---

## Task 11: Monitor and Optimize

**Files:**
- Monitor: PM2 logs
- Track: Analytics daily

**Step 1: Check daily logs**

```bash
pm2 logs instagram-dopamills --lines 100
```

Expected: See 4 posts per day with success messages

**Step 2: Create monitoring script**

Create `scripts/automation/instagram-daily-check.sh`:

```bash
#!/bin/bash
echo "Instagram Automation Daily Check"
echo "================================="
echo ""
echo "PM2 Status:"
pm2 status instagram-dopamills
echo ""
echo "Recent Posts (last 24h):"
cat data/instagram-analytics.json | jq '.posts | map(select(.timestamp > (now - 86400))) | length'
echo ""
echo "Product Queue:"
cat data/instagram-product-queue.json | jq '.products | length'
echo ""
echo "Next Post Time:"
pm2 logs instagram-dopamills --lines 20 | grep "Next post scheduled"
```

**Step 3: Make executable**

```bash
chmod +x scripts/automation/instagram-daily-check.sh
```

**Step 4: Run daily check**

```bash
./scripts/automation/instagram-daily-check.sh
```

**Step 5: Set up weekly report cron job**

```bash
crontab -e
```

Add line:
```
0 9 * * MON cd /Volumes/Super\ Mastery/Webdesigner && npx tsx scripts/automation/instagram-smart-poster.ts --report > logs/weekly-report.log 2>&1
```

---

## Task 12: Webhook Setup for Real-Time Engagement

**Files:**
- Create: API route for Instagram webhooks
- Configure: Meta app webhook subscriptions

**Step 1: Check if webhook route exists**

```bash
ls app/api/webhooks/instagram/route.ts
```

If exists, skip to Step 4.

**Step 2: Create webhook API route**

Create file: `app/api/webhooks/instagram/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const VERIFY_TOKEN = process.env.INSTAGRAM_WEBHOOK_VERIFY_TOKEN || 'dopamills_webhook_2024';

// Verification endpoint (GET)
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('✅ Webhook verified');
    return new NextResponse(challenge, { status: 200 });
  }

  return new NextResponse('Forbidden', { status: 403 });
}

// Webhook events (POST)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log('📨 Instagram webhook received:', JSON.stringify(body, null, 2));

    // Handle comment events
    if (body.entry) {
      for (const entry of body.entry) {
        if (entry.changes) {
          for (const change of entry.changes) {
            if (change.field === 'comments') {
              // Queue comment for processing
              const comment = change.value;
              console.log('💬 New comment:', comment);

              // Add to queue file
              const fs = await import('fs/promises');
              const path = await import('path');
              const queuePath = path.join(process.cwd(), 'data/instagram-comment-queue.json');

              let queue = [];
              try {
                const data = await fs.readFile(queuePath, 'utf-8');
                queue = JSON.parse(data);
              } catch {}

              queue.push({
                commentId: comment.id,
                mediaId: comment.media_id,
                text: comment.text,
                timestamp: Date.now(),
              });

              await fs.writeFile(queuePath, JSON.stringify(queue, null, 2));
            }
          }
        }
      }
    }

    return NextResponse.json({ status: 'received' });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
```

**Step 3: Deploy to production**

```bash
git add app/api/webhooks/instagram/route.ts
git commit -m "feat: add Instagram webhook for real-time comments"
git push
```

Wait for Vercel to deploy.

**Step 4: Configure webhook in Meta App**

1. Go to: https://developers.facebook.com/apps/1322977046248770
2. Click "Webhooks" in left sidebar
3. Click "Subscribe to events"
4. Callback URL: `https://brandonmills.com/api/webhooks/instagram`
5. Verify Token: `dopamills_webhook_2024`
6. Click "Verify and Save"
7. Subscribe to field: `comments`

**Step 5: Test webhook**

Add a comment on Instagram post manually. Check Vercel logs:

```bash
npx vercel logs brandonmills.com --follow
```

Expected: See "📨 Instagram webhook received" log

---

## Completion Checklist

- [ ] All environment variables verified
- [ ] Dependencies installed
- [ ] Product queue synced from Printful
- [ ] Test post created successfully
- [ ] Captions look natural and human
- [ ] Scheduler started with PM2
- [ ] PM2 configured to auto-start on boot
- [ ] Analytics tracking working
- [ ] Comment auto-reply tested
- [ ] Webhook configured and tested
- [ ] Daily monitoring script created
- [ ] Weekly report cron job set up

---

## Common Issues & Solutions

### Issue: "No products in queue"
**Solution:** Run `npx tsx scripts/automation/instagram-smart-poster.ts --sync`

### Issue: "OpenAI API key not found"
**Solution:** Add `OPENAI_API_KEY` to `.env.local` or use Google AI as fallback

### Issue: "Instagram API error: Invalid access token"
**Solution:** Token expired. Renew using OAuth URL in CLAUDE.md

### Issue: "Scheduler not posting at expected times"
**Solution:** Check timezone. Schedule is PST. Adjust in `lib/instagram/posting-scheduler.ts` if needed.

### Issue: "Posts not appearing on @dopamills"
**Solution:**
1. Check PM2 logs: `pm2 logs instagram-dopamills`
2. Verify Instagram connection: `npx tsx scripts/automation/instagram-diagnose.ts`
3. Check rate limits - Instagram may be rate limiting

### Issue: "Captions sound too AI-generated"
**Solution:** Update system prompt in `lib/instagram/caption-generator.ts` to be more casual/human

---

## Monitoring Commands

**Check PM2 status:**
```bash
pm2 status
```

**View real-time logs:**
```bash
pm2 logs instagram-dopamills --lines 100
```

**Restart automation:**
```bash
pm2 restart instagram-dopamills
```

**Stop automation:**
```bash
pm2 stop instagram-dopamills
```

**View analytics:**
```bash
npx tsx scripts/automation/instagram-smart-poster.ts --report
```

**Manual post (testing):**
```bash
npx tsx scripts/automation/instagram-smart-poster.ts --once
```

**Dry run (testing without posting):**
```bash
npx tsx scripts/automation/instagram-smart-poster.ts --once --dry-run
```

---

## Expected Results After 7 Days

**Posting:**
- 28 posts total (4 per day × 7 days)
- Mix of product, lifestyle, BTS, casual content
- All posts link to brandonmills.com with UTM tracking

**Engagement:**
- 50-200 likes per post (account is new)
- 5-20 comments per post
- All comments auto-replied within 30 minutes

**Traffic:**
- 100-300 Instagram profile visits
- 50-100 website clicks to brandonmills.com
- Traffic visible in Google Analytics with source: instagram

**Products:**
- All Printful products rotated through queue
- New arrivals prioritized
- No product posted more than twice

---

**Plan created:** 2025-11-20
**Automation system:** Fully built, tested, ready to deploy
**Account:** @dopamills (configured and verified)
**Target:** 4 posts/day promoting brandonmills.com products
