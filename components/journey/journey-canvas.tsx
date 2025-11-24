'use client'

import { Canvas } from '@react-three/fiber'
import { Stars, Environment } from '@react-three/drei'
import { Suspense, useState } from 'react'
import * as THREE from 'three'
import { CameraController } from './camera-controller'
import { PostProcessingEffects } from './effects/post-processing'
import { JOURNEY_STOPS } from '@/lib/types/journey'

// Import all markers
import { CameraMarker } from './markers/camera-marker'
import { FrameMarker } from './markers/frame-marker'
import { BookMarker } from './markers/book-marker'
import { LotusMarker } from './markers/lotus-marker'
import { BagMarker } from './markers/bag-marker'
import { BrainMarker } from './markers/brain-marker'
import { ProfileMarker } from './markers/profile-marker'
import { EnvelopeMarker } from './markers/envelope-marker'

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
}

const MARKER_COMPONENTS = {
  Camera3D: CameraMarker,
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
export function JourneyCanvas({ onStopReached, onMarkerClick }: JourneyCanvasProps) {
  const [currentStopIndex, setCurrentStopIndex] = useState(0)
  const [hoveredMarker, setHoveredMarker] = useState<string | null>(null)

  const handleStopReached = (stopId: string, index: number) => {
    setCurrentStopIndex(index)
    onStopReached?.(stopId, index)
  }

  return (
    <Canvas
      shadows
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.2,
        outputColorSpace: THREE.SRGBColorSpace
      }}
      dpr={[1, 2]}
    >
      {/* Camera Controller */}
      <CameraController onStopReached={handleStopReached} />

      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[0, 5, 0]} intensity={0.5} color="#ffffff" />

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

            {/* Stop marker - scaled up for visibility at large distances */}
            <group scale={[30, 30, 30]}>
              <MarkerComponent
                position={[0, 0, stop.position.z / 30] as [number, number, number]}
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

      {/* Post-processing effects */}
      <PostProcessingEffects
        enabled={true}
        bloomIntensity={1.5}
        chromaticAberrationStrength={0.002}
        depthOfFieldEnabled={false}
      />
    </Canvas>
  )
}
