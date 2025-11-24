'use client'

import { useEffect, useRef, ReactNode } from 'react'
import Lenis from 'lenis'

interface LenisScrollWrapperProps {
  children: ReactNode
  onScroll?: (scroll: number) => void
}

/**
 * LenisScrollWrapper - Award-winning smooth momentum scrolling
 * Replaces browser native scroll with cinematic momentum physics
 * Used by The Monolith Project and other Awwwards winners
 */
export function LenisScrollWrapper({ children, onScroll }: LenisScrollWrapperProps) {
  const lenisRef = useRef<Lenis | null>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    // Initialize Lenis with luxury easing
    lenisRef.current = new Lenis({
      duration: 1.2, // Smooth, cinematic duration
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Custom easeOutExpo
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 2,
      infinite: false,
    })

    // Animation loop
    function raf(time: number) {
      if (lenisRef.current) {
        lenisRef.current.raf(time)

        // Pass scroll progress to callback
        if (onScroll) {
          onScroll(lenisRef.current.scroll)
        }
      }
      rafRef.current = requestAnimationFrame(raf)
    }

    rafRef.current = requestAnimationFrame(raf)

    // Cleanup
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
      if (lenisRef.current) {
        lenisRef.current.destroy()
      }
    }
  }, [onScroll])

  // Expose Lenis instance globally for GSAP integration
  useEffect(() => {
    if (lenisRef.current) {
      // @ts-ignore - Attach to window for GSAP ScrollTrigger
      window.lenis = lenisRef.current
    }

    return () => {
      // @ts-ignore
      if (window.lenis) {
        // @ts-ignore
        delete window.lenis
      }
    }
  }, [])

  return <>{children}</>
}
