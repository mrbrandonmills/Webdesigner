'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Moon, Share2, Download, Heart, ArrowRight } from 'lucide-react'
import { ShareCard, ShareButton } from '@/components/social-proof/share-card'

interface DreamSymbol {
  name: string
  archetype: string
  meaning: string
}

interface DreamData {
  id: string
  url: string
  emotionalTone: string
  interpretation: string
  symbols: DreamSymbol[]
  themes: string[]
  recommendedMeditation: {
    title: string
    slug: string
  }
}

export default function DreamResultPage() {
  const params = useParams()
  const [data, setData] = useState<DreamData | null>(null)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [showShareCard, setShowShareCard] = useState(false)

  useEffect(() => {
    const id = params.id as string

    // Mock data - in production this would be fetched from API/database
    setData({
      id,
      url: `https://your-blob-url.public.blob.vercel-storage.com/dreams/${id}.html`,
      emotionalTone: 'Transformative',
      interpretation: 'Your dream reveals a journey of profound transformation. The recurring water imagery suggests emotional cleansing and renewal, while the presence of unknown figures points to unexplored aspects of your psyche seeking integration. The labyrinthine structures represent your current life path - complex but purposeful. This dream is calling you to embrace change and trust the process of becoming who you are meant to be.',
      symbols: [
        {
          name: 'Water',
          archetype: 'The Unconscious',
          meaning: 'Represents emotions, intuition, and the depths of your psyche. Flowing water suggests emotional movement and change.'
        },
        {
          name: 'Unknown Figure',
          archetype: 'The Shadow',
          meaning: 'Symbolizes repressed aspects of yourself seeking acknowledgment and integration into consciousness.'
        },
        {
          name: 'Labyrinth',
          archetype: 'The Journey',
          meaning: 'Represents life\'s complexity and your path toward self-discovery. Finding the center means finding your true self.'
        },
        {
          name: 'Light',
          archetype: 'The Self',
          meaning: 'Symbolizes enlightenment, awareness, and the integration of conscious and unconscious aspects.'
        }
      ],
      themes: [
        'Transformation',
        'Self-Discovery',
        'Emotional Processing',
        'Integration',
        'Renewal',
        'Inner Wisdom'
      ],
      recommendedMeditation: {
        title: 'Shadow Integration Meditation',
        slug: 'shadow-integration'
      }
    })

    // Show email modal after 8 seconds
    const timer = setTimeout(() => {
      const hasEmail = localStorage.getItem('dream_email')
      if (!hasEmail) {
        setShowEmailModal(true)
      }
    }, 8000)

    return () => clearTimeout(timer)
  }, [params.id])

  if (!data) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-purple-500">Loading dream analysis...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Visualization iframe */}
      <div className="h-[50vh] relative">
        <iframe
          src={data.url}
          className="w-full h-full border-0"
          title="Dream Visualization"
        />

        {/* Overlay controls */}
        <div className="absolute bottom-4 right-4 flex gap-2">
          <button
            onClick={() => setShowShareCard(true)}
            className="p-3 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-colors"
          >
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
          {/* Emotional Tone Badge */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full">
              <Moon className="w-4 h-4 text-purple-500" />
              <span className="text-sm text-purple-400">Emotional Tone: {data.emotionalTone}</span>
            </div>
          </div>

          {/* Interpretation */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Moon className="w-6 h-6 text-purple-500" />
              <h2 className="font-serif text-2xl">Dream Interpretation</h2>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="p-6 bg-white/5 border border-white/10 rounded-xl"
            >
              <p className="text-gray-300 leading-relaxed">{data.interpretation}</p>
            </motion.div>
          </div>

          {/* Dream Symbols Grid */}
          <div className="mb-12">
            <h2 className="font-serif text-2xl mb-6">Dream Symbols</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {data.symbols.map((symbol, i) => (
                <motion.div
                  key={symbol.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-6 bg-white/5 border border-white/10 rounded-xl"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-lg">{symbol.name}</h3>
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full">
                      {symbol.archetype}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">{symbol.meaning}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Themes */}
          <div className="mb-12">
            <h2 className="font-serif text-2xl mb-6">Key Themes</h2>
            <div className="flex flex-wrap gap-3">
              {data.themes.map((theme, i) => (
                <motion.span
                  key={theme}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-gray-300"
                >
                  {theme}
                </motion.span>
              ))}
            </div>
          </div>

          {/* Meditation Recommendation */}
          <div className="p-8 bg-gradient-to-br from-purple-500/20 to-transparent border border-purple-500/30 rounded-xl">
            <h3 className="font-serif text-xl mb-4">Recommended Practice</h3>
            <p className="text-gray-400 mb-6">
              Based on your dream's themes and symbols, we recommend the {data.recommendedMeditation.title} to
              help integrate these insights into your waking consciousness.
            </p>
            <Link
              href={`/meditations/${data.recommendedMeditation.slug}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-500 transition-colors"
            >
              Start Meditation
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Share CTA */}
          <div className="mt-12 text-center">
            <p className="text-gray-500 mb-4">Share your dream analysis</p>
            <ShareButton onClick={() => setShowShareCard(true)} className="mx-auto" />
          </div>
        </div>
      </section>

      {/* Share Card Modal */}
      {showShareCard && data && (
        <ShareCard
          type="dream"
          title={data.emotionalTone}
          subtitle={data.themes[0]}
          description={data.interpretation.slice(0, 150) + '...'}
          id={data.id}
          onClose={() => setShowShareCard(false)}
        />
      )}

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
        body: JSON.stringify({ email, source: 'dream-decoder' })
      })

      localStorage.setItem('dream_email', email)
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
        <div className="flex items-center gap-2 mb-4">
          <Moon className="w-6 h-6 text-purple-500" />
          <h3 className="font-serif text-2xl">Unlock Dream Journal</h3>
        </div>
        <p className="text-gray-400 mb-6">
          Track your dreams over time, discover recurring patterns, and receive
          personalized insights delivered to your inbox weekly.
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
            {isSubmitting ? 'Subscribing...' : 'Start Dream Journal'}
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
