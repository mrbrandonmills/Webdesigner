'use client'

import { useEffect, useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import * as THREE from 'three'
import { JOURNEY_STOPS, CAMERA_SPEED } from '@/lib/types/journey'

// Register GSAP plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface CameraControllerProps {
  onStopReached?: (stopId: string, index: number) => void
}

/**
 * CameraController - GSAP ScrollTrigger Camera Movement
 * Controls camera position based on scroll progress through journey
 */
export function CameraController({ onStopReached }: CameraControllerProps) {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null)
  const targetPosition = useRef(new THREE.Vector3(0, 0, 0))
  const currentStopIndex = useRef(0)
  const { camera } = useThree()

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Calculate total journey distance
    const totalDistance = Math.abs(JOURNEY_STOPS[JOURNEY_STOPS.length - 1].position.z)

    // Create scroll trigger for camera movement
    const scrollTrigger = ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: `+=${totalDistance * 2}`,
      scrub: 1,
      onUpdate: (self) => {
        // Calculate camera Z position based on scroll progress
        const progress = self.progress
        const zPosition = progress * totalDistance

        targetPosition.current.z = -zPosition

        // Check which stop we're at
        JOURNEY_STOPS.forEach((stop, index) => {
          const stopDistance = Math.abs(stop.position.z)
          const threshold = 500 // Distance threshold for "reaching" a stop

          if (
            Math.abs(zPosition - stopDistance) < threshold &&
            currentStopIndex.current !== index
          ) {
            currentStopIndex.current = index
            onStopReached?.(stop.id, index)
          }
        })
      }
    })

    return () => {
      scrollTrigger.kill()
    }
  }, [onStopReached])

  useFrame(() => {
    if (!cameraRef.current) return

    // Smooth camera movement with lerp
    cameraRef.current.position.lerp(targetPosition.current, 0.1)

    // Subtle camera sway for cinematic feel
    cameraRef.current.position.x = Math.sin(Date.now() * 0.0001) * 2
    cameraRef.current.position.y = Math.cos(Date.now() * 0.00015) * 1.5

    // Look slightly ahead
    const lookAtTarget = new THREE.Vector3(
      cameraRef.current.position.x,
      cameraRef.current.position.y,
      cameraRef.current.position.z - 10
    )
    cameraRef.current.lookAt(lookAtTarget)
  })

  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      position={[0, 0, 0]}
      fov={75}
      near={0.1}
      far={60000}
    />
  )
}
