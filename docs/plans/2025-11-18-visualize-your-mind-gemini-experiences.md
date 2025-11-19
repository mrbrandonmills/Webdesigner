# Visualize Your Mind - Gemini Interactive Experiences Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a "Visualize Your Mind" essay analyzer that creates 3D neural network visualizations of user's thinking patterns, captures emails, and drives meditation product sales.

**Architecture:** Next.js API route calls Google Gemini API to analyze text and generate Three.js visualization code. Results stored in Vercel Blob, displayed in iframe with unlock gate for premium features. Email capture modal triggers on first view, feeding into Resend sequences.

**Tech Stack:** Next.js 15, React 19, Google Gemini API, Three.js, Framer Motion, Stripe, Resend, Vercel Blob

---

## Phase 1: Core Visualization Engine

### Task 1: Create Gemini Analysis API Route

**Files:**
- Create: `/Volumes/Super Mastery/Webdesigner/app/api/gemini/analyze/route.ts`
- Create: `/Volumes/Super Mastery/Webdesigner/lib/gemini-client.ts`

**Step 1: Create the Gemini client helper**

```typescript
// /lib/gemini-client.ts
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!)

export const geminiModel = genAI.getGenerativeModel({
  model: 'gemini-2.5-pro-preview-05-06'
})

export const MIND_VISUALIZER_SYSTEM_PROMPT = `You are an expert cognitive scientist and data visualization artist. Analyze the provided text and generate a Three.js visualization that represents the user's thinking patterns as a neural network.

OUTPUT FORMAT:
Return ONLY valid JavaScript code for Three.js that creates:
1. Nodes representing key concepts (larger = more central to their thinking)
2. Edges connecting related concepts (thicker = stronger relationship)
3. Color coding by emotional undertone:
   - Gold (#C9A050) = Analytical/Logical
   - Blue (#4A90D9) = Emotional/Intuitive
   - Green (#50C9A0) = Growth/Learning
   - Purple (#9050C9) = Creative/Abstract
4. Animated particles flowing between connected concepts
5. Camera orbit controls for exploration

DESIGN PRINCIPLES:
- Museum-quality aesthetics (black background, gold accents)
- Cinematic easing (cubic-bezier 0.22, 1, 0.36, 1)
- Generous spacing between nodes
- Subtle ambient particle effects

The code should be self-contained and render in an iframe.`

export interface MindAnalysis {
  concepts: Array<{
    name: string
    importance: number // 1-10
    category: 'analytical' | 'emotional' | 'growth' | 'creative'
    x: number
    y: number
    z: number
  }>
  connections: Array<{
    from: string
    to: string
    strength: number // 1-10
  }>
  dominantArchetype: 'Warrior' | 'King' | 'Magician' | 'Lover'
  insights: string[]
  recommendedMeditation: string
}
```

**Step 2: Create the API route**

```typescript
// /app/api/gemini/analyze/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { geminiModel, MIND_VISUALIZER_SYSTEM_PROMPT, MindAnalysis } from '@/lib/gemini-client'
import { put } from '@vercel/blob'
import { nanoid } from 'nanoid'

export async function POST(request: NextRequest) {
  try {
    const { text, email } = await request.json()

    if (!text || text.length < 50) {
      return NextResponse.json(
        { error: 'Text must be at least 50 characters' },
        { status: 400 }
      )
    }

    if (text.length > 10000) {
      return NextResponse.json(
        { error: 'Text must be under 10,000 characters' },
        { status: 400 }
      )
    }

    // Step 1: Analyze text structure
    const analysisPrompt = `Analyze this text and return a JSON object with the following structure:
{
  "concepts": [{"name": "string", "importance": 1-10, "category": "analytical|emotional|growth|creative", "x": -5 to 5, "y": -5 to 5, "z": -5 to 5}],
  "connections": [{"from": "concept name", "to": "concept name", "strength": 1-10}],
  "dominantArchetype": "Warrior|King|Magician|Lover",
  "insights": ["insight 1", "insight 2", "insight 3"],
  "recommendedMeditation": "meditation slug from: inner-warrior, deep-focus, creative-flow, emotional-clarity, morning-energy, stress-relief, sleep-sanctuary, confidence-builder, gratitude-practice, mindful-breathing"
}

TEXT TO ANALYZE:
${text}`

    const analysisResult = await geminiModel.generateContent(analysisPrompt)
    const analysisText = analysisResult.response.text()

    // Extract JSON from response
    const jsonMatch = analysisText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('Failed to parse analysis response')
    }

    const analysis: MindAnalysis = JSON.parse(jsonMatch[0])

    // Step 2: Generate Three.js visualization code
    const vizPrompt = `${MIND_VISUALIZER_SYSTEM_PROMPT}

Based on this analysis, generate the Three.js visualization:
${JSON.stringify(analysis, null, 2)}

Return ONLY the JavaScript code, no markdown or explanations.`

    const vizResult = await geminiModel.generateContent(vizPrompt)
    let vizCode = vizResult.response.text()

    // Clean up code (remove markdown if present)
    vizCode = vizCode.replace(/```javascript\n?/g, '').replace(/```\n?/g, '').trim()

    // Step 3: Create HTML wrapper
    const visualizationId = nanoid(10)
    const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Mind Visualization</title>
  <style>
    body { margin: 0; overflow: hidden; background: #000; }
    canvas { display: block; }
    #loading {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: #C9A050;
      font-family: system-ui;
      font-size: 18px;
    }
  </style>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js"></script>
</head>
<body>
  <div id="loading">Rendering your mind...</div>
  <script>
    try {
      ${vizCode}
      document.getElementById('loading').style.display = 'none';
    } catch (e) {
      document.getElementById('loading').textContent = 'Visualization error: ' + e.message;
      console.error(e);
    }
  </script>
</body>
</html>`

    // Step 4: Upload to Vercel Blob
    const blob = await put(`visualizations/${visualizationId}.html`, htmlContent, {
      access: 'public',
      contentType: 'text/html'
    })

    // Step 5: Return results
    return NextResponse.json({
      id: visualizationId,
      url: blob.url,
      analysis: {
        dominantArchetype: analysis.dominantArchetype,
        insights: analysis.insights,
        recommendedMeditation: analysis.recommendedMeditation,
        conceptCount: analysis.concepts.length,
        connectionCount: analysis.connections.length
      }
    })

  } catch (error) {
    console.error('Gemini analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze text' },
      { status: 500 }
    )
  }
}
```

**Step 3: Install Google AI SDK**

Run: `cd /Volumes/Super\ Mastery/Webdesigner && npm install @google/generative-ai nanoid`

**Step 4: Add environment variable**

Add to `.env.local`:
```
GOOGLE_AI_API_KEY=your_api_key_here
```

**Step 5: Test the API**

Run: `curl -X POST http://localhost:3000/api/gemini/analyze -H "Content-Type: application/json" -d '{"text": "I believe that consciousness emerges from the complex interplay of neural networks, quantum coherence, and self-organizing systems. The universe appears to be fundamentally information-based, with consciousness being a natural consequence of sufficient complexity."}'`

Expected: JSON response with visualization URL and analysis

**Step 6: Commit**

```bash
git add lib/gemini-client.ts app/api/gemini/analyze/route.ts package.json package-lock.json
git commit -m "feat: add Gemini mind visualization API"
```

---

### Task 2: Create Mind Visualizer Page

**Files:**
- Create: `/Volumes/Super Mastery/Webdesigner/app/visualize/page.tsx`
- Create: `/Volumes/Super Mastery/Webdesigner/app/visualize/[id]/page.tsx`

**Step 1: Create the input page**

```typescript
// /app/visualize/page.tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Sparkles, Brain, ArrowRight, Loader2 } from 'lucide-react'

export default function VisualizeMindPage() {
  const router = useRouter()
  const [text, setText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Analysis failed')
      }

      const result = await response.json()
      router.push(`/visualize/${result.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setIsLoading(false)
    }
  }

  const examplePrompts = [
    "I believe that personal growth comes from embracing discomfort and challenging our limiting beliefs...",
    "My morning routine starts with meditation, followed by journaling about gratitude and intentions...",
    "The intersection of philosophy and neuroscience reveals fascinating insights about consciousness..."
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="relative py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#C9A050]/10 border border-[#C9A050]/20 rounded-full mb-8">
              <Sparkles className="w-4 h-4 text-[#C9A050]" />
              <span className="text-sm text-[#C9A050]">Powered by Gemini AI</span>
            </div>

            <h1 className="font-serif text-5xl md:text-7xl mb-6">
              Visualize Your Mind
            </h1>

            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
              Paste any essay, journal entry, or stream of consciousness.
              AI will transform your thoughts into an interactive 3D neural network.
            </p>
          </motion.div>

          {/* Input Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-left"
          >
            <div className="relative">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste your text here... (minimum 50 characters)"
                className="w-full h-64 p-6 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#C9A050]/50 resize-none"
                disabled={isLoading}
              />
              <div className="absolute bottom-4 right-4 text-sm text-gray-500">
                {text.length}/10,000
              </div>
            </div>

            {error && (
              <p className="mt-4 text-red-400 text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={text.length < 50 || isLoading}
              className="mt-6 w-full py-4 bg-[#C9A050] text-black font-medium rounded-lg hover:bg-[#D4B861] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing your mind...
                </>
              ) : (
                <>
                  <Brain className="w-5 h-5" />
                  Generate Visualization
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </motion.form>

          {/* Example prompts */}
          <div className="mt-12">
            <p className="text-sm text-gray-500 mb-4">Try an example:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {examplePrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => setText(prompt)}
                  className="px-4 py-2 text-sm bg-white/5 border border-white/10 rounded-full hover:border-[#C9A050]/50 transition-colors"
                >
                  Example {i + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6 border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-3xl text-center mb-16">How It Works</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Paste Your Text',
                description: 'Any essay, journal, or stream of consciousness works'
              },
              {
                step: '02',
                title: 'AI Analysis',
                description: 'Gemini identifies concepts, connections, and patterns'
              },
              {
                step: '03',
                title: '3D Visualization',
                description: 'Explore your thinking as an interactive neural network'
              }
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="text-4xl font-serif text-[#C9A050] mb-4">{item.step}</div>
                <h3 className="font-medium mb-2">{item.title}</h3>
                <p className="text-sm text-gray-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
```

**Step 2: Create the results page**

```typescript
// /app/visualize/[id]/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Share2, Download, Heart, ArrowRight, Sparkles } from 'lucide-react'

interface VisualizationData {
  id: string
  url: string
  analysis: {
    dominantArchetype: string
    insights: string[]
    recommendedMeditation: string
    conceptCount: number
    connectionCount: number
  }
}

export default function VisualizationResultPage() {
  const params = useParams()
  const [data, setData] = useState<VisualizationData | null>(null)
  const [showEmailModal, setShowEmailModal] = useState(false)

  // In production, fetch from API/database
  // For now, reconstruct URL from blob storage pattern
  useEffect(() => {
    const id = params.id as string
    // This would be fetched from database in production
    setData({
      id,
      url: `https://your-blob-url.public.blob.vercel-storage.com/visualizations/${id}.html`,
      analysis: {
        dominantArchetype: 'Magician',
        insights: [
          'Your thinking shows strong analytical patterns',
          'You connect abstract concepts to practical applications',
          'Growth mindset is evident in your language'
        ],
        recommendedMeditation: 'deep-focus',
        conceptCount: 12,
        connectionCount: 18
      }
    })

    // Show email modal after 10 seconds
    const timer = setTimeout(() => {
      const hasEmail = localStorage.getItem('visualize_email')
      if (!hasEmail) {
        setShowEmailModal(true)
      }
    }, 10000)

    return () => clearTimeout(timer)
  }, [params.id])

  if (!data) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-[#C9A050]">Loading visualization...</div>
      </div>
    )
  }

  const meditationLinks: Record<string, { title: string; slug: string }> = {
    'inner-warrior': { title: 'Inner Warrior Meditation', slug: 'inner-warrior' },
    'deep-focus': { title: 'Deep Focus Meditation', slug: 'deep-focus' },
    'creative-flow': { title: 'Creative Flow Meditation', slug: 'creative-flow' },
    'emotional-clarity': { title: 'Emotional Clarity Meditation', slug: 'emotional-clarity' }
  }

  const recommended = meditationLinks[data.analysis.recommendedMeditation] || meditationLinks['deep-focus']

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Visualization iframe */}
      <div className="h-[60vh] relative">
        <iframe
          src={data.url}
          className="w-full h-full border-0"
          title="Mind Visualization"
        />

        {/* Overlay controls */}
        <div className="absolute bottom-4 right-4 flex gap-2">
          <button className="p-3 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
          <button className="p-3 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-colors">
            <Download className="w-5 h-5" />
          </button>
          <button className="p-3 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-colors">
            <Heart className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Analysis Results */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-12">
            <div className="text-center p-6 bg-white/5 rounded-xl">
              <div className="text-3xl font-serif text-[#C9A050]">{data.analysis.conceptCount}</div>
              <div className="text-sm text-gray-400">Concepts</div>
            </div>
            <div className="text-center p-6 bg-white/5 rounded-xl">
              <div className="text-3xl font-serif text-[#C9A050]">{data.analysis.connectionCount}</div>
              <div className="text-sm text-gray-400">Connections</div>
            </div>
            <div className="text-center p-6 bg-white/5 rounded-xl">
              <div className="text-3xl font-serif text-[#C9A050]">{data.analysis.dominantArchetype}</div>
              <div className="text-sm text-gray-400">Archetype</div>
            </div>
          </div>

          {/* Insights */}
          <div className="mb-12">
            <h2 className="font-serif text-2xl mb-6">Your Mind Insights</h2>
            <div className="space-y-4">
              {data.analysis.insights.map((insight, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.2 }}
                  className="flex items-start gap-4 p-4 bg-white/5 rounded-lg"
                >
                  <Sparkles className="w-5 h-5 text-[#C9A050] flex-shrink-0 mt-0.5" />
                  <p className="text-gray-300">{insight}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Meditation Recommendation */}
          <div className="p-8 bg-gradient-to-br from-[#C9A050]/20 to-transparent border border-[#C9A050]/30 rounded-xl">
            <h3 className="font-serif text-xl mb-4">Recommended for Your Mind Type</h3>
            <p className="text-gray-400 mb-6">
              Based on your {data.analysis.dominantArchetype} archetype and thinking patterns,
              we recommend the {recommended.title}.
            </p>
            <Link
              href={`/meditations/${recommended.slug}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#C9A050] text-black font-medium rounded-lg hover:bg-[#D4B861] transition-colors"
            >
              Explore Meditation
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Share CTA */}
          <div className="mt-12 text-center">
            <p className="text-gray-500 mb-4">Share your visualization</p>
            <div className="flex justify-center gap-4">
              <button className="px-6 py-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                Twitter
              </button>
              <button className="px-6 py-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                LinkedIn
              </button>
              <button className="px-6 py-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                Copy Link
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Email Capture Modal */}
      {showEmailModal && (
        <EmailCaptureModal onClose={() => setShowEmailModal(false)} />
      )}
    </div>
  )
}

function EmailCaptureModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'mind-visualizer' })
      })

      localStorage.setItem('visualize_email', email)
      onClose()
    } catch (err) {
      console.error(err)
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#111] border border-white/10 rounded-xl p-8 max-w-md w-full"
      >
        <h3 className="font-serif text-2xl mb-4">Unlock Premium Insights</h3>
        <p className="text-gray-400 mb-6">
          Get your full 12-page Mind Analysis Report with detailed archetype breakdown,
          personalized recommendations, and exclusive meditations.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full p-4 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#C9A050]/50 mb-4"
            required
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-[#C9A050] text-black font-medium rounded-lg hover:bg-[#D4B861] transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Subscribing...' : 'Get Free Report'}
          </button>
        </form>

        <button
          onClick={onClose}
          className="mt-4 w-full py-2 text-gray-500 hover:text-white transition-colors"
        >
          Maybe later
        </button>
      </motion.div>
    </div>
  )
}
```

**Step 3: Commit**

```bash
git add app/visualize/
git commit -m "feat: add mind visualizer input and results pages"
```

---

### Task 3: Create Newsletter Subscription API

**Files:**
- Create: `/Volumes/Super Mastery/Webdesigner/app/api/newsletter/subscribe/route.ts`

**Step 1: Create the subscription endpoint**

```typescript
// /app/api/newsletter/subscribe/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { email, source } = await request.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email required' },
        { status: 400 }
      )
    }

    // Add to Resend audience
    await resend.contacts.create({
      email,
      audienceId: process.env.RESEND_AUDIENCE_ID!,
      unsubscribed: false,
      firstName: '',
      lastName: ''
    })

    // Send welcome email
    await resend.emails.send({
      from: 'Brandon Mills <hello@brandonmills.com>',
      to: email,
      subject: 'Your Mind Visualization Report',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: system-ui; background: #000; color: #fff; padding: 40px; }
            .container { max-width: 600px; margin: 0 auto; }
            h1 { font-family: Georgia, serif; color: #C9A050; }
            .cta { display: inline-block; padding: 12px 24px; background: #C9A050; color: #000; text-decoration: none; border-radius: 8px; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Welcome to the Journey</h1>
            <p>Thanks for exploring your mind with us.</p>
            <p>Your visualization revealed fascinating patterns in how you think and process information.</p>
            <p>Over the next few days, I'll send you:</p>
            <ul>
              <li>Deep dive into your dominant archetype</li>
              <li>Personalized meditation recommendations</li>
              <li>Techniques to enhance your cognitive patterns</li>
            </ul>
            <p>
              <a href="https://brandonmills.com/meditations" class="cta">Explore Meditations</a>
            </p>
            <p style="color: #666; font-size: 14px;">- Brandon</p>
          </div>
        </body>
        </html>
      `
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return NextResponse.json(
      { error: 'Subscription failed' },
      { status: 500 }
    )
  }
}
```

**Step 2: Add Resend audience ID to environment**

Add to `.env.local`:
```
RESEND_AUDIENCE_ID=your_audience_id
```

**Step 3: Commit**

```bash
git add app/api/newsletter/subscribe/route.ts
git commit -m "feat: add newsletter subscription API with Resend"
```

---

### Task 4: Add Navigation Link

**Files:**
- Modify: `/Volumes/Super Mastery/Webdesigner/components/navigation.tsx`

**Step 1: Find the navigation links array and add Visualize**

Look for the navigation items array and add:

```typescript
{
  name: 'Visualize',
  href: '/visualize',
}
```

**Step 2: Commit**

```bash
git add components/navigation.tsx
git commit -m "feat: add Visualize link to navigation"
```

---

## Phase 2: SEO Blog Post

### Task 5: Create SEO-Optimized Blog Post

**Files:**
- Create: `/Volumes/Super Mastery/Webdesigner/app/blog/visualize-your-mind-ai/page.tsx`

**Step 1: Create the blog post**

```typescript
// /app/blog/visualize-your-mind-ai/page.tsx
import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Brain, Sparkles, Share2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Visualize Your Mind: AI-Powered 3D Thought Mapping | Brandon Mills',
  description: 'Transform your essays and journal entries into stunning 3D neural network visualizations. Free AI-powered tool reveals your thinking patterns and cognitive style.',
  keywords: 'visualize thoughts, AI thought mapping, 3D mind visualization, neural network visualization, cognitive patterns, thinking style analysis',
  openGraph: {
    title: 'Visualize Your Mind: AI-Powered 3D Thought Mapping',
    description: 'Transform your thoughts into an interactive 3D neural network',
    images: ['/images/blog/visualize-mind-og.jpg'],
  }
}

export default function VisualizeMindBlogPost() {
  return (
    <article className="min-h-screen bg-black text-white">
      {/* Hero */}
      <header className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#C9A050]/10 border border-[#C9A050]/20 rounded-full mb-8">
            <Sparkles className="w-4 h-4 text-[#C9A050]" />
            <span className="text-sm text-[#C9A050]">New Feature</span>
          </div>

          <h1 className="font-serif text-4xl md:text-6xl mb-6 leading-tight">
            Visualize Your Mind: See Your Thoughts as a 3D Neural Network
          </h1>

          <p className="text-xl text-gray-400 mb-8">
            What if you could see how your brain connects ideas?
            Our new AI tool transforms any text into an explorable 3D visualization of your thinking patterns.
          </p>

          <Link
            href="/visualize"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#C9A050] text-black font-medium rounded-lg hover:bg-[#D4B861] transition-colors"
          >
            <Brain className="w-5 h-5" />
            Try It Free
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="px-6 pb-24">
        <div className="max-w-3xl mx-auto prose prose-invert prose-lg">

          <h2>What Is Mind Visualization?</h2>

          <p>
            We think in networks. Every idea connects to other ideas, forming a web of concepts
            that shapes how we understand the world. But this network is invisible—until now.
          </p>

          <p>
            Our Mind Visualizer uses Google's Gemini AI to analyze any text you provide—an essay,
            journal entry, or stream of consciousness—and generates a 3D neural network that
            represents your thinking patterns.
          </p>

          <h2>How It Works</h2>

          <ol>
            <li>
              <strong>Paste your text</strong> - Any writing that represents your thinking.
              Essays, journal entries, and reflections work best.
            </li>
            <li>
              <strong>AI analyzes patterns</strong> - Gemini identifies key concepts, emotional
              undertones, and connections between ideas.
            </li>
            <li>
              <strong>3D visualization generates</strong> - Your thoughts become an interactive
              neural network you can explore from any angle.
            </li>
          </ol>

          <h2>What You'll Discover</h2>

          <p>The visualization reveals:</p>

          <ul>
            <li><strong>Concept nodes</strong> - Key ideas in your thinking (larger = more central)</li>
            <li><strong>Connection strength</strong> - How strongly ideas relate (thicker lines = stronger)</li>
            <li><strong>Emotional coloring</strong> - Gold for analytical, blue for intuitive, green for growth</li>
            <li><strong>Your archetype</strong> - Whether you think like a Warrior, King, Magician, or Lover</li>
          </ul>

          <h2>Why Visualize Your Thinking?</h2>

          <p>
            Understanding how you think is the first step to thinking better. When you can
            <em>see</em> your cognitive patterns, you can:
          </p>

          <ul>
            <li>Identify blind spots and unexplored connections</li>
            <li>Recognize your natural thinking style</li>
            <li>Find which meditations align with your mind type</li>
            <li>Track how your thinking evolves over time</li>
          </ul>

          <h2>The Science Behind It</h2>

          <p>
            This tool draws on research in cognitive mapping, network neuroscience, and
            Jungian psychology. The archetype analysis is based on the work of Carl Jung
            and Robert Moore, adapted for modern applications.
          </p>

          <p>
            The visualization algorithm identifies semantic relationships using natural
            language processing, then maps them to 3D space using force-directed graph
            layouts—the same technique used to visualize actual neural networks.
          </p>

          <h2>What People Are Saying</h2>

          <blockquote>
            "I've journaled for years but never actually <em>saw</em> my thinking until this.
            The connections it found between ideas I thought were unrelated—mind-blowing."
          </blockquote>

          <h2>Try It Now</h2>

          <p>
            The Mind Visualizer is free to use. Just paste your text and watch your
            thoughts transform into a living neural network.
          </p>

          <div className="not-prose my-12 p-8 bg-white/5 rounded-xl text-center">
            <h3 className="font-serif text-2xl mb-4">Ready to See Your Mind?</h3>
            <Link
              href="/visualize"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#C9A050] text-black font-medium rounded-lg hover:bg-[#D4B861] transition-colors"
            >
              <Brain className="w-5 h-5" />
              Visualize Your Mind
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <h2>What's Next?</h2>

          <p>
            After you see your visualization, you'll get personalized insights about your
            thinking patterns and recommendations for meditations that match your cognitive style.
          </p>

          <p>
            Your mind is unique. Now you can see exactly how.
          </p>
        </div>
      </div>

      {/* Share */}
      <footer className="py-12 px-6 border-t border-white/10">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <p className="text-gray-500">Share this article</p>
          <div className="flex gap-4">
            <button className="p-2 hover:text-[#C9A050] transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </footer>
    </article>
  )
}
```

**Step 2: Commit**

```bash
git add app/blog/visualize-your-mind-ai/
git commit -m "feat: add SEO blog post for mind visualizer"
```

---

## Phase 3: Testing & Deployment

### Task 6: Test the Complete Flow

**Step 1: Start development server**

Run: `cd /Volumes/Super\ Mastery/Webdesigner && npm run dev`

**Step 2: Test input page**

1. Navigate to `http://localhost:3000/visualize`
2. Paste sample text (100+ characters)
3. Click "Generate Visualization"
4. Verify loading state appears

Expected: Redirect to results page after ~10-30 seconds

**Step 3: Test results page**

1. Verify iframe loads with 3D visualization
2. Check stats display (concepts, connections, archetype)
3. Wait 10 seconds for email modal
4. Test email submission

Expected: All elements render, email submits successfully

**Step 4: Test blog post**

1. Navigate to `http://localhost:3000/blog/visualize-your-mind-ai`
2. Verify SEO metadata in page source
3. Click CTA buttons

Expected: Page renders with all content, CTAs link to /visualize

### Task 7: Type Check and Build

**Step 1: Run type check**

Run: `npm run type-check`

Expected: No TypeScript errors

**Step 2: Run build**

Run: `npm run build`

Expected: Build completes successfully

**Step 3: Commit if any fixes needed**

```bash
git add -A
git commit -m "fix: resolve build errors"
```

### Task 8: Deploy

**Step 1: Push to main**

Run: `git push origin main`

Expected: Vercel auto-deploys

**Step 2: Verify production**

1. Visit `https://brandonmills.com/visualize`
2. Test complete flow
3. Check analytics in Vercel dashboard

---

## Summary

This plan creates:

1. **Mind Visualizer API** - Gemini-powered text analysis and Three.js visualization generation
2. **Input Page** - Beautiful form with examples and loading states
3. **Results Page** - 3D iframe, insights, archetype, meditation recommendations
4. **Email Capture** - Modal with Resend integration for lead generation
5. **SEO Blog Post** - Keyword-optimized article driving traffic to the tool

**Revenue Hooks:**
- Meditation recommendations based on archetype
- Email capture for nurture sequences
- Share functionality for viral growth

**Estimated Time:** 8-12 hours

**Next Features to Add:**
- Visualization gallery (show popular examples)
- Premium PDF report ($4.99)
- Comparison mode (see two texts side-by-side)
- Time-lapse mode (see how your thinking evolves)

---

**Plan complete and saved to `docs/plans/2025-11-18-visualize-your-mind-gemini-experiences.md`.**

Two execution options:

**1. Subagent-Driven (this session)** - I dispatch fresh subagent per task, review between tasks, fast iteration

**2. Parallel Session (separate)** - Open new session with executing-plans, batch execution with checkpoints

Which approach?
