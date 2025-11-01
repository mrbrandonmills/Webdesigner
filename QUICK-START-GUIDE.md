# Quick Start Guide - MVP in 2 Weeks

## Decision Tree - Choose Your Path

```
┌─────────────────────────────────────────────────┐
│ Do you need full automation of content posting? │
└────────────────┬────────────────────────────────┘
                 │
         ┌───────┴───────┐
         │               │
        YES              NO
         │               │
         ▼               ▼
┌──────────────┐  ┌──────────────┐
│ Can you      │  │ Stay on      │
│ migrate from │  │ Squarespace  │
│ Squarespace? │  │              │
└───┬──────────┘  │ Build AI     │
    │             │ content prep │
┌───┴───┐         │ tools only   │
│       │         │              │
YES     NO        │ Manual       │
│       │         │ publishing   │
│       └────┐    │              │
│            │    │ Cost: $10/mo │
▼            ▼    └──────────────┘
┌────────────────────────┐
│ Choose Platform:       │
│                        │
│ 1. WEBFLOW            │
│    Best for: Full AI   │
│    automation +        │
│    visual creators     │
│    Cost: $29/mo        │
│    AI Ready: 5/5 ⭐    │
│                        │
│ 2. GHOST CMS          │
│    Best for: Bloggers  │
│    + writers           │
│    Cost: $17-23/mo     │
│    AI Ready: 4/5 ⭐    │
│                        │
│ 3. WORDPRESS          │
│    Best for: Max       │
│    flexibility         │
│    Cost: $27-46/mo     │
│    AI Ready: 3/5 ⭐    │
└────────────────────────┘
```

## Recommended Path: Webflow MVP

**Why:** Only platform with official MCP server + Designer API. Start small, scale fast.

---

## 2-Week MVP Sprint

### Week 1: Setup & Core Pipeline

#### Day 1-2: Environment Setup
```bash
# 1. Create Webflow account
# Sign up at: https://webflow.com
# Choose: Basic plan ($29/mo) - has CMS + e-commerce

# 2. Clone starter template
git clone https://github.com/vercel/ai-chatbot.git photo-automation
cd photo-automation
npm install

# 3. Set up Vercel project
npm install -g vercel
vercel login
vercel link

# 4. Add environment variables
vercel env add OPENAI_API_KEY
vercel env add ANTHROPIC_API_KEY
vercel env add WEBFLOW_API_TOKEN
vercel env add CLOUDINARY_CLOUD_NAME
vercel env add CLOUDINARY_API_KEY
vercel env add CLOUDINARY_API_SECRET
```

**Deliverable:** Development environment ready, APIs connected

---

#### Day 3-4: Build Upload Interface
```typescript
// app/upload/page.tsx - Simple upload dashboard

import { UploadButton } from '@/components/upload-button'
import { VoiceMemoRecorder } from '@/components/voice-memo'

export default function UploadPage() {
  return (
    <div className="container">
      <h1>New Photo Shoot Upload</h1>

      {/* Drag-drop photo uploader */}
      <UploadButton
        accept="image/*"
        multiple
        onUpload={handlePhotoUpload}
      />

      {/* Voice memo recorder/upload */}
      <VoiceMemoRecorder
        onRecorded={handleAudioUpload}
      />

      {/* Preview uploaded files */}
      <PreviewGallery photos={photos} />
    </div>
  )
}
```

**Deliverable:** Working upload UI with preview

---

#### Day 5-6: AI Processing Pipeline
```typescript
// app/api/process/route.ts

import { openai } from '@ai-sdk/openai'
import { generateText } from 'ai'

export async function POST(req: Request) {
  const { audioUrl, photos } = await req.json()

  // Step 1: Transcribe audio
  const transcription = await transcribeAudio(audioUrl)

  // Step 2: Analyze images + transcription
  const analysis = await generateText({
    model: openai('gpt-4-vision'),
    messages: [{
      role: 'user',
      content: [
        { type: 'text', text: `Transcription: ${transcription}` },
        ...photos.map(url => ({ type: 'image', image: url }))
      ]
    }],
    system: `You are a photography content generator. Create:
    1. Gallery title (SEO-optimized)
    2. Description (2-3 sentences)
    3. Photo captions
    4. Meta description
    5. Relevant tags

    Match the photographer's voice and style.`
  })

  // Step 3: Return structured content
  return Response.json({
    title: analysis.title,
    description: analysis.description,
    photos: analysis.photos.map((p, i) => ({
      url: photos[i],
      caption: p.caption,
      alt: p.alt
    })),
    meta: analysis.meta,
    tags: analysis.tags
  })
}
```

**Deliverable:** Automated content generation from audio + images

---

#### Day 7: Weekend - Testing & Refinement
- Test upload → transcription → generation flow
- Fix bugs
- Improve prompts for better output
- Add error handling

---

### Week 2: Webflow Integration & Polish

#### Day 8-9: Webflow MCP Setup
```bash
# Install Webflow MCP server globally
npm install -g @webflow/mcp-server

# Configure for your project
# Add to mcp-remote config or integrate directly
```

```typescript
// lib/webflow.ts - Webflow publishing functions

import { MCPClient } from '@modelcontextprotocol/sdk'

export async function publishToWebflow({
  title,
  description,
  photos,
  tags
}: GalleryContent) {
  const mcp = new MCPClient({
    server: '@webflow/mcp-server',
    auth: process.env.WEBFLOW_API_TOKEN
  })

  // Create CMS collection item
  const result = await mcp.callTool('createCMSItem', {
    collectionId: 'your-portfolio-collection-id',
    fields: {
      name: title,
      description: description,
      'gallery-images': await uploadImagesToWebflow(photos),
      tags: tags,
      slug: generateSlug(title),
      _archived: false,
      _draft: true // Start as draft for review
    }
  })

  return result
}
```

**Deliverable:** One-click publish to Webflow CMS

---

#### Day 10-11: Review & Approval Workflow
```typescript
// app/review/[id]/page.tsx - Review before publishing

export default function ReviewPage({ params }) {
  const content = useGeneratedContent(params.id)

  return (
    <div>
      <h1>Review Generated Content</h1>

      {/* Editable content fields */}
      <EditableField
        label="Title"
        value={content.title}
        onChange={updateTitle}
      />

      <EditableField
        label="Description"
        value={content.description}
        onChange={updateDescription}
        multiline
      />

      {/* Photo grid with captions */}
      <PhotoGrid
        photos={content.photos}
        editable
      />

      {/* Publish actions */}
      <div className="actions">
        <Button onClick={regenerateContent}>
          🔄 Regenerate Content
        </Button>

        <Button onClick={saveDraft}>
          💾 Save as Draft
        </Button>

        <Button onClick={publishLive} variant="primary">
          🚀 Publish Live
        </Button>
      </div>
    </div>
  )
}
```

**Deliverable:** Review UI with editing + publish controls

---

#### Day 12-13: Image Optimization (Cloudinary)
```typescript
// lib/cloudinary.ts

import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

export async function optimizeImages(photos: File[]) {
  const optimized = await Promise.all(
    photos.map(async (photo) => {
      const result = await cloudinary.uploader.upload(photo, {
        folder: 'portfolio',
        transformation: [
          { quality: 'auto' },
          { fetch_format: 'auto' }, // Auto WebP/AVIF
          { width: 2000, crop: 'limit' } // Max width
        ]
      })

      return {
        original: result.secure_url,
        optimized: result.secure_url,
        thumbnail: cloudinary.url(result.public_id, {
          width: 400,
          height: 400,
          crop: 'fill',
          quality: 'auto'
        })
      }
    })
  )

  return optimized
}
```

**Deliverable:** Auto-optimized images with responsive variants

---

#### Day 14: Final Testing & Launch
- [ ] End-to-end test: Upload → Process → Review → Publish
- [ ] Test on mobile devices
- [ ] Add loading states & error messages
- [ ] Set up monitoring (Vercel Analytics)
- [ ] Deploy to production: `vercel --prod`
- [ ] 🎉 Launch MVP!

---

## MVP Features Checklist

### Core Functionality
- [x] Drag-drop photo upload (up to 50 images)
- [x] Voice memo recording/upload
- [x] Automatic audio transcription (Whisper)
- [x] AI content generation (Claude)
  - Gallery title
  - Description
  - Photo captions
  - Alt text
  - SEO meta tags
  - Relevant tags
- [x] Image optimization (Cloudinary)
- [x] Review & edit interface
- [x] One-click publish to Webflow
- [x] Draft vs. live publishing

### Nice-to-Have (Can add later)
- [ ] Batch processing multiple shoots
- [ ] Social media preview generator
- [ ] Email notification when published
- [ ] Analytics dashboard
- [ ] Multi-user support
- [ ] Calendar scheduling

---

## Essential Files Structure

```
photo-automation/
├── app/
│   ├── upload/
│   │   └── page.tsx          # Upload interface
│   ├── review/
│   │   └── [id]/
│   │       └── page.tsx      # Review & edit
│   ├── api/
│   │   ├── upload/
│   │   │   └── route.ts      # Handle file uploads
│   │   ├── transcribe/
│   │   │   └── route.ts      # Whisper transcription
│   │   ├── generate/
│   │   │   └── route.ts      # AI content generation
│   │   └── publish/
│   │       └── route.ts      # Webflow publishing
│   └── layout.tsx
├── components/
│   ├── upload-button.tsx     # File upload UI
│   ├── voice-memo.tsx        # Audio recorder
│   ├── preview-gallery.tsx   # Image preview grid
│   └── editable-field.tsx    # Content editing
├── lib/
│   ├── webflow.ts           # Webflow MCP client
│   ├── cloudinary.ts        # Image optimization
│   ├── transcription.ts     # Audio transcription
│   └── ai.ts                # Content generation
├── .env.local               # Environment variables
├── package.json
└── README.md
```

---

## Environment Variables (.env.local)

```bash
# AI Services
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# Webflow
WEBFLOW_API_TOKEN=...
WEBFLOW_SITE_ID=...
WEBFLOW_COLLECTION_ID=...

# Cloudinary
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# Vercel Blob (auto-configured by Vercel)
BLOB_READ_WRITE_TOKEN=...

# Database (for storing drafts - optional)
DATABASE_URL=postgresql://...
```

---

## Testing Checklist

### Day 14 Launch Tests

#### Upload Flow
- [ ] Upload 1 image - works
- [ ] Upload 50 images - works
- [ ] Upload video format - shows error
- [ ] Record voice memo - works
- [ ] Upload existing audio file - works
- [ ] Cancel upload mid-way - works

#### Processing
- [ ] Transcription completes in < 30 seconds
- [ ] Content generation includes all fields
- [ ] Images optimized & thumbnails created
- [ ] Processing errors show helpful messages

#### Review Interface
- [ ] Can edit all text fields
- [ ] Can reorder photos
- [ ] Can delete photos
- [ ] "Regenerate" creates new content
- [ ] "Save Draft" stores in Webflow as draft
- [ ] "Publish Live" publishes to site

#### Published Content
- [ ] Gallery appears on Webflow site
- [ ] Images load fast (Lighthouse score > 90)
- [ ] SEO meta tags present
- [ ] Mobile responsive
- [ ] Correct tags applied

---

## Success Metrics

### Week 1 Goals
- ✅ Upload interface functional
- ✅ AI content generation working
- ✅ Can process 1 complete shoot end-to-end

### Week 2 Goals
- ✅ Webflow publishing working
- ✅ Review workflow complete
- ✅ MVP deployed to production
- ✅ Processing time < 2 minutes per shoot

### Post-Launch Goals (Month 1)
- Process 5+ shoots using the system
- Get feedback from real usage
- Measure time savings (target: 90% reduction)
- Iterate on AI prompt quality

---

## Common Issues & Solutions

### "Webflow MCP not connecting"
```bash
# Check Node version
node --version  # Must be 22.3.0+

# Reinstall MCP server
npm uninstall -g @webflow/mcp-server
npm install -g @webflow/mcp-server

# Verify API token
curl https://api.webflow.com/v2/sites \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### "Images taking forever to upload"
```javascript
// Add parallel uploads with limit
import pLimit from 'p-limit'

const limit = pLimit(5) // Max 5 concurrent uploads

const uploads = photos.map(photo =>
  limit(() => uploadToCloudinary(photo))
)

await Promise.all(uploads)
```

### "AI content is generic"
```typescript
// Improve prompts with examples
const prompt = `
You are a professional photography copywriter.

Previous examples of this photographer's style:
- "${exampleTitle1}"
- "${exampleDescription1}"

Transcription: ${transcription}

Generate content that matches the examples' tone and style.
`
```

---

## Cost Reality Check

### Development (2 weeks)
- Your time: Priceless (but free with Claude Code helping!)
- External devs: $0 (doing it yourself)

### Monthly Operating Costs
| Item | Cost |
|------|------|
| Webflow Basic | $29 |
| Vercel Hobby | $0 |
| OpenAI (Whisper) | $2 |
| Claude API | $5-10 |
| Cloudinary Free | $0 |
| **Total** | **$36-41** |

### Per-Shoot Cost
- Upload 30 photos + 3 min audio = ~$0.50 in AI costs
- 10 shoots/month = $5/month
- **Already included in monthly budget above**

### Time Savings Value
- Before: 2 hours per shoot @ $50/hr = $100/shoot
- After: 10 minutes per shoot = $8/shoot
- **Savings: $92 per shoot**
- **10 shoots/month = $920/month saved**

**ROI: 23x return on investment** 🚀

---

## What's Next After MVP?

### Phase 2: Style Intelligence (Week 3-4)
- Train AI on your existing portfolio style
- Auto-apply consistent color grading
- Learn your writing voice for better content

### Phase 3: Marketing Automation (Week 5-6)
- Auto-post to Instagram with captions
- Pinterest automation
- Email newsletter integration
- Social media scheduling

### Phase 4: Multi-Site Support (Week 7-8)
- Support client websites (not just yours)
- Platform detection (Webflow, WordPress, etc.)
- Multi-tenant dashboard
- Usage analytics per site

### Phase 5: Universal Webmaster (Month 3+)
- Works on ANY website platform
- AI learns theme from any site
- Marketplace for workflow templates
- White-label for agencies

---

## Ready to Build?

Just say the word and we'll start:

1. **"Let's build the upload dashboard"** → I'll create the Next.js app
2. **"Set up MCP servers first"** → I'll guide you through configuration
3. **"Show me Webflow setup"** → I'll walk through migration planning
4. **"Something else first"** → Tell me what!

This MVP will save you hours every week and prove the full vision is achievable. Let's ship it! 🚀
