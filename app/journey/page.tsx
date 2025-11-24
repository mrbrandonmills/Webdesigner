'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { JourneyCanvas } from '@/components/journey/journey-canvas'
import { ProgressIndicator } from '@/components/journey/ui/progress-indicator'
import { StopIndicator } from '@/components/journey/ui/stop-indicator'
import { TransferModal } from '@/components/journey/ui/transfer-modal'
import { JOURNEY_STOPS } from '@/lib/types/journey'
import type { JourneyStop } from '@/lib/types/journey'

/**
 * Journey Page - Brandon Mills Life Journey
 * Museum-quality 3D navigation through Brandon's life and work
 */
export default function JourneyPage() {
  const router = useRouter()
  const [currentStopIndex, setCurrentStopIndex] = useState(0)
  const [currentStop, setCurrentStop] = useState<JourneyStop | null>(JOURNEY_STOPS[0])
  const [showStopIndicator, setShowStopIndicator] = useState(true)
  const [transferModalOpen, setTransferModalOpen] = useState(false)
  const [selectedTransferStop, setSelectedTransferStop] = useState<JourneyStop | null>(null)

  // Update current stop when index changes
  useEffect(() => {
    const stop = JOURNEY_STOPS[currentStopIndex]
    setCurrentStop(stop)
    setShowStopIndicator(true)

    // Hide stop indicator after 3 seconds
    const timer = setTimeout(() => {
      setShowStopIndicator(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [currentStopIndex])

  // Handle reaching a stop
  const handleStopReached = (stopId: string, index: number) => {
    setCurrentStopIndex(index)
  }

  // Handle marker click
  const handleMarkerClick = (stopId: string) => {
    const stop = JOURNEY_STOPS.find((s) => s.id === stopId)
    if (!stop) return

    if (stop.type === 'TRANSFER') {
      // Open transfer modal
      setSelectedTransferStop(stop)
      setTransferModalOpen(true)
    } else {
      // Navigate directly to final destination
      router.push(stop.href)
    }
  }

  // Handle entering sub-journey
  const handleEnterSubJourney = (subLineId: string) => {
    if (!selectedTransferStop) return

    // Navigate to sub-journey (you can customize these routes)
    router.push(`${selectedTransferStop.href}/${subLineId}`)
  }

  // Handle continuing journey
  const handleContinueJourney = () => {
    // Scroll to next stop
    const nextIndex = Math.min(currentStopIndex + 1, JOURNEY_STOPS.length - 1)
    setCurrentStopIndex(nextIndex)

    // Calculate scroll position
    const stop = JOURNEY_STOPS[nextIndex]
    const scrollDistance = Math.abs(stop.position.z) * 2
    window.scrollTo({
      top: scrollDistance,
      behavior: 'smooth'
    })
  }

  // Handle progress indicator click
  const handleProgressClick = (index: number) => {
    setCurrentStopIndex(index)

    // Calculate and scroll to position
    const stop = JOURNEY_STOPS[index]
    const scrollDistance = Math.abs(stop.position.z) * 2
    window.scrollTo({
      top: scrollDistance,
      behavior: 'smooth'
    })
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Three.js Canvas */}
      <div className="absolute inset-0">
        <JourneyCanvas
          onStopReached={handleStopReached}
          onMarkerClick={handleMarkerClick}
        />
      </div>

      {/* UI Overlays */}
      <StopIndicator stop={currentStop} isVisible={showStopIndicator} />
      <ProgressIndicator
        currentStopIndex={currentStopIndex}
        onStopClick={handleProgressClick}
      />

      {/* Transfer Modal */}
      <TransferModal
        stop={selectedTransferStop}
        isOpen={transferModalOpen}
        onClose={() => setTransferModalOpen(false)}
        onEnter={handleEnterSubJourney}
        onContinue={handleContinueJourney}
      />

      {/* Instructions (fade out after 5s) */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-30 animate-fade-out">
        <div className="px-6 py-3 bg-black/50 backdrop-blur-sm border border-white/10 rounded-full text-white/60 text-sm">
          Scroll to begin your journey
        </div>
      </div>

      {/* Scroll container for GSAP ScrollTrigger */}
      <div
        style={{
          height: '600vh', // Extend page height for scroll
          pointerEvents: 'none'
        }}
      />
    </div>
  )
}
