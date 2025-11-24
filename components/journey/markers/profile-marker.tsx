'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { ParticleHalo } from '../particles/particle-halo'
import type { MarkerProps } from '@/lib/types/journey'

/**
 * ProfileMarker - ABOUT Stop Marker
 * Profile silhouette with amber/gold aura
 */
export function ProfileMarker({
  position,
  onHover,
  onClick,
  isActive = false,
  isHovered = false,
  color = '#FFB347'
}: MarkerProps) {
  const groupRef = useRef<THREE.Group>(null)
  const auraRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!groupRef.current) return

    // Gentle rotation
    groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.3
    groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.6) * 0.3

    // Pulsing aura
    if (auraRef.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1
      auraRef.current.scale.set(pulse, pulse, 1)

      const material = auraRef.current.material as THREE.MeshBasicMaterial
      material.opacity = 0.2 + Math.sin(state.clock.elapsedTime) * 0.1
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
      {/* Profile silhouette base */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[1.2, 1.5, 0.3, 32]} />
        <meshPhysicalMaterial
          color={color}
          metalness={0.4}
          roughness={0.3}
          clearcoat={0.6}
        />
      </mesh>

      {/* Head sphere */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshPhysicalMaterial
          color={color}
          metalness={0.5}
          roughness={0.2}
          clearcoat={0.7}
        />
      </mesh>

      {/* Shoulders/bust */}
      <mesh position={[0, 0.2, 0]} castShadow>
        <boxGeometry args={[2.5, 1, 0.8]} />
        <meshPhysicalMaterial
          color={new THREE.Color(color).multiplyScalar(0.9)}
          metalness={0.4}
          roughness={0.3}
        />
      </mesh>

      {/* Neck */}
      <mesh position={[0, 0.9, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.35, 0.6, 16]} />
        <meshPhysicalMaterial
          color={color}
          metalness={0.45}
          roughness={0.25}
        />
      </mesh>

      {/* Profile detail - nose/face contour */}
      <mesh position={[0.5, 1.5, 0.3]} castShadow>
        <boxGeometry args={[0.3, 0.6, 0.3]} />
        <meshPhysicalMaterial
          color={new THREE.Color(color).multiplyScalar(1.1)}
          metalness={0.5}
          roughness={0.2}
        />
      </mesh>

      {/* Glowing aura */}
      <mesh ref={auraRef} position={[0, 1, 0]}>
        <planeGeometry args={[4, 5]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Inner glow */}
      <mesh position={[0, 1, 0]}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.1}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Character particles floating around */}
      {[...Array(30)].map((_, i) => {
        const angle = (i / 30) * Math.PI * 2
        const radius = 2.5 + Math.sin(i) * 0.5
        const height = Math.cos(i * 2) * 2
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * radius,
              height,
              Math.sin(angle) * radius
            ]}
          >
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshBasicMaterial
              color={color}
              transparent
              opacity={0.6}
            />
          </mesh>
        )
      })}

      {/* Ambient light */}
      <pointLight
        position={[2, 2, 2]}
        intensity={isHovered ? 3 : 2}
        distance={7}
        color={color}
      />

      {/* Particle halo */}
      <ParticleHalo count={700} color={color} radius={3.5} intensity={isActive ? 1.5 : 1} />

      {/* Active state ring */}
      {isActive && (
        <mesh position={[0, 1, 0]} rotation={[0, 0, 0]}>
          <ringGeometry args={[4, 4.2, 64]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.6}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  )
}
