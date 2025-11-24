'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { ParticleSystemProps } from '@/lib/types/journey'

/**
 * ParticleCloud - Floating consciousness particles
 * Simulates thoughts floating around the brain marker
 */
export function ParticleCloud({
  count = 2000,
  color = '#3B82F6',
  behavior = 'consciousness',
  intensity = 1
}: ParticleSystemProps) {
  const pointsRef = useRef<THREE.Points>(null)

  const [positions, velocities] = useMemo(() => {
    const positionsArray = new Float32Array(count * 3)
    const velocitiesArray = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      // Start in a sphere
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(Math.random() * 2 - 1)
      const r = Math.random() * 2 + 1

      positionsArray[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positionsArray[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positionsArray[i * 3 + 2] = r * Math.cos(phi)

      // Random velocities for floating behavior
      velocitiesArray[i * 3] = (Math.random() - 0.5) * 0.02
      velocitiesArray[i * 3 + 1] = (Math.random() - 0.5) * 0.02
      velocitiesArray[i * 3 + 2] = (Math.random() - 0.5) * 0.02
    }

    return [positionsArray, velocitiesArray]
  }, [count])

  useFrame((state) => {
    if (!pointsRef.current) return

    const positionAttribute = pointsRef.current.geometry.attributes.position
    const positions = positionAttribute.array as Float32Array

    for (let i = 0; i < count; i++) {
      const i3 = i * 3

      if (behavior === 'consciousness') {
        // Floating with turbulence
        positions[i3] += velocities[i3]
        positions[i3 + 1] += velocities[i3 + 1]
        positions[i3 + 2] += velocities[i3 + 2]

        // Keep in bounds with smooth wrapping
        const distance = Math.sqrt(
          positions[i3] ** 2 +
          positions[i3 + 1] ** 2 +
          positions[i3 + 2] ** 2
        )

        if (distance > 3) {
          const factor = 2.9 / distance
          positions[i3] *= factor
          positions[i3 + 1] *= factor
          positions[i3 + 2] *= factor
        }

        // Add noise
        positions[i3 + 1] += Math.sin(state.clock.elapsedTime + i) * 0.001
      }
    }

    positionAttribute.needsUpdate = true
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.015}
        color={color}
        transparent
        opacity={0.6 * intensity}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}
