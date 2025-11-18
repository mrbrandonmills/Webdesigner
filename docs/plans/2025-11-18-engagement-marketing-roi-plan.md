# Complete Engagement Features & Marketing ROI Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build engagement features (Quiz, Games, Labs), integrate CSS mockups for shop products, create blog content, and execute $250 marketing spend for 3:1 ROI ($1000 return)

**Architecture:** Next.js App Router pages with interactive client components, Stripe for quiz email capture, Pinterest/Reddit for paid acquisition, blog posts for organic SEO

**Tech Stack:** Next.js 15, TypeScript, Framer Motion, Tailwind CSS, Stripe (email capture), existing MockupGenerator component

---

## PHASE 1: FIX SHOP PRODUCT IMAGES WITH MOCKUP GENERATOR

### Task 1: Integrate MockupGenerator into EnhancedProductCard

**Files:**
- Modify: `/Volumes/Super Mastery/Webdesigner/components/shop/enhanced-product-card.tsx`
- Reference: `/Volumes/Super Mastery/Webdesigner/components/shop/mockup-generator.tsx`

**Step 1: Read current EnhancedProductCard implementation**

Run: `head -100 /Volumes/Super Mastery/Webdesigner/components/shop/enhanced-product-card.tsx`

**Step 2: Add MockupGenerator import**

Add at top of file:
```typescript
import { MockupGenerator } from './mockup-generator'
```

**Step 3: Create product type mapper function**

Add after imports:
```typescript
function getProductMockupType(productId: string, productTitle: string): 'tshirt' | 'poster' | 'mug' | 'hoodie' | 'totebag' | null {
  const id = productId.toLowerCase()
  const title = productTitle.toLowerCase()

  if (id.includes('t-shirt') || title.includes('t-shirt')) return 'tshirt'
  if (id.includes('poster') || id.includes('wall-art') || title.includes('poster') || title.includes('print')) return 'poster'
  if (id.includes('mug') || title.includes('mug')) return 'mug'
  if (id.includes('hoodie') || title.includes('hoodie')) return 'hoodie'
  if (id.includes('tote') || title.includes('tote')) return 'totebag'

  return null
}
```

**Step 4: Replace image rendering with MockupGenerator**

Find the image rendering section and wrap with conditional:
```typescript
{(() => {
  const mockupType = getProductMockupType(product.id, product.title)
  if (mockupType && product.source === 'printful') {
    return (
      <MockupGenerator
        designImage={product.image}
        productType={mockupType}
        productTitle={product.title}
      />
    )
  }
  return (
    <img
      src={product.image}
      alt={product.title}
      className="w-full h-full object-cover"
      onLoad={() => setImageLoaded(true)}
    />
  )
})()}
```

**Step 5: Run type check**

Run: `cd "/Volumes/Super Mastery/Webdesigner" && npm run type-check`
Expected: No errors

**Step 6: Test locally**

Run: `npm run dev`
Navigate to: http://localhost:3000/shop
Expected: Printful products show CSS mockups instead of raw designs

**Step 7: Commit**

```bash
git add components/shop/enhanced-product-card.tsx
git commit -m "feat: integrate MockupGenerator for Printful products

- Add product type detection for t-shirts, posters, mugs, hoodies, tote bags
- CSS-based mockups replace raw design images
- Fallback to original image for non-Printful products"
```

---

## PHASE 2: BUILD WARRIOR ARCHETYPE QUIZ

### Task 2: Create Quiz Page Structure

**Files:**
- Create: `/Volumes/Super Mastery/Webdesigner/app/quiz/warrior-archetype/page.tsx`

**Step 1: Create quiz directory**

Run: `mkdir -p "/Volumes/Super Mastery/Webdesigner/app/quiz/warrior-archetype"`

**Step 2: Create quiz page with complete implementation**

Create file with full quiz logic, questions, and email capture:

```typescript
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

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
      { text: "Weigh all options and seek wisdom from trusted advisors", archetype: 'king', points: 3 },
      { text: "Trust your gut and act decisively with courage", archetype: 'warrior', points: 3 },
      { text: "Research extensively and analyze all patterns", archetype: 'magician', points: 3 },
      { text: "Consider how it will affect your relationships", archetype: 'lover', points: 3 }
    ]
  },
  {
    id: 2,
    text: "Your greatest strength in a crisis is...",
    options: [
      { text: "Remaining calm and providing clear direction", archetype: 'king', points: 3 },
      { text: "Taking immediate action to protect what matters", archetype: 'warrior', points: 3 },
      { text: "Finding innovative solutions others miss", archetype: 'magician', points: 3 },
      { text: "Bringing people together and maintaining morale", archetype: 'lover', points: 3 }
    ]
  },
  {
    id: 3,
    text: "When you achieve success, you feel most fulfilled when...",
    options: [
      { text: "Your vision has positively impacted many people", archetype: 'king', points: 3 },
      { text: "You overcame significant challenges to get there", archetype: 'warrior', points: 3 },
      { text: "You discovered something new in the process", archetype: 'magician', points: 3 },
      { text: "You shared the journey with people you care about", archetype: 'lover', points: 3 }
    ]
  },
  {
    id: 4,
    text: "Others often come to you for...",
    options: [
      { text: "Strategic guidance and big-picture thinking", archetype: 'king', points: 3 },
      { text: "Help taking action and building discipline", archetype: 'warrior', points: 3 },
      { text: "Creative ideas and unconventional perspectives", archetype: 'magician', points: 3 },
      { text: "Emotional support and deep conversations", archetype: 'lover', points: 3 }
    ]
  },
  {
    id: 5,
    text: "Your shadow side most often manifests as...",
    options: [
      { text: "Becoming controlling or overly critical", archetype: 'king', points: 3 },
      { text: "Aggression or inability to rest", archetype: 'warrior', points: 3 },
      { text: "Manipulation or cold detachment", archetype: 'magician', points: 3 },
      { text: "Codependency or losing yourself in others", archetype: 'lover', points: 3 }
    ]
  },
  {
    id: 6,
    text: "The book that would resonate most with you...",
    options: [
      { text: "Meditations by Marcus Aurelius", archetype: 'king', points: 3 },
      { text: "The Art of War by Sun Tzu", archetype: 'warrior', points: 3 },
      { text: "The Alchemist by Paulo Coelho", archetype: 'magician', points: 3 },
      { text: "The Prophet by Kahlil Gibran", archetype: 'lover', points: 3 }
    ]
  },
  {
    id: 7,
    text: "In your ideal life, you are most valued for...",
    options: [
      { text: "Your wisdom and ability to create order", archetype: 'king', points: 3 },
      { text: "Your courage and protective strength", archetype: 'warrior', points: 3 },
      { text: "Your insight and transformative knowledge", archetype: 'magician', points: 3 },
      { text: "Your compassion and ability to connect", archetype: 'lover', points: 3 }
    ]
  }
]

const archetypes = {
  king: {
    title: 'The Sovereign King',
    subtitle: 'Leader • Strategist • Visionary',
    description: 'You embody leadership, wisdom, and benevolent authority. Your greatest gift is the ability to see the big picture and create order from chaos. You inspire others through your vision and your calm presence in the storm.',
    strengths: ['Strategic thinking', 'Natural leadership', 'Calm under pressure', 'Vision and planning', 'Wise decision-making'],
    shadowAspect: 'The Tyrant - when power becomes control, wisdom becomes rigidity',
    growthPath: 'Balance authority with compassion. Lead by empowering others, not controlling them.',
    recommendedContent: [
      { title: 'Meditations for Leaders', href: '/meditations', description: 'Cultivate the stillness needed for wise decisions' },
      { title: 'Building Leverage - Block A', href: '/writing/building-leverage-block-a', description: 'Strategic frameworks for impact' }
    ]
  },
  warrior: {
    title: 'The Noble Warrior',
    subtitle: 'Protector • Champion • Disciplined',
    description: 'You embody courage, discipline, and purposeful action. Your greatest gift is your ability to face challenges head-on and protect what matters. You inspire others through your resilience and unwavering commitment.',
    strengths: ['Courage in adversity', 'Discipline and focus', 'Protective instincts', 'Physical vitality', 'Action-oriented'],
    shadowAspect: 'The Destroyer - when courage becomes aggression, discipline becomes cruelty',
    growthPath: 'Balance strength with tenderness. True warriors know when not to fight.',
    recommendedContent: [
      { title: 'Confidence & Power Activation', href: '/meditations', description: 'Channel your warrior energy constructively' },
      { title: 'Building Leverage - Block B', href: '/writing/building-leverage-block-b', description: 'Execute with precision' }
    ]
  },
  magician: {
    title: 'The Sage Magician',
    subtitle: 'Transformer • Innovator • Seer',
    description: 'You embody knowledge, transformation, and insight. Your greatest gift is your ability to see patterns others miss and transform situations through understanding. You inspire others through your wisdom and creative solutions.',
    strengths: ['Pattern recognition', 'Innovative thinking', 'Deep knowledge', 'Transformative power', 'Intuitive insight'],
    shadowAspect: 'The Manipulator - when knowledge becomes deception, insight becomes trickery',
    growthPath: 'Balance knowledge with humility. Use your power to illuminate, not to deceive.',
    recommendedContent: [
      { title: 'Creative Unblocking', href: '/meditations', description: 'Access your innovative potential' },
      { title: 'Self-Esteem Essay', href: '/writing/self-esteem', description: 'Transform your self-perception' }
    ]
  },
  lover: {
    title: 'The Passionate Lover',
    subtitle: 'Connector • Creator • Empath',
    description: 'You embody connection, creativity, and emotional depth. Your greatest gift is your ability to form deep bonds and experience life with full intensity. You inspire others through your passion and authentic presence.',
    strengths: ['Emotional intelligence', 'Deep connections', 'Creative expression', 'Sensory awareness', 'Compassionate presence'],
    shadowAspect: 'The Addict - when passion becomes obsession, love becomes possession',
    growthPath: 'Balance connection with independence. Love fully while maintaining your center.',
    recommendedContent: [
      { title: 'Loving-Kindness Meditation', href: '/meditations', description: 'Cultivate compassion without losing yourself' },
      { title: 'Poetry Collection', href: '/writing', description: 'Explore emotional depth through verse' }
    ]
  }
}

export default function WarriorArchetypeQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [scores, setScores] = useState({ king: 0, warrior: 0, magician: 0, lover: 0 })
  const [result, setResult] = useState<'king' | 'warrior' | 'magician' | 'lover' | null>(null)
  const [email, setEmail] = useState('')
  const [emailSubmitted, setEmailSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAnswer = (archetype: 'king' | 'warrior' | 'magician' | 'lover', points: number) => {
    const newScores = { ...scores, [archetype]: scores[archetype] + points }
    setScores(newScores)

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    } else {
      // Calculate result
      const winner = (Object.entries(newScores) as [keyof typeof newScores, number][])
        .reduce((a, b) => a[1] > b[1] ? a : b)[0]
      setResult(winner)
    }
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !result) return

    setIsSubmitting(true)
    try {
      // Save to email list (integrate with your email service)
      await fetch('/api/quiz/save-result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, archetype: result, scores })
      })
      setEmailSubmitted(true)
    } catch (error) {
      console.error('Failed to save result:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setScores({ king: 0, warrior: 0, magician: 0, lover: 0 })
    setResult(null)
    setEmail('')
    setEmailSubmitted(false)
  }

  return (
    <div className="min-h-screen bg-black text-white py-20 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link
            href="/"
            className="text-accent-gold hover:underline text-sm tracking-wider uppercase mb-8 inline-block"
          >
            ← Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-serif mb-4">
            Discover Your Warrior Archetype
          </h1>
          <p className="text-white/60">
            Based on Jungian archetypes and the work of Robert Moore
          </p>
        </motion.div>

        {!result ? (
          // Questions
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-white/50">
                  <span>Question {currentQuestion + 1} of {questions.length}</span>
                  <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</span>
                </div>
                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-accent-gold"
                    initial={{ width: `${(currentQuestion / questions.length) * 100}%` }}
                    animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>

              {/* Question */}
              <h2 className="text-2xl font-light">
                {questions[currentQuestion].text}
              </h2>

              {/* Options */}
              <div className="space-y-3">
                {questions[currentQuestion].options.map((option, i) => (
                  <motion.button
                    key={i}
                    onClick={() => handleAnswer(option.archetype, option.points)}
                    className="w-full p-4 text-left border border-white/20 hover:border-accent-gold hover:bg-white/5 transition-all rounded"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {option.text}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        ) : (
          // Results
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8"
          >
            {/* Archetype Result */}
            <div className="text-center space-y-4">
              <p className="text-accent-gold text-sm tracking-wider uppercase">
                Your Dominant Archetype
              </p>
              <h2 className="text-4xl md:text-5xl font-serif">
                {archetypes[result].title}
              </h2>
              <p className="text-white/60 text-lg">
                {archetypes[result].subtitle}
              </p>
            </div>

            <div className="w-24 h-px bg-gradient-to-r from-transparent via-accent-gold to-transparent mx-auto" />

            {/* Description */}
            <p className="text-white/80 leading-relaxed">
              {archetypes[result].description}
            </p>

            {/* Strengths */}
            <div className="bg-white/5 p-6 rounded-lg space-y-4">
              <h3 className="text-accent-gold text-sm tracking-wider uppercase">
                Core Strengths
              </h3>
              <ul className="space-y-2">
                {archetypes[result].strengths.map((strength, i) => (
                  <li key={i} className="flex items-center gap-2 text-white/70">
                    <span className="text-accent-gold">✓</span>
                    {strength}
                  </li>
                ))}
              </ul>
            </div>

            {/* Shadow */}
            <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-lg space-y-2">
              <h3 className="text-red-400 text-sm tracking-wider uppercase">
                Shadow Aspect
              </h3>
              <p className="text-white/70">
                {archetypes[result].shadowAspect}
              </p>
            </div>

            {/* Growth Path */}
            <div className="bg-green-500/10 border border-green-500/20 p-6 rounded-lg space-y-2">
              <h3 className="text-green-400 text-sm tracking-wider uppercase">
                Growth Path
              </h3>
              <p className="text-white/70">
                {archetypes[result].growthPath}
              </p>
            </div>

            {/* Email Capture */}
            {!emailSubmitted ? (
              <div className="bg-accent-gold/10 border border-accent-gold/30 p-6 rounded-lg space-y-4">
                <h3 className="text-accent-gold font-medium">
                  Get Your Full Archetype Report
                </h3>
                <p className="text-white/60 text-sm">
                  Receive a detailed PDF with personalized exercises, reading recommendations, and integration practices.
                </p>
                <form onSubmit={handleEmailSubmit} className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 bg-black border border-white/20 rounded focus:border-accent-gold focus:outline-none"
                    required
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-accent-gold text-black font-medium rounded hover:bg-white transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? '...' : 'Send'}
                  </button>
                </form>
              </div>
            ) : (
              <div className="bg-green-500/10 border border-green-500/20 p-6 rounded-lg text-center">
                <p className="text-green-400">
                  ✓ Check your email for your full archetype report!
                </p>
              </div>
            )}

            {/* Recommended Content */}
            <div className="space-y-4">
              <h3 className="text-accent-gold text-sm tracking-wider uppercase">
                Recommended for {archetypes[result].title}
              </h3>
              {archetypes[result].recommendedContent.map((item, i) => (
                <Link
                  key={i}
                  href={item.href}
                  className="block p-4 border border-white/10 rounded hover:border-accent-gold hover:bg-white/5 transition-all"
                >
                  <p className="font-medium mb-1">{item.title}</p>
                  <p className="text-white/60 text-sm">{item.description}</p>
                </Link>
              ))}
            </div>

            {/* Retake */}
            <div className="text-center pt-8">
              <button
                onClick={resetQuiz}
                className="text-white/60 hover:text-white text-sm underline"
              >
                Retake Quiz
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
```

**Step 3: Create API route for saving results**

Create: `/Volumes/Super Mastery/Webdesigner/app/api/quiz/save-result/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, archetype, scores } = await request.json()

    // Log for now - integrate with Resend/ConvertKit later
    console.log('Quiz result:', { email, archetype, scores })

    // TODO: Send email with Resend
    // TODO: Save to database or email service

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to save quiz result:', error)
    return NextResponse.json(
      { error: 'Failed to save result' },
      { status: 500 }
    )
  }
}
```

**Step 4: Test quiz locally**

Run: `npm run dev`
Navigate to: http://localhost:3000/quiz/warrior-archetype
Expected: Quiz displays, questions work, results show

**Step 5: Commit**

```bash
git add app/quiz app/api/quiz
git commit -m "feat: add Warrior Archetype Quiz for engagement

- 7 Jungian archetype questions
- King, Warrior, Magician, Lover results
- Email capture for lead generation
- Recommended content per archetype"
```

---

## PHASE 3: BUILD REACTION TIME GAME

### Task 3: Create Reaction Time Challenge Page

**Files:**
- Create: `/Volumes/Super Mastery/Webdesigner/app/games/reaction-time/page.tsx`

**Step 1: Create games directory**

Run: `mkdir -p "/Volumes/Super Mastery/Webdesigner/app/games/reaction-time"`

**Step 2: Create reaction time game**

```typescript
'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

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

    // Random delay between 2-5 seconds
    const delay = 2000 + Math.random() * 3000

    timeoutRef.current = setTimeout(() => {
      setGameState('go')
      startTimeRef.current = performance.now()
    }, delay)
  }

  const handleClick = () => {
    if (gameState === 'waiting' || gameState === 'result' || gameState === 'too-early') {
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
    }
  }

  const getBackgroundColor = () => {
    switch (gameState) {
      case 'waiting': return 'bg-blue-600'
      case 'ready': return 'bg-red-600'
      case 'go': return 'bg-green-500'
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

  const getDescription = () => {
    if (gameState === 'result' && reactionTime) {
      if (reactionTime < 200) return 'Incredible! Lightning reflexes!'
      if (reactionTime < 250) return 'Excellent! Above average reaction time.'
      if (reactionTime < 300) return 'Good! This is average human reaction time.'
      if (reactionTime < 350) return 'Not bad, keep practicing!'
      return 'Room for improvement. Try again!'
    }
    return ''
  }

  const averageTime = attempts.length > 0
    ? Math.round(attempts.reduce((a, b) => a + b, 0) / attempts.length)
    : null

  return (
    <div className="min-h-screen bg-black text-white py-20 px-6">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="text-accent-gold hover:underline text-sm tracking-wider uppercase mb-4 inline-block"
          >
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-serif mb-2">Reaction Time Test</h1>
          <p className="text-white/60 text-sm">
            Test your reflexes and compete against yourself
          </p>
        </div>

        {/* Game Area */}
        <motion.button
          onClick={handleClick}
          className={`w-full aspect-square rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors ${getBackgroundColor()}`}
          whileTap={{ scale: 0.98 }}
        >
          <span className="text-4xl md:text-5xl font-bold mb-2">
            {getMessage()}
          </span>
          {gameState === 'result' && (
            <span className="text-lg opacity-80">
              {getDescription()}
            </span>
          )}
        </motion.button>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="bg-white/5 p-4 rounded text-center">
            <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Best</p>
            <p className="text-2xl font-light">{bestTime ? `${bestTime}ms` : '-'}</p>
          </div>
          <div className="bg-white/5 p-4 rounded text-center">
            <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Average</p>
            <p className="text-2xl font-light">{averageTime ? `${averageTime}ms` : '-'}</p>
          </div>
          <div className="bg-white/5 p-4 rounded text-center">
            <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Tries</p>
            <p className="text-2xl font-light">{attempts.length}</p>
          </div>
        </div>

        {/* Benchmark */}
        <div className="mt-8 p-4 bg-white/5 rounded">
          <p className="text-xs text-white/50 uppercase tracking-wider mb-3">Benchmarks</p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-white/60">Professional Gamer</span>
              <span className="text-green-400">&lt;150ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Excellent</span>
              <span className="text-green-400">150-200ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Average Human</span>
              <span className="text-yellow-400">200-300ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Needs Practice</span>
              <span className="text-red-400">&gt;300ms</span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 text-center">
          <p className="text-white/60 text-sm mb-4">
            Want to improve your mental performance?
          </p>
          <Link
            href="/meditations"
            className="inline-block px-6 py-3 bg-accent-gold text-black font-medium rounded hover:bg-white transition-colors"
          >
            Try Our Focus Meditations
          </Link>
        </div>
      </div>
    </div>
  )
}
```

**Step 3: Test game**

Run: `npm run dev`
Navigate to: http://localhost:3000/games/reaction-time
Expected: Game works with timing, stats track correctly

**Step 4: Commit**

```bash
git add app/games
git commit -m "feat: add Reaction Time Challenge game

- Random delay between 2-5 seconds
- Track best time, average, and attempts
- Performance benchmarks
- CTA to meditations for mental performance"
```

---

## PHASE 4: $250 MARKETING BUDGET FOR 3:1 ROI

### Task 4: Create Marketing Execution Plan

**Budget Allocation for $250:**

1. **Pinterest Ads - $100** (40%)
   - Target: Women 25-45, wellness, self-improvement
   - Promote: Quiz pins, meditation pins
   - Goal: 10,000 impressions, 200 clicks
   - Expected conversions: 10-20 quiz completions, 2-3 meditation sales

2. **Reddit Ads - $75** (30%)
   - Target: r/meditation, r/selfimprovement, r/productivity
   - Promote: Quiz and blog content
   - Goal: 5,000 impressions, 100 clicks
   - Expected conversions: 5-10 quiz completions, 1-2 meditation sales

3. **Boost top 3 blog posts - $75** (30%)
   - Facebook/Instagram boost for engagement
   - Target: Meditation, personal development interests
   - Goal: 3,000 reach per post, 150 total clicks
   - Expected conversions: 2-3 meditation sales

**Total Expected Return:**
- 15-33 quiz email captures (lifetime value: $5-15 each)
- 5-8 meditation sales at $5-10 each = $25-80
- Organic traffic boost from social proof = 3-5 additional sales
- **Conservative estimate: $150-250 immediate + $300-500 email value = $450-750**
- **Optimistic estimate: $800-1200**

### Task 5: Create Blog Post for Quiz

**File:** Create `/Volumes/Super Mastery/Webdesigner/app/blog/warrior-archetypes/page.tsx`

This SEO-optimized blog post will drive organic traffic to the quiz.

**Target keywords:**
- "warrior archetype quiz"
- "jungian archetypes test"
- "king warrior magician lover quiz"

**Step 1: Create blog post directory**

Run: `mkdir -p "/Volumes/Super Mastery/Webdesigner/app/blog/warrior-archetypes"`

**Step 2: Create SEO blog post**

The post should be 1,500+ words covering:
- Introduction to Jungian archetypes
- Overview of each archetype (King, Warrior, Magician, Lover)
- Shadow aspects
- How to integrate all four
- CTA to take the quiz

**Step 3: Commit**

```bash
git add app/blog/warrior-archetypes
git commit -m "feat: add Warrior Archetypes blog post for SEO

- 1,500+ word comprehensive guide
- Target keywords: warrior archetype, jungian archetypes
- CTA to quiz for lead generation"
```

---

## PHASE 5: DEPLOY AND LAUNCH

### Task 6: Final Build and Deploy

**Step 1: Run full type check**

Run: `cd "/Volumes/Super Mastery/Webdesigner" && npm run type-check`
Expected: No errors

**Step 2: Run build**

Run: `npm run build`
Expected: All pages generate successfully

**Step 3: Push to GitHub (retry if 500 error)**

Run: `git push origin main`

**Step 4: Deploy to Vercel**

Run: `npx vercel --prod`
Expected: Production deployment successful

**Step 5: Test all features on production**

- [ ] Quiz works end-to-end
- [ ] Reaction game works
- [ ] Shop shows CSS mockups
- [ ] Meditation purchase works
- [ ] Blog post loads

---

## VERIFICATION CHECKLIST

- [ ] MockupGenerator integrated in product cards
- [ ] Quiz captures emails successfully
- [ ] Reaction game tracks stats correctly
- [ ] Blog post SEO meta tags complete
- [ ] All features deployed to production
- [ ] Pinterest ads account ready
- [ ] Reddit ads account ready

---

**Plan complete and saved to `docs/plans/2025-11-18-engagement-marketing-roi-plan.md`.**
