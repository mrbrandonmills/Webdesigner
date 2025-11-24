'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { WaypointProps } from '@/lib/types/journey'

/**
 * GoldenTunnel - Before ABOUT Stop
 * Warm golden light tunnel representing personal story
 */
export function GoldenTunnel({ active, intensity = 1, color = '#FFB347' }: WaypointProps) {
  const groupRef = useRef<THREE.Group>(null)

  const rings = useMemo(() => {
    const ringArray = []
    for (let i = 0; i < 20; i++) {
      ringArray.push({
        z: i * 5 - 50,
        radius: 8 + Math.sin(i * 0.5) * 2,
        rotation: i * 0.3
      })
    }
    return ringArray
  }, [])

  useFrame((state) => {
    if (!groupRef.current || !active) return

    // Rotate entire tunnel
    groupRef.current.rotation.z = state.clock.elapsedTime * 0.2

    // Animate rings
    groupRef.current.children.forEach((child, i) => {
      if (child instanceof THREE.Mesh) {
        child.rotation.z = rings[i].rotation + state.clock.elapsedTime * 0.1
        child.scale.setScalar(1 + Math.sin(state.clock.elapsedTime + i) * 0.1)
      }
    })
  })

  if (!active) return null

  return (
    <group ref={groupRef}>
      {/* Tunnel rings */}
      {rings.map((ring, i) => (
        <mesh key={i} position={[0, 0, ring.z]}>
          <torusGeometry args={[ring.radius, 0.3, 16, 32]} />
          <meshPhysicalMaterial
            color={color}
            metalness={0.8}
            roughness={0.2}
            emissive={color}
            emissiveIntensity={0.5 * intensity}
            transparent
            opacity={0.7 * intensity}
          />
        </mesh>
      ))}

      {/* Light rays */}
      {[...Array(8)].map((_, i) => {
        const angle = (i / 8) * Math.PI * 2
        return (
          <mesh
            key={`ray-${i}`}
            position={[0, 0, -25]}
            rotation={[0, angle, 0]}
          >
            <planeGeometry args={[0.1, 100]} />
            <meshBasicMaterial
              color={color}
              transparent
              opacity={0.2 * intensity}
              blending={THREE.AdditiveBlending}
              side={THREE.DoubleSide}
            />
          </mesh>
        )
      })}

      {/* Warm ambient light */}
      <pointLight
        position={[0, 0, -25]}
        intensity={5 * intensity}
        distance={50}
        color={color}
      />

      {/* Particles flowing through tunnel */}
      {[...Array(200)].map((_, i) => {
        const angle = (i / 200) * Math.PI * 2
        const radius = 3 + Math.random() * 4
        const z = (Math.random() - 0.5) * 100
        return (
          <mesh
            key={`particle-${i}`}
            position={[
              Math.cos(angle) * radius,
              Math.sin(angle) * radius,
              z
            ]}
          >
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshBasicMaterial
              color={color}
              transparent
              opacity={0.5 * intensity}
            />
          </mesh>
        )
      })}
    </group>
  )
}
