'use client'

import { motion, AnimatePresence } from 'framer-motion'
import type { JourneyStop } from '@/lib/types/journey'

interface StopIndicatorProps {
  stop: JourneyStop | null
  isVisible: boolean
}

/**
 * StopIndicator - Shows current stop information
 * Appears when approaching a stop
 */
export function StopIndicator({ stop, isVisible }: StopIndicatorProps) {
  if (!stop) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{
            type: 'spring',
            stiffness: 150,
            damping: 20
          }}
          className="fixed top-8 left-1/2 -translate-x-1/2 z-40"
        >
          <div
            className="px-8 py-4 rounded-full backdrop-blur-md border-2"
            style={{
              backgroundColor: stop.color + '20',
              borderColor: stop.color + '60',
              boxShadow: `0 0 40px ${stop.color}40`
            }}
          >
            <div className="flex items-center gap-4">
              {/* Animated dot */}
              <motion.div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: stop.color }}
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [1, 0.7, 1]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              />

              {/* Stop info */}
              <div>
                <div
                  className="text-2xl font-serif tracking-tight"
                  style={{
                    color: stop.color,
                    fontFamily: 'var(--font-cormorant)'
                  }}
                >
                  {stop.name}
                </div>
                <div className="text-sm text-white/60">{stop.description}</div>
              </div>

              {/* Type badge */}
              {stop.type === 'TRANSFER' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: stop.color + '30',
                    color: stop.color
                  }}
                >
                  Transfer Point
                </motion.div>
              )}
            </div>
          </div>

          {/* Scroll hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-4 text-white/40 text-sm"
          >
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            >
              Scroll to explore
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
