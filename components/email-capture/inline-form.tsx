'use client'

import { useState } from 'react'
import { Mail, Check, Sparkles, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

interface InlineEmailFormProps {
  headline?: string
  subtext?: string
  buttonText?: string
  source?: string
  variant?: 'default' | 'compact' | 'featured'
}

export function InlineEmailForm({
  headline = "Get the Free Dream Symbols Guide",
  subtext = "100 dream symbols decoded + weekly insights on Jungian psychology and self-discovery.",
  buttonText = "Get the Free Guide",
  source = "inline",
  variant = "default"
}: InlineEmailFormProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address')
      setStatus('error')
      return
    }

    setStatus('loading')
    setErrorMessage('')

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, source }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to subscribe')
      }

      setStatus('success')
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Something went wrong')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`
          ${variant === 'featured' ? 'p-8 md:p-12' : variant === 'compact' ? 'p-4' : 'p-6 md:p-8'}
          bg-[#C9A050]/10 border border-[#C9A050]/20 rounded-xl text-center
        `}
      >
        <div className="inline-flex items-center justify-center w-12 h-12 bg-[#C9A050]/20 rounded-full mb-4">
          <Check className="w-6 h-6 text-[#C9A050]" />
        </div>
        <h3 className="font-serif text-xl mb-2 text-white">You're In!</h3>
        <p className="text-gray-400">
          Check your inbox for the Dream Symbols Guide.
        </p>
      </motion.div>
    )
  }

  if (variant === 'compact') {
    return (
      <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (status === 'error') {
                  setStatus('idle')
                  setErrorMessage('')
                }
              }}
              placeholder="Enter your email"
              className="w-full pl-10 pr-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#C9A050]/50 transition-all"
              disabled={status === 'loading'}
              autoComplete="email"
            />
          </div>
          <button
            type="submit"
            disabled={status === 'loading'}
            className="px-4 py-3 bg-[#C9A050] text-black text-sm font-medium rounded-lg hover:bg-[#D4B861] disabled:opacity-50 transition-colors whitespace-nowrap"
          >
            {status === 'loading' ? 'Subscribing...' : buttonText}
          </button>
        </form>
        {status === 'error' && errorMessage && (
          <p className="text-red-400 text-xs mt-2">{errorMessage}</p>
        )}
      </div>
    )
  }

  return (
    <div
      className={`
        ${variant === 'featured'
          ? 'p-8 md:p-12 bg-gradient-to-br from-[#C9A050]/20 to-transparent border border-[#C9A050]/30'
          : 'p-6 md:p-8 bg-[#C9A050]/10 border border-[#C9A050]/20'
        }
        rounded-xl
      `}
    >
      {/* Icon */}
      <div className="flex justify-center mb-4">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-[#C9A050]/10 border border-[#C9A050]/20 rounded-full">
          <Sparkles className="w-6 h-6 text-[#C9A050]" />
        </div>
      </div>

      {/* Headline */}
      <h3 className={`font-serif ${variant === 'featured' ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl'} text-center mb-3 text-white`}>
        {headline}
      </h3>

      {/* Subtext */}
      <p className="text-gray-400 text-center mb-6 max-w-md mx-auto">
        {subtext}
      </p>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (status === 'error') {
                setStatus('idle')
                setErrorMessage('')
              }
            }}
            placeholder="Enter your email"
            className="w-full pl-12 pr-4 py-4 bg-black/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#C9A050]/50 focus:ring-1 focus:ring-[#C9A050]/50 transition-all"
            disabled={status === 'loading'}
            autoComplete="email"
          />
        </div>

        {/* Error message */}
        {status === 'error' && errorMessage && (
          <p className="text-red-400 text-sm text-center">
            {errorMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full py-4 bg-[#C9A050] text-black font-medium rounded-lg hover:bg-[#D4B861] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
        >
          {status === 'loading' ? (
            <span className="inline-flex items-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Subscribing...
            </span>
          ) : (
            <>
              {buttonText}
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </form>

      {/* Privacy note */}
      <p className="text-gray-500 text-xs text-center mt-4">
        No spam, ever. Unsubscribe anytime.
      </p>
    </div>
  )
}

export default InlineEmailForm
