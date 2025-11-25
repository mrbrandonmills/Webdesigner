/**
 * Journey Camera Keyframes
 *
 * Defines cinematic camera paths for the 3D journey
 * Based on JOURNEY_STOPS positions from lib/types/journey.ts
 */

import { JOURNEY_STOPS } from '@/lib/types/journey'
import { customEases } from '@/utils/gsap-config'

export interface CameraKeyframe {
  /**
   * Stop ID this keyframe is associated with
   */
  stopId: string

  /**
   * Progress value (0-1) when this keyframe is reached
   */
  progress: number

  /**
   * Camera position in 3D space
   */
  position: {
    x: number
    y: number
    z: number
  }

  /**
   * Camera rotation (Euler angles in radians)
   */
  rotation: {
    x: number
    y: number
    z: number
  }

  /**
   * Field of view (degrees)
   */
  fov: number

  /**
   * Look-at target position
   */
  lookAt: {
    x: number
    y: number
    z: number
  }

  /**
   * GSAP easing for this segment
   */
  ease: string

  /**
   * Duration hint (will be overridden by scrub)
   */
  duration: number
}

/**
 * Calculate normalized progress for each stop
 * Based on Z-position in the journey
 */
function calculateStopProgress(stopIndex: number): number {
  const totalDistance = Math.abs(JOURNEY_STOPS[JOURNEY_STOPS.length - 1].position.z)
  const stopDistance = Math.abs(JOURNEY_STOPS[stopIndex].position.z)
  return stopDistance / totalDistance
}

/**
 * Generate cinematic camera keyframes for each journey stop
 * Alternates between left/right approaches for visual interest
 */
export const CAMERA_KEYFRAMES: CameraKeyframe[] = JOURNEY_STOPS.map((stop, index) => {
  const progress = calculateStopProgress(index)
  const zPos = stop.position.z / 10 // Scale down for scene coordinates
  const isEven = index % 2 === 0

  return {
    stopId: stop.id,
    progress,
    // Cinematic camera position - alternating sides
    position: {
      x: isEven ? 50 : -50, // Alternate left/right
      y: 30 + Math.sin(index * 0.5) * 20, // Varying height
      z: zPos + 100, // Offset from marker
    },
    // Slight rotation toward center
    rotation: {
      x: -0.15, // Slight downward tilt
      y: isEven ? 0.2 : -0.2, // Face toward marker
      z: 0,
    },
    // Dynamic FOV for emphasis
    fov: 60,
    // Look at the marker position
    lookAt: {
      x: 0,
      y: 0,
      z: zPos,
    },
    // Smooth cinematic easing
    ease: customEases.cinematic,
    duration: 1,
  }
})

/**
 * Initial camera position (before journey starts)
 */
export const CAMERA_INITIAL: Omit<CameraKeyframe, 'stopId' | 'progress'> = {
  position: { x: 0, y: 50, z: 200 },
  rotation: { x: -0.2, y: 0, z: 0 },
  fov: 75,
  lookAt: { x: 0, y: 0, z: 0 },
  ease: customEases.smoothOut,
  duration: 2,
}

/**
 * Helper function to interpolate between two keyframes
 * For smooth camera movement between stops
 */
export function interpolateKeyframes(
  from: CameraKeyframe,
  to: CameraKeyframe,
  progress: number
): Omit<CameraKeyframe, 'stopId' | 'progress' | 'ease' | 'duration'> {
  const t = Math.max(0, Math.min(1, progress))

  return {
    position: {
      x: from.position.x + (to.position.x - from.position.x) * t,
      y: from.position.y + (to.position.y - from.position.y) * t,
      z: from.position.z + (to.position.z - from.position.z) * t,
    },
    rotation: {
      x: from.rotation.x + (to.rotation.x - from.rotation.x) * t,
      y: from.rotation.y + (to.rotation.y - from.rotation.y) * t,
      z: from.rotation.z + (to.rotation.z - from.rotation.z) * t,
    },
    fov: from.fov + (to.fov - from.fov) * t,
    lookAt: {
      x: from.lookAt.x + (to.lookAt.x - from.lookAt.x) * t,
      y: from.lookAt.y + (to.lookAt.y - from.lookAt.y) * t,
      z: from.lookAt.z + (to.lookAt.z - from.lookAt.z) * t,
    },
  }
}

/**
 * Get keyframe at specific scroll progress
 * Returns interpolated values between keyframes
 */
export function getKeyframeAtProgress(progress: number): CameraKeyframe {
  // Clamp progress
  const p = Math.max(0, Math.min(1, progress))

  // Find surrounding keyframes
  let fromIndex = 0
  let toIndex = 1

  for (let i = 0; i < CAMERA_KEYFRAMES.length - 1; i++) {
    if (p >= CAMERA_KEYFRAMES[i].progress && p <= CAMERA_KEYFRAMES[i + 1].progress) {
      fromIndex = i
      toIndex = i + 1
      break
    }
  }

  const from = CAMERA_KEYFRAMES[fromIndex]
  const to = CAMERA_KEYFRAMES[toIndex]

  // Calculate local progress between keyframes
  const localProgress =
    (p - from.progress) / (to.progress - from.progress || 0.0001)

  const interpolated = interpolateKeyframes(from, to, localProgress)

  return {
    stopId: from.stopId,
    progress: p,
    ease: from.ease,
    duration: from.duration,
    ...interpolated,
  }
}

/**
 * Get the closest stop index for given scroll progress
 */
export function getClosestStopIndex(progress: number): number {
  let closestIndex = 0
  let minDistance = Math.abs(progress - CAMERA_KEYFRAMES[0].progress)

  for (let i = 1; i < CAMERA_KEYFRAMES.length; i++) {
    const distance = Math.abs(progress - CAMERA_KEYFRAMES[i].progress)
    if (distance < minDistance) {
      minDistance = distance
      closestIndex = i
    }
  }

  return closestIndex
}
