'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import * as THREE from 'three'

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface TimelineStop {
  year: string
  title: string
  description: string
  image: string
  position: [number, number, number]
}

const timelineData: TimelineStop[] = [
  {
    year: '2018',
    title: 'The Beginning',
    description: 'Started exploring web development and digital design. Building simple websites and learning the fundamentals of code.',
    image: '/timeline/2018.jpg',
    position: [0, 0, -10]
  },
  {
    year: '2020',
    title: 'Finding Voice',
    description: 'Developed unique design aesthetic. Started working with clients and refining craft through real-world projects.',
    image: '/timeline/2020.jpg',
    position: [-5, 2, -5]
  },
  {
    year: '2022',
    title: 'Evolution',
    description: 'Mastered modern frameworks. Built complex web applications with React, Next.js, and advanced animation libraries.',
    image: '/timeline/2022.jpg',
    position: [5, -2, 0]
  },
  {
    year: '2024',
    title: 'AM Reed Collaboration',
    description: 'Partnered with AM Reed on luxury portfolio. Pushed boundaries of web design with museum-quality presentation.',
    image: '/timeline/2024.jpg',
    position: [-3, 1, 5]
  },
  {
    year: '2025',
    title: 'Present Day',
    description: 'Creating computational luxury. Engineering digital experiences that blend artistic vision with technical precision.',
    image: '/timeline/2025.jpg',
    position: [0, 0, 10]
  },
]

export function ScrollJourney() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sceneRef = useRef<{
    scene?: THREE.Scene
    camera?: THREE.PerspectiveCamera
    renderer?: THREE.WebGLRenderer
    meshes?: THREE.Mesh[]
  }>({})
  const [currentStop, setCurrentStop] = useState(0)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  })

  // Three.js scene setup
  useEffect(() => {
    if (!canvasRef.current) return

    // Scene
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x000000)

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    camera.position.set(0, 0, 5)

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    const pointLight = new THREE.PointLight(0xD4AF37, 1)
    pointLight.position.set(5, 5, 5)
    scene.add(pointLight)

    // Create image planes for each timeline stop
    const textureLoader = new THREE.TextureLoader()
    const meshes: THREE.Mesh[] = []

    timelineData.forEach((stop, index) => {
      const geometry = new THREE.PlaneGeometry(4, 3)
      const material = new THREE.MeshBasicMaterial({
        color: 0x333333,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8
      })

      // Try to load texture if image exists
      textureLoader.load(
        stop.image,
        (texture) => {
          material.map = texture
          material.needsUpdate = true
        },
        undefined,
        () => {
          // Fallback: use year as texture
          const canvas = document.createElement('canvas')
          canvas.width = 512
          canvas.height = 384
          const ctx = canvas.getContext('2d')
          if (ctx) {
            ctx.fillStyle = '#1a1a1a'
            ctx.fillRect(0, 0, 512, 384)
            ctx.fillStyle = '#D4AF37'
            ctx.font = 'bold 120px serif'
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            ctx.fillText(stop.year, 256, 192)
          }
          const texture = new THREE.CanvasTexture(canvas)
          material.map = texture
          material.needsUpdate = true
        }
      )

      const mesh = new THREE.Mesh(geometry, material)
      mesh.position.set(...stop.position)
      mesh.userData = { index, stop }
      meshes.push(mesh)
      scene.add(mesh)
    })

    sceneRef.current = { scene, camera, renderer, meshes }

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)
      renderer.render(scene, camera)
    }
    animate()

    // Resize handler
    const handleResize = () => {
      if (!camera || !renderer) return
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      renderer.dispose()
      meshes.forEach(mesh => {
        mesh.geometry.dispose()
        if (mesh.material instanceof THREE.Material) {
          mesh.material.dispose()
        }
      })
    }
  }, [])

  // GSAP ScrollTrigger for camera movement
  useEffect(() => {
    if (!sceneRef.current.camera || !containerRef.current) return

    const camera = sceneRef.current.camera
    const meshes = sceneRef.current.meshes || []

    // Create scroll-triggered camera animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
        snap: {
          snapTo: 1 / (timelineData.length - 1),
          duration: 0.5,
          ease: 'power2.inOut'
        },
        onUpdate: (self) => {
          const progress = self.progress
          const stopIndex = Math.round(progress * (timelineData.length - 1))
          setCurrentStop(stopIndex)
        }
      }
    })

    // Animate camera through each timeline position
    timelineData.forEach((stop, index) => {
      const targetMesh = meshes[index]
      if (targetMesh) {
        const targetPos = targetMesh.position

        tl.to(camera.position, {
          x: targetPos.x,
          y: targetPos.y,
          z: targetPos.z + 2,
          duration: 1,
          ease: 'power2.inOut'
        }, index)

        tl.to(camera.rotation, {
          x: 0,
          y: 0,
          z: 0,
          duration: 1,
          ease: 'power2.inOut'
        }, index)
      }
    })

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  return (
    <div ref={containerRef} className="relative" style={{ height: `${timelineData.length * 100}vh` }}>
      {/* Three.js Canvas (fixed background) */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full"
        style={{ zIndex: 1 }}
      />

      {/* Timeline UI Overlay */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 10 }}>
        {/* Current Stop Info */}
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-full max-w-2xl px-6 text-center">
          <motion.div
            key={currentStop}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <div className="text-6xl md:text-8xl font-serif font-light text-white mb-2">
              {timelineData[currentStop].year}
            </div>
            <div className="text-2xl md:text-3xl font-serif text-accent-gold">
              {timelineData[currentStop].title}
            </div>
            <p className="text-lg text-white/70 leading-relaxed">
              {timelineData[currentStop].description}
            </p>
          </motion.div>
        </div>

        {/* Progress Indicator */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2">
          <div className="flex flex-col gap-4">
            {timelineData.map((stop, index) => (
              <div
                key={index}
                className="group flex items-center gap-3"
              >
                <div className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${
                  index === currentStop
                    ? 'border-accent-gold bg-accent-gold scale-125'
                    : index < currentStop
                    ? 'border-accent-gold/50 bg-accent-gold/50'
                    : 'border-white/30'
                }`} />
                <span className={`text-sm font-mono transition-all duration-300 ${
                  index === currentStop
                    ? 'text-accent-gold opacity-100'
                    : 'text-white/50 opacity-0 group-hover:opacity-100'
                }`}>
                  {stop.year}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Hint (only visible at start) */}
        {currentStop === 0 && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          >
            <span className="text-xs text-white/50 uppercase tracking-widest">Scroll to Journey</span>
            <div className="w-px h-12 bg-gradient-to-b from-accent-gold to-transparent" />
          </motion.div>
        )}
      </div>
    </div>
  )
}
