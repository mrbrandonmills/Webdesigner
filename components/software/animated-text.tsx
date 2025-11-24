'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface AnimatedTextProps {
  text: string
  className?: string
  delay?: number
}

export function AnimatedText({ text, className = '', delay = 0 }: AnimatedTextProps) {
  const [displayedText, setDisplayedText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, 50 + Math.random() * 50 + delay) // Random delay for organic feel

      return () => clearTimeout(timeout)
    }
  }, [currentIndex, text, delay])

  return (
    <motion.span
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {displayedText.split('').map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.1,
            delay: index * 0.03
          }}
          className="inline-block"
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
      <motion.span
        className="inline-block w-0.5 h-full bg-orange-500 ml-1"
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 0.8, repeat: Infinity }}
      />
    </motion.span>
  )
}
