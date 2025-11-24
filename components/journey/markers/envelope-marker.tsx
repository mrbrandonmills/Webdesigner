'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { ParticleHalo } from '../particles/particle-halo'
import type { MarkerProps } from '@/lib/types/journey'

/**
 * EnvelopeMarker - CONTACT Stop Marker
 * Email envelope with green finish and glowing seal
 */
export function EnvelopeMarker({
  position,
  onHover,
  onClick,
  isActive = false,
  isHovered = false,
  color = '#2ECC71'
}: MarkerProps) {
  const groupRef = useRef<THREE.Group>(null)
  const flapRef = useRef<THREE.Mesh>(null)
  const sealRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!groupRef.current) return

    // Gentle floating
    groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.7) * 0.35

    // Subtle rotation
    groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.2

    // Flap breathing (opening slightly)
    if (flapRef.current) {
      const breathe = Math.sin(state.clock.elapsedTime * 1.5) * 0.1
      flapRef.current.rotation.x = -0.3 + breathe
    }

    // Glowing seal
    if (sealRef.current) {
      const material = sealRef.current.material as THREE.MeshPhysicalMaterial
      material.emissiveIntensity = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.5
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
      {/* Envelope body */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[3, 2, 0.2]} />
        <meshPhysicalMaterial
          color={color}
          metalness={0.1}
          roughness={0.6}
          clearcoat={0.3}
        />
      </mesh>

      {/* Envelope back flap (bottom) */}
      <mesh position={[0, -1, 0.15]} rotation={[-0.3, 0, 0]} castShadow>
        <boxGeometry args={[3, 1.2, 0.1]} />
        <meshPhysicalMaterial
          color={new THREE.Color(color).multiplyScalar(0.9)}
          metalness={0.1}
          roughness={0.6}
        />
      </mesh>

      {/* Envelope top flap */}
      <mesh ref={flapRef} position={[0, 1, 0.15]} rotation={[-0.3, 0, 0]} castShadow>
        <boxGeometry args={[3, 1.2, 0.1]} />
        <meshPhysicalMaterial
          color={new THREE.Color(color).multiplyScalar(0.85)}
          metalness={0.15}
          roughness={0.55}
        />
      </mesh>

      {/* Side flaps */}
      <mesh position={[-1.5, 0, 0.15]} rotation={[0, 0, 0.3]} castShadow>
        <boxGeometry args={[0.3, 2.2, 0.1]} />
        <meshPhysicalMaterial
          color={new THREE.Color(color).multiplyScalar(0.95)}
          metalness={0.1}
          roughness={0.6}
        />
      </mesh>
      <mesh position={[1.5, 0, 0.15]} rotation={[0, 0, -0.3]} castShadow>
        <boxGeometry args={[0.3, 2.2, 0.1]} />
        <meshPhysicalMaterial
          color={new THREE.Color(color).multiplyScalar(0.95)}
          metalness={0.1}
          roughness={0.6}
        />
      </mesh>

      {/* Letter inside (peeking out) */}
      <mesh position={[0, 0.3, 0.25]}>
        <planeGeometry args={[2.5, 1.5]} />
        <meshStandardMaterial
          color="#fefef0"
          roughness={0.8}
        />
      </mesh>

      {/* Writing lines on letter */}
      {[...Array(5)].map((_, i) => (
        <mesh key={i} position={[0, 0.7 - i * 0.3, 0.26]}>
          <planeGeometry args={[2, 0.05]} />
          <meshBasicMaterial
            color="#333333"
            transparent
            opacity={0.3}
          />
        </mesh>
      ))}

      {/* Wax seal - gold */}
      <mesh ref={sealRef} position={[0, 0.5, 0.3]} castShadow>
        <cylinderGeometry args={[0.4, 0.4, 0.15, 32]} />
        <meshPhysicalMaterial
          color="#D4AF37"
          metalness={0.9}
          roughness={0.1}
          emissive="#D4AF37"
          emissiveIntensity={1}
        />
      </mesh>

      {/* Seal emblem */}
      <mesh position={[0, 0.58, 0.3]}>
        <circleGeometry args={[0.3, 32]} />
        <meshBasicMaterial
          color="#FFD700"
        />
      </mesh>

      {/* Message beam particles */}
      {[...Array(20)].map((_, i) => {
        const angle = (i / 20) * Math.PI * 2
        const radius = 2.8
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * radius,
              Math.sin(angle * 2) * 0.5,
              Math.sin(angle) * radius
            ]}
          >
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshBasicMaterial
              color={color}
              transparent
              opacity={0.5}
            />
          </mesh>
        )
      })}

      {/* Soft glow */}
      <pointLight
        position={[0, 0.5, 1]}
        intensity={isHovered ? 2.5 : 1.5}
        distance={6}
        color="#D4AF37"
      />

      {/* Ambient light */}
      <pointLight
        position={[0, 2, 2]}
        intensity={isHovered ? 2 : 1.2}
        distance={6}
        color={color}
      />

      {/* Particle halo */}
      <ParticleHalo count={650} color={color} radius={3.4} intensity={isActive ? 1.5 : 1} />

      {/* Active state ring */}
      {isActive && (
        <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
          <ringGeometry args={[3.9, 4.1, 64]} />
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
