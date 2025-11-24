'use client'

import { EffectComposer, Bloom, ChromaticAberration, DepthOfField, Vignette } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import * as THREE from 'three'

interface PostProcessingEffectsProps {
  enabled?: boolean
  bloomIntensity?: number
  chromaticAberrationStrength?: number
  depthOfFieldEnabled?: boolean
}

/**
 * PostProcessingEffects - Advanced visual effects
 * Bloom, Chromatic Aberration, Depth of Field, Vignette
 */
export function PostProcessingEffects({
  enabled = true,
  bloomIntensity = 0.8,
  chromaticAberrationStrength = 0.0,
  depthOfFieldEnabled = false
}: PostProcessingEffectsProps) {
  if (!enabled) return null

  return (
    <EffectComposer>
      <>
        {/* Subtle bloom for elegant glow (not technical viewport brightness) */}
        <Bloom
          intensity={bloomIntensity}
          luminanceThreshold={0.3}
          luminanceSmoothing={0.7}
          radius={0.6}
          blendFunction={BlendFunction.ADD}
        />

        {/* Photorealistic depth of field for cinematic focus */}
        {depthOfFieldEnabled && (
          <DepthOfField
            focusDistance={0.02}
            focalLength={0.05}
            bokehScale={2.5}
            height={480}
          />
        )}

        {/* Subtle vignette for depth, not heavy technical effect */}
        <Vignette
          offset={0.5}
          darkness={0.35}
          eskil={false}
          blendFunction={BlendFunction.NORMAL}
        />
      </>
    </EffectComposer>
  )
}
