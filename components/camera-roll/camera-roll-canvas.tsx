/**
 * Camera Roll Canvas - Main 3D Canvas Component
 * Integrates Three.js scene with scroll progress
 */

'use client'

import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { CameraRollScene } from './camera-roll-scene'
import * as THREE from 'three'

interface CameraRollCanvasProps {
  scrollProgress: number
}

function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color="#ffffff" wireframe />
    </mesh>
  )
}

export function CameraRollCanvas({ scrollProgress }: CameraRollCanvasProps) {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        camera={{
          position: [0, 0, 5],
          fov: 75,
          near: 0.1,
          far: 1000
        }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1
        }}
      >
        <Suspense fallback={<LoadingFallback />}>
          <CameraRollScene scrollProgress={scrollProgress} />
        </Suspense>
      </Canvas>
    </div>
  )
}
