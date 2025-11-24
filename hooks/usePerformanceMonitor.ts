/**
 * usePerformanceMonitor Hook
 *
 * Real-time FPS tracking and adaptive quality control
 * Based on award-winning site performance patterns
 */

'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

export type QualityLevel = 'high' | 'medium' | 'low'

export interface PerformanceMetrics {
  /**
   * Current frames per second
   */
  fps: number

  /**
   * Average FPS over last second
   */
  avgFps: number

  /**
   * Current quality level
   */
  quality: QualityLevel

  /**
   * Memory usage (MB) if available
   */
  memory?: number

  /**
   * Frame time (ms)
   */
  frameTime: number
}

export interface UsePerformanceMonitorOptions {
  /**
   * Target FPS for quality adjustments
   */
  targetFps?: number

  /**
   * Enable automatic quality adjustment
   */
  autoAdjust?: boolean

  /**
   * Sample interval in ms
   */
  sampleInterval?: number

  /**
   * Callback when quality changes
   */
  onQualityChange?: (quality: QualityLevel) => void

  /**
   * Callback with metrics update
   */
  onMetricsUpdate?: (metrics: PerformanceMetrics) => void
}

/**
 * Hook for monitoring performance and adjusting quality
 *
 * @example
 * ```tsx
 * function Scene() {
 *   const { metrics, quality } = usePerformanceMonitor({
 *     targetFps: 60,
 *     autoAdjust: true
 *   })
 *
 *   return (
 *     <Canvas>
 *       <mesh>
 *         <meshStandardMaterial
 *           roughness={quality === 'high' ? 0.1 : 0.5}
 *         />
 *       </mesh>
 *     </Canvas>
 *   )
 * }
 * ```
 */
export function usePerformanceMonitor(
  options: UsePerformanceMonitorOptions = {}
): {
  metrics: PerformanceMetrics
  quality: QualityLevel
  setQuality: (quality: QualityLevel) => void
} {
  const {
    targetFps = 60,
    autoAdjust = true,
    sampleInterval = 1000,
    onQualityChange,
    onMetricsUpdate,
  } = options

  const [quality, setQualityState] = useState<QualityLevel>('high')
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    avgFps: 60,
    quality: 'high',
    frameTime: 16.67,
  })

  // Frame counting refs
  const frameCountRef = useRef(0)
  const lastTimeRef = useRef(performance.now())
  const fpsHistoryRef = useRef<number[]>([])
  const rafIdRef = useRef<number | undefined>(undefined)

  // Quality adjustment debounce
  const qualityAdjustTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const setQuality = useCallback(
    (newQuality: QualityLevel) => {
      if (newQuality !== quality) {
        setQualityState(newQuality)
        onQualityChange?.(newQuality)
      }
    },
    [quality, onQualityChange]
  )

  useEffect(() => {
    if (typeof window === 'undefined') return

    let frames = 0
    let lastTime = performance.now()
    const fpsHistory: number[] = []

    const measurePerformance = () => {
      frames++
      const currentTime = performance.now()
      const deltaTime = currentTime - lastTime

      // Calculate FPS every sample interval
      if (deltaTime >= sampleInterval) {
        const fps = Math.round((frames * 1000) / deltaTime)
        fpsHistory.push(fps)

        // Keep only last 5 samples
        if (fpsHistory.length > 5) {
          fpsHistory.shift()
        }

        // Calculate average FPS
        const avgFps = Math.round(
          fpsHistory.reduce((a, b) => a + b, 0) / fpsHistory.length
        )

        // Get memory if available
        const memory =
          (performance as any).memory?.usedJSHeapSize
            ? Math.round((performance as any).memory.usedJSHeapSize / 1048576)
            : undefined

        const frameTime = deltaTime / frames

        const newMetrics: PerformanceMetrics = {
          fps,
          avgFps,
          quality,
          memory,
          frameTime,
        }

        setMetrics(newMetrics)
        onMetricsUpdate?.(newMetrics)

        // Auto-adjust quality based on FPS
        if (autoAdjust) {
          // Clear existing timeout
          if (qualityAdjustTimeoutRef.current) {
            clearTimeout(qualityAdjustTimeoutRef.current)
          }

          // Debounce quality changes (wait 2 seconds of consistent poor performance)
          qualityAdjustTimeoutRef.current = setTimeout(() => {
            if (avgFps < targetFps * 0.5) {
              // < 30fps → low quality
              setQuality('low')
            } else if (avgFps < targetFps * 0.8) {
              // < 48fps → medium quality
              setQuality('medium')
            } else if (avgFps >= targetFps * 0.95) {
              // >= 57fps → high quality
              setQuality('high')
            }
          }, 2000)
        }

        // Reset counters
        frames = 0
        lastTime = currentTime
      }

      rafIdRef.current = requestAnimationFrame(measurePerformance)
    }

    // Start monitoring
    rafIdRef.current = requestAnimationFrame(measurePerformance)

    // Cleanup
    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current)
      }
      if (qualityAdjustTimeoutRef.current) {
        clearTimeout(qualityAdjustTimeoutRef.current)
      }
    }
  }, [autoAdjust, targetFps, sampleInterval, quality, setQuality, onMetricsUpdate])

  return {
    metrics,
    quality,
    setQuality,
  }
}

/**
 * Get quality-adjusted settings for Three.js
 */
export function getQualitySettings(quality: QualityLevel) {
  switch (quality) {
    case 'low':
      return {
        pixelRatio: 1,
        antialias: false,
        shadowMapSize: 512,
        particleCount: 1000,
        postProcessing: false,
      }
    case 'medium':
      return {
        pixelRatio: Math.min(window.devicePixelRatio, 1.5),
        antialias: true,
        shadowMapSize: 1024,
        particleCount: 3000,
        postProcessing: true,
      }
    case 'high':
    default:
      return {
        pixelRatio: Math.min(window.devicePixelRatio, 2),
        antialias: true,
        shadowMapSize: 2048,
        particleCount: 5000,
        postProcessing: true,
      }
  }
}
