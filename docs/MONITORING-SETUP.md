# External Monitoring System Setup

## Overview

The GitHub Actions monitoring system runs every 30 minutes to check:
- ✅ Vercel deployment status (build failures)
- ✅ Cron job health endpoint
- 🚨 Auto-creates GitHub issues on failures

This prevents the silent downtime that occurred with the apostrophe bug (60+ hours, $25/day ad spend wasted).

## Why GitHub Actions Instead of Railway?

1. **Free** - No additional costs
2. **Reliable** - GitHub's infrastructure is more stable
3. **Integrated** - Automatic issue creation with detailed remediation steps
4. **No Maintenance** - No separate service to monitor

## Setup Instructions

### 1. Get Your Vercel Token

```bash
# Login to Vercel
npx vercel login

# Get your token from Vercel dashboard
# Go to: https://vercel.com/account/tokens
# Click "Create Token"
# Name it "GitHub Actions Monitoring"
# Copy the token
```

### 2. Get Your Vercel IDs

```bash
# Get your Organization ID and Project ID
npx vercel project ls

# Look for these values:
# - Organization ID (org_xxx)
# - Project ID (prj_xxx)
```

### 3. Add Secrets to GitHub

1. Go to https://github.com/mrbrandonmills/Webdesigner/settings/secrets/actions
2. Click "New repository secret"
3. Add these three secrets:

| Secret Name | Value | Where to Find |
|-------------|-------|---------------|
| `VERCEL_TOKEN` | `token_xxx...` | https://vercel.com/account/tokens |
| `VERCEL_ORG_ID` | `org_xxx...` | Run `vercel project ls` |
| `VERCEL_PROJECT_ID` | `prj_xxx...` | Run `vercel project ls` |

### 4. Test the Monitoring

```bash
# Trigger the workflow manually to test
# Go to: https://github.com/mrbrandonmills/Webdesigner/actions
# Click "Monitor Vercel Deployments"
# Click "Run workflow"
```

## What Happens on Failure?

When a build fails or cron jobs stop:

1. **GitHub Issue Created** with:
   - Timestamp of failure
   - Links to Vercel logs
   - Revenue impact warning
   - Remediation checklist

2. **Labels Applied**:
   - `automated-alert`
   - `deployment-failure`
   - `critical`

3. **Only One Issue** created (won't spam on repeated failures)

## Manual Checks

You can manually check the health endpoint:

```bash
curl https://brandonmills.com/api/integrations/health
```

Should return:
```json
{
  "status": "healthy",
  "timestamp": "2024-11-23T03:00:00.000Z"
}
```

## Automation Schedule

- **Monitoring**: Every 30 minutes
- **Twitter Posts**: 9am, 1pm, 5pm, 9pm
- **Instagram Posts**: 9:30am, 1:30pm, 5:30pm, 9:30pm
- **Pinterest Posts**: 9:15am, 1:15pm, 5:15pm, 9:15pm
- **Jesse's Book Posts**: 9:45am, 1:45pm, 5:45pm, 9:45pm
- **Blog Posts**: 10am daily
- **Health Checks**: Every 15 minutes

## Revenue Protection

This monitoring system protects against:
- ❌ Silent build failures (like the apostrophe bug)
- ❌ Cron job failures
- ❌ API integration issues
- ❌ Deployment errors

**Result**: Immediate notification when automation stops, preventing wasted ad spend and lost affiliate revenue.
