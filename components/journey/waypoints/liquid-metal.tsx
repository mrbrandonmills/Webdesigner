'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { WaypointProps } from '@/lib/types/journey'

/**
 * LiquidMetal - Before MEDITATION Stop
 * Flowing liquid metal surface with ripples
 */
export function LiquidMetal({ active, intensity = 1, color = '#9B59B6' }: WaypointProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.ShaderMaterial>(null)

  useFrame((state) => {
    if (!materialRef.current || !active) return

    materialRef.current.uniforms.time.value = state.clock.elapsedTime
  })

  if (!active) return null

  return (
    <mesh ref={meshRef} position={[0, -5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[50, 50, 128, 128]} />
      <shaderMaterial
        ref={materialRef}
        side={THREE.DoubleSide}
        uniforms={{
          time: { value: 0 },
          color: { value: new THREE.Color(color) },
          intensity: { value: intensity }
        }}
        vertexShader={`
          varying vec2 vUv;
          varying float vElevation;
          uniform float time;

          void main() {
            vUv = uv;

            vec3 pos = position;

            // Create ripples
            float elevation = 0.0;
            elevation += sin(pos.x * 0.5 + time) * 0.5;
            elevation += cos(pos.y * 0.5 + time) * 0.5;
            elevation += sin(length(pos.xy) * 0.3 - time * 2.0) * 1.0;

            pos.z = elevation;
            vElevation = elevation;

            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `}
        fragmentShader={`
          uniform vec3 color;
          uniform float intensity;
          varying vec2 vUv;
          varying float vElevation;

          void main() {
            vec3 finalColor = color * (1.0 + vElevation * 0.3);
            float alpha = 0.8 * intensity;

            gl_FragColor = vec4(finalColor, alpha);
          }
        `}
      />
    </mesh>
  )
}
