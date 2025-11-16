'use client'

import { useState, useEffect } from 'react'
import { Lock, Unlock, BookOpen } from 'lucide-react'
import { RippleButton } from './ripple-button'

interface BookReaderProps {
  bookId: string
  title: string
  subtitle?: string
  htmlContent: string
  teaserPercentage?: number // What % to show as preview (default 20%)
  unlockPrice?: number // Price in dollars (default $5)
}

export function BookReader({
  bookId,
  title,
  subtitle,
  htmlContent,
  teaserPercentage = 20,
  unlockPrice = 5,
}: BookReaderProps) {
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [displayHtml, setDisplayHtml] = useState<string>('')

  // Check if book is already unlocked
  useEffect(() => {
    const unlocked = localStorage.getItem(`book-unlocked-${bookId}`)
    if (unlocked === 'true') {
      setIsUnlocked(true)
    }
  }, [bookId])

  // Calculate teaser content CLIENT-SIDE ONLY (DOMParser not available server-side)
  useEffect(() => {
    if (typeof window === 'undefined') return

    const parser = new DOMParser()
    const doc = parser.parseFromString(htmlContent, 'text/html')
    const allElements = Array.from(doc.body.children)
    const teaserCount = Math.ceil(allElements.length * (teaserPercentage / 100))

    const elements = isUnlocked ? allElements : allElements.slice(0, teaserCount)
    setDisplayHtml(elements.map(el => el.outerHTML).join(''))
  }, [htmlContent, isUnlocked, teaserPercentage])

  const handleUnlock = async () => {
    setIsProcessing(true)

    try {
      // Create Stripe checkout session
      const response = await fetch('/api/books/unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookId,
          title,
          price: unlockPrice,
        }),
      })

      const data = await response.json()

      if (data.checkoutUrl) {
        // Redirect to Stripe checkout
        window.location.href = data.checkoutUrl
      } else if (data.unlocked) {
        // Already unlocked or free preview
        localStorage.setItem(`book-unlocked-${bookId}`, 'true')
        setIsUnlocked(true)
      }
    } catch (error) {
      console.error('Failed to unlock book:', error)
      alert('Failed to process payment. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const displayElements = isUnlocked ? fullElements : teaserElements

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Book Header */}
      <div className="container-wide pt-32 pb-12">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-3 px-6 py-3 border border-accent-gold/20 bg-accent-gold/5 rounded-full">
            <BookOpen className="text-accent-gold" size={20} />
            <span className="text-sm tracking-[0.2em] uppercase text-accent-gold font-light">
              {isUnlocked ? 'Full Access' : 'Preview'}
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-light font-serif leading-tight">
            {title}
          </h1>

          {subtitle && (
            <p className="text-xl md:text-2xl text-white/70 font-light">
              {subtitle}
            </p>
          )}

          {!isUnlocked && (
            <div className="pt-6">
              <p className="text-white/50 mb-6">
                Reading preview • Unlock full book for ${unlockPrice}
              </p>
              <RippleButton
                onClick={handleUnlock}
                disabled={isProcessing}
                className="px-12 py-4 bg-accent-gold text-black font-medium tracking-[0.2em] uppercase rounded-full hover:bg-accent-hover transition-all"
              >
                <Unlock size={20} className="inline mr-3" />
                {isProcessing ? 'Processing...' : `Unlock for $${unlockPrice}`}
              </RippleButton>
            </div>
          )}
        </div>
      </div>

      {/* Book Content */}
      <div className="container-wide pb-32">
        <div className="max-w-3xl mx-auto">
          {/* Luxury book styling */}
          <div
            className="book-content bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-3xl p-8 md:p-16 backdrop-blur-xl"
            dangerouslySetInnerHTML={{ __html: displayHtml }}
          />

          {/* Unlock Prompt (if locked) */}
          {!isUnlocked && (
            <div className="mt-12 text-center space-y-8">
              <div className="w-full h-px bg-gradient-to-r from-transparent via-accent-gold/30 to-transparent" />

              <div className="bg-gradient-to-br from-accent-gold/10 to-transparent border border-accent-gold/20 rounded-3xl p-12 backdrop-blur-xl">
                <Lock className="mx-auto text-accent-gold mb-6" size={48} />

                <h3 className="text-2xl md:text-3xl font-serif text-white mb-4">
                  Continue Reading
                </h3>

                <p className="text-white/70 mb-8 leading-relaxed max-w-md mx-auto">
                  You've reached the end of the preview. Unlock the full book to continue your journey
                  through consciousness, transformation, and integration.
                </p>

                <RippleButton
                  onClick={handleUnlock}
                  disabled={isProcessing}
                  className="px-12 py-4 bg-accent-gold text-black font-medium tracking-[0.2em] uppercase rounded-full hover:bg-accent-hover transition-all"
                >
                  <Unlock size={20} className="inline mr-3" />
                  {isProcessing ? 'Processing...' : `Unlock Full Book • $${unlockPrice}`}
                </RippleButton>

                <p className="text-white/40 text-sm mt-6">
                  One-time payment • Instant access • Read anytime
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reading Progress Bar */}
      {isUnlocked && (
        <div className="fixed bottom-0 left-0 right-0 h-1 bg-white/10">
          <div
            className="h-full bg-accent-gold transition-all duration-300"
            style={{
              width: `${(window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100}%`,
            }}
          />
        </div>
      )}
    </div>
  )
}
