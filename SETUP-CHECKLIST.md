# Setup Checklist

Follow this checklist to get your AI Photography Automation system up and running.

## ☐ 1. Prerequisites

- [ ] Node.js 22.3.0+ installed (`node --version`)
- [ ] npm or yarn installed
- [ ] Git installed
- [ ] Code editor (VS Code recommended)

## ☐ 2. Clone & Install

```bash
# Clone the repository
git clone <your-repo-url>
cd Webdesigner

# Install dependencies
npm install
```

- [ ] Dependencies installed successfully
- [ ] No errors in terminal

## ☐ 3. API Keys & Accounts

### OpenAI Account
- [ ] Sign up at https://platform.openai.com
- [ ] Add payment method (Whisper is ~$0.006/min)
- [ ] Create API key: https://platform.openai.com/api-keys
- [ ] Copy key to clipboard
- [ ] Test key works: `curl https://api.openai.com/v1/models -H "Authorization: Bearer YOUR_KEY"`

### Anthropic Account
- [ ] Sign up at https://console.anthropic.com
- [ ] Add payment method (Claude is ~$0.015/1K tokens)
- [ ] Create API key
- [ ] Copy key to clipboard

### Cloudinary Account
- [ ] Sign up at https://cloudinary.com/users/register/free
- [ ] Confirm email
- [ ] Go to Dashboard
- [ ] Copy Cloud Name
- [ ] Copy API Key
- [ ] Copy API Secret

### Webflow Setup
- [ ] Have Webflow site on Basic plan or higher
- [ ] Go to https://designers.webflow.com/workspace/integrations
- [ ] Create new API token
- [ ] Grant permissions: `CMS`, `Sites`
- [ ] Copy API token
- [ ] Get Site ID from Webflow Designer settings
- [ ] Get Collection ID from CMS collection URL

### Vercel Account
- [ ] Sign up at https://vercel.com
- [ ] Install CLI: `npm install -g vercel`
- [ ] Login: `vercel login`

## ☐ 4. Environment Configuration

```bash
# Copy example file
cp .env.example .env.local
```

Edit `.env.local` and fill in:

- [ ] `OPENAI_API_KEY=sk-...`
- [ ] `ANTHROPIC_API_KEY=sk-ant-...`
- [ ] `WEBFLOW_API_TOKEN=...`
- [ ] `WEBFLOW_SITE_ID=...`
- [ ] `WEBFLOW_COLLECTION_ID=...`
- [ ] `CLOUDINARY_CLOUD_NAME=...`
- [ ] `CLOUDINARY_API_KEY=...`
- [ ] `CLOUDINARY_API_SECRET=...`
- [ ] `NEXT_PUBLIC_WEBFLOW_SITE_URL=https://your-site.webflow.io`

## ☐ 5. Webflow CMS Collection Setup

Your Webflow collection needs these fields:

### Required Fields
- [ ] `name` (Plain Text) - Title
- [ ] `slug` (Plain Text) - URL slug
- [ ] `description` (Plain Text or Rich Text)
- [ ] `meta-description` (Plain Text)
- [ ] `category` (Plain Text or Option)
- [ ] `tags` (Plain Text)
- [ ] `seo-keywords` (Plain Text)
- [ ] `gallery-images` (Image)
- [ ] `post-body` (Rich Text)

### Adjust Code to Match Your Fields

If your field names are different:

1. Open `/app/api/webflow/publish/route.ts`
2. Update the `cmsItemData.fields` object:

```typescript
const cmsItemData = {
  fields: {
    // Change these to match YOUR field names
    name: content.title,
    slug: content.slug,
    // etc...
  }
}
```

- [ ] Webflow collection has all required fields
- [ ] Code updated to match your field names (if needed)

## ☐ 6. Vercel Blob Storage (Local Dev)

### Option A: Mock Storage (Quick Start)
- [ ] Leave `BLOB_READ_WRITE_TOKEN` empty in `.env.local`
- [ ] Files won't persist but app will work for testing

### Option B: Real Vercel Storage (Recommended)
```bash
# Link to Vercel project
vercel link

# Create Blob storage
vercel storage create blob

# Pull environment variables
vercel env pull .env.local
```

- [ ] Vercel project linked
- [ ] Blob storage created
- [ ] Environment variables pulled

## ☐ 7. Test Run (Development)

```bash
npm run dev
```

- [ ] Development server starts
- [ ] No errors in terminal
- [ ] Open http://localhost:3000
- [ ] Homepage loads successfully

## ☐ 8. Test Upload Flow

### Upload Test
- [ ] Homepage displays upload interface
- [ ] Can drag & drop photos
- [ ] Can click to browse photos
- [ ] Voice memo recorder shows
- [ ] Can record audio (grant microphone permission)

### Processing Test
- [ ] Upload 2-3 test photos
- [ ] Record short test memo (or upload audio file)
- [ ] Click "Process with AI"
- [ ] Processing starts (shows loading spinner)
- [ ] No errors in browser console (F12)

### Review Test
- [ ] Redirects to review page
- [ ] Generated content displays:
  - [ ] Title
  - [ ] Description
  - [ ] Tags
  - [ ] Photo captions
  - [ ] Meta description
- [ ] Can edit all fields
- [ ] Photos display correctly

### Publishing Test
- [ ] Click "Save as Draft" or "Publish Live"
- [ ] Success message appears
- [ ] Redirects to gallery page
- [ ] Check Webflow CMS - new item appears
- [ ] Check your Webflow site - content is there

## ☐ 9. Common Issues & Fixes

### Upload Fails
```bash
# Check Vercel Blob is configured
vercel storage list

# If empty, create it
vercel storage create blob
```

### Transcription Fails
- [ ] Check OpenAI API key is correct
- [ ] Check audio file < 25MB
- [ ] Check audio format (MP3, M4A, WAV, WebM)
- [ ] Check OpenAI account has credits

### Content Generation Fails
- [ ] Check Anthropic API key is correct
- [ ] Check API key has credits
- [ ] Check browser console for errors
- [ ] Check terminal for API errors

### Image Optimization Fails
- [ ] Check all 3 Cloudinary env vars are set
- [ ] Check Cloudinary credentials are correct
- [ ] Login to Cloudinary dashboard, verify account active
- [ ] Check free tier limits not exceeded

### Webflow Publishing Fails
- [ ] Check Webflow API token is valid
- [ ] Check token has CMS permissions
- [ ] Verify Site ID is correct
- [ ] Verify Collection ID is correct
- [ ] Check field names match your collection
- [ ] Check Webflow API status: https://status.webflow.com

## ☐ 10. Deploy to Production

### Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit - AI Photography Automation"
git remote add origin <your-github-repo-url>
git push -u origin main
```

### Deploy to Vercel
```bash
# Deploy
vercel

# Or connect via dashboard
# 1. Go to vercel.com/new
# 2. Import your GitHub repo
# 3. Add environment variables
# 4. Deploy
```

- [ ] Code pushed to GitHub
- [ ] Connected to Vercel
- [ ] Environment variables added in Vercel dashboard
- [ ] Blob storage added in Vercel dashboard
- [ ] Production deployment successful
- [ ] Visit production URL - app works

## ☐ 11. Final Production Test

- [ ] Upload real photos from production URL
- [ ] Record real voice memo
- [ ] Process with AI
- [ ] Review generated content
- [ ] Publish to Webflow
- [ ] Verify appears on live website
- [ ] Check images load fast
- [ ] Check SEO meta tags (view page source)
- [ ] Test on mobile device

## 🎉 Success!

You're all set! Your AI Photography Automation system is live.

### What's Next?

- Upload your first real shoot
- Monitor costs in API dashboards
- Customize prompts for your style
- Add more features (see roadmap in README)
- Share your success story!

### Time Saved Per Upload
- **Before**: 2 hours (manual work)
- **After**: 10 minutes (upload + review)
- **Savings**: 90% 🚀

### Need Help?

- Check README.md for detailed docs
- Review planning docs in repo root
- Open GitHub issue for bugs
- Check API documentation:
  - [Vercel AI SDK](https://sdk.vercel.ai)
  - [Webflow API](https://developers.webflow.com)
  - [OpenAI API](https://platform.openai.com/docs)
  - [Anthropic API](https://docs.anthropic.com)
  - [Cloudinary API](https://cloudinary.com/documentation)

---

**Happy automating!** 📸✨
