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
