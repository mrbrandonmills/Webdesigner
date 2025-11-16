'use client'

import { useState } from 'react'
import { Check, Lock, Sparkles, Shield, Zap } from 'lucide-react'
import { motion } from 'framer-motion'
import type { Meditation } from '@/lib/meditations-data'

interface MeditationUnlockGateProps {
  meditation: Meditation
  onUnlock?: () => void
}

export function MeditationUnlockGate({ meditation, onUnlock }: MeditationUnlockGateProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleUnlock = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Create Stripe checkout session
      const response = await fetch('/api/checkout/meditation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          meditationSlug: meditation.slug,
        }),
      })

      const data = await response.json()

      if (data.url) {
        // Redirect to Stripe checkout
        window.location.href = data.url
      } else {
        setError(data.error || 'Failed to create checkout session')
        setIsLoading(false)
      }
    } catch (err) {
      console.error('Checkout error:', err)
      setError('Unable to process payment. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-gradient-to-br from-accent-gold/10 to-transparent border border-accent-gold/20 rounded-2xl p-8 backdrop-blur-xl">
      {/* Lock Icon */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-accent-gold/20 to-accent-gold/5 border-2 border-accent-gold/30 flex items-center justify-center"
      >
        <Lock size={36} className="text-accent-gold" />
      </motion.div>

      {/* Heading */}
      <h3 className="text-3xl font-light text-white text-center mb-4">
        Unlock This Meditation
      </h3>
      <p className="text-white/60 text-center mb-8 max-w-md mx-auto">
        Get instant access to {meditation.duration} of premium guided meditation with your choice of 4 professional voices.
      </p>

      {/* Price */}
      <div className="text-center mb-8">
        <div className="inline-block px-8 py-4 bg-black/30 rounded-2xl border border-accent-gold/20">
          <div className="text-white/60 text-sm mb-1">One-time payment</div>
          <div className="text-accent-gold text-5xl font-light">
            ${meditation.price}
          </div>
          <div className="text-white/40 text-xs mt-1">Lifetime access</div>
        </div>
      </div>

      {/* Benefits */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="text-center p-4 bg-black/20 rounded-xl border border-white/5">
          <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-accent-gold/10 flex items-center justify-center">
            <Zap size={20} className="text-accent-gold" />
          </div>
          <div className="text-white text-sm font-medium mb-1">Instant Access</div>
          <div className="text-white/50 text-xs">Listen immediately after purchase</div>
        </div>

        <div className="text-center p-4 bg-black/20 rounded-xl border border-white/5">
          <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-accent-gold/10 flex items-center justify-center">
            <Sparkles size={20} className="text-accent-gold" />
          </div>
          <div className="text-white text-sm font-medium mb-1">4 Premium Voices</div>
          <div className="text-white/50 text-xs">British & Indian narrators</div>
        </div>

        <div className="text-center p-4 bg-black/20 rounded-xl border border-white/5">
          <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-accent-gold/10 flex items-center justify-center">
            <Shield size={20} className="text-accent-gold" />
          </div>
          <div className="text-white text-sm font-medium mb-1">Secure Payment</div>
          <div className="text-white/50 text-xs">Powered by Stripe</div>
        </div>
      </div>

      {/* What's Included */}
      <div className="mb-8 p-6 bg-black/20 rounded-xl border border-white/5">
        <h4 className="text-white text-lg font-light mb-4">What You'll Get:</h4>
        <ul className="space-y-3">
          {meditation.benefits.slice(0, 4).map((benefit, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-accent-gold/20 border border-accent-gold/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check size={12} className="text-accent-gold" />
              </div>
              <span className="text-white/70 text-sm">{benefit}</span>
            </li>
          ))}
          <li className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-accent-gold/20 border border-accent-gold/30 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Check size={12} className="text-accent-gold" />
            </div>
            <span className="text-white/70 text-sm">HD audio quality, optimized for all devices</span>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-accent-gold/20 border border-accent-gold/30 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Check size={12} className="text-accent-gold" />
            </div>
            <span className="text-white/70 text-sm">Unlimited replays, lifetime access</span>
          </li>
        </ul>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
          <p className="text-red-400 text-sm text-center">{error}</p>
        </div>
      )}

      {/* Unlock Button */}
      <button
        onClick={handleUnlock}
        disabled={isLoading}
        className="w-full py-4 px-8 bg-accent-gold hover:bg-accent-hover text-black font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            Processing...
          </span>
        ) : (
          `Unlock for $${meditation.price}`
        )}
      </button>

      {/* Trust Indicators */}
      <div className="mt-6 pt-6 border-t border-white/10">
        <p className="text-white/40 text-xs text-center leading-relaxed">
          Secure checkout powered by Stripe • 30-day money-back guarantee •
          Questions? Email support@brandonmills.com
        </p>
      </div>

      {/* Bundle Upsell */}
      <div className="mt-8 p-6 bg-gradient-to-br from-accent-gold/5 to-transparent border border-accent-gold/10 rounded-xl">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-accent-gold/20 flex items-center justify-center flex-shrink-0">
            <Sparkles size={24} className="text-accent-gold" />
          </div>
          <div className="flex-1">
            <h4 className="text-white font-medium mb-2">Save 40% with Complete Access</h4>
            <p className="text-white/60 text-sm mb-4">
              Get all 10 meditations for just $30 (normally $50). Unlock the complete collection and save.
            </p>
            <a
              href="/meditations?bundle=true"
              className="inline-flex items-center gap-2 text-accent-gold hover:text-accent-hover text-sm font-medium transition-colors"
            >
              View Bundle Deal →
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
