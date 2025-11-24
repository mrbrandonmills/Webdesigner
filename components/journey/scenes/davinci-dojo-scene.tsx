'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { ParticleHalo } from '../particles/particle-halo'
import type { MarkerProps } from '@/lib/types/journey'

/**
 * DaVinciDojoScene - WORK Stop Environmental Scene
 *
 * A jaw-dropping fusion of Leonardo da Vinci's Renaissance studio
 * and a traditional Martial Arts Dojo. Represents the union of
 * creative mastery and physical discipline.
 *
 * Quality Level: AAA Video Game / High-End Architectural Visualization
 */
export function DaVinciDojoScene({
  position,
  onHover,
  onClick,
  isActive = false,
  isHovered = false,
  color = '#D4AF37'
}: MarkerProps) {
  const groupRef = useRef<THREE.Group>(null)
  const scrollRef = useRef<THREE.Group>(null)
  const dustParticlesRef = useRef<THREE.Points>(null)
  const candleFlickerRef = useRef<THREE.PointLight>(null)

  // Create floating dust particles for atmospheric depth
  const dustGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(300 * 3) // 300 dust particles

    for (let i = 0; i < 300; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 30 // x
      positions[i * 3 + 1] = Math.random() * 20 // y (float upward)
      positions[i * 3 + 2] = (Math.random() - 0.5) * 25 // z
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return geometry
  }, [])

  const dustMaterial = useMemo(() => {
    return new THREE.PointsMaterial({
      size: 0.05,
      color: '#ffecd2',
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    })
  }, [])

  useFrame((state) => {
    if (!groupRef.current) return

    // Subtle scene breathing animation
    groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.1

    // Floating dust particles - slow upward drift
    if (dustParticlesRef.current) {
      const positions = dustParticlesRef.current.geometry.attributes.position.array as Float32Array

      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += 0.01 // Slow upward drift

        // Reset particles that float too high
        if (positions[i + 1] > 20) {
          positions[i + 1] = 0
        }
      }

      dustParticlesRef.current.geometry.attributes.position.needsUpdate = true
    }

    // Gentle scroll sway animation
    if (scrollRef.current) {
      scrollRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.8) * 0.02
    }

    // Candlelight flicker
    if (candleFlickerRef.current) {
      const flicker = 1 + Math.sin(state.clock.elapsedTime * 10) * 0.1 + Math.random() * 0.05
      candleFlickerRef.current.intensity = isHovered ? 4 * flicker : 3 * flicker
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
      {/* === FLOOR === */}

      {/* Wooden floorboards - aged oak */}
      <mesh position={[0, -5, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[30, 25]} />
        <meshPhysicalMaterial
          color="#4a3a2a"
          roughness={0.9}
          metalness={0.0}
          clearcoat={0.1}
          clearcoatRoughness={0.8}
        />
      </mesh>

      {/* Tatami mat sections - traditional Japanese straw mats */}
      {/* Center tatami mat */}
      <mesh position={[0, -4.98, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[12, 10]} />
        <meshPhysicalMaterial
          color="#8b7355"
          roughness={0.95}
          metalness={0.0}
          normalScale={new THREE.Vector2(0.5, 0.5)}
        />
      </mesh>

      {/* Tatami border - dark fabric binding */}
      <mesh position={[0, -4.97, -5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[12, 0.3]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
      </mesh>
      <mesh position={[0, -4.97, 5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[12, 0.3]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
      </mesh>

      {/* === CENTRAL DRAFTING TABLE === */}

      {/* Table top - aged oak with detailed grain */}
      <mesh position={[0, -1, 0]} castShadow receiveShadow>
        <boxGeometry args={[8, 0.3, 5]} />
        <meshPhysicalMaterial
          color="#6b5638"
          roughness={0.7}
          metalness={0.0}
          clearcoat={0.3}
          clearcoatRoughness={0.5}
        />
      </mesh>

      {/* Table legs - turned wood */}
      {[[-3.5, 0, -2], [-3.5, 0, 2], [3.5, 0, -2], [3.5, 0, 2]].map((pos, i) => (
        <mesh key={`leg-${i}`} position={pos as [number, number, number]} castShadow>
          <cylinderGeometry args={[0.15, 0.2, 3, 16]} />
          <meshPhysicalMaterial
            color="#5a4632"
            roughness={0.6}
            metalness={0.0}
          />
        </mesh>
      ))}

      {/* === ITEMS ON TABLE === */}

      {/* Leonardo's anatomical drawing - parchment paper */}
      <mesh position={[-2, -0.7, 0]} rotation={[-Math.PI / 2, 0, 0.2]} receiveShadow>
        <planeGeometry args={[2.5, 3]} />
        <meshPhysicalMaterial
          color="#f5e6d3"
          roughness={0.9}
          metalness={0.0}
          emissive="#ffecd2"
          emissiveIntensity={0.05}
        />
      </mesh>

      {/* Blueprint scroll - partially unrolled */}
      <group ref={scrollRef} position={[2, -0.65, 1]} rotation={[0, 0.3, 0]}>
        {/* Rolled section */}
        <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 2, 16]} />
          <meshPhysicalMaterial
            color="#e8d7c3"
            roughness={0.8}
            metalness={0.0}
          />
        </mesh>
        {/* Unrolled section */}
        <mesh position={[0.5, 0, 0.5]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.5, 2]} />
          <meshPhysicalMaterial
            color="#f0e1d0"
            roughness={0.85}
            metalness={0.0}
          />
        </mesh>
      </group>

      {/* Quill pen - elegant writing instrument */}
      <group position={[-1, -0.5, 1.5]} rotation={[0, 0, -0.5]}>
        {/* Feather */}
        <mesh castShadow>
          <coneGeometry args={[0.05, 1.2, 8]} />
          <meshPhysicalMaterial
            color="#f5f5f5"
            roughness={0.7}
            metalness={0.0}
          />
        </mesh>
        {/* Quill tip */}
        <mesh position={[0, -0.7, 0]} castShadow>
          <coneGeometry args={[0.02, 0.3, 6]} />
          <meshPhysicalMaterial
            color="#1a1a1a"
            roughness={0.3}
            metalness={0.5}
          />
        </mesh>
      </group>

      {/* Ink bottle - glass with dark ink */}
      <group position={[-0.5, -0.6, -1.5]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.2, 0.25, 0.5, 16]} />
          <meshPhysicalMaterial
            color="#1a1a1a"
            roughness={0.0}
            metalness={0.0}
            transmission={0.8}
            thickness={0.3}
            ior={1.5}
          />
        </mesh>
        {/* Cork stopper */}
        <mesh position={[0, 0.35, 0]} castShadow>
          <cylinderGeometry args={[0.12, 0.15, 0.2, 12]} />
          <meshStandardMaterial color="#8b7355" roughness={0.9} />
        </mesh>
      </group>

      {/* Compass - brass drafting compass */}
      <group position={[1, -0.6, -1]} rotation={[0, 0.8, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.03, 0.03, 1, 8]} />
          <meshPhysicalMaterial
            color="#b8860b"
            roughness={0.2}
            metalness={0.9}
          />
        </mesh>
        <mesh position={[0.3, 0, 0]} rotation={[0, 0, -0.3]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 1, 8]} />
          <meshPhysicalMaterial
            color="#b8860b"
            roughness={0.2}
            metalness={0.9}
          />
        </mesh>
      </group>

      {/* Ruler - wooden measuring stick */}
      <mesh position={[3, -0.65, -0.5]} rotation={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[0.1, 0.05, 2.5]} />
        <meshPhysicalMaterial
          color="#8b7355"
          roughness={0.7}
          metalness={0.0}
        />
      </mesh>

      {/* === WALL MOUNTED ELEMENTS === */}

      {/* Back wall - weathered plaster */}
      <mesh position={[0, 2, -10]} receiveShadow>
        <planeGeometry args={[30, 20]} />
        <meshPhysicalMaterial
          color="#d4c4b0"
          roughness={0.95}
          metalness={0.0}
        />
      </mesh>

      {/* Anatomical drawing frame - left wall */}
      <group position={[-8, 2, -5]} rotation={[0, Math.PI / 4, 0]}>
        {/* Frame */}
        <mesh castShadow>
          <boxGeometry args={[2.5, 3.5, 0.2]} />
          <meshPhysicalMaterial
            color="#3a2f1f"
            roughness={0.6}
            metalness={0.0}
          />
        </mesh>
        {/* Drawing surface */}
        <mesh position={[0, 0, 0.15]}>
          <planeGeometry args={[2.2, 3.2]} />
          <meshPhysicalMaterial
            color="#f5e6d3"
            roughness={0.85}
            metalness={0.0}
            emissive="#ffecd2"
            emissiveIntensity={0.03}
          />
        </mesh>
      </group>

      {/* Architectural sketch frame - right wall */}
      <group position={[8, 2, -5]} rotation={[0, -Math.PI / 4, 0]}>
        <mesh castShadow>
          <boxGeometry args={[2.8, 2.2, 0.2]} />
          <meshPhysicalMaterial
            color="#3a2f1f"
            roughness={0.6}
            metalness={0.0}
          />
        </mesh>
        <mesh position={[0, 0, 0.15]}>
          <planeGeometry args={[2.5, 1.9]} />
          <meshPhysicalMaterial
            color="#f5e6d3"
            roughness={0.85}
            metalness={0.0}
          />
        </mesh>
      </group>

      {/* Japanese calligraphy scroll - hanging scroll */}
      <group position={[0, 5, -9.5]}>
        {/* Top scroll bar */}
        <mesh position={[0, 2.5, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 1.5, 12]} />
          <meshPhysicalMaterial
            color="#1a1a1a"
            roughness={0.4}
            metalness={0.0}
          />
        </mesh>
        {/* Paper */}
        <mesh position={[0, 0, 0.1]}>
          <planeGeometry args={[1.2, 4]} />
          <meshPhysicalMaterial
            color="#f8f4e8"
            roughness={0.9}
            metalness={0.0}
            emissive="#ffecd2"
            emissiveIntensity={0.02}
          />
        </mesh>
        {/* Bottom weight bar */}
        <mesh position={[0, -2.5, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 1.5, 12]} />
          <meshPhysicalMaterial
            color="#1a1a1a"
            roughness={0.4}
            metalness={0.0}
          />
        </mesh>
      </group>

      {/* Shelf with meditation bowl */}
      <group position={[-10, 1, -8]}>
        {/* Shelf */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2, 0.15, 0.8]} />
          <meshPhysicalMaterial
            color="#5a4632"
            roughness={0.7}
            metalness={0.0}
          />
        </mesh>
        {/* Meditation/singing bowl */}
        <mesh position={[0, 0.4, 0]} castShadow>
          <sphereGeometry args={[0.3, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshPhysicalMaterial
            color="#b8860b"
            roughness={0.3}
            metalness={0.85}
            clearcoat={0.5}
          />
        </mesh>
      </group>

      {/* === WING CHUN WOODEN DUMMY (Mook Jong) === */}

      <group position={[9, -2, 2]} rotation={[0, -Math.PI / 4, 0]}>
        {/* Main vertical post - weathered hardwood */}
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.4, 0.4, 6, 16]} />
          <meshPhysicalMaterial
            color="#4a3a2a"
            roughness={0.85}
            metalness={0.0}
          />
        </mesh>

        {/* Upper arm - left */}
        <mesh position={[-0.8, 1.5, 0]} rotation={[0, 0, -Math.PI / 6]} castShadow>
          <cylinderGeometry args={[0.15, 0.15, 2, 12]} />
          <meshPhysicalMaterial
            color="#5a4632"
            roughness={0.8}
            metalness={0.0}
          />
        </mesh>

        {/* Upper arm - right */}
        <mesh position={[0.8, 1.5, 0]} rotation={[0, 0, Math.PI / 6]} castShadow>
          <cylinderGeometry args={[0.15, 0.15, 2, 12]} />
          <meshPhysicalMaterial
            color="#5a4632"
            roughness={0.8}
            metalness={0.0}
          />
        </mesh>

        {/* Center arm */}
        <mesh position={[0, 0.3, 0.6]} rotation={[Math.PI / 3, 0, 0]} castShadow>
          <cylinderGeometry args={[0.15, 0.15, 1.8, 12]} />
          <meshPhysicalMaterial
            color="#5a4632"
            roughness={0.8}
            metalness={0.0}
          />
        </mesh>

        {/* Leg */}
        <mesh position={[0, -2, 0.5]} rotation={[Math.PI / 4, 0, 0]} castShadow>
          <cylinderGeometry args={[0.15, 0.15, 1.5, 12]} />
          <meshPhysicalMaterial
            color="#5a4632"
            roughness={0.8}
            metalness={0.0}
          />
        </mesh>

        {/* Base stand */}
        <mesh position={[0, -5.5, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1, 1.2, 1, 16]} />
          <meshPhysicalMaterial
            color="#3a2a1a"
            roughness={0.9}
            metalness={0.0}
          />
        </mesh>
      </group>

      {/* === BOOKS & ARTIFACTS === */}

      {/* Stack of leather-bound books - left side of table */}
      <group position={[-3, -0.3, -1.5]}>
        {/* Book 1 - bottom */}
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[1.2, 0.15, 1.8]} />
          <meshPhysicalMaterial
            color="#5a3a2a"
            roughness={0.7}
            metalness={0.0}
          />
        </mesh>
        {/* Book 2 - middle */}
        <mesh position={[0, 0.15, 0]} rotation={[0, 0.3, 0]} castShadow>
          <boxGeometry args={[1.1, 0.15, 1.7]} />
          <meshPhysicalMaterial
            color="#4a2a1a"
            roughness={0.7}
            metalness={0.0}
          />
        </mesh>
        {/* Book 3 - top */}
        <mesh position={[0, 0.3, 0]} rotation={[0, -0.2, 0]} castShadow>
          <boxGeometry args={[1.0, 0.15, 1.6]} />
          <meshPhysicalMaterial
            color="#6a4a3a"
            roughness={0.7}
            metalness={0.0}
          />
        </mesh>
      </group>

      {/* Buddha statue - small brass figure on shelf */}
      <group position={[-9, 1.3, -8]}>
        {/* Base */}
        <mesh castShadow>
          <cylinderGeometry args={[0.15, 0.2, 0.1, 16]} />
          <meshPhysicalMaterial
            color="#b8860b"
            roughness={0.3}
            metalness={0.8}
          />
        </mesh>
        {/* Body */}
        <mesh position={[0, 0.3, 0]} castShadow>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshPhysicalMaterial
            color="#d4af37"
            roughness={0.2}
            metalness={0.85}
            emissive="#d4af37"
            emissiveIntensity={0.1}
          />
        </mesh>
      </group>

      {/* Brush painting supplies - ink stone and brushes */}
      <group position={[3.5, -0.6, 1.5]}>
        {/* Ink stone */}
        <mesh castShadow>
          <boxGeometry args={[0.6, 0.1, 0.8]} />
          <meshPhysicalMaterial
            color="#1a1a1a"
            roughness={0.3}
            metalness={0.0}
          />
        </mesh>
        {/* Brush in holder */}
        <mesh position={[-0.5, 0.3, 0]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.8, 8]} />
          <meshPhysicalMaterial
            color="#3a2a1a"
            roughness={0.6}
            metalness={0.0}
          />
        </mesh>
      </group>

      {/* Meditation cushion (zafu) - on floor */}
      <mesh position={[-6, -4.5, 5]} rotation={[-Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.8, 0.7, 0.4, 32]} />
        <meshPhysicalMaterial
          color="#4a1a4a"
          roughness={0.9}
          metalness={0.0}
        />
      </mesh>

      {/* === LIGHTING === */}

      {/* Main warm candlelit ambiance - golden hour feel */}
      <pointLight
        ref={candleFlickerRef}
        position={[0, 3, 0]}
        intensity={3}
        distance={25}
        decay={2}
        color="#ffa500"
        castShadow
      />

      {/* Accent rim light on drafting table */}
      <spotLight
        position={[-5, 8, 5]}
        intensity={2}
        angle={0.5}
        penumbra={0.8}
        castShadow
        color="#ffecd2"
        target-position={[0, -1, 0]}
      />

      {/* Golden accent light on wooden dummy */}
      <spotLight
        position={[12, 5, 2]}
        intensity={1.5}
        angle={0.4}
        penumbra={0.6}
        color="#d4af37"
        castShadow
      />

      {/* Soft fill light for shadows */}
      <pointLight
        position={[0, 8, -8]}
        intensity={1.5}
        distance={20}
        color="#f5e6d3"
      />

      {/* Atmospheric dust particles */}
      <points ref={dustParticlesRef} geometry={dustGeometry} material={dustMaterial} />

      {/* Particle halo for interactive feedback */}
      <ParticleHalo count={600} color={color} radius={15} intensity={isActive ? 1.8 : 1.2} />

      {/* Active state indicator ring */}
      {isActive && (
        <mesh position={[0, -4.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[16, 16.5, 64]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.6}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Hover state glow effect */}
      {isHovered && (
        <pointLight
          position={[0, 0, 0]}
          intensity={3}
          distance={20}
          color={color}
        />
      )}
    </group>
  )
}
