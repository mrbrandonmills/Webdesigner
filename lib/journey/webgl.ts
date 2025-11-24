/**
 * WebGL Detection and Capability Testing
 * Detects WebGL support and provides fallback options
 */

export interface WebGLCapabilities {
  supported: boolean
  version: number
  maxTextureSize: number
  maxVertexUniforms: number
}

/**
 * Detect if WebGL is supported
 */
export function detectWebGL(): boolean {
  if (typeof window === 'undefined') return false

  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    return !!gl
  } catch (e) {
    return false
  }
}

/**
 * Get detailed WebGL capabilities
 */
export function getWebGLCapabilities(): WebGLCapabilities {
  const defaultCapabilities: WebGLCapabilities = {
    supported: false,
    version: 0,
    maxTextureSize: 0,
    maxVertexUniforms: 0
  }

  if (typeof window === 'undefined') return defaultCapabilities

  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')

    if (!gl) return defaultCapabilities

    const glContext = gl as WebGLRenderingContext

    return {
      supported: true,
      version: 1,
      maxTextureSize: glContext.getParameter(glContext.MAX_TEXTURE_SIZE),
      maxVertexUniforms: glContext.getParameter(glContext.MAX_VERTEX_UNIFORM_VECTORS)
    }
  } catch {
    return defaultCapabilities
  }
}

/**
 * Check if device can handle advanced 3D effects
 */
export function canHandleAdvancedEffects(): boolean {
  const capabilities = getWebGLCapabilities()

  if (!capabilities.supported) return false

  // Check for minimum requirements
  return (
    capabilities.maxTextureSize >= 2048 &&
    capabilities.maxVertexUniforms >= 128
  )
}
