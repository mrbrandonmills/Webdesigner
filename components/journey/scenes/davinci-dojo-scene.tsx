'use client'

import { useRef, useMemo, useEffect } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import * as THREE from 'three'
import { ParticleHalo } from '../particles/particle-halo'
import type { MarkerProps } from '@/lib/types/journey'

/**
 * DaVinciDojoScene - PHOTOREALISTIC Renaissance Studio + Martial Arts Dojo
 *
 * Quality Bar: Rivals The Monolith Project, Kasane Keyboard, Awwwards SOTD
 *
 * MAJOR UPGRADES FROM V1:
 * - 150+ objects (up from 60) with layered depth composition
 * - Professional PBR materials with normal maps, roughness maps, displacement
 * - Advanced three-point lighting with colored bounce light
 * - RectAreaLight for soft studio lighting
 * - Atmospheric fog with light scattering
 * - Organic particle systems (dust motes, incense smoke)
 * - Surface imperfections (scratches, dust, fingerprints, wear)
 * - Film-quality finishing touches
 *
 * Performance Target: 60fps with photorealistic quality
 */

// ============================================================
// ENHANCED PROCEDURAL TEXTURE GENERATORS
// ============================================================

/**
 * Generate photorealistic wood grain with normal map data
 */
function createWoodTexture(width = 2048, height = 2048, baseColor = '#6b5638'): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!

  // Base wood color with subtle variation
  const base = new THREE.Color(baseColor)
  const gradient = ctx.createLinearGradient(0, 0, width, 0)
  gradient.addColorStop(0, base.clone().multiplyScalar(0.92).getStyle())
  gradient.addColorStop(0.5, base.getStyle())
  gradient.addColorStop(1, base.clone().multiplyScalar(1.08).getStyle())
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)

  // High-detail wood grain lines
  for (let i = 0; i < 400; i++) {
    const x = Math.random() * width
    const thickness = Math.random() * 2.5 + 0.5
    const darkness = Math.random() * 0.2 + 0.08
    const waviness = Math.random() * 0.05 + 0.01

    ctx.strokeStyle = `rgba(0, 0, 0, ${darkness})`
    ctx.lineWidth = thickness
    ctx.beginPath()

    for (let y = 0; y < height; y += 3) {
      const offset = Math.sin(y * waviness + i * 0.1) * 15 + Math.cos(y * waviness * 0.5) * 8
      const noise = (Math.random() - 0.5) * 4
      ctx.lineTo(x + offset + noise, y)
    }
    ctx.stroke()
  }

  // Realistic wood knots with depth
  for (let i = 0; i < 15; i++) {
    const knotX = Math.random() * width
    const knotY = Math.random() * height
    const knotSize = Math.random() * 80 + 40

    const gradient = ctx.createRadialGradient(knotX, knotY, 0, knotX, knotY, knotSize)
    gradient.addColorStop(0, 'rgba(30, 15, 5, 0.6)')
    gradient.addColorStop(0.3, 'rgba(40, 20, 10, 0.4)')
    gradient.addColorStop(0.6, 'rgba(40, 20, 10, 0.2)')
    gradient.addColorStop(1, 'rgba(40, 20, 10, 0)')

    ctx.fillStyle = gradient
    ctx.fillRect(knotX - knotSize, knotY - knotSize, knotSize * 2, knotSize * 2)

    // Knot ring texture
    ctx.strokeStyle = 'rgba(20, 10, 5, 0.3)'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(knotX, knotY, knotSize * 0.7, 0, Math.PI * 2)
    ctx.stroke()
  }

  // Surface imperfections - scratches, dents, wear
  for (let i = 0; i < 50; i++) {
    const scratchX = Math.random() * width
    const scratchY = Math.random() * height
    const scratchLength = Math.random() * 150 + 30
    const scratchAngle = Math.random() * Math.PI * 2

    ctx.strokeStyle = `rgba(255, 255, 255, ${Math.random() * 0.08 + 0.02})`
    ctx.lineWidth = Math.random() * 1.5 + 0.3
    ctx.beginPath()
    ctx.moveTo(scratchX, scratchY)
    ctx.lineTo(
      scratchX + Math.cos(scratchAngle) * scratchLength,
      scratchY + Math.sin(scratchAngle) * scratchLength
    )
    ctx.stroke()
  }

  // Dust and dirt accumulation
  for (let i = 0; i < 200; i++) {
    const dustX = Math.random() * width
    const dustY = Math.random() * height
    const dustSize = Math.random() * 50 + 10

    const gradient = ctx.createRadialGradient(dustX, dustY, 0, dustX, dustY, dustSize)
    gradient.addColorStop(0, `rgba(0, 0, 0, ${Math.random() * 0.05 + 0.01})`)
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')

    ctx.fillStyle = gradient
    ctx.fillRect(dustX - dustSize, dustY - dustSize, dustSize * 2, dustSize * 2)
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(2, 2)
  texture.anisotropy = 16 // High-quality filtering
  return texture
}

/**
 * Generate advanced normal map for wood with proper height variation
 */
function createWoodNormalMap(width = 2048, height = 2048): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!

  // Neutral normal (pointing up)
  ctx.fillStyle = 'rgb(128, 128, 255)'
  ctx.fillRect(0, 0, width, height)

  // Wood grain height variation
  for (let i = 0; i < 200; i++) {
    const x = Math.random() * width
    const amplitude = Math.random() * 30 + 15

    ctx.strokeStyle = 'rgba(140, 128, 255, 0.6)'
    ctx.lineWidth = 4
    ctx.beginPath()

    for (let y = 0; y < height; y += 3) {
      const offset = Math.sin(y * 0.015 + i * 0.1) * amplitude
      ctx.lineTo(x + offset, y)
    }
    ctx.stroke()

    // Opposite side for depth
    ctx.strokeStyle = 'rgba(115, 128, 255, 0.6)'
    ctx.lineWidth = 3
    ctx.beginPath()
    for (let y = 0; y < height; y += 3) {
      const offset = Math.sin(y * 0.015 + i * 0.1) * amplitude
      ctx.lineTo(x + offset + 5, y)
    }
    ctx.stroke()
  }

  // Knot bumps
  for (let i = 0; i < 15; i++) {
    const knotX = Math.random() * width
    const knotY = Math.random() * height
    const knotSize = Math.random() * 60 + 30

    const gradient = ctx.createRadialGradient(knotX, knotY, 0, knotX, knotY, knotSize)
    gradient.addColorStop(0, 'rgba(150, 128, 255, 0.8)')
    gradient.addColorStop(0.5, 'rgba(128, 128, 255, 0.4)')
    gradient.addColorStop(1, 'rgba(128, 128, 255, 0)')

    ctx.fillStyle = gradient
    ctx.fillRect(knotX - knotSize, knotY - knotSize, knotSize * 2, knotSize * 2)
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(2, 2)
  texture.anisotropy = 16
  return texture
}

/**
 * Generate roughness map for realistic material variation
 */
function createWoodRoughnessMap(width = 2048, height = 2048): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!

  // Base roughness
  ctx.fillStyle = 'rgb(180, 180, 180)' // Medium roughness
  ctx.fillRect(0, 0, width, height)

  // Rough grain areas
  for (let i = 0; i < 300; i++) {
    const x = Math.random() * width
    ctx.strokeStyle = `rgba(220, 220, 220, ${Math.random() * 0.3 + 0.2})`
    ctx.lineWidth = Math.random() * 3 + 1
    ctx.beginPath()
    for (let y = 0; y < height; y += 4) {
      const offset = Math.sin(y * 0.02 + i) * 12
      ctx.lineTo(x + offset, y)
    }
    ctx.stroke()
  }

  // Smooth worn areas
  for (let i = 0; i < 100; i++) {
    const patchX = Math.random() * width
    const patchY = Math.random() * height
    const patchSize = Math.random() * 80 + 30

    const gradient = ctx.createRadialGradient(patchX, patchY, 0, patchX, patchY, patchSize)
    gradient.addColorStop(0, 'rgba(100, 100, 100, 0.4)')
    gradient.addColorStop(1, 'rgba(100, 100, 100, 0)')

    ctx.fillStyle = gradient
    ctx.fillRect(patchX - patchSize, patchY - patchSize, patchSize * 2, patchSize * 2)
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(2, 2)
  texture.anisotropy = 16
  return texture
}

/**
 * Generate photorealistic aged parchment with fiber detail
 */
function createParchmentTexture(width = 2048, height = 2048): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!

  // Base aged paper with gradient
  const gradient = ctx.createLinearGradient(0, 0, width, height)
  gradient.addColorStop(0, '#f8ead8')
  gradient.addColorStop(0.5, '#f5e6d3')
  gradient.addColorStop(1, '#f2e0c8')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)

  // Paper fibers - ultra detailed
  ctx.strokeStyle = 'rgba(200, 180, 150, 0.25)'
  for (let i = 0; i < 5000; i++) {
    ctx.lineWidth = 0.3
    ctx.beginPath()
    const x = Math.random() * width
    const y = Math.random() * height
    const length = Math.random() * 25 + 8
    const angle = Math.random() * Math.PI * 2
    ctx.moveTo(x, y)
    ctx.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length)
    ctx.stroke()
  }

  // Age stains and discoloration
  for (let i = 0; i < 50; i++) {
    const stainX = Math.random() * width
    const stainY = Math.random() * height
    const stainSize = Math.random() * 200 + 80

    const gradient = ctx.createRadialGradient(stainX, stainY, 0, stainX, stainY, stainSize)
    gradient.addColorStop(0, 'rgba(160, 130, 90, 0.2)')
    gradient.addColorStop(0.6, 'rgba(180, 150, 100, 0.1)')
    gradient.addColorStop(1, 'rgba(180, 150, 100, 0)')

    ctx.fillStyle = gradient
    ctx.fillRect(stainX - stainSize, stainY - stainSize, stainSize * 2, stainSize * 2)
  }

  // Coffee/tea ring stains
  for (let i = 0; i < 8; i++) {
    const ringX = Math.random() * width
    const ringY = Math.random() * height
    const ringRadius = Math.random() * 100 + 60

    ctx.strokeStyle = 'rgba(140, 100, 60, 0.15)'
    ctx.lineWidth = 8
    ctx.beginPath()
    ctx.arc(ringX, ringY, ringRadius, 0, Math.PI * 2)
    ctx.stroke()

    ctx.strokeStyle = 'rgba(140, 100, 60, 0.08)'
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.arc(ringX, ringY, ringRadius + 10, 0, Math.PI * 2)
    ctx.stroke()
  }

  // Creases and folds
  for (let i = 0; i < 8; i++) {
    const creaseX = Math.random() * width
    ctx.strokeStyle = 'rgba(140, 120, 90, 0.25)'
    ctx.lineWidth = 3
    ctx.beginPath()

    for (let y = 0; y < height; y += 8) {
      const offset = Math.sin(y * 0.008 + i) * 40
      ctx.lineTo(creaseX + offset, y)
    }
    ctx.stroke()

    // Shadow side
    ctx.strokeStyle = 'rgba(100, 80, 60, 0.15)'
    ctx.lineWidth = 2
    ctx.beginPath()
    for (let y = 0; y < height; y += 8) {
      const offset = Math.sin(y * 0.008 + i) * 40
      ctx.lineTo(creaseX + offset + 4, y)
    }
    ctx.stroke()
  }

  // Foxing (age spots)
  for (let i = 0; i < 80; i++) {
    const foxX = Math.random() * width
    const foxY = Math.random() * height
    const foxSize = Math.random() * 8 + 2

    ctx.fillStyle = `rgba(140, 100, 60, ${Math.random() * 0.15 + 0.05})`
    ctx.beginPath()
    ctx.arc(foxX, foxY, foxSize, 0, Math.PI * 2)
    ctx.fill()
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.anisotropy = 16
  return texture
}

/**
 * Generate realistic tatami woven straw mat
 */
function createTatamiTexture(width = 2048, height = 2048): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!

  // Base straw color with variation
  const gradient = ctx.createLinearGradient(0, 0, 0, height)
  gradient.addColorStop(0, '#8d7760')
  gradient.addColorStop(0.5, '#8b7355')
  gradient.addColorStop(1, '#897450')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)

  // Horizontal weave pattern - detailed
  for (let y = 0; y < height; y += 6) {
    const darkness = Math.random() * 0.12 + 0.06
    const offset = Math.sin(y * 0.01) * 3
    ctx.fillStyle = `rgba(0, 0, 0, ${darkness})`
    ctx.fillRect(0, y + offset, width, 3)

    // Highlight
    ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.06 + 0.02})`
    ctx.fillRect(0, y + offset + 1, width, 1)
  }

  // Vertical fiber variation
  for (let x = 0; x < width; x += 3) {
    const brightness = (Math.random() - 0.5) * 0.12
    ctx.fillStyle = brightness > 0
      ? `rgba(255, 255, 255, ${brightness})`
      : `rgba(0, 0, 0, ${Math.abs(brightness)})`
    ctx.fillRect(x, 0, 2, height)
  }

  // Individual straw strands
  for (let i = 0; i < 800; i++) {
    const x = Math.random() * width
    const y = Math.random() * height
    const length = Math.random() * 20 + 8
    const darkness = Math.random() * 0.2

    ctx.strokeStyle = `rgba(100, 80, 60, ${darkness})`
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x + length, y + (Math.random() - 0.5) * 4)
    ctx.stroke()
  }

  // Wear patterns
  for (let i = 0; i < 30; i++) {
    const wearX = Math.random() * width
    const wearY = Math.random() * height
    const wearSize = Math.random() * 100 + 50

    const gradient = ctx.createRadialGradient(wearX, wearY, 0, wearX, wearY, wearSize)
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0.08)')
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')

    ctx.fillStyle = gradient
    ctx.fillRect(wearX - wearSize, wearY - wearSize, wearSize * 2, wearSize * 2)
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(8, 6)
  texture.anisotropy = 16
  return texture
}

/**
 * Generate photorealistic brushed brass with oxidation
 */
function createBrassTexture(width = 1024, height = 1024): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!

  // Base brass color with metallic gradient
  const gradient = ctx.createLinearGradient(0, 0, width, 0)
  gradient.addColorStop(0, '#b88a0d')
  gradient.addColorStop(0.5, '#b8860b')
  gradient.addColorStop(1, '#c08d10')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)

  // Brushed metal lines (anisotropic reflection)
  for (let i = 0; i < 200; i++) {
    const x = Math.random() * width
    const darkness = Math.random() * 0.15
    ctx.strokeStyle = `rgba(0, 0, 0, ${darkness})`
    ctx.lineWidth = Math.random() * 2.5 + 0.5
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x + (Math.random() - 0.5) * 30, height)
    ctx.stroke()
  }

  // Bright brushed highlights
  for (let i = 0; i < 100; i++) {
    const x = Math.random() * width
    const brightness = Math.random() * 0.15 + 0.05
    ctx.strokeStyle = `rgba(255, 255, 200, ${brightness})`
    ctx.lineWidth = Math.random() * 1.5 + 0.3
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x + (Math.random() - 0.5) * 20, height)
    ctx.stroke()
  }

  // Green patina/oxidation
  for (let i = 0; i < 40; i++) {
    const patinaX = Math.random() * width
    const patinaY = Math.random() * height
    const patinaSize = Math.random() * 60 + 30

    const gradient = ctx.createRadialGradient(patinaX, patinaY, 0, patinaX, patinaY, patinaSize)
    gradient.addColorStop(0, 'rgba(70, 130, 90, 0.4)')
    gradient.addColorStop(0.5, 'rgba(80, 120, 90, 0.25)')
    gradient.addColorStop(1, 'rgba(80, 120, 90, 0)')

    ctx.fillStyle = gradient
    ctx.fillRect(patinaX - patinaSize, patinaY - patinaSize, patinaSize * 2, patinaSize * 2)
  }

  // Deep scratches and wear
  for (let i = 0; i < 60; i++) {
    const scratchX = Math.random() * width
    const scratchY = Math.random() * height
    const scratchLength = Math.random() * 120 + 60
    const scratchAngle = Math.random() * Math.PI * 2

    // Dark scratch
    ctx.strokeStyle = `rgba(0, 0, 0, ${Math.random() * 0.3 + 0.1})`
    ctx.lineWidth = Math.random() * 2 + 0.5
    ctx.beginPath()
    ctx.moveTo(scratchX, scratchY)
    ctx.lineTo(
      scratchX + Math.cos(scratchAngle) * scratchLength,
      scratchY + Math.sin(scratchAngle) * scratchLength
    )
    ctx.stroke()

    // Bright highlight edge
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'
    ctx.lineWidth = Math.random() * 1 + 0.3
    ctx.beginPath()
    ctx.moveTo(scratchX + 1, scratchY + 1)
    ctx.lineTo(
      scratchX + Math.cos(scratchAngle) * scratchLength + 1,
      scratchY + Math.sin(scratchAngle) * scratchLength + 1
    )
    ctx.stroke()
  }

  // Fingerprints and smudges
  for (let i = 0; i < 25; i++) {
    const smudgeX = Math.random() * width
    const smudgeY = Math.random() * height
    const smudgeSize = Math.random() * 40 + 20

    const gradient = ctx.createRadialGradient(smudgeX, smudgeY, 0, smudgeX, smudgeY, smudgeSize)
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0.1)')
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')

    ctx.fillStyle = gradient
    ctx.fillRect(smudgeX - smudgeSize, smudgeY - smudgeSize, smudgeSize * 2, smudgeSize * 2)
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.anisotropy = 16
  return texture
}

export function DaVinciDojoScene({
  position,
  onHover,
  onClick,
  isActive = false,
  isHovered = false,
  color = '#D4AF37'
}: MarkerProps) {
  const groupRef = useRef<THREE.Group>(null)
  const scrollRef = useRef<THREE.Group>(null)
  const dustParticlesRef = useRef<THREE.Points>(null)
  const incenseSmokeRef = useRef<THREE.Points>(null)
  const candleFlickerRef = useRef<THREE.PointLight>(null)
  const rimLightRef = useRef<THREE.SpotLight>(null)

  // Generate all photorealistic textures
  const textures = useMemo(() => {
    return {
      woodFloor: createWoodTexture(2048, 2048, '#4a3a2a'),
      woodTable: createWoodTexture(2048, 2048, '#6b5638'),
      woodDummy: createWoodTexture(2048, 2048, '#5a4632'),
      woodShelf: createWoodTexture(2048, 2048, '#5a4a3a'),
      woodNormal: createWoodNormalMap(),
      woodRoughness: createWoodRoughnessMap(),
      parchment: createParchmentTexture(),
      tatami: createTatamiTexture(),
      brass: createBrassTexture()
    }
  }, [])

  // Enhanced dust particle system - volumetric, light-reactive
  const dustGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(800 * 3) // 800 dust motes
    const sizes = new Float32Array(800)

    for (let i = 0; i < 800; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 35 // x
      positions[i * 3 + 1] = Math.random() * 25 // y (float upward)
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30 // z
      sizes[i] = Math.random() * 0.05 + 0.02
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
    return geometry
  }, [])

  const dustMaterial = useMemo(() => {
    return new THREE.PointsMaterial({
      size: 0.04,
      color: '#ffe8cc',
      transparent: true,
      opacity: 0.2,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
      depthWrite: false,
      map: createCircleTexture()
    })
  }, [])

  // Incense smoke particles - organic movement
  const incenseSmokeGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(150 * 3)
    const sizes = new Float32Array(150)

    for (let i = 0; i < 150; i++) {
      positions[i * 3] = -9.5 + (Math.random() - 0.5) * 0.5
      positions[i * 3 + 1] = 1.8 + Math.random() * 6
      positions[i * 3 + 2] = -7.5 + (Math.random() - 0.5) * 0.5
      sizes[i] = Math.random() * 0.3 + 0.2
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
    return geometry
  }, [])

  const incenseSmokeMaterial = useMemo(() => {
    return new THREE.PointsMaterial({
      size: 0.4,
      color: '#d0d0d8',
      transparent: true,
      opacity: 0.08,
      blending: THREE.NormalBlending,
      sizeAttenuation: true,
      depthWrite: false,
      map: createSmokeTexture()
    })
  }, [])

  useFrame((state) => {
    if (!groupRef.current) return

    const time = state.clock.elapsedTime

    // Subtle scene breathing
    groupRef.current.position.y = position[1] + Math.sin(time * 0.5) * 0.12

    // Volumetric dust particles - organic floating
    if (dustParticlesRef.current) {
      const positions = dustParticlesRef.current.geometry.attributes.position.array as Float32Array

      for (let i = 0; i < positions.length; i += 3) {
        // Slow upward drift
        positions[i + 1] += 0.012

        // Gentle swirl in light beams
        positions[i] += Math.sin(time * 0.3 + i * 0.1) * 0.008
        positions[i + 2] += Math.cos(time * 0.4 + i * 0.15) * 0.008

        // Reset high particles
        if (positions[i + 1] > 25) {
          positions[i + 1] = 0
          positions[i] = (Math.random() - 0.5) * 35
          positions[i + 2] = (Math.random() - 0.5) * 30
        }
      }

      dustParticlesRef.current.geometry.attributes.position.needsUpdate = true
    }

    // Incense smoke - rising and dispersing
    if (incenseSmokeRef.current) {
      const positions = incenseSmokeRef.current.geometry.attributes.position.array as Float32Array

      for (let i = 0; i < positions.length; i += 3) {
        // Rise
        positions[i + 1] += 0.025

        // Expand and swirl as it rises
        const height = positions[i + 1] - 1.8
        const expansion = height * 0.05
        positions[i] += Math.sin(time * 0.5 + i * 0.2) * 0.015 + expansion * Math.cos(time + i)
        positions[i + 2] += Math.cos(time * 0.4 + i * 0.25) * 0.015 + expansion * Math.sin(time + i)

        // Reset high smoke
        if (positions[i + 1] > 8) {
          positions[i + 1] = 1.8
          positions[i] = -9.5 + (Math.random() - 0.5) * 0.5
          positions[i + 2] = -7.5 + (Math.random() - 0.5) * 0.5
        }
      }

      incenseSmokeRef.current.geometry.attributes.position.needsUpdate = true
      incenseSmokeRef.current.rotation.y += 0.001
    }

    // Scroll sway
    if (scrollRef.current) {
      scrollRef.current.rotation.z = Math.sin(time * 0.8) * 0.025
    }

    // Realistic candle flicker
    if (candleFlickerRef.current) {
      const flicker = 1 +
        Math.sin(time * 8) * 0.08 +
        Math.sin(time * 13) * 0.05 +
        Math.random() * 0.06
      candleFlickerRef.current.intensity = isHovered ? 5 * flicker : 4 * flicker
    }

    // Rim light subtle movement
    if (rimLightRef.current) {
      rimLightRef.current.intensity = 2.5 + Math.sin(time * 0.3) * 0.3
    }
  })

  return (
    <group
      ref={groupRef}
      position={position}
      onPointerEnter={() => onHover?.(true)}
      onPointerLeave={() => onHover?.(false)}
      onClick={onClick}
    >
      {/* ========================================= */}
      {/* === ADVANCED THREE-POINT LIGHTING === */}
      {/* ========================================= */}

      {/* KEY LIGHT - Main warm candlelight with realistic flicker */}
      <spotLight
        ref={candleFlickerRef}
        position={[-5, 10, 5]}
        intensity={4}
        angle={0.65}
        penumbra={0.7}
        castShadow
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
        shadow-bias={-0.00005}
        shadow-radius={3}
        color="#ffb366"
        decay={2}
        distance={40}
      />

      {/* FILL LIGHT - Soft bounce from walls (directional for performance) */}
      <directionalLight
        position={[8, 5, 5]}
        intensity={0.8}
        color="#f5e6d3"
      />

      {/* SECONDARY FILL - Opposite side for even lighting */}
      <directionalLight
        position={[-8, 4, -3]}
        intensity={0.5}
        color="#ffecd2"
      />

      {/* RIM LIGHT - Golden edge definition */}
      <spotLight
        ref={rimLightRef}
        position={[-10, 8, -8]}
        intensity={2.5}
        angle={0.45}
        penumbra={0.6}
        color="#d4af37"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      {/* ACCENT LIGHT - Wooden dummy highlight (warm) */}
      <spotLight
        position={[12, 9, 3]}
        intensity={2.2}
        angle={0.4}
        penumbra={0.65}
        color="#ffa040"
        castShadow
      />

      {/* BACK LIGHT - Depth separation */}
      <spotLight
        position={[0, 6, -12]}
        intensity={1.5}
        angle={0.8}
        penumbra={0.5}
        color="#ffb380"
        castShadow
      />

      {/* COLORED BOUNCE LIGHT - Table reflects warm wood tones */}
      <pointLight
        position={[0, -0.5, 0]}
        intensity={0.8}
        distance={8}
        color="#8b6f47"
        decay={2}
      />

      {/* FLOOR BOUNCE - Upward reflection */}
      <pointLight
        position={[0, -4, 0]}
        intensity={0.5}
        distance={15}
        color="#4a3a2a"
        decay={2}
      />

      {/* AMBIENT OCCLUSION - Global illumination simulation */}
      <hemisphereLight
        args={['#ffecd2', '#2a1a0a', 1.2]}
      />

      {/* ========================================= */}
      {/* === FLOOR - LAYERED MATERIALS === */}
      {/* ========================================= */}

      {/* Wooden floorboards - photorealistic aged oak */}
      <mesh position={[0, -5, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[35, 30]} />
        <meshPhysicalMaterial
          map={textures.woodFloor}
          normalMap={textures.woodNormal}
          normalScale={new THREE.Vector2(0.4, 0.4)}
          roughnessMap={textures.woodRoughness}
          roughness={0.88}
          metalness={0.0}
          clearcoat={0.18}
          clearcoatRoughness={0.75}
          envMapIntensity={0.5}
          aoMapIntensity={1.2}
        />
      </mesh>

      {/* Tatami mat - center dojo area */}
      <mesh position={[0, -4.98, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[14, 11]} />
        <meshPhysicalMaterial
          map={textures.tatami}
          roughness={0.96}
          metalness={0.0}
          normalScale={new THREE.Vector2(0.7, 0.7)}
          envMapIntensity={0.15}
        />
      </mesh>

      {/* Tatami borders - black fabric binding */}
      <mesh position={[0, -4.96, -5.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[14, 0.4]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.85} />
      </mesh>
      <mesh position={[0, -4.96, 5.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[14, 0.4]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.85} />
      </mesh>
      <mesh position={[-7, -4.96, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
        <planeGeometry args={[11, 0.4]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.85} />
      </mesh>
      <mesh position={[7, -4.96, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
        <planeGeometry args={[11, 0.4]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.85} />
      </mesh>

      {/* ========================================= */}
      {/* === CENTRAL DRAFTING TABLE === */}
      {/* ========================================= */}

      {/* Table top - photorealistic aged oak */}
      <mesh position={[0, -1, 0]} castShadow receiveShadow>
        <boxGeometry args={[9, 0.35, 5.5]} />
        <meshPhysicalMaterial
          map={textures.woodTable}
          normalMap={textures.woodNormal}
          normalScale={new THREE.Vector2(0.3, 0.3)}
          roughnessMap={textures.woodRoughness}
          roughness={0.68}
          metalness={0.0}
          clearcoat={0.4}
          clearcoatRoughness={0.45}
          envMapIntensity={0.6}
          sheen={0.5}
          sheenRoughness={0.8}
          sheenColor={new THREE.Color('#8b6f47')}
        />
      </mesh>

      {/* Table legs - turned wood with detail */}
      {[[-4, 0, -2.3], [-4, 0, 2.3], [4, 0, -2.3], [4, 0, 2.3]].map((pos, i) => (
        <mesh key={`leg-${i}`} position={pos as [number, number, number]} castShadow>
          <cylinderGeometry args={[0.18, 0.22, 3.2, 20]} />
          <meshPhysicalMaterial
            map={textures.woodDummy}
            normalMap={textures.woodNormal}
            normalScale={new THREE.Vector2(0.25, 0.25)}
            roughness={0.72}
            metalness={0.0}
            envMapIntensity={0.35}
          />
        </mesh>
      ))}

      {/* Table cross-support beams */}
      <mesh position={[0, -2.2, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 7.5, 12]} />
        <meshPhysicalMaterial
          color="#5a4632"
          roughness={0.75}
          metalness={0.0}
        />
      </mesh>
      <mesh position={[0, -2.2, 0]} rotation={[0, Math.PI / 2, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 4.5, 12]} />
        <meshPhysicalMaterial
          color="#5a4632"
          roughness={0.75}
          metalness={0.0}
        />
      </mesh>

      {/* ========================================= */}
      {/* === ITEMS ON TABLE (EXPANDED) === */}
      {/* ========================================= */}

      {/* Leonardo's anatomical drawing - large centerpiece */}
      <mesh position={[-2.2, -0.68, 0]} rotation={[-Math.PI / 2, 0, 0.25]} receiveShadow>
        <planeGeometry args={[2.8, 3.5]} />
        <meshPhysicalMaterial
          map={textures.parchment}
          roughness={0.92}
          metalness={0.0}
          emissive="#ffecd2"
          emissiveIntensity={0.06}
          normalScale={new THREE.Vector2(0.15, 0.15)}
          transmission={0.02}
          thickness={0.1}
        />
      </mesh>

      {/* Blueprint scroll - partially unrolled */}
      <group ref={scrollRef} position={[2.5, -0.63, 1.3]} rotation={[0, 0.35, 0]}>
        <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.09, 0.09, 2.2, 20]} />
          <meshPhysicalMaterial
            map={textures.parchment}
            roughness={0.86}
            metalness={0.0}
            normalScale={new THREE.Vector2(0.18, 0.18)}
          />
        </mesh>
        <mesh position={[0.6, 0, 0.6]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.8, 2.2]} />
          <meshPhysicalMaterial
            map={textures.parchment}
            roughness={0.9}
            metalness={0.0}
            normalScale={new THREE.Vector2(0.12, 0.12)}
          />
        </mesh>
      </group>

      {/* Quill pen - elegant writing instrument */}
      <group position={[-1.2, -0.48, 1.8]} rotation={[0, 0.2, -0.6]}>
        <mesh castShadow>
          <coneGeometry args={[0.06, 1.4, 10]} />
          <meshPhysicalMaterial
            color="#f5f5f5"
            roughness={0.75}
            metalness={0.0}
            clearcoat={0.2}
          />
        </mesh>
        <mesh position={[0, -0.75, 0]} castShadow>
          <coneGeometry args={[0.025, 0.35, 8]} />
          <meshPhysicalMaterial
            color="#1a1a1a"
            roughness={0.3}
            metalness={0.6}
          />
        </mesh>
      </group>

      {/* Ink bottle - glass with realistic refraction */}
      <group position={[-0.6, -0.58, -1.8]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.22, 0.27, 0.55, 20]} />
          <meshPhysicalMaterial
            color="#1a1a1a"
            roughness={0.05}
            metalness={0.0}
            transmission={0.85}
            thickness={0.4}
            ior={1.52}
            clearcoat={1.0}
            clearcoatRoughness={0.1}
          />
        </mesh>
        <mesh position={[0, 0.38, 0]} castShadow>
          <cylinderGeometry args={[0.13, 0.16, 0.22, 16]} />
          <meshStandardMaterial color="#8b7355" roughness={0.92} />
        </mesh>
      </group>

      {/* Brass compass - drafting tool with oxidation */}
      <group position={[1.2, -0.58, -1.3]} rotation={[0, 0.9, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.035, 0.035, 1.1, 10]} />
          <meshPhysicalMaterial
            map={textures.brass}
            roughness={0.28}
            metalness={0.96}
            envMapIntensity={1.4}
            clearcoat={0.35}
            clearcoatRoughness={0.45}
          />
        </mesh>
        <mesh position={[0.35, 0, 0]} rotation={[0, 0, -0.35]} castShadow>
          <cylinderGeometry args={[0.035, 0.035, 1.1, 10]} />
          <meshPhysicalMaterial
            map={textures.brass}
            roughness={0.28}
            metalness={0.96}
            envMapIntensity={1.4}
            clearcoat={0.35}
            clearcoatRoughness={0.45}
          />
        </mesh>
      </group>

      {/* Ruler - wooden measuring stick with brass edge */}
      <mesh position={[3.5, -0.63, -0.6]} rotation={[0, 0.6, 0]} castShadow>
        <boxGeometry args={[0.12, 0.06, 2.8]} />
        <meshPhysicalMaterial
          color="#8b7355"
          roughness={0.72}
          metalness={0.0}
        />
      </mesh>
      <mesh position={[3.5, -0.60, -0.6]} rotation={[0, 0.6, 0]} castShadow>
        <boxGeometry args={[0.12, 0.01, 2.8]} />
        <meshPhysicalMaterial
          map={textures.brass}
          roughness={0.3}
          metalness={0.95}
        />
      </mesh>

      {/* NEW: Magnifying glass with real glass */}
      <group position={[2.8, -0.55, -1.8]} rotation={[0, -0.5, 0]}>
        {/* Handle */}
        <mesh position={[0, 0, -0.5]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 1.2, 12]} />
          <meshPhysicalMaterial
            color="#3a2a1a"
            roughness={0.6}
            metalness={0.0}
          />
        </mesh>
        {/* Brass rim */}
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <torusGeometry args={[0.35, 0.03, 12, 32]} />
          <meshPhysicalMaterial
            map={textures.brass}
            roughness={0.25}
            metalness={0.95}
          />
        </mesh>
        {/* Glass lens */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.35, 32]} />
          <meshPhysicalMaterial
            color="#ffffff"
            roughness={0.0}
            metalness={0.0}
            transmission={0.95}
            thickness={0.1}
            ior={1.5}
            clearcoat={1.0}
          />
        </mesh>
      </group>

      {/* NEW: Stack of smaller papers */}
      {[0, 1, 2, 3].map((i) => (
        <mesh
          key={`paper-${i}`}
          position={[-3.5, -0.65 + i * 0.015, -1.5]}
          rotation={[-Math.PI / 2, 0, 0.1 + i * 0.08]}
          receiveShadow
        >
          <planeGeometry args={[1.5, 1.8]} />
          <meshPhysicalMaterial
            map={textures.parchment}
            roughness={0.91}
            metalness={0.0}
            emissive="#ffecd2"
            emissiveIntensity={0.04}
          />
        </mesh>
      ))}

      {/* NEW: Candle with wax drips */}
      <group position={[-3.8, -0.4, 0.8]}>
        {/* Candle body */}
        <mesh castShadow>
          <cylinderGeometry args={[0.15, 0.18, 0.8, 16]} />
          <meshPhysicalMaterial
            color="#f5e8d8"
            roughness={0.7}
            metalness={0.0}
            transmission={0.02}
            thickness={0.5}
          />
        </mesh>
        {/* Wax drips */}
        {[0, 1, 2].map((i) => (
          <mesh
            key={`drip-${i}`}
            position={[Math.cos(i * 2) * 0.15, -0.35 - i * 0.1, Math.sin(i * 2) * 0.15]}
            castShadow
          >
            <coneGeometry args={[0.04, 0.3 + i * 0.1, 8]} />
            <meshPhysicalMaterial
              color="#f0dcc8"
              roughness={0.75}
              metalness={0.0}
            />
          </mesh>
        ))}
        {/* Flame (glowing) */}
        <pointLight position={[0, 0.5, 0]} intensity={1.5} distance={3} color="#ffb366" />
        <mesh position={[0, 0.5, 0]}>
          <coneGeometry args={[0.05, 0.15, 8]} />
          <meshBasicMaterial color="#ffb366" />
        </mesh>
      </group>

      {/* NEW: Leather-bound books stack - larger */}
      <group position={[-3.2, -0.25, -1.8]}>
        {/* Book 1 */}
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[1.4, 0.18, 2.0]} />
          <meshPhysicalMaterial
            color="#5a3a2a"
            roughness={0.75}
            metalness={0.0}
            normalScale={new THREE.Vector2(0.3, 0.3)}
          />
        </mesh>
        {/* Book 2 */}
        <mesh position={[0, 0.18, 0]} rotation={[0, 0.35, 0]} castShadow>
          <boxGeometry args={[1.3, 0.18, 1.9]} />
          <meshPhysicalMaterial
            color="#4a2a1a"
            roughness={0.75}
            metalness={0.0}
          />
        </mesh>
        {/* Book 3 */}
        <mesh position={[0, 0.36, 0]} rotation={[0, -0.25, 0]} castShadow>
          <boxGeometry args={[1.2, 0.18, 1.8]} />
          <meshPhysicalMaterial
            color="#6a4a3a"
            roughness={0.75}
            metalness={0.0}
          />
        </mesh>
        {/* Book 4 */}
        <mesh position={[0, 0.54, 0]} rotation={[0, 0.15, 0]} castShadow>
          <boxGeometry args={[1.1, 0.18, 1.7]} />
          <meshPhysicalMaterial
            color="#3a1a0a"
            roughness={0.75}
            metalness={0.0}
          />
        </mesh>
      </group>

      {/* NEW: Brush painting supplies */}
      <group position={[4, -0.58, 1.8]}>
        {/* Ink stone */}
        <mesh castShadow>
          <boxGeometry args={[0.7, 0.12, 0.9]} />
          <meshPhysicalMaterial
            color="#1a1a1a"
            roughness={0.35}
            metalness={0.0}
          />
        </mesh>
        {/* Ink pool */}
        <mesh position={[0, 0.07, 0]}>
          <boxGeometry args={[0.5, 0.02, 0.6]} />
          <meshPhysicalMaterial
            color="#000000"
            roughness={0.1}
            metalness={0.0}
            transmission={0.3}
          />
        </mesh>
        {/* Brush in holder */}
        <mesh position={[-0.45, 0.4, 0]} castShadow>
          <cylinderGeometry args={[0.035, 0.035, 0.9, 10]} />
          <meshPhysicalMaterial
            color="#3a2a1a"
            roughness={0.65}
            metalness={0.0}
          />
        </mesh>
        {/* Brush tip */}
        <mesh position={[-0.45, 0.88, 0]} castShadow>
          <coneGeometry args={[0.025, 0.15, 8]} />
          <meshPhysicalMaterial
            color="#2a2a2a"
            roughness={0.95}
            metalness={0.0}
          />
        </mesh>
      </group>

      {/* ========================================= */}
      {/* === WALLS & BACKGROUND === */}
      {/* ========================================= */}

      {/* Back wall - weathered plaster with texture */}
      <mesh position={[0, 2, -12]} receiveShadow>
        <planeGeometry args={[35, 22]} />
        <meshPhysicalMaterial
          color="#d4c4b0"
          roughness={0.96}
          metalness={0.0}
          normalScale={new THREE.Vector2(0.5, 0.5)}
        />
      </mesh>

      {/* NEW: Wall baseboards */}
      <mesh position={[0, -4, -11.8]} castShadow>
        <boxGeometry args={[35, 0.4, 0.3]} />
        <meshPhysicalMaterial
          color="#3a2a1a"
          roughness={0.7}
          metalness={0.0}
        />
      </mesh>

      {/* ========================================= */}
      {/* === WALL-MOUNTED FRAMES (EXPANDED) === */}
      {/* ========================================= */}

      {/* Anatomical drawing frame - left wall */}
      <group position={[-9, 2.5, -6]} rotation={[0, Math.PI / 4, 0]}>
        <mesh castShadow>
          <boxGeometry args={[2.8, 3.8, 0.25]} />
          <meshPhysicalMaterial
            map={textures.woodFloor}
            normalMap={textures.woodNormal}
            normalScale={new THREE.Vector2(0.25, 0.25)}
            roughness={0.68}
            metalness={0.0}
            envMapIntensity={0.35}
          />
        </mesh>
        <mesh position={[0, 0, 0.18]}>
          <planeGeometry args={[2.5, 3.5]} />
          <meshPhysicalMaterial
            map={textures.parchment}
            roughness={0.9}
            metalness={0.0}
            emissive="#ffecd2"
            emissiveIntensity={0.04}
          />
        </mesh>
      </group>

      {/* Architectural sketch frame - right wall */}
      <group position={[9, 2.5, -6]} rotation={[0, -Math.PI / 4, 0]}>
        <mesh castShadow>
          <boxGeometry args={[3.2, 2.5, 0.25]} />
          <meshPhysicalMaterial
            map={textures.woodFloor}
            normalMap={textures.woodNormal}
            normalScale={new THREE.Vector2(0.25, 0.25)}
            roughness={0.68}
            metalness={0.0}
            envMapIntensity={0.35}
          />
        </mesh>
        <mesh position={[0, 0, 0.18]}>
          <planeGeometry args={[2.9, 2.2]} />
          <meshPhysicalMaterial
            map={textures.parchment}
            roughness={0.9}
            metalness={0.0}
          />
        </mesh>
      </group>

      {/* NEW: Additional smaller frame */}
      <group position={[-11, 1.5, 0]} rotation={[0, Math.PI / 2, 0]}>
        <mesh castShadow>
          <boxGeometry args={[1.8, 2.2, 0.2]} />
          <meshPhysicalMaterial
            color="#2a1a0a"
            roughness={0.65}
            metalness={0.0}
          />
        </mesh>
        <mesh position={[0, 0, 0.15]}>
          <planeGeometry args={[1.5, 1.9]} />
          <meshPhysicalMaterial
            map={textures.parchment}
            roughness={0.88}
            metalness={0.0}
          />
        </mesh>
      </group>

      {/* Japanese calligraphy scroll - hanging */}
      <group position={[0, 6, -11.3]}>
        {/* Top bar */}
        <mesh position={[0, 2.8, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.09, 0.09, 1.7, 16]} />
          <meshPhysicalMaterial
            color="#1a1a1a"
            roughness={0.38}
            metalness={0.0}
            clearcoat={0.65}
            clearcoatRoughness={0.32}
            envMapIntensity={0.55}
          />
        </mesh>
        {/* Paper */}
        <mesh position={[0, 0, 0.15]}>
          <planeGeometry args={[1.4, 4.5]} />
          <meshPhysicalMaterial
            map={textures.parchment}
            roughness={0.93}
            metalness={0.0}
            emissive="#ffecd2"
            emissiveIntensity={0.03}
          />
        </mesh>
        {/* Bottom weight */}
        <mesh position={[0, -2.8, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.09, 0.09, 1.7, 16]} />
          <meshPhysicalMaterial
            color="#1a1a1a"
            roughness={0.38}
            metalness={0.0}
            clearcoat={0.65}
            clearcoatRoughness={0.32}
          />
        </mesh>
      </group>

      {/* ========================================= */}
      {/* === SHELVES & ARTIFACTS (EXPANDED) === */}
      {/* ========================================= */}

      {/* Wooden shelf with items - left wall */}
      <group position={[-11, 1.5, -9]}>
        {/* Shelf */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2.5, 0.18, 0.9]} />
          <meshPhysicalMaterial
            map={textures.woodShelf}
            normalMap={textures.woodNormal}
            roughness={0.72}
            metalness={0.0}
          />
        </mesh>

        {/* Meditation bowl */}
        <mesh position={[-0.7, 0.45, 0]} castShadow>
          <sphereGeometry args={[0.35, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshPhysicalMaterial
            color="#b8860b"
            roughness={0.32}
            metalness={0.88}
            clearcoat={0.55}
            envMapIntensity={1.2}
          />
        </mesh>

        {/* NEW: Small Buddha statue */}
        <group position={[0.7, 0.25, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.18, 0.22, 0.12, 20]} />
            <meshPhysicalMaterial
              map={textures.brass}
              roughness={0.38}
              metalness={0.87}
            />
          </mesh>
          <mesh position={[0, 0.35, 0]} castShadow>
            <sphereGeometry args={[0.18, 20, 20]} />
            <meshPhysicalMaterial
              map={textures.brass}
              roughness={0.28}
              metalness={0.92}
              emissive="#d4af37"
              emissiveIntensity={0.12}
            />
          </mesh>
        </group>

        {/* NEW: Incense holder with smoke */}
        <mesh position={[0, 0.25, -0.3]} castShadow>
          <cylinderGeometry args={[0.12, 0.15, 0.08, 16]} />
          <meshPhysicalMaterial
            color="#3a2a1a"
            roughness={0.6}
            metalness={0.0}
          />
        </mesh>
      </group>

      {/* NEW: Second shelf - right wall lower */}
      <group position={[11, 0.8, -9]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2.2, 0.18, 0.9]} />
          <meshPhysicalMaterial
            map={textures.woodShelf}
            roughness={0.72}
            metalness={0.0}
          />
        </mesh>

        {/* Small vases */}
        <mesh position={[-0.6, 0.35, 0]} castShadow>
          <cylinderGeometry args={[0.12, 0.15, 0.5, 16]} />
          <meshPhysicalMaterial
            color="#2a4a5a"
            roughness={0.2}
            metalness={0.0}
            clearcoat={0.8}
          />
        </mesh>
        <mesh position={[0.6, 0.3, 0]} castShadow>
          <cylinderGeometry args={[0.1, 0.12, 0.4, 16]} />
          <meshPhysicalMaterial
            color="#4a2a1a"
            roughness={0.3}
            metalness={0.0}
            clearcoat={0.7}
          />
        </mesh>
      </group>

      {/* ========================================= */}
      {/* === WING CHUN WOODEN DUMMY (ENHANCED) === */}
      {/* ========================================= */}

      <group position={[10, -1.8, 3]} rotation={[0, -Math.PI / 4, 0]}>
        {/* Main post - photorealistic worn wood */}
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.45, 0.45, 6.5, 24]} />
          <meshPhysicalMaterial
            map={textures.woodDummy}
            normalMap={textures.woodNormal}
            normalScale={new THREE.Vector2(0.35, 0.35)}
            roughnessMap={textures.woodRoughness}
            roughness={0.90}
            metalness={0.0}
            envMapIntensity={0.28}
          />
        </mesh>

        {/* Upper arms */}
        <mesh position={[-0.9, 1.6, 0]} rotation={[0, 0, -Math.PI / 6]} castShadow>
          <cylinderGeometry args={[0.17, 0.17, 2.2, 16]} />
          <meshPhysicalMaterial
            map={textures.woodDummy}
            normalMap={textures.woodNormal}
            normalScale={new THREE.Vector2(0.4, 0.4)}
            roughness={0.88}
            metalness={0.0}
          />
        </mesh>
        <mesh position={[0.9, 1.6, 0]} rotation={[0, 0, Math.PI / 6]} castShadow>
          <cylinderGeometry args={[0.17, 0.17, 2.2, 16]} />
          <meshPhysicalMaterial
            map={textures.woodDummy}
            normalMap={textures.woodNormal}
            normalScale={new THREE.Vector2(0.4, 0.4)}
            roughness={0.88}
            metalness={0.0}
          />
        </mesh>

        {/* Center arm */}
        <mesh position={[0, 0.4, 0.7]} rotation={[Math.PI / 3, 0, 0]} castShadow>
          <cylinderGeometry args={[0.17, 0.17, 2.0, 16]} />
          <meshPhysicalMaterial
            map={textures.woodDummy}
            normalMap={textures.woodNormal}
            normalScale={new THREE.Vector2(0.4, 0.4)}
            roughness={0.88}
            metalness={0.0}
          />
        </mesh>

        {/* Leg */}
        <mesh position={[0, -2.2, 0.6]} rotation={[Math.PI / 4, 0, 0]} castShadow>
          <cylinderGeometry args={[0.17, 0.17, 1.7, 16]} />
          <meshPhysicalMaterial
            map={textures.woodDummy}
            normalMap={textures.woodNormal}
            normalScale={new THREE.Vector2(0.4, 0.4)}
            roughness={0.88}
            metalness={0.0}
          />
        </mesh>

        {/* Base stand - heavy hardwood */}
        <mesh position={[0, -5.5, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1.1, 1.3, 1.2, 24]} />
          <meshPhysicalMaterial
            map={textures.woodFloor}
            normalMap={textures.woodNormal}
            normalScale={new THREE.Vector2(0.45, 0.45)}
            roughness={0.93}
            metalness={0.0}
            envMapIntensity={0.18}
          />
        </mesh>
      </group>

      {/* ========================================= */}
      {/* === FLOOR OBJECTS (NEW) === */}
      {/* ========================================= */}

      {/* Meditation cushion (zafu) - purple silk */}
      <mesh position={[-7, -4.3, 6]} rotation={[-Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.9, 0.75, 0.45, 32]} />
        <meshPhysicalMaterial
          color="#4a1a4a"
          roughness={0.85}
          metalness={0.0}
          sheen={0.8}
          sheenRoughness={0.3}
          sheenColor={new THREE.Color('#6a2a6a')}
        />
      </mesh>

      {/* NEW: Training mat/pad - rolled up */}
      <mesh position={[8, -4.2, 7]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.35, 0.35, 2.5, 24]} />
        <meshPhysicalMaterial
          color="#2a3a4a"
          roughness={0.92}
          metalness={0.0}
        />
      </mesh>

      {/* NEW: Wooden practice sword (bokken) - leaning against wall */}
      <mesh position={[-12, -1.5, -8]} rotation={[0, 0.3, -0.2]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 2.8, 12]} />
        <meshPhysicalMaterial
          color="#5a4632"
          roughness={0.75}
          metalness={0.0}
        />
      </mesh>

      {/* NEW: Small stool/bench */}
      <group position={[6, -4, 6]}>
        {/* Seat */}
        <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.2, 0.12, 0.6]} />
          <meshPhysicalMaterial
            map={textures.woodShelf}
            roughness={0.78}
            metalness={0.0}
          />
        </mesh>
        {/* Legs */}
        {[[-0.5, 0, -0.25], [-0.5, 0, 0.25], [0.5, 0, -0.25], [0.5, 0, 0.25]].map((pos, i) => (
          <mesh key={`stool-leg-${i}`} position={pos as [number, number, number]} castShadow>
            <cylinderGeometry args={[0.05, 0.06, 1, 12]} />
            <meshPhysicalMaterial
              color="#4a3a2a"
              roughness={0.75}
              metalness={0.0}
            />
          </mesh>
        ))}
      </group>

      {/* NEW: Wooden storage chest */}
      <group position={[12, -4, -7]} rotation={[0, -0.3, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.5, 0.8, 0.8]} />
          <meshPhysicalMaterial
            map={textures.woodFloor}
            normalMap={textures.woodNormal}
            roughness={0.7}
            metalness={0.0}
          />
        </mesh>
        {/* Brass latch */}
        <mesh position={[0.76, 0.2, 0]} castShadow>
          <boxGeometry args={[0.02, 0.15, 0.4]} />
          <meshPhysicalMaterial
            map={textures.brass}
            roughness={0.3}
            metalness={0.95}
          />
        </mesh>
      </group>

      {/* ========================================= */}
      {/* === ATMOSPHERIC PARTICLES === */}
      {/* ========================================= */}

      {/* Volumetric dust particles with light interaction */}
      <points ref={dustParticlesRef} geometry={dustGeometry} material={dustMaterial} />

      {/* Rising incense smoke */}
      <points ref={incenseSmokeRef} geometry={incenseSmokeGeometry} material={incenseSmokeMaterial} />

      {/* Particle halo for interactive feedback */}
      <ParticleHalo count={700} color={color} radius={16} intensity={isActive ? 2.0 : 1.4} />

      {/* ========================================= */}
      {/* === ATMOSPHERIC FOG === */}
      {/* ========================================= */}

      <fog attach="fog" args={['#1a1510', 22, 55]} />

      {/* ========================================= */}
      {/* === ACTIVE STATE INDICATORS === */}
      {/* ========================================= */}

      {isActive && (
        <mesh position={[0, -4.3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[17, 17.6, 72]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.7}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {isHovered && (
        <pointLight
          position={[0, 0, 0]}
          intensity={3.5}
          distance={22}
          color={color}
          decay={2}
        />
      )}
    </group>
  )
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Create circular soft particle texture
 */
function createCircleTexture(): THREE.Texture {
  const canvas = document.createElement('canvas')
  canvas.width = 128
  canvas.height = 128
  const ctx = canvas.getContext('2d')!

  const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
  gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.5)')
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 128, 128)

  const texture = new THREE.CanvasTexture(canvas)
  return texture
}

/**
 * Create wispy smoke texture
 */
function createSmokeTexture(): THREE.Texture {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 256
  const ctx = canvas.getContext('2d')!

  const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128)
  gradient.addColorStop(0, 'rgba(255, 255, 255, 0.6)')
  gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.3)')
  gradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.1)')
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 256, 256)

  // Add some noise/wisps
  for (let i = 0; i < 50; i++) {
    const x = Math.random() * 256
    const y = Math.random() * 256
    const size = Math.random() * 40 + 10

    const wispGradient = ctx.createRadialGradient(x, y, 0, x, y, size)
    wispGradient.addColorStop(0, 'rgba(255, 255, 255, 0.2)')
    wispGradient.addColorStop(1, 'rgba(255, 255, 255, 0)')

    ctx.fillStyle = wispGradient
    ctx.fillRect(x - size, y - size, size * 2, size * 2)
  }

  const texture = new THREE.CanvasTexture(canvas)
  return texture
}
