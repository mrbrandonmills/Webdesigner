'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import type { JourneyStop } from '@/lib/types/journey'

interface TransferModalProps {
  stop: JourneyStop | null
  isOpen: boolean
  onClose: () => void
  onEnter: (subLineId: string) => void
  onContinue: () => void
}

/**
 * TransferModal - UI for TRANSFER stops (Blog, Shop, Mind Tools)
 * Allows user to enter sub-journeys or continue main journey
 */
export function TransferModal({
  stop,
  isOpen,
  onClose,
  onEnter,
  onContinue
}: TransferModalProps) {
  if (!stop || !isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{
            type: 'spring',
            stiffness: 150,
            damping: 20
          }}
          className="relative bg-gradient-to-br from-zinc-900 to-black border border-white/10 p-12 rounded-lg max-w-2xl w-full mx-4 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6 text-white/60 hover:text-white" />
          </button>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <h2
              className="font-serif text-5xl text-white mb-3 tracking-tight"
              style={{ fontFamily: 'var(--font-cormorant)' }}
            >
              {stop.name}
            </h2>
            <p className="text-white/60 text-lg">{stop.description}</p>
          </motion.div>

          {/* Sub-lines */}
          {stop.subLines && stop.subLines.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="space-y-4 mb-8"
            >
              {stop.subLines.map((line, index) => (
                <motion.button
                  key={line.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  onClick={() => {
                    onEnter(line.id)
                    onClose()
                  }}
                  className="w-full text-left p-6 bg-zinc-900/50 hover:bg-zinc-800/50 border border-white/5 hover:border-white/20 rounded-lg transition-all group"
                  whileHover={{ scale: 1.02, x: 8 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div
                        className="text-xl text-white mb-1 group-hover:text-white/90 transition-colors"
                        style={{ color: stop.color }}
                      >
                        {line.name}
                      </div>
                      {line.stops && (
                        <div className="text-sm text-white/40">
                          {line.stops} destinations
                        </div>
                      )}
                    </div>
                    <svg
                      className="w-6 h-6 text-white/40 group-hover:text-white/80 transform group-hover:translate-x-1 transition-all"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </motion.button>
              ))}
            </motion.div>
          )}

          {/* Continue button */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            onClick={() => {
              onContinue()
              onClose()
            }}
            className="w-full p-6 bg-gradient-to-r from-zinc-800/50 to-zinc-900/50 hover:from-zinc-700/50 hover:to-zinc-800/50 border border-white/10 hover:border-white/30 text-white rounded-lg transition-all"
            style={{
              boxShadow: `0 0 30px ${stop.color}20`
            }}
          >
            <div className="flex items-center justify-center gap-3">
              <span className="text-lg">Continue Journey</span>
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </div>
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
