'use client'

import { useState, useEffect, useRef } from 'react'
import { Volume2, VolumeX, Play, Pause } from 'lucide-react'

/**
 * Dynamic Island Music Player
 * iPhone-style expandable music control at top of screen
 */

export function DynamicIslandMusic() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [showInitialPrompt, setShowInitialPrompt] = useState(true)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    audioRef.current = new Audio('/audio/dakhabrakha-sonnet.mp3')
    audioRef.current.loop = true
    audioRef.current.volume = 0.15 // Subtle background volume

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  const togglePlay = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true)
          setShowInitialPrompt(false)
        })
        .catch(err => console.log('Audio play failed:', err))
    }
  }

  const handleIslandClick = () => {
    if (showInitialPrompt) {
      // First click - start playing
      togglePlay()
    } else {
      // Subsequent clicks - toggle expansion
      setIsExpanded(!isExpanded)
    }
  }

  return (
    <>
      {/* Dynamic Island */}
      <div
        className={`fixed left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-out cursor-pointer ${
          isExpanded
            ? 'top-4 w-80 h-32 rounded-3xl'
            : 'top-6 w-40 h-12 rounded-full'
        }`}
        style={{
          background: 'linear-gradient(145deg, rgba(0, 0, 0, 0.95), rgba(20, 20, 20, 0.98))',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        }}
        onClick={handleIslandClick}
      >
        {/* Collapsed State */}
        {!isExpanded && (
          <div className="h-full flex items-center justify-center gap-3 px-4">
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
          <div className="h-full p-6 flex flex-col justify-between">
            {/* Song Info */}
            <div className="text-center">
              <p className="text-white text-sm font-semibold mb-1">DakhaBrakha</p>
              <p className="text-gray-400 text-xs">Sonnet - Pluribus Edit</p>
            </div>

            {/* Waveform Visualization */}
            <div className="flex items-center justify-center gap-1 h-12">
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
                onClick={(e) => {
                  e.stopPropagation()
                  togglePlay()
                }}
                className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
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
            className="absolute inset-0 rounded-full opacity-30 animate-pulse"
            style={{
              background: 'radial-gradient(circle, rgba(251, 191, 36, 0.3) 0%, transparent 70%)',
              filter: 'blur(20px)',
            }}
          />
        )}
      </div>

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
