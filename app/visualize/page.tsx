'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Sparkles, Brain, ArrowRight, Loader2 } from 'lucide-react'

export default function VisualizeMindPage() {
  const router = useRouter()
  const [text, setText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Analysis failed')
      }

      const result = await response.json()
      router.push(`/visualize/${result.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
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

            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
              Paste any essay, journal entry, or stream of consciousness.
              AI will transform your thoughts into an interactive 3D neural network.
            </p>
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
                placeholder="Paste your text here... (minimum 50 characters)"
                className="w-full h-64 p-6 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#C9A050]/50 resize-none"
                disabled={isLoading}
              />
              <div className="absolute bottom-4 right-4 text-sm text-gray-500">
                {text.length}/10,000
              </div>
            </div>

            {error && (
              <p className="mt-4 text-red-400 text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={text.length < 50 || isLoading}
              className="mt-6 w-full py-4 bg-[#C9A050] text-black font-medium rounded-lg hover:bg-[#D4B861] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing your mind...
                </>
              ) : (
                <>
                  <Brain className="w-5 h-5" />
                  Generate Visualization
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </motion.form>

          {/* Example prompts */}
          <div className="mt-12">
            <p className="text-sm text-gray-500 mb-4">Try an example:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {examplePrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => setText(prompt)}
                  className="px-4 py-2 text-sm bg-white/5 border border-white/10 rounded-full hover:border-[#C9A050]/50 transition-colors"
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
    </div>
  )
}
