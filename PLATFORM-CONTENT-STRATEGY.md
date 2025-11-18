# 📱 PLATFORM CONTENT STRATEGY

## Core Principle: Right Content, Right Platform

Each platform has its own culture. Respecting that = better engagement + no bans.

---

## 🟧 REDDIT

### What Works:
✅ Product reviews (Braun IPL, headphones, etc.)
✅ Tech projects (code, tools, open source)
✅ Honest opinions (no marketing BS)
✅ "I built this" posts
✅ Asking for feedback

### What DOESN'T Work:
❌ Self-promotion without value
❌ Spam links
❌ Marketing copy
❌ Ignoring subreddit rules

### Content to Post:
1. **Braun IPL Review** → r/malegrooming, r/skincareaddiction, r/buyitforlife
2. **AI Products** → r/SideProject, r/webdev, r/artificial
3. **Meditation Store** → r/Meditation, r/mindfulness
4. **Tech Stack** → r/webdev, r/nextjs

### Tone:
- Honest, not salesy
- "Here's my experience" not "Buy this"
- Engage with comments (Reddit rewards this)
- Follow subreddit rules (READ THEM FIRST)

---

## 📝 MEDIUM

### What Works:
✅ Long-form essays
✅ Personal stories
✅ Philosophy
✅ Book excerpts
✅ Creative writing

### What DOESN'T Work:
❌ Product reviews (that's spammy)
❌ Affiliate links
❌ Short posts (go to Twitter instead)
❌ Listicles (Medium hates these)

### Content to Post:
1. **Essays:**
   - "Self-Esteem: Cultivating a Positive Self-Image"
   - "Introduction to Social Theory"
2. **Book Excerpts:**
   - Block A, B, C (chapters or excerpts)
3. **Poems:**
   - "Fine Lines"
   - "Poet Proponent"
   - "The Tourbillon"
4. **Personal Narratives:**
   - Philosophy
   - Reflections
   - NOT product reviews

### Tone:
- Thoughtful, literary
- Personal voice
- Longer form (1,000+ words)
- No calls-to-action (Medium hates this)

---

## 💼 LINKEDIN

### What Works:
✅ Professional projects
✅ Tech/software you built
✅ AI products
✅ Career insights
✅ Industry trends

### What DOESN'T Work:
❌ Personal grooming
❌ Product reviews (unless B2B)
❌ Overly casual tone
❌ Memes (LinkedIn is not Twitter)

### Content to Post:
1. **AI Products:**
   - Professor Carl (AI tutor)
   - Lead Scraper (data tool)
   - Cancer Detector (health tech)
2. **Tech Projects:**
   - Meditation store (tech stack)
   - Blog automation (developer tools)
   - Next.js + AI integration
3. **Professional Insights:**
   - Building AI products
   - Full-stack development
   - Tech entrepreneurship

### Tone:
- Professional but authentic
- Technical details welcome
- Share learnings, not just wins
- "Here's what I built and what I learned"

---

## 📌 PINTEREST (When API Approved)

### What Works:
✅ Product reviews with images
✅ How-to guides
✅ Visual content
✅ Before/after results

### Content to Post:
1. **Product Reviews:**
   - Braun IPL (with before/after photos)
   - Headphones
   - All affiliate products
2. **Guides:**
   - "How to use IPL at home"
   - "Setting up meditation practice"

### Tone:
- Visual-first
- Pinterest is Google for products
- Use SEO keywords in descriptions

---

## 🐦 TWITTER (If You Pay $100/Month)

### What Works:
✅ Short thoughts
✅ Thread-style storytelling
✅ Hot takes
✅ Engagement with others

### Content to Post:
- Product review threads (Braun IPL)
- Tech project announcements
- Philosophical thoughts
- Engaging with community

### Tone:
- Casual, conversational
- Thread format for longer stories
- Engage with replies

---

## 📋 CONTENT MATRIX

| Content Type | Reddit | Medium | LinkedIn | Pinterest | Twitter |
|-------------|--------|--------|----------|-----------|---------|
| **Braun IPL Review** | ✅ r/malegrooming | ❌ Spammy | ❌ Wrong audience | ✅ Visual | ✅ Thread |
| **Essays** | ❌ Too long | ✅ Perfect | ❌ Too casual | ❌ Not visual | ❌ Too long |
| **Books** | ❌ Not Reddit | ✅ Excerpts | ❌ Not professional | ❌ Not visual | ❌ Too long |
| **AI Products** | ✅ r/SideProject | ❌ Not essay | ✅ Professional | ❌ Not visual | ✅ Announcement |
| **Meditation Store** | ✅ r/Meditation | ❌ Not essay | ✅ Tech stack | ✅ Visual guides | ✅ Short tips |
| **Poems** | ❌ Small audience | ✅ Perfect | ❌ Wrong platform | ❌ Not visual | ✅ Short lines |

---

## 🎯 AUTOMATION RULES

### Reddit Automation:
```typescript
if (contentType === 'product-review') {
  postTo: ['r/malegrooming', 'r/skincareaddiction']
}
if (contentType === 'tech-project') {
  postTo: ['r/SideProject', 'r/webdev']
}
```

### Medium Automation:
```typescript
if (contentType === 'essay' || contentType === 'book' || contentType === 'poem') {
  postTo: 'Medium'
  canonicalUrl: 'brandonmills.com' // SEO credit to your site
}
```

### LinkedIn Automation:
```typescript
if (contentType === 'ai-product' || contentType === 'tech-project') {
  postTo: 'LinkedIn'
  tone: 'professional'
}
```

---

## ✅ FINAL CHECKLIST BEFORE POSTING

Before running automation, ask:

1. **Is this the right platform for this content?**
2. **Am I following platform etiquette?**
3. **Will this provide value to the audience?**
4. **Am I being authentic, not salesy?**
5. **Have I read the subreddit rules?** (Reddit)

---

## 🚀 EXECUTION PLAN

### Week 1:
- Reddit: Post Braun IPL review
- Medium: Post "Self-Esteem" essay
- LinkedIn: Post Professor Carl AI product

### Week 2:
- Reddit: Post meditation store
- Medium: Post Block A excerpt
- LinkedIn: Post meditation tech stack

### Ongoing:
- New product review → Reddit + Pinterest
- New essay/poem → Medium
- New tech project → Reddit + LinkedIn

---

This strategy respects each platform while maximizing reach and engagement.

No spam. Just value.
