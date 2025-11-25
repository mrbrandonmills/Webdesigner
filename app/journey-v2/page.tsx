/**
 * Journey V2 Test Page
 * Preview new GSAP-based journey system before replacing main route
 */

'use client'

import { useState, useEffect } from 'react'
import { JourneyCanvasV2 } from '@/components/journey/journey-canvas-v2'
import { JOURNEY_STOPS } from '@/lib/types/journey'

export default function JourneyV2TestPage() {
  const [currentStop, setCurrentStop] = useState<{ id: string; index: number } | null>(null)
  const [fps, setFps] = useState(60)
  const [debug, setDebug] = useState(false)

  // FPS monitoring
  useEffect(() => {
    let frameCount = 0
    let lastTime = performance.now()

    const measureFPS = () => {
      frameCount++
      const currentTime = performance.now()
      const delta = currentTime - lastTime

      if (delta >= 1000) {
        setFps(Math.round((frameCount * 1000) / delta))
        frameCount = 0
        lastTime = currentTime
      }

      requestAnimationFrame(measureFPS)
    }

    const rafId = requestAnimationFrame(measureFPS)
    return () => cancelAnimationFrame(rafId)
  }, [])

  const handleStopReached = (stopId: string, index: number) => {
    setCurrentStop({ id: stopId, index })
  }

  const currentStopData = currentStop
    ? JOURNEY_STOPS.find(s => s.id === currentStop.id)
    : null

  return (
    <main className="relative">
      {/* Journey container for ScrollTrigger */}
      <div className="journey-container relative">
        {/* Canvas */}
        <JourneyCanvasV2
          onStopReached={handleStopReached}
          quality="high"
          debug={debug}
        />

        {/* Scroll content - creates scroll height */}
        <div className="relative z-10 pointer-events-none">
          {/* Spacer for scroll */}
          <div className="h-[800vh]" />
        </div>

        {/* UI Overlay */}
        <div className="fixed top-0 left-0 w-full z-20 pointer-events-none">
          {/* Header */}
          <div className="flex items-center justify-between p-6">
            <div className="text-white">
              <h1 className="text-2xl font-bold tracking-wider">
                JOURNEY V2 TEST
              </h1>
              <p className="text-sm text-white/60 mt-1">
                GSAP-based 3D navigation system
              </p>
            </div>

            {/* FPS Counter */}
            <div className="bg-black/80 backdrop-blur-sm px-4 py-2 rounded-lg">
              <div className="text-white font-mono text-sm">
                {fps} <span className="text-white/60">FPS</span>
              </div>
            </div>
          </div>

          {/* Current Stop Info */}
          {currentStopData && (
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2">
              <div className="bg-black/90 backdrop-blur-md px-8 py-4 rounded-full border border-white/20">
                <div className="text-center">
                  <div
                    className="text-sm font-medium tracking-wider mb-1"
                    style={{ color: currentStopData.color }}
                  >
                    {currentStopData.name}
                  </div>
                  <div className="text-xs text-white/60">
                    {currentStopData.description}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Progress indicator */}
          <div className="fixed right-8 top-1/2 -translate-y-1/2">
            <div className="flex flex-col gap-3">
              {JOURNEY_STOPS.map((stop, i) => (
                <button
                  key={stop.id}
                  className={`
                    w-3 h-3 rounded-full transition-all duration-300
                    ${currentStop?.index === i ? 'scale-150' : 'scale-100'}
                  `}
                  style={{
                    backgroundColor: currentStop?.index === i ? stop.color : '#333',
                    opacity: currentStop?.index === i ? 1 : 0.5
                  }}
                  title={stop.name}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="fixed bottom-8 right-8 z-20 pointer-events-none">
          <div className="bg-black/80 backdrop-blur-sm px-6 py-4 rounded-lg text-white text-sm max-w-xs">
            <div className="font-bold mb-2">Instructions</div>
            <div className="text-white/80 space-y-1 text-xs">
              <div>• Scroll to navigate through the journey</div>
              <div>• 8 stops from WORK to CONTACT</div>
              <div>• Camera moves smoothly with GSAP</div>
              <div>• Target: 60 FPS</div>
            </div>
          </div>
        </div>

        {/* Debug toggle */}
        <button
          onClick={() => setDebug(!debug)}
          className="fixed top-8 right-8 z-20 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-mono pointer-events-auto transition-colors"
        >
          Debug: {debug ? 'ON' : 'OFF'}
        </button>
      </div>

      {/* Quality metrics */}
      <div className="fixed bottom-8 left-8 z-20 pointer-events-none">
        <div className="bg-black/80 backdrop-blur-sm px-6 py-4 rounded-lg text-white text-sm">
          <div className="font-bold mb-2">Quality Metrics</div>
          <div className="space-y-1 text-xs font-mono">
            <div className="flex justify-between gap-4">
              <span className="text-white/60">FPS:</span>
              <span className={fps >= 55 ? 'text-green-400' : fps >= 30 ? 'text-yellow-400' : 'text-red-400'}>
                {fps}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-white/60">Quality:</span>
              <span className="text-blue-400">High</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-white/60">Stops:</span>
              <span className="text-white">8</span>
            </div>
            {currentStop && (
              <div className="flex justify-between gap-4">
                <span className="text-white/60">Current:</span>
                <span className="text-white">{currentStop.index + 1}/8</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
