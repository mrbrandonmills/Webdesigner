'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { ParticleHalo } from '../particles/particle-halo'
import { NeuralPathways } from '../particles/neural-pathways'
import { ParticleCloud } from '../particles/particle-cloud'
import { HologramEffect } from '../effects/hologram-effect'
import type { MarkerProps } from '@/lib/types/journey'

/**
 * BrainMarker - MIND TOOLS Stop Marker
 * Holographic brain with neural pathways and consciousness particles
 */
export function BrainMarker({
  position,
  onHover,
  onClick,
  isActive = false,
  isHovered = false,
  color = '#3B82F6'
}: MarkerProps) {
  const groupRef = useRef<THREE.Group>(null)
  const brainRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!groupRef.current) return

    // Slow rotation
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.3

    // Floating
    groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.4) * 0.4

    // Brain pulsing
    if (brainRef.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05
      brainRef.current.scale.set(pulse, pulse, pulse)

      const material = brainRef.current.material as THREE.MeshPhysicalMaterial
      material.iridescence = 0.5 + Math.sin(state.clock.elapsedTime) * 0.5
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
      {/* Main brain sphere - semi-transparent iridescent */}
      <mesh ref={brainRef} castShadow>
        <sphereGeometry args={[1.5, 64, 64]} />
        <meshPhysicalMaterial
          color={color}
          metalness={0.5}
          roughness={0.2}
          transmission={0.7}
          thickness={2}
          clearcoat={1}
          iridescence={1}
          iridescenceIOR={1.3}
          ior={1.5}
        />
      </mesh>

      {/* Brain cortex ridges */}
      {[...Array(6)].map((_, i) => {
        const angle = (i / 6) * Math.PI * 2
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * 1.3,
              Math.sin(i) * 0.5,
              Math.sin(angle) * 1.3
            ]}
            rotation={[angle, 0, 0]}
            castShadow
          >
            <torusGeometry args={[0.6, 0.15, 8, 32]} />
            <meshPhysicalMaterial
              color={color}
              metalness={0.6}
              roughness={0.3}
              transmission={0.5}
              thickness={1}
            />
          </mesh>
        )
      })}

      {/* Inner core - glowing */}
      <mesh>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshPhysicalMaterial
          color="#60A5FA"
          emissive="#60A5FA"
          emissiveIntensity={isHovered ? 2 : 1}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Neural pathways */}
      <NeuralPathways count={50} color="#60A5FA" intensity={isActive ? 1.5 : 1} />

      {/* Thought particles */}
      <ParticleCloud count={2000} color={color} behavior="consciousness" intensity={isActive ? 1.2 : 0.8} />

      {/* Holographic scan lines */}
      <HologramEffect intensity={isHovered ? 1 : 0.6} speed={1.5} />

      {/* Energy pulses */}
      {[...Array(3)].map((_, i) => (
        <mesh key={`pulse-${i}`} position={[0, 0, 0]}>
          <sphereGeometry args={[2 + i * 0.3, 32, 32]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.1 - i * 0.03}
            wireframe
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}

      {/* Central light source */}
      <pointLight
        position={[0, 0, 0]}
        intensity={isHovered ? 4 : 2}
        distance={8}
        color={color}
      />

      {/* Rim lights */}
      <pointLight
        position={[3, 3, 3]}
        intensity={1.5}
        distance={6}
        color="#60A5FA"
      />
      <pointLight
        position={[-3, -3, -3]}
        intensity={1.5}
        distance={6}
        color="#93C5FD"
      />

      {/* Particle halo */}
      <ParticleHalo count={1000} color={color} radius={4} intensity={isActive ? 1.5 : 1} />

      {/* Active state ring */}
      {isActive && (
        <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[4.5, 4.7, 64]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.7}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  )
}
