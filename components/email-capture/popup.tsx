'use client'

import { useState, useEffect, useCallback } from 'react'
import { X, Mail, Check, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function EmailPopup() {
  const [isVisible, setIsVisible] = useState(false)
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  // Check if popup should show
  useEffect(() => {
    // Don't show if already shown this session
    const hasShown = sessionStorage.getItem('email-popup-shown')
    if (hasShown) return

    let timeoutId: NodeJS.Timeout
    let hasTriggered = false

    // Trigger after 30 seconds
    timeoutId = setTimeout(() => {
      if (!hasTriggered) {
        hasTriggered = true
        setIsVisible(true)
        sessionStorage.setItem('email-popup-shown', 'true')
      }
    }, 30000)

    // Exit intent detection (mouse leaves viewport at top)
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasTriggered) {
        hasTriggered = true
        clearTimeout(timeoutId)
        setIsVisible(true)
        sessionStorage.setItem('email-popup-shown', 'true')
      }
    }

    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      clearTimeout(timeoutId)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

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
        body: JSON.stringify({ email, source: 'popup' }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to subscribe')
      }

      setStatus('success')

      // Close popup after success
      setTimeout(() => {
        setIsVisible(false)
      }, 3000)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Something went wrong')
      setStatus('error')
    }
  }

  const handleClose = useCallback(() => {
    setIsVisible(false)
  }, [])

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose()
      }
    }

    if (isVisible) {
      document.addEventListener('keydown', handleEscape)
      // Prevent body scroll
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isVisible, handleClose])

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4"
          >
            <div
              className="relative w-full max-w-md bg-black border border-white/10 rounded-2xl p-8 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors"
                aria-label="Close popup"
              >
                <X className="w-5 h-5" />
              </button>

              {status === 'success' ? (
                /* Success State */
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-8"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-[#C9A050]/20 rounded-full mb-6">
                    <Check className="w-8 h-8 text-[#C9A050]" />
                  </div>
                  <h3 className="font-serif text-2xl mb-3 text-white">
                    You're In!
                  </h3>
                  <p className="text-gray-400">
                    Check your inbox for the Dream Symbols Guide.
                  </p>
                </motion.div>
              ) : (
                /* Form State */
                <>
                  {/* Icon */}
                  <div className="flex justify-center mb-6">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-[#C9A050]/10 border border-[#C9A050]/20 rounded-full">
                      <Sparkles className="w-7 h-7 text-[#C9A050]" />
                    </div>
                  </div>

                  {/* Headline */}
                  <h2 className="font-serif text-2xl md:text-3xl text-center mb-3 text-white">
                    Get the Free Dream Symbols Guide
                  </h2>

                  {/* Subtext */}
                  <p className="text-gray-400 text-center mb-6">
                    100 dream symbols decoded + weekly insights on Jungian psychology and self-discovery.
                  </p>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-4">
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
                        className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#C9A050]/50 focus:ring-1 focus:ring-[#C9A050]/50 transition-all"
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
                      className="w-full py-4 bg-[#C9A050] text-black font-medium rounded-lg hover:bg-[#D4B861] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
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
                        'Get the Free Guide'
                      )}
                    </button>
                  </form>

                  {/* Privacy note */}
                  <p className="text-gray-500 text-xs text-center mt-4">
                    No spam, ever. Unsubscribe anytime.
                  </p>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default EmailPopup
