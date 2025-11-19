'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface GenerationLoaderProps {
  isLoading: boolean;
  message?: string;
  subMessage?: string;
  color?: string;
}

export default function GenerationLoader({
  isLoading,
  message = "Generating your visualization...",
  subMessage = "This takes 1-2 minutes",
  color = '#C9A050'
}: GenerationLoaderProps) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="w-full flex flex-col items-center gap-4"
        >
          {/* Message */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="text-white/90 text-sm font-medium tracking-wide"
          >
            {message}
          </motion.p>

          {/* Progress Bar Container */}
          <div className="w-full max-w-md relative">
            {/* Track */}
            <div
              className="w-full h-[3px] rounded-full overflow-hidden"
              style={{ backgroundColor: `${color}15` }}
            >
              {/* Animated Segment */}
              <motion.div
                className="h-full rounded-full relative"
                style={{
                  background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
                  boxShadow: `0 0 20px ${color}60, 0 0 40px ${color}30`,
                  width: '40%',
                }}
                animate={{
                  x: ['-100%', '350%'],
                }}
                transition={{
                  duration: 2,
                  ease: [0.45, 0.05, 0.55, 0.95],
                  repeat: Infinity,
                  repeatType: 'loop',
                }}
              >
                {/* Inner glow pulse */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: color,
                    filter: 'blur(2px)',
                  }}
                  animate={{
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1.5,
                    ease: 'easeInOut',
                    repeat: Infinity,
                  }}
                />
              </motion.div>
            </div>

            {/* Ambient glow under the bar */}
            <motion.div
              className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-4 rounded-full blur-xl"
              style={{ backgroundColor: color }}
              animate={{
                opacity: [0.1, 0.2, 0.1],
                scale: [0.9, 1, 0.9],
              }}
              transition={{
                duration: 2,
                ease: 'easeInOut',
                repeat: Infinity,
              }}
            />
          </div>

          {/* Sub-message */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="text-white/50 text-xs tracking-wide"
          >
            {subMessage}
          </motion.p>

          {/* Breathing dot indicator */}
          <motion.div
            className="flex items-center gap-1.5 mt-1"
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-1 h-1 rounded-full"
                style={{ backgroundColor: color }}
                animate={{
                  opacity: [0.3, 1, 0.3],
                  scale: [0.8, 1, 0.8],
                }}
                transition={{
                  duration: 1.4,
                  ease: 'easeInOut',
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
