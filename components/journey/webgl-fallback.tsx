/**
 * WebGL Fallback Component
 *
 * Progressive enhancement fallback for devices without WebGL support
 * Shows video or static image with content overlay as alternative to 3D scene
 *
 * Phase 3: Fallbacks & Accessibility - Video/image fallback
 * QA CLEARED - All 7 CRITICAL/HIGH issues fixed
 */

'use client'

import { useState, useEffect, useRef } from 'react'
import { JOURNEY_STOPS, type JourneyStop } from '@/lib/types/journey'
import { useScrollProgress } from '@/hooks/useScrollProgress'
import { getClosestStopIndex } from '@/constants/journey-keyframes'

interface WebGLFallbackProps {
  /**
   * Callback when stop becomes active
   */
  onStopChange?: (stopId: string, index: number) => void

  /**
   * Fallback type: video (if browser supports), or static image
   */
  fallbackType?: 'video' | 'image' | 'auto'

  /**
   * Custom video source (MP4)
   */
  videoSrc?: string

  /**
   * Custom poster image
   */
  posterSrc?: string
}

/**
 * WebGL Fallback Component
 *
 * Provides graceful degradation for unsupported devices
 * - Desktop: Looping video with content overlay
 * - Mobile: Static gradient with content overlay
 * - Reduced motion: Static image only
 *
 * @example
 * ```tsx
 * const device = useDeviceDetection()
 *
 * if (!device.shouldUse3D) {
 *   return <WebGLFallback fallbackType="auto" />
 * }
 * ```
 */
export function WebGLFallback({
  onStopChange,
  fallbackType = 'auto',
  videoSrc = '/videos/journey-fallback.mp4',
  posterSrc = '/images/journey-poster.jpg',
}: WebGLFallbackProps) {
  const { progress } = useScrollProgress({
    start: 'top top',
    end: 'bottom bottom',
    scrub: 1,
  })

  const [currentStopIndex, setCurrentStopIndex] = useState(0)
  // FIX MEDIUM-1: Derived state, not separate state
  const currentStop = JOURNEY_STOPS[currentStopIndex]

  const [useVideo, setUseVideo] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  // FIX CRITICAL-1: Determine fallback type with MediaQuery cleanup
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Check video support
    const video = document.createElement('video')
    const canPlayMP4 = video.canPlayType('video/mp4') !== ''

    // Check reduced motion preference with proper cleanup
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }

    setPrefersReducedMotion(mediaQuery.matches)
    mediaQuery.addEventListener('change', handleChange)

    // Decide: video or image?
    if (fallbackType === 'auto') {
      // Use modern feature detection instead of UA sniffing
      const isMobile =
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        window.matchMedia('(max-width: 768px)').matches

      setUseVideo(canPlayMP4 && !isMobile && !mediaQuery.matches)
    } else if (fallbackType === 'video') {
      setUseVideo(canPlayMP4 && !mediaQuery.matches)
    } else {
      setUseVideo(false)
    }

    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [fallbackType])

  // FIX HIGH-1: Update current stop without unstable dependency
  useEffect(() => {
    const closestIndex = getClosestStopIndex(progress)

    if (closestIndex !== currentStopIndex) {
      setCurrentStopIndex(closestIndex)
      const newStop = JOURNEY_STOPS[closestIndex]
      onStopChange?.(newStop.id, closestIndex)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress, currentStopIndex]) // onStopChange intentionally excluded

  // FIX CRITICAL-3: Video element cleanup on unmount
  useEffect(() => {
    if (!useVideo || !videoRef.current) return

    const video = videoRef.current

    // Attempt autoplay after video is ready (FIX HIGH-4)
    const handleCanPlay = () => {
      if (!prefersReducedMotion) {
        video.play().catch((e) => {
          console.info('[WebGLFallback] Autoplay blocked, user interaction required')
        })
      }
    }

    video.addEventListener('canplay', handleCanPlay, { once: true })

    return () => {
      // Critical cleanup
      video.pause()
      video.currentTime = 0
      video.src = '' // Release video memory
      video.removeEventListener('canplay', handleCanPlay)
    }
  }, [useVideo, prefersReducedMotion])

  // FIX CRITICAL-2 + HIGH-2: Sync video with RAF throttling and duration check
  useEffect(() => {
    if (!useVideo || !videoRef.current) return

    const video = videoRef.current
    let rafId: number | null = null
    let lastUpdate = 0

    const syncVideo = (timestamp: number) => {
      // Throttle to 10fps max (every 100ms) to reduce overhead
      if (timestamp - lastUpdate < 100) {
        rafId = requestAnimationFrame(syncVideo)
        return
      }

      lastUpdate = timestamp

      // FIX CRITICAL-2: Wait for video duration to be available
      if (video.duration && !isNaN(video.duration) && video.duration > 0) {
        const targetTime = progress * video.duration

        // Only update if difference is significant (avoid jitter)
        if (Math.abs(video.currentTime - targetTime) > 0.5) {
          video.currentTime = targetTime
        }
      }

      rafId = requestAnimationFrame(syncVideo)
    }

    // Ensure metadata is loaded before starting sync
    if (video.readyState >= 1) {
      rafId = requestAnimationFrame(syncVideo)
    } else {
      video.addEventListener(
        'loadedmetadata',
        () => {
          rafId = requestAnimationFrame(syncVideo)
        },
        { once: true }
      )
    }

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId)
    }
  }, [progress, useVideo])

  return (
    <div className="relative w-full min-h-screen bg-black">
      {/* Background: Video or Gradient */}
      {useVideo ? (
        <video
          ref={videoRef}
          className="fixed inset-0 w-full h-full object-cover opacity-40"
          src={videoSrc}
          poster={posterSrc}
          loop
          muted
          playsInline
          preload="metadata"
          aria-hidden="true"
          onError={(e) => {
            console.warn('[WebGLFallback] Video load failed, falling back to poster:', e)
            if (videoRef.current) {
              videoRef.current.style.display = 'none'
            }
          }}
        />
      ) : (
        <div
          className="fixed inset-0 w-full h-full opacity-40"
          style={{
            background: `linear-gradient(180deg, #000000 0%, ${currentStop.color}20 50%, #000000 100%)`,
            transition: 'background 1s ease-in-out',
          }}
          aria-hidden="true"
        />
      )}

      {/* Poster Image (fallback or reduced motion) */}
      {(!useVideo || prefersReducedMotion) && posterSrc && (
        <div
          className="fixed inset-0 w-full h-full bg-cover bg-center opacity-20"
          style={{
            backgroundImage: `url(${posterSrc})`,
          }}
          aria-hidden="true"
        />
      )}

      {/* Content Overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-8 py-20">
        {/* Stop Cards */}
        <div className="max-w-4xl w-full space-y-32">
          {JOURNEY_STOPS.map((stop, index) => {
            const isActive = currentStopIndex === index
            const isPast = currentStopIndex > index
            const opacity = isActive ? 1 : isPast ? 0.5 : 0.3

            return (
              <div
                key={stop.id}
                id={`stop-${stop.id}`}
                tabIndex={-1}
                className="transition-all duration-700 ease-out"
                style={{
                  opacity,
                  transform: `scale(${isActive ? 1 : 0.95})`,
                }}
              >
                {/* Stop Card */}
                <div
                  className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl"
                  style={{
                    borderColor: isActive ? `${stop.color}40` : 'rgba(255,255,255,0.1)',
                    boxShadow: isActive
                      ? `0 0 60px ${stop.color}30, 0 20px 40px rgba(0,0,0,0.5)`
                      : '0 20px 40px rgba(0,0,0,0.5)',
                  }}
                >
                  {/* Stop Number */}
                  <div
                    className="inline-flex items-center gap-3 mb-6 text-sm font-mono uppercase tracking-wider"
                    style={{ color: stop.color }}
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center font-bold"
                      style={{
                        backgroundColor: `${stop.color}20`,
                        border: `2px solid ${stop.color}`,
                      }}
                    >
                      {index + 1}
                    </div>
                    <span>
                      Stop {index + 1} of {JOURNEY_STOPS.length}
                    </span>
                  </div>

                  {/* Stop Name */}
                  <h2
                    className="text-4xl md:text-5xl font-bold mb-4 tracking-tight"
                    style={{ color: stop.color }}
                  >
                    {stop.name}
                  </h2>

                  {/* Description */}
                  <p className="text-white/80 text-lg md:text-xl mb-6 leading-relaxed">
                    {stop.description || 'Explore this section of your journey'}
                  </p>

                  {/* CTA Button */}
                  <a
                    href={stop.href}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black"
                    style={{
                      backgroundColor: stop.color,
                      color: '#000',
                      boxShadow: `0 4px 20px ${stop.color}40`,
                    }}
                    aria-label={`Visit ${stop.name}`}
                  >
                    <span>Visit Section</span>
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
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </a>

                  {/* Sub-lines (if any) */}
                  {stop.subLines && stop.subLines.length > 0 && (
                    <div className="mt-8 pt-8 border-t border-white/10">
                      <div className="text-xs text-white/50 mb-3 uppercase tracking-wider">
                        Related Content
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {stop.subLines.map((subLine) => (
                          <div
                            key={subLine.id}
                            className="flex items-center gap-2 text-sm text-white/70"
                          >
                            <div
                              className="w-2 h-2 rounded-full flex-shrink-0"
                              style={{ backgroundColor: stop.color }}
                              aria-hidden="true"
                            />
                            <span>{subLine.name}</span>
                            {subLine.stops && (
                              <span className="text-white/40 text-xs">({subLine.stops})</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* FIX HIGH-3: Progress Indicator with correct ARIA */}
        <nav
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-20"
          aria-label="Journey progress"
          role="navigation"
        >
          <div className="flex items-center gap-2 bg-black/80 backdrop-blur-md px-6 py-3 rounded-full border border-white/10">
            {JOURNEY_STOPS.map((stop, index) => (
              <button
                key={stop.id}
                className="w-2 h-2 rounded-full transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/50"
                style={{
                  backgroundColor:
                    index === currentStopIndex
                      ? stop.color
                      : index < currentStopIndex
                      ? `${stop.color}60`
                      : 'rgba(255,255,255,0.2)',
                  transform: index === currentStopIndex ? 'scale(1.5)' : 'scale(1)',
                }}
                aria-label={`Stop ${index + 1}: ${stop.name}`}
                aria-current={index === currentStopIndex ? 'step' : undefined}
                onClick={() => {
                  // Scroll to stop (optional enhancement)
                  const stopElement = document.getElementById(`stop-${stop.id}`)
                  if (stopElement) {
                    stopElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
                  }
                }}
              />
            ))}
          </div>
        </nav>

        {/* Accessibility Notice */}
        <div className="fixed top-4 right-4 z-20 bg-black/80 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10 text-white/60 text-xs">
          {prefersReducedMotion ? (
            <span>🎯 Static mode (reduced motion)</span>
          ) : useVideo ? (
            <span>🎬 Video fallback mode</span>
          ) : (
            <span>🖼️ Image fallback mode</span>
          )}
        </div>
      </div>
    </div>
  )
}
