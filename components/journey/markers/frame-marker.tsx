'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { ParticleHalo } from '../particles/particle-halo'
import type { MarkerProps } from '@/lib/types/journey'

/**
 * FrameMarker - GALLERY Stop Marker
 * Elegant picture frame with cream finish
 */
export function FrameMarker({
  position,
  onHover,
  onClick,
  isActive = false,
  isHovered = false,
  color = '#F5F5DC'
}: MarkerProps) {
  const groupRef = useRef<THREE.Group>(null)
  const canvasRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!groupRef.current) return

    // Gentle rotation
    groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2

    // Floating
    groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.8) * 0.4

    // Canvas shimmer
    if (canvasRef.current) {
      const material = canvasRef.current.material as THREE.MeshStandardMaterial
      material.emissiveIntensity = 0.1 + Math.sin(state.clock.elapsedTime * 3) * 0.1
    }
  })

  return (
    <group
      ref={groupRef}
      position={position}
      onPointerEnter={() => onHover?.(true)}
      onPointerLeave={() => onHover?.(false)}
      onClick={onClick}
    >
      {/* Frame outer border */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2.5, 3.2, 0.3]} />
        <meshPhysicalMaterial
          color={color}
          metalness={0.3}
          roughness={0.4}
          clearcoat={0.5}
        />
      </mesh>

      {/* Frame inner border (darker) */}
      <mesh position={[0, 0, 0.16]}>
        <boxGeometry args={[2.3, 3, 0.05]} />
        <meshStandardMaterial
          color="#d4c5a9"
          metalness={0.2}
          roughness={0.6}
        />
      </mesh>

      {/* Canvas/artwork */}
      <mesh ref={canvasRef} position={[0, 0, 0.2]}>
        <planeGeometry args={[2, 2.7]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffefd5"
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Abstract art texture (gradient mesh) */}
      <mesh position={[0, 0, 0.21]}>
        <planeGeometry args={[1.8, 2.5]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Hanging wire */}
      <mesh position={[0, 1.8, -0.1]}>
        <torusGeometry args={[0.2, 0.02, 8, 32]} />
        <meshStandardMaterial
          color="#888888"
          metalness={0.9}
          roughness={0.3}
        />
      </mesh>

      {/* Ambient light */}
      <pointLight
        position={[0, 0, 2]}
        intensity={isHovered ? 2 : 1}
        distance={6}
        color={color}
      />

      {/* Particle halo */}
      <ParticleHalo count={400} color={color} radius={3.5} intensity={isActive ? 1.5 : 1} />

      {/* Active state ring */}
      {isActive && (
        <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
          <ringGeometry args={[4, 4.2, 64]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.4}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  )
}
