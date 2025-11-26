# Fix Webflow CMS Portfolio Data

## 🎯 THE REAL ISSUE

The labels you're seeing ("Underwear Campaign", "TETU Magazine Cover") are **NOT in the code** - they're in your **Webflow CMS** database.

### What I Fixed (Code Issues) ✅
- ✅ Missing `/checkout/cancel` page
- ✅ Stripe API version error
- ✅ Build compilation errors
- ✅ Deployment to correct branch (main)

### What You Need to Fix (Content Issues) ⚠️
- ⚠️ Portfolio project names in Webflow CMS
- ⚠️ Category labels in Webflow CMS
- ⚠️ Duplicate entries in Webflow CMS
- ⚠️ Magazine vs Campaign mislabeling

---

## 📋 HOW WEBFLOW DATA WORKS

Your gallery page fetches data from **Webflow CMS** via API:

```typescript
// lib/webflow-client.ts
export interface WebflowProject {
  name: string           // ← "Underwear Campaign" (WRONG)
  category: string       // ← "CAMPAIGN" (SHOULD BE?)
  tags: string
  'meta-description': string
  'main-image': WebflowImage
  'gallery-images': WebflowImage[]
}
```

The gallery displays whatever is in your Webflow CMS:

```tsx
// components/gallery/project-grid.tsx
<h3>{project.name}</h3>           {/* Shows: "Underwear Campaign" */}
<span>{project.category}</span>    {/* Shows: "CAMPAIGN" */}
```

---

## 🔧 HOW TO FIX IN WEBFLOW CMS

### Step 1: Login to Webflow

1. Go to: https://webflow.com/dashboard
2. Find your "Brandon Mills" site
3. Click **"CMS"** or **"Editor"**

### Step 2: Find Your Portfolio Collection

1. Look for a collection called something like:
   - "Portfolio"
   - "Projects"
   - "Work"
   - "Gallery Items"

2. This collection has fields:
   - **Name** - The project title
   - **Category** - The category label
   - **Tags** - Additional tags
   - **Main Image** - The cover photo
   - **Gallery Images** - All photos

### Step 3: Fix the Incorrect Entries

**Example Issue #1: "Underwear Campaign"**

Current (WRONG):
```
Name: "Underwear Campaign"
Category: "CAMPAIGN"
Year: '19
```

Should be:
```
Name: "DNA Magazine Tutorial"  (or whatever it really is)
Category: "EDITORIAL"
Year: '18
```

**Example Issue #2: "TETU Magazine Cover"**

Current (WRONG):
```
Name: "TETU Magazine Cover"
Category: "EDITORIAL"
Year: '18
```

Should be:
```
Name: "TETU Magazine Cover"  (might be correct)
Category: "EDITORIAL"
Year: (correct year)
```

### Step 4: Check for Duplicates

Look for projects with:
- Same photos
- Same shoot date
- Different names

Merge or delete duplicates.

### Step 5: Verify Magazine vs Campaign Labels

- **Campaign** = Commercial work (ads, brand partnerships)
- **Editorial** = Magazine features, artistic work
- **Cover** = Magazine cover shoots

Make sure each project has the correct category.

---

## 🔍 FIND THE SPECIFIC ENTRIES

In Webflow CMS, search for:

1. **Search for "Underwear"**
   - Find the entry
   - Look at the photos
   - Determine what it really is
   - Update the Name and Category

2. **Search for "TETU"**
   - Verify it's actually a TETU cover
   - Check the year is correct
   - Confirm category is right

3. **Look for duplicates**
   - Sort by date
   - Look for same photos in different entries
   - Merge or delete as needed

---

## 🎨 CORRECT CATEGORIZATION

### Campaign Photography
- Brand partnerships
- Product advertising
- Commercial work
- **Tags**: "CAMPAIGN", brand name, year

### Editorial Photography
- Magazine features (not covers)
- Fashion stories
- Artistic editorial spreads
- **Tags**: "EDITORIAL", magazine name, year

### Magazine Covers
- Actual magazine covers
- **Tags**: "COVER", magazine name, year

### Personal/Test Shoots
- Portfolio builders
- Collaborations
- Test photography
- **Tags**: "PERSONAL", photographer name, year

---

## 💾 AFTER FIXING IN WEBFLOW

### 1. Publish Changes

After editing in Webflow CMS:
- Click **"Publish"** in top right
- Wait for publish to complete

### 2. Clear Cache (if needed)

The website caches Webflow data for 1 hour. To see changes immediately:

**Option A: Wait 1 hour** (data auto-refreshes)

**Option B: Force refresh** by deploying to Vercel:
```bash
cd "/Volumes/Super Mastery/Webdesigner"
git commit --allow-empty -m "chore: Force cache refresh"
git push origin main
```

### 3. Verify Changes Live

- Visit: https://www.brandonmills.com/gallery
- Check the corrected project names
- Verify categories are accurate

---

## 📊 WHAT THE CODE DOES

The code is working perfectly:

1. ✅ Fetches data from Webflow CMS API
2. ✅ Displays project names from CMS
3. ✅ Shows categories from CMS
4. ✅ Renders images from CMS

The code **cannot** fix wrong data in Webflow - that's manual content editing.

---

## 🔐 WEBFLOW CREDENTIALS CHECK

Make sure these are set in your `.env.local`:

```bash
WEBFLOW_API_TOKEN=your_webflow_api_token
WEBFLOW_COLLECTION_ID=your_collection_id
```

You can find these in:
- Webflow Dashboard → Site Settings → Integrations → API Access

---

## 🆘 IF YOU CAN'T FIND THE ENTRIES

### Method 1: Use Webflow's Filter

1. In CMS collection
2. Click "Filter"
3. Filter by:
   - Name contains "Underwear"
   - Category = "CAMPAIGN"
   - Year = '19

### Method 2: Export CSV

1. In CMS collection
2. Click "⋯" menu
3. Select "Export CSV"
4. Open in Excel/Numbers
5. Find and fix entries
6. Re-import (or edit manually in Webflow)

### Method 3: Check Creation Date

The wrong entries might be:
- Recently created
- Imported from another source
- Auto-generated by a script

Sort by "Created" date to find them.

---

## ✅ SUMMARY

**What I Fixed in Code**:
- Cancel page (was 404)
- Stripe API version
- Build errors
- Deployment branch

**What YOU Need to Fix in Webflow CMS**:
- Project names ("Underwear Campaign" → actual name)
- Category labels (verify Campaign vs Editorial)
- Duplicate entries
- Magazine cover mislabeling

---

**The code is deployed correctly on the `main` branch.**
**The portfolio issues are in Webflow CMS content, not code.**

Go fix those entries in Webflow and publish! 🚀
