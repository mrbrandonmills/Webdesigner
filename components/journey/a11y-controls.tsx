/**
 * Accessibility Controls Component
 *
 * Provides keyboard navigation and screen reader support for 3D journey
 * Ensures WCAG AA compliance with keyboard-only navigation and announcements
 *
 * Phase 3: Fallbacks & Accessibility - Keyboard and screen reader support
 */

'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { JOURNEY_STOPS } from '@/lib/types/journey'
import { useScrollProgress } from '@/hooks/useScrollProgress'
import { getClosestStopIndex } from '@/constants/journey-keyframes'

interface A11yControlsProps {
  /**
   * Current stop index
   */
  currentStopIndex: number

  /**
   * Callback when user navigates to a stop
   */
  onNavigate?: (stopIndex: number) => void

  /**
   * Enable keyboard navigation (default: true)
   */
  enableKeyboard?: boolean

  /**
   * Enable screen reader announcements (default: true)
   */
  enableAnnouncements?: boolean

  /**
   * Show visual skip link (default: true)
   */
  showSkipLink?: boolean
}

/**
 * Accessibility Controls Component
 *
 * Provides comprehensive accessibility features:
 * - Keyboard navigation (Arrow keys, Tab, Enter, Escape)
 * - Screen reader live region announcements
 * - Focus management and skip links
 * - ARIA landmarks and labels
 *
 * @example
 * ```tsx
 * <A11yControls
 *   currentStopIndex={currentIndex}
 *   onNavigate={(index) => scrollToStop(index)}
 *   enableKeyboard={true}
 *   enableAnnouncements={true}
 * />
 * ```
 */
export function A11yControls({
  currentStopIndex,
  onNavigate,
  enableKeyboard = true,
  enableAnnouncements = true,
  showSkipLink = true,
}: A11yControlsProps) {
  const { progress } = useScrollProgress({
    start: 'top top',
    end: 'bottom bottom',
    scrub: 1,
  })

  // Live region for screen reader announcements
  const liveRegionRef = useRef<HTMLDivElement>(null)
  const [announcement, setAnnouncement] = useState('')

  // Track previous stop to detect changes
  const prevStopIndexRef = useRef(currentStopIndex)

  // Track if user has interacted (for skip link visibility)
  const [hasInteracted, setHasInteracted] = useState(false)

  // Stable callback wrapper
  const onNavigateRef = useRef(onNavigate)
  useEffect(() => {
    onNavigateRef.current = onNavigate
  }, [onNavigate])

  /**
   * Announce stop change to screen readers
   */
  const announceStopChange = useCallback(
    (stopIndex: number) => {
      if (!enableAnnouncements) return

      const stop = JOURNEY_STOPS[stopIndex]
      const message = `Entering stop ${stopIndex + 1} of ${JOURNEY_STOPS.length}: ${stop.name}. ${stop.description || ''}`

      // Update live region
      setAnnouncement(message)

      // Clear after announcement (allows re-announcing same stop)
      setTimeout(() => {
        setAnnouncement('')
      }, 1000)
    },
    [enableAnnouncements]
  )

  /**
   * Navigate to specific stop
   */
  const navigateToStop = useCallback(
    (stopIndex: number) => {
      if (stopIndex < 0 || stopIndex >= JOURNEY_STOPS.length) return

      const stop = JOURNEY_STOPS[stopIndex]
      const stopElement = document.getElementById(`stop-${stop.id}`)

      if (stopElement) {
        stopElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
        stopElement.focus()
      }

      onNavigateRef.current?.(stopIndex)
      announceStopChange(stopIndex)
      setHasInteracted(true)
    },
    [announceStopChange]
  )

  /**
   * Keyboard navigation handler
   */
  useEffect(() => {
    if (!enableKeyboard) return

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in input/textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return
      }

      switch (e.key) {
        case 'ArrowUp':
        case 'ArrowLeft':
          e.preventDefault()
          navigateToStop(Math.max(0, currentStopIndex - 1))
          break

        case 'ArrowDown':
        case 'ArrowRight':
          e.preventDefault()
          navigateToStop(Math.min(JOURNEY_STOPS.length - 1, currentStopIndex + 1))
          break

        case 'Home':
          e.preventDefault()
          navigateToStop(0)
          break

        case 'End':
          e.preventDefault()
          navigateToStop(JOURNEY_STOPS.length - 1)
          break

        case 'Escape':
          // Remove focus from any focused element
          if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur()
          }
          break

        default:
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [enableKeyboard, currentStopIndex, navigateToStop])

  /**
   * Detect stop changes from scroll and announce
   */
  useEffect(() => {
    const closestIndex = getClosestStopIndex(progress)

    if (closestIndex !== prevStopIndexRef.current) {
      prevStopIndexRef.current = closestIndex
      announceStopChange(closestIndex)
    }
  }, [progress, announceStopChange])

  /**
   * Skip link handler
   */
  const handleSkipToContent = () => {
    const mainContent = document.querySelector('main')
    if (mainContent instanceof HTMLElement) {
      mainContent.focus()
      mainContent.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleSkipToEnd = () => {
    navigateToStop(JOURNEY_STOPS.length - 1)
  }

  return (
    <>
      {/* Skip Links (visible on focus) */}
      {showSkipLink && (
        <div className="fixed top-0 left-0 z-[100]">
          <a
            href="#main-content"
            onClick={(e) => {
              e.preventDefault()
              handleSkipToContent()
            }}
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] bg-white text-black px-4 py-2 rounded-lg shadow-xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Skip to main content
          </a>
          <a
            href="#journey-end"
            onClick={(e) => {
              e.preventDefault()
              handleSkipToEnd()
            }}
            className="sr-only focus:not-sr-only focus:absolute focus:top-16 focus:left-4 focus:z-[100] bg-white text-black px-4 py-2 rounded-lg shadow-xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Skip to end of journey
          </a>
        </div>
      )}

      {/* Live Region for Screen Reader Announcements */}
      <div
        ref={liveRegionRef}
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {announcement}
      </div>

      {/* Keyboard Navigation Instructions (visible on first interaction) */}
      {enableKeyboard && !hasInteracted && (
        <div
          className="fixed bottom-20 left-1/2 -translate-x-1/2 z-30 bg-black/90 backdrop-blur-md border border-white/20 rounded-lg px-6 py-4 shadow-2xl max-w-md"
          role="region"
          aria-label="Keyboard navigation help"
        >
          <div className="text-white/90 text-sm space-y-2">
            <div className="font-semibold text-white mb-3 flex items-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Keyboard Navigation</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <kbd className="px-2 py-1 bg-white/10 rounded text-white/80">↑</kbd>
                <kbd className="px-2 py-1 bg-white/10 rounded text-white/80 ml-1">←</kbd>
                <span className="ml-2 text-white/70">Previous</span>
              </div>
              <div>
                <kbd className="px-2 py-1 bg-white/10 rounded text-white/80">↓</kbd>
                <kbd className="px-2 py-1 bg-white/10 rounded text-white/80 ml-1">→</kbd>
                <span className="ml-2 text-white/70">Next</span>
              </div>
              <div>
                <kbd className="px-2 py-1 bg-white/10 rounded text-white/80">Home</kbd>
                <span className="ml-2 text-white/70">First stop</span>
              </div>
              <div>
                <kbd className="px-2 py-1 bg-white/10 rounded text-white/80">End</kbd>
                <span className="ml-2 text-white/70">Last stop</span>
              </div>
            </div>
            <button
              onClick={() => setHasInteracted(true)}
              className="mt-3 w-full text-xs text-white/50 hover:text-white/80 transition-colors"
              aria-label="Dismiss keyboard navigation help"
            >
              Dismiss (ESC)
            </button>
          </div>
        </div>
      )}

      {/* Hidden Navigation Landmark for Screen Readers */}
      <nav
        className="sr-only"
        aria-label="Journey stops navigation"
      >
        <ul>
          {JOURNEY_STOPS.map((stop, index) => (
            <li key={stop.id}>
              <a
                href={`#stop-${stop.id}`}
                onClick={(e) => {
                  e.preventDefault()
                  navigateToStop(index)
                }}
                aria-current={index === currentStopIndex ? 'location' : undefined}
              >
                Stop {index + 1}: {stop.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Progress Indicator for Screen Readers */}
      <div
        className="sr-only"
        role="status"
        aria-label="Journey progress"
      >
        Stop {currentStopIndex + 1} of {JOURNEY_STOPS.length}. {Math.round(progress * 100)}% complete.
      </div>
    </>
  )
}
