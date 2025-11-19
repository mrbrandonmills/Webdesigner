# Content Automation System

Fully automated content posting system for brandonmills.com that runs on a schedule without human intervention.

## Overview

This system automatically:
- Posts to Reddit (1 post per day)
- Posts to Twitter (1-2 tweets per day)
- Posts to Quora (1 answer per day)
- Generates fresh content using AI (weekly)

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```bash
# Reddit API
REDDIT_CLIENT_ID=your_client_id
REDDIT_CLIENT_SECRET=your_client_secret
REDDIT_USERNAME=your_username
REDDIT_PASSWORD=your_password

# Twitter API v2
TWITTER_API_KEY=your_api_key
TWITTER_API_SECRET=your_api_secret
TWITTER_ACCESS_TOKEN=your_access_token
TWITTER_ACCESS_SECRET=your_access_secret

# Quora
QUORA_EMAIL=your_email
QUORA_PASSWORD=your_password

# AI (for content generation)
OPENAI_API_KEY=your_key
# or
ANTHROPIC_API_KEY=your_key
```

### 3. Run the Automation

```bash
# Start the scheduler (runs 24/7)
npm run automate

# Or run once and exit
npm run automate:once

# Check current status
npm run automate:status
```

## Commands

| Command | Description |
|---------|-------------|
| `npm run automate` | Start the 24/7 scheduler |
| `npm run automate:once` | Run all tasks once and exit |
| `npm run automate:status` | Show current status |
| `npm run automate:reddit` | Post to Reddit only |
| `npm run automate:twitter` | Post to Twitter only |
| `npm run automate:quora` | Post to Quora only |
| `npm run automate:generate` | Generate new content |

## Schedule (UTC)

- **08:00** - Content generation (if running low)
- **14:00** - Reddit post (10 AM EST)
- **16:00** - Twitter post (12 PM EST)
- **18:00** - Quora post (2 PM EST)

## Content Files

Content is stored in the `/content` directory:

```
content/
  reddit/
    posts.md       # Reddit posts
    schedule.md    # Posting schedule
  twitter/
    tweets.md      # Tweets
  quora/
    answers.md     # Quora answers
```

### Content Format

**Reddit Posts (posts.md):**
```markdown
---
subreddit: malegrooming
title: "Your post title here"
text: Your post content here.
This can be multiple lines.
---
```

**Twitter (tweets.md):**
```markdown
---
Your tweet text here (max 280 chars)
---
```

**Quora (answers.md):**
```markdown
---
keywords: dream interpretation meaning
answer: Your detailed answer here.
Can be multiple paragraphs.
---
```

## Features

### Rate Limiting
- Reddit: Max 5 posts per day, 1 minute between posts
- Twitter: Max 50 tweets per day, 3 seconds between tweets
- Quora: Max 3 answers per day, 30 seconds between answers

### State Tracking
- Tracks all posted content to avoid duplicates
- Maintains posting history
- Rotates through content automatically
- Resets daily counts at midnight

### Error Handling
- Automatic retries with exponential backoff
- Cooldown periods after errors
- Detailed logging to `/logs/automation.log`

### AI Content Generation
- Uses OpenAI GPT-4 or Anthropic Claude
- Generates platform-appropriate content
- Saves to content files for review
- Generates weekly when content runs low

## API Setup

### Reddit

1. Go to https://www.reddit.com/prefs/apps
2. Click "create another app..."
3. Select "script"
4. Name: "Brandon Mills Auto-Poster"
5. Redirect URI: `http://localhost:8080`
6. Click "create app"
7. Note the client ID (under app name) and secret

### Twitter

1. Go to https://developer.twitter.com/
2. Create a developer account
3. Create a project and app
4. Generate API keys and access tokens
5. Note: Requires Basic plan ($100/month) for write access

### Quora

Quora doesn't have a public API, so we use browser automation:
1. Just use your regular Quora login credentials
2. The system uses Puppeteer to automate the browser

## Logs

All activity is logged to `/logs/automation.log`:

```
[INFO] [2024-01-15T14:00:00.000Z] [SCHEDULER] Triggered: Reddit post
[INFO] [2024-01-15T14:00:01.000Z] [REDDIT] Starting Reddit posting (count: 1)
[SUCCESS] [2024-01-15T14:00:05.000Z] [REDDIT] Post completed: r/Dreams...
```

View recent logs:
```bash
tail -f logs/automation.log
```

## Running as a Service

### Using PM2

```bash
npm install -g pm2
pm2 start npm --name "content-automation" -- run automate
pm2 save
pm2 startup
```

### Using systemd (Linux)

Create `/etc/systemd/system/content-automation.service`:

```ini
[Unit]
Description=Content Automation
After=network.target

[Service]
Type=simple
User=your-user
WorkingDirectory=/path/to/project
ExecStart=/usr/bin/npm run automate
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Then:
```bash
sudo systemctl enable content-automation
sudo systemctl start content-automation
```

## Troubleshooting

### "Reddit credentials not configured"
Ensure all four Reddit variables are set in `.env.local`

### "Rate limited"
The system will automatically wait and retry. If persistent, you may need to wait longer between posts.

### "Login failed" (Quora)
Quora may have CAPTCHA or 2FA. Try logging in manually first, then run the automation.

### "No content available"
Run `npm run automate:generate` to create new content.

## Security Notes

- Never commit `.env.local` to version control
- Use strong, unique passwords for all accounts
- Consider creating dedicated accounts for automation
- Monitor logs for any suspicious activity

## Architecture

```
scripts/automation/
  config.ts          # Configuration and environment variables
  logger.ts          # Centralized logging
  state-manager.ts   # Tracks posting state
  reddit-poster.ts   # Reddit posting logic
  twitter-poster.ts  # Twitter posting logic
  quora-poster.ts    # Quora posting logic (Puppeteer)
  content-generator.ts # AI content generation
  scheduler.ts       # Main scheduler with cron jobs
  index.ts           # Module exports
```

## Contributing

When adding new features:
1. Follow the existing patterns for error handling
2. Add appropriate logging
3. Update state tracking
4. Add tests if possible
5. Update this README
