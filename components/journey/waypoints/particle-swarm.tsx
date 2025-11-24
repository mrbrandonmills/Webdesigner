'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { WaypointProps } from '@/lib/types/journey'

/**
 * ParticleSwarm - Before SHOP Stop
 * Swarming particles like shopping activity
 */
export function ParticleSwarm({ active, intensity = 1, color = '#E74C3C' }: WaypointProps) {
  const pointsRef = useRef<THREE.Points>(null)

  const [positions, velocities] = useMemo(() => {
    const count = 5000
    const positionsArray = new Float32Array(count * 3)
    const velocitiesArray = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      // Random sphere distribution
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(Math.random() * 2 - 1)
      const r = Math.random() * 15

      positionsArray[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positionsArray[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positionsArray[i * 3 + 2] = r * Math.cos(phi)

      // Random velocities
      velocitiesArray[i * 3] = (Math.random() - 0.5) * 0.05
      velocitiesArray[i * 3 + 1] = (Math.random() - 0.5) * 0.05
      velocitiesArray[i * 3 + 2] = (Math.random() - 0.5) * 0.05
    }

    return [positionsArray, velocitiesArray]
  }, [])

  useFrame((state) => {
    if (!pointsRef.current || !active) return

    const positionAttribute = pointsRef.current.geometry.attributes.position
    const positions = positionAttribute.array as Float32Array
    const count = positions.length / 3

    // Swarm behavior - move toward center with some chaos
    for (let i = 0; i < count; i++) {
      const i3 = i * 3

      // Current position
      const x = positions[i3]
      const y = positions[i3 + 1]
      const z = positions[i3 + 2]

      // Distance from center
      const dist = Math.sqrt(x * x + y * y + z * z)

      // Apply velocities
      positions[i3] += velocities[i3]
      positions[i3 + 1] += velocities[i3 + 1]
      positions[i3 + 2] += velocities[i3 + 2]

      // Keep in bounds with attraction to center
      if (dist > 15) {
        velocities[i3] -= x * 0.001
        velocities[i3 + 1] -= y * 0.001
        velocities[i3 + 2] -= z * 0.001
      }

      // Add some turbulence
      velocities[i3] += (Math.random() - 0.5) * 0.002
      velocities[i3 + 1] += (Math.random() - 0.5) * 0.002
      velocities[i3 + 2] += (Math.random() - 0.5) * 0.002

      // Damping
      velocities[i3] *= 0.99
      velocities[i3 + 1] *= 0.99
      velocities[i3 + 2] *= 0.99
    }

    positionAttribute.needsUpdate = true
  })

  if (!active) return null

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={5000}
          array={positions}
          itemSize={3}
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color={color}
        transparent
        opacity={0.7 * intensity}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}
