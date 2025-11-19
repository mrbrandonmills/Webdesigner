'use client'

import { useState, useEffect } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'
import { Users, TrendingUp } from 'lucide-react'

interface ActivityCounterProps {
  type?: 'dreams' | 'oracle' | 'visualize' | 'general'
  className?: string
}

const typeLabels = {
  dreams: 'analyzed their dreams',
  oracle: 'discovered their archetype',
  visualize: 'visualized their thoughts',
  general: 'explored their inner world'
}

export function ActivityCounter({ type = 'general', className = '' }: ActivityCounterProps) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Initialize from localStorage or set base count
    const storageKey = `activity_count_${type}`
    const lastDateKey = `activity_date_${type}`

    const stored = localStorage.getItem(storageKey)
    const lastDate = localStorage.getItem(lastDateKey)
    const today = new Date().toDateString()

    let baseCount = 0

    if (stored && lastDate === today) {
      // Same day, use stored count
      baseCount = parseInt(stored, 10)
    } else {
      // New day or first visit - generate realistic base count
      // Start with 50-200 base, plus growth simulation based on days since launch
      const launchDate = new Date('2024-01-01')
      const daysSinceLaunch = Math.floor((Date.now() - launchDate.getTime()) / (1000 * 60 * 60 * 24))

      // Realistic growth: 50 base + 3-7 per day average
      const dailyAverage = Math.floor(Math.random() * 5) + 3
      baseCount = 50 + (daysSinceLaunch * dailyAverage)

      // Add daily variance (50-200)
      const dailyVariance = Math.floor(Math.random() * 151) + 50
      baseCount += dailyVariance

      // Store for today
      localStorage.setItem(storageKey, baseCount.toString())
      localStorage.setItem(lastDateKey, today)
    }

    setCount(baseCount)
    setIsVisible(true)

    // Simulate live activity - occasionally increment
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance every interval
        setCount(prev => {
          const newCount = prev + 1
          localStorage.setItem(storageKey, newCount.toString())
          return newCount
        })
      }
    }, 15000) // Check every 15 seconds

    return () => clearInterval(interval)
  }, [type])

  // Animated number counter
  const springValue = useSpring(0, { stiffness: 100, damping: 30 })
  const displayValue = useTransform(springValue, (latest) => Math.floor(latest))

  useEffect(() => {
    springValue.set(count)
  }, [count, springValue])

  if (!isVisible) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`inline-flex items-center gap-3 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full ${className}`}
    >
      <div className="relative">
        <Users className="w-4 h-4 text-[#C9A050]" />
        <motion.div
          className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>

      <span className="text-sm text-gray-300">
        <motion.span className="font-medium text-white">
          {displayValue.get().toLocaleString()}
        </motion.span>
        {' '}people {typeLabels[type]} today
      </span>

      <TrendingUp className="w-3 h-3 text-green-500" />
    </motion.div>
  )
}

// Compact version for smaller spaces
export function ActivityCounterCompact({ type = 'general', className = '' }: ActivityCounterProps) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const storageKey = `activity_count_${type}`
    const stored = localStorage.getItem(storageKey)

    if (stored) {
      setCount(parseInt(stored, 10))
    } else {
      const baseCount = Math.floor(Math.random() * 151) + 50
      setCount(baseCount)
      localStorage.setItem(storageKey, baseCount.toString())
    }
  }, [type])

  return (
    <div className={`inline-flex items-center gap-2 text-sm text-gray-400 ${className}`}>
      <div className="relative">
        <div className="w-2 h-2 bg-green-500 rounded-full" />
        <div className="absolute inset-0 w-2 h-2 bg-green-500 rounded-full animate-ping" />
      </div>
      <span>{count.toLocaleString()} active now</span>
    </div>
  )
}
