# 🚀 Deployment Guide

Complete setup guide for your luxury portfolio site with AI-powered content automation.

---

## 📋 Table of Contents

1. [Environment Setup](#environment-setup)
2. [Medium Integration](#medium-integration)
3. [Vercel Deployment](#vercel-deployment)
4. [Admin Dashboard](#admin-dashboard)
5. [Upload Workflows](#upload-workflows)
6. [Video Integration](#video-integration)
7. [Testing](#testing)

---

## 🔧 Environment Setup

### Required Environment Variables

Copy `.env.example` to `.env.local` and configure:

```bash
cp .env.example .env.local
```

### Core APIs

**OpenAI (Whisper transcription)**
```env
OPENAI_API_KEY=sk-...
```
- Get from: https://platform.openai.com/api-keys
- Used for: Voice memo transcription (unlimited length support)

**Anthropic (Claude content processing)**
```env
ANTHROPIC_API_KEY=sk-ant-...
```
- Get from: https://console.anthropic.com/
- Used for: Essay formatting, collection metadata, SEO generation

**Vercel Blob (File storage)**
```env
BLOB_READ_WRITE_TOKEN=vercel_blob_...
```
- Auto-configured when you add Vercel Blob Storage
- Run: `vercel storage create` in your project

---

## 📝 Medium Integration

### Step 1: Get Integration Token

1. Go to https://medium.com/me/settings/security
2. Scroll to "Integration tokens"
3. Click "Get integration token"
4. Description: "Brandon Mills Portfolio Auto-Publisher"
5. Copy the token and add to `.env.local`:

```env
MEDIUM_ACCESS_TOKEN=your_integration_token_here
```

### Step 2: Get Author ID

1. Start your dev server: `npm run dev`
2. Visit: http://localhost:3000/api/publish/medium
3. Copy the `id` from the response
4. Add to `.env.local`:

```env
MEDIUM_AUTHOR_ID=your_author_id_here
```

### Step 3: Set Base URL

```env
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

This is used for canonical URLs when publishing to Medium.

### How Auto-Publishing Works

When you dictate an essay in the admin:
1. ✅ Voice memo transcribed via Whisper
2. ✅ Essay formatted by Claude
3. ✅ Title, SEO, keywords generated
4. ✅ Published to Medium as **draft** (for review)
5. ✅ Canonical URL points back to your site
6. ✅ Returns Medium URL in response

---

## 🎬 Vercel Deployment

### Initial Deploy

```bash
# Install Vercel CLI
npm i -g vercel

# Link project
vercel link

# Add environment variables
vercel env add OPENAI_API_KEY
vercel env add ANTHROPIC_API_KEY
vercel env add MEDIUM_ACCESS_TOKEN
vercel env add MEDIUM_AUTHOR_ID
vercel env add ADMIN_USERNAME
vercel env add ADMIN_PASSWORD
vercel env add NEXT_PUBLIC_BASE_URL

# Add Vercel Blob Storage
vercel storage create

# Deploy
vercel --prod
```

### Environment Variables in Vercel Dashboard

Alternatively, add via dashboard:
1. Go to https://vercel.com/[your-username]/[your-project]/settings/environment-variables
2. Add all variables from `.env.local`
3. Ensure they're available in **Production**, **Preview**, and **Development**

---

## 🎨 Admin Dashboard

### Access

Navigate to: `https://your-domain.com/admin/login`

Credentials (from `.env.local`):
- Username: `ADMIN_USERNAME`
- Password: `ADMIN_PASSWORD`

### 5 Specialized Upload Zones

#### 1️⃣ Modeling Upload
- **Purpose**: Batch photo uploads from one shoot
- **Accepts**: Images (.jpg, .png, .webp, .heic)
- **Voice Memo**: Describe the shoot vibe, location, style, mood
- **AI Processing**:
  - Transcribes voice memo
  - Generates collection title (if not provided)
  - Extracts keywords, vibe, location, style
  - Groups photos into collection
  - Creates metadata for gallery display

**Example workflow**:
```
1. Upload 15 photos from Vogue editorial shoot
2. Record voice memo: "Vogue Fall 2024 editorial, moody lighting, urban rooftop location, high fashion aesthetic, dramatic poses"
3. AI generates: "Vogue Fall Editorial 2024 - Urban Noir"
4. Collection appears in gallery with all metadata
```

#### 2️⃣ Acting Upload
- **Purpose**: Acting reels, clips, headshots
- **Accepts**: Videos (.mp4, .mov, .webm) and images
- **Voice Memo**: Describe the role, character, project
- **Detection**: Distinguishes reels (2-3 min) from clips (<1 min)

#### 3️⃣ Web Videos
- **Purpose**: Site background videos, hero sections
- **Accepts**: Videos only
- **No Voice Memo**: Just select purpose (Hero, Portfolio, B-Roll)
- **Usage**: Automatically available for VideoHero component

#### 4️⃣ Essays
- **Purpose**: Dictate or upload written essays
- **Voice Dictation**: Unlimited length, AI formats and publishes
- **Auto-features**:
  - Transcription & formatting
  - Title generation
  - SEO meta tags
  - Theme image generation (optional)
  - Auto-post to Medium (optional)

#### 5️⃣ Manage Content
- **View all uploaded content**
- **Filter by type** (Modeling, Acting, Essays, Videos)
- **Edit or delete collections**

---

## 🎥 Video Integration

### Where Videos Appear

#### Work Page (`/work`)
```tsx
// Uncomment when you upload acting/modeling reel:
<VideoHero videoSrc="/hero-reel.mp4" posterSrc="/hero-poster.jpg" className="h-screen">
  {/* Your hero content */}
</VideoHero>
```

#### Gallery Page (`/gallery`)
```tsx
// components/gallery/hero.tsx
// Follow the TODO comment to add video background
```

### Uploading Hero Videos

1. Go to Admin → Web Videos
2. Select "Hero Background Video"
3. Upload your modeling or acting reel
4. Video will be stored at `/portfolio-reel.mp4` or `/hero-reel.mp4`
5. Uncomment VideoHero in the respective page

### Video Specifications

**Hero/Background Videos**:
- Format: MP4 (H.264)
- Resolution: 1920x1080 or higher
- Duration: 10-30 seconds for backgrounds, 2-3 min for reels
- Size: Optimize for web (<50MB for backgrounds)

**Acting Reels**:
- Format: MP4
- Duration: 2-3 minutes (industry standard)
- Resolution: 1080p minimum

**Instagram Clips**:
- Format: MP4
- Duration: <60 seconds
- Aspect ratio: 9:16 (vertical) or 1:1 (square)

---

## 📤 Upload Workflows

### Modeling Collection Workflow

```
User Action → System Processing → Result
───────────────────────────────────────────────────────

1. Select 10-50 photos from one shoot
   ↓
2. Record voice memo describing:
   - Location (e.g., "rooftop in downtown LA")
   - Vibe (e.g., "moody, editorial, high fashion")
   - Style (e.g., "black and white minimalist")
   - Any special notes
   ↓
3. Optionally add collection name
   ↓
4. Click "Upload & Create Collection"
   ↓
   → Files uploaded to Vercel Blob
   → Voice memo transcribed via Whisper
   → Claude analyzes transcription
   → Generates: title, description, keywords, vibe
   → Collection saved with metadata
   ↓
5. Collection appears in Gallery
   - All photos grouped together
   - Hover effects applied
   - Searchable by keywords
   - Professional presentation
```

### Essay Workflow

```
User Action → System Processing → Result
───────────────────────────────────────────────────────

1. Click "Dictate Essay"
   ↓
2. Speak your essay (unlimited length)
   ↓
3. Stop recording
   ↓
4. Enable "Generate theme image" ✓
5. Enable "Auto-post to Medium" ✓
   ↓
6. Click "Process & Publish"
   ↓
   → Audio transcribed via Whisper
   → Claude formats as professional essay
   → Generates title
   → Creates SEO meta description & keywords
   → Generates theme image prompt
   → Auto-publishes to Medium as draft
   ↓
7. Returns:
   - Formatted essay
   - Title & SEO metadata
   - Medium draft URL for review
```

---

## 🧪 Testing

### Test Collection Upload

```bash
# 1. Start dev server
npm run dev

# 2. Login to admin
open http://localhost:3000/admin/login

# 3. Go to Modeling Upload
# 4. Upload 2-3 test images
# 5. Record a test voice memo: "Test collection for beach editorial shoot, bright lighting, summer vibes"
# 6. Click "Upload & Create Collection"

# Expected result:
# ✅ Collection created with AI-generated title
# ✅ Voice memo transcribed
# ✅ Keywords extracted
# ✅ Files stored in Vercel Blob
```

### Test Medium Publishing

```bash
# 1. Ensure MEDIUM_ACCESS_TOKEN and MEDIUM_AUTHOR_ID are set
# 2. Go to Admin → Essays
# 3. Click "Dictate Essay"
# 4. Record: "This is a test essay about the intersection of performance and cognition."
# 5. Enable "Auto-post to Medium"
# 6. Click Process

# Expected result:
# ✅ Essay formatted
# ✅ Published to Medium as draft
# ✅ Medium URL returned
# ✅ Check Medium drafts to verify
```

### Test Video Integration

```bash
# 1. Upload a test video via Admin → Web Videos
# 2. Select "Hero Background Video"
# 3. Note the returned URL
# 4. Edit app/work/page.tsx
# 5. Uncomment VideoHero and use the URL
# 6. Visit /work to see video background
```

---

## 🎯 Next Steps

After deployment:

1. **Configure Medium**
   - [ ] Get integration token
   - [ ] Add to environment variables
   - [ ] Test auto-publishing

2. **Upload Content**
   - [ ] Upload first modeling collection
   - [ ] Upload acting reel
   - [ ] Dictate first essay

3. **Add Videos to Design**
   - [ ] Upload hero background video
   - [ ] Uncomment VideoHero on Work page
   - [ ] Uncomment VideoHero on Gallery page

4. **Monitor & Optimize**
   - [ ] Check Vercel logs for errors
   - [ ] Monitor Blob storage usage
   - [ ] Track OpenAI/Anthropic API costs

---

## 📊 Cost Estimates

**OpenAI (Whisper)**:
- ~$0.006 per minute of audio
- 10 voice memos/month (3 min each) = ~$0.18/month

**Anthropic (Claude 3.5 Sonnet)**:
- Input: $3 per million tokens
- Output: $15 per million tokens
- ~20 collections + 5 essays/month = ~$2-5/month

**Vercel Blob Storage**:
- Free tier: 1GB storage, 100GB bandwidth
- Pro tier: $0.08/GB storage, $0.05/GB bandwidth

**Medium**:
- Free (no API costs)

**Estimated total**: $5-10/month for moderate usage

---

## 🆘 Troubleshooting

### Upload Fails

**Issue**: "Upload failed" error

**Solutions**:
1. Check Vercel Blob is configured: `vercel storage list`
2. Verify `BLOB_READ_WRITE_TOKEN` is set
3. Check file size (max 50MB per file)
4. Check browser console for specific errors

### Medium Publishing Fails

**Issue**: "Medium API credentials not configured"

**Solutions**:
1. Verify `MEDIUM_ACCESS_TOKEN` is set
2. Verify `MEDIUM_AUTHOR_ID` is set
3. Test token: Visit `/api/publish/medium`
4. Ensure token has write permissions

### Voice Transcription Fails

**Issue**: "Transcription failed" error

**Solutions**:
1. Verify `OPENAI_API_KEY` is set
2. Check OpenAI account has credits
3. Ensure audio format is supported (webm, mp3, wav)
4. Check audio file size (<25MB per Whisper limits)

### Video Not Displaying

**Issue**: VideoHero shows black screen

**Solutions**:
1. Check video format (must be MP4)
2. Verify video URL is correct
3. Check browser console for CORS errors
4. Ensure Vercel Blob URL is accessible (public)

---

## 🔐 Security Notes

1. **Never commit `.env.local`** - Already in `.gitignore`
2. **Rotate API keys** every 90 days
3. **Use strong admin password** - Change from default
4. **Enable 2FA** on all API accounts (OpenAI, Anthropic, Medium)
5. **Monitor usage** to detect unauthorized access

---

## 📞 Support

**Issues**: https://github.com/anthropics/claude-code/issues
**Docs**: https://docs.claude.com/en/docs/claude-code

---

Built with ❤️ using Claude Code
