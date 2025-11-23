'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams } from 'next/navigation'
import {
  Compass,
  Sparkles,
  Star,
  ArrowRight,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  Share2
} from 'lucide-react'
import { ShareCard, ShareButton } from '@/components/social-proof/share-card'

interface PathAlignment {
  path: string
  score: number
  description: string
}

interface LifePathResult {
  archetype: {
    name: string
    emoji: string
    phase: string
    description: string
  }
  affirmation: string
  paths: PathAlignment[]
  strengths: string[]
  growthAreas: string[]
  recommendedMeditation: {
    title: string
    slug: string
  }
}

// Archetype emoji mapping
const archetypeEmojis: Record<string, string> = {
  Warrior: '⚔️',
  King: '👑',
  Magician: '🔮',
  Lover: '💖'
}

// Phase prefix mapping
const phasePrefixes: Record<string, string> = {
  Awakening: 'The Phase of Awakening',
  Building: 'The Phase of Building',
  Mastering: 'The Phase of Mastery',
  Transcending: 'The Phase of Transcendence'
}

// Meditation title mapping
const meditationTitles: Record<string, string> = {
  'inner-warrior': 'Inner Warrior Activation',
  'deep-focus': 'Deep Focus Meditation',
  'creative-flow': 'Creative Flow State',
  'emotional-clarity': 'Emotional Clarity Practice',
  'confidence-builder': 'Confidence Builder'
}

export default function LifePathResultPage() {
  const params = useParams()
  const [result, setResult] = useState<LifePathResult | null>(null)
  const [visualizationUrl, setVisualizationUrl] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [showShareCard, setShowShareCard] = useState(false)
  const [email, setEmail] = useState('')
  const [isSubscribing, setIsSubscribing] = useState(false)
  const [subscribeStatus, setSubscribeStatus] = useState<'idle' | 'success' | 'error'>('idle')

  useEffect(() => {
    // Load real data from localStorage (stored when redirected from oracle page)
    const loadResult = () => {
      try {
        const storedData = localStorage.getItem(`oracle_result_${params.id}`)
        if (!storedData) {
          setError('Result not found. Please complete the quiz again.')
          return
        }

        const data = JSON.parse(storedData)

        // Transform API response to component format
        const transformedResult: LifePathResult = {
          archetype: {
            name: data.analysis.archetype,
            emoji: archetypeEmojis[data.analysis.archetype] || '✨',
            phase: phasePrefixes[data.analysis.currentPhase] || data.analysis.currentPhase,
            description: data.analysis.archetypeDescription
          },
          affirmation: data.analysis.affirmation,
          paths: data.analysis.potentialPaths.map((path: { name: string; description: string; alignment: number }) => ({
            path: path.name,
            score: path.alignment,
            description: path.description
          })),
          strengths: data.analysis.strengths,
          growthAreas: data.analysis.growthAreas,
          recommendedMeditation: {
            title: meditationTitles[data.analysis.recommendedMeditation] || 'Guided Meditation',
            slug: data.analysis.recommendedMeditation
          }
        }

        setResult(transformedResult)
        setVisualizationUrl(data.url)
      } catch (err) {
        console.error('Error loading result:', err)
        setError('Failed to load your results. Please try again.')
      }
    }

    loadResult()

    // Check if email modal should be shown
    const hasSeenModal = localStorage.getItem('oracle_email')
    if (!hasSeenModal) {
      const timer = setTimeout(() => {
        setShowEmailModal(true)
      }, 10000)

      return () => clearTimeout(timer)
    }
  }, [params.id])

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubscribing(true)

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          source: 'life-path-oracle'
        })
      })

      if (response.ok) {
        setSubscribeStatus('success')
        localStorage.setItem('oracle_email', 'true')
        setTimeout(() => {
          setShowEmailModal(false)
        }, 2000)
      } else {
        setSubscribeStatus('error')
      }
    } catch {
      setSubscribeStatus('error')
    } finally {
      setIsSubscribing(false)
    }
  }

  const closeModal = () => {
    setShowEmailModal(false)
    localStorage.setItem('oracle_email', 'true')
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="font-serif text-2xl mb-4">Error Loading Results</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <a
            href="/oracle"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#C9A050] text-black font-medium rounded-lg hover:bg-[#D4B861] transition-colors"
          >
            Start New Reading
          </a>
        </div>
      </div>
    )
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#C9A050] mx-auto mb-4" />
          <p className="text-gray-400">Loading your life path...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Visualization Iframe */}
      <div className="h-[50vh] bg-black border-b border-white/10 relative">
        {visualizationUrl ? (
          <iframe
            src={visualizationUrl}
            className="w-full h-full"
            title="Archetype Visualization"
            sandbox="allow-scripts allow-same-origin"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-[#C9A050] mx-auto mb-4" />
              <p className="text-gray-400">Loading visualization...</p>
            </div>
          </div>
        )}

        {/* Share overlay */}
        <div className="absolute bottom-4 right-4">
          <button
            onClick={() => setShowShareCard(true)}
            className="p-3 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-colors"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Results Content */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Archetype Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#C9A050]/10 border border-[#C9A050]/20 rounded-full mb-6">
              <Compass className="w-4 h-4 text-[#C9A050]" />
              <span className="text-sm text-[#C9A050]">Your Life Path Revealed</span>
            </div>

            <div className="text-7xl md:text-8xl mb-6">
              {result.archetype.emoji}
            </div>

            <h1 className="font-serif text-5xl md:text-6xl mb-4">
              The {result.archetype.name}
            </h1>

            <p className="text-xl text-[#C9A050]">
              {result.archetype.phase}
            </p>
          </motion.div>

          {/* Archetype Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-8"
          >
            <p className="text-lg text-gray-300 leading-relaxed">
              {result.archetype.description}
            </p>
          </motion.div>

          {/* Affirmation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="border-2 border-[#C9A050] rounded-2xl p-8 mb-12"
          >
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-[#C9A050]" />
              <span className="text-sm font-medium text-[#C9A050]">Your Affirmation</span>
            </div>
            <p className="text-xl md:text-2xl font-serif italic text-white">
              "{result.affirmation}"
            </p>
          </motion.div>

          {/* Potential Paths */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-12"
          >
            <h2 className="font-serif text-3xl mb-8 text-center">
              Your Potential Paths
            </h2>

            <div className="space-y-4">
              {result.paths.map((path, index) => (
                <motion.div
                  key={path.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                  className="bg-white/5 border border-white/10 rounded-xl p-6"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-lg">{path.path}</h3>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-[#C9A050]" />
                      <span className="text-[#C9A050] font-medium">{path.score}/10</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400">{path.description}</p>
                  <div className="mt-3 h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${path.score * 10}%` }}
                      transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
                      className="h-full bg-[#C9A050]"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Strengths & Growth Areas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="grid md:grid-cols-2 gap-6 mb-12"
          >
            {/* Strengths */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="font-serif text-xl mb-6 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Strengths
              </h3>
              <ul className="space-y-3">
                {result.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2" />
                    <span className="text-gray-300">{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Growth Areas */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="font-serif text-xl mb-6 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-500" />
                Growth Areas
              </h3>
              <ul className="space-y-3">
                {result.growthAreas.map((area, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2" />
                    <span className="text-gray-300">{area}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Meditation CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="text-center"
          >
            <h3 className="font-serif text-2xl mb-4">Deepen Your Practice</h3>
            <p className="text-gray-400 mb-6">
              This guided meditation is specially selected for your archetype.
            </p>
            <a
              href={`/meditate/${result.recommendedMeditation.slug}`}
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#C9A050] text-black font-medium rounded-lg hover:bg-[#D4B861] transition-colors"
            >
              <Sparkles className="w-5 h-5" />
              {result.recommendedMeditation.title}
              <ArrowRight className="w-5 h-5" />
            </a>
          </motion.div>

          {/* Share CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-12 text-center"
          >
            <p className="text-gray-500 mb-4">Share your archetype with friends</p>
            <ShareButton onClick={() => setShowShareCard(true)} className="mx-auto" />
          </motion.div>
        </div>
      </section>

      {/* Share Card Modal */}
      {showShareCard && result && (
        <ShareCard
          type="archetype"
          title={`The ${result.archetype.name}`}
          subtitle={result.archetype.phase}
          description={result.archetype.description.slice(0, 150) + '...'}
          id={params.id as string}
          onClose={() => setShowShareCard(false)}
        />
      )}

      {/* Email Modal */}
      <AnimatePresence>
        {showEmailModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-6"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#111] border border-[#C9A050]/30 rounded-2xl p-8 max-w-md w-full"
            >
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-gray-500 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#C9A050]/20 rounded-full mb-4">
                  <Sparkles className="w-8 h-8 text-[#C9A050]" />
                </div>
                <h2 className="font-serif text-2xl mb-2">Get Your Full Report</h2>
                <p className="text-gray-400">
                  Receive detailed insights, personalized guidance, and weekly wisdom for your archetype.
                </p>
              </div>

              {subscribeStatus === 'success' ? (
                <div className="text-center py-4">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <p className="text-green-500">Successfully subscribed!</p>
                </div>
              ) : (
                <form onSubmit={handleSubscribe}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#C9A050]/50 mb-4"
                  />

                  {subscribeStatus === 'error' && (
                    <p className="text-red-400 text-sm mb-4">
                      Something went wrong. Please try again.
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={isSubscribing}
                    className="w-full py-3 bg-[#C9A050] text-black font-medium rounded-lg hover:bg-[#D4B861] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSubscribing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Subscribing...
                      </>
                    ) : (
                      'Get My Full Report'
                    )}
                  </button>
                </form>
              )}

              <p className="text-xs text-gray-500 text-center mt-4">
                No spam. Unsubscribe anytime.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
