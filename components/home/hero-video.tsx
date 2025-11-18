'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

export default function HeroVideo() {
  const [isLoaded, setIsLoaded] = useState(false)

  // Fallback: show content after 1.5s even if video doesn't load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Video Background */}
      <video
        data-testid="hero-video"
        autoPlay
        loop
        muted
        playsInline
        onLoadedData={() => setIsLoaded(true)}
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/videos/hero-loop.mp4" type="video/mp4" />
      </video>

      {/* Fallback Background Image (shows if video doesn't load) */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-900 to-black" />

      {/* Elegant Overlay - darkens video */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />

      {/* Paper Texture Overlay */}
      <div
        className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='400' height='400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center container-wide text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 30 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-8"
        >
          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: isLoaded ? 1 : 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-sm md:text-base tracking-[0.3em] uppercase text-accent-gold font-light"
          >
            Renaissance Man — Modern Era
          </motion.p>

          {/* Main Title */}
          <h1 className="text-4xl xs:text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-light font-serif leading-none text-white px-4">
            Brandon Mills
          </h1>

          {/* Divider */}
          <div className="w-16 sm:w-24 h-px bg-gradient-to-r from-transparent via-accent-gold to-transparent mx-auto" />

          {/* Tagline */}
          <p className="text-base xs:text-lg sm:text-xl md:text-2xl lg:text-3xl font-light text-white/90 max-w-3xl leading-relaxed px-6">
            Model · Author · AI Architect · Visual Artist
          </p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isLoaded ? 1 : 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="pt-8"
          >
            <a
              href="#collections"
              className="inline-flex items-center gap-3 px-10 py-5 bg-accent-gold text-black font-medium tracking-wider uppercase hover:bg-accent-hover transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              Explore Collections
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2 text-white/60"
        >
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <svg className="w-6 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  )
}
