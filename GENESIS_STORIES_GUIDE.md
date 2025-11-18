# Genesis Stories Guide

## Overview

You now have a complete system for turning your modeling photos into powerful storytelling blog posts. This guide shows you how to add new stories and publish them as throwback blog posts.

## What You Have

### 1. **Homepage Feature Section** (New! Dolce & Gabbana Level)
- Full-width cinematic section on homepage
- Features 3 hero photos with stories
- Scroll animations and luxury aesthetics
- "Explore Full Archive" CTA button
- The Rebirth story teaser

**Location:** `components/home/genesis-archive-section.tsx`

### 2. **Stories Database**
- Structured data for each photo
- Support for full backstories, lessons, behind-the-scenes
- Can be published as blog posts

**Location:** `lib/genesis-stories.ts`

### 3. **Blog Post Template**
- Beautiful article layout for each story
- Full-height hero image
- Four-part narrative structure:
  1. The Setting
  2. The Challenge
  3. The Breakthrough
  4. The Impact
- Lesson learned callout
- Behind the scenes section
- Tags for categorization

**Location:** `app/blog/genesis/[slug]/page.tsx`

### 4. **Full Archive Gallery**
- 50 photos organized by category
- Filter by: All, Editorial, Campaign, Runway
- Lightbox view with stories
- Andrew Gerard tribute section

**Location:** `app/gallery/genesis/page.tsx`

---

## How to Add a New Story

### Step 1: Choose the Photo

Pick a photo from the Genesis gallery that you want to tell a deeper story about.

### Step 2: Add the Full Story to Database

Open `lib/genesis-stories.ts` and add a new entry to the `fullyDevelopedStories` array:

```typescript
{
  id: 'c7', // Match the ID from gallery
  src: '/images/gallery/genesis/campaigns/B.7.jpg',
  title: 'Luxury Sportswear',
  category: 'campaign',
  brand: 'Nike', // Optional
  year: '2019',
  location: 'Portland, Oregon',

  story: 'Short version for gallery hover (1-2 sentences)',

  fullBackstory: {
    setting: `Describe when and where this happened. Set the scene.
    What was going on in your life? What led to this shoot?`,

    challenge: `What was difficult? What made this shoot unique or challenging?
    What were you struggling with internally or externally?`,

    breakthrough: `What was the turning point? What moment made it click?
    What did someone say or do that changed everything?`,

    impact: `How did this affect your career? What did you learn?
    How does this moment still influence you today?`
  },

  lessonLearned: `The ONE key takeaway. Make it profound and relatable.
  This should be wisdom others can apply to their own lives.`,

  behindTheScenes: `Fun details, funny moments, or interesting facts that
  didn't fit in the main story but add color and humanity.`,

  blogSlug: 'luxury-sportswear-nike-campaign',
  published: false, // Change to true when ready to publish

  tags: ['nike', 'sportswear', 'confidence', 'breakthrough']
}
```

### Step 3: Write the Backstory

For each section, write 2-4 paragraphs. Be specific. Use sensory details. Make it cinematic.

**Good Example:**
```
Los Angeles, 2019. The casting email said "athletic build required."
I had 6 weeks to prepare. This wasn't just another shoot—it was the kind
of campaign that could define how I was seen in the industry.
```

**Bad Example:**
```
I did a shoot in LA in 2019 for a brand.
```

### Step 4: Publish the Story

1. Change `published: false` to `published: true`
2. The blog post will automatically be available at:
   - `/blog/genesis/[your-slug]`
   - Example: `/blog/genesis/luxury-sportswear-nike-campaign`

### Step 5: Feature on Homepage (Optional)

If this is one of your BEST stories, you can feature it on the homepage.

Open `components/home/genesis-archive-section.tsx` and update the `featuredPhotos` array (lines 18-40).

---

## Story Structure Template

Copy this when writing new stories:

### The Setting
- Where were you?
- When was this?
- What was happening in your life/career?
- Set the emotional tone

### The Challenge
- What made this difficult?
- What were you afraid of?
- What obstacles existed?
- What was at stake?

### The Breakthrough
- What was the turning point?
- What specific moment changed everything?
- Who said or did something that helped?
- How did you shift your perspective?

### The Impact
- How did this change your career?
- What doors did it open?
- What did you learn about yourself?
- How does it still affect you today?

---

## Example Stories Already Written

I've written 3 complete examples for you:

1. **Underwear Campaign** - About vulnerability and strength
2. **TETU Magazine Cover** - About finding your unique value
3. **The Rebirth (Andrew Gerard)** - About transformation after cancer

These are in `lib/genesis-stories.ts` and serve as templates for your future stories.

---

## Publishing Workflow

### For Social Media Throwback Posts

1. Write the full story in `genesis-stories.ts`
2. Set `published: true`
3. Take a screenshot of the live blog post
4. Share on Instagram/Reddit with:
   - Photo from the shoot
   - Brief excerpt from the story
   - Link to full article
   - Hashtags: #ThrowbackThursday #ModelingStories #Genesis

### For Blog Content Strategy

**Publish 1 Genesis story per week** as a throwback series:
- Monday: Publish new story
- Tuesday: Share on Reddit r/malegrooming
- Wednesday: Share on Instagram
- Thursday: Share excerpt on Medium
- Friday: Analyze traffic and engagement

---

## Tips for Great Stories

1. **Be specific** - "Vancouver, 2017" not "a few years ago"
2. **Show emotion** - Don't just say you were nervous, describe the physical sensation
3. **Include dialogue** - What did people actually say?
4. **Make it universal** - How can others apply this lesson?
5. **Be vulnerable** - The scariest truth is often the most powerful

---

## Current Stats

- **Total Genesis Photos:** 50
- **Fully Written Stories:** 3
- **Published Blog Posts:** 0 (ready to publish anytime)
- **Featured on Homepage:** 3 photos

---

## Next Steps

1. **Choose 2-3 more photos** that have strong memories
2. **Write their full backstories** using the template
3. **Publish your first story** by changing `published: true`
4. **Share on social media** with link back to blog
5. **Monitor traffic** - these stories will drive organic search

---

## File Locations Quick Reference

```
Homepage Genesis Section:
  → components/home/genesis-archive-section.tsx

Stories Database:
  → lib/genesis-stories.ts

Blog Post Template:
  → app/blog/genesis/[slug]/page.tsx

Full Gallery:
  → app/gallery/genesis/page.tsx
```

---

## Questions to Ask Yourself

When choosing which photos to write about:

1. Does this photo have a strong memory attached?
2. Did something significant happen during or after this shoot?
3. Is there a lesson I learned that others would benefit from?
4. Can I tell this story with emotional honesty?
5. Does this story show transformation or growth?

If you answer "yes" to 3 or more, write the story.

---

**Remember:** These aren't just modeling photos—they're visual markers of your journey. Each one has a story worth telling. The more vulnerable and honest you are, the more powerful the content becomes.
