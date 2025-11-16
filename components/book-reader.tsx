'use client'

import { useState, useEffect } from 'react'
import { Lock, Unlock, BookOpen, Tag } from 'lucide-react'
import { RippleButton } from './ripple-button'
import { AudioReader } from './audio-reader'

interface BookReaderProps {
  bookId: string
  title: string
  subtitle?: string
  htmlContent: string
  teaserPercentage?: number // What % to show as preview (default 20%)
  unlockPrice?: number // Price in dollars (default $5)
  audioTextContent?: string // Optional text content for audio reader
  showAudioReader?: boolean // Whether to show audio reader (default false)
}

export function BookReader({
  bookId,
  title,
  subtitle,
  htmlContent,
  teaserPercentage = 20,
  unlockPrice = 5,
  audioTextContent,
  showAudioReader = false,
}: BookReaderProps) {
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [displayHtml, setDisplayHtml] = useState<string>('')
  const [promoCode, setPromoCode] = useState('')
  const [showPromoInput, setShowPromoInput] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [promoMessage, setPromoMessage] = useState<string | null>(null)

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

  const handlePromoUnlock = async () => {
    if (!promoCode.trim()) {
      setError('Please enter a promo code')
      return
    }

    // Get email from user
    const email = prompt('Please enter your email to unlock with promo code:')
    if (!email) {
      return
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address')
      return
    }

    setIsProcessing(true)
    setError(null)
    setPromoMessage(null)

    try {
      // Unlock with promo code
      const response = await fetch('/api/promo/unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: promoCode,
          contentType: 'book',
          contentId: bookId,
          email,
        }),
      })

      const data = await response.json()

      if (data.success && data.unlocked) {
        // Store unlock locally
        localStorage.setItem(`book-unlocked-${bookId}`, 'true')
        setIsUnlocked(true)

        // Show success message
        setPromoMessage('Book unlocked with promo code!')

        // Reload page to show unlocked content
        setTimeout(() => {
          window.location.reload()
        }, 1500)
      } else {
        setError(data.message || 'Invalid promo code')
        setIsProcessing(false)
      }
    } catch (err) {
      console.error('Promo unlock error:', err)
      setError('Unable to process promo code. Please try again.')
      setIsProcessing(false)
    }
  }

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
            <div className="pt-6 space-y-4">
              <p className="text-white/50 mb-6">
                Reading preview • Unlock full book for ${unlockPrice}
              </p>

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl mb-4">
                  <p className="text-red-400 text-sm text-center">{error}</p>
                </div>
              )}

              {/* Success Message */}
              {promoMessage && (
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl mb-4">
                  <p className="text-green-400 text-sm text-center">{promoMessage}</p>
                </div>
              )}

              {/* Promo Code Input */}
              {showPromoInput ? (
                <div className="space-y-3 mb-4">
                  <div className="flex gap-2 max-w-md mx-auto">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      placeholder="Enter promo code"
                      className="flex-1 px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white placeholder:text-white/40 focus:border-accent-gold/50 focus:outline-none"
                      disabled={isProcessing}
                    />
                    <button
                      onClick={handlePromoUnlock}
                      disabled={isProcessing || !promoCode.trim()}
                      className="px-6 py-3 bg-accent-gold/20 hover:bg-accent-gold/30 text-accent-gold font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Apply
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      setShowPromoInput(false)
                      setPromoCode('')
                      setError(null)
                    }}
                    className="text-white/60 hover:text-white text-sm transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowPromoInput(true)}
                  className="mb-4 py-3 px-6 bg-black/30 hover:bg-black/40 border border-white/10 hover:border-accent-gold/30 text-white/70 hover:text-white font-medium rounded-full transition-all inline-flex items-center gap-2"
                >
                  <Tag size={18} />
                  Have a promo code?
                </button>
              )}

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

      {/* Audio Reader */}
      {showAudioReader && audioTextContent && (
        <div className="container-wide pb-12">
          <div className="max-w-3xl mx-auto">
            <AudioReader
              contentId={bookId}
              title={title}
              textContent={audioTextContent}
              voicePreference="male"
              showVoiceSelector={true}
            />
          </div>
        </div>
      )}

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
