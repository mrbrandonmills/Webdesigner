'use client'

import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  DepthOfField,
  Vignette,
  SSAO,
  N8AO,
  LensFlare,
  ToneMapping,
  Noise
} from '@react-three/postprocessing'
import { BlendFunction, ToneMappingMode, KernelSize } from 'postprocessing'
import * as THREE from 'three'

interface PostProcessingEffectsProps {
  enabled?: boolean
  bloomIntensity?: number
  chromaticAberrationStrength?: number
  depthOfFieldEnabled?: boolean
  photorealisticMode?: boolean
}

/**
 * PostProcessingEffects - Award-Winning Film-Quality Visual Effects
 *
 * Inspired by: The Monolith Project, Kasane Keyboard, Awwwards SOTD
 *
 * Effects Stack (Photorealistic Mode):
 * - N8AO: Advanced screen-space ambient occlusion (better than SSAO)
 * - Depth of Field: Cinematic focus with bokeh blur
 * - Bloom: Elegant light blooms with mipmaps
 * - Noise: Film grain for analog camera aesthetic
 * - Chromatic Aberration: Subtle lens imperfection
 * - Lens Flare: Cinematic light streaks and halos
 * - Vignette: Dramatic framing
 * - Tone Mapping: ACES Filmic for film-accurate colors
 *
 * Basic Mode (Performance):
 * - SSAO: Basic ambient occlusion
 * - Simple bloom and vignette
 * - Light film grain
 */
export function PostProcessingEffects({
  enabled = true,
  bloomIntensity = 0.5,
  chromaticAberrationStrength = 0.0,
  depthOfFieldEnabled = true,
  photorealisticMode = true
}: PostProcessingEffectsProps) {
  if (!enabled) return null

  return (
    <EffectComposer
      multisampling={8}
      frameBufferType={THREE.HalfFloatType}
      stencilBuffer={true}
      depthBuffer={true}
      autoClear={true}
    >
      {photorealisticMode ? (
        <>
          {/* === ADVANCED AMBIENT OCCLUSION === */}
          {/* N8AO - Best-in-class AO with proper contact shadows */}
          <N8AO
            aoRadius={0.5}
            distanceFalloff={0.8}
            intensity={2.5}
            quality="performance"
            aoSamples={16}
            denoiseSamples={4}
            denoiseRadius={12}
            halfRes={false}
            screenSpaceRadius={true}
            color={new THREE.Color('#000000')}
          />

          {/* === DEPTH OF FIELD === */}
          {/* Cinematic focus with realistic bokeh blur */}
          {depthOfFieldEnabled && (
            <DepthOfField
              focusDistance={0.015}
              focalLength={0.08}
              bokehScale={3.5}
              height={720}
              width={1280}
            />
          )}

          {/* === BLOOM === */}
          {/* Elegant light blooms - luxury brand quality */}
          <Bloom
            intensity={bloomIntensity}
            luminanceThreshold={0.25}
            luminanceSmoothing={0.9}
            radius={0.85}
            mipmapBlur={true}
            levels={8}
            blendFunction={BlendFunction.ADD}
          />

          {/* === FILM GRAIN === */}
          {/* Analog camera aesthetic - subtle texture */}
          <Noise
            premultiply={false}
            blendFunction={BlendFunction.OVERLAY}
            opacity={0.08}
          />

          {/* === CHROMATIC ABERRATION === */}
          {/* Subtle lens imperfection - red/blue fringing */}
          <ChromaticAberration
            offset={new THREE.Vector2(0.0008, 0.0012)}
            radialModulation={true}
            modulationOffset={0.3}
            blendFunction={BlendFunction.NORMAL}
          />

          {/* === LENS FLARE === */}
          {/* Cinematic light streaks and halos */}
          <LensFlare
            glareSize={0.96}
            starPoints={6}
          />

          {/* === VIGNETTE === */}
          {/* Dramatic framing - draws eye to center */}
          <Vignette
            offset={0.45}
            darkness={0.5}
            eskil={false}
            blendFunction={BlendFunction.NORMAL}
          />

          {/* === TONE MAPPING === */}
          {/* ACES Filmic for film-accurate color grading */}
          <ToneMapping
            mode={ToneMappingMode.ACES_FILMIC}
            resolution={256}
            whitePoint={4.0}
            middleGrey={0.6}
            minLuminance={0.01}
            averageLuminance={1.0}
            adaptationRate={2.0}
          />
        </>
      ) : (
        <>
          {/* === BASIC MODE === */}
          {/* Simplified effects for better performance */}

          {/* Basic SSAO - Contact shadows */}
          <SSAO
            samples={16}
            radius={0.05}
            intensity={30}
            luminanceInfluence={0.7}
            color={new THREE.Color('#000000')}
            bias={0.001}
            fade={0.01}
            blendFunction={BlendFunction.MULTIPLY}
          />

          {/* Subtle bloom */}
          <Bloom
            intensity={bloomIntensity * 0.8}
            luminanceThreshold={0.3}
            luminanceSmoothing={0.7}
            radius={0.6}
            blendFunction={BlendFunction.ADD}
          />

          {/* Depth of field */}
          {depthOfFieldEnabled && (
            <DepthOfField
              focusDistance={0.02}
              focalLength={0.05}
              bokehScale={2.5}
              height={480}
            />
          )}

          {/* Film grain */}
          <Noise
            opacity={0.05}
            blendFunction={BlendFunction.OVERLAY}
          />

          {/* Vignette */}
          <Vignette
            offset={0.5}
            darkness={0.35}
            eskil={false}
            blendFunction={BlendFunction.NORMAL}
          />
        </>
      )}
    </EffectComposer>
  )
}
