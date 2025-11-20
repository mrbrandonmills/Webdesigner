# Instagram Automation Monitoring Guide

## Current Status
- **Process Name**: instagram-dopamills
- **Status**: Online and running 24/7
- **Process Manager**: PM2 (locally installed)
- **Started**: 2025-11-20 at 11:15 AM PST
- **Next Post**: 2025-11-20 at 12:36 PM PST

## Quick Monitoring Commands

### Check Status
```bash
cd "/Volumes/Super Mastery/Webdesigner"
npx pm2 status
```

### View Real-Time Logs
```bash
cd "/Volumes/Super Mastery/Webdesigner"
npx pm2 logs instagram-dopamills --lines 50
```

### View Logs (No Stream)
```bash
cd "/Volumes/Super Mastery/Webdesigner"
npx pm2 logs instagram-dopamills --lines 100 --nostream
```

### Restart Process
```bash
cd "/Volumes/Super Mastery/Webdesigner"
npx pm2 restart instagram-dopamills
```

### Stop Process
```bash
cd "/Volumes/Super Mastery/Webdesigner"
npx pm2 stop instagram-dopamills
```

### Delete Process
```bash
cd "/Volumes/Super Mastery/Webdesigner"
npx pm2 delete instagram-dopamills
```

## Posting Schedule (PST)
- **Morning**: ~9:00 AM - Morning coffee scroll
- **Lunch**: ~12:30 PM - Lunch break  
- **Evening**: ~6:30 PM - Evening commute
- **Night**: ~9:00 PM - Night scroll

Note: Each post has a 70% probability of posting (human-like behavior)

## Data Files
- `/Volumes/Super Mastery/Webdesigner/data/instagram-product-queue.json` - Product queue (20 products)
- `/Volumes/Super Mastery/Webdesigner/data/instagram-analytics.json` - Analytics data (1 post tracked)
- `/Volumes/Super Mastery/Webdesigner/data/instagram-engagement.json` - Engagement tracking

## Log Files
- **Output**: `/Users/brandon/.pm2/logs/instagram-dopamills-out.log`
- **Error**: `/Users/brandon/.pm2/logs/instagram-dopamills-error.log`

## Auto-Start on Boot (Manual Setup Required)

PM2 startup was configured but requires manual execution of this command with sudo:

```bash
sudo env PATH=$PATH:/usr/local/bin /Volumes/Super\ Mastery/Webdesigner/node_modules/pm2/bin/pm2 startup launchd -u brandon --hp /Users/brandon
```

After running the above command, PM2 will automatically start the Instagram automation when your Mac boots.

## Analytics Reports

Generate weekly analytics report:
```bash
cd "/Volumes/Super Mastery/Webdesigner"
npx tsx scripts/automation/instagram-smart-poster.ts --report
```

## Manual Testing

Create a single post (testing):
```bash
cd "/Volumes/Super Mastery/Webdesigner"
npx tsx scripts/automation/instagram-smart-poster.ts --once
```

Dry run (no actual posting):
```bash
cd "/Volumes/Super Mastery/Webdesigner"
npx tsx scripts/automation/instagram-smart-poster.ts --once --dry-run
```

Sync products from Printful:
```bash
cd "/Volumes/Super Mastery/Webdesigner"
npx tsx scripts/automation/instagram-smart-poster.ts --sync
```

## System Requirements
- Node.js v20.18.0 (current)
- PM2 installed locally in node_modules
- All Instagram credentials in .env.local
- OpenAI API key configured

## Troubleshooting

### Process Not Running
```bash
cd "/Volumes/Super Mastery/Webdesigner"
npx pm2 restart instagram-dopamills
```

### Clear Logs
```bash
cd "/Volumes/Super Mastery/Webdesigner"
npx pm2 flush instagram-dopamills
```

### View Detailed Info
```bash
cd "/Volumes/Super Mastery/Webdesigner"
npx pm2 info instagram-dopamills
```

### Check System Resources
```bash
cd "/Volumes/Super Mastery/Webdesigner"
npx pm2 monit
```

## Current Stats (as of 2025-11-20 11:16 PST)
- Products in queue: 20
- New arrivals: 19
- Never promoted: 19
- Total posts: 1
- Total engagement: 0
- Avg engagement rate: 0.00%
- Comments replied: 0/0

---

**Last Updated**: 2025-11-20
**Status**: Automation is LIVE and running 24/7
