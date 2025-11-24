'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { ParticleHalo } from '../particles/particle-halo'
import type { MarkerProps } from '@/lib/types/journey'

/**
 * BookMarker - BLOG Stop Marker
 * Open book with sage green cover and floating pages
 */
export function BookMarker({
  position,
  onHover,
  onClick,
  isActive = false,
  isHovered = false,
  color = '#9CA986'
}: MarkerProps) {
  const groupRef = useRef<THREE.Group>(null)
  const leftPageRef = useRef<THREE.Mesh>(null)
  const rightPageRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!groupRef.current) return

    // Gentle hovering rotation
    groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.3
    groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.6) * 0.35

    // Page turning animation
    if (leftPageRef.current && rightPageRef.current) {
      const turnAmount = Math.sin(state.clock.elapsedTime) * 0.1
      leftPageRef.current.rotation.y = -turnAmount
      rightPageRef.current.rotation.y = turnAmount
    }
  })

  return (
    <group
      ref={groupRef}
      position={position}
      onPointerEnter={() => onHover?.(true)}
      onPointerLeave={() => onHover?.(false)}
      onClick={onClick}
      rotation={[0.2, 0, 0]}
    >
      {/* Book spine/binding */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.15, 2, 1.5]} />
        <meshPhysicalMaterial
          color={color}
          metalness={0.1}
          roughness={0.7}
        />
      </mesh>

      {/* Left cover */}
      <mesh position={[-1, 0, 0]} rotation={[0, -0.3, 0]} castShadow>
        <boxGeometry args={[2, 2, 0.1]} />
        <meshPhysicalMaterial
          color={color}
          metalness={0.2}
          roughness={0.6}
          clearcoat={0.3}
        />
      </mesh>

      {/* Right cover */}
      <mesh position={[1, 0, 0]} rotation={[0, 0.3, 0]} castShadow>
        <boxGeometry args={[2, 2, 0.1]} />
        <meshPhysicalMaterial
          color={color}
          metalness={0.2}
          roughness={0.6}
          clearcoat={0.3}
        />
      </mesh>

      {/* Left pages */}
      <mesh ref={leftPageRef} position={[-0.9, 0, 0.1]} rotation={[0, -0.2, 0]} castShadow>
        <boxGeometry args={[1.8, 1.9, 0.3]} />
        <meshStandardMaterial
          color="#fefef0"
          roughness={0.9}
        />
      </mesh>

      {/* Right pages */}
      <mesh ref={rightPageRef} position={[0.9, 0, 0.1]} rotation={[0, 0.2, 0]} castShadow>
        <boxGeometry args={[1.8, 1.9, 0.3]} />
        <meshStandardMaterial
          color="#fefef0"
          roughness={0.9}
        />
      </mesh>

      {/* Gold bookmark ribbon */}
      <mesh position={[0, 1.2, 0.2]}>
        <boxGeometry args={[0.1, 1.5, 0.02]} />
        <meshPhysicalMaterial
          color="#D4AF37"
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Floating text particles */}
      {[...Array(20)].map((_, i) => {
        const angle = (i / 20) * Math.PI * 2
        const radius = 2.5
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * radius,
              Math.sin(angle + Math.PI / 4) * 0.5,
              Math.sin(angle) * radius
            ]}
          >
            <planeGeometry args={[0.1, 0.15]} />
            <meshBasicMaterial
              color="#666666"
              transparent
              opacity={0.3}
            />
          </mesh>
        )
      })}

      {/* Warm reading light */}
      <pointLight
        position={[0, 3, 2]}
        intensity={isHovered ? 2.5 : 1.5}
        distance={7}
        color="#ffeaa7"
      />

      {/* Particle halo */}
      <ParticleHalo count={600} color={color} radius={3.2} intensity={isActive ? 1.5 : 1} />

      {/* Active state ring */}
      {isActive && (
        <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
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
