'use client'

import { useState, useEffect, useRef } from 'react'
import { Volume2, VolumeX, Play, Pause, GripVertical } from 'lucide-react'
import { motion } from 'framer-motion'

/**
 * Dynamic Island Music Player
 * iPhone-style expandable music control with drag functionality
 *
 * FEATURES:
 * - Draggable anywhere on screen (touch + mouse)
 * - Pause/play audio control
 * - Expandable detail view
 * - Smooth animations with Framer Motion
 */

export function DynamicIslandMusic() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [showInitialPrompt, setShowInitialPrompt] = useState(true)
  const [isDragging, setIsDragging] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Handle SSR - only render on client
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio('/audio/dakhabrakha-sonnet.mp3')
    audioRef.current.loop = true
    audioRef.current.volume = 0.15 // Subtle background volume

    // Sync state with audio element events
    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)

    audioRef.current.addEventListener('play', handlePlay)
    audioRef.current.addEventListener('pause', handlePause)

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('play', handlePlay)
        audioRef.current.removeEventListener('pause', handlePause)
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  const togglePlay = async (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation()
    }

    if (!audioRef.current) return

    try {
      if (audioRef.current.paused) {
        await audioRef.current.play()
        setIsPlaying(true)
        setShowInitialPrompt(false)
      } else {
        audioRef.current.pause()
        setIsPlaying(false)
      }
    } catch (err) {
      console.log('Audio toggle failed:', err)
    }
  }

  const handleIslandClick = () => {
    // Don't toggle if user was dragging
    if (isDragging) return

    if (showInitialPrompt) {
      // First click - start playing
      togglePlay()
    } else {
      // Subsequent clicks - toggle expansion
      setIsExpanded(!isExpanded)
    }
  }

  // Don't render on server (SSR) - window is not available
  if (!isMounted) return null

  // Safe window access - only runs on client after mount guard
  const dragConstraints = typeof window !== 'undefined' ? {
    top: 0,
    left: -window.innerWidth / 2 + (isExpanded ? 160 : 80),
    right: window.innerWidth / 2 - (isExpanded ? 160 : 80),
    bottom: window.innerHeight - (isExpanded ? 128 : 48) - 24,
  } : { top: 0, left: 0, right: 0, bottom: 0 }

  return (
    <>
      {/* Dynamic Island - Draggable */}
      <motion.div
        drag
        dragMomentum={false}
        dragElastic={0.1}
        dragConstraints={dragConstraints}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => {
          // Small delay to prevent click event after drag
          setTimeout(() => setIsDragging(false), 100)
        }}
        initial={{ x: '-50%', y: 24 }}
        className={`fixed left-1/2 z-50 transition-all duration-500 ease-out ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        } ${isExpanded ? 'w-80 h-32 rounded-3xl' : 'w-40 h-12 rounded-full'}`}
        style={{
          background: 'linear-gradient(145deg, rgba(0, 0, 0, 0.95), rgba(20, 20, 20, 0.98))',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          touchAction: 'none', // Prevent default touch behaviors
        }}
        onClick={handleIslandClick}
        whileHover={{ scale: isDragging ? 1 : 1.02 }}
        whileTap={{ scale: isDragging ? 1 : 0.98 }}
      >
        {/* Collapsed State */}
        {!isExpanded && (
          <div className="h-full flex items-center justify-center gap-3 px-4 pointer-events-none">
            {/* Drag Handle Indicator */}
            <div className="text-gray-500 opacity-40">
              <GripVertical className="w-3 h-3" />
            </div>

            {/* Waveform Animation */}
            {isPlaying && (
              <div className="flex items-center gap-1 h-5">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-gradient-to-t from-amber-500 to-orange-400 rounded-full animate-pulse"
                    style={{
                      height: `${Math.random() * 100}%`,
                      animationDelay: `${i * 0.15}s`,
                      animationDuration: '0.6s',
                    }}
                  />
                ))}
              </div>
            )}

            {/* Text */}
            <span className="text-white text-xs font-medium tracking-wide">
              {showInitialPrompt ? 'Set the Vibe' : isPlaying ? 'Now Playing' : 'Paused'}
            </span>

            {/* Icon */}
            {!showInitialPrompt && (
              <div className="text-amber-400">
                {isPlaying ? (
                  <Volume2 className="w-4 h-4" />
                ) : (
                  <VolumeX className="w-4 h-4 opacity-50" />
                )}
              </div>
            )}
          </div>
        )}

        {/* Expanded State */}
        {isExpanded && (
          <div className="h-full p-6 flex flex-col justify-between pointer-events-none">
            {/* Drag Handle at Top */}
            <div className="flex items-center justify-center mb-2">
              <div className="text-gray-500 opacity-40">
                <GripVertical className="w-4 h-4" />
              </div>
            </div>

            {/* Song Info */}
            <div className="text-center -mt-4">
              <p className="text-white text-sm font-semibold mb-1">DakhaBrakha</p>
              <p className="text-gray-400 text-xs">Sonnet - Pluribus Edit</p>
            </div>

            {/* Waveform Visualization */}
            <div className="flex items-center justify-center gap-1 h-10">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className={`w-1.5 bg-gradient-to-t rounded-full transition-all duration-300 ${
                    isPlaying
                      ? 'from-amber-500 via-orange-400 to-amber-500 animate-pulse'
                      : 'from-gray-600 to-gray-700'
                  }`}
                  style={{
                    height: isPlaying ? `${20 + Math.random() * 80}%` : '30%',
                    animationDelay: `${i * 0.1}s`,
                    animationDuration: '0.8s',
                  }}
                />
              ))}
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-8">
              <button
                onClick={togglePlay}
                className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center hover:scale-110 transition-transform shadow-lg pointer-events-auto"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 text-white fill-white" />
                ) : (
                  <Play className="w-5 h-5 text-white fill-white" />
                )}
              </button>
            </div>
          </div>
        )}

        {/* Subtle glow when playing */}
        {isPlaying && (
          <div
            className="absolute inset-0 rounded-full opacity-30 animate-pulse pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(251, 191, 36, 0.3) 0%, transparent 70%)',
              filter: 'blur(20px)',
            }}
          />
        )}
      </motion.div>

      {/* Tap outside to collapse */}
      {isExpanded && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsExpanded(false)}
        />
      )}
    </>
  )
}
