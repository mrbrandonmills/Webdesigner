'use client'

import { motion } from 'framer-motion'

interface GeometricBackgroundProps {
  variant?: 'luxury' | 'minimal' | 'smoke' | 'particles' | 'waves' | 'sacred-geometry' | 'vitruvian'
  intensity?: 'subtle' | 'medium' | 'bold'
  color?: 'gold' | 'white' | 'gradient'
}

export default function GeometricBackground({
  variant = 'luxury',
  intensity = 'subtle',
  color = 'gold',
}: GeometricBackgroundProps) {
  const opacityMap = {
    subtle: 0.15,
    medium: 0.25,
    bold: 0.40,
  }

  const baseOpacity = opacityMap[intensity]

  const colorMap = {
    gold: 'rgba(201, 160, 80',
    white: 'rgba(255, 255, 255',
    gradient: 'rgba(201, 160, 80',
  }

  const baseColor = colorMap[color]

  if (variant === 'luxury') {
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden will-change-transform" style={{ transform: 'translateZ(0)' }}>
        {/* Large rotating hexagons */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={`hex-${i}`}
            className="absolute"
            style={{
              width: '800px',
              height: '800px',
              left: `${i * 40}%`,
              top: `${i * 30}%`,
            }}
            animate={{
              rotate: [0, 360],
              x: [0, 100, 0],
              y: [0, -50, 0],
            }}
            transition={{
              duration: 60 + i * 20,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            <svg
              viewBox="0 0 100 100"
              style={{ opacity: baseOpacity * 2 }}
            >
              <polygon
                points="50 1 95 25 95 75 50 99 5 75 5 25"
                fill="none"
                stroke={`${baseColor}, ${baseOpacity * 3})`}
                strokeWidth="0.5"
              />
            </svg>
          </motion.div>
        ))}

        {/* Medium floating circles */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={`circle-${i}`}
            className="absolute rounded-full"
            style={{
              width: `${300 + i * 100}px`,
              height: `${300 + i * 100}px`,
              border: `1px solid ${baseColor}, ${baseOpacity * 2})`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [baseOpacity, baseOpacity * 3, baseOpacity],
              x: [0, Math.random() * 200 - 100, 0],
              y: [0, Math.random() * 200 - 100, 0],
            }}
            transition={{
              duration: 40 + i * 10,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}

        {/* Small geometric shapes */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`shape-${i}`}
            className="absolute"
            style={{
              width: '150px',
              height: '150px',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              rotate: [0, 180, 360],
              x: [0, Math.random() * 300 - 150, 0],
              y: [0, Math.random() * 300 - 150, 0],
            }}
            transition={{
              duration: 30 + i * 5,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            <svg viewBox="0 0 100 100" style={{ opacity: baseOpacity }}>
              <rect
                x="20"
                y="20"
                width="60"
                height="60"
                fill="none"
                stroke={`${baseColor}, ${baseOpacity * 4})`}
                strokeWidth="1"
                transform="rotate(45 50 50)"
              />
            </svg>
          </motion.div>
        ))}
      </div>
    )
  }

  if (variant === 'smoke') {
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden will-change-transform" style={{ transform: 'translateZ(0)' }}>
        {/* Smoke-like blurred gradients */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`smoke-${i}`}
            className="absolute rounded-full"
            style={{
              width: `${400 + i * 150}px`,
              height: `${400 + i * 150}px`,
              background: `radial-gradient(circle, ${baseColor}, ${baseOpacity * 4}) 0%, transparent 70%)`,
              filter: 'blur(80px)',
              left: `${(i * 20) % 100}%`,
              top: `${(i * 30) % 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 400 - 200, 0],
              y: [0, Math.random() * 400 - 200, 0],
              scale: [1, 1.5, 1],
              opacity: [baseOpacity * 2, baseOpacity * 6, baseOpacity * 2],
            }}
            transition={{
              duration: 45 + i * 15,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}

        {/* Layered smoke clouds */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={`cloud-${i}`}
            className="absolute"
            style={{
              width: '100%',
              height: '100%',
              background: `linear-gradient(${45 + i * 90}deg, ${baseColor}, ${baseOpacity * 2}) 0%, transparent 50%, ${baseColor}, ${baseOpacity * 2}) 100%)`,
              filter: 'blur(120px)',
            }}
            animate={{
              opacity: [baseOpacity, baseOpacity * 4, baseOpacity],
              rotate: [0, 15, 0],
            }}
            transition={{
              duration: 60 + i * 20,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    )
  }

  if (variant === 'particles') {
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden will-change-transform" style={{ transform: 'translateZ(0)' }}>
        {/* Floating particles */}
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute rounded-full"
            style={{
              width: `${Math.random() * 8 + 2}px`,
              height: `${Math.random() * 8 + 2}px`,
              backgroundColor: `${baseColor}, ${baseOpacity * 8})`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -window.innerHeight - 100],
              x: [0, Math.random() * 200 - 100],
              opacity: [0, baseOpacity * 8, 0],
            }}
            transition={{
              duration: 10 + Math.random() * 20,
              repeat: Infinity,
              ease: 'linear',
              delay: Math.random() * 10,
            }}
          />
        ))}

        {/* Connecting lines */}
        <svg className="absolute inset-0 w-full h-full" style={{ opacity: baseOpacity * 2 }}>
          {[...Array(20)].map((_, i) => {
            const x1 = Math.random() * 100
            const y1 = Math.random() * 100
            const x2 = Math.random() * 100
            const y2 = Math.random() * 100

            return (
              <motion.line
                key={`line-${i}`}
                x1={`${x1}%`}
                y1={`${y1}%`}
                x2={`${x2}%`}
                y2={`${y2}%`}
                stroke={`${baseColor}, ${baseOpacity * 3})`}
                strokeWidth="0.5"
                animate={{
                  x1: [`${x1}%`, `${(x1 + 10) % 100}%`, `${x1}%`],
                  y1: [`${y1}%`, `${(y1 + 10) % 100}%`, `${y1}%`],
                  x2: [`${x2}%`, `${(x2 - 10 + 100) % 100}%`, `${x2}%`],
                  y2: [`${y2}%`, `${(y2 - 10 + 100) % 100}%`, `${y2}%`],
                }}
                transition={{
                  duration: 30 + Math.random() * 20,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            )
          })}
        </svg>
      </div>
    )
  }

  if (variant === 'waves') {
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden will-change-transform" style={{ transform: 'translateZ(0)' }}>
        {/* Flowing wave lines */}
        {[...Array(5)].map((_, i) => (
          <svg
            key={`wave-${i}`}
            className="absolute w-full"
            style={{
              height: '100%',
              top: `${i * 20}%`,
              opacity: baseOpacity * 2,
            }}
            preserveAspectRatio="none"
          >
            <motion.path
              d={`M 0 ${50 + i * 10} Q 250 ${30 + i * 10} 500 ${50 + i * 10} T 1000 ${50 + i * 10}`}
              fill="none"
              stroke={`${baseColor}, ${baseOpacity * 4})`}
              strokeWidth="2"
              animate={{
                d: [
                  `M 0 ${50 + i * 10} Q 250 ${30 + i * 10} 500 ${50 + i * 10} T 1000 ${50 + i * 10}`,
                  `M 0 ${50 + i * 10} Q 250 ${70 + i * 10} 500 ${50 + i * 10} T 1000 ${50 + i * 10}`,
                  `M 0 ${50 + i * 10} Q 250 ${30 + i * 10} 500 ${50 + i * 10} T 1000 ${50 + i * 10}`,
                ],
              }}
              transition={{
                duration: 10 + i * 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </svg>
        ))}
      </div>
    )
  }

  if (variant === 'sacred-geometry' || variant === 'vitruvian') {
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden will-change-transform" style={{ transform: 'translateZ(0)' }}>
        {/* Vitruvian Man Sacred Geometry - Concentric circles with golden ratio */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: '800px',
            height: '800px',
            opacity: baseOpacity * 3,
          }}
          animate={{
            rotate: [0, 360],
            scale: [0.98, 1.02, 0.98],
          }}
          transition={{
            rotate: { duration: 120, repeat: Infinity, ease: 'linear' },
            scale: { duration: 8, repeat: Infinity, ease: 'easeInOut' },
          }}
        >
          {/* Perfect circles - Vitruvian proportions */}
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Inner circle - 28% */}
            <circle
              cx="50"
              cy="50"
              r="28"
              fill="none"
              stroke={`${baseColor}, ${baseOpacity * 6})`}
              strokeWidth="0.3"
            />
            {/* Middle circle - 42% */}
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke={`${baseColor}, ${baseOpacity * 5})`}
              strokeWidth="0.4"
            />
            {/* Outer circle - 56% */}
            <circle
              cx="50"
              cy="50"
              r="56"
              fill="none"
              stroke={`${baseColor}, ${baseOpacity * 4})`}
              strokeWidth="0.5"
            />

            {/* Golden ratio spiral nodes */}
            <circle cx="61.8" cy="38.2" r="0.8" fill={`${baseColor}, ${baseOpacity * 8})`} />
            <circle cx="38.2" cy="61.8" r="0.8" fill={`${baseColor}, ${baseOpacity * 8})`} />
            <circle cx="50" cy="23.6" r="0.6" fill={`${baseColor}, ${baseOpacity * 6})`} />
            <circle cx="50" cy="76.4" r="0.6" fill={`${baseColor}, ${baseOpacity * 6})`} />
            <circle cx="23.6" cy="50" r="0.6" fill={`${baseColor}, ${baseOpacity * 6})`} />
            <circle cx="76.4" cy="50" r="0.6" fill={`${baseColor}, ${baseOpacity * 6})`} />

            {/* Sacred geometry lines - intersecting at golden ratio points */}
            <line
              x1="0"
              y1="50"
              x2="100"
              y2="50"
              stroke={`${baseColor}, ${baseOpacity * 3})`}
              strokeWidth="0.2"
            />
            <line
              x1="50"
              y1="0"
              x2="50"
              y2="100"
              stroke={`${baseColor}, ${baseOpacity * 3})`}
              strokeWidth="0.2"
            />
            <line
              x1="14.6"
              y1="14.6"
              x2="85.4"
              y2="85.4"
              stroke={`${baseColor}, ${baseOpacity * 2})`}
              strokeWidth="0.15"
            />
            <line
              x1="85.4"
              y1="14.6"
              x2="14.6"
              y2="85.4"
              stroke={`${baseColor}, ${baseOpacity * 2})`}
              strokeWidth="0.15"
            />
          </svg>
        </motion.div>

        {/* Secondary rotating sacred geometry layer */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: '1200px',
            height: '1200px',
            opacity: baseOpacity * 2,
          }}
          animate={{
            rotate: [360, 0],
          }}
          transition={{
            duration: 180,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Flower of Life pattern - partial */}
            {[0, 60, 120, 180, 240, 300].map((angle) => (
              <circle
                key={`flower-${angle}`}
                cx={50 + 15 * Math.cos((angle * Math.PI) / 180)}
                cy={50 + 15 * Math.sin((angle * Math.PI) / 180)}
                r="15"
                fill="none"
                stroke={`${baseColor}, ${baseOpacity * 3})`}
                strokeWidth="0.2"
              />
            ))}
          </svg>
        </motion.div>

        {/* Floating golden ratio rectangles */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={`rect-${i}`}
            className="absolute"
            style={{
              width: `${200 + i * 80}px`,
              height: `${(200 + i * 80) / 1.618}px`, // Golden ratio
              border: `1px solid ${baseColor}, ${baseOpacity * 2})`,
              left: `${20 + i * 20}%`,
              top: `${10 + i * 15}%`,
            }}
            animate={{
              rotate: [0, 90, 180, 270, 360],
              x: [0, 50, 0, -50, 0],
              y: [0, -50, 0, 50, 0],
            }}
            transition={{
              duration: 60 + i * 20,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}

        {/* Subtle radial gradient overlay */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: '100%',
            height: '100%',
            background: `radial-gradient(circle at 50% 50%, ${baseColor}, ${baseOpacity * 2}) 0%, transparent 60%)`,
            filter: 'blur(60px)',
          }}
        />
      </div>
    )
  }

  // Default minimal variant
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden will-change-transform" style={{ transform: 'translateZ(0)' }}>
      {/* Simple gradient orbs */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`orb-${i}`}
          className="absolute rounded-full"
          style={{
            width: `${600 + i * 200}px`,
            height: `${600 + i * 200}px`,
            background: `radial-gradient(circle, ${baseColor}, ${baseOpacity * 3}) 0%, transparent 70%)`,
            filter: 'blur(100px)',
            left: `${i * 40}%`,
            top: `${i * 30}%`,
          }}
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 40 + i * 15,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}
