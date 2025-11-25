/**
 * Journey Camera Keyframes
 * Cinematic camera paths for all 8 journey stops
 * Positions based on JOURNEY_STOPS z-coordinates
 */

import { JOURNEY_STOPS } from '@/lib/types/journey'

export interface CameraKeyframe {
  /** Stop ID this keyframe corresponds to */
  stopId: string

  /** Index in journey sequence (0-7) */
  index: number

  /** Camera position */
  camera: {
    position: { x: number; y: number; z: number }
    rotation: { x: number; y: number; z: number }
    fov: number
  }

  /** Point camera should look at */
  lookAt: { x: number; y: number; z: number }

  /** Duration of transition to this keyframe (seconds) */
  duration: number

  /** Easing function for transition */
  ease: string
}

/**
 * Camera keyframes for journey stops
 * Each stop has cinematic camera positioning
 */
export const JOURNEY_KEYFRAMES: CameraKeyframe[] = JOURNEY_STOPS.map((stop, index) => {
  // Base camera height - elevated view
  const cameraHeight = 15

  // Camera looks ahead down the journey path
  const lookAheadDistance = 500

  // Slight camera offset for dynamic feel
  const xOffset = index % 2 === 0 ? 5 : -5

  return {
    stopId: stop.id,
    index,
    camera: {
      position: {
        x: xOffset,
        y: cameraHeight,
        z: stop.position.z + 300 // Camera positioned before the stop
      },
      rotation: {
        x: -0.1, // Slight downward tilt
        y: 0,
        z: 0
      },
      fov: 75
    },
    lookAt: {
      x: 0,
      y: 5, // Look at middle height
      z: stop.position.z - lookAheadDistance
    },
    duration: 2.5, // Smooth 2.5-second transitions
    ease: 'power3.inOut'
  }
})

/**
 * Get keyframe by stop ID
 */
export function getKeyframeByStopId(stopId: string): CameraKeyframe | undefined {
  return JOURNEY_KEYFRAMES.find(kf => kf.stopId === stopId)
}

/**
 * Get keyframe by index
 */
export function getKeyframeByIndex(index: number): CameraKeyframe | undefined {
  return JOURNEY_KEYFRAMES[index]
}

/**
 * Calculate interpolated camera state between two keyframes
 */
export function interpolateKeyframes(
  from: CameraKeyframe,
  to: CameraKeyframe,
  progress: number // 0-1
) {
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t

  return {
    position: {
      x: lerp(from.camera.position.x, to.camera.position.x, progress),
      y: lerp(from.camera.position.y, to.camera.position.y, progress),
      z: lerp(from.camera.position.z, to.camera.position.z, progress)
    },
    rotation: {
      x: lerp(from.camera.rotation.x, to.camera.rotation.x, progress),
      y: lerp(from.camera.rotation.y, to.camera.rotation.y, progress),
      z: lerp(from.camera.rotation.z, to.camera.rotation.z, progress)
    },
    fov: lerp(from.camera.fov, to.camera.fov, progress),
    lookAt: {
      x: lerp(from.lookAt.x, to.lookAt.x, progress),
      y: lerp(from.lookAt.y, to.lookAt.y, progress),
      z: lerp(from.lookAt.z, to.lookAt.z, progress)
    }
  }
}
