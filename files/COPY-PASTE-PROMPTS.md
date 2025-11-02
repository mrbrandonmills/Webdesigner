# 🚀 COPY-PASTE PROMPTS FOR CLAUDE CODE
## Just copy, replace [PATH], and paste into Claude Code

---

## ⚡ QUICK TEST (Start Here!)

```
Parse /Users/brandon/Downloads/Squarespace-Wordpress-Export-11-02-2025.xml

Show me:
- Total posts found
- First 3 post titles
- Image count per post

Just to verify the file is readable.
```

---

## 📊 COMPLETE ANALYSIS

```
Analyze my Squarespace export XML at:
[PASTE YOUR FILE PATH HERE]

Create these outputs:

1. posts-summary.json - All post metadata (title, images, dates)
2. images-inventory.csv - Every image URL + which post it belongs to  
3. content-status.txt - Which posts need real content vs have Lorem ipsum
4. migration-checklist.md - Steps needed to move to new platform

Save all files to ./analysis/ directory
```

---

## 📥 DOWNLOAD ALL IMAGES

```
From XML at: [YOUR FILE PATH]

Download all images to organized folders:

/portfolio-images/
  /good-company-emma-melida/
    image-001.jpg
    image-002.jpg
  /silver-gold-am-reed/
    image-001.jpg
  [etc.]

Name images: [post-slug]-[sequence].jpg

Create manifest.json mapping:
- Original Squarespace URL
- New local path
- Image dimensions
- File size

Handle failures gracefully, log to errors.txt
Show download progress (X of Y)
```

---

## ✍️ GENERATE CONTENT FOR ONE POST

```
Generate SEO blog content for this shoot:

Title: "Good Company w/Emma & Melida"
Images: 65 photos from my Squarespace export
Current content: Lorem ipsum placeholder

Create:

1. SEO Title (60 chars max): Engaging, searchable
2. Meta Description (155 chars): Compelling preview
3. Blog Content (400-500 words):
   - Opening paragraph: Set the scene
   - Main body: Describe the shoot, styling, models
   - Closing: Call to action or reflection
4. Image alt text for first 5 images
5. Tags: 5-7 relevant tags (fashion, photography, modeling, etc.)

Brand voice: "Finding Meaning in Movement" - clean, minimalist, professional but personal, artistic

Format: Markdown with proper headers

Save to: content-good-company.md
```

---

## 📝 GENERATE ALL CONTENT

```
Batch generate SEO content for ALL posts in:
[YOUR FILE PATH]

For each of my 10 portfolio shoots:
1. Extract post title and image count
2. Generate unique, engaging content (400-500 words each)
3. Create SEO metadata (title, description, tags)
4. Write alt text for key images
5. Format as markdown

Brand voice: Clean, minimalist, "Finding Meaning in Movement" aesthetic

Output structure:
/generated-content/
  city-of-apples.md
  emphatic-design.md
  [etc...]

Include metadata.json with all SEO data

Use varied, natural language - no two posts should sound the same
Focus on: fashion, modeling, photography, artistic expression, movement
```

---

## 🔄 CONVERT TO GHOST FORMAT

```
Convert Squarespace export to Ghost import format:

Source: [YOUR FILE PATH]
Target: Ghost CMS

For each post create:

---
title: "Post Title"
slug: post-slug
excerpt: "SEO description"
feature_image: /images/post-slug/featured.jpg
published_at: 2025-01-14
tags:
  - Fashion
  - Photography
status: published
---

[Markdown content here with image references]

Output:
- /ghost-import/posts/ (one .md per post)
- /ghost-import/images/ (all downloaded images)
- import-mapping.json (URL redirects needed)
- ghost-import.zip (ready to upload)

Include instructions.txt for importing to Ghost
```

---

## 🎨 PLATFORM COMPARISON

```
I'm migrating from Squarespace (current site: brandonmills.com)

Compare these platforms for my portfolio:
1. Ghost (self-hosted or managed)
2. WordPress (headless)
3. Webflow
4. Custom Next.js site

Evaluate each on:
- API capabilities for automation
- Content posting automation
- Image optimization
- SEO features
- Cost (my budget: $50/month)
- Ease of voice memo → post automation
- Migration effort from Squarespace

Create comparison table (markdown) and recommendation.

My priorities:
1. Full automation (voice memo to published post)
2. Beautiful, minimalist design
3. SEO optimization
4. Budget-friendly
5. API access for integrations
```

---

## 🤖 AUTOMATION ARCHITECTURE

```
Design complete automation system:

INPUT: Voice memo (recorded on iPhone after photoshoot)
OUTPUT: Published blog post on brandonmills.com

Required components:
1. Voice transcription (Whisper API)
2. Info extraction from transcript (shoot details, models, location)
3. Image matching (sync from iPhone/Google Photos)
4. Content generation (SEO-optimized post from transcript + images)
5. Platform posting (API to Ghost/WordPress/etc)
6. Preview/approval step (notify me before publishing)

Create:
- System architecture diagram (Mermaid)
- Technology stack recommendations
- Python pseudocode for each component
- Cost breakdown (APIs, hosting, storage)
- Setup instructions
- Testing plan using my existing Squarespace posts as test data

Budget: $50/month total
Must handle: 2-4 posts per month, 20-60 images per post
```

---

## 📱 VOICE MEMO PROCESSOR (MVP)

```
Build minimum viable voice memo processor:

Create Python script that:

1. Takes input: audio file (m4a/mp3) + folder of images
2. Transcribes audio with Whisper
3. Extracts from transcript:
   - Shoot title/name
   - Models mentioned
   - Location
   - Key moments/descriptions
   - Styling notes
4. Generates blog post:
   - SEO title from transcript insights
   - Opening paragraph (engaging hook)
   - Main content (incorporating transcript details)
   - Image captions based on context
5. Outputs: markdown file ready for publishing

Include:
- requirements.txt (dependencies)
- config.yaml (API keys, settings)
- README.md (setup instructions)
- example-input/ (sample files to test with)

Test it on: "Silver & Gold w/AM REED" as proof of concept
```

---

## 🔍 SEO AUDIT & OPTIMIZATION

```
Analyze my portfolio site structure from:
[YOUR FILE PATH]

Audit:
1. Current URLs and structure
2. Missing meta descriptions
3. Image alt text coverage
4. Internal linking opportunities
5. Keyword optimization for portfolio/modeling niche

Generate:
- seo-audit.md (current state analysis)
- seo-recommendations.md (priority fixes)
- keyword-strategy.md (target keywords for each post)
- redirect-map.csv (old URL → new URL for migration)
- sitemap.xml (proper structure for new site)

SEO focus: Male model portfolio, fashion photography, NYC/SF modeling
```

---

## 💾 CREATE BACKUP SYSTEM

```
Build automated backup system for portfolio content:

1. Read Squarespace export: [YOUR FILE PATH]
2. Download all images (current Squarespace CDN)
3. Save to organized local structure
4. Create database-style JSON with all content
5. Generate static HTML versions (backup viewing)
6. Create sync script for future updates

Output structure:
/portfolio-backup-2025/
  /images/ (all images locally)
  /content/ (markdown files)
  /database/ (posts.json, images.json)
  /static-site/ (HTML versions)
  backup-manifest.json (inventory)
  sync.py (future backup script)

Compress to: portfolio-backup-2025.zip
```

---

## 🎯 QUICK WINS - RECENT POSTS ONLY

```
Focus on my 3 newest shoots only:

From: [YOUR FILE PATH]

Process ONLY these posts:
1. "Good Company w/Emma & Melida"
2. "Silver & Gold w/AM REED"  
3. "Reboot W/Esteban Bonilla"

For each:
1. Download images to /posts/[slug]/images/
2. Generate SEO content (unique per post)
3. Create Ghost-compatible markdown
4. Generate social media captions (IG/LinkedIn)
5. Create thumbnail/featured image suggestion

Output:
/recent-posts/
  good-company.md
  silver-gold.md
  reboot.md
  social-captions.txt

Ready for immediate publishing!
```

---

## 📦 COMPLETE MIGRATION PACKAGE

```
Create everything needed to migrate from Squarespace to Ghost:

Source: [YOUR FILE PATH]

Deliverables:

1. /ghost-import/ 
   - All posts converted to Ghost format
   - All images downloaded and organized
   - Tags and categories configured

2. /seo/
   - 301 redirects file
   - Sitemap.xml
   - Robots.txt
   - Meta tags for all posts

3. /content/
   - SEO-optimized content for all posts
   - Image alt text
   - Social media captions

4. /scripts/
   - Import script for Ghost
   - Image upload script
   - Verification script

5. /documentation/
   - Migration checklist.md
   - Setup instructions.md
   - Testing plan.md
   - Rollback plan.md

Create comprehensive README.md explaining everything
Estimated migration time: [calculated estimate]
```

---

## 🛠️ TROUBLESHOOTING HELPERS

If you get errors, try these:

```
# Test file access
"Can you read the file at [YOUR PATH]? Just show me the first 3 lines."

# Smaller scope
"Process only the first 2 posts from [YOUR PATH]"

# Step-by-step
"First, just extract all post titles from [YOUR PATH] and show them to me"

# Directory issues
"Create a new directory called 'portfolio-project' in my home folder, then work in there"

# Permission issues
"Check if I have read/write permissions for [YOUR PATH]. If not, guide me to fix it."
```

---

## ⚙️ BEFORE YOU START

**Replace these in prompts above:**
- `[YOUR FILE PATH]` → Actual path to your XML file
- `[POST TITLE]` → Specific post if targeting one

**Get your file path:**
- Mac: Right-click file + Option → "Copy as Pathname"
- Windows: Shift + Right-click → "Copy as path"

**Example paths:**
```
Mac: /Users/brandon/Downloads/Squarespace-Wordpress-Export-11-02-2025.xml
Windows: C:\Users\Brandon\Downloads\Squarespace-Wordpress-Export-11-02-2025.xml
```

---

## 🎬 RECOMMENDED SEQUENCE

1. **Start here:** Quick Test (verify file works)
2. **Then:** Complete Analysis (understand what you have)
3. **Next:** Choose your path:
   - Fast track: Quick Wins (3 recent posts)
   - Complete: Complete Migration Package
   - Automation: Voice Memo Processor + Automation Architecture

---

**Ready to copy and paste into Claude Code!**

Just find the section you want, copy the entire code block, replace [YOUR FILE PATH], and paste into Claude Code terminal.
