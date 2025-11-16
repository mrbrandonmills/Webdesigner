'use client'

import { useState } from 'react'
import { Check, Sparkles, Zap, Crown } from 'lucide-react'
import { motion } from 'framer-motion'

interface MeditationBundleOfferProps {
  onClose?: () => void
}

export function MeditationBundleOffer({ onClose }: MeditationBundleOfferProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleUnlockBundle = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/checkout/meditation-bundle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        setError(data.error || 'Failed to create checkout session')
        setIsLoading(false)
      }
    } catch (err) {
      console.error('Bundle checkout error:', err)
      setError('Unable to process payment. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-accent-gold/20 to-accent-gold/5 border-2 border-accent-gold/30 rounded-2xl p-8 backdrop-blur-xl relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-accent-gold/10 rounded-full blur-3xl -z-10" />

      {/* Crown Icon */}
      <div className="flex items-center justify-center mb-6">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent-gold to-accent-gold/60 flex items-center justify-center">
          <Crown size={32} className="text-black" />
        </div>
      </div>

      {/* Heading */}
      <div className="text-center mb-6">
        <div className="inline-block px-4 py-1.5 bg-accent-gold/20 border border-accent-gold/30 rounded-full mb-4">
          <span className="text-accent-gold text-sm font-medium">LIMITED TIME OFFER</span>
        </div>
        <h3 className="text-3xl md:text-4xl font-light text-white mb-3">
          Complete Collection Bundle
        </h3>
        <p className="text-white/70 text-lg">
          Unlock all 10 premium meditations and save 40%
        </p>
      </div>

      {/* Pricing Comparison */}
      <div className="flex items-center justify-center gap-6 mb-8">
        <div className="text-center">
          <div className="text-white/40 text-sm mb-1 line-through">Individual Price</div>
          <div className="text-white/60 text-2xl font-light">$50</div>
        </div>
        <div className="text-white/40 text-3xl">→</div>
        <div className="text-center">
          <div className="text-accent-gold text-sm mb-1 font-medium">Bundle Price</div>
          <div className="text-accent-gold text-4xl font-light">$30</div>
        </div>
      </div>

      {/* Savings Badge */}
      <div className="text-center mb-8">
        <div className="inline-block px-6 py-3 bg-black/40 border border-accent-gold/20 rounded-xl">
          <div className="flex items-center gap-2">
            <Sparkles size={20} className="text-accent-gold" />
            <span className="text-white font-medium">Save $20 (40% OFF)</span>
          </div>
        </div>
      </div>

      {/* What's Included */}
      <div className="mb-8 p-6 bg-black/30 rounded-xl border border-white/10">
        <h4 className="text-white text-lg font-light mb-4 flex items-center gap-2">
          <Check size={20} className="text-accent-gold" />
          What's Included:
        </h4>
        <ul className="grid md:grid-cols-2 gap-3">
          <li className="flex items-start gap-2 text-white/70 text-sm">
            <Check size={16} className="text-accent-gold flex-shrink-0 mt-0.5" />
            All 10 premium meditations
          </li>
          <li className="flex items-start gap-2 text-white/70 text-sm">
            <Check size={16} className="text-accent-gold flex-shrink-0 mt-0.5" />
            4 professional voices per meditation
          </li>
          <li className="flex items-start gap-2 text-white/70 text-sm">
            <Check size={16} className="text-accent-gold flex-shrink-0 mt-0.5" />
            Lifetime unlimited access
          </li>
          <li className="flex items-start gap-2 text-white/70 text-sm">
            <Check size={16} className="text-accent-gold flex-shrink-0 mt-0.5" />
            HD audio quality
          </li>
          <li className="flex items-start gap-2 text-white/70 text-sm">
            <Check size={16} className="text-accent-gold flex-shrink-0 mt-0.5" />
            Instant access after purchase
          </li>
          <li className="flex items-start gap-2 text-white/70 text-sm">
            <Check size={16} className="text-accent-gold flex-shrink-0 mt-0.5" />
            Future updates included
          </li>
        </ul>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
          <p className="text-red-400 text-sm text-center">{error}</p>
        </div>
      )}

      {/* CTA Button */}
      <button
        onClick={handleUnlockBundle}
        disabled={isLoading}
        className="w-full py-5 px-8 bg-accent-gold hover:bg-accent-hover text-black font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg shadow-lg shadow-accent-gold/20"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            Processing...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <Zap size={20} />
            Unlock Complete Collection - $30
          </span>
        )}
      </button>

      {/* Trust Indicators */}
      <div className="mt-6 pt-6 border-t border-white/10">
        <p className="text-white/40 text-xs text-center leading-relaxed">
          One-time payment • Secure checkout via Stripe • 30-day money-back guarantee
        </p>
      </div>
    </motion.div>
  )
}
