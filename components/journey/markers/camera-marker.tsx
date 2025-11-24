'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { ParticleHalo } from '../particles/particle-halo'
import type { MarkerProps } from '@/lib/types/journey'

/**
 * CameraMarker - WORK Stop Marker
 * Museum-quality 3D camera sculpture with gold metallic finish
 */
export function CameraMarker({
  position,
  onHover,
  onClick,
  isActive = false,
  isHovered = false,
  color = '#D4AF37'
}: MarkerProps) {
  const groupRef = useRef<THREE.Group>(null)
  const lensRef = useRef<THREE.Mesh>(null)
  const lightRef = useRef<THREE.SpotLight>(null)

  useFrame((state) => {
    if (!groupRef.current) return

    // Slow elegant rotation
    groupRef.current.rotation.y += 0.005

    // Floating animation
    groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.3

    // Lens glow pulse
    if (lensRef.current) {
      const material = lensRef.current.material as THREE.MeshPhysicalMaterial
      material.emissiveIntensity = 0.5 + Math.sin(state.clock.elapsedTime * 2) * 0.3
    }

    // Enhanced lighting when hovered
    if (lightRef.current) {
      lightRef.current.intensity = isHovered ? 3 : 2
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
      {/* Camera body - gold metallic */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2, 1.5, 1]} />
        <meshPhysicalMaterial
          color={color}
          metalness={0.9}
          roughness={0.1}
          envMapIntensity={1.5}
          clearcoat={1.0}
          clearcoatRoughness={0.1}
        />
      </mesh>

      {/* Camera lens mount */}
      <mesh position={[0, 0, 0.7]} castShadow rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.5, 0.6, 0.4, 32]} />
        <meshPhysicalMaterial
          color={color}
          metalness={0.95}
          roughness={0.05}
        />
      </mesh>

      {/* Glass lens - transparent with refraction */}
      <mesh ref={lensRef} position={[0, 0, 1]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 0.3, 32]} />
        <meshPhysicalMaterial
          color="#ffffff"
          metalness={0}
          roughness={0}
          transmission={1.0}
          thickness={0.5}
          ior={1.5}
          emissive="#ffffff"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Viewfinder */}
      <mesh position={[0, 0.9, -0.3]} castShadow>
        <boxGeometry args={[0.6, 0.4, 0.4]} />
        <meshPhysicalMaterial
          color={color}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Shutter button */}
      <mesh position={[0.8, 0.8, 0.2]} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 0.2, 16]} />
        <meshPhysicalMaterial
          color="#1a1a1a"
          metalness={0.5}
          roughness={0.3}
        />
      </mesh>

      {/* Rim light */}
      <spotLight
        ref={lightRef}
        position={[3, 3, 3]}
        intensity={2}
        angle={0.3}
        penumbra={0.5}
        castShadow
        color={color}
      />

      {/* Point light for lens glow */}
      <pointLight
        position={[0, 0, 1.2]}
        intensity={isHovered ? 2 : 1}
        distance={5}
        color="#ffffff"
      />

      {/* Particle halo */}
      <ParticleHalo count={500} color={color} radius={3} intensity={isActive ? 1.5 : 1} />

      {/* Active state ring */}
      {isActive && (
        <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[3.5, 3.7, 64]} />
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
