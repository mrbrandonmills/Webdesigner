'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Moon, Sparkles, Eye, BookOpen, ArrowRight } from 'lucide-react'
import { VoiceInput } from '@/components/voice-input'
import GenerationLoader from '@/components/generation-loader'
import { ActivityCounter } from '@/components/social-proof/activity-counter'
import { TestimonialCarousel } from '@/components/social-proof/testimonials'

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
        throw new Error(data.error || 'Dream analysis failed')
      }

      const result = await response.json()

      // Store result in localStorage for the results page to access
      localStorage.setItem(`dream_result_${result.id}`, JSON.stringify(result))

      router.push(`/dreams/${result.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setIsLoading(false)
    }
  }

  const features = [
    {
      icon: Eye,
      title: 'Symbol Analysis',
      description: 'Decode hidden meanings in dream imagery'
    },
    {
      icon: Sparkles,
      title: 'Jungian Interpretation',
      description: 'Understand archetypes and collective unconscious'
    },
    {
      icon: BookOpen,
      title: 'Sleep Guidance',
      description: 'Personalized recommendations for better dreams'
    }
  ]

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Hero */}
      <section className="relative py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full mb-8">
              <Moon className="w-4 h-4 text-purple-500" />
              <span className="text-sm text-purple-500">Jungian Dream Analysis</span>
            </div>

            <h1 className="font-serif text-5xl md:text-7xl mb-6">
              Dream Decoder
            </h1>

            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Unlock the hidden messages in your dreams. Our AI analyzes symbols,
              archetypes, and patterns through a Jungian lens to reveal deeper meaning.
            </p>

            {/* Activity Counter */}
            <ActivityCounter type="dreams" className="mb-12" />
          </motion.div>

          {/* Input Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-left"
          >
            <div className="relative">
              <textarea
                value={dream}
                onChange={(e) => setDream(e.target.value)}
                placeholder="Describe your dream in detail, or use voice input... What did you see? How did you feel? (minimum 20 characters)"
                className="w-full h-64 p-6 pb-16 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 resize-none"
                disabled={isLoading}
                maxLength={5000}
              />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <VoiceInput
                  onTranscript={(transcript) => setDream(prev => prev ? prev + ' ' + transcript : transcript)}
                  disabled={isLoading}
                />
                <span className="text-sm text-gray-500">
                  {dream.length}/5,000
                </span>
              </div>
            </div>

            {error && (
              <p className="mt-4 text-red-400 text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={dream.length < 20 || isLoading}
              className="mt-6 w-full py-4 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Moon className="w-5 h-5" />
              Decode My Dream
              <ArrowRight className="w-5 h-5" />
            </button>

            <GenerationLoader
              isLoading={isLoading}
              message="Interpreting your dream..."
              subMessage="AI is analyzing symbols, archetypes, and generating your 3D dream visualization. This takes 1-2 minutes."
              color="#8B5CF6"
            />
          </motion.form>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-3xl text-center mb-16">What You'll Discover</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * i }}
                className="text-center p-6 bg-white/5 border border-white/10 rounded-xl"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-500/20 rounded-full mb-4">
                  <feature.icon className="w-6 h-6 text-purple-500" />
                </div>
                <h3 className="font-medium mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 border-t border-white/10">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-serif text-3xl text-center mb-16">What Others Say</h2>
          <TestimonialCarousel filter="dreams" />
        </div>
      </section>
    </div>
  )
}
