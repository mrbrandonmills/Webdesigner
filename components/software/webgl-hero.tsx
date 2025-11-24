'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export function WebGLHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sceneRef = useRef<{
    scene?: THREE.Scene
    camera?: THREE.PerspectiveCamera
    renderer?: THREE.WebGLRenderer
    grid?: THREE.Points
    animationId?: number
  }>({})

  useEffect(() => {
    if (!canvasRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    camera.position.z = 5

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    // Create grid of particles
    const particlesCount = 5000
    const positions = new Float32Array(particlesCount * 3)
    const colors = new Float32Array(particlesCount * 3)

    for (let i = 0; i < particlesCount; i++) {
      const i3 = i * 3
      // Create grid pattern with distortion
      const gridSize = 50
      const x = ((i % gridSize) - gridSize / 2) * 0.2
      const y = (Math.floor(i / gridSize) - gridSize / 2) * 0.2
      const z = Math.sin(x * 0.5) * Math.cos(y * 0.5) * 2

      positions[i3] = x
      positions[i3 + 1] = y
      positions[i3 + 2] = z

      // Orange accent color (#FF6B35)
      colors[i3] = 1.0 // R
      colors[i3 + 1] = 0.42 // G
      colors[i3 + 2] = 0.21 // B
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const material = new THREE.PointsMaterial({
      size: 0.02,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    })

    const grid = new THREE.Points(geometry, material)
    scene.add(grid)

    sceneRef.current = { scene, camera, renderer, grid }

    // Animation
    let time = 0
    const animate = () => {
      time += 0.005

      if (grid && grid.geometry.attributes.position) {
        const positions = grid.geometry.attributes.position.array as Float32Array

        for (let i = 0; i < particlesCount; i++) {
          const i3 = i * 3
          const x = positions[i3]
          const y = positions[i3 + 1]

          // Wave distortion effect
          positions[i3 + 2] =
            Math.sin(x * 0.5 + time) * Math.cos(y * 0.5 + time * 0.7) * 2 +
            Math.sin(time * 0.3) * 0.5
        }

        grid.geometry.attributes.position.needsUpdate = true
      }

      // Rotate grid slowly
      if (grid) {
        grid.rotation.x = Math.sin(time * 0.1) * 0.2
        grid.rotation.y = time * 0.05
      }

      renderer.render(scene, camera)
      sceneRef.current.animationId = requestAnimationFrame(animate)
    }

    animate()

    // Handle resize
    const handleResize = () => {
      if (!camera || !renderer) return

      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)

      if (sceneRef.current.animationId) {
        cancelAnimationFrame(sceneRef.current.animationId)
      }

      geometry.dispose()
      material.dispose()
      renderer.dispose()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.4 }}
    />
  )
}
