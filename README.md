# AI Photography Website Automation

🚀 Automate your photography website with AI-powered content generation. Upload photos + voice memos → AI generates SEO content → One-click publish to Webflow.

## Features

- 📸 **Drag & Drop Photo Upload** - Upload up to 100 photos at once
- 🎤 **Voice Memo Transcription** - Record or upload notes, AI transcribes automatically
- ✨ **AI Content Generation** - Claude creates titles, descriptions, captions, SEO meta tags
- 🖼️ **Image Optimization** - Cloudinary auto-optimizes for web (WebP, AVIF, responsive)
- 🔍 **SEO Optimized** - Auto-generates keywords, meta descriptions, alt text
- 🎨 **Review & Edit** - Review and tweak AI content before publishing
- 🚀 **One-Click Publish** - Publish to Webflow CMS instantly

## Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **AI**: Vercel AI SDK, Claude 3.5 Sonnet, OpenAI Whisper
- **Storage**: Vercel Blob, Cloudinary
- **CMS**: Webflow API v2
- **Deployment**: Vercel

## Prerequisites

- Node.js 22.3.0 or higher
- Accounts for:
  - [Vercel](https://vercel.com) (free tier)
  - [OpenAI](https://platform.openai.com) (for Whisper)
  - [Anthropic](https://console.anthropic.com) (for Claude)
  - [Cloudinary](https://cloudinary.com/users/register/free) (free tier)
  - [Webflow](https://webflow.com) (Basic plan or higher)

## Quick Start

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd Webdesigner
npm install
```

### 2. Set Up Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your API keys:

```bash
# OpenAI (Whisper transcription)
OPENAI_API_KEY=sk-...

# Anthropic (Claude content generation)
ANTHROPIC_API_KEY=sk-ant-...

# Webflow
WEBFLOW_API_TOKEN=...
WEBFLOW_SITE_ID=...
WEBFLOW_COLLECTION_ID=...

# Cloudinary
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

### 3. Configure Webflow

#### Get API Token
1. Go to [Webflow Workspace Integrations](https://designers.webflow.com/workspace/integrations)
2. Create a new API token
3. Grant permissions: `CMS`, `Sites`
4. Copy the token

#### Get Site ID
1. In Webflow Designer, go to your site
2. Click "Site Settings"
3. Copy the Site ID from the URL or settings

#### Get Collection ID
1. In Webflow CMS, open your Portfolio collection
2. Copy the Collection ID from the URL

#### Configure Collection Fields

Your Webflow CMS collection should have these fields:
- `name` (Plain Text) - Gallery title
- `slug` (Plain Text) - URL slug
- `description` (Plain Text or Rich Text)
- `meta-description` (Plain Text)
- `category` (Plain Text or Option)
- `tags` (Plain Text)
- `seo-keywords` (Plain Text)
- `gallery-images` (Image) - Main image (or Multi-Image if available)
- `post-body` (Rich Text) - Full content

**Note:** Adjust field names in `/app/api/webflow/publish/route.ts` to match your collection.

### 4. Configure Cloudinary

1. Sign up at [Cloudinary](https://cloudinary.com/users/register/free)
2. Go to Dashboard
3. Copy:
   - Cloud Name
   - API Key
   - API Secret
4. Paste into `.env.local`

Free tier includes:
- 25 credits/month (~500 transformations)
- 25GB storage
- 25GB bandwidth

### 5. Set Up Vercel Blob Storage

Two options:

#### Option A: Local Development (Mock)
For testing locally without Vercel:
```bash
# Leave BLOB_READ_WRITE_TOKEN empty in .env.local
# The app will work but files won't persist
```

#### Option B: Vercel Integration (Recommended)
1. Install Vercel CLI: `npm install -g vercel`
2. Link project: `vercel link`
3. Add Blob storage:
   ```bash
   vercel storage create blob
   ```
4. Pull environment variables:
   ```bash
   vercel env pull .env.local
   ```

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Usage

### Upload Photos

1. Go to homepage
2. Drag & drop photos (or click to browse)
3. Record or upload voice memo with shoot notes
4. Click "Process with AI"

### Review Content

1. AI generates content (takes ~30-60 seconds)
2. Review page shows:
   - Generated title, description, tags
   - Photo captions and alt text
   - SEO meta description
3. Edit any fields as needed
4. Click "Regenerate" to create new content
5. Click "Save as Draft" or "Publish Live"

### What Happens Behind the Scenes

```
Upload Photos + Voice Memo
         ↓
Upload to Vercel Blob Storage
         ↓
Transcribe Audio (Whisper API)
         ↓
Optimize Images (Cloudinary)
         ↓
Generate Content (Claude 3.5 Sonnet)
   - Title (SEO-optimized)
   - Description
   - Photo captions
   - Alt text
   - Meta description
   - Tags & keywords
         ↓
Review & Edit Interface
         ↓
Publish to Webflow CMS
         ↓
Live on Your Website! 🎉
```

## Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Connect to Vercel:
   ```bash
   vercel
   ```
3. Add environment variables in Vercel dashboard
4. Add Blob storage in Vercel dashboard
5. Deploy:
   ```bash
   vercel --prod
   ```

### Environment Variables in Vercel

Add all variables from `.env.example` in:
- Vercel Dashboard → Project → Settings → Environment Variables

## Cost Breakdown

### Monthly Costs

| Service | Free Tier | Paid |
|---------|-----------|------|
| **Vercel** | ✓ Unlimited (Hobby) | $20/mo (Pro) |
| **Vercel Blob** | ✓ 1GB | $0.15/GB |
| **OpenAI Whisper** | - | ~$0.006/min (~$2/mo) |
| **Claude API** | - | ~$0.015/1K tokens (~$5-10/mo) |
| **Cloudinary** | ✓ 25 credits | $0 |
| **Webflow** | - | $29/mo (Basic) |
| **TOTAL** | - | **~$36-41/month** |

### Per Upload Costs
- 30 photos + 3 min audio = ~$0.50
- 10 shoots/month ≈ $5 (included in monthly costs)

## Time Savings

**Before AI Automation:**
- Upload photos: 15 min
- Write content: 45 min
- Optimize images: 30 min
- Add to CMS: 30 min
- **Total: 2 hours**

**After AI Automation:**
- Upload + voice memo: 5 min
- Review & publish: 5 min
- **Total: 10 minutes**

**Savings: 90% time reduction** ⚡

## Project Structure

```
Webdesigner/
├── app/
│   ├── api/
│   │   ├── upload/          # File upload to Vercel Blob
│   │   ├── transcribe/      # Whisper audio transcription
│   │   ├── optimize-images/ # Cloudinary optimization
│   │   ├── generate-content/# Claude content generation
│   │   └── webflow/
│   │       └── publish/     # Webflow CMS publishing
│   ├── review/              # Content review page
│   ├── gallery/             # Success page
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Upload page
│   └── globals.css          # Global styles
├── components/
│   ├── upload-interface.tsx # Main upload UI
│   ├── photo-uploader.tsx   # Drag-drop uploader
│   ├── voice-memo-recorder.tsx # Audio recorder
│   ├── uploaded-files-preview.tsx # File preview
│   ├── review-interface.tsx # Review & edit UI
│   └── editable-field.tsx   # Editable input field
├── .env.example             # Environment variables template
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md
```

## Troubleshooting

### "Upload failed" Error
- Check Vercel Blob is configured: `vercel storage`
- Verify file size < 50MB

### "Transcription failed" Error
- Verify `OPENAI_API_KEY` is set correctly
- Check audio file format (MP3, M4A, WAV, WebM)
- File size must be < 25MB

### "Optimization failed" Error
- Verify all Cloudinary env vars are set:
  - `CLOUDINARY_CLOUD_NAME`
  - `CLOUDINARY_API_KEY`
  - `CLOUDINARY_API_SECRET`
- Check Cloudinary free tier limits not exceeded

### "Publishing failed" Error
- Verify Webflow API token is valid
- Check collection field names match your Webflow CMS
- Edit `/app/api/webflow/publish/route.ts` to match your fields
- Ensure Webflow API token has CMS permissions

### Images Not Loading
- Check Cloudinary URLs in browser
- Verify `next.config.ts` has correct image domains
- Check browser console for errors

## Customization

### Change AI Models

Edit `/app/api/generate-content/route.ts`:

```typescript
// Use different Claude model
model: anthropic('claude-3-opus-20240229') // More powerful

// Or use OpenAI instead
import { openai } from '@ai-sdk/openai'
model: openai('gpt-4-turbo')
```

### Customize Content Generation

Edit the prompt in `/app/api/generate-content/route.ts`:

```typescript
const prompt = `Your custom instructions...`
```

### Add More Photo Categories

Edit `/components/review-interface.tsx`:

```typescript
<option>Your Custom Category</option>
```

### Change Webflow Field Mapping

Edit `/app/api/webflow/publish/route.ts`:

```typescript
const cmsItemData = {
  fields: {
    // Map to your Webflow collection fields
    'your-field-name': content.title,
  }
}
```

## Roadmap

### Phase 1: MVP ✅
- [x] Photo upload
- [x] Voice memo transcription
- [x] AI content generation
- [x] Image optimization
- [x] Webflow publishing

### Phase 2: Enhanced Features (Next)
- [ ] Webflow Designer API integration (theme learning)
- [ ] Bulk upload (multiple shoots at once)
- [ ] Social media preview generator
- [ ] Email notifications
- [ ] Analytics dashboard

### Phase 3: Marketing Automation
- [ ] n8n workflow integration
- [ ] Auto-post to Instagram
- [ ] Pinterest automation
- [ ] Email newsletter integration

### Phase 4: Universal Platform
- [ ] Support WordPress, Ghost, Shopify
- [ ] Auto-detect CMS type
- [ ] Multi-tenant dashboard
- [ ] White-label for agencies

## Support

- **Documentation**: See planning docs in repo root
  - `AI-WEBSITE-AUTOMATION-PLAN.md`
  - `MCP-SERVERS-QUICK-REFERENCE.md`
  - `QUICK-START-GUIDE.md`
- **Issues**: Open a GitHub issue
- **Questions**: Check Vercel AI SDK docs

## License

MIT

---

**Built with ❤️ using Claude, Vercel AI SDK, and modern web tech**

🚀 **Saving photographers hours every week since 2025**
