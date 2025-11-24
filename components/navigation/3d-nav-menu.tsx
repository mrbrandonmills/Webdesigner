'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { Text, PerspectiveCamera } from '@react-three/drei'
import { useRef, useState, Suspense } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import * as THREE from 'three'

// Individual navigation item in 3D space
interface NavItemProps {
  text: string
  href: string
  position: [number, number, number]
  isActive: boolean
  isHovered: boolean
  onHover: () => void
  onLeave: () => void
}

function NavItem3D({ text, position, isActive, isHovered, onHover, onLeave }: NavItemProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const textRef = useRef<any>(null)

  // Target Z position for smooth depth transitions
  const targetZ = isHovered ? position[2] + 2 : isActive ? position[2] + 1 : position[2]

  useFrame((state, delta) => {
    if (meshRef.current && textRef.current) {
      // Smooth interpolation for train-stop effect
      const currentZ = meshRef.current.position.z
      const newZ = THREE.MathUtils.lerp(currentZ, targetZ, delta * 8)

      meshRef.current.position.z = newZ
      textRef.current.position.z = newZ

      // Subtle scale effect for active/hover states
      const targetScale = isHovered ? 1.15 : isActive ? 1.08 : 1
      const currentScale = meshRef.current.scale.x
      const newScale = THREE.MathUtils.lerp(currentScale, targetScale, delta * 10)

      meshRef.current.scale.set(newScale, newScale, newScale)
      textRef.current.scale.set(newScale, newScale, newScale)

      // Glow intensity
      const targetOpacity = isHovered ? 0.3 : isActive ? 0.15 : 0.08
      const currentOpacity = (meshRef.current.material as THREE.MeshBasicMaterial).opacity
      const newOpacity = THREE.MathUtils.lerp(currentOpacity, targetOpacity, delta * 8)
      ;(meshRef.current.material as THREE.MeshBasicMaterial).opacity = newOpacity
    }
  })

  return (
    <group
      onPointerEnter={onHover}
      onPointerLeave={onLeave}
    >
      {/* Glow background */}
      <mesh ref={meshRef} position={position}>
        <planeGeometry args={[3.5, 0.6, 1, 1]} />
        <meshBasicMaterial
          color={isActive ? "#D4AF37" : "#ffffff"}
          transparent
          opacity={0.08}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Text label */}
      <Text
        ref={textRef}
        position={position}
        fontSize={0.28}
        color={isHovered ? "#D4AF37" : isActive ? "#ffffff" : "#ffffff"}
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.15}
        font="/fonts/Inter-Light.woff"
      >
        {text}
      </Text>
    </group>
  )
}

// Main 3D Scene
interface Nav3DSceneProps {
  navItems: Array<{ name: string; href: string }>
  pathname: string
  onNavigate: (href: string) => void
}

function Nav3DScene({ navItems, pathname, onNavigate }: Nav3DSceneProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />

      <group>
        {navItems.map((item, index) => {
          const spacing = 0.8
          const yPosition = (navItems.length / 2 - index) * spacing - spacing / 2
          const zPosition = -index * 0.3 // Creates depth stacking

          return (
            <group
              key={item.href}
              onClick={() => onNavigate(item.href)}
            >
              <NavItem3D
                text={item.name}
                href={item.href}
                position={[0, yPosition, zPosition]}
                isActive={pathname === item.href}
                isHovered={hoveredIndex === index}
                onHover={() => setHoveredIndex(index)}
                onLeave={() => setHoveredIndex(null)}
              />
            </group>
          )
        })}
      </group>
    </>
  )
}

// Main component wrapper
interface ThreeDNavMenuProps {
  navItems: Array<{ name: string; href: string }>
  isOpen: boolean
  onClose: () => void
}

export default function ThreeDNavMenu({ navItems, isOpen, onClose }: ThreeDNavMenuProps) {
  const pathname = usePathname()

  const handleNavigate = (href: string) => {
    // Navigation will be handled by Next.js Link
    onClose()
  }

  if (!isOpen) return null

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      onClick={onClose}
    >
      {/* Backdrop blur */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        style={{
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      />

      {/* 3D Canvas */}
      <motion.div
        className="relative w-full h-full max-w-4xl max-h-[600px]"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <Canvas>
          <Suspense fallback={null}>
            <Nav3DScene
              navItems={navItems}
              pathname={pathname}
              onNavigate={handleNavigate}
            />
          </Suspense>
        </Canvas>
      </motion.div>

      {/* Close button */}
      <motion.button
        onClick={onClose}
        className="absolute top-8 right-8 text-white/60 hover:text-white transition-colors"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </motion.button>

      {/* Instructions */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40 text-sm tracking-widest uppercase"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        Hover to navigate • Click to select
      </motion.div>
    </motion.div>
  )
}

// Simplified 2D fallback for mobile
export function MobileNavMenu({ navItems, isOpen, onClose }: ThreeDNavMenuProps) {
  const pathname = usePathname()

  if (!isOpen) return null

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center gap-6 p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {navItems.map((item, index) => (
        <motion.div
          key={item.href}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <Link
            href={item.href}
            onClick={onClose}
            className={`text-3xl font-light tracking-[0.2em] transition-colors ${
              pathname === item.href
                ? 'text-accent-gold'
                : 'text-white/70 hover:text-white'
            }`}
          >
            {item.name}
          </Link>
        </motion.div>
      ))}

      <motion.button
        onClick={onClose}
        className="mt-8 text-white/40 text-sm tracking-widest uppercase"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Close
      </motion.button>
    </motion.div>
  )
}
