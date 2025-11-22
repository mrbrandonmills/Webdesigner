'use client'

import { useState } from 'react'
import { Mail, User, Check, AlertCircle } from 'lucide-react'

interface Block3SignupFormProps {
  variant?: 'hero' | 'inline' | 'footer'
  className?: string
}

export function Block3SignupForm({ variant = 'hero', className = '' }: Block3SignupFormProps) {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')

    try {
      const response = await fetch('/api/email/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name,
          source: 'block-3-landing'
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Subscription failed')
      }

      setStatus('success')
      setEmail('')
      setName('')

      // Track conversion
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'block3_email_signup', {
          event_category: 'engagement',
          event_label: 'Block 3 Email Capture'
        })
      }
    } catch (error) {
      setStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'Failed to subscribe')
    }
  }

  if (status === 'success') {
    return (
      <div className={`bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-8 text-center border border-green-200 dark:border-green-800 ${className}`}>
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          You're on the list!
        </h3>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          I'll notify you the moment Block 3 is published on Amazon.
          <br />
          In the meantime, enjoy reading below.
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Check your inbox for a confirmation email.
        </p>
      </div>
    )
  }

  if (variant === 'hero') {
    return (
      <div className={`bg-black/40 backdrop-blur-md rounded-2xl p-8 border border-gold/20 ${className}`}>
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gold to-amber-600 rounded-full mb-4">
            <Mail className="w-8 h-8 text-black" />
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 font-serif">
            Get Notified When Block 3 Publishes
          </h3>
          <p className="text-gray-300 text-lg">
            Be the first to know when the final chapter is available on Amazon
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name-hero" className="block text-sm font-medium text-gray-300 mb-2">
              Your Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="name-hero"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Brandon Mills"
                required
                className="w-full pl-11 pr-4 py-3 bg-black/30 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email-hero" className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="email-hero"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="brandon@example.com"
                required
                className="w-full pl-11 pr-4 py-3 bg-black/30 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
              />
            </div>
          </div>

          {status === 'error' && (
            <div className="flex items-start gap-2 p-4 bg-red-900/20 border border-red-800 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-300">{errorMessage}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full py-4 px-6 bg-gradient-to-r from-gold to-amber-600 hover:from-amber-600 hover:to-gold text-black font-bold rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-lg"
          >
            {status === 'loading' ? 'Subscribing...' : 'Notify Me When It Launches'}
          </button>

          <p className="text-xs text-gray-400 text-center">
            No spam. Unsubscribe anytime. I respect your inbox.
          </p>
        </form>
      </div>
    )
  }

  // Inline and footer variants
  return (
    <div className={`bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800 ${className}`}>
      <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3 text-center">
        Want to know when Block 3 is on Amazon?
      </h4>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          required
          className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
        />

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
        />

        {status === 'error' && (
          <p className="text-sm text-red-600 dark:text-red-400">{errorMessage}</p>
        )}

        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
        >
          {status === 'loading' ? 'Subscribing...' : 'Get Notified'}
        </button>
      </form>
    </div>
  )
}
