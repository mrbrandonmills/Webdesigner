'use client'

import { useEffect, useRef, useMemo } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import gsap from 'gsap'
import * as THREE from 'three'
import { JOURNEY_STOPS } from '@/lib/types/journey'

interface CameraControllerProps {
  onStopReached?: (stopId: string, index: number) => void
}

/**
 * CameraController - Cinematic Camera System
 * Award-winning camera choreography with:
 * - Smooth position transitions (not simple lerp)
 * - Camera rotation and orbit around scenes
 * - Dynamic FOV changes (dolly zoom effect)
 * - Dramatic easing curves (Power3.inOut, Expo.inOut)
 * - Target-based lookAt animation
 *
 * Inspired by The Monolith Project (Awwwards winner)
 */
export function CameraController({ onStopReached }: CameraControllerProps) {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null)
  const targetRef = useRef(new THREE.Vector3(0, 0, -200))
  const currentStopIndex = useRef(0)
  const timelineRef = useRef<gsap.core.Timeline | null>(null)
  const { camera } = useThree()

  // Create cinematic camera sequences for each stop
  const cameraSequences = useMemo(() => {
    return JOURNEY_STOPS.map((stop, index) => {
      const baseZ = stop.position.z / 10 // Scale to scene coordinates
      const nextStop = JOURNEY_STOPS[index + 1]
      const nextZ = nextStop ? nextStop.position.z / 10 : baseZ - 1000

      // Distance between stops for transition timing
      const distance = Math.abs(nextZ - baseZ)
      const duration = Math.max(2, distance / 500) // Minimum 2 seconds per stop

      return {
        stopId: stop.id, // Store only the ID, not the entire object
        index,
        baseZ,
        nextZ,
        duration,
        // Cinematic camera angles for each stop type
        approach: {
          // Dramatic approach angle
          x: index % 2 === 0 ? 50 : -50,
          y: 30 + Math.sin(index) * 20,
          z: baseZ + 300, // Start further back
          rotation: { x: -0.1, y: index % 2 === 0 ? 0.3 : -0.3, z: 0 },
          fov: 75, // Wide for dramatic entrance
        },
        arrival: {
          // Settle into viewing position
          x: Math.sin(index * 0.5) * 20, // Slight offset
          y: 10 + Math.cos(index * 0.3) * 10,
          z: baseZ + 100, // Closer to marker
          rotation: { x: 0, y: 0, z: 0 },
          fov: 50, // Zoom in for focus
        },
        lookAt: {
          x: 0,
          y: 0,
          z: baseZ - 50, // Look slightly ahead
        },
      }
    })
  }, [])

  useEffect(() => {
    if (!cameraRef.current || typeof window === 'undefined') return

    // Get Lenis instance from window
    // @ts-ignore
    const lenis = window.lenis

    if (!lenis) {
      console.warn('Lenis not found on window. Smooth scroll may not work.')
      return
    }

    // Create master GSAP timeline
    const masterTimeline = gsap.timeline({
      paused: true, // Control via Lenis scroll progress
    })

    timelineRef.current = masterTimeline

    // Build timeline for each stop with cinematic sequences
    cameraSequences.forEach((sequence, index) => {
      const { stopId, approach, arrival, lookAt, duration } = sequence

      // Calculate timeline position (normalized 0-1 based on stop position)
      const totalDistance = Math.abs(JOURNEY_STOPS[JOURNEY_STOPS.length - 1].position.z)
      const stopDistance = Math.abs(JOURNEY_STOPS[index].position.z)
      const timelinePosition = stopDistance / totalDistance

      // Store camera refs for timeline (avoid null checks in GSAP)
      if (!cameraRef.current) return

      const cameraPosition = cameraRef.current.position
      const cameraRotation = cameraRef.current.rotation
      const camera = cameraRef.current

      // APPROACH SEQUENCE - Dramatic entrance
      masterTimeline.to(
        cameraPosition,
        {
          x: approach.x,
          y: approach.y,
          z: approach.z,
          duration: duration * 0.5,
          ease: 'power3.in', // Speed up into stop
        },
        timelinePosition - (duration * 0.5) / 10 // Start before stop
      )

      // Camera rotation during approach
      masterTimeline.to(
        cameraRotation,
        {
          x: approach.rotation.x,
          y: approach.rotation.y,
          z: approach.rotation.z,
          duration: duration * 0.5,
          ease: 'power2.inOut',
        },
        '<' // Start with position animation
      )

      // FOV zoom out for drama
      masterTimeline.to(
        camera,
        {
          fov: approach.fov,
          duration: duration * 0.3,
          ease: 'power2.out',
          onUpdate: () => {
            camera.updateProjectionMatrix()
          },
        },
        '<'
      )

      // ARRIVAL SEQUENCE - Settle and focus
      masterTimeline.to(
        cameraPosition,
        {
          x: arrival.x,
          y: arrival.y,
          z: arrival.z,
          duration: duration * 0.5,
          ease: 'expo.out', // Smooth deceleration
        },
        timelinePosition
      )

      // Straighten camera rotation
      masterTimeline.to(
        cameraRotation,
        {
          x: arrival.rotation.x,
          y: arrival.rotation.y,
          z: arrival.rotation.z,
          duration: duration * 0.5,
          ease: 'power3.out',
        },
        '<'
      )

      // FOV zoom in for focus (dolly zoom effect)
      masterTimeline.to(
        camera,
        {
          fov: arrival.fov,
          duration: duration * 0.4,
          ease: 'power2.inOut',
          onUpdate: () => {
            camera.updateProjectionMatrix()
          },
        },
        '<'
      )

      // Update lookAt target
      masterTimeline.to(
        targetRef.current,
        {
          x: lookAt.x,
          y: lookAt.y,
          z: lookAt.z,
          duration: duration * 0.5,
          ease: 'power2.inOut',
        },
        '<'
      )

      // Trigger stop reached callback
      masterTimeline.call(
        () => {
          if (currentStopIndex.current !== index) {
            currentStopIndex.current = index
            onStopReached?.(stopId, index)
          }
        },
        [],
        timelinePosition
      )
    })

    // Sync timeline with Lenis scroll progress
    const scrollHandler = () => {
      if (!lenis || !masterTimeline) return

      // Get scroll progress (0-1)
      const scrollHeight = document.body.scrollHeight - window.innerHeight
      const scrollProgress = lenis.scroll / scrollHeight

      // Update timeline progress
      masterTimeline.progress(scrollProgress)
    }

    // Listen to Lenis scroll events
    lenis.on('scroll', scrollHandler)

    // Initial update
    scrollHandler()

    return () => {
      if (lenis) {
        lenis.off('scroll', scrollHandler)
      }
      if (masterTimeline) {
        masterTimeline.kill()
      }
    }
  }, [cameraSequences, onStopReached])

  // Smooth lookAt animation in render loop
  useFrame(() => {
    if (!cameraRef.current) return

    // Smoothly look at target
    const currentLookAt = new THREE.Vector3()
    cameraRef.current.getWorldDirection(currentLookAt)
    currentLookAt.multiplyScalar(200).add(cameraRef.current.position)

    // Lerp toward target
    currentLookAt.lerp(targetRef.current, 0.05)
    cameraRef.current.lookAt(currentLookAt)

    // Subtle camera breathing effect for life
    const time = Date.now() * 0.0001
    cameraRef.current.position.x += Math.sin(time * 2) * 0.05
    cameraRef.current.position.y += Math.cos(time * 1.5) * 0.03
  })

  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      position={[0, 10, 0]} // Start position
      fov={75}
      near={0.1}
      far={60000}
    />
  )
}
