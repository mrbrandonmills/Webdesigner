/**
 * Camera Roll Scene - The Monolith Project Style
 * Camera tracking with roll/rotation as you scroll
 */

'use client'

import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

interface CameraRollSceneProps {
  scrollProgress: number
}

export function CameraRollScene({ scrollProgress }: CameraRollSceneProps) {
  const { camera, scene } = useThree()
  const groupRef = useRef<THREE.Group>(null)

  // Set up initial camera position
  useEffect(() => {
    camera.position.set(0, 0, 5)
    camera.lookAt(0, 0, 0)
  }, [camera])

  // Update camera based on scroll - with ROLL effect
  useFrame(() => {
    if (!groupRef.current) return

    // THE ROLL: Camera rotates on Z-axis as you scroll
    const rollAmount = scrollProgress * Math.PI * 2 // Full 360° rotation
    camera.rotation.z = rollAmount

    // Camera tracking: Move forward through space
    const trackDistance = scrollProgress * 20
    camera.position.z = 5 - trackDistance

    // Pan camera left/right with scroll
    const panAmount = Math.sin(scrollProgress * Math.PI) * 2
    camera.position.x = panAmount

    // Tilt camera up/down
    const tiltAmount = Math.cos(scrollProgress * Math.PI) * 0.3
    camera.rotation.x = tiltAmount

    // Rotate the scene itself for extra effect
    groupRef.current.rotation.y = scrollProgress * Math.PI * 0.5
  })

  return (
    <group ref={groupRef}>
      {/* Ambient light */}
      <ambientLight intensity={0.5} />

      {/* Directional light */}
      <directionalLight position={[5, 5, 5]} intensity={1} />

      {/* Background color */}
      <color attach="background" args={['#0a0a0a']} />

      {/* Fog for depth */}
      <fog attach="fog" args={['#0a0a0a', 10, 50]} />

      {/* Central monolith/cube that user flies past */}
      <mesh position={[0, 0, -10]}>
        <boxGeometry args={[2, 4, 2]} />
        <meshStandardMaterial
          color="#ffffff"
          metalness={0.9}
          roughness={0.1}
          emissive="#ffffff"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Floating particles/rings */}
      {Array.from({ length: 20 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            Math.sin(i * 0.5) * 5,
            (i - 10) * 2,
            -i * 3
          ]}
        >
          <torusGeometry args={[1, 0.1, 16, 32]} />
          <meshStandardMaterial
            color="#ffffff"
            metalness={0.8}
            roughness={0.2}
            emissive="#ffffff"
            emissiveIntensity={0.3}
          />
        </mesh>
      ))}

      {/* Grid floor for reference */}
      <gridHelper
        args={[100, 100, '#333333', '#1a1a1a']}
        position={[0, -5, 0]}
      />
    </group>
  )
}
