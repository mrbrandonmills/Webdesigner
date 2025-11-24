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
  bloomIntensity = 1.5,
  chromaticAberrationStrength = 0.002,
  depthOfFieldEnabled = false
}: PostProcessingEffectsProps) {
  if (!enabled) return null

  return (
    <EffectComposer>
      <Bloom
        intensity={bloomIntensity}
        luminanceThreshold={0.1}
        luminanceSmoothing={0.9}
        radius={0.9}
        blendFunction={BlendFunction.ADD}
      />
      <ChromaticAberration
        offset={new THREE.Vector2(
          chromaticAberrationStrength,
          chromaticAberrationStrength
        )}
        blendFunction={BlendFunction.NORMAL}
      />
      <Vignette
        offset={0.3}
        darkness={0.6}
        eskil={false}
        blendFunction={BlendFunction.NORMAL}
      />
    </EffectComposer>
  )
}
