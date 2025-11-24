'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { ParticleHalo } from '../particles/particle-halo'
import type { MarkerProps } from '@/lib/types/journey'

/**
 * LotusMarker - MEDITATION Stop Marker
 * Sacred lotus flower with purple petals and glowing center
 */
export function LotusMarker({
  position,
  onHover,
  onClick,
  isActive = false,
  isHovered = false,
  color = '#9B59B6'
}: MarkerProps) {
  const groupRef = useRef<THREE.Group>(null)
  const petalsRef = useRef<THREE.Group>(null)
  const centerRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!groupRef.current) return

    // Slow rotation
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.2

    // Gentle floating
    groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.25

    // Petals breathing (opening/closing)
    if (petalsRef.current) {
      const breathe = Math.sin(state.clock.elapsedTime) * 0.1
      petalsRef.current.scale.set(1 + breathe, 1, 1 + breathe)
    }

    // Glowing center
    if (centerRef.current) {
      const material = centerRef.current.material as THREE.MeshPhysicalMaterial
      material.emissiveIntensity = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.5
    }
  })

  // Create lotus petals
  const petalCount = 8
  const petals = []

  for (let i = 0; i < petalCount; i++) {
    const angle = (i / petalCount) * Math.PI * 2
    const radius = 1.5

    petals.push({
      position: [
        Math.cos(angle) * radius,
        Math.sin(i * 0.5) * 0.2,
        Math.sin(angle) * radius
      ] as [number, number, number],
      rotation: [0.3, angle, 0] as [number, number, number]
    })
  }

  return (
    <group
      ref={groupRef}
      position={position}
      onPointerEnter={() => onHover?.(true)}
      onPointerLeave={() => onHover?.(false)}
      onClick={onClick}
    >
      {/* Lotus petals */}
      <group ref={petalsRef}>
        {petals.map((petal, i) => (
          <mesh
            key={i}
            position={petal.position}
            rotation={petal.rotation}
            castShadow
          >
            <boxGeometry args={[0.8, 1.5, 0.05]} />
            <meshPhysicalMaterial
              color={color}
              metalness={0.1}
              roughness={0.4}
              transmission={0.2}
              thickness={0.5}
              clearcoat={0.5}
            />
          </mesh>
        ))}
      </group>

      {/* Inner petals layer */}
      <group scale={0.6} position={[0, 0.2, 0]}>
        {petals.map((petal, i) => (
          <mesh
            key={`inner-${i}`}
            position={petal.position}
            rotation={[petal.rotation[0], petal.rotation[1] + 0.2, petal.rotation[2]]}
            castShadow
          >
            <boxGeometry args={[0.8, 1.5, 0.05]} />
            <meshPhysicalMaterial
              color={new THREE.Color(color).multiplyScalar(1.3)}
              metalness={0.1}
              roughness={0.3}
              transmission={0.3}
              thickness={0.5}
            />
          </mesh>
        ))}
      </group>

      {/* Glowing center */}
      <mesh ref={centerRef} position={[0, 0.3, 0]} castShadow>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshPhysicalMaterial
          color="#FFD700"
          metalness={0.5}
          roughness={0.1}
          emissive="#FFD700"
          emissiveIntensity={1}
        />
      </mesh>

      {/* Stamens */}
      {[...Array(12)].map((_, i) => {
        const angle = (i / 12) * Math.PI * 2
        const radius = 0.25
        return (
          <mesh
            key={`stamen-${i}`}
            position={[
              Math.cos(angle) * radius,
              0.5,
              Math.sin(angle) * radius
            ]}
            castShadow
          >
            <cylinderGeometry args={[0.02, 0.02, 0.4, 8]} />
            <meshStandardMaterial
              color="#FFD700"
              emissive="#FFD700"
              emissiveIntensity={0.5}
            />
          </mesh>
        )
      })}

      {/* Water ripple base */}
      <mesh position={[0, -1, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2, 2.5, 64]} />
        <meshBasicMaterial
          color="#4A90E2"
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Soft glow light */}
      <pointLight
        position={[0, 0.5, 0]}
        intensity={isHovered ? 3 : 2}
        distance={6}
        color={color}
      />

      {/* Particle halo */}
      <ParticleHalo count={800} color={color} radius={3} intensity={isActive ? 1.5 : 1} />

      {/* Active state ring */}
      {isActive && (
        <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[3.5, 3.7, 64]} />
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
