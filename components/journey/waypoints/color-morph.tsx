'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { WaypointProps } from '@/lib/types/journey'

/**
 * ColorMorphField - Before GALLERY Stop
 * Morphing color field with flowing gradients
 */
export function ColorMorphField({ active, intensity = 1, color = '#F5F5DC' }: WaypointProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.ShaderMaterial>(null)

  useFrame((state) => {
    if (!materialRef.current || !active) return

    // Animate color morphing
    materialRef.current.uniforms.time.value = state.clock.elapsedTime
  })

  if (!active) return null

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <planeGeometry args={[100, 100, 32, 32]} />
      <shaderMaterial
        ref={materialRef}
        transparent
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
        uniforms={{
          time: { value: 0 },
          color1: { value: new THREE.Color(color) },
          color2: { value: new THREE.Color('#FFE5B4') },
          intensity: { value: intensity }
        }}
        vertexShader={`
          varying vec2 vUv;
          varying vec3 vPosition;
          uniform float time;

          void main() {
            vUv = uv;
            vPosition = position;

            vec3 pos = position;
            pos.z += sin(pos.x * 0.5 + time) * 2.0;
            pos.z += cos(pos.y * 0.5 + time) * 2.0;

            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `}
        fragmentShader={`
          uniform float time;
          uniform vec3 color1;
          uniform vec3 color2;
          uniform float intensity;
          varying vec2 vUv;
          varying vec3 vPosition;

          void main() {
            float t = sin(vUv.x * 3.0 + time) * cos(vUv.y * 3.0 + time);
            vec3 color = mix(color1, color2, t * 0.5 + 0.5);

            float alpha = 0.3 * intensity;
            gl_FragColor = vec4(color, alpha);
          }
        `}
      />
    </mesh>
  )
}
