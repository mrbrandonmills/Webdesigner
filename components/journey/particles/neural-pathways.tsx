'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { ParticleSystemProps } from '@/lib/types/journey'

/**
 * NeuralPathways - Brain-like neural connections
 * Creates animated lines that connect like neural pathways
 */
export function NeuralPathways({
  count = 50,
  color = '#60A5FA',
  intensity = 1
}: ParticleSystemProps) {
  const linesRef = useRef<THREE.Group>(null)

  const pathways = useMemo(() => {
    const paths = []

    for (let i = 0; i < count; i++) {
      // Create random points on a sphere
      const theta1 = Math.random() * Math.PI * 2
      const phi1 = Math.acos(Math.random() * 2 - 1)
      const r = 1.5

      const start = new THREE.Vector3(
        r * Math.sin(phi1) * Math.cos(theta1),
        r * Math.sin(phi1) * Math.sin(theta1),
        r * Math.cos(phi1)
      )

      // Create nearby endpoint for connection
      const theta2 = theta1 + (Math.random() - 0.5) * 0.5
      const phi2 = phi1 + (Math.random() - 0.5) * 0.5

      const end = new THREE.Vector3(
        r * Math.sin(phi2) * Math.cos(theta2),
        r * Math.sin(phi2) * Math.sin(theta2),
        r * Math.cos(phi2)
      )

      paths.push({ start, end, phase: Math.random() * Math.PI * 2 })
    }

    return paths
  }, [count])

  useFrame((state) => {
    if (!linesRef.current) return

    linesRef.current.children.forEach((line, i) => {
      const pathway = pathways[i]
      const material = (line as THREE.Line).material as THREE.LineBasicMaterial

      // Pulsing opacity with phase offset
      const pulse = Math.sin(state.clock.elapsedTime * 2 + pathway.phase)
      material.opacity = (0.3 + pulse * 0.3) * intensity
    })
  })

  return (
    <group ref={linesRef}>
      {pathways.map((pathway, i) => {
        const linePositions = new Float32Array([
          pathway.start.x, pathway.start.y, pathway.start.z,
          pathway.end.x, pathway.end.y, pathway.end.z
        ])
        return (
          <line key={i}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={2}
                array={linePositions}
                itemSize={3}
                args={[linePositions, 3]}
              />
            </bufferGeometry>
            <lineBasicMaterial
              color={color}
              transparent
              opacity={0.5}
              blending={THREE.AdditiveBlending}
            />
          </line>
        )
      })}
    </group>
  )
}
