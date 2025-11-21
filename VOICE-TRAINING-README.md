# Brandon's Authentic Voice Training System

## What This Does

This system scrapes your @mrbrandonmills Instagram, analyzes your authentic voice, and generates social media posts that sound **exactly like you** - not generic marketing bots.

**Key Feature:** Posts are only published if they score ≥95% "Brandon-ness"

---

## Quick Start

### 1. Train the Voice Profile (One Time)

```bash
npm run train-voice
```

This will:
- Scrape your last 100 Instagram posts
- Analyze your tone, style, vocabulary, themes
- Generate a voice profile with Gemini
- Test content generation
- Save profile to `data/brandon-voice-profile.json`

**Run time:** ~2-3 minutes

---

### 2. Automated Posting (Already Running)

The system auto-posts 4x daily:
- **9:00am** - Twitter
- **9:15am** - Pinterest
- **9:30am** - Instagram

Each post is generated fresh using your voice profile and only posts if ≥95% authentic.

---

### 3. Update Voice Profile (Weekly)

```bash
npm run train-voice:quick
```

Skips if profile < 7 days old. Force update:

```bash
npm run train-voice
```

---

## How It Works

### Content Generation Flow

```
1. Load voice profile (your Instagram analysis)
2. Generate 10 post options
3. Score each for "Brandon-ness" (0-100)
4. Select best option
5. If score < 95%, DON'T POST
6. If score ≥ 95%, post + track performance
```

### What Gets Analyzed

From your Instagram:
- **Tone:** Raw, philosophical, poetic intensity
- **Style:** Sentence structure, punctuation, capitalization
- **Vocabulary:** Unique phrases you use, words you avoid
- **Themes:** Self-actualization, art, truth vs superficial positivity
- **Hashtags:** Minimal branded tags vs heavy topical

### Performance Tracking

After posting, the system:
- Tracks likes, comments, shares, saves
- Calculates engagement rate
- Learns what content performs well
- Feeds insights back into generation

View performance:
```bash
npm run train-voice
```
(Shows insights at the end)

---

## Files Created

```
data/
  brandon-voice-profile.json      # Your voice model
  instagram-training-data.json    # Raw scraped data
  post-performance.json            # Engagement tracking

lib/voice-training/
  instagram-scraper.ts             # Scrapes @mrbrandonmills
  voice-profile-generator.ts       # Analyzes with Gemini
  authentic-content-generator.ts   # Generates posts (95% threshold)
  performance-tracker.ts           # Tracks engagement

app/api/cron/authentic-social-post/route.ts  # New cron endpoint
```

---

## Quality Control

### Brandon-ness Scoring Criteria

**95-100:** Sounds exactly like you
- Uses YOUR unique phrases
- Matches YOUR punctuation/capitalization style
- Authentic tone (raw/philosophical)
- Avoids generic marketing words

**80-94:** Close but not quite
- Mostly authentic but some generic elements
- Missing some of your unique style

**<80:** Generic marketing
- Uses words like "excited to announce"
- Too polished/professional
- Doesn't match your rawness

**Example Scores:**

❌ 42%: "Excited to announce my new poetry collection! Check it out 🎉"
- Generic marketing language
- Emoji spam
- Not your voice

✅ 97%: "We lean on singular words with multiple meanings, but we don't know how to use them. New prints available."
- Uses your actual poetry
- Simple, direct
- No fake excitement

---

## Troubleshooting

### Voice Training Fails

```
Error: INSTAGRAM_ACCESS_TOKEN not found
```

**Fix:** Check `.env.local` has:
```
INSTAGRAM_ACCESS_TOKEN=your_token
INSTAGRAM_BUSINESS_ACCOUNT_ID=your_account_id
```

### No Posts Pass 95% Threshold

```
⚠️ Best post only scored 87%
```

**Fix:** Voice profile may need retraining with more posts:
```bash
npm run train-voice
```

Or check if topic is too generic - authentic voice works best with:
- Poetry/philosophy
- Personal insights
- Raw thoughts

Avoid:
- Generic product pitches
- Corporate announcements
- Fake positivity

### Cron Not Posting

Check Vercel logs:
1. Go to https://vercel.com/mrbrandonmills/webdesigner
2. Click "Logs"
3. Filter by `/api/cron/authentic-social-post`

---

## Advanced Usage

### Test Content Generation Locally

```bash
# Edit scripts/test-content-gen.ts
npm run test-content-gen
```

### Manual Post Generation

```bash
curl https://brandonmills.com/api/cron/authentic-social-post?platform=instagram
```

### View Performance Insights

```bash
npm run train-voice
# Shows insights at end
```

---

## Comparison: Before vs After

### OLD System (Generic)
```
"New poetry collection explores the boundaries between chaos and order.
Available now. #poetry #art #brandonmills"
```
- Sounds like a press release
- Generic marketing speak
- Brandon-ness: ~40%

### NEW System (Authentic)
```
"Artists with the front facing persona - it's an illusion.
Like how you're 'fine' walking upright with that brain contusion."
```
- Uses YOUR actual poetry
- Raw, authentic voice
- Brandon-ness: 98%

---

## Maintenance

**Weekly:** Update voice profile
```bash
npm run train-voice:quick
```

**Monthly:** Review performance insights
```bash
npm run train-voice
# Check "PERFORMANCE INSIGHTS" section
```

**As Needed:** Adjust generation if posts aren't passing threshold

---

## Future Enhancements

- [ ] Instagram Stories automation
- [ ] Image generation matching post content
- [ ] Multi-image carousel posts
- [ ] Video content generation
- [ ] Real-time A/B testing

---

## Support

Issues? Check:
1. `.env.local` has all required tokens
2. Voice profile exists: `data/brandon-voice-profile.json`
3. Vercel cron logs for errors

For questions: Review this README or check the code comments in `lib/voice-training/`
