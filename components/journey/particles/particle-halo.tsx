'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { ParticleSystemProps } from '@/lib/types/journey'

/**
 * ParticleHalo - Orbital particle ring around markers
 * Creates a rotating ring of particles that orbit the marker
 */
export function ParticleHalo({
  count = 500,
  color = '#D4AF37',
  radius = 3,
  intensity = 1
}: ParticleSystemProps) {
  const pointsRef = useRef<THREE.Points>(null)

  const [positions, sizes] = useMemo(() => {
    const positionsArray = new Float32Array(count * 3)
    const sizesArray = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      // Create ring with some thickness
      const theta = (i / count) * Math.PI * 2
      const phi = (Math.random() - 0.5) * 0.3
      const r = radius + (Math.random() - 0.5) * 0.5

      positionsArray[i * 3] = Math.cos(theta) * Math.cos(phi) * r
      positionsArray[i * 3 + 1] = Math.sin(phi) * r
      positionsArray[i * 3 + 2] = Math.sin(theta) * Math.cos(phi) * r

      sizesArray[i] = Math.random() * 0.05 + 0.02
    }

    return [positionsArray, sizesArray]
  }, [count, radius])

  useFrame((state) => {
    if (!pointsRef.current) return

    // Slow elegant rotation
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.1
    pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.1

    // Pulsing opacity
    const material = pointsRef.current.material as THREE.PointsMaterial
    material.opacity = 0.6 + Math.sin(state.clock.elapsedTime * 2) * 0.2
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
        <bufferAttribute
          attach="attributes-size"
          count={count}
          array={sizes}
          itemSize={1}
          args={[sizes, 1]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color={color}
        transparent
        opacity={0.8 * intensity}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}
