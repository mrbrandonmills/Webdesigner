/**
 * Journey Asset Preloader
 * Preloads critical Three.js resources during onboarding
 */

export interface PreloadProgress {
  loaded: number
  total: number
  percentage: number
  currentAsset: string
}

export type PreloadCallback = (progress: PreloadProgress) => void

/**
 * Preload critical journey assets
 */
export async function preloadJourneyAssets(
  onProgress?: PreloadCallback
): Promise<void> {
  const assets = [
    // Critical scripts
    { name: 'Three.js Fiber', module: () => import('@react-three/fiber') },
    { name: 'Three.js Drei', module: () => import('@react-three/drei') },
    { name: 'GSAP ScrollTrigger', module: () => import('gsap/ScrollTrigger') },
    { name: 'Three.js Core', module: () => import('three') }
  ]

  let loaded = 0
  const total = assets.length

  for (const asset of assets) {
    try {
      onProgress?.({
        loaded,
        total,
        percentage: Math.round((loaded / total) * 100),
        currentAsset: asset.name
      })

      await asset.module()
      loaded++
    } catch (error) {
      console.warn(`Failed to preload ${asset.name}:`, error)
      loaded++
    }
  }

  // Final callback
  onProgress?.({
    loaded: total,
    total,
    percentage: 100,
    currentAsset: 'Complete'
  })

  // Mark as preloaded in session
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('journey-preloaded', 'true')
  }
}

/**
 * Check if assets have been preloaded this session
 */
export function isPreloaded(): boolean {
  if (typeof window === 'undefined') return false
  return sessionStorage.getItem('journey-preloaded') === 'true'
}

/**
 * Initialize WebGL context (warms up GPU)
 */
export function warmupWebGL(): void {
  if (typeof window === 'undefined') return

  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl')
    if (gl) {
      gl.clearColor(0, 0, 0, 1)
      gl.clear(gl.COLOR_BUFFER_BIT)
    }
  } catch {
    // Silently fail
  }
}
