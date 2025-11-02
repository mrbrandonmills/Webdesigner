# Squarespace WordPress Export Analysis & Claude Code Prompts

## File Overview
- **Source:** brandonmills.com (Squarespace export)
- **File Size:** 655KB, 8,336 lines
- **Content:** 23 items (blog posts + image attachments)
- **Format:** WordPress RSS/XML export format

---

## Content Structure

### Posts Identified:
1. City of Apples
2. Emphatic Design
3. Everyday Beauty
4. Luxurious Ease
5. Quiet Reflection
6. Reboot W/Esteban Bonilla
7. Good Company w/Emma & Melida
8. Silver & Gold w/AM REED
9. (Plus 15+ more posts and attachments)

### Each Post Contains:
- **Title:** Descriptive shoot/project name
- **Images:** Hosted on Squarespace CDN (images.squarespace-cdn.com)
- **Content:** Currently Lorem ipsum placeholder text
- **Excerpt:** Short description (also Lorem ipsum)
- **Structure:** HTML content within CDATA sections
- **Categories:** "null - null" (needs updating)

---

## How to Get This File to Claude Code

### Option 1: Direct File Path (Recommended)
Since Claude Code runs on your local machine, you can reference the file directly:

```bash
# Save the XML file to a known location, then tell Claude Code:
"Parse the XML file at /path/to/Squarespace-Wordpress-Export-11-02-2025.xml"
```

### Option 2: Break It Into Chunks
Claude Code can work with file paths and doesn't need the full content in the prompt:

```bash
# Claude Code can read files programmatically
"Read and analyze the WordPress export XML at [filepath]"
```

### Option 3: Create a Processed Summary
I can extract just the key data (titles, links, images) into a smaller JSON or CSV file that's easier to work with.

---

## Claude Code Prompts - Ready to Use

### Prompt 1: Initial Analysis
```
I have a WordPress/Squarespace export XML file at [YOUR_FILE_PATH]. 
This file contains 23 blog posts from my modeling portfolio website.

Please:
1. Parse the XML file
2. Extract all post titles, image URLs, and current content
3. Create a structured JSON summary showing:
   - Post titles
   - Image URLs (from Squarespace CDN)
   - Current text content
   - Post dates and metadata
4. Identify which posts need real content vs Lorem ipsum placeholders
```

### Prompt 2: Content Migration Strategy
```
Using the parsed XML data from my Squarespace export:

1. Create a migration plan to move this content to [Ghost/WordPress/Webflow]
2. Design a Python script that:
   - Downloads all images from Squarespace CDN
   - Renames them with descriptive names based on post titles
   - Organizes them into folders by post
3. Generate a mapping document showing:
   - Old Squarespace URLs → New platform URLs
   - Image locations and their new storage paths
   - Any broken or missing assets
```

### Prompt 3: Content Generation Setup
```
I need to replace the Lorem ipsum placeholder text in these 23 portfolio posts 
with real SEO-optimized content.

For each post:
1. Extract the post title (e.g., "City of Apples", "Silver & Gold w/AM REED")
2. Extract all image URLs for that post
3. Create a template prompt for generating content that includes:
   - Post title
   - List of images (so I can reference them when describing the shoot)
   - SEO keywords based on modeling/photography/fashion
   - Structure: Intro paragraph + detailed description + conclusion

Output this as a JSON file with one entry per post, ready for batch processing.
```

### Prompt 4: Image Processing Pipeline
```
Build a Python script that:

1. Reads the Squarespace XML export
2. Extracts all unique image URLs
3. For each image:
   - Downloads from Squarespace CDN
   - Converts to optimal web format (WebP with JPEG fallback)
   - Generates multiple sizes (thumbnail, medium, large, original)
   - Creates metadata file with dimensions, file size, original URL
4. Uploads processed images to [Cloudinary/Imgur/your storage]
5. Outputs a mapping file: old_url → new_url

Include error handling for:
- Failed downloads
- Corrupted images
- Rate limiting
- Duplicate detection
```

### Prompt 5: SEO Content Generator
```
Using the post structure from my Squarespace export:

Create a content generation system that:
1. Takes a post title (e.g., "Reboot W/Esteban Bonilla")
2. Takes a list of image URLs from that post
3. Uses Claude/GPT to generate:
   - SEO-optimized title (60 chars max)
   - Meta description (155 chars max)
   - Main content (300-500 words)
   - Alt text for each image
   - Tags/categories relevant to fashion/modeling
4. Maintains my brand voice: "Finding Meaning in Movement" - clean, 
   minimalist, professional, artistic
5. Outputs in WordPress-compatible format (or Ghost/Markdown)

Run this for all 23 posts and save results to individual markdown files.
```

### Prompt 6: Database Schema Designer
```
Design a database schema for my portfolio content that includes:

Tables for:
- Posts (id, title, slug, content, excerpt, published_date, status)
- Images (id, post_id, url, alt_text, width, height, file_size, cdn_url)
- Tags/Categories (for organizing shoots by type, model, style)
- SEO metadata (title, description, keywords, og_image)

Then create a Python script that:
1. Parses the Squarespace XML
2. Populates this database schema
3. Validates all data
4. Exports to SQL dump or JSON for import into new platform
```

### Prompt 7: Platform Migration Script
```
Build a complete migration script that:

INPUT: Squarespace WordPress XML export
OUTPUT: [Ghost/WordPress/Webflow] ready content

Process:
1. Parse XML and extract all posts
2. Download and optimize all images
3. Generate SEO-optimized content to replace Lorem ipsum
4. Create proper slugs and URLs
5. Set up categories and tags
6. Generate RSS feed
7. Create sitemap.xml
8. Validate all content
9. Export in target platform's import format

Include rollback capability and detailed logging.
```

### Prompt 8: Automated Voice Memo Integration
```
Using my Squarespace export as the base structure:

Design a system that:
1. Takes a voice memo recording (post-shoot debrief)
2. Transcribes using Whisper
3. Extracts key information:
   - Shoot name/title
   - Models involved
   - Location details
   - Styling notes
   - Memorable moments
4. Generates blog post content based on:
   - Transcription insights
   - Images from the shoot (matched by date/metadata)
   - SEO best practices
   - My brand voice
5. Auto-posts to new platform via API
6. Sends me a preview for approval before publishing

Create the architecture and API integration plan.
```

---

## Next Steps Checklist

- [ ] Save XML file to accessible location on your computer
- [ ] Choose target platform (Ghost/WordPress/Webflow/Custom)
- [ ] Install Claude Code CLI tool
- [ ] Copy relevant prompt(s) above into Claude Code
- [ ] Replace `[YOUR_FILE_PATH]` with actual path
- [ ] Run initial analysis to validate data
- [ ] Review extracted data structure
- [ ] Proceed with migration/content generation

---

## Technical Notes

**File Path Examples:**
- Windows: `C:\Users\Brandon\Downloads\Squarespace-Wordpress-Export-11-02-2025.xml`
- Mac/Linux: `/Users/brandon/Downloads/Squarespace-Wordpress-Export-11-02-2025.xml`

**Claude Code Can Handle:**
- Reading large files directly
- Parsing XML/JSON/CSV
- Web scraping and downloads
- API integrations
- Database operations
- File system operations

**Claude Code Cannot:**
- Access files in this chat interface
- Connect to Google Drive directly (but can use Drive API with credentials)
- Access clipboard or drag-and-drop

---

## Budget Considerations

For $50/month hosting budget, recommended stack:
- **Ghost**: $9/month (Managed) or $5/month (DigitalOcean droplet)
- **Images**: Cloudinary free tier (25GB storage, 25GB bandwidth)
- **Domain**: Already have (brandonmills.com)
- **Remaining**: ~$35 for automation tools (n8n on Railway, etc.)

Alternative: Self-host everything on $12/month Hetzner VPS

---

## Questions to Consider

1. **Platform Choice**: Where do you want to migrate? (Ghost, WordPress, Webflow, custom?)
2. **Content Priority**: Update all 23 posts at once, or prioritize recent/best shoots?
3. **Automation Level**: Fully automated voice-to-post, or semi-automated with review?
4. **Image Strategy**: Keep on Squarespace CDN, or migrate to new storage?
5. **URL Structure**: Keep existing URLs or redesign for better SEO?

---

Generated: November 2, 2025
File: Squarespace-Wordpress-Export-11-02-2025.xml (655KB)
