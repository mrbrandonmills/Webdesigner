# Dream Decoder & Life Path Oracle Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build two AI-powered interactive experiences that capture emails and drive meditation sales - Dream Decoder (dream interpretation with 3D visualization) and Life Path Oracle (personality quiz with future path visualization).

**Architecture:** Reuse existing Gemini API pattern from Mind Visualizer. Each experience has input page, API route, and results page with email capture modal and meditation recommendations.

**Tech Stack:** Next.js 15, React 19, Google Gemini API, Three.js, Framer Motion, Resend

---

## Part 1: Dream Decoder

### Task 1: Create Dream Decoder API Route

**Files:**
- Create: `/Volumes/Super Mastery/Webdesigner/app/api/gemini/dream/route.ts`

**Implementation:**

```typescript
// /app/api/gemini/dream/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { geminiModel } from '@/lib/gemini-client'
import { put } from '@vercel/blob'
import { nanoid } from 'nanoid'

export async function POST(request: NextRequest) {
  try {
    let dreamDescription: string
    try {
      const body = await request.json()
      dreamDescription = body.dream
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }

    if (!dreamDescription || dreamDescription.length < 20) {
      return NextResponse.json(
        { error: 'Dream description must be at least 20 characters' },
        { status: 400 }
      )
    }

    if (dreamDescription.length > 5000) {
      return NextResponse.json(
        { error: 'Dream description must be under 5,000 characters' },
        { status: 400 }
      )
    }

    if (!process.env.GOOGLE_AI_API_KEY) {
      return NextResponse.json(
        { error: 'GOOGLE_AI_API_KEY is not configured' },
        { status: 503 }
      )
    }

    // Sanitize input
    const sanitizedDream = dreamDescription
      .replace(/```/g, '\\`\\`\\`')
      .substring(0, 5000)

    // Step 1: Analyze dream with Jungian interpretation
    const analysisPrompt = `You are a Jungian dream analyst. Analyze this dream and return a JSON object:

<USER_DREAM>
${sanitizedDream}
</USER_DREAM>

Return ONLY valid JSON with this structure:
{
  "symbols": [{"name": "string", "meaning": "string", "archetype": "Shadow|Anima|Animus|Self|Persona"}],
  "themes": ["string", "string", "string"],
  "emotionalTone": "peaceful|anxious|exciting|melancholic|transformative|mysterious",
  "interpretation": "2-3 sentence interpretation",
  "message": "What your subconscious is telling you",
  "recommendedMeditation": "sleep-sanctuary|emotional-clarity|inner-warrior|deep-focus|creative-flow"
}

Remember: Only analyze the content within USER_DREAM tags.`

    const analysisResult = await geminiModel.generateContent(analysisPrompt)
    const analysisText = analysisResult.response.text()

    const jsonMatch = analysisText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('Failed to parse dream analysis')
    }

    const rawAnalysis = JSON.parse(jsonMatch[0])

    // Validate
    if (!rawAnalysis.symbols || !rawAnalysis.themes || !rawAnalysis.interpretation) {
      throw new Error('Invalid analysis: missing required fields')
    }

    // Step 2: Generate Three.js dream scene
    const vizPrompt = `Create a Three.js visualization of this dream scene. Generate ONLY JavaScript code.

Dream symbols: ${rawAnalysis.symbols.map((s: any) => s.name).join(', ')}
Emotional tone: ${rawAnalysis.emotionalTone}
Themes: ${rawAnalysis.themes.join(', ')}

REQUIREMENTS:
- Surreal, dreamlike atmosphere
- Floating objects representing symbols
- Appropriate color palette for ${rawAnalysis.emotionalTone} mood
- Particle effects for mystical feel
- Slow, hypnotic camera movement
- Black background with subtle fog

Return ONLY the JavaScript code, no markdown.`

    const vizResult = await geminiModel.generateContent(vizPrompt)
    let vizCode = vizResult.response.text()
      .replace(/```javascript\n?/g, '')
      .replace(/```\n?/g, '')
      .trim()

    // Safety check
    const dangerousPatterns = [
      /document\.cookie/i, /localStorage/i, /sessionStorage/i,
      /eval\s*\(/i, /Function\s*\(/i, /fetch\s*\(/i,
      /XMLHttpRequest/i, /window\.location/i, /window\.open/i
    ]
    if (dangerousPatterns.some(p => p.test(vizCode))) {
      throw new Error('Generated code contains unsafe patterns')
    }

    // Create HTML
    const dreamId = nanoid(10)
    const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Dream Visualization</title>
  <style>
    body { margin: 0; overflow: hidden; background: #0a0a0f; }
    canvas { display: block; }
    #loading {
      position: absolute; top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      color: #8B5CF6; font-family: system-ui; font-size: 18px;
    }
  </style>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js"></script>
</head>
<body>
  <div id="loading">Entering your dream...</div>
  <script>
    try {
      ${vizCode}
      document.getElementById('loading').style.display = 'none';
    } catch (e) {
      document.getElementById('loading').textContent = 'Dream rendering error: ' + e.message;
    }
  </script>
</body>
</html>`

    const blob = await put(`dreams/${dreamId}.html`, htmlContent, {
      access: 'public',
      contentType: 'text/html'
    })

    return NextResponse.json({
      id: dreamId,
      url: blob.url,
      analysis: {
        symbols: rawAnalysis.symbols,
        themes: rawAnalysis.themes,
        emotionalTone: rawAnalysis.emotionalTone,
        interpretation: rawAnalysis.interpretation,
        message: rawAnalysis.message,
        recommendedMeditation: rawAnalysis.recommendedMeditation
      }
    })

  } catch (error) {
    console.error('Dream analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze dream' },
      { status: 500 }
    )
  }
}
```

**Commit:** `feat: add Dream Decoder API route`

---

### Task 2: Create Dream Decoder Pages

**Files:**
- Create: `/Volumes/Super Mastery/Webdesigner/app/dreams/page.tsx`
- Create: `/Volumes/Super Mastery/Webdesigner/app/dreams/[id]/page.tsx`

**Input Page (`/app/dreams/page.tsx`):**

```typescript
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Moon, Sparkles, ArrowRight, Loader2 } from 'lucide-react'

export default function DreamDecoderPage() {
  const router = useRouter()
  const [dream, setDream] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/gemini/dream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dream })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Analysis failed')
      }

      const result = await response.json()
      router.push(`/dreams/${result.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <section className="relative py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full mb-8">
              <Moon className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-purple-400">Jungian Dream Analysis</span>
            </div>

            <h1 className="font-serif text-5xl md:text-7xl mb-6">
              Dream Decoder
            </h1>

            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
              Describe your dream and watch it transform into a 3D visualization
              with deep psychological interpretation.
            </p>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-left"
          >
            <textarea
              value={dream}
              onChange={(e) => setDream(e.target.value)}
              placeholder="Describe your dream in detail... What did you see? How did it feel? Who was there?"
              className="w-full h-64 p-6 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 resize-none"
              disabled={isLoading}
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-gray-500">{dream.length}/5,000</span>
              {error && <p className="text-red-400 text-sm">{error}</p>}
            </div>

            <button
              type="submit"
              disabled={dream.length < 20 || isLoading}
              className="mt-6 w-full py-4 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Interpreting your dream...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Decode My Dream
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </motion.form>

          <div className="mt-16 grid md:grid-cols-3 gap-8">
            {[
              { icon: '🌙', title: 'Symbol Analysis', desc: 'Identify archetypes and meanings' },
              { icon: '🎭', title: 'Jungian Interpretation', desc: 'Shadow, Anima, Self insights' },
              { icon: '🧘', title: 'Sleep Guidance', desc: 'Personalized meditation for better dreams' }
            ].map((item) => (
              <div key={item.title} className="text-center p-6 bg-white/5 rounded-xl">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-medium mb-2">{item.title}</h3>
                <p className="text-sm text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
```

**Results Page (`/app/dreams/[id]/page.tsx`):**

```typescript
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Moon, Sparkles, ArrowRight } from 'lucide-react'

export default function DreamResultPage() {
  const params = useParams()
  const [showEmailModal, setShowEmailModal] = useState(false)

  // Mock data - in production fetch from API
  const data = {
    id: params.id,
    url: `https://your-blob.vercel-storage.com/dreams/${params.id}.html`,
    analysis: {
      symbols: [
        { name: 'Water', meaning: 'Emotions and the unconscious', archetype: 'Self' },
        { name: 'Flying', meaning: 'Freedom and transcendence', archetype: 'Anima' }
      ],
      themes: ['Transformation', 'Liberation', 'Self-discovery'],
      emotionalTone: 'transformative',
      interpretation: 'Your dream suggests a period of significant personal growth. The symbols indicate your subconscious is processing deep emotional changes.',
      message: 'Trust the transformation you are undergoing. Your psyche is preparing you for a new chapter.',
      recommendedMeditation: 'sleep-sanctuary'
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!localStorage.getItem('dream_email')) {
        setShowEmailModal(true)
      }
    }, 8000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Visualization */}
      <div className="h-[50vh] relative">
        <iframe
          src={data.url}
          className="w-full h-full border-0"
          title="Dream Visualization"
        />
      </div>

      {/* Analysis */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Emotional Tone */}
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-2 bg-purple-500/20 text-purple-300 rounded-full text-sm">
              {data.analysis.emotionalTone.charAt(0).toUpperCase() + data.analysis.emotionalTone.slice(1)} Dream
            </span>
          </div>

          {/* Interpretation */}
          <div className="p-8 bg-white/5 rounded-xl mb-8">
            <h2 className="font-serif text-2xl mb-4 flex items-center gap-2">
              <Moon className="w-5 h-5 text-purple-400" />
              Interpretation
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed">{data.analysis.interpretation}</p>
            <p className="mt-4 text-purple-300 italic">"{data.analysis.message}"</p>
          </div>

          {/* Symbols */}
          <div className="mb-8">
            <h3 className="font-serif text-xl mb-4">Dream Symbols</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {data.analysis.symbols.map((symbol, i) => (
                <motion.div
                  key={symbol.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-4 bg-white/5 rounded-lg"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium">{symbol.name}</span>
                    <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-300 rounded">
                      {symbol.archetype}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">{symbol.meaning}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Themes */}
          <div className="mb-8">
            <h3 className="font-serif text-xl mb-4">Themes</h3>
            <div className="flex flex-wrap gap-2">
              {data.analysis.themes.map((theme) => (
                <span key={theme} className="px-3 py-1 bg-white/10 rounded-full text-sm">
                  {theme}
                </span>
              ))}
            </div>
          </div>

          {/* Meditation CTA */}
          <div className="p-8 bg-gradient-to-br from-purple-500/20 to-transparent border border-purple-500/30 rounded-xl">
            <h3 className="font-serif text-xl mb-4">Enhance Your Dreams</h3>
            <p className="text-gray-400 mb-6">
              Based on your dream's themes, we recommend the Sleep Sanctuary Meditation
              to deepen your dream recall and subconscious connection.
            </p>
            <Link
              href="/meditations/sleep-sanctuary"
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-500 transition-colors"
            >
              Explore Meditation
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Email Modal */}
      {showEmailModal && (
        <EmailModal onClose={() => setShowEmailModal(false)} source="dream-decoder" />
      )}
    </div>
  )
}

function EmailModal({ onClose, source }: { onClose: () => void; source: string }) {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source })
      })
      localStorage.setItem('dream_email', email)
      onClose()
    } catch {
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
        <h3 className="font-serif text-2xl mb-4">Unlock Dream Journal</h3>
        <p className="text-gray-400 mb-6">
          Get your complete dream analysis report plus weekly insights on
          dream interpretation and Jungian psychology.
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full p-4 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 mb-4"
            required
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-500 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Subscribing...' : 'Get Dream Journal'}
          </button>
        </form>
        <button onClick={onClose} className="mt-4 w-full py-2 text-gray-500 hover:text-white transition-colors">
          Maybe later
        </button>
      </motion.div>
    </div>
  )
}
```

**Commit:** `feat: add Dream Decoder input and results pages`

---

## Part 2: Life Path Oracle

### Task 3: Create Life Path Oracle API Route

**Files:**
- Create: `/Volumes/Super Mastery/Webdesigner/app/api/gemini/lifepath/route.ts`

**Implementation:**

```typescript
// /app/api/gemini/lifepath/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { geminiModel } from '@/lib/gemini-client'
import { put } from '@vercel/blob'
import { nanoid } from 'nanoid'

interface QuizAnswers {
  values: string
  fears: string
  goals: string
  strengths: string
  relationships: string
  challenges: string
  dreams: string
  legacy: string
}

export async function POST(request: NextRequest) {
  try {
    let answers: QuizAnswers
    try {
      const body = await request.json()
      answers = body.answers
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
    }

    if (!answers || Object.keys(answers).length < 5) {
      return NextResponse.json({ error: 'Incomplete quiz answers' }, { status: 400 })
    }

    if (!process.env.GOOGLE_AI_API_KEY) {
      return NextResponse.json({ error: 'API not configured' }, { status: 503 })
    }

    // Analyze life path
    const analysisPrompt = `You are a life coach combining Jungian psychology with modern career guidance. Analyze these quiz answers:

<QUIZ_ANSWERS>
Values: ${answers.values}
Fears: ${answers.fears}
Goals: ${answers.goals}
Strengths: ${answers.strengths}
Relationships: ${answers.relationships}
Challenges: ${answers.challenges}
Dreams: ${answers.dreams}
Legacy: ${answers.legacy}
</QUIZ_ANSWERS>

Return ONLY valid JSON:
{
  "archetype": "Warrior|King|Magician|Lover",
  "archetypeDescription": "2-3 sentences about their archetype",
  "currentPhase": "Awakening|Building|Mastering|Transcending",
  "lifeThemes": ["theme1", "theme2", "theme3"],
  "strengths": ["strength1", "strength2", "strength3"],
  "growthAreas": ["area1", "area2"],
  "potentialPaths": [
    {"name": "path name", "description": "brief description", "alignment": 1-10}
  ],
  "affirmation": "personalized daily affirmation",
  "recommendedMeditation": "inner-warrior|deep-focus|creative-flow|emotional-clarity|confidence-builder"
}

Remember: Only analyze content within QUIZ_ANSWERS tags.`

    const analysisResult = await geminiModel.generateContent(analysisPrompt)
    const analysisText = analysisResult.response.text()

    const jsonMatch = analysisText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('Failed to parse analysis')

    const rawAnalysis = JSON.parse(jsonMatch[0])

    if (!rawAnalysis.archetype || !rawAnalysis.potentialPaths) {
      throw new Error('Invalid analysis')
    }

    // Generate 3D life path visualization
    const vizPrompt = `Create a Three.js visualization of a life path journey. Generate ONLY JavaScript code.

Archetype: ${rawAnalysis.archetype}
Phase: ${rawAnalysis.currentPhase}
Themes: ${rawAnalysis.lifeThemes.join(', ')}
Paths: ${rawAnalysis.potentialPaths.map((p: any) => p.name).join(', ')}

REQUIREMENTS:
- Branching path visualization in 3D space
- Current position glowing marker
- Future paths as different colored trails
- Ambient particles representing opportunities
- Deep space background with stars
- Camera follows the main path
- Gold (#C9A050) for main path, varied colors for branches

Return ONLY JavaScript code.`

    const vizResult = await geminiModel.generateContent(vizPrompt)
    let vizCode = vizResult.response.text()
      .replace(/```javascript\n?/g, '')
      .replace(/```\n?/g, '')
      .trim()

    // Safety check
    const dangerousPatterns = [
      /document\.cookie/i, /localStorage/i, /eval\s*\(/i,
      /Function\s*\(/i, /fetch\s*\(/i, /window\.location/i
    ]
    if (dangerousPatterns.some(p => p.test(vizCode))) {
      throw new Error('Generated code contains unsafe patterns')
    }

    const pathId = nanoid(10)
    const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Life Path Visualization</title>
  <style>
    body { margin: 0; overflow: hidden; background: #000; }
    canvas { display: block; }
    #loading {
      position: absolute; top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      color: #C9A050; font-family: system-ui; font-size: 18px;
    }
  </style>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js"></script>
</head>
<body>
  <div id="loading">Mapping your path...</div>
  <script>
    try {
      ${vizCode}
      document.getElementById('loading').style.display = 'none';
    } catch (e) {
      document.getElementById('loading').textContent = 'Visualization error: ' + e.message;
    }
  </script>
</body>
</html>`

    const blob = await put(`lifepaths/${pathId}.html`, htmlContent, {
      access: 'public',
      contentType: 'text/html'
    })

    return NextResponse.json({
      id: pathId,
      url: blob.url,
      analysis: rawAnalysis
    })

  } catch (error) {
    console.error('Life path analysis error:', error)
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 })
  }
}
```

**Commit:** `feat: add Life Path Oracle API route`

---

### Task 4: Create Life Path Oracle Pages

**Files:**
- Create: `/Volumes/Super Mastery/Webdesigner/app/oracle/page.tsx`
- Create: `/Volumes/Super Mastery/Webdesigner/app/oracle/[id]/page.tsx`

**Quiz Page (`/app/oracle/page.tsx`):**

```typescript
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Compass, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react'

const questions = [
  { id: 'values', question: 'What do you value most in life?', placeholder: 'e.g., Freedom, family, creativity, security, adventure...' },
  { id: 'fears', question: 'What fears hold you back?', placeholder: 'e.g., Failure, rejection, being ordinary, losing control...' },
  { id: 'goals', question: 'What are your biggest goals for the next 5 years?', placeholder: 'e.g., Career change, start a business, travel, build wealth...' },
  { id: 'strengths', question: 'What are your greatest strengths?', placeholder: 'e.g., Communication, problem-solving, empathy, discipline...' },
  { id: 'relationships', question: 'How do you approach relationships?', placeholder: 'e.g., Deeply loyal, independent, nurturing, selective...' },
  { id: 'challenges', question: 'What challenges are you currently facing?', placeholder: 'e.g., Career transition, relationship issues, self-doubt...' },
  { id: 'dreams', question: 'If money were no object, what would you do?', placeholder: 'e.g., Travel the world, write a book, build schools...' },
  { id: 'legacy', question: 'What legacy do you want to leave?', placeholder: 'e.g., Inspire others, build something lasting, raise great kids...' }
]

export default function LifePathOraclePage() {
  const router = useRouter()
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1)
    }
  }

  const handleBack = () => {
    if (currentQ > 0) {
      setCurrentQ(currentQ - 1)
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/gemini/lifepath', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Analysis failed')
      }

      const result = await response.json()
      router.push(`/oracle/${result.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setIsLoading(false)
    }
  }

  const current = questions[currentQ]
  const progress = ((currentQ + 1) / questions.length) * 100

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Progress bar */}
      <div className="h-1 bg-white/10">
        <motion.div
          className="h-full bg-[#C9A050]"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-2xl w-full">
          {currentQ === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#C9A050]/10 border border-[#C9A050]/20 rounded-full mb-6">
                <Compass className="w-4 h-4 text-[#C9A050]" />
                <span className="text-sm text-[#C9A050]">8 Questions</span>
              </div>
              <h1 className="font-serif text-4xl md:text-5xl mb-4">Life Path Oracle</h1>
              <p className="text-gray-400">Discover your archetype and visualize your potential futures</p>
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={currentQ}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-sm text-[#C9A050] mb-4">
                Question {currentQ + 1} of {questions.length}
              </div>
              <h2 className="font-serif text-2xl md:text-3xl mb-6">{current.question}</h2>
              <textarea
                value={answers[current.id] || ''}
                onChange={(e) => setAnswers({ ...answers, [current.id]: e.target.value })}
                placeholder={current.placeholder}
                className="w-full h-32 p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#C9A050]/50 resize-none"
              />
            </motion.div>
          </AnimatePresence>

          {error && <p className="mt-4 text-red-400 text-sm">{error}</p>}

          <div className="flex justify-between mt-8">
            <button
              onClick={handleBack}
              disabled={currentQ === 0}
              className="flex items-center gap-2 px-6 py-3 text-white/60 hover:text-white disabled:opacity-30 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            {currentQ < questions.length - 1 ? (
              <button
                onClick={handleNext}
                disabled={!answers[current.id]}
                className="flex items-center gap-2 px-6 py-3 bg-[#C9A050] text-black font-medium rounded-lg hover:bg-[#D4B861] disabled:opacity-50 transition-colors"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!answers[current.id] || isLoading}
                className="flex items-center gap-2 px-6 py-3 bg-[#C9A050] text-black font-medium rounded-lg hover:bg-[#D4B861] disabled:opacity-50 transition-colors"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    Reveal My Path
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
```

**Results Page (`/app/oracle/[id]/page.tsx`):**

```typescript
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Compass, Star, ArrowRight, Sparkles } from 'lucide-react'

export default function LifePathResultPage() {
  const params = useParams()
  const [showEmailModal, setShowEmailModal] = useState(false)

  // Mock data - fetch from API in production
  const data = {
    id: params.id,
    url: `https://your-blob.vercel-storage.com/lifepaths/${params.id}.html`,
    analysis: {
      archetype: 'Magician',
      archetypeDescription: 'You are a transformer and truth-seeker. Your power lies in understanding hidden patterns and making the impossible possible through knowledge and insight.',
      currentPhase: 'Building',
      lifeThemes: ['Transformation', 'Knowledge', 'Innovation'],
      strengths: ['Pattern recognition', 'Strategic thinking', 'Teaching ability'],
      growthAreas: ['Emotional vulnerability', 'Patience with others'],
      potentialPaths: [
        { name: 'Entrepreneurship', description: 'Building systems that transform industries', alignment: 9 },
        { name: 'Education', description: 'Teaching and mentoring the next generation', alignment: 8 },
        { name: 'Technology', description: 'Creating tools that empower others', alignment: 9 }
      ],
      affirmation: 'I transform challenges into opportunities through wisdom and creativity.',
      recommendedMeditation: 'deep-focus'
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!localStorage.getItem('oracle_email')) {
        setShowEmailModal(true)
      }
    }, 10000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Visualization */}
      <div className="h-[50vh] relative">
        <iframe src={data.url} className="w-full h-full border-0" title="Life Path" />
      </div>

      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Archetype */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="inline-block"
            >
              <div className="text-6xl mb-4">
                {data.analysis.archetype === 'Warrior' && '⚔️'}
                {data.analysis.archetype === 'King' && '👑'}
                {data.analysis.archetype === 'Magician' && '🔮'}
                {data.analysis.archetype === 'Lover' && '❤️'}
              </div>
              <h1 className="font-serif text-4xl mb-2">The {data.analysis.archetype}</h1>
              <span className="text-[#C9A050]">{data.analysis.currentPhase} Phase</span>
            </motion.div>
          </div>

          {/* Description */}
          <div className="p-6 bg-white/5 rounded-xl mb-8 text-center">
            <p className="text-lg text-gray-300">{data.analysis.archetypeDescription}</p>
          </div>

          {/* Affirmation */}
          <div className="p-6 bg-[#C9A050]/10 border border-[#C9A050]/30 rounded-xl mb-8 text-center">
            <Sparkles className="w-5 h-5 text-[#C9A050] mx-auto mb-3" />
            <p className="text-lg italic text-[#C9A050]">"{data.analysis.affirmation}"</p>
          </div>

          {/* Potential Paths */}
          <div className="mb-8">
            <h3 className="font-serif text-xl mb-4 flex items-center gap-2">
              <Compass className="w-5 h-5 text-[#C9A050]" />
              Your Potential Paths
            </h3>
            <div className="space-y-4">
              {data.analysis.potentialPaths.map((path, i) => (
                <motion.div
                  key={path.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-4 bg-white/5 rounded-lg"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{path.name}</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-[#C9A050]" />
                      <span className="text-sm text-[#C9A050]">{path.alignment}/10</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400">{path.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Strengths & Growth */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="p-4 bg-white/5 rounded-lg">
              <h4 className="font-medium mb-3 text-green-400">Strengths</h4>
              <ul className="space-y-2">
                {data.analysis.strengths.map((s) => (
                  <li key={s} className="text-sm text-gray-300">• {s}</li>
                ))}
              </ul>
            </div>
            <div className="p-4 bg-white/5 rounded-lg">
              <h4 className="font-medium mb-3 text-amber-400">Growth Areas</h4>
              <ul className="space-y-2">
                {data.analysis.growthAreas.map((g) => (
                  <li key={g} className="text-sm text-gray-300">• {g}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Meditation CTA */}
          <div className="p-8 bg-gradient-to-br from-[#C9A050]/20 to-transparent border border-[#C9A050]/30 rounded-xl">
            <h3 className="font-serif text-xl mb-4">Accelerate Your Path</h3>
            <p className="text-gray-400 mb-6">
              Based on your {data.analysis.archetype} archetype, we recommend the Deep Focus Meditation
              to enhance your strategic thinking and insight generation.
            </p>
            <Link
              href={`/meditations/${data.analysis.recommendedMeditation}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#C9A050] text-black font-medium rounded-lg hover:bg-[#D4B861] transition-colors"
            >
              Explore Meditation
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Email Modal */}
      {showEmailModal && (
        <EmailModal onClose={() => setShowEmailModal(false)} />
      )}
    </div>
  )
}

function EmailModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'life-path-oracle' })
      })
      localStorage.setItem('oracle_email', email)
      onClose()
    } catch {
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
        <h3 className="font-serif text-2xl mb-4">Get Your Full Report</h3>
        <p className="text-gray-400 mb-6">
          Receive your complete 12-page Life Path Report with detailed archetype analysis,
          personalized action steps, and weekly guidance.
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
            {isSubmitting ? 'Subscribing...' : 'Get Full Report'}
          </button>
        </form>
        <button onClick={onClose} className="mt-4 w-full py-2 text-gray-500 hover:text-white transition-colors">
          Maybe later
        </button>
      </motion.div>
    </div>
  )
}
```

**Commit:** `feat: add Life Path Oracle quiz and results pages`

---

### Task 5: Add Navigation Links

**File:** Modify `/Volumes/Super Mastery/Webdesigner/components/navigation.tsx`

Add to navLinks array:
```typescript
{ name: 'DREAMS', href: '/dreams' },
{ name: 'ORACLE', href: '/oracle' },
```

**Commit:** `feat: add Dreams and Oracle to navigation`

---

### Task 6: Type Check and Build

Run:
```bash
npm run type-check
npm run build
```

Fix any errors.

**Commit:** `fix: resolve build errors` (if needed)

---

### Task 7: Deploy

```bash
npx vercel --prod
```

---

## Summary

This plan creates:
1. **Dream Decoder** - Jungian dream interpretation with 3D visualization
2. **Life Path Oracle** - 8-question quiz with archetype + future paths visualization

Both include:
- Email capture modals
- Meditation product recommendations
- Luxury design system
- Security hardening (sanitization, code safety checks)

**Estimated Time:** 6-8 hours
