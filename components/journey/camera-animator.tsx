/**
 * Camera Animator Component
 *
 * Bridges GSAP ScrollTrigger progress to Three.js camera animation
 * Uses industry-standard pattern: GSAP controls timeline, Three.js renders
 *
 * Phase 2: 3D Integration - Camera animation driven by scroll
 */

'use client'

import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useScrollProgress } from '@/hooks/useScrollProgress'
import { getKeyframeAtProgress } from '@/constants/journey-keyframes'
import * as THREE from 'three'

interface CameraAnimatorProps {
  /**
   * Enable smooth camera transitions (lerp)
   */
  smooth?: boolean

  /**
   * Lerp factor for smooth transitions (0-1)
   * Lower = smoother but slower response
   */
  smoothFactor?: number

  /**
   * Callback when stop is reached
   */
  onStopChange?: (stopId: string) => void
}

/**
 * Camera Animator Component
 *
 * Animates the Three.js camera based on GSAP scroll progress
 * Uses primitive values to avoid circular reference errors
 *
 * @example
 * ```tsx
 * <Canvas>
 *   <CameraAnimator smooth={true} smoothFactor={0.1} />
 *   <Scene />
 * </Canvas>
 * ```
 */
export function CameraAnimator({
  smooth = true,
  smoothFactor = 0.1,
  onStopChange,
}: CameraAnimatorProps) {
  const { camera } = useThree()
  const { progress } = useScrollProgress({
    start: 'top top',
    end: 'bottom bottom',
    scrub: 1,
  })

  // Track previous stop for change detection
  const prevStopIdRef = useRef<string>('')

  // Store props in refs to avoid stale closures in useFrame
  const smoothRef = useRef(smooth)
  const smoothFactorRef = useRef(smoothFactor)

  useEffect(() => {
    smoothRef.current = smooth
    smoothFactorRef.current = smoothFactor
  }, [smooth, smoothFactor])

  // Target camera state (primitives only - no THREE objects)
  const targetRef = useRef({
    position: { x: 0, y: 50, z: 200 },
    fov: 75,
    lookAt: { x: 0, y: 0, z: 0 },
  })

  // Reusable THREE objects to avoid per-frame allocation
  const tempVec3 = useRef(new THREE.Vector3())
  const prevFov = useRef(75)

  // Update target from scroll progress
  useEffect(() => {
    const keyframe = getKeyframeAtProgress(progress)

    // Update target with new keyframe values (primitives only)
    targetRef.current = {
      position: { ...keyframe.position },
      fov: keyframe.fov,
      lookAt: { ...keyframe.lookAt },
    }

    // Detect stop changes
    if (keyframe.stopId !== prevStopIdRef.current) {
      prevStopIdRef.current = keyframe.stopId
      onStopChange?.(keyframe.stopId)
    }
  }, [progress, onStopChange])

  // Apply camera animation every frame
  useFrame(() => {
    const target = targetRef.current
    const isSmooth = smoothRef.current
    const factor = smoothFactorRef.current

    if (isSmooth) {
      // Smooth lerp to target position using reusable Vector3
      tempVec3.current.set(target.position.x, target.position.y, target.position.z)
      camera.position.lerp(tempVec3.current, factor)

      // Lerp FOV (only update projection matrix if changed significantly)
      if (camera instanceof THREE.PerspectiveCamera) {
        camera.fov += (target.fov - camera.fov) * factor

        // Only update projection matrix if FOV changed noticeably
        if (Math.abs(camera.fov - prevFov.current) >= 0.1) {
          camera.updateProjectionMatrix()
          prevFov.current = camera.fov
        }
      }
    } else {
      // Direct assignment (no smoothing)
      camera.position.set(target.position.x, target.position.y, target.position.z)

      if (camera instanceof THREE.PerspectiveCamera) {
        camera.fov = target.fov
        camera.updateProjectionMatrix()
        prevFov.current = target.fov
      }
    }

    // Look at target point (this sets camera rotation automatically)
    // Note: lookAt overrides any manual rotation, so we don't lerp rotation separately
    tempVec3.current.set(target.lookAt.x, target.lookAt.y, target.lookAt.z)
    camera.lookAt(tempVec3.current)
  })

  return null // This is a controller component, renders nothing
}
