# Implementation Plan: Critical Fixes and Engagement Features

**Date:** 2025-11-18
**Priority:** Critical fixes first, then engagement features
**Estimated Total Time:** 12-16 hours

---

## Overview

This plan addresses two categories:
1. **Critical Fixes** - E-commerce functionality broken (meditation purchase, shop images)
2. **Engagement Features** - Interactive content for traffic generation (quiz, illusions lab, games)

---

## PHASE 1: CRITICAL FIXES

### Task 1: Fix Meditation Purchase Flow

**Problem:** Users cannot purchase meditations - "Buy Now" button not working
**Impact:** Direct revenue loss
**Estimated Time:** 1-2 hours

#### Investigation Steps

1. **Check browser console for errors**
   - Open https://brandonmills.com/meditations/[any-meditation]
   - Open DevTools > Console
   - Click "Buy Now" button
   - Capture any JavaScript errors

2. **Test Stripe API connection locally**
   ```bash
   cd "/Volumes/Super Mastery/Webdesigner"
   curl -X POST http://localhost:3000/api/stripe/create-checkout \
     -H "Content-Type: application/json" \
     -d '{"meditationId": "test", "slug": "test", "voice": "male"}'
   ```

3. **Verify Stripe dashboard**
   - Check https://dashboard.stripe.com/test/logs for API errors
   - Verify product/price IDs exist

#### Files to Modify

**File:** `app/api/stripe/create-checkout/route.ts`

```typescript
// Add better error handling and logging
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Checkout request:', body)

    const { meditationId, slug, voice } = body

    if (!meditationId || !slug) {
      return NextResponse.json(
        { error: 'Missing required fields: meditationId, slug' },
        { status: 400 }
      )
    }

    // Verify Stripe key exists
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('STRIPE_SECRET_KEY not configured')
      return NextResponse.json(
        { error: 'Payment system not configured' },
        { status: 500 }
      )
    }

    // ... rest of implementation
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
```

**File:** `app/meditations/[slug]/page.tsx`

```typescript
// Improve error handling in handleBuyNow
const handleBuyNow = async () => {
  setIsLoading(true)
  setError(null) // Add error state

  try {
    const response = await fetch('/api/stripe/create-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        meditationId: meditation.id,
        slug: meditation.slug,
        voice: selectedVoice,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || `HTTP ${response.status}`)
    }

    const data = await response.json()

    if (!data.url) {
      throw new Error('No checkout URL received')
    }

    window.location.href = data.url
  } catch (error) {
    console.error('Checkout error:', error)
    setError(error instanceof Error ? error.message : 'Failed to start checkout')
    setIsLoading(false)
  }
}
```

#### Verification

```bash
# Test locally
npm run dev
# Navigate to meditation page, click Buy Now
# Check Network tab for API response
# Verify redirect to Stripe checkout

# Test on production after deploy
npx vercel --prod
```

---

### Task 2: Fix Shop Product Images

**Problem:** Products display raw design artwork (poem text) instead of product mockups
**Root Cause:** `/designs/rendered/` contains raw art files, no mockup images exist
**Impact:** Poor user experience, products look unprofessional
**Estimated Time:** 3-4 hours

#### Solution Options

**Option A: Generate Mockups via Printful API (Recommended)**

Printful can generate mockups for synced products.

**File to create:** `scripts/fetch-printful-mockups.ts`

```typescript
#!/usr/bin/env tsx
/**
 * Fetch product mockups from Printful for all synced products
 */

import fs from 'fs'
import path from 'path'

const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY!
const PRINTFUL_STORE_ID = process.env.PRINTFUL_STORE_ID!

interface SyncProduct {
  category: string
  name: string
  productType: string
  syncProductId: number
}

async function fetchMockups() {
  // Read sync results
  const syncPath = '/Volumes/Super Mastery/Webdesigner/public/designs/printful-sync.json'
  const syncData = JSON.parse(fs.readFileSync(syncPath, 'utf-8'))

  const mockupsDir = '/Volumes/Super Mastery/Webdesigner/public/mockups'
  fs.mkdirSync(mockupsDir, { recursive: true })

  for (const product of syncData.results) {
    if (!product.success || !product.syncProductId) continue

    console.log(`Fetching mockups for: ${product.category}/${product.name} (${product.productType})`)

    try {
      // Get product details with mockup files
      const response = await fetch(
        `https://api.printful.com/store/products/${product.syncProductId}`,
        {
          headers: {
            'Authorization': `Bearer ${PRINTFUL_API_KEY}`,
            'X-PF-Store-Id': PRINTFUL_STORE_ID,
          }
        }
      )

      if (!response.ok) {
        console.error(`  Failed to fetch product ${product.syncProductId}`)
        continue
      }

      const data = await response.json()
      const syncVariants = data.result.sync_variants || []

      // Download mockup images
      for (const variant of syncVariants) {
        if (variant.files) {
          for (const file of variant.files) {
            if (file.type === 'preview' && file.preview_url) {
              const filename = `${product.category}-${product.name}-${product.productType}.jpg`
              const outputPath = path.join(mockupsDir, filename)

              // Download image
              const imgResponse = await fetch(file.preview_url)
              const buffer = await imgResponse.arrayBuffer()
              fs.writeFileSync(outputPath, Buffer.from(buffer))

              console.log(`  Saved: ${filename}`)
              break // One mockup per product
            }
          }
        }
      }

      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 500))
    } catch (error) {
      console.error(`  Error: ${error}`)
    }
  }
}

fetchMockups()
```

**File to modify:** `public/data/theme-factory-products.json`

Update each product's image path to use mockups:

```json
{
  "id": "tf-the-tourbillon-mug",
  "name": "The Tourbillon - Ceramic Mug",
  "image": "/mockups/poetry-the-tourbillon-mug.jpg",
  "images": [
    "/mockups/poetry-the-tourbillon-mug.jpg"
  ],
  // ... rest of product data
}
```

**Option B: Use Placeholder Mockup Templates**

If Printful mockups aren't available, create composite images:

```typescript
// Create mockup composites using Sharp
import sharp from 'sharp'

async function createMugMockup(designPath: string, outputPath: string) {
  // Load mug template (white mug on background)
  const template = await sharp('/Volumes/Super Mastery/Webdesigner/public/templates/mug-template.png')

  // Load and resize design to fit mug area
  const design = await sharp(designPath)
    .resize(800, 400)
    .toBuffer()

  // Composite design onto mug template
  await template
    .composite([{ input: design, top: 200, left: 150 }])
    .toFile(outputPath)
}
```

#### File to modify: `scripts/update-product-images.ts`

```typescript
#!/usr/bin/env tsx
/**
 * Update theme-factory-products.json with mockup image paths
 */

import fs from 'fs'

const productsPath = '/Volumes/Super Mastery/Webdesigner/public/data/theme-factory-products.json'
const products = JSON.parse(fs.readFileSync(productsPath, 'utf-8'))

for (const product of products) {
  // Extract product info from ID: tf-{name}-{type}
  const parts = product.id.replace('tf-', '').split('-')
  const productType = parts.pop()
  const designName = parts.join('-')

  // Determine category from existing path
  let category = 'poetry'
  if (product.image.includes('/photography/')) category = 'photography'
  if (product.image.includes('/philosophy/')) category = 'philosophy'

  // Update to mockup path
  const mockupPath = `/mockups/${category}-${designName}-${productType}.jpg`

  // Check if mockup exists
  const fullPath = `/Volumes/Super Mastery/Webdesigner/public${mockupPath}`
  if (fs.existsSync(fullPath)) {
    product.image = mockupPath
    product.images = [mockupPath]
  } else {
    console.warn(`Mockup not found: ${mockupPath}`)
  }
}

fs.writeFileSync(productsPath, JSON.stringify(products, null, 2))
console.log('Updated product images')
```

#### Verification

```bash
# 1. Fetch mockups from Printful
NODE_ENV=production npx tsx scripts/fetch-printful-mockups.ts

# 2. Update product JSON
npx tsx scripts/update-product-images.ts

# 3. Check files exist
ls -la public/mockups/

# 4. Test locally
npm run dev
# Open http://localhost:3000/shop
# Verify images show product mockups

# 5. Deploy
npx vercel --prod
```

---

## PHASE 2: ENGAGEMENT FEATURES

### Task 3: Warrior Archetype Quiz

**Purpose:** Interactive personality quiz for engagement and email capture
**Estimated Time:** 3-4 hours

#### Files to Create

**File:** `app/quiz/warrior-archetype/page.tsx`

```typescript
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Question {
  id: number
  text: string
  options: {
    text: string
    archetype: 'king' | 'warrior' | 'magician' | 'lover'
    points: number
  }[]
}

const questions: Question[] = [
  {
    id: 1,
    text: "When facing a major life decision, you typically...",
    options: [
      { text: "Weigh all options carefully and seek wisdom from mentors", archetype: 'king', points: 3 },
      { text: "Trust your gut and act decisively", archetype: 'warrior', points: 3 },
      { text: "Research extensively and analyze patterns", archetype: 'magician', points: 3 },
      { text: "Consider how it will affect your relationships", archetype: 'lover', points: 3 }
    ]
  },
  // ... 10-15 questions total
]

const archetypes = {
  king: {
    title: 'The Sovereign King',
    description: 'You embody leadership, wisdom, and benevolent authority...',
    strengths: ['Strategic thinking', 'Natural leadership', 'Calm under pressure'],
    shadowAspect: 'The Tyrant - when power becomes control',
    recommendedContent: [
      { title: 'Meditations for Leaders', href: '/meditations' },
      { title: 'Philosophy of Power', href: '/writing' }
    ]
  },
  warrior: {
    title: 'The Noble Warrior',
    description: 'You embody courage, discipline, and purposeful action...',
    // ...
  },
  magician: {
    title: 'The Sage Magician',
    description: 'You embody knowledge, transformation, and insight...',
    // ...
  },
  lover: {
    title: 'The Passionate Lover',
    description: 'You embody connection, creativity, and emotional depth...',
    // ...
  }
}

export default function WarriorArchetypeQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [scores, setScores] = useState({ king: 0, warrior: 0, magician: 0, lover: 0 })
  const [result, setResult] = useState<string | null>(null)
  const [email, setEmail] = useState('')

  const handleAnswer = (archetype: string, points: number) => {
    setScores(prev => ({ ...prev, [archetype]: prev[archetype] + points }))

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    } else {
      // Calculate result
      const winner = Object.entries(scores).reduce((a, b) =>
        a[1] > b[1] ? a : b
      )[0]
      setResult(winner)
    }
  }

  const handleEmailSubmit = async () => {
    // Save to email list
    await fetch('/api/quiz/save-result', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, archetype: result, scores })
    })
  }

  return (
    <div className="min-h-screen bg-black text-white py-20 px-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-serif mb-8 text-center">
          Discover Your Warrior Archetype
        </h1>

        {!result ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
            >
              <p className="text-sm text-white/50 mb-4">
                Question {currentQuestion + 1} of {questions.length}
              </p>

              <h2 className="text-2xl mb-8">
                {questions[currentQuestion].text}
              </h2>

              <div className="space-y-4">
                {questions[currentQuestion].options.map((option, i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswer(option.archetype, option.points)}
                    className="w-full p-4 text-left border border-white/20
                             hover:border-accent-gold hover:bg-white/5
                             transition-all rounded"
                  >
                    {option.text}
                  </button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <h2 className="text-3xl font-serif mb-4">
              {archetypes[result].title}
            </h2>
            <p className="text-white/70 mb-8">
              {archetypes[result].description}
            </p>

            {/* Email capture */}
            <div className="bg-white/5 p-6 rounded-lg mb-8">
              <p className="mb-4">Get your full archetype report:</p>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full p-3 bg-black border border-white/30 rounded mb-4"
              />
              <button
                onClick={handleEmailSubmit}
                className="w-full py-3 bg-accent-gold text-black font-medium rounded"
              >
                Get Full Report
              </button>
            </div>

            {/* Recommended content */}
            <div className="text-left">
              <h3 className="text-xl mb-4">Recommended for you:</h3>
              {archetypes[result].recommendedContent.map((item, i) => (
                <a
                  key={i}
                  href={item.href}
                  className="block p-4 border border-white/10 rounded mb-2 hover:border-accent-gold"
                >
                  {item.title}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
```

**File:** `app/api/quiz/save-result/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const { email, archetype, scores } = await request.json()

  // TODO: Save to database or email service
  // For now, log the result
  console.log('Quiz result:', { email, archetype, scores })

  // Could integrate with Resend for email delivery

  return NextResponse.json({ success: true })
}
```

#### Verification

```bash
npm run dev
# Navigate to http://localhost:3000/quiz/warrior-archetype
# Complete quiz, verify results display
# Test email capture
```

---

### Task 4: Visual Illusions Lab

**Purpose:** Interactive cognitive demonstrations showcasing perception
**Estimated Time:** 2-3 hours

#### File to Create: `app/lab/illusions/page.tsx`

```typescript
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

const illusions = [
  {
    id: 'muller-lyer',
    name: 'Muller-Lyer Illusion',
    description: 'Two lines of equal length appear different due to arrow endings',
    component: MullerLyerIllusion
  },
  {
    id: 'checker-shadow',
    name: 'Checker Shadow',
    description: 'Squares A and B are the same color, despite appearing different',
    component: CheckerShadowIllusion
  },
  // ... more illusions
]

function MullerLyerIllusion() {
  const [revealed, setRevealed] = useState(false)

  return (
    <div className="relative">
      <svg viewBox="0 0 400 200" className="w-full max-w-md mx-auto">
        {/* Line 1 with outward arrows */}
        <line x1="50" y1="60" x2="200" y2="60" stroke="white" strokeWidth="2" />
        <line x1="50" y1="60" x2="70" y2="40" stroke="white" strokeWidth="2" />
        <line x1="50" y1="60" x2="70" y2="80" stroke="white" strokeWidth="2" />
        <line x1="200" y1="60" x2="180" y2="40" stroke="white" strokeWidth="2" />
        <line x1="200" y1="60" x2="180" y2="80" stroke="white" strokeWidth="2" />

        {/* Line 2 with inward arrows */}
        <line x1="50" y1="140" x2="200" y2="140" stroke="white" strokeWidth="2" />
        <line x1="50" y1="140" x2="30" y2="120" stroke="white" strokeWidth="2" />
        <line x1="50" y1="140" x2="30" y2="160" stroke="white" strokeWidth="2" />
        <line x1="200" y1="140" x2="220" y2="120" stroke="white" strokeWidth="2" />
        <line x1="200" y1="140" x2="220" y2="160" stroke="white" strokeWidth="2" />

        {/* Reveal overlay */}
        {revealed && (
          <>
            <line x1="50" y1="60" x2="50" y2="140" stroke="gold" strokeWidth="1" strokeDasharray="4" />
            <line x1="200" y1="60" x2="200" y2="140" stroke="gold" strokeWidth="1" strokeDasharray="4" />
          </>
        )}
      </svg>

      <button
        onClick={() => setRevealed(!revealed)}
        className="mt-4 px-4 py-2 bg-accent-gold text-black rounded"
      >
        {revealed ? 'Hide' : 'Reveal'} Truth
      </button>

      <p className="mt-4 text-white/70 text-sm">
        {revealed
          ? 'Both lines are exactly 150 pixels long. The arrow direction tricks your brain.'
          : 'Which line appears longer?'}
      </p>
    </div>
  )
}

export default function IllusionsLab() {
  const [selectedIllusion, setSelectedIllusion] = useState(illusions[0])

  return (
    <div className="min-h-screen bg-black text-white py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-serif mb-4 text-center">
          Visual Illusions Lab
        </h1>
        <p className="text-white/60 text-center mb-12">
          Explore how your brain interprets visual information
        </p>

        {/* Illusion selector */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-4">
          {illusions.map(illusion => (
            <button
              key={illusion.id}
              onClick={() => setSelectedIllusion(illusion)}
              className={`px-4 py-2 rounded whitespace-nowrap ${
                selectedIllusion.id === illusion.id
                  ? 'bg-accent-gold text-black'
                  : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              {illusion.name}
            </button>
          ))}
        </div>

        {/* Selected illusion */}
        <motion.div
          key={selectedIllusion.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white/5 p-8 rounded-lg"
        >
          <h2 className="text-2xl mb-2">{selectedIllusion.name}</h2>
          <p className="text-white/60 mb-8">{selectedIllusion.description}</p>

          <selectedIllusion.component />
        </motion.div>
      </div>
    </div>
  )
}
```

---

### Task 5: Reaction Time Challenge

**Purpose:** Simple cognitive game for engagement
**Estimated Time:** 1-2 hours

#### File to Create: `app/games/reaction-time/page.tsx`

```typescript
'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

type GameState = 'waiting' | 'ready' | 'go' | 'result' | 'too-early'

export default function ReactionTimeGame() {
  const [gameState, setGameState] = useState<GameState>('waiting')
  const [reactionTime, setReactionTime] = useState<number>(0)
  const [bestTime, setBestTime] = useState<number | null>(null)
  const [attempts, setAttempts] = useState<number[]>([])

  const startTimeRef = useRef<number>(0)
  const timeoutRef = useRef<NodeJS.Timeout>()

  const startGame = () => {
    setGameState('ready')

    // Random delay between 1-5 seconds
    const delay = 1000 + Math.random() * 4000

    timeoutRef.current = setTimeout(() => {
      setGameState('go')
      startTimeRef.current = performance.now()
    }, delay)
  }

  const handleClick = () => {
    if (gameState === 'waiting') {
      startGame()
    } else if (gameState === 'ready') {
      clearTimeout(timeoutRef.current)
      setGameState('too-early')
    } else if (gameState === 'go') {
      const time = Math.round(performance.now() - startTimeRef.current)
      setReactionTime(time)
      setAttempts(prev => [...prev, time])

      if (!bestTime || time < bestTime) {
        setBestTime(time)
      }

      setGameState('result')
    } else {
      setGameState('waiting')
    }
  }

  const getBackgroundColor = () => {
    switch (gameState) {
      case 'waiting': return 'bg-blue-600'
      case 'ready': return 'bg-red-600'
      case 'go': return 'bg-green-600'
      case 'result': return 'bg-blue-600'
      case 'too-early': return 'bg-red-800'
    }
  }

  const getMessage = () => {
    switch (gameState) {
      case 'waiting': return 'Click to Start'
      case 'ready': return 'Wait for green...'
      case 'go': return 'CLICK NOW!'
      case 'result': return `${reactionTime}ms`
      case 'too-early': return 'Too early! Click to retry'
    }
  }

  const averageTime = attempts.length > 0
    ? Math.round(attempts.reduce((a, b) => a + b, 0) / attempts.length)
    : null

  return (
    <div className="min-h-screen bg-black text-white py-20 px-6">
      <div className="max-w-md mx-auto text-center">
        <h1 className="text-3xl font-serif mb-8">Reaction Time Test</h1>

        <motion.button
          onClick={handleClick}
          className={`w-full aspect-square rounded-lg flex items-center
                     justify-center text-4xl font-bold cursor-pointer
                     transition-colors ${getBackgroundColor()}`}
          whileTap={{ scale: 0.98 }}
        >
          {getMessage()}
        </motion.button>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-2 gap-4 text-left">
          <div className="bg-white/5 p-4 rounded">
            <p className="text-sm text-white/50">Best Time</p>
            <p className="text-2xl">{bestTime ? `${bestTime}ms` : '-'}</p>
          </div>
          <div className="bg-white/5 p-4 rounded">
            <p className="text-sm text-white/50">Average</p>
            <p className="text-2xl">{averageTime ? `${averageTime}ms` : '-'}</p>
          </div>
        </div>

        <p className="mt-8 text-sm text-white/50">
          Attempts: {attempts.length}
        </p>

        {/* Comparison */}
        {bestTime && (
          <div className="mt-4 p-4 bg-white/5 rounded">
            <p className="text-sm">
              {bestTime < 200 ? 'Excellent! Pro gamer reflexes!' :
               bestTime < 250 ? 'Great! Above average reaction time.' :
               bestTime < 300 ? 'Good! Average human reaction time.' :
               'Keep practicing to improve!'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
```

---

### Task 6: Blog Post Series (Traffic Generation)

**Purpose:** SEO content to drive organic traffic
**Estimated Time:** 2-3 hours per post

#### Blog Topics

1. **"The 4 Warrior Archetypes: Which One Are You?"**
   - Detailed breakdown of King, Warrior, Magician, Lover
   - Links to quiz
   - Target keywords: warrior archetype, masculine archetypes, jungian archetypes

2. **"5 Visual Illusions That Reveal How Your Brain Works"**
   - Explain the science behind each illusion
   - Links to illusions lab
   - Target keywords: optical illusions, visual perception, brain tricks

3. **"How Fast Are Your Reflexes? Understanding Reaction Time"**
   - Science of reaction time
   - Factors that affect it
   - Links to game
   - Target keywords: reaction time test, reflex speed, cognitive performance

#### File Structure

```
app/blog/
  warrior-archetypes/page.tsx
  visual-illusions-brain/page.tsx
  reaction-time-science/page.tsx
```

---

## Execution Options

### Option A: Subagent-Driven Development

Execute tasks sequentially with code review between each:

```
Task 1 (Meditation fix) -> Review -> Deploy
Task 2 (Shop images) -> Review -> Deploy
Task 3 (Quiz) -> Review -> Deploy
...
```

### Option B: Parallel Session Execution

Launch multiple agents for independent tasks:

```
Agent 1: Critical fixes (Tasks 1-2)
Agent 2: Quiz feature (Task 3)
Agent 3: Lab & Games (Tasks 4-5)
Agent 4: Blog content (Task 6)
```

---

## Verification Checklist

- [ ] Meditation purchase completes successfully
- [ ] Shop displays product mockups (not raw designs)
- [ ] Quiz loads and calculates results correctly
- [ ] Illusions lab is interactive and educational
- [ ] Reaction time game records scores
- [ ] Blog posts are SEO-optimized
- [ ] All features deployed to production
- [ ] Mobile responsive on all new pages

---

## Post-Implementation

1. Test all features on production
2. Set up analytics tracking for quiz completions
3. Create social media posts for each feature
4. Submit new pages to Google Search Console
5. Monitor engagement metrics

---

**Plan created:** 2025-11-18
**Ready for execution**
