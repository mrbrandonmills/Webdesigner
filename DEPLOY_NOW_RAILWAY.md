# 🚀 Deploy Campaign Automation to Railway - Step by Step

## ✅ What's Ready

- ✅ Railway project created: **BrandonMills-Campaign-Automation**
- ✅ All automation scripts created and tested
- ✅ Visual assets generated (Pinterest + Instagram)
- ✅ Content files prepared for 2-week campaign
- ✅ Twitter & Pinterest API credentials configured

## 🎯 Deploy in 5 Minutes

### Step 1: Open Railway Dashboard

Visit: **https://railway.com/project/531789bd-5e77-41ad-aea9-40d74ec491ca**

(You're already logged in as: therealbrandonmills@gmail.com)

### Step 2: Create New Service

1. Click **"+ New"** button
2. Select **"GitHub Repo"**
3. Choose repository: **`mrbrandonmills/Webdesigner`**
4. Click **"Deploy Now"**

### Step 3: Configure Service Settings

After deployment starts:

1. **Go to Settings** (gear icon)
2. **Build & Deploy section:**
   - Build Command: `npm install && npm run build || true`
   - Start Command: `npx tsx scripts/automation/watchdog.ts`
   - Root Directory: `/`

3. **Save Changes**

### Step 4: Set Environment Variables

1. Click **"Variables"** tab
2. Click **"+ New Variable"** and add these one by one:

```
TWITTER_API_KEY=your_twitter_api_key_here
TWITTER_API_SECRET=your_twitter_api_secret_here
TWITTER_ACCESS_TOKEN=your_twitter_access_token_here
TWITTER_ACCESS_SECRET=your_twitter_access_secret_here

PINTEREST_ACCESS_TOKEN=your_pinterest_access_token_here
PINTEREST_BOARD_ID=926263917051256107

NODE_ENV=production
```

3. **Click "Deploy"** (Railway will restart with new variables)

### Step 5: Verify Deployment

1. **Check Logs** (click "Logs" tab):
   - Should see: `🚀 Campaign Daemon started`
   - Should see: `⏰ Checking for due posts every 5 minutes`

2. **Verify Status:**
   - Service should show "Active" (green dot)
   - No error messages in logs

3. **Test Connection:**
   ```bash
   # From your local machine
   railway logs --tail 50
   ```

## 📊 What Happens Next

### Automatic Posting Schedule

**Week 1** (Starting today):
- **Monday 09:00**: Twitter Thread 1
- **Tuesday 10:00**: Instagram Photo + Pinterest Pin
- **Wednesday 09:00**: Blog Post (manual)
- **Thursday 09:00**: Twitter Tweets + Instagram Reel
- **Friday 10:00**: Medium Article (manual)

**Week 2**:
- **Monday 09:00**: Twitter Thread 2
- **Tuesday 10:00**: Instagram Carousel + 2 Pinterest Pins
- **Wednesday 09:00**: Website Essay (manual)
- **Thursday 10:00**: Pinterest Pin + Twitter Engagement
- **Friday 09:00**: Research Paper (manual)

### Monitoring

**Railway Dashboard:**
- https://railway.com/project/531789bd-5e77-41ad-aea9-40d74ec491ca
- View real-time logs
- Check service health
- Monitor resource usage

**CLI Monitoring:**
```bash
# View live logs
railway logs --follow

# Check status
railway status

# Restart if needed
railway redeploy
```

### Error Reporting

The watchdog agent ensures:
- ✅ **Daemon crashes** → Auto-restart within 5 seconds
- ✅ **Health checks** → Every minute, restarts if unhealthy
- ✅ **Failed posts** → Retry up to 3 times
- ✅ **All activity logged** → Visible in Railway logs

**Error Notifications:**
- Check Railway logs for any failures
- Daemon will log specific API errors
- Posts marked as "failed" in state file after 3 attempts

## ⚠️ Optional: Instagram Setup

Instagram posting requires Meta/Facebook API credentials. Currently these are placeholders.

**To enable Instagram:**

1. Create Meta App: https://developers.facebook.com/apps
2. Add Instagram Graph API product
3. Get long-lived access token
4. Add to Railway variables:
   ```
   META_APP_ID=your_app_id
   META_APP_SECRET=your_app_secret
   INSTAGRAM_BUSINESS_ACCOUNT_ID=your_account_id
   FACEBOOK_PAGE_ID=your_page_id
   INSTAGRAM_ACCESS_TOKEN=your_long_lived_token
   ```

**Without Instagram credentials:**
- Instagram posts will be marked "manual review needed"
- You can post Instagram content manually using the captions from:
  - `/scripts/automation/content/instagram/captions.md`
- Visual assets ready at:
  - `/public/social-assets/instagram/`

## 🎉 You're Done!

Once deployed:
- ✅ Automation runs 24/7 in Railway cloud
- ✅ No local machine needed
- ✅ Survives system restarts
- ✅ Auto-recovery from crashes
- ✅ Complete logging and monitoring

**The campaign starts automatically based on the schedule!**

Just monitor Railway logs for the first few days to ensure everything works smoothly.

---

## 📞 Support Commands

```bash
# View campaign progress
npm run campaign:status

# Check what's posted
cat scripts/automation/content/campaign-state.json

# View schedule
npm run campaign:schedule

# Railway logs
railway logs --tail 100

# Restart service
railway redeploy
```

## 💡 Pro Tips

1. **Monitor First Post**: Be online Monday at 09:00 to watch first Twitter thread post
2. **Check Logs Daily**: First week, check Railway logs daily
3. **Engage Manually**: Automation posts content, you engage with responses
4. **Track Performance**: Note which posts perform best for future content

## 🔐 Security

- All credentials stored securely in Railway
- Environment variables encrypted
- Logs don't expose sensitive data
- Service runs in isolated container

---

**Railway Project**: https://railway.com/project/531789bd-5e77-41ad-aea9-40d74ec491ca

**Ready to deploy!** Follow the 5 steps above. 🚀
