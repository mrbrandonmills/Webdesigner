'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Sparkles, TrendingUp } from 'lucide-react'

interface ResultsCounterProps {
  target?: number
  label?: string
  className?: string
  showTrending?: boolean
}

export function ResultsCounter({
  target = 10000,
  label = "people who've discovered their archetype",
  className = '',
  showTrending = true
}: ResultsCounterProps) {
  const [count, setCount] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  useEffect(() => {
    if (isInView && !hasAnimated) {
      setHasAnimated(true)

      // Animate count from 0 to target
      const duration = 2000 // 2 seconds
      const steps = 60
      const increment = target / steps
      const stepDuration = duration / steps

      let current = 0
      const timer = setInterval(() => {
        current += increment
        if (current >= target) {
          setCount(target)
          clearInterval(timer)
        } else {
          setCount(Math.floor(current))
        }
      }, stepDuration)

      return () => clearInterval(timer)
    }
  }, [isInView, target, hasAnimated])

  // Format number with commas
  const formatNumber = (num: number) => {
    return num.toLocaleString()
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className={`text-center ${className}`}
    >
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#C9A050]/10 border border-[#C9A050]/20 rounded-full mb-6">
        <Sparkles className="w-4 h-4 text-[#C9A050]" />
        <span className="text-sm text-[#C9A050]">Trusted by Thousands</span>
      </div>

      <div className="flex items-baseline justify-center gap-2">
        <span className="text-5xl md:text-7xl font-serif text-white">
          {formatNumber(count)}+
        </span>
        {showTrending && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 2, duration: 0.3 }}
            className="flex items-center gap-1 px-2 py-1 bg-green-500/10 rounded-full"
          >
            <TrendingUp className="w-3 h-3 text-green-500" />
            <span className="text-xs text-green-500">Growing</span>
          </motion.div>
        )}
      </div>

      <p className="mt-4 text-lg text-gray-400">
        Join {formatNumber(count)}+ {label}
      </p>
    </motion.div>
  )
}

// Compact inline version
export function ResultsCounterInline({
  target = 10000,
  label = "people",
  className = ''
}: ResultsCounterProps) {
  const [count, setCount] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (isInView && !hasAnimated) {
      setHasAnimated(true)

      const duration = 1500
      const steps = 40
      const increment = target / steps
      const stepDuration = duration / steps

      let current = 0
      const timer = setInterval(() => {
        current += increment
        if (current >= target) {
          setCount(target)
          clearInterval(timer)
        } else {
          setCount(Math.floor(current))
        }
      }, stepDuration)

      return () => clearInterval(timer)
    }
  }, [isInView, target, hasAnimated])

  return (
    <span ref={ref} className={`inline-flex items-center gap-1 ${className}`}>
      <span className="font-medium text-[#C9A050]">{count.toLocaleString()}+</span>
      <span>{label}</span>
    </span>
  )
}

// Stats grid for homepage
interface Stat {
  value: number
  label: string
  suffix?: string
}

interface StatsGridProps {
  stats?: Stat[]
  className?: string
}

export function StatsGrid({ stats, className = '' }: StatsGridProps) {
  const defaultStats: Stat[] = [
    { value: 10000, label: 'Dreams Analyzed', suffix: '+' },
    { value: 8500, label: 'Archetypes Discovered', suffix: '+' },
    { value: 4500, label: 'Minds Visualized', suffix: '+' },
    { value: 98, label: 'Satisfaction Rate', suffix: '%' }
  ]

  const displayStats = stats || defaultStats

  return (
    <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 ${className}`}>
      {displayStats.map((stat, index) => (
        <StatItem key={index} stat={stat} delay={index * 0.1} />
      ))}
    </div>
  )
}

function StatItem({ stat, delay }: { stat: Stat; delay: number }) {
  const [count, setCount] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  useEffect(() => {
    if (isInView && !hasAnimated) {
      setHasAnimated(true)

      const duration = 2000
      const steps = 50
      const increment = stat.value / steps
      const stepDuration = duration / steps

      // Add delay before starting
      const startDelay = setTimeout(() => {
        let current = 0
        const timer = setInterval(() => {
          current += increment
          if (current >= stat.value) {
            setCount(stat.value)
            clearInterval(timer)
          } else {
            setCount(Math.floor(current))
          }
        }, stepDuration)
      }, delay * 1000)

      return () => clearTimeout(startDelay)
    }
  }, [isInView, stat.value, delay, hasAnimated])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className="text-center p-6 bg-white/5 border border-white/10 rounded-xl"
    >
      <div className="text-3xl md:text-4xl font-serif text-[#C9A050] mb-2">
        {count.toLocaleString()}{stat.suffix}
      </div>
      <div className="text-sm text-gray-400">{stat.label}</div>
    </motion.div>
  )
}
