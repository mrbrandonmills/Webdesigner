/**
 * useDeviceDetection Hook
 *
 * Detects device capabilities for progressive enhancement
 * Determines WebGL support, GPU tier, mobile vs desktop, and performance hints
 *
 * Phase 3: Fallbacks & Accessibility - Device capability detection
 * QA CLEARED - All 8 issues fixed (1 CRITICAL, 3 HIGH, 2 MEDIUM, 2 LOW)
 */

'use client'

import { useState, useEffect } from 'react'

export type GPUTier = 'high' | 'medium' | 'low' | 'none'

export interface DeviceCapabilities {
  /**
   * WebGL support available
   */
  hasWebGL: boolean

  /**
   * WebGL 2.0 support available
   */
  hasWebGL2: boolean

  /**
   * Estimated GPU tier based on renderer string
   */
  gpuTier: GPUTier

  /**
   * Mobile device detection
   */
  isMobile: boolean

  /**
   * Tablet device detection
   */
  isTablet: boolean

  /**
   * Desktop device detection
   */
  isDesktop: boolean

  /**
   * Touch support available
   */
  isTouchDevice: boolean

  /**
   * Low-power mode or reduced motion preference
   */
  prefersReducedMotion: boolean

  /**
   * Device pixel ratio (1 = standard, 2 = retina)
   */
  devicePixelRatio: number

  /**
   * Available memory in GB (Chrome only)
   */
  deviceMemory?: number

  /**
   * GPU renderer string (e.g., "Apple M1", "NVIDIA GTX 1080")
   */
  gpuRenderer?: string

  /**
   * Recommended whether to use 3D or fallback
   */
  shouldUse3D: boolean
}

// FIX LOW-2: Proper TypeScript interface for WebGL debug extension
interface WEBGL_debug_renderer_info {
  readonly UNMASKED_VENDOR_WEBGL: number
  readonly UNMASKED_RENDERER_WEBGL: number
}

/**
 * Detect WebGL support and version
 * FIX CRITICAL-1: Canvas cleanup and context loss
 */
function detectWebGL(): { hasWebGL: boolean; hasWebGL2: boolean; renderer?: string } {
  if (typeof window === 'undefined') {
    return { hasWebGL: false, hasWebGL2: false }
  }

  let canvas: HTMLCanvasElement | null = null
  try {
    canvas = document.createElement('canvas')
    canvas.width = 1
    canvas.height = 1

    // Try WebGL2 first
    const gl2 = canvas.getContext('webgl2')
    if (gl2) {
      const debugInfo = gl2.getExtension('WEBGL_debug_renderer_info') as WEBGL_debug_renderer_info | null
      const renderer = debugInfo
        ? (gl2.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) as string)
        : undefined

      // Force context loss to free GPU resources
      const loseContext = gl2.getExtension('WEBGL_lose_context')
      if (loseContext) loseContext.loseContext()

      return { hasWebGL: true, hasWebGL2: true, renderer }
    }

    // Fallback to WebGL1
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    if (gl) {
      const debugInfo = (gl as WebGLRenderingContext).getExtension('WEBGL_debug_renderer_info') as WEBGL_debug_renderer_info | null
      const renderer = debugInfo
        ? ((gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) as string)
        : undefined

      // Force context loss
      const loseContext = (gl as WebGLRenderingContext).getExtension('WEBGL_lose_context')
      if (loseContext) loseContext.loseContext()

      return { hasWebGL: true, hasWebGL2: false, renderer }
    }

    return { hasWebGL: false, hasWebGL2: false }
  } catch (error) {
    console.warn('[DeviceDetection] WebGL detection failed:', error)

    // FIX LOW-1: Optional error tracking integration
    if (typeof window !== 'undefined' && (window as any).__ERROR_TRACKER__) {
      (window as any).__ERROR_TRACKER__.captureException(error, {
        level: 'warning',
        tags: { component: 'device-detection', phase: 'webgl-check' },
      })
    }

    return { hasWebGL: false, hasWebGL2: false }
  } finally {
    // FIX CRITICAL-1: Clean up canvas reference
    if (canvas) {
      canvas.width = 0
      canvas.height = 0
      canvas = null
    }
  }
}

/**
 * Estimate GPU tier based on renderer string
 * Uses heuristics from known GPU patterns
 * FIX MEDIUM-2: Expanded GPU classification
 */
function estimateGPUTier(renderer?: string): GPUTier {
  if (!renderer) return 'medium'

  const r = renderer.toLowerCase()

  // High-end indicators (desktop + mobile)
  const highEndPatterns = [
    // Apple Silicon (M1 and up)
    'apple m1', 'apple m2', 'apple m3', 'apple m4',
    'apple m1 pro', 'apple m1 max', 'apple m1 ultra',
    'apple m2 pro', 'apple m2 max', 'apple m2 ultra',
    'apple m3 pro', 'apple m3 max', 'apple m3 ultra',

    // NVIDIA High-end (desktop)
    'rtx 2060', 'rtx 2070', 'rtx 2080', 'rtx 3060', 'rtx 3070', 'rtx 3080', 'rtx 3090',
    'rtx 4060', 'rtx 4070', 'rtx 4080', 'rtx 4090',
    'gtx 1660', 'gtx 1070', 'gtx 1080',

    // AMD High-end (desktop)
    'rx 6600', 'rx 6700', 'rx 6800', 'rx 6900',
    'rx 7600', 'rx 7700', 'rx 7800', 'rx 7900',
    'vega 56', 'vega 64',

    // Intel Modern (desktop + laptop)
    'intel iris xe', 'intel arc a', 'intel uhd 770',

    // Mobile High-end
    'adreno 640', 'adreno 650', 'adreno 660', 'adreno 730', 'adreno 740',
    'mali-g76', 'mali-g77', 'mali-g78', 'mali-g710',
    'apple a14', 'apple a15', 'apple a16', 'apple a17',
  ]

  // Low-end indicators
  const lowEndPatterns = [
    // Old integrated graphics
    'intel hd graphics 3000', 'intel hd graphics 4000', 'intel hd graphics 5000',
    'intel hd graphics 6000', 'intel hd graphics 400', 'intel hd graphics 500',

    // Mobile low-end
    'adreno 505', 'adreno 506', 'adreno 508', 'adreno 509',
    'mali-t720', 'mali-t760', 'mali-t830', 'mali-t860',
    'mali-g51', 'mali-g52',
    'powervr sgx',

    // Software renderers (ONLY pure software, not ANGLE)
    'swiftshader', 'llvmpipe', 'softpipe',
  ]

  // Check high-end first
  if (highEndPatterns.some((pattern) => r.includes(pattern))) {
    return 'high'
  }

  // Check low-end
  if (lowEndPatterns.some((pattern) => r.includes(pattern))) {
    return 'low'
  }

  // ANGLE with DirectX - try to detect underlying GPU
  if (r.includes('angle')) {
    // ANGLE wraps DirectX, check for GPU name after it
    // Example: "ANGLE (NVIDIA GeForce RTX 3070 Direct3D11 vs_5_0 ps_5_0)"
    if (highEndPatterns.some((pattern) => r.includes(pattern))) {
      return 'high'
    }
    if (lowEndPatterns.some((pattern) => r.includes(pattern))) {
      return 'low'
    }
    // Unknown GPU behind ANGLE, assume medium
    return 'medium'
  }

  // Default to medium for unknown GPUs
  return 'medium'
}

/**
 * Detect mobile/tablet/desktop
 * FIX HIGH-3: Improved tablet detection (iPad Pro, modern iPads, touch laptops)
 */
function detectDeviceType(): {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  isTouchDevice: boolean
} {
  if (typeof window === 'undefined') {
    return { isMobile: false, isTablet: false, isDesktop: true, isTouchDevice: false }
  }

  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera || ''
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
  const screenWidth = window.innerWidth

  // Modern iPad detection (iPadOS 13+ reports as desktop)
  const isModernIPad = /Macintosh/i.test(userAgent) && navigator.maxTouchPoints > 1

  // Mobile detection (phones)
  const isMobile =
    (/android|webos|iphone|ipod|blackberry|iemobile|opera mini/i.test(userAgent) &&
      screenWidth < 768) ||
    (isTouchDevice && screenWidth < 480) // Small touch screen

  // Tablet detection
  const isTablet =
    /ipad|android(?!.*mobile)|tablet|kindle|playbook|silk/i.test(userAgent) ||
    isModernIPad ||
    (isTouchDevice &&
      screenWidth >= 768 &&
      screenWidth <= 1366 && // Extended for iPad Pro 12.9"
      !/Windows NT|Macintosh/i.test(userAgent)) // Exclude touch laptops

  const isDesktop = !isMobile && !isTablet

  return { isMobile, isTablet, isDesktop, isTouchDevice }
}

/**
 * Hook for detecting device capabilities
 * FIX HIGH-1: Race condition protection with isMounted flag
 * FIX HIGH-2: Safari MediaQueryList compatibility
 * FIX MEDIUM-1: Resize handling with debouncing
 *
 * @example
 * ```tsx
 * function JourneyPage() {
 *   const device = useDeviceDetection()
 *
 *   if (!device.shouldUse3D) {
 *     return <VideoFallback />
 *   }
 *
 *   return <JourneyCanvas quality={device.gpuTier} />
 * }
 * ```
 */
export function useDeviceDetection(): DeviceCapabilities {
  const [capabilities, setCapabilities] = useState<DeviceCapabilities>(() => {
    // SSR-safe default
    return {
      hasWebGL: false,
      hasWebGL2: false,
      gpuTier: 'medium',
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      isTouchDevice: false,
      prefersReducedMotion: false,
      devicePixelRatio: 1,
      shouldUse3D: false,
    }
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    // FIX HIGH-1: isMounted flag to prevent state updates after unmount
    let isMounted = true

    // Cache WebGL detection (won't change during session)
    const webgl = detectWebGL()

    // Detection function (can be called on resize)
    const detectCapabilities = () => {
      if (!isMounted) return

      // Detect device type (can change on resize/rotation)
      const deviceType = detectDeviceType()

      // Check reduced motion preference
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      // Device pixel ratio
      const devicePixelRatio = window.devicePixelRatio || 1

      // Device memory (Chrome only)
      const deviceMemory = (navigator as any).deviceMemory

      // GPU tier estimation
      const gpuTier = estimateGPUTier(webgl.renderer)

      // Decision: Should we use 3D?
      // Criteria:
      // 1. WebGL support
      // 2. Not mobile (or high-end mobile)
      // 3. Not reduced motion preference
      // 4. Sufficient GPU tier
      const shouldUse3D =
        webgl.hasWebGL &&
        !prefersReducedMotion &&
        (deviceType.isDesktop ||
          (deviceType.isTablet && gpuTier !== 'low') ||
          (deviceType.isMobile && gpuTier === 'high'))

      setCapabilities({
        hasWebGL: webgl.hasWebGL,
        hasWebGL2: webgl.hasWebGL2,
        gpuTier: webgl.hasWebGL ? gpuTier : 'none',
        ...deviceType,
        prefersReducedMotion,
        devicePixelRatio,
        deviceMemory,
        gpuRenderer: webgl.renderer,
        shouldUse3D,
      })
    }

    // Initial detection
    detectCapabilities()

    // FIX MEDIUM-1: Listen for resize (debounced)
    let resizeTimeout: ReturnType<typeof setTimeout>
    const handleResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
        detectCapabilities()
      }, 250) // Debounce 250ms
    }

    // Listen for reduced motion changes
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    // FIX HIGH-2: Safari compatibility for MediaQueryList
    const handleMotionChange = (e: MediaQueryListEvent | MediaQueryList) => {
      if (!isMounted) return

      const matches = 'matches' in e ? e.matches : (e as MediaQueryList).matches
      setCapabilities((prev) => ({
        ...prev,
        prefersReducedMotion: matches,
        shouldUse3D: prev.shouldUse3D && !matches, // Disable 3D if reduced motion enabled
      }))
    }

    window.addEventListener('resize', handleResize)

    // Cross-browser MediaQueryList event listeners
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleMotionChange)
    } else {
      // Safari < 14 fallback
      mediaQuery.addListener(handleMotionChange as any)
    }

    // Debug logging (development only)
    if (process.env.NODE_ENV === 'development') {
      console.log('[DeviceDetection] Capabilities:', capabilities)
    }

    return () => {
      isMounted = false
      clearTimeout(resizeTimeout)
      window.removeEventListener('resize', handleResize)

      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleMotionChange)
      } else {
        mediaQuery.removeListener(handleMotionChange as any)
      }
    }
  }, []) // Still empty - we handle updates internally

  return capabilities
}

/**
 * Get recommended quality level based on device capabilities
 */
export function getRecommendedQuality(device: DeviceCapabilities): 'high' | 'medium' | 'low' {
  if (!device.hasWebGL || device.gpuTier === 'none') {
    return 'low'
  }

  if (device.isMobile) {
    return device.gpuTier === 'high' ? 'medium' : 'low'
  }

  if (device.prefersReducedMotion) {
    return 'medium'
  }

  // Desktop/Tablet quality based on GPU tier
  switch (device.gpuTier) {
    case 'high':
      return 'high'
    case 'medium':
      return 'medium'
    case 'low':
    default:
      return 'low'
  }
}
