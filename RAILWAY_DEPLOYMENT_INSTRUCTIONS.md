# Railway Cloud Deployment - Campaign Automation

## ✅ Confirmed Setup

- Railway project created: **BrandonMills-Campaign-Automation**
- Project URL: https://railway.com/project/531789bd-5e77-41ad-aea9-40d74ec491ca
- Logged in as: Brandon Mills (therealbrandonmills@gmail.com)

## 🔑 API Credentials Status

### ✅ Configured in `.env.local`:
- **Twitter API**: ✅ Complete (API key, secret, access token)
- **Pinterest API**: ✅ Complete (access token, board IDs)
- **Anthropic AI**: ✅ Complete

### ⚠️ Needs Configuration:
- **Instagram/Meta**: Placeholders added, needs real credentials

## 🚀 Deploy to Railway (Cloud Automation)

### Option 1: Quick Deploy via Railway Dashboard

1. **Go to Railway Dashboard:**
   ```
   https://railway.com/project/531789bd-5e77-41ad-aea9-40d74ec491ca
   ```

2. **Create New Service:**
   - Click "+ New" → "Empty Service"
   - Name it: `campaign-daemon`

3. **Connect GitHub (Recommended):**
   - Settings → Connect GitHub repository
   - Select: `mrbrandonmills/Webdesigner`
   - Root directory: `/`
   - Build command: `npm install`
   - Start command: `npx tsx scripts/automation/watchdog.ts`

4. **Set Environment Variables:**
   Go to Variables tab and add:
   ```
   TWITTER_API_KEY=your_twitter_api_key_here
   TWITTER_API_SECRET=your_twitter_api_secret_here
   TWITTER_ACCESS_TOKEN=your_twitter_access_token_here
   TWITTER_ACCESS_SECRET=your_twitter_access_secret_here

   PINTEREST_ACCESS_TOKEN=your_pinterest_access_token_here
   PINTEREST_BOARD_ID=926263917051256107

   ANTHROPIC_API_KEY=sk-ant-[your_key]

   NODE_ENV=production
   ```

5. **Deploy:**
   - Click "Deploy"
   - Railway will build and start your automation

### Option 2: CLI Deploy

```bash
cd "/Volumes/Super Mastery/Webdesigner"

# Deploy to Railway
railway up --detach

# Set variables (after service is created)
railway variables \
  --set "TWITTER_API_KEY=your_twitter_api_key_here
  --set "TWITTER_API_SECRET=your_twitter_api_secret_here
  --set "TWITTER_ACCESS_TOKEN=your_twitter_access_token_here
  --set "TWITTER_ACCESS_SECRET=your_twitter_access_secret_here
  --set "PINTEREST_ACCESS_TOKEN=your_pinterest_access_token_here" \
  --set "PINTEREST_BOARD_ID=926263917051256107" \
  --set "NODE_ENV=production"

# View logs
railway logs
```

## 📊 Monitoring & Management

### View Logs
```bash
railway logs --follow
```

### Check Status
```bash
railway status
```

### View Dashboard
```bash
railway open
```

Or visit: https://railway.com/project/531789bd-5e77-41ad-aea9-40d74ec491ca

## 🔍 What Happens After Deployment

### Automated Behavior:
1. **Watchdog starts** → Monitors campaign daemon
2. **Campaign daemon starts** → Begins checking schedule every 5 minutes
3. **Posts automatically** → When posts are due based on schedule
4. **Auto-recovery** → If daemon crashes, watchdog restarts it
5. **Logs everything** → All activity logged to Railway logs

### Monitoring:
- **Railway Dashboard**: Shows service health, logs, metrics
- **Logs**: Real-time posting activity visible in `railway logs`
- **Status**: Check campaign progress with the daemon's status command

## ⚠️ Important Notes

### Instagram Posting
Instagram credentials are currently placeholders. To enable Instagram posting:

1. Create a Meta/Facebook App at https://developers.facebook.com
2. Link Instagram Business Account
3. Get long-lived access token
4. Add to Railway variables:
   ```
   META_APP_ID=your_app_id
   META_APP_SECRET=your_app_secret
   INSTAGRAM_BUSINESS_ACCOUNT_ID=your_account_id
   FACEBOOK_PAGE_ID=your_page_id
   INSTAGRAM_ACCESS_TOKEN=your_token
   ```

Without these, Instagram posts will be marked as "manual review needed" in the schedule.

### Cost
- Railway offers $5/month free credit
- This automation daemon uses minimal resources
- Expected cost: $0-5/month

### Restart Policy
The deployment is configured with:
- **Auto-restart on failure** (up to 10 retries)
- **Watchdog monitoring** (restarts daemon if it stops)
- **Health checks** (ensures service is running)

## 🎯 Verify Deployment

After deployment:

1. **Check if service is running:**
   ```bash
   railway logs --tail 50
   ```
   You should see:
   ```
   🚀 Campaign Daemon started
   ⏰ Checking for due posts every 5 minutes
   ```

2. **View campaign status** (from local machine):
   ```bash
   npm run campaign:status
   ```

3. **Monitor first post:**
   - First post scheduled for Monday at 09:00
   - Watch Railway logs around that time
   - Should see posting attempt and success message

## 🚨 Troubleshooting

### Service Won't Start
- Check Railway logs: `railway logs`
- Verify environment variables are set
- Ensure start command is correct: `npx tsx scripts/automation/watchdog.ts`

### No Posts Happening
- Check if daemon is running: `railway logs | grep "Campaign Daemon"`
- Verify schedule file exists in deployment
- Check API credentials are valid

### Daemon Crashes
- Watchdog should auto-restart (check logs)
- If repeated crashes, review error messages
- May need to fix code issue

## ✅ Next Steps

1. **Deploy to Railway** using Option 1 or 2 above
2. **Monitor first 24 hours** to ensure automation works
3. **Add Instagram credentials** (optional)
4. **Relax!** Automation runs 24/7 in the cloud

---

*Campaign: The Alchemy of Embodiment*
*Duration: 2 weeks (14 days)*
*Deployment: Railway Cloud*
*Status: Ready to deploy*
