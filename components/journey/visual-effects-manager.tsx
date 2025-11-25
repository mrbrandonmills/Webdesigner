/**
 * Visual Effects Manager
 * Manages post-processing effects with adaptive quality
 * Based on award-winning site patterns
 */

'use client'

import { useEffect, useState } from 'react'
import { EffectComposer, Bloom, DepthOfField, Vignette } from '@react-three/postprocessing'
import { useThree } from '@react-three/fiber'

export type QualityLevel = 'high' | 'medium' | 'low'

export interface VisualEffectsManagerProps {
  /**
   * Quality level for visual effects
   * Default: 'high'
   */
  quality?: QualityLevel

  /**
   * Enable/disable bloom effect
   * Default: true
   */
  enableBloom?: boolean

  /**
   * Enable/disable depth of field
   * Default: false (expensive)
   */
  enableDOF?: boolean

  /**
   * Enable/disable vignette
   * Default: true
   */
  enableVignette?: boolean
}

/**
 * Quality presets for different device capabilities
 */
const QUALITY_PRESETS = {
  high: {
    bloom: {
      intensity: 0.5,
      luminanceThreshold: 0.9,
      luminanceSmoothing: 0.9
    },
    dof: {
      focusDistance: 0,
      focalLength: 0.02,
      bokehScale: 2
    },
    vignette: {
      offset: 0.5,
      darkness: 0.5
    }
  },
  medium: {
    bloom: {
      intensity: 0.3,
      luminanceThreshold: 0.95,
      luminanceSmoothing: 0.8
    },
    dof: {
      focusDistance: 0,
      focalLength: 0.015,
      bokehScale: 1.5
    },
    vignette: {
      offset: 0.4,
      darkness: 0.4
    }
  },
  low: {
    bloom: {
      intensity: 0.2,
      luminanceThreshold: 0.98,
      luminanceSmoothing: 0.7
    },
    dof: {
      focusDistance: 0,
      focalLength: 0.01,
      bokehScale: 1
    },
    vignette: {
      offset: 0.3,
      darkness: 0.3
    }
  }
} as const

/**
 * Detect device performance tier
 * Returns quality level based on device capabilities
 */
function detectPerformanceTier(): QualityLevel {
  if (typeof window === 'undefined') return 'medium'

  // Check for mobile
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )

  if (isMobile) return 'low'

  // Check for high-performance devices
  const gl = document.createElement('canvas').getContext('webgl2')
  if (!gl) return 'low'

  const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
  if (!debugInfo) return 'medium'

  const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)

  // High-end GPUs
  if (
    renderer.includes('NVIDIA') ||
    renderer.includes('AMD') ||
    renderer.includes('Radeon')
  ) {
    return 'high'
  }

  return 'medium'
}

/**
 * Visual Effects Manager Component
 * Applies post-processing effects with adaptive quality
 */
export function VisualEffectsManager({
  quality,
  enableBloom = true,
  enableDOF = false,
  enableVignette = true
}: VisualEffectsManagerProps) {
  const { gl } = useThree()
  const [adaptiveQuality, setAdaptiveQuality] = useState<QualityLevel>('medium')

  // Detect performance tier on mount
  useEffect(() => {
    if (!quality) {
      const detectedQuality = detectPerformanceTier()
      setAdaptiveQuality(detectedQuality)
      console.log('[VisualEffects] Detected quality tier:', detectedQuality)
    } else {
      setAdaptiveQuality(quality)
    }
  }, [quality])

  const activeQuality = quality || adaptiveQuality
  const preset = QUALITY_PRESETS[activeQuality]

  return (
    <EffectComposer>
      <>
        {/* Bloom - Luxury glow effect */}
        {enableBloom && (
          <Bloom
            intensity={preset.bloom.intensity}
            luminanceThreshold={preset.bloom.luminanceThreshold}
            luminanceSmoothing={preset.bloom.luminanceSmoothing}
          />
        )}

        {/* Depth of Field - Cinematic focus (expensive) */}
        {enableDOF && activeQuality === 'high' && (
          <DepthOfField
            focusDistance={preset.dof.focusDistance}
            focalLength={preset.dof.focalLength}
            bokehScale={preset.dof.bokehScale}
          />
        )}

        {/* Vignette - Subtle frame darkening */}
        {enableVignette && (
          <Vignette
            offset={preset.vignette.offset}
            darkness={preset.vignette.darkness}
          />
        )}
      </>
    </EffectComposer>
  )
}
