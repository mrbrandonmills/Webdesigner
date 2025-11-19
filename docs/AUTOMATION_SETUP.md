# Automated Content Posting Setup Guide

This guide walks you through setting up 100% automated content posting using GitHub Actions. Once configured, your content will be posted automatically without any server costs.

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [API Keys Setup](#api-keys-setup)
4. [GitHub Secrets Configuration](#github-secrets-configuration)
5. [Enable Workflows](#enable-workflows)
6. [Monitoring & Troubleshooting](#monitoring--troubleshooting)

---

## Overview

### Workflow Schedule

| Workflow | Schedule | Purpose |
|----------|----------|---------|
| **Reddit Post** | Daily at 10 AM PST | Post dream analysis content to relevant subreddits |
| **Twitter Posts** | 3x daily (9 AM, 2 PM, 7 PM PST) | Engage followers with dream-related content |
| **Content Generation** | Weekly on Sunday 6 AM PST | Generate AI-powered content for the week |
| **Quora Answers** | Daily at 11 AM PST | Answer dream-related questions |

### Benefits

- **Free hosting** - Runs on GitHub Actions free tier
- **No server maintenance** - Fully managed by GitHub
- **Automatic retries** - Built-in error handling and notifications
- **Scalable** - Easy to add new platforms

---

## Prerequisites

Before starting, ensure you have:

- [ ] GitHub account with the repository
- [ ] Accounts on each platform (Reddit, Twitter, Quora)
- [ ] Credit card for API access (most offer free tiers)
- [ ] 30-60 minutes for initial setup

---

## API Keys Setup

### 1. Reddit API

1. Go to [Reddit App Preferences](https://www.reddit.com/prefs/apps)
2. Scroll down and click **"create another app..."**
3. Fill in the form:
   - **Name:** `brandonmills-poster` (or your choice)
   - **Type:** Select **script**
   - **Description:** `Automated content posting`
   - **About URL:** `https://brandonmills.com`
   - **Redirect URI:** `http://localhost:8080`
4. Click **"create app"**
5. Note these values:
   - **Client ID:** Under the app name (random string)
   - **Client Secret:** Labeled "secret"

**Required Secrets:**
```
REDDIT_CLIENT_ID=<your_client_id>
REDDIT_CLIENT_SECRET=<your_secret>
REDDIT_USERNAME=<your_reddit_username>
REDDIT_PASSWORD=<your_reddit_password>
REDDIT_USER_AGENT=script:brandonmills-poster:v1.0 (by /u/<your_username>)
```

### 2. Twitter/X API

1. Go to [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard)
2. Sign in and create a new project
3. Create an app within the project
4. Set up **User Authentication**:
   - App permissions: **Read and Write**
   - Type of App: **Web App, Automated App or Bot**
5. Generate keys in **Keys and Tokens** section:
   - **API Key and Secret** (Consumer Keys)
   - **Access Token and Secret** (User Authentication)
   - **Bearer Token**

**Required Secrets:**
```
TWITTER_API_KEY=<api_key>
TWITTER_API_SECRET=<api_secret>
TWITTER_ACCESS_TOKEN=<access_token>
TWITTER_ACCESS_SECRET=<access_token_secret>
TWITTER_BEARER_TOKEN=<bearer_token>
```

### 3. Quora Account

Quora uses browser automation (Puppeteer), so you only need login credentials:

**Required Secrets:**
```
QUORA_EMAIL=<your_quora_email>
QUORA_PASSWORD=<your_quora_password>
```

**Important Notes:**
- Use a dedicated Quora account for automation
- Enable 2FA with app-based authentication (not SMS)
- Consider Quora's Terms of Service

### 4. OpenAI API (for Content Generation)

1. Go to [OpenAI API Platform](https://platform.openai.com/api-keys)
2. Click **"Create new secret key"**
3. Name it `github-actions-content-gen`
4. Copy the key immediately (shown only once)

**Required Secrets:**
```
OPENAI_API_KEY=sk-...
```

**Alternative: Anthropic Claude**
```
ANTHROPIC_API_KEY=sk-ant-...
```

---

## GitHub Secrets Configuration

### Step 1: Access Repository Settings

1. Go to your GitHub repository
2. Click **Settings** tab
3. In left sidebar, click **Secrets and variables** > **Actions**

### Step 2: Add Repository Secrets

Click **"New repository secret"** for each:

| Secret Name | Description |
|-------------|-------------|
| `REDDIT_CLIENT_ID` | Reddit app client ID |
| `REDDIT_CLIENT_SECRET` | Reddit app secret |
| `REDDIT_USERNAME` | Your Reddit username |
| `REDDIT_PASSWORD` | Your Reddit password |
| `REDDIT_USER_AGENT` | Custom user agent string |
| `TWITTER_API_KEY` | Twitter API key |
| `TWITTER_API_SECRET` | Twitter API secret |
| `TWITTER_ACCESS_TOKEN` | Twitter access token |
| `TWITTER_ACCESS_SECRET` | Twitter access secret |
| `TWITTER_BEARER_TOKEN` | Twitter bearer token |
| `QUORA_EMAIL` | Quora login email |
| `QUORA_PASSWORD` | Quora login password |
| `OPENAI_API_KEY` | OpenAI API key |
| `SITE_URL` | Your site URL (e.g., `https://brandonmills.com`) |

### Step 3: Add Optional Variables

In **Variables** tab (not Secrets), add:

| Variable Name | Value | Purpose |
|---------------|-------|---------|
| `NOTIFICATION_WEBHOOK_URL` | Slack/Discord webhook URL | Get notified of workflow results |

### Step 4: (Optional) Add PAT Token

For auto-merge functionality on content PRs:

1. Go to GitHub **Settings** > **Developer settings** > **Personal access tokens**
2. Generate new token (classic) with `repo` scope
3. Add as secret: `PAT_TOKEN`

---

## Enable Workflows

### Step 1: Verify Workflows Exist

Ensure these files are in `.github/workflows/`:
- `daily-reddit-post.yml`
- `daily-twitter-post.yml`
- `weekly-content-gen.yml`
- `quora-poster.yml`

### Step 2: Enable GitHub Actions

1. Go to repository **Settings** > **Actions** > **General**
2. Under "Actions permissions", select **"Allow all actions and reusable workflows"**
3. Under "Workflow permissions", select **"Read and write permissions"**
4. Check **"Allow GitHub Actions to create and approve pull requests"**
5. Click **Save**

### Step 3: Push Workflows

```bash
git add .github/workflows/
git commit -m "feat: Add automated posting workflows"
git push origin main
```

### Step 4: Verify Workflows Appear

1. Go to repository **Actions** tab
2. You should see all four workflows listed
3. Each will show "No workflow runs yet"

### Step 5: Test Workflows

Test each workflow manually:

1. Click on a workflow name
2. Click **"Run workflow"** button
3. Select branch: `main`
4. Enable **"Run in dry-run mode"** for testing
5. Click **"Run workflow"**
6. Monitor the run for any errors

---

## Monitoring & Troubleshooting

### Viewing Workflow Runs

1. Go to **Actions** tab
2. Click on a workflow to see run history
3. Click on a specific run to see details
4. Expand each step to see logs

### Common Issues

#### Reddit: "Invalid credentials"
- Verify username/password are correct
- Check if 2FA is enabled (may need app password)
- Ensure the app is set to "script" type

#### Twitter: "403 Forbidden"
- Check API access level (need Elevated or higher for posting)
- Verify all 5 tokens are correct
- Ensure app has Read+Write permissions

#### Quora: "Login failed"
- Quora may have CAPTCHA protection
- Try logging in manually first
- Consider using a less active account

#### Content Generation: "API key invalid"
- OpenAI keys start with `sk-`
- Check for trailing spaces in secret
- Verify billing is set up in OpenAI

### Setting Up Notifications

#### Slack Webhook

1. Go to your Slack workspace
2. Create an app at [api.slack.com/apps](https://api.slack.com/apps)
3. Enable **Incoming Webhooks**
4. Create webhook for a channel
5. Add URL to `NOTIFICATION_WEBHOOK_URL` variable

#### Discord Webhook

1. Open Discord server settings
2. Go to **Integrations** > **Webhooks**
3. Create new webhook
4. Copy webhook URL
5. Add to `NOTIFICATION_WEBHOOK_URL` variable

### Failed Workflow Issues

When a workflow fails, it automatically:
1. Creates a GitHub issue with error details
2. Uploads logs as artifacts
3. Sends webhook notification (if configured)

To investigate:
1. Check the created issue
2. Download artifacts from the workflow run
3. Review the detailed logs

### Rate Limits

- **Reddit:** 60 requests/minute, but post limits vary by subreddit
- **Twitter:** 50 tweets/day on free tier
- **Quora:** No official API, use cautiously
- **OpenAI:** Depends on plan, usually $0.002/1K tokens

---

## Advanced Configuration

### Customizing Schedule

Edit the cron expressions in each workflow file:

```yaml
on:
  schedule:
    - cron: '0 18 * * *'  # Format: minute hour day month weekday
```

Useful cron expressions:
- `0 17 * * 1-5` - Weekdays at 5 PM UTC
- `0 */6 * * *` - Every 6 hours
- `0 14 * * 0` - Sundays at 2 PM UTC

### Adding New Platforms

1. Create posting script in `scripts/auto-post-<platform>.ts`
2. Copy an existing workflow as template
3. Add necessary secrets
4. Test with dry-run mode

### Disabling Workflows

To temporarily disable without deleting:

1. Go to **Actions** tab
2. Click on workflow name
3. Click **"..."** menu > **"Disable workflow"**

---

## Security Best Practices

1. **Use dedicated accounts** - Don't use personal accounts for automation
2. **Rotate credentials** - Change API keys periodically
3. **Monitor activity** - Review posting logs weekly
4. **Respect rate limits** - Don't increase posting frequency aggressively
5. **Review generated content** - Check AI content before auto-merge

---

## Cost Estimation

| Service | Free Tier | Estimated Monthly Cost |
|---------|-----------|------------------------|
| GitHub Actions | 2,000 minutes/month | $0 |
| Reddit API | Free | $0 |
| Twitter API | Free tier limited | $0-100 |
| OpenAI API | $5 free credit | ~$5-20 |
| **Total** | | **~$5-25/month** |

---

## Support

If you encounter issues:

1. Check the [GitHub Actions documentation](https://docs.github.com/en/actions)
2. Review workflow logs in the Actions tab
3. Check created issues for error details
4. Test individual scripts locally first

---

## Checklist

Before going live:

- [ ] All API keys obtained
- [ ] All secrets added to GitHub
- [ ] Workflows enabled in repository settings
- [ ] Test run completed for each workflow (dry-run mode)
- [ ] Notification webhook configured (optional)
- [ ] Content reviewed in generated PRs
- [ ] Rate limits understood for each platform

Once complete, your automated posting system will run entirely on GitHub Actions - free, reliable, and maintenance-free!
