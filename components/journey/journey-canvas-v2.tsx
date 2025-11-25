/**
 * Journey Canvas V2
 * Award-winning 3D journey canvas using GSAP ScrollTrigger
 * Complete rebuild following industry patterns
 */

'use client'

import { Canvas } from '@react-three/fiber'
import { Suspense, useState } from 'react'
import { CameraAnimator } from './camera-animator'
import { VisualEffectsManager, QualityLevel } from './visual-effects-manager'
import * as THREE from 'three'

export interface JourneyCanvasV2Props {
  /**
   * Callback when camera reaches a stop
   */
  onStopReached?: (stopId: string, index: number) => void

  /**
   * Visual quality level
   * Default: auto-detected
   */
  quality?: QualityLevel

  /**
   * Enable debug mode
   */
  debug?: boolean
}

/**
 * Simple placeholder scene content
 * Will be replaced with photorealistic 3D scenes
 */
function ScenePlaceholder() {
  return (
    <>
      {/* Background */}
      <color attach="background" args={['#0a0a0a']} />
      <fog attach="fog" args={['#0a0a0a', 10000, 60000]} />

      {/* Lighting */}
      <ambientLight intensity={0.3} color="#f5f1e8" />
      <directionalLight
        position={[10, 10, 5]}
        intensity={0.8}
        color="#ffffff"
        castShadow
      />
      <directionalLight
        position={[-10, 5, -5]}
        intensity={0.3}
        color="#d4af37"
      />

      {/* Journey path visualization */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1000, 60000]} />
        <meshStandardMaterial
          color="#1a1a1a"
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>

      {/* Placeholder markers at stops */}
      {[
        { z: -5000, color: '#D4AF37' },   // WORK
        { z: -12000, color: '#F5F5DC' },  // GALLERY
        { z: -18000, color: '#9CA986' },  // BLOG
        { z: -26000, color: '#9B59B6' },  // MEDITATION
        { z: -33000, color: '#E74C3C' },  // SHOP
        { z: -40000, color: '#3B82F6' },  // MIND TOOLS
        { z: -46000, color: '#FFB347' },  // ABOUT
        { z: -51000, color: '#2ECC71' }   // CONTACT
      ].map((stop, i) => (
        <group key={i} position={[0, 2, stop.z]}>
          {/* Marker sphere */}
          <mesh>
            <sphereGeometry args={[3, 32, 32]} />
            <meshStandardMaterial
              color={stop.color}
              emissive={stop.color}
              emissiveIntensity={0.5}
              roughness={0.2}
              metalness={0.8}
            />
          </mesh>

          {/* Glow ring */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[4, 5, 32]} />
            <meshBasicMaterial
              color={stop.color}
              transparent
              opacity={0.3}
            />
          </mesh>
        </group>
      ))}

      {/* Grid helper for depth perception */}
      <gridHelper
        args={[2000, 100, '#333333', '#1a1a1a']}
        position={[0, -0.5, -25000]}
      />
    </>
  )
}

/**
 * Loading fallback
 */
function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color="#D4AF37" wireframe />
    </mesh>
  )
}

/**
 * Journey Canvas V2
 * Main 3D scene component
 */
export function JourneyCanvasV2({
  onStopReached,
  quality,
  debug = false
}: JourneyCanvasV2Props) {
  const [currentStop, setCurrentStop] = useState<{ id: string; index: number } | null>(null)

  const handleStopReached = (stopId: string, index: number) => {
    setCurrentStop({ id: stopId, index })
    onStopReached?.(stopId, index)
  }

  return (
    <div className="fixed inset-0 z-0 canvas-container">
      <Canvas
        camera={{
          position: [0, 15, 0],
          fov: 75,
          near: 0.1,
          far: 100000
        }}
        dpr={[1, 2]} // Device pixel ratio: 1x for low-end, 2x for high-end
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2
        }}
        shadows
      >
        <Suspense fallback={<LoadingFallback />}>
          {/* Camera animation system */}
          <CameraAnimator
            onStopReached={handleStopReached}
            debug={debug}
          />

          {/* Visual effects */}
          <VisualEffectsManager
            quality={quality}
            enableBloom={true}
            enableDOF={false}
            enableVignette={true}
          />

          {/* Scene content */}
          <ScenePlaceholder />
        </Suspense>
      </Canvas>

      {/* Debug overlay */}
      {debug && currentStop && (
        <div className="fixed top-4 left-4 z-50 bg-black/80 text-white p-4 rounded font-mono text-sm">
          <div>Current Stop: {currentStop.id}</div>
          <div>Index: {currentStop.index}</div>
        </div>
      )}
    </div>
  )
}
