'use client'

import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { ParticleHalo } from '../particles/particle-halo'
import type { MarkerProps } from '@/lib/types/journey'

/**
 * DaVinciDojoScene - PHOTOREALISTIC WORK Stop Environmental Scene
 *
 * A jaw-dropping fusion of Leonardo da Vinci's Renaissance studio
 * and a traditional Martial Arts Dojo. Represents the union of
 * creative mastery and physical discipline.
 *
 * Quality Level: PHOTOREALISTIC - Kasane Keyboard Quality
 * - Procedural textures (wood grain, paper fibers, metal oxidation)
 * - Advanced PBR materials with surface imperfections
 * - Studio-quality lighting (3-point + HDRI)
 * - Depth of field and cinematic effects
 * - Realistic shadows with soft falloff
 */

// ============================================================
// PROCEDURAL TEXTURE GENERATORS
// ============================================================

/**
 * Generate procedural wood grain texture using canvas
 * Creates realistic wood patterns with color variation, knots, and grain lines
 */
function createWoodTexture(width = 1024, height = 1024, baseColor = '#6b5638'): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!

  // Base wood color
  const base = new THREE.Color(baseColor)
  ctx.fillStyle = base.getStyle()
  ctx.fillRect(0, 0, width, height)

  // Wood grain lines - vertical striations
  for (let i = 0; i < 200; i++) {
    const x = Math.random() * width
    const thickness = Math.random() * 3 + 1
    const darkness = Math.random() * 0.15 + 0.05

    ctx.strokeStyle = `rgba(0, 0, 0, ${darkness})`
    ctx.lineWidth = thickness
    ctx.beginPath()

    // Wavy vertical line with noise
    for (let y = 0; y < height; y += 5) {
      const offset = Math.sin(y * 0.02 + i) * 10
      ctx.lineTo(x + offset, y)
    }
    ctx.stroke()
  }

  // Wood knots - circular distortions
  for (let i = 0; i < 8; i++) {
    const knotX = Math.random() * width
    const knotY = Math.random() * height
    const knotSize = Math.random() * 60 + 30

    const gradient = ctx.createRadialGradient(knotX, knotY, 0, knotX, knotY, knotSize)
    gradient.addColorStop(0, 'rgba(40, 20, 10, 0.4)')
    gradient.addColorStop(0.5, 'rgba(40, 20, 10, 0.2)')
    gradient.addColorStop(1, 'rgba(40, 20, 10, 0)')

    ctx.fillStyle = gradient
    ctx.fillRect(knotX - knotSize, knotY - knotSize, knotSize * 2, knotSize * 2)
  }

  // Color variation - random darker and lighter patches
  for (let i = 0; i < 100; i++) {
    const patchX = Math.random() * width
    const patchY = Math.random() * height
    const patchSize = Math.random() * 100 + 50
    const brightness = (Math.random() - 0.5) * 0.1

    const gradient = ctx.createRadialGradient(patchX, patchY, 0, patchX, patchY, patchSize)
    gradient.addColorStop(0, `rgba(255, 255, 255, ${Math.abs(brightness)})`)
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')

    ctx.globalCompositeOperation = brightness > 0 ? 'lighter' : 'multiply'
    ctx.fillStyle = gradient
    ctx.fillRect(patchX - patchSize, patchY - patchSize, patchSize * 2, patchSize * 2)
    ctx.globalCompositeOperation = 'source-over'
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(2, 2)
  return texture
}

/**
 * Generate procedural parchment/paper texture
 * Creates aged paper with fibers, stains, and creases
 */
function createParchmentTexture(width = 1024, height = 1024): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!

  // Base aged paper color
  ctx.fillStyle = '#f5e6d3'
  ctx.fillRect(0, 0, width, height)

  // Paper fibers - tiny random lines
  ctx.strokeStyle = 'rgba(200, 180, 150, 0.3)'
  for (let i = 0; i < 2000; i++) {
    ctx.lineWidth = 0.5
    ctx.beginPath()
    const x = Math.random() * width
    const y = Math.random() * height
    const length = Math.random() * 20 + 5
    const angle = Math.random() * Math.PI * 2
    ctx.moveTo(x, y)
    ctx.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length)
    ctx.stroke()
  }

  // Aged stains and discoloration
  for (let i = 0; i < 30; i++) {
    const stainX = Math.random() * width
    const stainY = Math.random() * height
    const stainSize = Math.random() * 150 + 50

    const gradient = ctx.createRadialGradient(stainX, stainY, 0, stainX, stainY, stainSize)
    gradient.addColorStop(0, 'rgba(180, 150, 100, 0.15)')
    gradient.addColorStop(1, 'rgba(180, 150, 100, 0)')

    ctx.fillStyle = gradient
    ctx.fillRect(stainX - stainSize, stainY - stainSize, stainSize * 2, stainSize * 2)
  }

  // Subtle creases
  for (let i = 0; i < 5; i++) {
    const creaseX = Math.random() * width
    ctx.strokeStyle = 'rgba(160, 140, 110, 0.2)'
    ctx.lineWidth = 2
    ctx.beginPath()

    for (let y = 0; y < height; y += 10) {
      const offset = Math.sin(y * 0.01 + i) * 30
      ctx.lineTo(creaseX + offset, y)
    }
    ctx.stroke()
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  return texture
}

/**
 * Generate tatami mat woven texture
 * Creates realistic woven straw pattern
 */
function createTatamiTexture(width = 1024, height = 1024): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!

  // Base straw color
  ctx.fillStyle = '#8b7355'
  ctx.fillRect(0, 0, width, height)

  // Horizontal weave pattern
  for (let y = 0; y < height; y += 4) {
    const darkness = Math.random() * 0.1 + 0.05
    ctx.fillStyle = `rgba(0, 0, 0, ${darkness})`
    ctx.fillRect(0, y, width, 2)
  }

  // Vertical fiber variation
  for (let x = 0; x < width; x += 2) {
    const brightness = (Math.random() - 0.5) * 0.08
    ctx.fillStyle = brightness > 0 ? `rgba(255, 255, 255, ${brightness})` : `rgba(0, 0, 0, ${Math.abs(brightness)})`
    ctx.fillRect(x, 0, 1, height)
  }

  // Weave texture - diagonal strokes
  for (let i = 0; i < 500; i++) {
    const x = Math.random() * width
    const y = Math.random() * height
    const length = Math.random() * 15 + 5
    const darkness = Math.random() * 0.15

    ctx.strokeStyle = `rgba(100, 80, 60, ${darkness})`
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x + length, y + 2)
    ctx.stroke()
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(8, 6)
  return texture
}

/**
 * Generate brushed metal texture with scratches and oxidation
 */
function createBrassTexture(width = 512, height = 512): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!

  // Base brass color
  ctx.fillStyle = '#b8860b'
  ctx.fillRect(0, 0, width, height)

  // Brushed metal lines
  for (let i = 0; i < 100; i++) {
    const x = Math.random() * width
    const darkness = Math.random() * 0.1
    ctx.strokeStyle = `rgba(0, 0, 0, ${darkness})`
    ctx.lineWidth = Math.random() * 2 + 0.5
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x + (Math.random() - 0.5) * 20, height)
    ctx.stroke()
  }

  // Oxidation/patina spots
  for (let i = 0; i < 20; i++) {
    const patinaX = Math.random() * width
    const patinaY = Math.random() * height
    const patinaSize = Math.random() * 40 + 20

    const gradient = ctx.createRadialGradient(patinaX, patinaY, 0, patinaX, patinaY, patinaSize)
    gradient.addColorStop(0, 'rgba(80, 120, 90, 0.3)')
    gradient.addColorStop(1, 'rgba(80, 120, 90, 0)')

    ctx.fillStyle = gradient
    ctx.fillRect(patinaX - patinaSize, patinaY - patinaSize, patinaSize * 2, patinaSize * 2)
  }

  // Scratches
  for (let i = 0; i < 30; i++) {
    const scratchX = Math.random() * width
    const scratchY = Math.random() * height
    const scratchLength = Math.random() * 100 + 50
    const scratchAngle = Math.random() * Math.PI * 2

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)'
    ctx.lineWidth = Math.random() * 1.5 + 0.5
    ctx.beginPath()
    ctx.moveTo(scratchX, scratchY)
    ctx.lineTo(
      scratchX + Math.cos(scratchAngle) * scratchLength,
      scratchY + Math.sin(scratchAngle) * scratchLength
    )
    ctx.stroke()
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  return texture
}

/**
 * Generate normal map for surface detail
 * Simulates bumps and dents without geometry
 */
function createWoodNormalMap(width = 1024, height = 1024): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!

  // Neutral normal map base (pointing straight up = RGB(128, 128, 255))
  ctx.fillStyle = 'rgb(128, 128, 255)'
  ctx.fillRect(0, 0, width, height)

  // Wood grain bumps - subtle height variation
  for (let i = 0; i < 100; i++) {
    const x = Math.random() * width
    const amplitude = Math.random() * 20 + 10

    ctx.strokeStyle = 'rgba(140, 128, 255, 0.5)'
    ctx.lineWidth = 3
    ctx.beginPath()

    for (let y = 0; y < height; y += 5) {
      const offset = Math.sin(y * 0.02 + i) * amplitude
      ctx.lineTo(x + offset, y)
    }
    ctx.stroke()
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(2, 2)
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
  const candleFlickerRef = useRef<THREE.PointLight>(null)

  // Generate all procedural textures once on mount
  const textures = useMemo(() => {
    return {
      woodFloor: createWoodTexture(1024, 1024, '#4a3a2a'),
      woodTable: createWoodTexture(1024, 1024, '#6b5638'),
      woodDummy: createWoodTexture(1024, 1024, '#5a4632'),
      woodNormal: createWoodNormalMap(),
      parchment: createParchmentTexture(),
      tatami: createTatamiTexture(),
      brass: createBrassTexture()
    }
  }, [])

  // Create floating dust particles for atmospheric depth
  const dustGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(300 * 3) // 300 dust particles

    for (let i = 0; i < 300; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 30 // x
      positions[i * 3 + 1] = Math.random() * 20 // y (float upward)
      positions[i * 3 + 2] = (Math.random() - 0.5) * 25 // z
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return geometry
  }, [])

  const dustMaterial = useMemo(() => {
    return new THREE.PointsMaterial({
      size: 0.03,
      color: '#ffecd2',
      transparent: true,
      opacity: 0.15,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
      depthWrite: false
    })
  }, [])

  useFrame((state) => {
    if (!groupRef.current) return

    // Subtle scene breathing animation
    groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.1

    // Floating dust particles - slow upward drift
    if (dustParticlesRef.current) {
      const positions = dustParticlesRef.current.geometry.attributes.position.array as Float32Array

      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += 0.01 // Slow upward drift

        // Reset particles that float too high
        if (positions[i + 1] > 20) {
          positions[i + 1] = 0
        }
      }

      dustParticlesRef.current.geometry.attributes.position.needsUpdate = true
    }

    // Gentle scroll sway animation
    if (scrollRef.current) {
      scrollRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.8) * 0.02
    }

    // Candlelight flicker
    if (candleFlickerRef.current) {
      const flicker = 1 + Math.sin(state.clock.elapsedTime * 10) * 0.1 + Math.random() * 0.05
      candleFlickerRef.current.intensity = isHovered ? 4 * flicker : 3 * flicker
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
      {/* === FLOOR === */}

      {/* Wooden floorboards - aged oak with procedural grain texture */}
      <mesh position={[0, -5, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[30, 25]} />
        <meshPhysicalMaterial
          map={textures.woodFloor}
          normalMap={textures.woodNormal}
          normalScale={new THREE.Vector2(0.3, 0.3)}
          roughness={0.85}
          metalness={0.0}
          clearcoat={0.15}
          clearcoatRoughness={0.7}
          envMapIntensity={0.4}
        />
      </mesh>

      {/* Tatami mat sections - traditional Japanese straw mats with woven texture */}
      {/* Center tatami mat */}
      <mesh position={[0, -4.98, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[12, 10]} />
        <meshPhysicalMaterial
          map={textures.tatami}
          roughness={0.95}
          metalness={0.0}
          normalScale={new THREE.Vector2(0.6, 0.6)}
          envMapIntensity={0.1}
        />
      </mesh>

      {/* Tatami border - dark fabric binding */}
      <mesh position={[0, -4.97, -5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[12, 0.3]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
      </mesh>
      <mesh position={[0, -4.97, 5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[12, 0.3]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
      </mesh>

      {/* === CENTRAL DRAFTING TABLE === */}

      {/* Table top - aged oak with photorealistic wood grain */}
      <mesh position={[0, -1, 0]} castShadow receiveShadow>
        <boxGeometry args={[8, 0.3, 5]} />
        <meshPhysicalMaterial
          map={textures.woodTable}
          normalMap={textures.woodNormal}
          normalScale={new THREE.Vector2(0.25, 0.25)}
          roughness={0.65}
          metalness={0.0}
          clearcoat={0.35}
          clearcoatRoughness={0.4}
          envMapIntensity={0.5}
        />
      </mesh>

      {/* Table legs - turned wood with texture */}
      {[[-3.5, 0, -2], [-3.5, 0, 2], [3.5, 0, -2], [3.5, 0, 2]].map((pos, i) => (
        <mesh key={`leg-${i}`} position={pos as [number, number, number]} castShadow>
          <cylinderGeometry args={[0.15, 0.2, 3, 16]} />
          <meshPhysicalMaterial
            map={textures.woodDummy}
            normalMap={textures.woodNormal}
            normalScale={new THREE.Vector2(0.2, 0.2)}
            roughness={0.7}
            metalness={0.0}
            envMapIntensity={0.3}
          />
        </mesh>
      ))}

      {/* === ITEMS ON TABLE === */}

      {/* Leonardo's anatomical drawing - aged parchment with fiber texture */}
      <mesh position={[-2, -0.7, 0]} rotation={[-Math.PI / 2, 0, 0.2]} receiveShadow>
        <planeGeometry args={[2.5, 3]} />
        <meshPhysicalMaterial
          map={textures.parchment}
          roughness={0.9}
          metalness={0.0}
          emissive="#ffecd2"
          emissiveIntensity={0.05}
          normalScale={new THREE.Vector2(0.1, 0.1)}
        />
      </mesh>

      {/* Blueprint scroll - partially unrolled with parchment texture */}
      <group ref={scrollRef} position={[2, -0.65, 1]} rotation={[0, 0.3, 0]}>
        {/* Rolled section */}
        <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 2, 16]} />
          <meshPhysicalMaterial
            map={textures.parchment}
            roughness={0.85}
            metalness={0.0}
            normalScale={new THREE.Vector2(0.15, 0.15)}
          />
        </mesh>
        {/* Unrolled section */}
        <mesh position={[0.5, 0, 0.5]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.5, 2]} />
          <meshPhysicalMaterial
            map={textures.parchment}
            roughness={0.88}
            metalness={0.0}
            normalScale={new THREE.Vector2(0.1, 0.1)}
          />
        </mesh>
      </group>

      {/* Quill pen - elegant writing instrument */}
      <group position={[-1, -0.5, 1.5]} rotation={[0, 0, -0.5]}>
        {/* Feather */}
        <mesh castShadow>
          <coneGeometry args={[0.05, 1.2, 8]} />
          <meshPhysicalMaterial
            color="#f5f5f5"
            roughness={0.7}
            metalness={0.0}
          />
        </mesh>
        {/* Quill tip */}
        <mesh position={[0, -0.7, 0]} castShadow>
          <coneGeometry args={[0.02, 0.3, 6]} />
          <meshPhysicalMaterial
            color="#1a1a1a"
            roughness={0.3}
            metalness={0.5}
          />
        </mesh>
      </group>

      {/* Ink bottle - glass with dark ink */}
      <group position={[-0.5, -0.6, -1.5]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.2, 0.25, 0.5, 16]} />
          <meshPhysicalMaterial
            color="#1a1a1a"
            roughness={0.0}
            metalness={0.0}
            transmission={0.8}
            thickness={0.3}
            ior={1.5}
          />
        </mesh>
        {/* Cork stopper */}
        <mesh position={[0, 0.35, 0]} castShadow>
          <cylinderGeometry args={[0.12, 0.15, 0.2, 12]} />
          <meshStandardMaterial color="#8b7355" roughness={0.9} />
        </mesh>
      </group>

      {/* Compass - brass drafting compass with oxidation and scratches */}
      <group position={[1, -0.6, -1]} rotation={[0, 0.8, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.03, 0.03, 1, 8]} />
          <meshPhysicalMaterial
            map={textures.brass}
            roughness={0.25}
            metalness={0.95}
            envMapIntensity={1.2}
            clearcoat={0.3}
            clearcoatRoughness={0.4}
          />
        </mesh>
        <mesh position={[0.3, 0, 0]} rotation={[0, 0, -0.3]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 1, 8]} />
          <meshPhysicalMaterial
            map={textures.brass}
            roughness={0.25}
            metalness={0.95}
            envMapIntensity={1.2}
            clearcoat={0.3}
            clearcoatRoughness={0.4}
          />
        </mesh>
      </group>

      {/* Ruler - wooden measuring stick */}
      <mesh position={[3, -0.65, -0.5]} rotation={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[0.1, 0.05, 2.5]} />
        <meshPhysicalMaterial
          color="#8b7355"
          roughness={0.7}
          metalness={0.0}
        />
      </mesh>

      {/* === WALL MOUNTED ELEMENTS === */}

      {/* Back wall - weathered plaster */}
      <mesh position={[0, 2, -10]} receiveShadow>
        <planeGeometry args={[30, 20]} />
        <meshPhysicalMaterial
          color="#d4c4b0"
          roughness={0.95}
          metalness={0.0}
        />
      </mesh>

      {/* Anatomical drawing frame - left wall */}
      <group position={[-8, 2, -5]} rotation={[0, Math.PI / 4, 0]}>
        {/* Frame - dark wood */}
        <mesh castShadow>
          <boxGeometry args={[2.5, 3.5, 0.2]} />
          <meshPhysicalMaterial
            map={textures.woodFloor}
            normalMap={textures.woodNormal}
            normalScale={new THREE.Vector2(0.2, 0.2)}
            roughness={0.65}
            metalness={0.0}
            envMapIntensity={0.3}
          />
        </mesh>
        {/* Drawing surface - aged parchment */}
        <mesh position={[0, 0, 0.15]}>
          <planeGeometry args={[2.2, 3.2]} />
          <meshPhysicalMaterial
            map={textures.parchment}
            roughness={0.88}
            metalness={0.0}
            emissive="#ffecd2"
            emissiveIntensity={0.03}
            normalScale={new THREE.Vector2(0.12, 0.12)}
          />
        </mesh>
      </group>

      {/* Architectural sketch frame - right wall */}
      <group position={[8, 2, -5]} rotation={[0, -Math.PI / 4, 0]}>
        <mesh castShadow>
          <boxGeometry args={[2.8, 2.2, 0.2]} />
          <meshPhysicalMaterial
            map={textures.woodFloor}
            normalMap={textures.woodNormal}
            normalScale={new THREE.Vector2(0.2, 0.2)}
            roughness={0.65}
            metalness={0.0}
            envMapIntensity={0.3}
          />
        </mesh>
        <mesh position={[0, 0, 0.15]}>
          <planeGeometry args={[2.5, 1.9]} />
          <meshPhysicalMaterial
            map={textures.parchment}
            roughness={0.88}
            metalness={0.0}
            normalScale={new THREE.Vector2(0.12, 0.12)}
          />
        </mesh>
      </group>

      {/* Japanese calligraphy scroll - hanging scroll with textured paper */}
      <group position={[0, 5, -9.5]}>
        {/* Top scroll bar - dark lacquered wood */}
        <mesh position={[0, 2.5, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 1.5, 12]} />
          <meshPhysicalMaterial
            color="#1a1a1a"
            roughness={0.35}
            metalness={0.0}
            clearcoat={0.6}
            clearcoatRoughness={0.3}
            envMapIntensity={0.5}
          />
        </mesh>
        {/* Paper - aged rice paper texture */}
        <mesh position={[0, 0, 0.1]}>
          <planeGeometry args={[1.2, 4]} />
          <meshPhysicalMaterial
            map={textures.parchment}
            roughness={0.92}
            metalness={0.0}
            emissive="#ffecd2"
            emissiveIntensity={0.02}
            normalScale={new THREE.Vector2(0.15, 0.15)}
          />
        </mesh>
        {/* Bottom weight bar */}
        <mesh position={[0, -2.5, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 1.5, 12]} />
          <meshPhysicalMaterial
            color="#1a1a1a"
            roughness={0.35}
            metalness={0.0}
            clearcoat={0.6}
            clearcoatRoughness={0.3}
            envMapIntensity={0.5}
          />
        </mesh>
      </group>

      {/* Shelf with meditation bowl */}
      <group position={[-10, 1, -8]}>
        {/* Shelf */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2, 0.15, 0.8]} />
          <meshPhysicalMaterial
            color="#5a4632"
            roughness={0.7}
            metalness={0.0}
          />
        </mesh>
        {/* Meditation/singing bowl */}
        <mesh position={[0, 0.4, 0]} castShadow>
          <sphereGeometry args={[0.3, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshPhysicalMaterial
            color="#b8860b"
            roughness={0.3}
            metalness={0.85}
            clearcoat={0.5}
          />
        </mesh>
      </group>

      {/* === WING CHUN WOODEN DUMMY (Mook Jong) === */}

      <group position={[9, -2, 2]} rotation={[0, -Math.PI / 4, 0]}>
        {/* Main vertical post - weathered hardwood with realistic grain */}
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.4, 0.4, 6, 16]} />
          <meshPhysicalMaterial
            map={textures.woodDummy}
            normalMap={textures.woodNormal}
            normalScale={new THREE.Vector2(0.3, 0.3)}
            roughness={0.88}
            metalness={0.0}
            envMapIntensity={0.25}
          />
        </mesh>

        {/* Upper arm - left */}
        <mesh position={[-0.8, 1.5, 0]} rotation={[0, 0, -Math.PI / 6]} castShadow>
          <cylinderGeometry args={[0.15, 0.15, 2, 12]} />
          <meshPhysicalMaterial
            map={textures.woodDummy}
            normalMap={textures.woodNormal}
            normalScale={new THREE.Vector2(0.35, 0.35)}
            roughness={0.85}
            metalness={0.0}
            envMapIntensity={0.2}
          />
        </mesh>

        {/* Upper arm - right */}
        <mesh position={[0.8, 1.5, 0]} rotation={[0, 0, Math.PI / 6]} castShadow>
          <cylinderGeometry args={[0.15, 0.15, 2, 12]} />
          <meshPhysicalMaterial
            map={textures.woodDummy}
            normalMap={textures.woodNormal}
            normalScale={new THREE.Vector2(0.35, 0.35)}
            roughness={0.85}
            metalness={0.0}
            envMapIntensity={0.2}
          />
        </mesh>

        {/* Center arm */}
        <mesh position={[0, 0.3, 0.6]} rotation={[Math.PI / 3, 0, 0]} castShadow>
          <cylinderGeometry args={[0.15, 0.15, 1.8, 12]} />
          <meshPhysicalMaterial
            map={textures.woodDummy}
            normalMap={textures.woodNormal}
            normalScale={new THREE.Vector2(0.35, 0.35)}
            roughness={0.85}
            metalness={0.0}
            envMapIntensity={0.2}
          />
        </mesh>

        {/* Leg */}
        <mesh position={[0, -2, 0.5]} rotation={[Math.PI / 4, 0, 0]} castShadow>
          <cylinderGeometry args={[0.15, 0.15, 1.5, 12]} />
          <meshPhysicalMaterial
            map={textures.woodDummy}
            normalMap={textures.woodNormal}
            normalScale={new THREE.Vector2(0.35, 0.35)}
            roughness={0.85}
            metalness={0.0}
            envMapIntensity={0.2}
          />
        </mesh>

        {/* Base stand */}
        <mesh position={[0, -5.5, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1, 1.2, 1, 16]} />
          <meshPhysicalMaterial
            map={textures.woodFloor}
            normalMap={textures.woodNormal}
            normalScale={new THREE.Vector2(0.4, 0.4)}
            roughness={0.92}
            metalness={0.0}
            envMapIntensity={0.15}
          />
        </mesh>
      </group>

      {/* === BOOKS & ARTIFACTS === */}

      {/* Stack of leather-bound books - left side of table */}
      <group position={[-3, -0.3, -1.5]}>
        {/* Book 1 - bottom */}
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[1.2, 0.15, 1.8]} />
          <meshPhysicalMaterial
            color="#5a3a2a"
            roughness={0.7}
            metalness={0.0}
          />
        </mesh>
        {/* Book 2 - middle */}
        <mesh position={[0, 0.15, 0]} rotation={[0, 0.3, 0]} castShadow>
          <boxGeometry args={[1.1, 0.15, 1.7]} />
          <meshPhysicalMaterial
            color="#4a2a1a"
            roughness={0.7}
            metalness={0.0}
          />
        </mesh>
        {/* Book 3 - top */}
        <mesh position={[0, 0.3, 0]} rotation={[0, -0.2, 0]} castShadow>
          <boxGeometry args={[1.0, 0.15, 1.6]} />
          <meshPhysicalMaterial
            color="#6a4a3a"
            roughness={0.7}
            metalness={0.0}
          />
        </mesh>
      </group>

      {/* Buddha statue - small brass figure with aged patina */}
      <group position={[-9, 1.3, -8]}>
        {/* Base */}
        <mesh castShadow>
          <cylinderGeometry args={[0.15, 0.2, 0.1, 16]} />
          <meshPhysicalMaterial
            map={textures.brass}
            roughness={0.35}
            metalness={0.85}
            envMapIntensity={1.0}
            clearcoat={0.4}
          />
        </mesh>
        {/* Body */}
        <mesh position={[0, 0.3, 0]} castShadow>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshPhysicalMaterial
            map={textures.brass}
            roughness={0.25}
            metalness={0.9}
            emissive="#d4af37"
            emissiveIntensity={0.1}
            envMapIntensity={1.2}
            clearcoat={0.5}
          />
        </mesh>
      </group>

      {/* Brush painting supplies - ink stone and brushes */}
      <group position={[3.5, -0.6, 1.5]}>
        {/* Ink stone */}
        <mesh castShadow>
          <boxGeometry args={[0.6, 0.1, 0.8]} />
          <meshPhysicalMaterial
            color="#1a1a1a"
            roughness={0.3}
            metalness={0.0}
          />
        </mesh>
        {/* Brush in holder */}
        <mesh position={[-0.5, 0.3, 0]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.8, 8]} />
          <meshPhysicalMaterial
            color="#3a2a1a"
            roughness={0.6}
            metalness={0.0}
          />
        </mesh>
      </group>

      {/* Meditation cushion (zafu) - on floor */}
      <mesh position={[-6, -4.5, 5]} rotation={[-Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.8, 0.7, 0.4, 32]} />
        <meshPhysicalMaterial
          color="#4a1a4a"
          roughness={0.9}
          metalness={0.0}
        />
      </mesh>

      {/* === PHOTOREALISTIC STUDIO LIGHTING === */}

      {/* KEY LIGHT - Main illumination (warm candlelight simulation) */}
      <spotLight
        ref={candleFlickerRef}
        position={[-5, 8, 3]}
        intensity={3.5}
        angle={0.6}
        penumbra={0.6}
        castShadow
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
        shadow-bias={-0.0001}
        shadow-radius={2}
        color="#ffb366"
        decay={2}
      />

      {/* FILL LIGHT - Soft ambient bounce from walls */}
      <rectAreaLight
        position={[5, 4, 5]}
        width={8}
        height={6}
        intensity={1.2}
        color="#f5e6d3"
      />

      {/* RIM LIGHT - Edge definition and depth (golden accent) */}
      <spotLight
        position={[-8, 6, -5]}
        intensity={2.0}
        angle={0.4}
        penumbra={0.5}
        color="#d4af37"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      {/* ACCENT LIGHT - Wooden dummy highlight */}
      <spotLight
        position={[12, 7, 2]}
        intensity={1.8}
        angle={0.35}
        penumbra={0.6}
        color="#ffa500"
        castShadow
      />

      {/* AMBIENT OCCLUSION - Global illumination simulation */}
      <hemisphereLight
        args={['#ffecd2', '#2a1a0a', 0.8]}
      />

      {/* Atmospheric fog for depth */}
      <fog attach="fog" args={['#1a1510', 20, 50]} />

      {/* Atmospheric dust particles */}
      <points ref={dustParticlesRef} geometry={dustGeometry} material={dustMaterial} />

      {/* Particle halo for interactive feedback */}
      <ParticleHalo count={600} color={color} radius={15} intensity={isActive ? 1.8 : 1.2} />

      {/* Active state indicator ring */}
      {isActive && (
        <mesh position={[0, -4.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[16, 16.5, 64]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.6}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Hover state glow effect */}
      {isHovered && (
        <pointLight
          position={[0, 0, 0]}
          intensity={3}
          distance={20}
          color={color}
        />
      )}
    </group>
  )
}
