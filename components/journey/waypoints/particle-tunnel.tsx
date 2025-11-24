'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { WaypointProps } from '@/lib/types/journey'

/**
 * ParticleTunnel - Before WORK Stop
 * Swirling tunnel of gold particles
 */
export function ParticleTunnel({ active, intensity = 1, color = '#D4AF37' }: WaypointProps) {
  const pointsRef = useRef<THREE.Points>(null)

  const positions = useMemo(() => {
    const arr = new Float32Array(10000 * 3)
    for (let i = 0; i < 10000; i++) {
      const theta = Math.random() * Math.PI * 2
      const r = 5 + Math.random() * 3
      const z = (Math.random() - 0.5) * 100

      arr[i * 3] = Math.cos(theta) * r
      arr[i * 3 + 1] = Math.sin(theta) * r
      arr[i * 3 + 2] = z
    }
    return arr
  }, [])

  useFrame((state) => {
    if (!pointsRef.current || !active) return

    // Rotate tunnel
    pointsRef.current.rotation.z = state.clock.elapsedTime * 0.1

    // Pulse opacity
    const material = pointsRef.current.material as THREE.PointsMaterial
    material.opacity = (0.6 + Math.sin(state.clock.elapsedTime * 2) * 0.2) * intensity
  })

  if (!active) return null

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={10000}
          array={positions}
          itemSize={3}
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color={color}
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}
