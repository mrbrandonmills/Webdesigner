# Claude Code Quick Start Guide
## Working with Your Squarespace Export

---

## How to Access Files in Claude Code

### Method 1: File Path Reference (Best for Large Files)
Claude Code runs on YOUR computer and can read files directly. You don't need to paste content.

**Steps:**
1. Save your XML file somewhere accessible (e.g., Downloads folder)
2. Get the full path:
   - **Mac**: Right-click file → Option key → "Copy as Pathname"
   - **Windows**: Shift + Right-click → "Copy as path"
3. Use that path in Claude Code prompts

**Example paths:**
```
Mac: /Users/brandon/Downloads/Squarespace-Wordpress-Export-11-02-2025.xml
Windows: C:\Users\Brandon\Downloads\Squarespace-Wordpress-Export-11-02-2025.xml
```

---

## Method 2: Google Drive Access (If You Want It)

Claude Code CAN access Google Drive, but requires setup:

**Option A: Download First (Easiest)**
1. Download XML from Google Drive to your computer
2. Use Method 1 above

**Option B: Google Drive API (Advanced)**
1. Create Google Cloud Project
2. Enable Google Drive API
3. Get credentials.json
4. Use Python gdrive library in Claude Code

**Prompt for Option B:**
```
Help me set up Google Drive API access for Claude Code:
1. Walk me through creating a Google Cloud project
2. Guide me in enabling Drive API and getting credentials
3. Create a Python script that can download files from my Drive
4. Test it by downloading the Squarespace export XML
```

---

## Ready-to-Use Claude Code Commands

### STARTER: Quick Analysis
Copy this into Claude Code terminal:

```
I have a WordPress export XML file at [PASTE YOUR FILE PATH HERE].

Parse this file and show me:
1. Total number of posts
2. List of all post titles
3. How many images per post
4. Which posts have Lorem ipsum vs real content

Create a summary table in markdown format.
```

### CONTENT: Extract All Post Data
```
Read the XML file at [YOUR FILE PATH]

Extract all posts into a structured JSON file with:
- title
- slug (from URL)
- all image URLs
- current content (first 100 chars)
- excerpt
- date published

Save to: portfolio-posts.json
```

### IMAGES: Download and Organize
```
From the XML at [YOUR FILE PATH]:

1. Extract all unique image URLs from Squarespace CDN
2. Create folders: /images/[post-slug]/
3. Download each image to its post folder
4. Rename images descriptively: [post-slug]-[number].jpg
5. Create a manifest.json mapping old URLs to new local paths
6. Handle errors gracefully (retry failed downloads)

Show progress as you download.
```

### MIGRATION: Convert to Ghost Format
```
Convert my Squarespace export to Ghost-compatible format:

Source: [YOUR FILE PATH]

For each post:
1. Extract title, content, images
2. Convert HTML to Ghost's Markdown format
3. Replace Squarespace image URLs with local paths
4. Generate proper front matter
5. Create SEO-friendly slug

Output: /ghost-content/[slug].md for each post
Plus: manifest.json with all post metadata
```

### AUTOMATION: Voice Memo Integration Planning
```
Design a system architecture for my portfolio automation:

GOAL: Voice memo → Published blog post

Components needed:
1. Voice memo transcription (Whisper API)
2. Content extraction from transcription
3. Image matching (by date/metadata)
4. Content generation (SEO-optimized)
5. Platform posting (Ghost API)

Create:
- System architecture diagram (Mermaid)
- API integration checklist
- Python pseudocode for each component
- Cost estimate for APIs
- Hosting recommendations (under $50/month)
```

---

## Pro Tips for Claude Code

### Tip 1: Be Specific About Output
Instead of: "Parse the XML"
Use: "Parse the XML and save results to output.json in the current directory"

### Tip 2: Ask for Progress Updates
Add: "Show me progress as you process each post"

### Tip 3: Error Handling
Add: "Include error handling and log any issues to errors.txt"

### Tip 4: File Organization
Tell Claude Code where to save files:
```
Create this directory structure:
/project-root
  /scripts (Python files)
  /data (JSON exports)
  /images (downloaded images)
  /output (final content)
```

### Tip 5: Iterative Development
Start small:
1. First: "Parse XML and show me 3 posts"
2. Then: "Now do all posts and save to JSON"
3. Then: "Now download images"
4. Finally: "Now generate content"

---

## Your Posts Summary

**Total Posts:** 10 portfolio shoots

**Recent Shoots (with real images):**
1. **"Good Company w/Emma & Melida"** - 65 images (most recent)
2. **"Silver & Gold w/AM REED"** - 26 images
3. **"Golden Touch w/ John Schell"** - 26 images
4. **"Reboot W/Esteban Bonilla"** - 9 images
5. **"Top Shots of 2024"** - 11 images

**Older Posts (placeholder content):**
- City of Apples (2 images)
- Emphatic Design (2 images)
- Everyday Beauty (3 images)
- Luxurious Ease (2 images)
- Quiet Reflection (2 images)

All posts currently have Lorem ipsum placeholder text that needs replacement.

---

## Suggested First Steps

### Option 1: Start with Recent Posts
Focus on your 3 newest shoots first:
```
Extract just these posts from the XML:
- "Good Company w/Emma & Melida"
- "Silver & Gold w/AM REED"  
- "Reboot W/Esteban Bonilla"

For each:
1. Download all images
2. Generate SEO content based on title and images
3. Create Ghost-compatible markdown
4. Save to /recent-posts/

Use my brand voice: Clean, minimalist, "Finding Meaning in Movement"
```

### Option 2: Complete Migration
Do everything at once:
```
Complete migration from Squarespace to Ghost:

1. Parse all 10 posts from XML at [PATH]
2. Download all 145+ images
3. Generate SEO content for all posts
4. Convert to Ghost format
5. Create import file
6. Generate sitemap.xml
7. Create 301 redirects mapping

Save everything to /ghost-migration/ with clear folder structure.
```

### Option 3: Build Automation First
Set up the system for future posts:
```
Build the voice memo automation system:

1. Create transcription script (Whisper)
2. Create content generator (Claude API)
3. Create image processor (PIL/Pillow)
4. Create Ghost API uploader
5. Create orchestration script (ties everything together)
6. Write documentation

Test with: "Silver & Gold w/AM REED" post
```

---

## Cost Breakdown for Automation

**Current Monthly Budget: $50**

**Recommended Stack:**
- **Ghost Hosting:** $9/month (Ghost(Pro) Starter) or $5/month (DigitalOcean self-hosted)
- **Cloudinary Images:** FREE tier (25GB storage, 25GB bandwidth)
- **Whisper API:** ~$0.006/minute (~$1.50/month for 4 posts @ 5 min each)
- **Claude API (Sonnet):** ~$3/1M tokens (~$2-5/month for content generation)
- **n8n Automation:** FREE (self-host) or $20/month (cloud)
- **Railway Deployment:** FREE tier or $5/month

**Total:** $17-39/month (well under budget!)

---

## Need Help?

**If Claude Code says "file not found":**
- Double-check your file path (copy-paste it exactly)
- Make sure the file is in an accessible location (not in a restricted folder)
- Try moving it to your home directory or Desktop

**If Claude Code is slow with large files:**
- Tell it: "Process posts one at a time and show progress"
- Or: "Extract just post titles first to validate the file works"

**If you want to see what Claude Code is doing:**
- Add: "Explain each step before you do it"
- Add: "Show me the code you're writing"

---

## Next Steps

1. ✅ You have the XML file
2. ✅ You have analysis and prompts
3. ⬜ Install Claude Code (if not already)
4. ⬜ Choose a starting prompt above
5. ⬜ Replace [YOUR FILE PATH] with actual path
6. ⬜ Run it in Claude Code
7. ⬜ Review results
8. ⬜ Iterate and improve

**First command to try:**
```bash
cd ~/Downloads  # or wherever your file is
claude "Show me the first 3 post titles from Squarespace-Wordpress-Export-11-02-2025.xml"
```

This validates Claude Code can read the file before doing anything complex.

---

Generated: November 2, 2025
Ready for immediate use with Claude Code
