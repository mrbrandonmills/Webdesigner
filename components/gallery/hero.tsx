'use client'

import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
// import VideoHero from '@/components/video-hero'

/**
 * Museum-Quality Cinematic Hero Section
 * Luxury parallax with smooth spring physics and advanced reveal animations
 * Inspired by Louis Vuitton, Apple, and high-end fashion photography sites
 *
 * TODO: Replace gradient background with VideoHero when you upload modeling portfolio video
 * Uncomment the VideoHero import above and wrap the content below:
 *
 * <VideoHero videoSrc="/portfolio-reel.mp4" posterSrc="/portfolio-poster.jpg" className="h-screen">
 *   {content}
 * </VideoHero>
 */
export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  // Advanced parallax effects with spring physics
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.5, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.05, 1.1])
  const blur = useTransform(scrollYProgress, [0, 1], [0, 10])

  // Smooth spring physics for parallax
  const smoothY = useSpring(y, { stiffness: 100, damping: 30 })
  const smoothScale = useSpring(scale, { stiffness: 100, damping: 30 })

  // Mouse parallax effect
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const smoothMouseX = useSpring(mouseX, { stiffness: 150, damping: 30 })
  const smoothMouseY = useSpring(mouseY, { stiffness: 150, damping: 30 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e
      const { innerWidth, innerHeight } = window

      // Convert to range -1 to 1
      const x = (clientX / innerWidth - 0.5) * 2
      const y = (clientY / innerHeight - 0.5) * 2

      mouseX.set(x * 20)
      mouseY.set(y * 20)
      setMousePosition({ x: clientX, y: clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  return (
    <div ref={containerRef} className="relative h-screen w-full overflow-hidden bg-black">
      {/* Animated gradient orbs - luxury ambient lighting */}
      <motion.div
        className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full opacity-20 blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(201, 160, 80, 0.4) 0%, transparent 70%)',
          x: smoothMouseX,
          y: smoothMouseY,
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full opacity-15 blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%)',
          x: useTransform(smoothMouseX, (x) => -x),
          y: useTransform(smoothMouseY, (y) => -y),
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
      />

      {/* Background with advanced parallax */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ y: smoothY, scale: smoothScale }}
      >
        {/* Luxury gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900" />

        {/* Radial gradient overlay for depth */}
        <div
          className="absolute inset-0 opacity-50"
          style={{
            background: 'radial-gradient(circle at 50% 50%, transparent 0%, rgba(0, 0, 0, 0.8) 100%)',
          }}
        />

        {/* Noise texture overlay - adds luxury film grain */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Animated grid pattern - subtle tech luxury */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
            backgroundSize: '100px 100px',
          }}
        />
      </motion.div>

      {/* Content with mouse parallax */}
      <motion.div
        className="relative z-10 flex h-full items-center justify-center px-8"
        style={{
          opacity,
          x: useTransform(smoothMouseX, (x) => x * 0.5),
          y: useTransform(smoothMouseY, (y) => y * 0.5),
        }}
      >
        <div className="text-center max-w-5xl">
          {/* Luxury badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full mb-12 glass border border-white/10"
          >
            <div className="w-2 h-2 rounded-full bg-accent-gold animate-pulse" />
            <span className="text-xs tracking-[0.3em] uppercase text-white/60 font-light">
              Modeling Portfolio
            </span>
          </motion.div>

          {/* Main title with advanced stagger and split text reveal */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="overflow-hidden mb-8"
          >
            <motion.h1
              initial={{ y: 100, rotateX: -30 }}
              animate={{ y: 0, rotateX: 0 }}
              transition={{
                duration: 1.2,
                delay: 0.7,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="font-serif text-6xl md:text-8xl lg:text-9xl font-light text-white mb-0 leading-[0.9] tracking-tight"
              style={{
                textShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
              }}
            >
              Brandon Mills
            </motion.h1>
          </motion.div>

          {/* Subtitle with individual word reveals */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="overflow-hidden mb-12"
          >
            <motion.div
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, delay: 1.4, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center justify-center gap-4 text-lg md:text-2xl text-gray-400 font-light tracking-[0.15em]"
            >
              {['Model', '·', 'Actor', '·', 'Researcher', '·', 'Creative'].map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: 1.5 + i * 0.1,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className={word === '·' ? 'text-accent-gold' : ''}
                >
                  {word}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>

          {/* Animated divider with gold accent */}
          <motion.div
            className="flex items-center justify-center gap-4 mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.8 }}
          >
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 2, ease: [0.22, 1, 0.36, 1] }}
              className="w-16 h-px bg-gradient-to-r from-transparent via-white/30 to-white/30"
            />
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, delay: 2.2, ease: [0.22, 1, 0.36, 1] }}
              className="w-2 h-2 rounded-full bg-accent-gold glow-gold"
            />
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 2, ease: [0.22, 1, 0.36, 1] }}
              className="w-16 h-px bg-gradient-to-l from-transparent via-white/30 to-white/30"
            />
          </motion.div>

          {/* Description with luxury typography */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.4, ease: [0.22, 1, 0.36, 1] }}
            className="text-base md:text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed font-light"
          >
            A portfolio of work exploring the intersection of performance,
            research, and creative expression
          </motion.p>

          {/* Call to action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.8, ease: [0.22, 1, 0.36, 1] }}
            className="mt-12"
          >
            <motion.button
              className="group relative px-10 py-5 glass rounded-full border border-white/20 text-white font-light tracking-[0.2em] uppercase text-sm overflow-hidden"
              whileHover={{ scale: 1.05, borderColor: 'rgba(201, 160, 80, 0.5)' }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              {/* Button shine effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                initial={{ x: '-100%' }}
                whileHover={{ x: '200%' }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
              />
              <span className="relative z-10">Explore Portfolio</span>
            </motion.button>
          </motion.div>

          {/* Luxury scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{
              duration: 3,
              delay: 3.5,
              repeat: Infinity,
              repeatDelay: 2,
              ease: 'easeInOut',
            }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2"
          >
            <div className="flex flex-col items-center gap-3">
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="w-6 h-10 border-2 border-white/20 rounded-full relative"
              >
                <motion.div
                  animate={{ y: [0, 16, 0], opacity: [1, 0, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute top-2 left-1/2 -translate-x-1/2 w-1 h-3 bg-accent-gold rounded-full"
                />
              </motion.div>
              <span className="text-xs tracking-[0.3em] uppercase text-white/40 font-light">
                Scroll
              </span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
