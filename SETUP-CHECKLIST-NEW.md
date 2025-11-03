# ✅ Setup Checklist

Quick setup guide for your luxury portfolio with AI automation.

---

## 🚀 Pre-Deployment (Local Development)

### 1. Environment Variables

- [ ] Copy `.env.example` to `.env.local`
- [ ] Add `OPENAI_API_KEY` from https://platform.openai.com/api-keys
- [ ] Add `ANTHROPIC_API_KEY` from https://console.anthropic.com/
- [ ] Set `ADMIN_USERNAME` and `ADMIN_PASSWORD`
- [ ] Set `NEXT_PUBLIC_BASE_URL=http://localhost:3000`

### 2. Test Locally

```bash
npm install
npm run dev
```

- [ ] Visit http://localhost:3000 - Homepage loads
- [ ] Visit http://localhost:3000/gallery - Gallery loads
- [ ] Visit http://localhost:3000/work - Work page loads
- [ ] Visit http://localhost:3000/about - About page loads
- [ ] Visit http://localhost:3000/admin/login - Can login

---

## 📝 Medium Integration (Optional)

### Setup (5 minutes)

- [ ] Go to https://medium.com/me/settings/security
- [ ] Create integration token: "Portfolio Auto-Publisher"
- [ ] Add to `.env.local`: `MEDIUM_ACCESS_TOKEN=...`
- [ ] Visit http://localhost:3000/api/publish/medium
- [ ] Copy author ID from response
- [ ] Add to `.env.local`: `MEDIUM_AUTHOR_ID=...`
- [ ] Restart dev server

### Test

- [ ] Go to Admin → Essays
- [ ] Record a test voice memo
- [ ] Enable "Auto-post to Medium"
- [ ] Click "Process & Publish"
- [ ] Check Medium drafts - essay should appear

---

## 🎬 Deploy to Vercel

### Step 1: Install Vercel CLI

```bash
npm i -g vercel
```

### Step 2: Link Project

```bash
vercel link
```

- [ ] Select scope/team
- [ ] Link to existing project or create new

### Step 3: Add Environment Variables

```bash
vercel env add OPENAI_API_KEY
vercel env add ANTHROPIC_API_KEY
vercel env add ADMIN_USERNAME
vercel env add ADMIN_PASSWORD
vercel env add NEXT_PUBLIC_BASE_URL
```

Optional (for Medium):
```bash
vercel env add MEDIUM_ACCESS_TOKEN
vercel env add MEDIUM_AUTHOR_ID
```

- [ ] Set each variable for **Production**, **Preview**, **Development**

### Step 4: Add Blob Storage

```bash
vercel storage create
```

- [ ] Select "Blob Storage"
- [ ] Name it (e.g., "portfolio-storage")
- [ ] Link to project

This automatically adds `BLOB_READ_WRITE_TOKEN` to your environment.

### Step 5: Deploy

```bash
vercel --prod
```

- [ ] Deployment succeeds
- [ ] Visit production URL
- [ ] Test homepage loads
- [ ] Test admin login works

### Step 6: Update Base URL

After deployment:

```bash
vercel env add NEXT_PUBLIC_BASE_URL
# Enter your production URL: https://your-domain.vercel.app
```

Redeploy:
```bash
vercel --prod
```

---

## 🎨 Post-Deployment Setup

### 1. Upload First Content

- [ ] Login to admin at `https://your-domain.com/admin/login`
- [ ] Go to Modeling Upload
- [ ] Upload 5-10 photos from one shoot
- [ ] Record voice memo describing the shoot
- [ ] Click "Upload & Create Collection"
- [ ] Verify collection appears in gallery

### 2. Upload Hero Video (Optional)

- [ ] Prepare a 10-30 second video for homepage
- [ ] Go to Admin → Web Videos
- [ ] Select "Hero Background Video"
- [ ] Upload video
- [ ] Note the Blob URL returned
- [ ] Edit `app/work/page.tsx` - uncomment VideoHero
- [ ] Add your video URL
- [ ] Redeploy: `vercel --prod`

### 3. Publish First Essay (Optional)

- [ ] Go to Admin → Essays
- [ ] Click "Dictate Essay"
- [ ] Speak your essay (unlimited length)
- [ ] Enable "Auto-post to Medium" if configured
- [ ] Click "Process & Publish"
- [ ] Check Medium drafts

---

## 🎯 Features to Explore

### ✨ Luxury Design Features

- [x] Custom golden cursor (desktop)
- [x] Smooth physics-based scrolling (Lenis)
- [x] Page transitions (Framer Motion)
- [x] Scroll-triggered animations (GSAP)
- [x] Parallax effects
- [x] Video backgrounds (VideoHero component)
- [x] Luxury hover effects (images zoom, cards lift)
- [x] Golden selection color
- [x] Link underline animations

### 🤖 AI-Powered Features

- [x] **Voice-to-Collection**: Upload photos + voice memo → AI generates title, keywords, vibe
- [x] **Voice-to-Essay**: Dictate → AI transcribes, formats, generates title & SEO
- [x] **Auto-Publishing**: Essays auto-posted to Medium as drafts
- [x] **Smart Detection**: Distinguishes acting reels vs clips by duration
- [x] **Metadata Generation**: AI extracts location, style, mood from voice memos
- [x] **Unlimited Voice Length**: Whisper handles any audio length

### 📦 5 Specialized Upload Zones

1. **Modeling**: Batch photo uploads with voice descriptions
2. **Acting**: Reels, clips, headshots with performance context
3. **Web Videos**: Site backgrounds, hero videos
4. **Essays**: Voice dictation or document upload
5. **Manage**: View all content, filter by type

---

## 🔍 Testing Checklist

### Homepage
- [ ] Luxury cursor appears on desktop
- [ ] Smooth scrolling works
- [ ] Page transitions smooth
- [ ] Links have underline animation
- [ ] Images have hover zoom effect

### Gallery
- [ ] Photos load correctly
- [ ] Hover effects work (zoom + overlay)
- [ ] Identity shows "Model · Actor · Researcher · Creative"
- [ ] Parallax effects on scroll

### Work Page
- [ ] Four categories display correctly (Modeling first)
- [ ] Cards have hover lift effect
- [ ] Golden border glow on hover
- [ ] Featured work section displays

### About Page
- [ ] All paragraphs visible (no disappearing text)
- [ ] Scroll reveals work on lower sections
- [ ] Instagram link works
- [ ] "Model · Actor · Researcher · Creative" identity

### Admin
- [ ] Login page works
- [ ] All 5 zones accessible
- [ ] Modeling upload: drag-and-drop works
- [ ] Voice recording works (requests microphone permission)
- [ ] Upload button triggers correctly
- [ ] Success message appears after upload

---

## 📊 Monitor After Launch

### Vercel Dashboard

- [ ] Check deployment logs for errors
- [ ] Monitor Blob storage usage
- [ ] Check function execution time (<10s for uploads)

### API Usage

- [ ] OpenAI usage (Whisper transcription): https://platform.openai.com/usage
- [ ] Anthropic usage (Claude): https://console.anthropic.com/settings/cost

### Medium

- [ ] Check drafts appear correctly
- [ ] Verify canonical URLs point to your site
- [ ] Review and publish drafts manually

---

## 🆘 Common Issues

**Issue**: "Upload failed"
- ✅ **Fix**: Ensure Blob Storage is linked to project
- ✅ **Check**: `vercel storage list` shows your storage

**Issue**: Video not playing
- ✅ **Fix**: Ensure video is MP4 format
- ✅ **Check**: Video URL is publicly accessible

**Issue**: Voice recording doesn't work
- ✅ **Fix**: Grant microphone permissions in browser
- ✅ **Check**: Test in different browser (Chrome recommended)

**Issue**: Medium publish fails
- ✅ **Fix**: Verify `MEDIUM_ACCESS_TOKEN` and `MEDIUM_AUTHOR_ID` are set
- ✅ **Check**: Token is valid (no expiration)

---

## 📈 Next Steps

1. **Content Strategy**
   - [ ] Upload modeling portfolio collections
   - [ ] Upload acting reels and headshots
   - [ ] Dictate essays regularly
   - [ ] Cross-post to Medium for reach

2. **SEO Optimization**
   - [ ] Submit sitemap to Google Search Console
   - [ ] Ensure meta tags are complete
   - [ ] Monitor Core Web Vitals

3. **Analytics** (Optional)
   - [ ] Add Vercel Analytics
   - [ ] Track page views
   - [ ] Monitor user engagement

4. **Custom Domain** (Optional)
   - [ ] Purchase domain (e.g., brandonmills.com)
   - [ ] Add to Vercel project
   - [ ] Update `NEXT_PUBLIC_BASE_URL`

---

## 🎉 Launch Checklist

- [ ] All pages load without errors
- [ ] Admin login works
- [ ] Can upload modeling collection
- [ ] Can dictate essay
- [ ] Medium integration works (if configured)
- [ ] Video backgrounds work (if added)
- [ ] Mobile responsive
- [ ] Desktop luxury features work
- [ ] Analytics configured
- [ ] Custom domain (if applicable)

**Ready to launch!** 🚀

---

## 📞 Need Help?

- **Documentation**: See `DEPLOYMENT-GUIDE.md` for detailed instructions
- **Issues**: https://github.com/anthropics/claude-code/issues
- **Claude Code Docs**: https://docs.claude.com/en/docs/claude-code

---

Built with Claude Code
