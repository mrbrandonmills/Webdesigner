/**
 * Smooth Scroll Wrapper - Lenis Integration
 * Provides smooth scrolling for the entire page
 */

'use client'

import { useEffect, useRef, ReactNode } from 'react'

interface SmoothScrollWrapperProps {
  children: ReactNode
  onScroll?: (progress: number) => void
}

export function SmoothScrollWrapper({ children, onScroll }: SmoothScrollWrapperProps) {
  const lenisRef = useRef<any>(null)
  const rafRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    // Dynamic import to avoid SSR issues
    import('lenis').then(({ default: Lenis }) => {
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
        infinite: false
      })

      lenisRef.current = lenis

      // RAF loop
      function raf(time: number) {
        lenis.raf(time)
        rafRef.current = requestAnimationFrame(raf)
      }

      rafRef.current = requestAnimationFrame(raf)

      // Listen to scroll events
      lenis.on('scroll', ({ scroll, limit }: any) => {
        const progress = scroll / limit
        onScroll?.(progress)
      })

      return () => {
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current)
        }
        lenis.destroy()
      }
    })
  }, [onScroll])

  return <div className="lenis-wrapper">{children}</div>
}
