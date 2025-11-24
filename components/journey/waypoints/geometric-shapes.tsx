'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { WaypointProps } from '@/lib/types/journey'

/**
 * GeometricShapes - Before BLOG Stop
 * Floating platonic solids representing knowledge
 */
export function GeometricShapes({ active, intensity = 1, color = '#9CA986' }: WaypointProps) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!groupRef.current || !active) return

    // Rotate entire group slowly
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.2
    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.2
  })

  if (!active) return null

  const shapes = [
    { geometry: <tetrahedronGeometry args={[2]}/>, position: [5, 0, 0] as [number, number, number] },
    { geometry: <octahedronGeometry args={[2]}/>, position: [-5, 3, -2] as [number, number, number] },
    { geometry: <icosahedronGeometry args={[2]}/>, position: [0, -4, 3] as [number, number, number] },
    { geometry: <dodecahedronGeometry args={[2]}/>, position: [-3, 5, 5] as [number, number, number] },
    { geometry: <boxGeometry args={[3, 3, 3]}/>, position: [4, -3, -4] as [number, number, number] },
    { geometry: <torusKnotGeometry args={[1.5, 0.5, 100, 16]}/>, position: [-4, -2, 2] as [number, number, number] }
  ]

  return (
    <group ref={groupRef}>
      {shapes.map((shape, i) => (
        <mesh
          key={i}
          position={shape.position}
          castShadow
        >
          {shape.geometry}
          <meshPhysicalMaterial
            color={color}
            metalness={0.5}
            roughness={0.3}
            transparent
            opacity={0.6 * intensity}
            wireframe
          />
        </mesh>
      ))}

      {/* Connecting lines between shapes */}
      {shapes.map((shape, i) => {
        if (i === 0) return null
        const prevShape = shapes[i - 1]
        const linePositions = new Float32Array([
          ...prevShape.position,
          ...shape.position
        ])
        return (
          <line key={`line-${i}`}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={2}
                array={linePositions}
                itemSize={3}
                args={[linePositions, 3]}
              />
            </bufferGeometry>
            <lineBasicMaterial
              color={color}
              transparent
              opacity={0.3 * intensity}
              blending={THREE.AdditiveBlending}
            />
          </line>
        )
      })}
    </group>
  )
}
