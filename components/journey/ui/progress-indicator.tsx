'use client'

import { motion } from 'framer-motion'
import { JOURNEY_STOPS } from '@/lib/types/journey'

interface ProgressIndicatorProps {
  currentStopIndex: number
  onStopClick?: (index: number) => void
}

/**
 * ProgressIndicator - Visual progress through journey
 * Shows all stops and current position
 */
export function ProgressIndicator({
  currentStopIndex,
  onStopClick
}: ProgressIndicatorProps) {
  return (
    <div className="fixed right-8 top-1/2 -translate-y-1/2 z-40">
      <div className="flex flex-col gap-6">
        {JOURNEY_STOPS.map((stop, index) => {
          const isActive = index === currentStopIndex
          const isPassed = index < currentStopIndex
          const isFuture = index > currentStopIndex

          return (
            <motion.button
              key={stop.id}
              onClick={() => onStopClick?.(index)}
              className="relative group"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Stop dot */}
              <div className="relative">
                <motion.div
                  className="w-3 h-3 rounded-full border-2 transition-all"
                  style={{
                    borderColor: isActive
                      ? stop.color
                      : isPassed
                      ? stop.color + '60'
                      : '#ffffff20',
                    backgroundColor: isActive
                      ? stop.color
                      : isPassed
                      ? stop.color + '40'
                      : 'transparent'
                  }}
                  animate={{
                    scale: isActive ? [1, 1.3, 1] : 1
                  }}
                  transition={{
                    duration: 2,
                    repeat: isActive ? Infinity : 0,
                    ease: 'easeInOut'
                  }}
                />

                {/* Active glow */}
                {isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{
                      backgroundColor: stop.color,
                      filter: 'blur(8px)'
                    }}
                    animate={{
                      opacity: [0.5, 0.8, 0.5],
                      scale: [1, 1.5, 1]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut'
                    }}
                  />
                )}
              </div>

              {/* Label on hover */}
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                whileHover={{ opacity: 1, x: -10 }}
                className="absolute right-full mr-4 top-1/2 -translate-y-1/2 whitespace-nowrap"
              >
                <div
                  className="px-4 py-2 rounded-lg backdrop-blur-sm text-sm font-medium"
                  style={{
                    backgroundColor: stop.color + '20',
                    borderLeft: `3px solid ${stop.color}`,
                    color: 'white'
                  }}
                >
                  {stop.name}
                  {stop.type === 'TRANSFER' && (
                    <span className="ml-2 text-xs opacity-60">
                      ({stop.subLines?.length} paths)
                    </span>
                  )}
                </div>
              </motion.div>

              {/* Connecting line */}
              {index < JOURNEY_STOPS.length - 1 && (
                <div
                  className="absolute left-1/2 -translate-x-1/2 top-full w-0.5 h-6 transition-all"
                  style={{
                    backgroundColor: isPassed
                      ? stop.color + '60'
                      : '#ffffff10'
                  }}
                />
              )}
            </motion.button>
          )
        })}
      </div>

      {/* Progress percentage */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-8 text-center"
      >
        <div className="text-white/40 text-xs mb-1">Progress</div>
        <div className="text-white font-mono text-lg">
          {Math.round((currentStopIndex / (JOURNEY_STOPS.length - 1)) * 100)}%
        </div>
      </motion.div>
    </div>
  )
}
