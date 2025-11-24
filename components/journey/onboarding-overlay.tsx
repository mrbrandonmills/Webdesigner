'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { DevicePreference } from '@/lib/journey/preferences'
import { detectDevice } from '@/lib/journey/preferences'
import { preloadJourneyAssets, type PreloadProgress } from '@/lib/journey/preloader'

interface OnboardingOverlayProps {
  isOpen: boolean
  onComplete: (device: DevicePreference, accessibility: boolean) => void
}

/**
 * Luxury onboarding overlay
 * Appears on first visit to journey page
 */
export function OnboardingOverlay({ isOpen, onComplete }: OnboardingOverlayProps) {
  const [step, setStep] = useState<'welcome' | 'device' | 'loading'>('welcome')
  const [selectedDevice, setSelectedDevice] = useState<DevicePreference | null>(null)
  const [accessibility, setAccessibility] = useState(false)
  const [preloadProgress, setPreloadProgress] = useState<PreloadProgress>({
    loaded: 0,
    total: 0,
    percentage: 0,
    currentAsset: ''
  })

  // Auto-detect device on mount
  useEffect(() => {
    if (isOpen) {
      const detected = detectDevice()
      setSelectedDevice(detected)
    }
  }, [isOpen])

  const handleDeviceSelect = async (device: DevicePreference) => {
    setSelectedDevice(device)
  }

  const handleContinue = async () => {
    if (!selectedDevice) return

    setStep('loading')

    // Preload assets while showing progress
    await preloadJourneyAssets((progress) => {
      setPreloadProgress(progress)
    })

    // Small delay for smooth transition
    await new Promise((resolve) => setTimeout(resolve, 500))

    onComplete(selectedDevice, accessibility)
  }

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black"
        >
          {/* Content */}
          <div className="relative z-10 w-full max-w-2xl px-8">
            {step === 'welcome' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="text-center"
              >
                <h1 className="font-serif text-5xl md:text-6xl text-white mb-8 tracking-wide">
                  Welcome
                </h1>
                <p className="text-xl text-white/60 mb-12 max-w-lg mx-auto leading-relaxed">
                  Begin a journey through visual storytelling, philosophy, and innovation
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setStep('device')}
                  className="px-12 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-full hover:bg-white/20 transition-all duration-300"
                >
                  Begin
                </motion.button>
              </motion.div>
            )}

            {step === 'device' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="text-center"
              >
                <h2 className="font-serif text-4xl text-white mb-4">
                  Let's tailor your experience
                </h2>
                <p className="text-white/60 mb-12">
                  Choose how you'd like to explore
                </p>

                {/* Device Selection */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                  {[
                    { value: 'phone' as DevicePreference, icon: '📱', label: 'Phone', desc: 'Optimized for mobile' },
                    { value: 'desktop' as DevicePreference, icon: '💻', label: 'Desktop', desc: 'Full experience' },
                    { value: 'both' as DevicePreference, icon: '🌐', label: 'Both', desc: 'Responsive' }
                  ].map((option) => (
                    <motion.button
                      key={option.value}
                      whileHover={{ scale: 1.05, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDeviceSelect(option.value)}
                      className={`p-8 rounded-2xl border-2 transition-all duration-300 ${
                        selectedDevice === option.value
                          ? 'bg-white/20 border-white/60'
                          : 'bg-white/5 border-white/10 hover:border-white/30'
                      }`}
                    >
                      <div className="text-5xl mb-4">{option.icon}</div>
                      <div className="font-serif text-2xl text-white mb-2">{option.label}</div>
                      <div className="text-sm text-white/50">{option.desc}</div>
                    </motion.button>
                  ))}
                </div>

                {/* Accessibility Option */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setAccessibility(!accessibility)}
                  className="flex items-center justify-center gap-3 mx-auto mb-12 text-white/60 hover:text-white transition-colors"
                >
                  <div
                    className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                      accessibility ? 'bg-white/20 border-white' : 'border-white/30'
                    }`}
                  >
                    {accessibility && <div className="w-3 h-3 bg-white rounded-sm" />}
                  </div>
                  <span>I need accessible navigation</span>
                </motion.button>

                {/* Continue Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleContinue}
                  disabled={!selectedDevice}
                  className="px-16 py-4 bg-white text-black rounded-full font-medium hover:bg-white/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                </motion.button>
              </motion.div>
            )}

            {step === 'loading' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center"
              >
                <h2 className="font-serif text-4xl text-white mb-8">
                  Preparing your journey
                </h2>

                {/* Progress Bar */}
                <div className="w-full max-w-md mx-auto mb-8">
                  <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${preloadProgress.percentage}%` }}
                      transition={{ duration: 0.3 }}
                      className="h-full bg-white"
                    />
                  </div>
                </div>

                <p className="text-white/60">
                  {preloadProgress.currentAsset}... {preloadProgress.percentage}%
                </p>
              </motion.div>
            )}
          </div>

          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div
              className="w-full h-full"
              style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                backgroundSize: '40px 40px'
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
