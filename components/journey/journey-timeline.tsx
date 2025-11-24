/**
 * Journey Timeline Component
 *
 * Displays journey stop information synchronized with camera movement
 * Content fades in/out based on scroll progress and camera position
 *
 * Phase 2: 3D Integration - Content animation sync
 */

'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { useScrollProgress } from '@/hooks/useScrollProgress'
import { getClosestStopIndex, CAMERA_KEYFRAMES } from '@/constants/journey-keyframes'
import { JOURNEY_STOPS, type JourneyStop } from '@/lib/types/journey'
import { gsap } from '@/utils/gsap-config'

interface JourneyTimelineProps {
  /**
   * Callback when stop becomes active
   */
  onStopChange?: (stopId: string, index: number) => void

  /**
   * Show timeline UI (default: true)
   */
  showUI?: boolean

  /**
   * Animation duration for transitions (seconds)
   */
  transitionDuration?: number
}

/**
 * Journey Timeline Component
 *
 * Displays current journey stop information with smooth GSAP animations
 * Synchronized with scroll progress and camera position
 *
 * @example
 * ```tsx
 * <JourneyTimeline
 *   onStopChange={(stopId) => console.log('Now at:', stopId)}
 *   showUI={true}
 *   transitionDuration={0.6}
 * />
 * ```
 */
export function JourneyTimeline({
  onStopChange,
  showUI = true,
  transitionDuration = 0.6,
}: JourneyTimelineProps) {
  const { progress } = useScrollProgress({
    start: 'top top',
    end: 'bottom bottom',
    scrub: 1,
  })

  const [currentStopIndex, setCurrentStopIndex] = useState(0)
  const [currentStop, setCurrentStop] = useState<JourneyStop>(JOURNEY_STOPS[0])

  // Refs for GSAP animations (avoid recreating on every render)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const descriptionRef = useRef<HTMLParagraphElement>(null)
  const linkRef = useRef<HTMLAnchorElement>(null)
  const indicatorRef = useRef<HTMLDivElement>(null)

  // Track previous stop to detect changes
  const prevStopIndexRef = useRef(0)

  // Store active GSAP tweens for cleanup (FIX: Memory Leak)
  const activeTweensRef = useRef<gsap.core.Tween[]>([])

  // Track expected stop index for race condition prevention (FIX: Race Condition)
  const expectedStopIndexRef = useRef(0)

  // Stable callback wrapper (FIX: Unstable Dependency)
  const onStopChangeRef = useRef(onStopChange)
  useEffect(() => {
    onStopChangeRef.current = onStopChange
  }, [onStopChange])

  // Update current stop based on scroll progress
  useEffect(() => {
    const closestIndex = getClosestStopIndex(progress)

    if (closestIndex !== prevStopIndexRef.current) {
      // Stop changed - trigger animation
      prevStopIndexRef.current = closestIndex
      expectedStopIndexRef.current = closestIndex // Track expected index
      const newStop = JOURNEY_STOPS[closestIndex]

      // FIX: Kill previous animations to prevent memory leak
      activeTweensRef.current.forEach((tween) => tween.kill())
      activeTweensRef.current = []

      // Animate out old content
      if (titleRef.current && descriptionRef.current && linkRef.current) {
        const fadeOutTween = gsap.to([titleRef.current, descriptionRef.current, linkRef.current], {
          opacity: 0,
          y: -20,
          duration: transitionDuration * 0.5,
          ease: 'power2.in',
          onComplete: () => {
            // FIX: Verify this callback is still relevant (race condition prevention)
            if (expectedStopIndexRef.current !== closestIndex) {
              return // Stale callback, ignore
            }

            // FIX: Null safety check before accessing refs
            if (!titleRef.current || !descriptionRef.current || !linkRef.current) {
              return // Component unmounted, abort
            }

            // Update state at midpoint of transition
            setCurrentStopIndex(closestIndex)
            setCurrentStop(newStop)
            onStopChangeRef.current?.(newStop.id, closestIndex)

            // Animate in new content
            const fadeInTween = gsap.fromTo(
              [titleRef.current, descriptionRef.current, linkRef.current],
              { opacity: 0, y: 20 },
              {
                opacity: 1,
                y: 0,
                duration: transitionDuration * 0.5,
                ease: 'power2.out',
                stagger: 0.1,
              }
            )

            activeTweensRef.current.push(fadeInTween)
          },
        })

        activeTweensRef.current.push(fadeOutTween)
      }
    }
  }, [progress, transitionDuration]) // FIX: Removed unstable dependency

  // Cleanup GSAP tweens on unmount (FIX: Memory Leak)
  useEffect(() => {
    return () => {
      activeTweensRef.current.forEach((tween) => tween.kill())
      activeTweensRef.current = []
    }
  }, [])

  // Animate indicator color based on current stop
  useEffect(() => {
    if (indicatorRef.current) {
      const colorTween = gsap.to(indicatorRef.current, {
        backgroundColor: currentStop.color,
        duration: transitionDuration,
        ease: 'power2.inOut',
      })

      // Cleanup on next color change or unmount
      return () => {
        colorTween.kill()
      }
    }
  }, [currentStop.color, transitionDuration])

  if (!showUI) {
    return null
  }

  return (
    <div
      className="fixed left-8 top-1/2 -translate-y-1/2 z-40 max-w-sm pointer-events-none"
      role="navigation"
      aria-label="Journey timeline"
    >
      {/* Stop Indicator */}
      <div className="flex items-center gap-4 mb-6">
        <div
          ref={indicatorRef}
          className="w-4 h-4 rounded-full shadow-lg transition-transform duration-300 hover:scale-110"
          style={{ backgroundColor: currentStop.color }}
          aria-hidden="true"
        />
        <div className="text-sm text-white/60 font-mono">
          {currentStopIndex + 1} / {JOURNEY_STOPS.length}
        </div>
      </div>

      {/* Stop Information Card */}
      <div
        className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-6 shadow-2xl"
        style={{
          boxShadow: `0 0 40px ${currentStop.color}20`,
        }}
      >
        {/* Stop Name */}
        <h2
          ref={titleRef}
          className="text-4xl font-bold mb-3 tracking-wider"
          style={{ color: currentStop.color }}
        >
          {currentStop.name}
        </h2>

        {/* Description */}
        <p
          ref={descriptionRef}
          className="text-white/80 text-base mb-4 leading-relaxed"
        >
          {currentStop.description || 'Explore this section'}
        </p>

        {/* Navigation Link */}
        <Link
          ref={linkRef}
          href={currentStop.href}
          className="inline-flex items-center gap-2 text-white/90 hover:text-white transition-colors font-medium pointer-events-auto group"
          aria-label={`Visit ${currentStop.name}`}
        >
          <span>Visit Section</span>
          <svg
            className="w-4 h-4 transition-transform group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </Link>

        {/* Sub-lines (if any) */}
        {currentStop.subLines && currentStop.subLines.length > 0 && (
          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="text-xs text-white/50 mb-2 uppercase tracking-wider">
              Related Content
            </div>
            <ul className="space-y-1">
              {currentStop.subLines.map((subLine) => (
                <li
                  key={subLine.id}
                  className="text-sm text-white/70 flex items-center gap-2"
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: currentStop.color }}
                    aria-hidden="true"
                  />
                  {subLine.name}
                  {subLine.stops && (
                    <span className="text-white/40 text-xs">
                      ({subLine.stops})
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mt-6">
        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full transition-all duration-300 ease-out rounded-full"
            style={{
              width: `${progress * 100}%`,
              backgroundColor: currentStop.color,
              boxShadow: `0 0 10px ${currentStop.color}`,
            }}
            role="progressbar"
            aria-valuenow={Math.round(progress * 100)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Journey progress"
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-white/40">
          <span>Start</span>
          <span>{Math.round(progress * 100)}%</span>
          <span>End</span>
        </div>
      </div>
    </div>
  )
}
