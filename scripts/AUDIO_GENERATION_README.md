# Pre-Generated Audio System

This directory contains scripts for pre-generating audio files for all poems and uploading them to Vercel Blob storage for instant playback.

## Overview

Instead of generating audio on-demand (which takes ~1 minute per generation), we pre-generate all audio files and store them in Vercel Blob storage. This provides:

- **Instant playback** - No waiting for audio generation
- **Better user experience** - Audio loads immediately when users click play
- **Reduced API costs** - Generate once, use forever
- **Reliability** - No generation failures at runtime

## Architecture

### Components

1. **Pre-generation Script** (`pre-generate-poem-audio.ts`)
   - Generates audio for all 3 poems × 4 voices = 12 files
   - Uploads to Vercel Blob storage
   - Saves URLs to `pre-generated-audio-urls.json`

2. **URL Update Script** (`update-audio-urls.ts`)
   - Reads URLs from `pre-generated-audio-urls.json`
   - Updates API route with new URLs

3. **API Route** (`/app/api/get-poem-audio/route.ts`)
   - Returns pre-generated audio URLs
   - Used by audio-reader component

4. **Audio Reader Component** (`/components/audio-reader.tsx`)
   - Checks for pre-generated audio first
   - Falls back to on-demand generation if not available
   - Creates Blob URLs for playback

## Setup

### Environment Variables

You need these environment variables set in your Vercel project and `.env.local`:

```bash
# Cartesia AI API key for text-to-speech
CARTESIA_API_KEY=your_cartesia_api_key

# Vercel Blob storage token
BLOB_READ_WRITE_TOKEN=your_blob_token
```

### Get Vercel Blob Token

1. Go to Vercel Dashboard → Your Project → Storage → Create Database
2. Select "Blob Storage"
3. Copy the `BLOB_READ_WRITE_TOKEN` from the environment variables

## Usage

### Step 1: Generate Audio Files

Run the pre-generation script to create all 12 audio files:

```bash
npm run audio:generate
```

This will:
- Generate audio for each poem with each voice (12 files total)
- Upload to Vercel Blob storage
- Save URLs to `scripts/pre-generated-audio-urls.json`
- Take approximately 12-15 minutes to complete

**Expected output:**
```
Pre-generating audio for all poems...

Processing: Fine Lines
  Voice: male
  Calling Cartesia API with voice: male
  Generated 245678 bytes of audio
  Uploading to Vercel Blob: poems/fine-lines/male.mp3
  Uploaded successfully: https://xxx.blob.vercel-storage.com/poems/fine-lines/male-xxx.mp3
  ✓ Success

  Voice: female
  ...
```

### Step 2: Update API Route

After generation completes, update the API route with the new URLs:

```bash
npm run audio:update-urls
```

This will:
- Read URLs from `pre-generated-audio-urls.json`
- Update `/app/api/get-poem-audio/route.ts` with the URLs
- Commit the changes

**Expected output:**
```
✓ Successfully updated audio URLs in API route
  File: /path/to/app/api/get-poem-audio/route.ts

Updated URLs:
{
  "fine-lines": {
    "male": "https://...",
    "female": "https://...",
    ...
  },
  ...
}
```

### Step 3: Deploy

Commit and push the updated API route:

```bash
git add app/api/get-poem-audio/route.ts
git commit -m "Update pre-generated audio URLs"
git push
```

Vercel will automatically deploy the changes.

## Audio Files

### Poems

1. **Fine Lines** (`fine-lines`)
   - Philosophical poem about language and consciousness
   - ~2-3 minutes per voice

2. **Poet, Proponent** (`poet-proponent`)
   - Poem about systemic oppression and liberation
   - ~1-2 minutes per voice

3. **The Tourbillon** (`the-tourbillon`)
   - Poem about status and constraint
   - ~1 minute per voice

### Voices

1. **male** - Classy British Man (63ff761f-c1e8-414b-b969-d1833d1c870c)
2. **female** - British Lady (79a125e8-cd45-4c13-8a67-188112f4dd22)
3. **male-indian** - Indian Man (846d6cb0-2301-48b6-9683-48f5618ea2f6)
4. **female-indian** - Indian Lady (e13cae5c-ec59-4f71-b0a6-266df3c9ea12)

## How It Works

### Request Flow

1. User clicks play on a poem page
2. `audio-reader.tsx` calls `/api/get-poem-audio?contentId=fine-lines&voice=male`
3. API returns pre-generated URL from Vercel Blob
4. Audio loads instantly from CDN
5. User can play immediately

### Fallback Flow

If pre-generated audio is not available:

1. API returns `preGenerated: false`
2. `audio-reader.tsx` falls back to on-demand generation
3. Calls `/api/text-to-speech` to generate audio
4. Creates Blob URL for playback
5. Takes ~1 minute but still works

## File Structure

```
scripts/
├── pre-generate-poem-audio.ts      # Generates and uploads audio
├── update-audio-urls.ts            # Updates API route with URLs
├── pre-generated-audio-urls.json   # Generated URLs (created by script)
└── AUDIO_GENERATION_README.md      # This file

app/api/
├── get-poem-audio/
│   └── route.ts                    # Returns pre-generated URLs
└── text-to-speech/
    └── route.ts                    # On-demand generation (fallback)

components/
└── audio-reader.tsx                # Audio player component
```

## Troubleshooting

### "CARTESIA_API_KEY environment variable is required"

Set the environment variable:

```bash
# In .env.local
CARTESIA_API_KEY=your_key_here
```

### "BLOB_READ_WRITE_TOKEN environment variable is required"

1. Go to Vercel Dashboard → Storage → Blob
2. Copy the `BLOB_READ_WRITE_TOKEN`
3. Add to `.env.local`

### "Invalid MP3 data received from Cartesia API"

The Cartesia API returned invalid audio data. This is rare but can happen if:
- The API is down or experiencing issues
- Network issues during download
- Invalid API key

**Solution**: Wait a few minutes and try again.

### Audio doesn't play in browser

Check browser console for errors:
- Look for CORS errors
- Check if Blob URL is valid
- Verify audio element is created
- Check browser autoplay policies

## Cost Estimation

### Cartesia API
- ~$0.10 per minute of audio
- 12 files × ~2 minutes average = ~24 minutes
- **Total: ~$2.40 per generation**

### Vercel Blob Storage
- Free tier: 1GB storage + 100GB bandwidth
- 12 files × ~200KB average = ~2.4MB total
- **Cost: Free (well within limits)**

### Total Cost
- **One-time: ~$2.40** for generating all 12 files
- **Ongoing: $0** (stored in blob, unlimited playback)

## Maintenance

### Adding New Poems

1. Add poem content to `POEMS` object in `pre-generate-poem-audio.ts`
2. Add entry to `PRE_GENERATED_AUDIO` in `/app/api/get-poem-audio/route.ts`
3. Run `npm run audio:generate`
4. Run `npm run audio:update-urls`
5. Commit and deploy

### Updating Existing Audio

1. Run `npm run audio:generate`
2. Run `npm run audio:update-urls`
3. Commit and deploy

Old files in Vercel Blob will be automatically replaced.

## Notes

- Audio files are cached with `max-age=31536000` (1 year)
- Blob URLs are session-specific and can't be stored in localStorage
- Pre-generated audio is served from Vercel's global CDN
- On-demand generation is still available as a fallback
- Audio quality: 44.1kHz MP3, optimized for voice

## Support

For issues or questions:
- Check browser console for detailed error messages
- Verify environment variables are set
- Ensure Vercel Blob storage is configured
- Check Cartesia API status at https://status.cartesia.ai
