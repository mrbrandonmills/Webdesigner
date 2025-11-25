/**
 * Home V2 - The Monolith Project Style
 * Camera tracking roll with 3D transitions
 */

'use client'

import { useState } from 'react'
import { CameraRollCanvas } from '@/components/camera-roll/camera-roll-canvas'
import { SmoothScrollWrapper } from '@/components/camera-roll/smooth-scroll-wrapper'

export default function HomeV2() {
  const [scrollProgress, setScrollProgress] = useState(0)

  return (
    <SmoothScrollWrapper onScroll={setScrollProgress}>
      <main className="relative min-h-[400vh]">
        {/* 3D Canvas with camera roll */}
        <CameraRollCanvas scrollProgress={scrollProgress} />

        {/* Content overlay */}
        <div className="relative z-10 pointer-events-none">
          {/* Section 1: Hero */}
          <section className="h-screen flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-8xl font-bold mb-4" style={{ mixBlendMode: 'difference' }}>
                BRANDON MILLS
              </h1>
              <p className="text-2xl opacity-60">Scroll to experience</p>
            </div>
          </section>

          {/* Section 2: About */}
          <section className="h-screen flex items-center justify-center">
            <div className="text-center text-white max-w-2xl px-8">
              <h2 className="text-6xl font-bold mb-6" style={{ mixBlendMode: 'difference' }}>
                Camera Roll
              </h2>
              <p className="text-xl opacity-80">
                The camera rotates and tracks through 3D space as you scroll
              </p>
            </div>
          </section>

          {/* Section 3: Work */}
          <section className="h-screen flex items-center justify-center">
            <div className="text-center text-white max-w-2xl px-8">
              <h2 className="text-6xl font-bold mb-6" style={{ mixBlendMode: 'difference' }}>
                3D Transitions
              </h2>
              <p className="text-xl opacity-80">
                Cinematic movement inspired by The Monolith Project
              </p>
            </div>
          </section>

          {/* Section 4: Contact */}
          <section className="h-screen flex items-center justify-center">
            <div className="text-center text-white max-w-2xl px-8">
              <h2 className="text-6xl font-bold mb-6" style={{ mixBlendMode: 'difference' }}>
                Explore
              </h2>
              <p className="text-xl opacity-80">
                Keep scrolling to continue the journey
              </p>
            </div>
          </section>
        </div>

        {/* Progress indicator */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
          <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-full">
            <div className="text-white font-mono text-sm">
              Progress: {(scrollProgress * 100).toFixed(0)}%
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="fixed bottom-8 right-8 z-20 pointer-events-none">
          <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-full">
            <div className="text-white font-mono text-sm">
              Roll: {(scrollProgress * 360).toFixed(0)}°
            </div>
          </div>
        </div>
      </main>
    </SmoothScrollWrapper>
  )
}
