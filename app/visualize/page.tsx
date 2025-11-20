'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Sparkles, Brain, ArrowRight } from 'lucide-react'
import { VoiceInput } from '@/components/voice-input'
import GenerationLoader from '@/components/generation-loader'
import { ActivityCounter } from '@/components/social-proof/activity-counter'
import { TestimonialCarousel } from '@/components/social-proof/testimonials'
import { ErrorBoundary } from '@/components/error-boundary'

// Analytics tracking helper
function trackEvent(eventName: string, properties?: Record<string, any>) {
  try {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', eventName, properties)
    }
  } catch (err) {
    console.warn('Analytics tracking failed:', err)
  }
}

function VisualizeMindPageContent() {
  const router = useRouter()
  const [text, setText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Track page view
  useEffect(() => {
    trackEvent('page_view', {
      page_title: 'Mind Visualizer',
      page_location: '/visualize'
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Additional client-side validation
    if (text.length < 50) {
      setError('Please enter at least 50 characters for meaningful analysis')
      setIsLoading(false)
      return
    }

    if (text.length > 10000) {
      setError('Text is too long. Please keep it under 10,000 characters to avoid API limits')
      setIsLoading(false)
      return
    }

    try {
      // Add timeout to the fetch request
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 120000) // 2 minute timeout for entire request

      const response = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Analysis failed')
      }

      const result = await response.json()

      // Store result in BOTH sessionStorage and localStorage for persistence
      const visualizationData = JSON.stringify(result)
      try {
        sessionStorage.setItem(`visualization_${result.id}`, visualizationData)
      } catch (storageErr) {
        console.warn('Failed to save to sessionStorage:', storageErr)
      }

      try {
        localStorage.setItem(`visualization_${result.id}`, visualizationData)
      } catch (storageErr) {
        console.warn('Failed to save to localStorage:', storageErr)
      }

      // Track successful generation
      trackEvent('visualization_generated', {
        text_length: text.length,
        processing_time_ms: result.metadata?.processingTimeMs,
        dominant_archetype: result.analysis?.dominantArchetype
      })

      // Navigate to results page
      router.push(`/visualize/${result.id}`)
    } catch (err) {
      // Track error
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      trackEvent('visualization_error', {
        error_message: errorMessage,
        text_length: text.length
      })

      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          setError('Request timed out. Your text may be too long or complex. Try with a shorter essay.')
        } else {
          setError(err.message)
        }
      } else {
        setError('Something went wrong. Please try again.')
      }
      setIsLoading(false)
    }
  }

  const examplePrompts = [
    "I believe that personal growth comes from embracing discomfort and challenging our limiting beliefs...",
    "My morning routine starts with meditation, followed by journaling about gratitude and intentions...",
    "The intersection of philosophy and neuroscience reveals fascinating insights about consciousness..."
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="relative py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#C9A050]/10 border border-[#C9A050]/20 rounded-full mb-8">
              <Sparkles className="w-4 h-4 text-[#C9A050]" />
              <span className="text-sm text-[#C9A050]">Powered by Gemini AI</span>
            </div>

            <h1 className="font-serif text-5xl md:text-7xl mb-6">
              Visualize Your Mind
            </h1>

            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Paste any essay, journal entry, or stream of consciousness.
              AI will transform your thoughts into an interactive 3D neural network.
            </p>

            {/* Activity Counter */}
            <ActivityCounter type="visualize" className="mb-12" />
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
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste your text here, or use voice input... (minimum 50 characters)"
                className="w-full h-64 p-6 pb-16 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#C9A050]/50 resize-none"
                disabled={isLoading}
                aria-label="Essay or journal entry text"
                aria-describedby="text-counter"
                aria-required="true"
                aria-invalid={text.length > 0 && text.length < 50}
              />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <VoiceInput
                  onTranscript={(transcript) => setText(prev => prev ? prev + ' ' + transcript : transcript)}
                  disabled={isLoading}
                />
                <span id="text-counter" className="text-sm text-gray-500" aria-live="polite">
                  {text.length}/10,000 characters
                </span>
              </div>
            </div>

            {error && (
              <div
                role="alert"
                aria-live="polite"
                className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-sm text-red-300"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={text.length < 50 || isLoading}
              className="mt-6 w-full py-4 bg-[#C9A050] text-black font-medium rounded-lg hover:bg-[#D4B861] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              aria-label="Generate mind visualization from your text"
              aria-busy={isLoading}
            >
              <Brain className="w-5 h-5" aria-hidden="true" />
              Generate Visualization
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </button>

            <GenerationLoader
              isLoading={isLoading}
              message="Creating your 3D mind map..."
              subMessage="AI is analyzing your text and generating a custom Three.js visualization. This takes 1-2 minutes."
              color="#C9A050"
            />
          </motion.form>

          {/* Example prompts */}
          <div className="mt-12">
            <p className="text-sm text-gray-500 mb-4">Try an example:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {examplePrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setText(prompt)
                    trackEvent('example_prompt_clicked', { example_number: i + 1 })
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      setText(prompt)
                      trackEvent('example_prompt_clicked', { example_number: i + 1 })
                    }
                  }}
                  className="px-4 py-2 text-sm bg-white/5 border border-white/10 rounded-full hover:border-[#C9A050]/50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#C9A050]/50"
                  aria-label={`Load example ${i + 1}`}
                  tabIndex={0}
                >
                  Example {i + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6 border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-3xl text-center mb-16">How It Works</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Paste Your Text',
                description: 'Any essay, journal, or stream of consciousness works'
              },
              {
                step: '02',
                title: 'AI Analysis',
                description: 'Gemini identifies concepts, connections, and patterns'
              },
              {
                step: '03',
                title: '3D Visualization',
                description: 'Explore your thinking as an interactive neural network'
              }
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="text-4xl font-serif text-[#C9A050] mb-4">{item.step}</div>
                <h3 className="font-medium mb-2">{item.title}</h3>
                <p className="text-sm text-gray-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 border-t border-white/10">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-serif text-3xl text-center mb-16">See What Others Created</h2>
          <TestimonialCarousel filter="visualize" />
        </div>
      </section>
    </div>
  )
}

// Export wrapped with ErrorBoundary
export default function VisualizeMindPage() {
  return (
    <ErrorBoundary
      onReset={() => {
        // Clear any stored state on error reset
        if (typeof window !== 'undefined') {
          window.location.reload()
        }
      }}
    >
      <VisualizeMindPageContent />
    </ErrorBoundary>
  )
}
