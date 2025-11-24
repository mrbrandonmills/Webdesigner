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
          className="fixed top-20 left-1/2 -translate-x-1/2 z-40 max-w-[90vw]"
          style={{
            paddingTop: 'env(safe-area-inset-top)'
          }}
        >
          <div
            className="px-6 py-3 rounded-full backdrop-blur-md border-2"
            style={{
              backgroundColor: stop.color + '20',
              borderColor: stop.color + '60',
              boxShadow: `0 0 40px ${stop.color}40`
            }}
          >
            <div className="flex items-center gap-3">
              {/* Animated dot */}
              <motion.div
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
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
              <div className="flex-1 min-w-0">
                <div
                  className="text-xl md:text-2xl font-serif tracking-tight truncate"
                  style={{
                    color: stop.color,
                    fontFamily: 'var(--font-cormorant)'
                  }}
                >
                  {stop.name}
                </div>
                <div className="text-xs md:text-sm text-white/60 truncate">{stop.description}</div>
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
