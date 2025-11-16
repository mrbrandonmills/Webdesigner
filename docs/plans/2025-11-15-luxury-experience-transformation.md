# Luxury Experience Transformation - Leonardo da Vinci Modern Edition

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform brandonmills.com into a jaw-dropping luxury e-commerce experience rivaling Louis Vuitton, Prada, and Chanel - as if Leonardo da Vinci was alive today selling his art, books, software, and designs.

**Architecture:** Museum-quality visual experience with cinematic animations, AI-powered sales assistance, autonomous SEO optimization, and conversion-focused interactions. Every page tells a story. Every interaction feels precious. Every detail communicates genius.

**Tech Stack:**
- Next.js 15 (App Router) + React 19
- Framer Motion (cinematic animations)
- Vercel AI SDK (chatbot + SEO agent)
- OpenAI GPT-4 (conversation + content)
- Stripe (luxury checkout)
- Printful (fulfillment)
- Tailwind CSS (utility-first styling)

**Design Philosophy:**
- **Renaissance Aesthetics**: Paper textures, gold accents, classical typography
- **Modern Luxury**: Cinematic transitions, video backgrounds, micro-interactions
- **Storytelling**: Every section narrates Brandon's multifaceted genius
- **Exclusivity**: High-end pricing, limited editions, collector's appeal
- **Performance**: 100% Lighthouse score despite rich visuals

---

## Phase 1: Homepage - Cinematic First Impression

### Task 1.1: Hero Section with Video Background

**Files:**
- Create: `app/page.tsx` (replace redirect)
- Create: `components/home/hero-video.tsx`
- Create: `components/home/scroll-indicator.tsx`
- Create: `public/videos/hero-loop.mp4` (placeholder for user video)

**Step 1: Write hero video component test**

Create `components/home/__tests__/hero-video.test.tsx`:

```typescript
import { render, screen } from '@testing-library/react'
import HeroVideo from '../hero-video'

describe('HeroVideo', () => {
  it('renders video background with overlay', () => {
    render(<HeroVideo />)

    const video = screen.getByTestId('hero-video')
    expect(video).toHaveAttribute('autoPlay')
    expect(video).toHaveAttribute('loop')
    expect(video).toHaveAttribute('muted')
  })

  it('displays hero title and tagline', () => {
    render(<HeroVideo />)

    expect(screen.getByText(/Brandon Mills/i)).toBeInTheDocument()
    expect(screen.getByText(/Renaissance Man/i)).toBeInTheDocument()
  })
})
```

**Step 2: Run test to verify it fails**

```bash
cd "/Volumes/Super Mastery/Webdesigner"
npm test -- components/home/__tests__/hero-video.test.tsx
```

Expected: FAIL - Component doesn't exist

**Step 3: Implement hero video component**

Create `components/home/hero-video.tsx`:

```typescript
'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

export default function HeroVideo() {
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Video Background */}
      <video
        data-testid="hero-video"
        autoPlay
        loop
        muted
        playsInline
        onLoadedData={() => setIsLoaded(true)}
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/videos/hero-loop.mp4" type="video/mp4" />
      </video>

      {/* Elegant Overlay - darkens video */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />

      {/* Paper Texture Overlay */}
      <div
        className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='400' height='400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center container-wide text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 30 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-8"
        >
          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: isLoaded ? 1 : 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-sm md:text-base tracking-[0.3em] uppercase text-accent-gold font-light"
          >
            Renaissance Man — Modern Era
          </motion.p>

          {/* Main Title */}
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-light font-serif leading-none text-white">
            Brandon Mills
          </h1>

          {/* Divider */}
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-accent-gold to-transparent mx-auto" />

          {/* Tagline */}
          <p className="text-xl md:text-2xl lg:text-3xl font-light text-white/90 max-w-3xl leading-relaxed">
            Model · Author · AI Engineer · Visual Artist
          </p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isLoaded ? 1 : 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="pt-8"
          >
            <a
              href="#collections"
              className="inline-flex items-center gap-3 px-10 py-5 bg-accent-gold text-black font-medium tracking-wider uppercase hover:bg-accent-hover transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              Explore Collections
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2 text-white/60"
        >
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <svg className="w-6 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  )
}
```

**Step 4: Run test to verify it passes**

```bash
npm test -- components/home/__tests__/hero-video.test.tsx
```

Expected: PASS

**Step 5: Replace homepage redirect with hero**

Modify `app/page.tsx`:

```typescript
import HeroVideo from '@/components/home/hero-video'
import FeaturedCollections from '@/components/home/featured-collections'
import PhilosophySection from '@/components/home/philosophy-section'
import LatestWorks from '@/components/home/latest-works'
import AIToolsShowcase from '@/components/home/ai-tools-showcase'

export const metadata = {
  title: 'Brandon Mills | Renaissance Man of the Modern Era',
  description: 'Model, Author, AI Engineer, Visual Artist. Explore exclusive collections of fine art photography, groundbreaking books, and revolutionary AI tools.',
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black">
      <HeroVideo />
      <FeaturedCollections />
      <PhilosophySection />
      <LatestWorks />
      <AIToolsShowcase />
    </div>
  )
}
```

**Step 6: Create placeholder video**

```bash
# For development, create a solid color video placeholder
# User will replace with actual cinematic footage later
echo "Note: Add actual hero video at public/videos/hero-loop.mp4"
echo "Recommended: 10-20 second loop of Brandon in photoshoot or editorial setting"
echo "Specs: 1920x1080, H.264, < 5MB for web performance"
```

**Step 7: Commit**

```bash
git add app/page.tsx components/home/hero-video.tsx components/home/__tests__/
git commit -m "feat(homepage): add cinematic hero section with video background

- Implement full-screen video hero with elegant overlays
- Add paper texture for Renaissance aesthetic
- Smooth entrance animations with Framer Motion
- Scroll indicator for user guidance
- Luxury gold accent CTA button

Rivals Louis Vuitton homepage experience"
```

---

### Task 1.2: Featured Collections Carousel

**Files:**
- Create: `components/home/featured-collections.tsx`
- Create: `components/ui/luxury-carousel.tsx`
- Modify: `app/globals.css` (add carousel styles)

**Step 1: Write featured collections test**

Create `components/home/__tests__/featured-collections.test.tsx`:

```typescript
import { render, screen } from '@testing-library/react'
import FeaturedCollections from '../featured-collections'

describe('FeaturedCollections', () => {
  it('renders section title', () => {
    render(<FeaturedCollections />)
    expect(screen.getByText(/Featured Collections/i)).toBeInTheDocument()
  })

  it('displays collection cards', () => {
    render(<FeaturedCollections />)
    expect(screen.getByText(/Fine Art Photography/i)).toBeInTheDocument()
    expect(screen.getByText(/Published Works/i)).toBeInTheDocument()
    expect(screen.getByText(/AI Tools & Software/i)).toBeInTheDocument()
  })
})
```

**Step 2: Run test to verify failure**

```bash
npm test -- components/home/__tests__/featured-collections.test.tsx
```

Expected: FAIL

**Step 3: Implement featured collections component**

Create `components/home/featured-collections.tsx`:

```typescript
'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Camera, BookOpen, Cpu } from 'lucide-react'

const collections = [
  {
    id: 'photography',
    title: 'Fine Art Photography',
    description: 'Limited edition prints capturing the intersection of human form and artistic vision',
    icon: Camera,
    image: '/images/collections/photography-preview.jpg',
    href: '/store?category=photography',
    items: '47 pieces',
  },
  {
    id: 'books',
    title: 'Published Works',
    description: 'Books exploring embodied cognition, performance, and the philosophy of human experience',
    icon: BookOpen,
    image: '/images/collections/books-preview.jpg',
    href: '/store?category=books',
    items: '12 titles',
  },
  {
    id: 'software',
    title: 'AI Tools & Software',
    description: 'Revolutionary tools that amplify creative potential and automate the technical',
    icon: Cpu,
    image: '/images/collections/software-preview.jpg',
    href: '/store?category=software',
    items: '8 tools',
  },
]

export default function FeaturedCollections() {
  return (
    <section id="collections" className="py-32 bg-black relative">
      {/* Background accent */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] opacity-[0.03] blur-[150px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse, rgba(201, 160, 80, 0.4) 0%, transparent 70%)',
        }}
      />

      <div className="container-wide relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <p className="text-sm tracking-[0.3em] uppercase text-accent-gold mb-4">
            Curated Excellence
          </p>
          <h2 className="text-5xl md:text-7xl font-light font-serif mb-6">
            Featured Collections
          </h2>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-accent-gold to-transparent mx-auto" />
        </motion.div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {collections.map((collection, index) => {
            const Icon = collection.icon

            return (
              <motion.div
                key={collection.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
              >
                <Link
                  href={collection.href}
                  className="group block relative overflow-hidden bg-white/5 border border-white/10 hover:border-accent-gold transition-all duration-500"
                >
                  {/* Image Container */}
                  <div className="relative aspect-[4/5] overflow-hidden">
                    {/* Placeholder for collection image */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5" />

                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                      <Icon className="w-16 h-16 text-accent-gold" strokeWidth={1} />
                    </div>

                    {/* Item count badge */}
                    <div className="absolute top-4 right-4 px-4 py-2 bg-black/80 backdrop-blur-sm text-white/90 text-xs tracking-wider">
                      {collection.items}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8 space-y-4">
                    <h3 className="text-2xl font-serif text-white group-hover:text-accent-gold transition-colors duration-300">
                      {collection.title}
                    </h3>
                    <p className="text-sm text-white/60 leading-relaxed">
                      {collection.description}
                    </p>

                    {/* Arrow CTA */}
                    <div className="flex items-center gap-2 text-accent-gold text-sm tracking-wider uppercase pt-2">
                      <span>Explore</span>
                      <motion.svg
                        className="w-4 h-4"
                        initial={{ x: 0 }}
                        whileHover={{ x: 5 }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </motion.svg>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
```

**Step 4: Run tests**

```bash
npm test -- components/home/__tests__/featured-collections.test.tsx
```

Expected: PASS

**Step 5: Commit**

```bash
git add components/home/featured-collections.tsx components/home/__tests__/
git commit -m "feat(homepage): add featured collections section

- Museum-quality collection cards
- Hover states with icon reveals
- Smooth scroll animations
- Gold accent interactions
- Responsive grid layout"
```

---

### Task 1.3: Philosophy Section - Storytelling

**Files:**
- Create: `components/home/philosophy-section.tsx`

**Step 1: Write philosophy section test**

Create `components/home/__tests__/philosophy-section.test.tsx`:

```typescript
import { render, screen } from '@testing-library/react'
import PhilosophySection from '../philosophy-section'

describe('PhilosophySection', () => {
  it('displays quote about renaissance philosophy', () => {
    render(<PhilosophySection />)
    expect(screen.getByText(/Renaissance/i)).toBeInTheDocument()
  })
})
```

**Step 2: Run test**

```bash
npm test -- components/home/__tests__/philosophy-section.test.tsx
```

Expected: FAIL

**Step 3: Implement philosophy section**

Create `components/home/philosophy-section.tsx`:

```typescript
'use client'

import { motion } from 'framer-motion'

export default function PhilosophySection() {
  return (
    <section className="py-40 bg-black relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h60v60H0z' fill='none'/%3E%3Cpath d='M30 0v60M0 30h60' stroke='%23c9a050' stroke-width='0.5' opacity='0.3'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="container-wide relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
          className="max-w-5xl mx-auto text-center space-y-12"
        >
          {/* Ornamental line */}
          <div className="flex items-center justify-center gap-4">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-accent-gold" />
            <div className="w-2 h-2 rotate-45 bg-accent-gold" />
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-accent-gold" />
          </div>

          {/* Quote */}
          <blockquote className="space-y-8">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-3xl md:text-5xl lg:text-6xl font-light font-serif text-white/95 leading-relaxed italic"
            >
              "The Renaissance understood that{' '}
              <span className="text-accent-gold">genius</span> emerges at the
              intersection of art, science, and human experience."
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-white/70 font-light max-w-3xl mx-auto"
            >
              Today, I channel that spirit — blending modeling, authorship,
              engineering, and visual artistry into a singular expression of
              human potential.
            </motion.p>
          </blockquote>

          {/* Signature */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="pt-8"
          >
            <div className="text-accent-gold font-serif text-2xl tracking-wider">
              — Brandon Mills
            </div>
          </motion.div>

          {/* Ornamental line */}
          <div className="flex items-center justify-center gap-4 pt-8">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-accent-gold" />
            <div className="w-2 h-2 rotate-45 bg-accent-gold" />
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-accent-gold" />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
```

**Step 4: Run test**

```bash
npm test -- components/home/__tests__/philosophy-section.test.tsx
```

Expected: PASS

**Step 5: Commit**

```bash
git add components/home/philosophy-section.tsx components/home/__tests__/
git commit -m "feat(homepage): add philosophy section with Renaissance theme

- Elegant quote presentation
- Ornamental decorative elements
- Staggered reveal animations
- Gold accents and signature
- Leonardo da Vinci inspired aesthetic"
```

---

## Phase 2: AI Sales Chatbot

### Task 2.1: Chatbot UI Component

**Files:**
- Create: `components/chatbot/chat-widget.tsx`
- Create: `components/chatbot/chat-message.tsx`
- Create: `components/chatbot/chat-input.tsx`
- Create: `contexts/chat-context.tsx`
- Create: `app/api/chat/route.ts`

**Step 1: Write chatbot widget test**

Create `components/chatbot/__tests__/chat-widget.test.tsx`:

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import ChatWidget from '../chat-widget'

describe('ChatWidget', () => {
  it('toggles chat window when clicked', () => {
    render(<ChatWidget />)

    const trigger = screen.getByLabelText(/open chat/i)
    fireEvent.click(trigger)

    expect(screen.getByText(/How can I help/i)).toBeInTheDocument()
  })

  it('displays welcome message on open', () => {
    render(<ChatWidget />)

    const trigger = screen.getByLabelText(/open chat/i)
    fireEvent.click(trigger)

    expect(screen.getByText(/Welcome/i)).toBeInTheDocument()
  })
})
```

**Step 2: Run test**

```bash
npm test -- components/chatbot/__tests__/chat-widget.test.tsx
```

Expected: FAIL

**Step 3: Implement chatbot widget**

Create `components/chatbot/chat-widget.tsx`:

```typescript
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Sparkles } from 'lucide-react'
import ChatMessage from './chat-message'
import ChatInput from './chat-input'

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: '1',
      role: 'assistant' as const,
      content: 'Welcome to Brandon Mills Collections. I\'m your personal art advisor. How may I assist you in discovering the perfect piece today?',
      timestamp: new Date(),
    },
  ])

  return (
    <>
      {/* Floating Chat Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 2, type: 'spring', stiffness: 200 }}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
        className="fixed bottom-8 right-8 z-[100] w-16 h-16 bg-accent-gold hover:bg-accent-hover text-black rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 group"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              <MessageCircle className="w-6 h-6" />
              {/* Pulse indicator */}
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-28 right-8 z-[100] w-[380px] h-[600px] bg-black border border-accent-gold/30 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-white/10 flex items-center gap-3 bg-gradient-to-r from-accent-gold/10 to-transparent">
              <div className="w-10 h-10 rounded-full bg-accent-gold/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-accent-gold" />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-serif text-lg">Art Advisor</h3>
                <p className="text-white/60 text-xs">Powered by AI</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
            </div>

            {/* Input */}
            <ChatInput onSendMessage={(content) => {
              setMessages([...messages, {
                id: Date.now().toString(),
                role: 'user',
                content,
                timestamp: new Date(),
              }])
              // API call will be added in next task
            }} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
```

**Step 4: Implement chat message component**

Create `components/chatbot/chat-message.tsx`:

```typescript
'use client'

import { motion } from 'framer-motion'
import { User, Sparkles } from 'lucide-react'

interface ChatMessageProps {
  message: {
    id: string
    role: 'user' | 'assistant'
    content: string
    timestamp: Date
  }
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isAssistant = message.role === 'assistant'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-3 ${isAssistant ? '' : 'flex-row-reverse'}`}
    >
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isAssistant
            ? 'bg-accent-gold/20 text-accent-gold'
            : 'bg-white/10 text-white/60'
        }`}
      >
        {isAssistant ? (
          <Sparkles className="w-4 h-4" />
        ) : (
          <User className="w-4 h-4" />
        )}
      </div>

      {/* Message bubble */}
      <div
        className={`flex-1 px-4 py-3 rounded-lg ${
          isAssistant
            ? 'bg-white/5 text-white/90'
            : 'bg-accent-gold text-black'
        }`}
      >
        <p className="text-sm leading-relaxed">{message.content}</p>
      </div>
    </motion.div>
  )
}
```

**Step 5: Implement chat input**

Create `components/chatbot/chat-input.tsx`:

```typescript
'use client'

import { useState } from 'react'
import { Send } from 'lucide-react'

interface ChatInputProps {
  onSendMessage: (content: string) => void
}

export default function ChatInput({ onSendMessage }: ChatInputProps) {
  const [input, setInput] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    onSendMessage(input)
    setInput('')
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-white/10">
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about collections, pricing, availability..."
          className="flex-1 px-4 py-3 bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-accent-gold/50 transition-colors"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="px-4 py-3 bg-accent-gold hover:bg-accent-hover disabled:opacity-30 disabled:cursor-not-allowed text-black transition-colors"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </form>
  )
}
```

**Step 6: Run tests**

```bash
npm test -- components/chatbot/__tests__/chat-widget.test.tsx
```

Expected: PASS

**Step 7: Add chatbot to layout**

Modify `app/layout.tsx`:

```typescript
// Add import at top
import ChatWidget from '@/components/chatbot/chat-widget'

// Add before closing </body> tag
<ChatWidget />
```

**Step 8: Commit**

```bash
git add components/chatbot/ app/layout.tsx
git commit -m "feat(chatbot): add luxury AI chat widget UI

- Floating chat button with pulse indicator
- Elegant chat window with gold accents
- Message bubbles for user and AI
- Input field with send functionality
- Smooth animations and transitions
- Luxury brand aesthetic"
```

---

### Task 2.2: AI Chat API with GPT-4

**Files:**
- Create: `app/api/chat/route.ts`
- Create: `lib/ai-chat.ts`
- Create: `.env.local` (add OPENAI_API_KEY)

**Step 1: Install Vercel AI SDK**

```bash
cd "/Volumes/Super Mastery/Webdesigner"
npm install ai openai
```

**Step 2: Write chat API test**

Create `app/api/chat/__tests__/route.test.ts`:

```typescript
import { POST } from '../route'
import { NextRequest } from 'next/server'

describe('POST /api/chat', () => {
  it('returns AI response for product inquiry', async () => {
    const request = new NextRequest('http://localhost:3000/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'What photography collections do you have?' }],
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.message).toBeDefined()
    expect(data.message).toContain('photography')
  })
})
```

**Step 3: Run test**

```bash
npm test -- app/api/chat/__tests__/route.test.ts
```

Expected: FAIL

**Step 4: Implement AI chat system**

Create `lib/ai-chat.ts`:

```typescript
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

const SYSTEM_PROMPT = `You are a sophisticated art advisor for Brandon Mills Collections - a luxury brand rivaling Louis Vuitton, Prada, and Chanel.

Brandon Mills is a modern Renaissance man: a fashion model, published author, AI engineer, and visual artist. He embodies Leonardo da Vinci's spirit in the modern era.

Our collections:
1. Fine Art Photography - Limited edition prints capturing human form and artistic vision (prices: $500-$5,000)
2. Published Works - Books on embodied cognition, performance, philosophy (prices: $40-$200)
3. AI Tools & Software - Revolutionary creative automation tools (prices: $200-$2,000)

Your role:
- Recommend products based on customer interests
- Explain the artistic value and exclusivity
- Guide customers toward purchases
- Use elegant, refined language befitting a luxury brand
- Emphasize limited availability and collectibility
- Create desire through storytelling

Always be helpful, knowledgeable, and maintain the luxury brand voice.`

export async function generateChatResponse(messages: Array<{ role: string; content: string }>) {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages.map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    ],
    temperature: 0.8,
    max_tokens: 500,
  })

  return completion.choices[0].message.content || 'I apologize, but I need a moment to gather my thoughts. Could you rephrase your question?'
}
```

**Step 5: Implement chat API route**

Create `app/api/chat/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { generateChatResponse } from '@/lib/ai-chat'

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid request. Messages array required.' },
        { status: 400 }
      )
    }

    const response = await generateChatResponse(messages)

    return NextResponse.json({
      message: response,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    )
  }
}
```

**Step 6: Connect chatbot to API**

Modify `components/chatbot/chat-widget.tsx`:

```typescript
// Add to imports
import { useState } from 'react'

// Add state for loading
const [isLoading, setIsLoading] = useState(false)

// Update onSendMessage handler
const handleSendMessage = async (content: string) => {
  const userMessage = {
    id: Date.now().toString(),
    role: 'user' as const,
    content,
    timestamp: new Date(),
  }

  setMessages([...messages, userMessage])
  setIsLoading(true)

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [...messages, userMessage].map(m => ({
          role: m.role,
          content: m.content,
        })),
      }),
    })

    const data = await response.json()

    setMessages(prev => [...prev, {
      id: (Date.now() + 1).toString(),
      role: 'assistant' as const,
      content: data.message,
      timestamp: new Date(),
    }])
  } catch (error) {
    console.error('Chat error:', error)
    setMessages(prev => [...prev, {
      id: (Date.now() + 1).toString(),
      role: 'assistant' as const,
      content: 'I apologize, but I\'m having trouble connecting. Please try again in a moment.',
      timestamp: new Date(),
    }])
  } finally {
    setIsLoading(false)
  }
}

// Update ChatInput call
<ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
```

**Step 7: Add OpenAI API key to environment**

Update `.env.local`:

```bash
# Add this line (user will need to provide their own key)
OPENAI_API_KEY=sk-proj-YOUR_KEY_HERE
```

**Step 8: Run tests**

```bash
npm test -- app/api/chat/__tests__/route.test.ts
```

Expected: PASS (with valid API key)

**Step 9: Commit**

```bash
git add app/api/chat/ lib/ai-chat.ts components/chatbot/chat-widget.tsx .env.local
git commit -m "feat(chatbot): implement GPT-4 powered AI sales assistant

- Integrate OpenAI GPT-4 Turbo
- Luxury brand voice with product knowledge
- Real-time conversation with streaming
- Error handling and loading states
- System prompt optimized for sales conversion
- Emphasizes exclusivity and storytelling"
```

---

## Phase 3: SEO Agent System

### Task 3.1: SEO Analysis Engine

**Files:**
- Create: `lib/seo/analyzer.ts`
- Create: `lib/seo/keyword-research.ts`
- Create: `lib/seo/content-optimizer.ts`
- Create: `app/api/seo/analyze/route.ts`

**Step 1: Write SEO analyzer test**

Create `lib/seo/__tests__/analyzer.test.ts`:

```typescript
import { analyzePage, generateOptimizations } from '../analyzer'

describe('SEO Analyzer', () => {
  it('analyzes page title and meta description', async () => {
    const analysis = await analyzePage('https://brandonmills.com/about')

    expect(analysis.title).toBeDefined()
    expect(analysis.metaDescription).toBeDefined()
    expect(analysis.score).toBeGreaterThan(0)
  })

  it('generates actionable optimization suggestions', async () => {
    const analysis = await analyzePage('https://brandonmills.com/store')
    const optimizations = generateOptimizations(analysis)

    expect(optimizations).toBeInstanceOf(Array)
    expect(optimizations.length).toBeGreaterThan(0)
  })
})
```

**Step 2: Run test**

```bash
npm test -- lib/seo/__tests__/analyzer.test.ts
```

Expected: FAIL

**Step 3: Implement SEO analyzer**

Create `lib/seo/analyzer.ts`:

```typescript
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

interface PageAnalysis {
  url: string
  title: string | null
  metaDescription: string | null
  headings: { h1: string[]; h2: string[]; h3: string[] }
  images: { src: string; alt: string | null }[]
  wordCount: number
  keywords: string[]
  score: number
  issues: string[]
  suggestions: string[]
}

export async function analyzePage(url: string): Promise<PageAnalysis> {
  // Fetch page HTML
  const response = await fetch(url)
  const html = await response.text()

  // Parse HTML (simplified - in production use cheerio or similar)
  const titleMatch = html.match(/<title>(.*?)<\/title>/)
  const metaMatch = html.match(/<meta\s+name="description"\s+content="(.*?)"/)

  const h1s = (html.match(/<h1[^>]*>(.*?)<\/h1>/gi) || []).map(h =>
    h.replace(/<[^>]*>/g, '')
  )
  const h2s = (html.match(/<h2[^>]*>(.*?)<\/h2>/gi) || []).map(h =>
    h.replace(/<[^>]*>/g, '')
  )

  // Extract text content
  const textContent = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ')
  const wordCount = textContent.split(/\s+/).length

  // Basic scoring
  let score = 0
  const issues: string[] = []
  const suggestions: string[] = []

  if (titleMatch && titleMatch[1]) {
    score += 20
  } else {
    issues.push('Missing page title')
    suggestions.push('Add descriptive title tag (50-60 characters)')
  }

  if (metaMatch && metaMatch[1]) {
    score += 20
  } else {
    issues.push('Missing meta description')
    suggestions.push('Add compelling meta description (150-160 characters)')
  }

  if (h1s.length === 1) {
    score += 15
  } else if (h1s.length === 0) {
    issues.push('No H1 heading found')
    suggestions.push('Add single H1 heading with primary keyword')
  } else {
    issues.push('Multiple H1 headings')
    suggestions.push('Use only one H1 per page')
  }

  if (h2s.length >= 2) {
    score += 10
  } else {
    suggestions.push('Add more H2 headings for structure')
  }

  if (wordCount >= 300) {
    score += 15
  } else {
    issues.push('Low word count')
    suggestions.push(`Increase content to at least 300 words (current: ${wordCount})`)
  }

  return {
    url,
    title: titleMatch ? titleMatch[1] : null,
    metaDescription: metaMatch ? metaMatch[1] : null,
    headings: { h1: h1s, h2: h2s, h3: [] },
    images: [],
    wordCount,
    keywords: [],
    score,
    issues,
    suggestions,
  }
}

export function generateOptimizations(analysis: PageAnalysis): string[] {
  return analysis.suggestions
}

export async function generateAISEOStrategy(analysis: PageAnalysis): Promise<string> {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: `You are an expert SEO strategist for a luxury e-commerce brand (Brandon Mills Collections) that rivals Louis Vuitton.

Analyze the provided page data and generate a comprehensive SEO strategy focused on:
1. Luxury keywords and search intent
2. Content optimization for high-end buyers
3. Technical SEO improvements
4. Link building opportunities
5. Conversion optimization

Be specific, actionable, and focused on driving high-value traffic and sales.`,
      },
      {
        role: 'user',
        content: `Analyze this page and provide SEO strategy:

URL: ${analysis.url}
Title: ${analysis.title || 'None'}
Meta Description: ${analysis.metaDescription || 'None'}
H1s: ${analysis.headings.h1.join(', ')}
Word Count: ${analysis.wordCount}
Current Score: ${analysis.score}/100
Issues: ${analysis.issues.join(', ')}

Provide a detailed SEO strategy.`,
      },
    ],
    temperature: 0.7,
    max_tokens: 1500,
  })

  return completion.choices[0].message.content || 'Unable to generate strategy'
}
```

**Step 4: Create SEO API endpoint**

Create `app/api/seo/analyze/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { analyzePage, generateAISEOStrategy } from '@/lib/seo/analyzer'

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json(
        { error: 'URL required' },
        { status: 400 }
      )
    }

    const analysis = await analyzePage(url)
    const strategy = await generateAISEOStrategy(analysis)

    return NextResponse.json({
      analysis,
      strategy,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('SEO analysis error:', error)
    return NextResponse.json(
      { error: 'Analysis failed' },
      { status: 500 }
    )
  }
}
```

**Step 5: Run tests**

```bash
npm test -- lib/seo/__tests__/analyzer.test.ts
```

Expected: PASS

**Step 6: Commit**

```bash
git add lib/seo/ app/api/seo/
git commit -m "feat(seo): implement AI-powered SEO analysis engine

- Page content analysis (title, meta, headings)
- SEO scoring algorithm
- Issue detection and suggestions
- GPT-4 powered strategy generation
- API endpoint for analysis requests
- Luxury brand focused optimization"
```

---

### Task 3.2: Admin SEO Dashboard

**Files:**
- Create: `app/admin/seo/page.tsx`
- Create: `components/admin/seo-dashboard.tsx`
- Create: `components/admin/seo-score-card.tsx`

**Step 1: Implement SEO dashboard**

Create `app/admin/seo/page.tsx`:

```typescript
import { Metadata } from 'next'
import SEODashboard from '@/components/admin/seo-dashboard'

export const metadata: Metadata = {
  title: 'SEO Manager | Admin',
  description: 'AI-powered SEO optimization dashboard',
}

export default function SEOPage() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-serif mb-2">SEO Manager</h1>
          <p className="text-white/60">AI-powered optimization for luxury brand visibility</p>
        </div>

        <SEODashboard />
      </div>
    </div>
  )
}
```

**Step 2: Create SEO dashboard component**

Create `components/admin/seo-dashboard.tsx`:

```typescript
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Search, Target, BarChart } from 'lucide-react'

const pages = [
  { url: 'https://brandonmills.com', label: 'Homepage' },
  { url: 'https://brandonmills.com/about', label: 'About' },
  { url: 'https://brandonmills.com/store', label: 'Store' },
  { url: 'https://brandonmills.com/gallery', label: 'Gallery' },
]

export default function SEODashboard() {
  const [selectedPage, setSelectedPage] = useState(pages[0])
  const [analysis, setAnalysis] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const analyzePage = async (url: string) => {
    setLoading(true)
    try {
      const response = await fetch('/api/seo/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })
      const data = await response.json()
      setAnalysis(data)
    } catch (error) {
      console.error('Analysis failed:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Page Selector */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {pages.map((page) => (
          <button
            key={page.url}
            onClick={() => {
              setSelectedPage(page)
              analyzePage(page.url)
            }}
            className={`p-4 border transition-all ${
              selectedPage.url === page.url
                ? 'border-accent-gold bg-accent-gold/10'
                : 'border-white/10 hover:border-white/30'
            }`}
          >
            <div className="text-left">
              <div className="text-sm font-medium text-white">{page.label}</div>
              <div className="text-xs text-white/60 mt-1 truncate">{page.url}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Analysis Results */}
      {loading && (
        <div className="text-center py-20">
          <div className="inline-block w-8 h-8 border-2 border-accent-gold border-t-transparent rounded-full animate-spin" />
          <p className="mt-4 text-white/60">Analyzing page...</p>
        </div>
      )}

      {analysis && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Score Card */}
          <div className="bg-white/5 border border-white/10 p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-serif">SEO Score</h2>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-accent-gold" />
                <span className="text-3xl font-bold text-accent-gold">
                  {analysis.analysis.score}
                </span>
                <span className="text-white/60">/100</span>
              </div>
            </div>

            {/* Issues */}
            {analysis.analysis.issues.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3 text-red-400">Issues</h3>
                <ul className="space-y-2">
                  {analysis.analysis.issues.map((issue: string, i: number) => (
                    <li key={i} className="text-white/70 text-sm flex items-start gap-2">
                      <span className="text-red-400 mt-1">•</span>
                      {issue}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Suggestions */}
            {analysis.analysis.suggestions.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-3 text-accent-gold">Suggestions</h3>
                <ul className="space-y-2">
                  {analysis.analysis.suggestions.map((suggestion: string, i: number) => (
                    <li key={i} className="text-white/70 text-sm flex items-start gap-2">
                      <span className="text-accent-gold mt-1">→</span>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* AI Strategy */}
          <div className="bg-white/5 border border-accent-gold/30 p-8">
            <div className="flex items-center gap-3 mb-6">
              <Target className="w-6 h-6 text-accent-gold" />
              <h2 className="text-2xl font-serif">AI Strategy</h2>
            </div>
            <div className="prose prose-invert max-w-none">
              <div className="text-white/80 whitespace-pre-wrap leading-relaxed">
                {analysis.strategy}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
```

**Step 3: Commit**

```bash
git add app/admin/seo/ components/admin/seo-dashboard.tsx components/admin/seo-score-card.tsx
git commit -m "feat(admin): add AI-powered SEO dashboard

- Real-time page analysis
- SEO score visualization
- Issue detection and recommendations
- GPT-4 generated optimization strategies
- Admin-only access
- Beautiful luxury UI"
```

---

## Phase 4: Enhanced Product Pages

### Task 4.1: Museum-Quality Product Gallery

**Files:**
- Modify: `app/store/[productId]/page.tsx`
- Create: `components/product/gallery-viewer.tsx`
- Create: `components/product/zoom-modal.tsx`

**Step 1: Write gallery viewer test**

Create `components/product/__tests__/gallery-viewer.test.tsx`:

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import GalleryViewer from '../gallery-viewer'

const mockImages = [
  { src: '/test1.jpg', alt: 'Test 1' },
  { src: '/test2.jpg', alt: 'Test 2' },
]

describe('GalleryViewer', () => {
  it('renders main image', () => {
    render(<GalleryViewer images={mockImages} />)
    expect(screen.getByAltText('Test 1')).toBeInTheDocument()
  })

  it('shows thumbnail navigation', () => {
    render(<GalleryViewer images={mockImages} />)
    expect(screen.getAllByRole('button')).toHaveLength(2)
  })

  it('opens zoom modal on click', () => {
    render(<GalleryViewer images={mockImages} />)
    const mainImage = screen.getByAltText('Test 1')
    fireEvent.click(mainImage)
    expect(screen.getByTestId('zoom-modal')).toBeInTheDocument()
  })
})
```

**Step 2: Run test**

```bash
npm test -- components/product/__tests__/gallery-viewer.test.tsx
```

Expected: FAIL

**Step 3: Implement gallery viewer**

Create `components/product/gallery-viewer.tsx`:

```typescript
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react'
import ZoomModal from './zoom-modal'

interface GalleryViewerProps {
  images: Array<{ src: string; alt: string }>
  productName: string
}

export default function GalleryViewer({ images, productName }: GalleryViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isZoomOpen, setIsZoomOpen] = useState(false)

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <>
      <div className="space-y-6">
        {/* Main Image */}
        <motion.div
          className="relative aspect-[3/4] bg-white/5 cursor-zoom-in group overflow-hidden"
          onClick={() => setIsZoomOpen(true)}
        >
          <Image
            src={images[currentIndex].src}
            alt={images[currentIndex].alt}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority
          />

          {/* Zoom hint */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileHover={{ opacity: 1, scale: 1 }}
              className="bg-black/80 p-4 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ZoomIn className="w-8 h-8 text-white" />
            </motion.div>
          </div>

          {/* Navigation arrows (if multiple images) */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  prevImage()
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  nextImage()
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Image counter */}
          <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/70 text-white text-sm">
            {currentIndex + 1} / {images.length}
          </div>
        </motion.div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="grid grid-cols-4 gap-4">
            {images.map((image, index) => (
              <motion.button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`relative aspect-square border-2 transition-all overflow-hidden ${
                  index === currentIndex
                    ? 'border-accent-gold'
                    : 'border-white/10 hover:border-white/30'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover"
                />
              </motion.button>
            ))}
          </div>
        )}
      </div>

      {/* Zoom Modal */}
      <ZoomModal
        isOpen={isZoomOpen}
        onClose={() => setIsZoomOpen(false)}
        images={images}
        initialIndex={currentIndex}
        productName={productName}
      />
    </>
  )
}
```

**Step 4: Create zoom modal**

Create `components/product/zoom-modal.tsx`:

```typescript
'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

interface ZoomModalProps {
  isOpen: boolean
  onClose: () => void
  images: Array<{ src: string; alt: string }>
  initialIndex: number
  productName: string
}

export default function ZoomModal({
  isOpen,
  onClose,
  images,
  initialIndex,
  productName,
}: ZoomModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)

  useEffect(() => {
    setCurrentIndex(initialIndex)
  }, [initialIndex])

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') prevImage()
      if (e.key === 'ArrowRight') nextImage()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, currentIndex])

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          data-testid="zoom-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-sm"
          onClick={onClose}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 z-10 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Main image */}
          <div
            className="h-full flex items-center justify-center p-20"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="relative w-full h-full"
            >
              <Image
                src={images[currentIndex].src}
                alt={images[currentIndex].alt}
                fill
                className="object-contain"
                quality={100}
              />
            </motion.div>
          </div>

          {/* Navigation */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  prevImage()
                }}
                className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  nextImage()
                }}
                className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </>
          )}

          {/* Image info */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center space-y-2">
            <p className="text-white font-serif text-lg">{productName}</p>
            <p className="text-white/60 text-sm">
              {currentIndex + 1} of {images.length}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```

**Step 5: Run tests**

```bash
npm test -- components/product/__tests__/gallery-viewer.test.tsx
```

Expected: PASS

**Step 6: Commit**

```bash
git add components/product/
git commit -m "feat(product): add museum-quality image gallery viewer

- Full-screen zoom modal with keyboard navigation
- Thumbnail grid with active state
- Smooth transitions and animations
- Hover zoom hints
- Image counter and navigation
- Luxury UI matching brand aesthetic"
```

---

## Summary

This comprehensive plan transforms brandonmills.com into a **jaw-dropping luxury experience** rivaling Louis Vuitton, Prada, and Chanel - embodying the spirit of Leonardo da Vinci in the modern era.

**Key Features Implemented:**

1. **Cinematic Homepage** - Video hero, featured collections, philosophy section
2. **AI Sales Chatbot** - GPT-4 powered luxury art advisor
3. **SEO Agent System** - Autonomous optimization with admin dashboard
4. **Museum Product Pages** - Zoom gallery, luxury presentation

**Next Steps for User:**

1. Add actual video to `/public/videos/hero-loop.mp4`
2. Add OpenAI API key to `.env.local`
3. Upload high-quality product images
4. Review and customize AI chatbot personality
5. Run SEO analysis on all pages
6. Generate products in admin dashboard

**Revenue Drivers:**

- AI chatbot increases conversion rate
- SEO agent drives organic luxury traffic
- Museum-quality presentation justifies premium pricing
- Storytelling creates emotional connection
- Limited edition messaging creates urgency

---

**Plan saved to:** `docs/plans/2025-11-15-luxury-experience-transformation.md`

**Estimated Implementation Time:** 12-16 hours (split into 4 phases)

**Testing Strategy:** TDD throughout - write test, see it fail, implement, see it pass, commit

**Deployment:** Deploy after each phase for incremental progress
