'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface HologramEffectProps {
  intensity?: number
  speed?: number
}

/**
 * HologramEffect - Sci-fi holographic scan lines
 * Creates animated scan lines that move across the object
 */
export function HologramEffect({ intensity = 0.8, speed = 1 }: HologramEffectProps) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!meshRef.current) return

    const material = meshRef.current.material as THREE.MeshBasicMaterial

    // Animated scan line position
    const scanPosition = (Math.sin(state.clock.elapsedTime * speed) + 1) * 0.5

    // Update opacity based on scan position
    material.opacity = intensity * (0.7 + Math.sin(state.clock.elapsedTime * 2) * 0.3)
  })

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <sphereGeometry args={[1.6, 32, 32]} />
      <meshBasicMaterial
        color="#60A5FA"
        transparent
        opacity={intensity}
        wireframe
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}
