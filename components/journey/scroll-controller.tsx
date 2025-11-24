/**
 * Scroll Controller
 *
 * Demonstration component showing GSAP ScrollTrigger integration
 * Displays scroll progress and provides debug information
 *
 * Phase 1: Foundation - Testing ScrollTrigger setup
 */

'use client'

import { useScrollProgressDebug } from '@/hooks/useScrollProgress'
import { getKeyframeAtProgress, getClosestStopIndex, CAMERA_KEYFRAMES } from '@/constants/journey-keyframes'
import { JOURNEY_STOPS } from '@/lib/types/journey'

interface ScrollControllerProps {
  /**
   * Show debug overlay
   */
  debug?: boolean

  /**
   * Callback when stop is reached
   */
  onStopReached?: (stopId: string, index: number) => void
}

/**
 * Scroll Controller Component
 *
 * Manages scroll-driven animation timeline
 * Provides scroll progress tracking and keyframe interpolation
 *
 * @example
 * ```tsx
 * <ScrollController debug={true} onStopReached={(id) => console.log(id)} />
 * ```
 */
export function ScrollController({ debug = false, onStopReached }: ScrollControllerProps) {
  // Use debug version of scroll progress hook in development
  const { progress, scrollToProgress } = useScrollProgressDebug({
    start: 'top top',
    end: 'bottom bottom',
    scrub: 1,
    markers: debug && process.env.NODE_ENV === 'development',
  })

  // Get current camera keyframe at scroll position
  const currentKeyframe = getKeyframeAtProgress(progress)
  const closestStopIndex = getClosestStopIndex(progress)
  const currentStop = JOURNEY_STOPS[closestStopIndex]

  // Debug overlay (only in development with debug=true)
  if (!debug || process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div
      className="fixed top-4 right-4 z-50 bg-black/80 text-white p-4 rounded-lg font-mono text-xs backdrop-blur-sm"
      style={{ maxWidth: '300px' }}
    >
      <div className="mb-2 font-bold text-sm border-b border-white/20 pb-2">
        Scroll Progress Debug
      </div>

      {/* Scroll Progress Bar */}
      <div className="mb-3">
        <div className="flex justify-between mb-1">
          <span>Progress:</span>
          <span className="font-bold">{(progress * 100).toFixed(1)}%</span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-100"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>

      {/* Current Stop */}
      <div className="mb-3">
        <div className="text-white/60 mb-1">Current Stop:</div>
        <div className="font-bold" style={{ color: currentStop?.color }}>
          {currentStop?.name || 'N/A'}
        </div>
        <div className="text-white/40 text-xs">
          {closestStopIndex + 1} of {JOURNEY_STOPS.length}
        </div>
      </div>

      {/* Camera Position */}
      <div className="mb-3">
        <div className="text-white/60 mb-1">Camera Position:</div>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div>
            <span className="text-white/40">X:</span> {currentKeyframe.position.x.toFixed(1)}
          </div>
          <div>
            <span className="text-white/40">Y:</span> {currentKeyframe.position.y.toFixed(1)}
          </div>
          <div>
            <span className="text-white/40">Z:</span> {currentKeyframe.position.z.toFixed(1)}
          </div>
        </div>
      </div>

      {/* FOV */}
      <div className="mb-3">
        <div className="text-white/60 mb-1">
          FOV: <span className="font-bold">{currentKeyframe.fov.toFixed(0)}°</span>
        </div>
      </div>

      {/* Quick Navigation */}
      <div className="border-t border-white/20 pt-2">
        <div className="text-white/60 mb-2 text-xs">Quick Nav:</div>
        <div className="grid grid-cols-4 gap-1">
          {CAMERA_KEYFRAMES.map((keyframe, index) => (
            <button
              key={keyframe.stopId}
              onClick={() => scrollToProgress(keyframe.progress, 1.5)}
              className="px-2 py-1 bg-white/10 hover:bg-white/20 rounded text-xs transition-colors"
              style={{
                backgroundColor:
                  closestStopIndex === index ? JOURNEY_STOPS[index].color : undefined,
                opacity: closestStopIndex === index ? 1 : 0.6,
              }}
              title={JOURNEY_STOPS[index].name}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      {/* ScrollTrigger Info */}
      <div className="border-t border-white/20 pt-2 mt-2 text-xs text-white/40">
        Using GSAP ScrollTrigger {process.env.NODE_ENV === 'development' ? '(Dev)' : ''}
      </div>
    </div>
  )
}
