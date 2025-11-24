/**
 * useScrollProgress Hook
 *
 * Returns normalized scroll progress (0-1) using GSAP ScrollTrigger
 * Based on industry-standard pattern from award-winning sites
 */

'use client'

import { useState, useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '@/utils/gsap-config'

interface UseScrollProgressOptions {
  /**
   * Target element to track. Default: document.body
   */
  target?: string | HTMLElement

  /**
   * Start position. Default: 'top top'
   */
  start?: string

  /**
   * End position. Default: 'bottom bottom'
   */
  end?: string

  /**
   * Scrub amount for smooth following. Default: 0.5
   */
  scrub?: number | boolean

  /**
   * Show ScrollTrigger markers in dev mode. Default: false
   */
  markers?: boolean

  /**
   * Callback fired on progress update
   */
  onUpdate?: (progress: number) => void
}

interface UseScrollProgressReturn {
  /**
   * Current scroll progress (0-1)
   */
  progress: number

  /**
   * ScrollTrigger instance for manual control
   */
  scrollTrigger: ScrollTrigger | null

  /**
   * Scroll to specific progress (0-1)
   */
  scrollToProgress: (targetProgress: number, duration?: number) => void
}

/**
 * Hook to track scroll progress using GSAP ScrollTrigger
 *
 * @example
 * ```tsx
 * function Component() {
 *   const { progress } = useScrollProgress({
 *     start: 'top top',
 *     end: 'bottom bottom',
 *     onUpdate: (p) => console.log('Progress:', p)
 *   })
 *
 *   return <div>Scroll: {(progress * 100).toFixed(0)}%</div>
 * }
 * ```
 */
export function useScrollProgress(
  options: UseScrollProgressOptions = {}
): UseScrollProgressReturn {
  const {
    target,
    start = 'top top',
    end = 'bottom bottom',
    scrub = 0.5,
    markers = false,
    onUpdate,
  } = options

  const [progress, setProgress] = useState(0)
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null)

  useEffect(() => {
    // Client-side only
    if (typeof window === 'undefined') return

    // Wait for GSAP to be initialized
    if (!gsap || !ScrollTrigger) {
      console.warn('GSAP or ScrollTrigger not initialized')
      return
    }

    // Get target element
    const triggerElement =
      typeof target === 'string'
        ? document.querySelector(target)
        : target || document.body

    if (!triggerElement) {
      console.warn('useScrollProgress: Target element not found')
      return
    }

    // Create ScrollTrigger instance
    const st = ScrollTrigger.create({
      trigger: triggerElement,
      start,
      end,
      scrub,
      markers: markers && process.env.NODE_ENV === 'development',
      onUpdate: (self) => {
        const newProgress = self.progress
        setProgress(newProgress)
        onUpdate?.(newProgress)
      },
    })

    scrollTriggerRef.current = st

    // Cleanup
    return () => {
      st?.kill()
      scrollTriggerRef.current = null
    }
  }, [target, start, end, scrub, markers, onUpdate])

  /**
   * Programmatically scroll to a specific progress value
   */
  const scrollToProgress = (targetProgress: number, duration = 1) => {
    if (typeof window === 'undefined') return

    const clampedProgress = Math.max(0, Math.min(1, targetProgress))
    const scrollHeight = document.body.scrollHeight - window.innerHeight
    const targetScroll = scrollHeight * clampedProgress

    gsap.to(window, {
      scrollTo: targetScroll,
      duration,
      ease: 'power2.inOut',
    })
  }

  return {
    progress,
    scrollTrigger: scrollTriggerRef.current,
    scrollToProgress,
  }
}

/**
 * Hook variant for debugging scroll progress
 * Logs progress to console in development
 */
export function useScrollProgressDebug(
  options: UseScrollProgressOptions = {}
): UseScrollProgressReturn {
  return useScrollProgress({
    ...options,
    markers: true,
    onUpdate: (progress) => {
      if (process.env.NODE_ENV === 'development') {
        console.log(`[ScrollProgress] ${(progress * 100).toFixed(1)}%`)
      }
      options.onUpdate?.(progress)
    },
  })
}
