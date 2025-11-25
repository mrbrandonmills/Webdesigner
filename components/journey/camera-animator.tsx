/**
 * Camera Animator
 * GSAP-based camera animation using industry-standard patterns
 * Avoids circular references by using proxy objects
 */

'use client'

import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { gsap, ScrollTrigger } from '@/utils/gsap-config'
import * as THREE from 'three'
import { JOURNEY_KEYFRAMES } from '@/constants/journey-keyframes'

export interface CameraAnimatorProps {
  /**
   * Callback when camera reaches a stop
   */
  onStopReached?: (stopId: string, index: number) => void

  /**
   * Enable debug mode
   */
  debug?: boolean
}

/**
 * CRITICAL: Proxy Pattern for GSAP
 *
 * ❌ WRONG: Animate Three.js objects directly (circular refs)
 * const cameraPosition = camera.position // Vector3 with circular refs
 * gsap.to(cameraPosition, { x, y, z })
 *
 * ✅ CORRECT: Animate primitive proxy objects
 * const proxy = { position: { x: 0, y: 10, z: 0 } }
 * gsap.to(proxy.position, { x, y, z })
 * // Then apply proxy to camera in useFrame
 */
export function CameraAnimator({ onStopReached, debug = false }: CameraAnimatorProps) {
  const { camera, scene } = useThree()

  // CRITICAL: Proxy objects for GSAP (avoid Three.js circular refs)
  const cameraProxy = useRef({
    position: { x: 0, y: 15, z: 0 },
    rotation: { x: -0.1, y: 0, z: 0 },
    fov: 75
  })

  const lookAtProxy = useRef({
    x: 0,
    y: 5,
    z: -500
  })

  const currentStopIndex = useRef(0)
  const masterTimeline = useRef<gsap.core.Timeline | null>(null)

  /**
   * Setup GSAP timeline with ScrollTrigger
   * THE KEY PATTERN: scrub: true for smooth scroll syncing
   */
  useEffect(() => {
    // Wait for DOM to be ready
    if (typeof window === 'undefined') return

    // Create master timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.journey-container',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1, // THE KEY: 1-second smooth delay
        pin: '.canvas-container',
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          // Detect which stop we're at based on progress
          const totalStops = JOURNEY_KEYFRAMES.length
          const currentIndex = Math.floor(self.progress * totalStops)
          const clampedIndex = Math.min(currentIndex, totalStops - 1)

          if (clampedIndex !== currentStopIndex.current) {
            currentStopIndex.current = clampedIndex
            const stop = JOURNEY_KEYFRAMES[clampedIndex]
            onStopReached?.(stop.stopId, clampedIndex)

            if (debug) {
              console.log('[CameraAnimator] Reached stop:', stop.stopId, clampedIndex)
            }
          }
        }
      }
    })

    // Add keyframe animations to timeline
    JOURNEY_KEYFRAMES.forEach((keyframe, i) => {
      // Calculate timeline position (normalized 0-1)
      const position = i / (JOURNEY_KEYFRAMES.length - 1)

      // Animate camera position
      tl.to(
        cameraProxy.current.position,
        {
          x: keyframe.camera.position.x,
          y: keyframe.camera.position.y,
          z: keyframe.camera.position.z,
          duration: keyframe.duration,
          ease: keyframe.ease
        },
        position
      )

      // Animate camera rotation
      tl.to(
        cameraProxy.current.rotation,
        {
          x: keyframe.camera.rotation.x,
          y: keyframe.camera.rotation.y,
          z: keyframe.camera.rotation.z,
          duration: keyframe.duration,
          ease: keyframe.ease
        },
        position
      )

      // Animate camera FOV
      tl.to(
        cameraProxy.current,
        {
          fov: keyframe.camera.fov,
          duration: keyframe.duration,
          ease: keyframe.ease
        },
        position
      )

      // Animate lookAt target
      tl.to(
        lookAtProxy.current,
        {
          x: keyframe.lookAt.x,
          y: keyframe.lookAt.y,
          z: keyframe.lookAt.z,
          duration: keyframe.duration,
          ease: keyframe.ease
        },
        position
      )
    })

    masterTimeline.current = tl

    // Cleanup
    return () => {
      tl.kill()
      masterTimeline.current = null
    }
  }, [onStopReached, debug])

  /**
   * Apply proxy values to camera every frame
   * This is where the magic happens - proxy → Three.js camera
   */
  useFrame(() => {
    // Apply position
    camera.position.set(
      cameraProxy.current.position.x,
      cameraProxy.current.position.y,
      cameraProxy.current.position.z
    )

    // Apply rotation
    camera.rotation.set(
      cameraProxy.current.rotation.x,
      cameraProxy.current.rotation.y,
      cameraProxy.current.rotation.z
    )

    // Apply FOV (if PerspectiveCamera)
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = cameraProxy.current.fov
      camera.updateProjectionMatrix()
    }

    // Apply lookAt
    const lookAtTarget = new THREE.Vector3(
      lookAtProxy.current.x,
      lookAtProxy.current.y,
      lookAtProxy.current.z
    )
    camera.lookAt(lookAtTarget)
  })

  // Debug helpers
  useEffect(() => {
    if (!debug) return

    const helper = new THREE.CameraHelper(camera as THREE.PerspectiveCamera)
    scene.add(helper)

    return () => {
      scene.remove(helper)
    }
  }, [debug, camera, scene])

  return null
}
