'use client'

import { useState, useEffect, useRef } from 'react'
import { Volume2, VolumeX } from 'lucide-react'

/**
 * Headless Ambient Music Player
 * Auto-starts in background, minimal UI, sets the vibe
 */

export function HeadlessAmbientMusic() {
  const [isEnabled, setIsEnabled] = useState(false)
  const [showPrompt, setShowPrompt] = useState(true)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Try to auto-start (will fail due to browser restrictions, but worth a try)
    const initAudio = () => {
      audioRef.current = new Audio()
      audioRef.current.loop = true
      audioRef.current.volume = 0.12 // Very subtle (12%)

      // You'll need to host the actual audio file
      // For now, using a placeholder - replace with your hosted DakhaBrakha track
      audioRef.current.src = '/audio/dakhabrakha-sonnet.mp3'

      // Try to autoplay (will likely fail on first load)
      audioRef.current.play()
        .then(() => {
          setIsEnabled(true)
          setShowPrompt(false)
        })
        .catch(() => {
          // Autoplay blocked - show subtle prompt
          setShowPrompt(true)
        })
    }

    // Delay slightly to improve autoplay chances
    const timer = setTimeout(initAudio, 500)

    return () => {
      clearTimeout(timer)
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  const enableMusic = () => {
    if (!audioRef.current) return

    audioRef.current.play()
      .then(() => {
        setIsEnabled(true)
        setShowPrompt(false)
      })
      .catch(err => console.log('Audio play failed:', err))
  }

  const toggleMute = () => {
    if (!audioRef.current) return

    if (isEnabled) {
      audioRef.current.pause()
      setIsEnabled(false)
    } else {
      audioRef.current.play()
        .then(() => setIsEnabled(true))
        .catch(err => console.log('Audio play failed:', err))
    }
  }

  return (
    <>
      {/* Initial subtle prompt - fades away after enabling */}
      {showPrompt && (
        <div
          className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-5 duration-1000"
          style={{ animationDelay: '2s' }}
        >
          <button
            onClick={enableMusic}
            className="group bg-gradient-to-r from-amber-900/90 to-orange-900/90 backdrop-blur-sm text-amber-100 px-6 py-3 rounded-full shadow-2xl hover:shadow-amber-500/20 transition-all duration-300 hover:scale-105 border border-amber-500/20"
          >
            <span className="flex items-center gap-2 text-sm font-medium">
              <Volume2 className="w-4 h-4 animate-pulse" />
              <span>Set the Vibe</span>
            </span>
          </button>
        </div>
      )}

      {/* Minimal control - bottom corner, only shows when music is active */}
      {isEnabled && (
        <button
          onClick={toggleMute}
          className="fixed bottom-6 right-6 z-40 bg-amber-900/20 backdrop-blur-sm text-amber-400 p-3 rounded-full opacity-30 hover:opacity-100 transition-all duration-300 group"
          aria-label="Toggle ambient music"
        >
          <Volume2 className="w-4 h-4 group-hover:animate-pulse" />

          {/* Subtle pulse when playing */}
          <div className="absolute inset-0 rounded-full bg-amber-400/20 animate-ping opacity-50"></div>
        </button>
      )}
    </>
  )
}

/**
 * Ultra-minimal version - no UI, just music
 * Shows only on hover
 */
export function InvisibleAmbientMusic() {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    audioRef.current = new Audio('/audio/dakhabrakha-sonnet.mp3')
    audioRef.current.loop = true
    audioRef.current.volume = 0.1

    // Try autoplay on any user interaction
    const tryPlay = () => {
      if (audioRef.current && !isPlaying) {
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(() => {})
      }
    }

    // Listen for first user interaction
    document.addEventListener('click', tryPlay, { once: true })
    document.addEventListener('scroll', tryPlay, { once: true })
    document.addEventListener('keydown', tryPlay, { once: true })

    return () => {
      document.removeEventListener('click', tryPlay)
      document.removeEventListener('scroll', tryPlay)
      document.removeEventListener('keydown', tryPlay)
      if (audioRef.current) {
        audioRef.current.pause()
      }
    }
  }, [isPlaying])

  const togglePlay = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => {})
    }
  }

  return (
    <button
      onClick={togglePlay}
      className="fixed bottom-6 right-6 z-40 p-2 rounded-full bg-amber-900/10 text-amber-600 opacity-0 hover:opacity-100 transition-all duration-500"
      aria-label="Toggle background music"
    >
      {isPlaying ? (
        <Volume2 className="w-4 h-4 animate-pulse" />
      ) : (
        <VolumeX className="w-4 h-4" />
      )}
    </button>
  )
}
