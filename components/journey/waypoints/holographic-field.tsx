'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { WaypointProps } from '@/lib/types/journey'

/**
 * HolographicField - Before MIND TOOLS Stop
 * Sci-fi holographic grid with scan lines
 */
export function HolographicField({ active, intensity = 1, color = '#3B82F6' }: WaypointProps) {
  const groupRef = useRef<THREE.Group>(null)
  const scanLineRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!groupRef.current || !active) return

    // Rotate grid
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.15

    // Animated scan line
    if (scanLineRef.current) {
      scanLineRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 10
      const material = scanLineRef.current.material as THREE.MeshBasicMaterial
      material.opacity = (0.5 + Math.sin(state.clock.elapsedTime * 4) * 0.3) * intensity
    }
  })

  if (!active) return null

  return (
    <group ref={groupRef}>
      {/* Grid floor */}
      <mesh position={[0, -10, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[40, 40, 40, 40]} />
        <meshBasicMaterial
          color={color}
          wireframe
          transparent
          opacity={0.3 * intensity}
        />
      </mesh>

      {/* Grid ceiling */}
      <mesh position={[0, 10, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[40, 40, 40, 40]} />
        <meshBasicMaterial
          color={color}
          wireframe
          transparent
          opacity={0.3 * intensity}
        />
      </mesh>

      {/* Vertical grid walls */}
      {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((angle, i) => (
        <mesh
          key={i}
          position={[
            Math.cos(angle) * 20,
            0,
            Math.sin(angle) * 20
          ]}
          rotation={[0, angle, 0]}
        >
          <planeGeometry args={[40, 20, 40, 20]} />
          <meshBasicMaterial
            color={color}
            wireframe
            transparent
            opacity={0.2 * intensity}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}

      {/* Scanning plane */}
      <mesh ref={scanLineRef} position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.5}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Holographic particles */}
      {[...Array(100)].map((_, i) => {
        const angle = (i / 100) * Math.PI * 2
        const radius = 15 + Math.sin(i) * 3
        const height = Math.cos(i * 2) * 8
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * radius,
              height,
              Math.sin(angle) * radius
            ]}
          >
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshBasicMaterial
              color={color}
              transparent
              opacity={0.6 * intensity}
            />
          </mesh>
        )
      })}

      {/* Central glow */}
      <pointLight
        position={[0, 0, 0]}
        intensity={3 * intensity}
        distance={30}
        color={color}
      />
    </group>
  )
}
