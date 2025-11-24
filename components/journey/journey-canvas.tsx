'use client'

import { Canvas } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import { Suspense, useState } from 'react'
import * as THREE from 'three'
import { CameraAnimator } from './camera-animator'
import { ScrollController } from './scroll-controller'
import { PostProcessingEffects } from './effects/post-processing'
import { JOURNEY_STOPS } from '@/lib/types/journey'
import { usePerformanceMonitor, getQualitySettings } from '@/hooks/usePerformanceMonitor'

// Import all markers
import { CameraMarker } from './markers/camera-marker'
import { FrameMarker } from './markers/frame-marker'
import { BookMarker } from './markers/book-marker'
import { LotusMarker } from './markers/lotus-marker'
import { BagMarker } from './markers/bag-marker'
import { BrainMarker } from './markers/brain-marker'
import { ProfileMarker } from './markers/profile-marker'
import { EnvelopeMarker } from './markers/envelope-marker'

// Import environmental scenes
import { DaVinciDojoScene } from './scenes/davinci-dojo-scene'

// Import all waypoints
import { ParticleTunnel } from './waypoints/particle-tunnel'
import { ColorMorphField } from './waypoints/color-morph'
import { GeometricShapes } from './waypoints/geometric-shapes'
import { LiquidMetal } from './waypoints/liquid-metal'
import { ParticleSwarm } from './waypoints/particle-swarm'
import { HolographicField } from './waypoints/holographic-field'
import { GoldenTunnel } from './waypoints/golden-tunnel'

interface JourneyCanvasProps {
  onStopReached?: (stopId: string, index: number) => void
  onMarkerClick?: (stopId: string) => void
  /**
   * Enable debug UI (ScrollController with progress visualization)
   */
  debug?: boolean
}

const MARKER_COMPONENTS = {
  Camera3D: DaVinciDojoScene, // Replaced with full environmental scene
  PictureFrame3D: FrameMarker,
  Book3D: BookMarker,
  Lotus3D: LotusMarker,
  ShoppingBag3D: BagMarker,
  Brain3D: BrainMarker,
  Profile3D: ProfileMarker,
  Envelope3D: EnvelopeMarker
}

const WAYPOINT_COMPONENTS = {
  ParticleTunnel: ParticleTunnel,
  ColorMorphField: ColorMorphField,
  GeometricShapes: GeometricShapes,
  LiquidMetal: LiquidMetal,
  ParticleSwarm: ParticleSwarm,
  HolographicField: HolographicField,
  GoldenTunnel: GoldenTunnel,
  MessageBeam: GoldenTunnel // Using GoldenTunnel for MessageBeam
}

/**
 * JourneyCanvas - Main Three.js scene
 * Renders all markers, waypoints, and effects
 */
export function JourneyCanvas({ onStopReached, onMarkerClick, debug = false }: JourneyCanvasProps) {
  const [currentStopIndex, setCurrentStopIndex] = useState(0)
  const [hoveredMarker, setHoveredMarker] = useState<string | null>(null)

  // Performance monitoring with adaptive quality
  const { quality, metrics } = usePerformanceMonitor({
    targetFps: 60,
    autoAdjust: true,
    onQualityChange: (newQuality) => {
      if (debug && process.env.NODE_ENV === 'development') {
        console.log(`[Performance] Quality adjusted to: ${newQuality}`)
      }
    },
  })

  const qualitySettings = getQualitySettings(quality)

  const handleStopChange = (stopId: string) => {
    const stopIndex = JOURNEY_STOPS.findIndex((s) => s.id === stopId)
    if (stopIndex !== -1) {
      setCurrentStopIndex(stopIndex)
      onStopReached?.(stopId, stopIndex)
    }
  }

  return (
    <>
      {/* Debug UI - Scroll progress visualization */}
      {debug && <ScrollController debug={debug} />}

      {/* Performance stats overlay (dev mode) */}
      {debug && process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 z-50 bg-black/80 text-white p-3 rounded-lg font-mono text-xs backdrop-blur-sm">
          <div className="font-bold mb-2 border-b border-white/20 pb-1">
            Performance
          </div>
          <div>FPS: {metrics.fps}</div>
          <div>Avg: {metrics.avgFps}</div>
          <div>Quality: {quality.toUpperCase()}</div>
          {metrics.memory && <div>Memory: {metrics.memory}MB</div>}
          <div>Frame: {metrics.frameTime.toFixed(2)}ms</div>
        </div>
      )}

      <Canvas
        shadows
        gl={{
          antialias: qualitySettings.antialias,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
        dpr={qualitySettings.pixelRatio}
      >
        {/* NEW: GSAP-based Camera Animator (replaces CameraController) */}
        <CameraAnimator
          smooth={true}
          smoothFactor={0.1}
          onStopChange={handleStopChange}
        />

      {/* Lighting - Warm, cinematic product photography quality */}
      <ambientLight intensity={0.4} color="#f5f1e8" />
      <directionalLight
        position={[10, 10, 5]}
        intensity={0.8}
        color="#ffecd2"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      {/* Rim light for depth and luxury feel */}
      <pointLight position={[-15, 8, -10]} intensity={0.6} color="#d4af37" />
      {/* Fill light for softness */}
      <pointLight position={[0, 5, 5]} intensity={0.3} color="#ffffff" />

      {/* Environment */}
      <Suspense fallback={null}>
        <Stars
          radius={300}
          depth={60}
          count={5000}
          factor={7}
          saturation={0}
          fade
          speed={0.5}
        />
        {/* Background color - using manual color instead of HDRI environment */}
        <color attach="background" args={['#000000']} />
      </Suspense>

      {/* Journey Stops (Markers) */}
      {JOURNEY_STOPS.map((stop, index) => {
        const MarkerComponent = MARKER_COMPONENTS[stop.marker as keyof typeof MARKER_COMPONENTS]
        const WaypointComponent = WAYPOINT_COMPONENTS[stop.waypoint as keyof typeof WAYPOINT_COMPONENTS]

        if (!MarkerComponent) return null

        return (
          <group key={stop.id}>
            {/* Waypoint environment before marker */}
            {WaypointComponent && (
              <WaypointComponent
                active={Math.abs(currentStopIndex - index) <= 1}
                color={stop.color}
                intensity={currentStopIndex === index ? 1.5 : 0.8}
              />
            )}

            {/* Stop marker - scaled appropriately for museum-quality viewing */}
            <group scale={[10, 10, 10]}>
              <MarkerComponent
                position={[0, 0, stop.position.z / 10] as [number, number, number]}
                color={stop.color}
                isActive={currentStopIndex === index}
                isHovered={hoveredMarker === stop.id}
                onHover={(hovered) => setHoveredMarker(hovered ? stop.id : null)}
                onClick={() => onMarkerClick?.(stop.id)}
              />
            </group>
          </group>
        )
      })}

      {/* Fog for depth */}
      <fog attach="fog" args={['#000000', 1000, 20000]} />

      {/* Post-processing effects - Award-winning film-quality */}
      <PostProcessingEffects
        enabled={qualitySettings.postProcessing}
        bloomIntensity={0.5}
        chromaticAberrationStrength={0.0}
        depthOfFieldEnabled={quality === 'high'}
        photorealisticMode={quality !== 'low'}
      />
      </Canvas>
    </>
  )
}
