'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { getMeditationBySlug } from '@/lib/meditations-data'
import { AudioReader } from '@/components/audio-reader'
import { trackPurchase } from '@/lib/analytics'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export default function MeditationSuccessPage({ params }: PageProps) {
  const resolvedParams = use(params)
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const meditation = getMeditationBySlug(resolvedParams.slug)
  const [verifying, setVerifying] = useState(true)
  const [purchaseValid, setPurchaseValid] = useState(false)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })

    // Verify the purchase
    const verifyPurchase = async () => {
      if (!sessionId) {
        setVerifying(false)
        return
      }

      try {
        const response = await fetch(`/api/stripe/verify-purchase?session_id=${sessionId}`)
        const data = await response.json()

        if (data.valid) {
          setPurchaseValid(true)
          // Store purchase locally
          const purchases = JSON.parse(localStorage.getItem('meditation_purchases') || '[]')
          if (!purchases.includes(resolvedParams.slug)) {
            purchases.push(resolvedParams.slug)
            localStorage.setItem('meditation_purchases', JSON.stringify(purchases))
          }

          // Track purchase in Google Analytics
          if (meditation) {
            trackPurchase(meditation.title, meditation.price, sessionId || undefined)
          }
        }
      } catch (error) {
        console.error('Purchase verification failed:', error)
      } finally {
        setVerifying(false)
      }
    }

    verifyPurchase()
  }, [sessionId, resolvedParams.slug])

  if (!meditation) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-light">Meditation Not Found</h1>
          <Link href="/meditations" className="text-accent-gold hover:underline">
            ← Back to Meditations
          </Link>
        </div>
      </div>
    )
  }

  if (verifying) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl mb-4">🔄</div>
          <h1 className="text-3xl font-light">Verifying your purchase...</h1>
          <p className="text-white/60">Please wait a moment</p>
        </div>
      </div>
    )
  }

  if (!purchaseValid) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-3xl font-light">Purchase Verification Failed</h1>
          <p className="text-white/60">
            We couldn't verify your purchase. Please contact support if you've been charged.
          </p>
          <Link
            href={`/meditations/${resolvedParams.slug}`}
            className="inline-block bg-accent-gold text-black px-8 py-3 text-sm tracking-wider uppercase font-medium hover:bg-white transition-colors"
          >
            Try Again
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Success Header */}
      <section className="pt-32 pb-12 container-wide">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="text-7xl mb-4">✓</div>

          <h1 className="text-5xl md:text-6xl font-light font-serif leading-tight">
            Purchase Successful!
          </h1>

          <div className="w-24 h-px bg-gradient-to-r from-transparent via-accent-gold to-transparent mx-auto my-8" />

          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Thank you for your purchase. Your meditation is ready to experience.
          </p>
        </div>
      </section>

      {/* Meditation Info */}
      <section className="pb-12 container-wide">
        <div className="max-w-3xl mx-auto bg-white/5 border border-white/10 p-8 md:p-12 space-y-6">
          <h2 className="text-3xl font-light font-serif text-accent-gold">
            {meditation.title}
          </h2>

          <p className="text-white/60 text-lg">
            {meditation.subtitle}
          </p>

          <div className="pt-6 border-t border-white/10 space-y-3 text-white/60 text-sm">
            <p>✓ Payment processed successfully</p>
            <p>✓ All 4 premium voice options unlocked</p>
            <p>✓ Instant streaming access below</p>
            <p>✓ Lifetime access - yours forever</p>
          </div>
        </div>
      </section>

      {/* Audio Player */}
      <section className="pb-12 container-wide">
        <div className="max-w-3xl mx-auto">
          <h3 className="text-accent-gold text-sm tracking-wider uppercase mb-6">
            Your Meditation Audio
          </h3>

          <AudioReader
            contentId={meditation.slug}
            title={meditation.title}
            textContent={meditation.description}
            voicePreference="male"
            showVoiceSelector={true}
            contentType="article"
          />
        </div>
      </section>

      {/* What's Next */}
      <section className="pb-32 container-wide">
        <div className="max-w-3xl mx-auto bg-white/5 border border-white/10 p-8 md:p-12 space-y-6">
          <h3 className="text-accent-gold text-sm tracking-wider uppercase">
            What's Next?
          </h3>

          <div className="space-y-4 text-white/70">
            <p>
              <strong className="text-white">Start Practicing:</strong> Use the audio player above
              to begin your meditation immediately. Choose from 4 premium voices.
            </p>

            <p>
              <strong className="text-white">Bookmark This Page:</strong> You can return anytime
              to access your meditation. Your purchase is stored in your browser.
            </p>

            <p>
              <strong className="text-white">Explore More:</strong> Check out our other guided
              meditations to build a complete practice library.
            </p>
          </div>

          <div className="pt-6 border-t border-white/10">
            <Link
              href="/meditations"
              className="inline-block bg-accent-gold text-black px-8 py-3 text-sm tracking-wider uppercase font-medium hover:bg-white transition-colors"
            >
              Browse All Meditations
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
