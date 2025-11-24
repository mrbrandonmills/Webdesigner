'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { ParticleHalo } from '../particles/particle-halo'
import type { MarkerProps } from '@/lib/types/journey'

/**
 * BagMarker - SHOP Stop Marker
 * Luxury shopping bag with red finish and gold handles
 */
export function BagMarker({
  position,
  onHover,
  onClick,
  isActive = false,
  isHovered = false,
  color = '#E74C3C'
}: MarkerProps) {
  const groupRef = useRef<THREE.Group>(null)
  const handlesRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!groupRef.current) return

    // Gentle swaying motion
    groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.8) * 0.1
    groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.7) * 0.3

    // Handle swinging
    if (handlesRef.current) {
      handlesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 1.2) * 0.1
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
      {/* Bag body */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2, 2.5, 1]} />
        <meshPhysicalMaterial
          color={color}
          metalness={0.1}
          roughness={0.3}
          clearcoat={0.7}
          clearcoatRoughness={0.2}
        />
      </mesh>

      {/* Bag bottom reinforcement */}
      <mesh position={[0, -1.25, 0]} castShadow>
        <boxGeometry args={[2.1, 0.1, 1.1]} />
        <meshPhysicalMaterial
          color={new THREE.Color(color).multiplyScalar(0.7)}
          metalness={0.2}
          roughness={0.4}
        />
      </mesh>

      {/* Bag top fold */}
      <mesh position={[0, 1.3, 0]} castShadow>
        <boxGeometry args={[2.2, 0.2, 1.1]} />
        <meshPhysicalMaterial
          color={new THREE.Color(color).multiplyScalar(0.8)}
          metalness={0.15}
          roughness={0.35}
        />
      </mesh>

      {/* Gold logo/emblem */}
      <mesh position={[0, 0, 0.51]}>
        <circleGeometry args={[0.3, 32]} />
        <meshPhysicalMaterial
          color="#D4AF37"
          metalness={0.9}
          roughness={0.1}
          emissive="#D4AF37"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Handles */}
      <group ref={handlesRef}>
        {/* Left handle */}
        <mesh position={[-0.6, 1.7, 0]} castShadow>
          <torusGeometry args={[0.4, 0.08, 16, 32]} />
          <meshPhysicalMaterial
            color="#D4AF37"
            metalness={0.95}
            roughness={0.05}
          />
        </mesh>

        {/* Right handle */}
        <mesh position={[0.6, 1.7, 0]} castShadow>
          <torusGeometry args={[0.4, 0.08, 16, 32]} />
          <meshPhysicalMaterial
            color="#D4AF37"
            metalness={0.95}
            roughness={0.05}
          />
        </mesh>
      </group>

      {/* Luxury brand texture pattern */}
      {[...Array(3)].map((_, i) => (
        <mesh key={i} position={[0, 0.5 - i * 0.8, 0.52]}>
          <planeGeometry args={[1.5, 0.05]} />
          <meshBasicMaterial
            color="#D4AF37"
            transparent
            opacity={0.3}
          />
        </mesh>
      ))}

      {/* Rim lighting */}
      <pointLight
        position={[0, 2, 2]}
        intensity={isHovered ? 2.5 : 1.5}
        distance={6}
        color="#D4AF37"
      />

      {/* Particle halo */}
      <ParticleHalo count={550} color={color} radius={3.3} intensity={isActive ? 1.5 : 1} />

      {/* Active state ring */}
      {isActive && (
        <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
          <ringGeometry args={[3.8, 4, 64]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.5}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  )
}
