# Quick Start Guide - Pre-Generated Audio

## TL;DR

```bash
# One command to do everything:
npm run audio:setup

# Then commit and deploy:
git add app/api/get-poem-audio/route.ts
git commit -m "Add pre-generated audio URLs"
git push
```

---

## Prerequisites

Add to `.env.local`:

```bash
CARTESIA_API_KEY=your_cartesia_api_key
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token
```

Get Blob token: **Vercel Dashboard → Storage → Blob → Environment Variables**

---

## Step-by-Step

### Option 1: Automated Setup (Recommended)

```bash
npm run audio:setup
```

This will:
1. ✅ Generate all 12 audio files
2. ✅ Upload to Vercel Blob
3. ✅ Update API route with URLs
4. ✅ Show you what to commit

Then deploy:
```bash
git add app/api/get-poem-audio/route.ts
git commit -m "Add pre-generated audio URLs"
git push
```

### Option 2: Manual Steps

```bash
# Step 1: Generate audio (12-15 minutes)
npm run audio:generate

# Step 2: Update API route
npm run audio:update-urls

# Step 3: Deploy
git add app/api/get-poem-audio/route.ts
git commit -m "Add pre-generated audio URLs"
git push
```

---

## What Gets Generated

**3 poems × 4 voices = 12 audio files**

| Poem | Voices |
|------|--------|
| Fine Lines | male, female, male-indian, female-indian |
| Poet, Proponent | male, female, male-indian, female-indian |
| The Tourbillon | male, female, male-indian, female-indian |

---

## Verification

1. Deploy to Vercel
2. Visit: `https://brandonmills.com/writing/poetry/fine-lines`
3. Click play button
4. Audio should load **instantly** (no 1-minute wait)
5. Check console: Should see "Using pre-generated audio from blob storage"

---

## Troubleshooting

### "Environment variable not set"
→ Add to `.env.local` and restart dev server

### "Audio still takes 1 minute"
→ Check `/app/api/get-poem-audio/route.ts` has valid URLs
→ Redeploy to Vercel

### "No sound playing"
→ Check browser console for errors
→ Verify audio element is created
→ Check browser autoplay policies

---

## Documentation

- **Full Details:** `/scripts/AUDIO_GENERATION_README.md`
- **Implementation Summary:** `/AUDIO_IMPLEMENTATION_SUMMARY.md`
- **This Guide:** `/scripts/QUICK_START.md`

---

## Cost

- **One-time:** ~$2.40 (generate all files)
- **Storage:** $0 (Vercel free tier)
- **Bandwidth:** $0 (Vercel free tier)
- **Per play:** $0 (vs $0.10 on-demand)

---

## Support

Questions? Check the docs above or:
- Browser console for detailed errors
- Network tab to verify requests
- Verify environment variables are set
