'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { getMeditationBySlug, getCategoryInfo, getVoiceConfig } from '@/lib/meditations-data'
import { useRouter } from 'next/navigation'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export default function MeditationProductPage({ params }: PageProps) {
  const router = useRouter()
  const resolvedParams = use(params)
  const meditation = getMeditationBySlug(resolvedParams.slug)
  const [selectedVoice, setSelectedVoice] = useState<'male' | 'female' | 'male-indian' | 'female-indian'>('male')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

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

  const categoryInfo = getCategoryInfo(meditation.category)
  const voiceConfig = getVoiceConfig(selectedVoice)

  const handleBuyNow = async () => {
    setIsLoading(true)

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

      const data = await response.json()

      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url
      } else {
        throw new Error(data.error || 'Failed to create checkout session')
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Failed to start checkout. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <section className="pt-32 pb-12 container-wide">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/meditations"
            className="text-accent-gold hover:underline text-sm tracking-wider uppercase inline-block"
          >
            ← Back to All Meditations
          </Link>
        </div>
      </section>

      {/* Hero Section */}
      <section className="pb-16 container-wide">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          {/* Category Badge */}
          <div className="flex items-center justify-center gap-3">
            <span className="text-3xl">{categoryInfo.icon}</span>
            <p className="text-accent-gold text-xs tracking-[0.3em] uppercase">
              {categoryInfo.label}
            </p>
          </div>

          <h1 className="text-4xl md:text-5xl font-light font-serif leading-tight">
            {meditation.title}
          </h1>

          <div className="w-24 h-px bg-gradient-to-r from-transparent via-accent-gold to-transparent mx-auto my-8" />

          <p className="text-white/60 text-xl font-light">
            {meditation.subtitle}
          </p>

          <div className="flex items-center justify-center gap-8 pt-4">
            <div className="text-center">
              <p className="text-2xl font-light text-accent-gold">{meditation.duration}</p>
              <p className="text-xs text-white/50 uppercase tracking-wider">Duration</p>
            </div>
            <div className="w-px h-12 bg-white/10" />
            <div className="text-center">
              <p className="text-2xl font-light text-accent-gold">{meditation.wordCount}</p>
              <p className="text-xs text-white/50 uppercase tracking-wider">Words</p>
            </div>
            <div className="w-px h-12 bg-white/10" />
            <div className="text-center">
              <p className="text-2xl font-light text-accent-gold">4</p>
              <p className="text-xs text-white/50 uppercase tracking-wider">Voices</p>
            </div>
          </div>
        </div>
      </section>

      {/* Description */}
      <section className="pb-16 container-wide">
        <div className="max-w-3xl mx-auto">
          <p className="text-white/70 text-lg leading-relaxed text-center">
            {meditation.description}
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="pb-16 container-wide">
        <div className="max-w-3xl mx-auto bg-white/5 border border-white/10 p-8 md:p-12 space-y-6">
          <h3 className="text-accent-gold text-sm tracking-wider uppercase">
            What You'll Experience
          </h3>

          <ul className="space-y-3">
            {meditation.benefits.map((benefit, idx) => (
              <li key={idx} className="flex items-start gap-3 text-white/70">
                <span className="text-accent-gold mt-1 text-xl">✓</span>
                <span className="text-lg">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Voice Selector */}
      <section className="pb-12 container-wide">
        <div className="max-w-3xl mx-auto bg-white/5 border border-white/10 p-8 md:p-12 space-y-6">
          <h3 className="text-accent-gold text-sm tracking-wider uppercase">
            Choose Your Guide Voice
          </h3>

          <p className="text-white/60 text-sm">
            Each meditation is available in 4 premium voices. Select the one that resonates with you.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(['male', 'female', 'male-indian', 'female-indian'] as const).map((voice) => {
              const config = getVoiceConfig(voice)
              return (
                <button
                  key={voice}
                  onClick={() => setSelectedVoice(voice)}
                  className={`
                    p-4 border-2 text-left transition-all duration-300
                    ${selectedVoice === voice
                      ? 'border-accent-gold bg-accent-gold/10'
                      : 'border-white/10 bg-white/5 hover:border-white/30'
                    }
                  `}
                >
                  <p className="text-white font-medium mb-1">{config.name}</p>
                  <p className="text-white/60 text-sm">{config.description}</p>
                </button>
              )
            })}
          </div>

          <div className="pt-4 border-t border-white/10">
            <p className="text-white/50 text-sm">
              <strong className="text-white">Selected:</strong> {voiceConfig.name}
            </p>
          </div>
        </div>
      </section>

      {/* Purchase Section */}
      <section className="pb-32 container-wide">
        <div className="max-w-3xl mx-auto bg-white/5 border border-white/10 p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <p className="text-5xl font-light text-accent-gold mb-2">
                ${meditation.price}
              </p>
              <p className="text-white/50 text-sm uppercase tracking-wider">
                One-time purchase • Lifetime access
              </p>
              <p className="text-white/40 text-xs mt-2">
                Includes all 4 voice options
              </p>
            </div>

            <button
              onClick={handleBuyNow}
              disabled={isLoading}
              className="bg-accent-gold text-black px-12 py-4 text-lg tracking-wider uppercase font-medium hover:bg-white transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Processing...' : 'Buy Now →'}
            </button>
          </div>

          <div className="mt-8 pt-8 border-t border-white/10 space-y-3 text-white/50 text-sm">
            <p>✓ Instant download after purchase</p>
            <p>✓ All 4 premium voice options included</p>
            <p>✓ High-quality MP3 audio files</p>
            <p>✓ Listen online or download for offline use</p>
            <p>✓ Lifetime access - yours forever</p>
          </div>
        </div>
      </section>

      {/* Theme Details */}
      <section className="pb-32 container-wide">
        <div className="max-w-3xl mx-auto bg-white/5 border border-white/10 p-8 md:p-12 space-y-6">
          <h3 className="text-accent-gold text-sm tracking-wider uppercase">
            Meditation Theme
          </h3>

          <p className="text-white/70 leading-relaxed text-lg">
            {meditation.theme}
          </p>

          <div className="pt-6 border-t border-white/10">
            <p className="text-white/50 text-sm">
              <strong className="text-white">Category:</strong> {categoryInfo.description}
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
