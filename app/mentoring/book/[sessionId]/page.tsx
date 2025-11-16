'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

const sessionDetails: Record<string, any> = {
  'modeling-career': {
    title: 'Modeling Career Development',
    duration: '60 minutes',
    price: 150,
    priceId: 'price_modeling_career', // Replace with actual Stripe Price ID
  },
  'creative-process': {
    title: 'Creative Process & Performance',
    duration: '60 minutes',
    price: 150,
    priceId: 'price_creative_process',
  },
  'ai-engineering': {
    title: 'AI Architecture Consultation',
    duration: '90 minutes',
    price: 250,
    priceId: 'price_ai_engineering',
  },
  'life-transformation': {
    title: 'Personal Transformation Coaching',
    duration: '90 minutes',
    price: 200,
    priceId: 'price_life_transformation',
  },
}

export default function BookSessionPage() {
  const params = useParams()
  const router = useRouter()
  const sessionId = params.sessionId as string
  const session = sessionDetails[sessionId]

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    preferredDate: '',
    preferredTime: '',
    goals: '',
    experience: '',
  })
  const [loading, setLoading] = useState(false)

  if (!session) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-light mb-4">Session Not Found</h1>
          <a href="/mentoring" className="text-accent-gold hover:underline">
            ← Back to Mentoring
          </a>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Create Stripe Checkout Session
      const response = await fetch('/api/create-mentoring-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionType: sessionId,
          priceId: session.priceId,
          formData,
        }),
      })

      const { sessionId: checkoutSessionId } = await response.json()

      // Redirect to Stripe Checkout URL
      if (checkoutSessionId) {
        window.location.href = `https://checkout.stripe.com/c/pay/${checkoutSessionId}`
      }
    } catch (error) {
      console.error('Booking error:', error)
      alert('Failed to process booking. Please try again.')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container-wide py-32">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <a href="/mentoring" className="text-accent-gold hover:underline mb-4 inline-block">
              ← Back to All Sessions
            </a>
            <h1 className="text-4xl md:text-5xl font-light font-serif mb-4">
              Book: {session.title}
            </h1>
            <div className="flex items-center gap-4 text-white/60">
              <span>{session.duration}</span>
              <span>·</span>
              <span className="text-accent-gold">${session.price}</span>
            </div>
          </motion.div>

          {/* Booking Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSubmit}
            className="border border-white/10 p-8 md:p-12 space-y-8"
          >
            {/* Personal Info */}
            <div className="space-y-6">
              <h2 className="text-2xl font-light font-serif">Your Information</h2>

              <div>
                <label className="block text-sm tracking-wider uppercase text-accent-gold mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white focus:border-accent-gold/50 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm tracking-wider uppercase text-accent-gold mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white focus:border-accent-gold/50 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm tracking-wider uppercase text-accent-gold mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white focus:border-accent-gold/50 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="w-full h-px bg-white/10" />

            {/* Scheduling */}
            <div className="space-y-6">
              <h2 className="text-2xl font-light font-serif">Preferred Schedule</h2>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm tracking-wider uppercase text-accent-gold mb-2">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    value={formData.preferredDate}
                    onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white focus:border-accent-gold/50 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm tracking-wider uppercase text-accent-gold mb-2">
                    Preferred Time (PST)
                  </label>
                  <input
                    type="time"
                    value={formData.preferredTime}
                    onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white focus:border-accent-gold/50 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <p className="text-white/60 text-sm">
                I'll confirm availability and send a calendar invite after booking
              </p>
            </div>

            <div className="w-full h-px bg-white/10" />

            {/* Session Goals */}
            <div className="space-y-6">
              <h2 className="text-2xl font-light font-serif">Tell Me About Your Goals</h2>

              <div>
                <label className="block text-sm tracking-wider uppercase text-accent-gold mb-2">
                  What do you hope to achieve from this session? *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.goals}
                  onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                  placeholder="Share what you're working on, challenges you're facing, or questions you have..."
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-accent-gold/50 focus:outline-none transition-colors resize-none"
                />
              </div>

              <div>
                <label className="block text-sm tracking-wider uppercase text-accent-gold mb-2">
                  Current Experience Level
                </label>
                <textarea
                  rows={3}
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  placeholder="Brief background relevant to this session..."
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-accent-gold/50 focus:outline-none transition-colors resize-none"
                />
              </div>
            </div>

            <div className="w-full h-px bg-white/10" />

            {/* Summary */}
            <div className="bg-white/5 p-6 space-y-4">
              <h3 className="text-xl font-light">Session Summary</h3>
              <div className="space-y-2 text-white/70">
                <div className="flex justify-between">
                  <span>{session.title}</span>
                  <span className="text-accent-gold">${session.price}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Duration:</span>
                  <span>{session.duration}</span>
                </div>
              </div>
              <div className="w-full h-px bg-white/10" />
              <div className="flex justify-between text-xl font-light">
                <span>Total</span>
                <span className="text-accent-gold">${session.price}</span>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-8 py-4 bg-accent-gold text-black font-medium tracking-wider hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'PROCESSING...' : `PAY $${session.price} & BOOK SESSION`}
            </button>

            <p className="text-white/40 text-sm text-center">
              Secure payment powered by Stripe • You'll receive a confirmation email after booking
            </p>
          </motion.form>
        </div>
      </div>
    </div>
  )
}
