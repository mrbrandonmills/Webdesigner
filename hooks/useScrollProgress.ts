/**
 * useScrollProgress Hook
 * Returns normalized scroll progress (0-1) using GSAP ScrollTrigger
 * Industry pattern from award-winning sites
 */

'use client'

import { useState, useEffect, useRef } from 'react'
import { ScrollTrigger } from '@/utils/gsap-config'

export interface ScrollProgressOptions {
  /**
   * Element to track scroll on
   * Default: document.body
   */
  trigger?: string | HTMLElement

  /**
   * Start position for scroll tracking
   * Default: 'top top'
   */
  start?: string

  /**
   * End position for scroll tracking
   * Default: 'bottom bottom'
   */
  end?: string

  /**
   * Smooth scrubbing delay (in seconds)
   * Default: true (enables scrubbing)
   */
  scrub?: boolean | number

  /**
   * Callback when progress changes
   */
  onUpdate?: (progress: number) => void
}

/**
 * Hook to get normalized scroll progress (0-1)
 *
 * @example
 * const progress = useScrollProgress()
 * console.log(progress) // 0.0 to 1.0
 *
 * @example
 * const progress = useScrollProgress({
 *   start: 'top center',
 *   end: 'bottom center',
 *   onUpdate: (p) => console.log('Progress:', p)
 * })
 */
export function useScrollProgress(options: ScrollProgressOptions = {}) {
  const [progress, setProgress] = useState(0)
  const triggerRef = useRef<ScrollTrigger | null>(null)

  useEffect(() => {
    const {
      trigger = document.body,
      start = 'top top',
      end = 'bottom bottom',
      scrub = true,
      onUpdate
    } = options

    // Create ScrollTrigger to track progress
    const scrollTrigger = ScrollTrigger.create({
      trigger,
      start,
      end,
      scrub,
      onUpdate: (self) => {
        const newProgress = self.progress
        setProgress(newProgress)
        onUpdate?.(newProgress)
      }
    })

    triggerRef.current = scrollTrigger

    // Cleanup
    return () => {
      scrollTrigger.kill()
      triggerRef.current = null
    }
  }, [options.trigger, options.start, options.end, options.scrub])

  return progress
}

/**
 * Get current scroll progress without React state
 * Useful for one-time checks
 */
export function getScrollProgress(): number {
  if (typeof window === 'undefined') return 0

  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight

  return scrollHeight > 0 ? scrollTop / scrollHeight : 0
}
