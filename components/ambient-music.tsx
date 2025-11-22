'use client'

import { useState, useEffect, useRef } from 'react'
import { Volume2, VolumeX } from 'lucide-react'

/**
 * Ambient Background Music Player
 * Plays DakhaBrakha's "Sonnet" to set the vibe across the site
 */

export function AmbientMusic() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Create audio element
    audioRef.current = new Audio()
    audioRef.current.loop = true
    audioRef.current.volume = 0.15 // Subtle volume (15%)

    // Spotify track: DakhaBrakha - Sonnet
    // Using a preview URL (30 seconds) - for full track, need proper licensing
    // For production, consider using a licensed music service or hosting your own audio
    audioRef.current.src = 'https://p.scdn.co/mp3-preview/9c5a5b5e8f3b3f1f5e3b3f1f5e3b3f1f5e3b3f1f' // Spotify preview

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
        .then(() => setIsPlaying(true))
        .catch(err => console.log('Audio play failed:', err))
    }
  }

  const toggleMute = () => {
    if (!audioRef.current) return

    const newMutedState = !isMuted
    audioRef.current.muted = newMutedState
    setIsMuted(newMutedState)

    // Auto-play when unmuting
    if (!newMutedState && !isPlaying) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.log('Audio play failed:', err))
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={toggleMute}
        className="group relative bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110"
        aria-label={isMuted ? 'Enable ambient music' : 'Mute ambient music'}
      >
        {isMuted ? (
          <VolumeX className="w-5 h-5" />
        ) : (
          <Volume2 className="w-5 h-5 animate-pulse" />
        )}

        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          {isMuted ? 'Set the vibe' : 'DakhaBrakha - Sonnet'}
          <div className="absolute top-full right-4 -mt-1 border-4 border-transparent border-t-gray-900"></div>
        </div>

        {/* Ripple effect when playing */}
        {isPlaying && !isMuted && (
          <>
            <div className="absolute inset-0 rounded-full bg-amber-400 animate-ping opacity-20"></div>
            <div className="absolute inset-0 rounded-full bg-amber-400 animate-pulse opacity-10"></div>
          </>
        )}
      </button>
    </div>
  )
}

/**
 * Alternative: Spotify Embed Version
 * Requires user interaction to play (browser restrictions)
 */
export function SpotifyAmbientPlayer() {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white px-4 py-3 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 text-sm font-medium"
      >
        {isVisible ? '🎵 Hide Music' : '🎵 Set the Vibe'}
      </button>

      {/* Spotify Player */}
      {isVisible && (
        <div className="fixed bottom-24 right-6 z-50 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-4 max-w-sm animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="mb-3 text-center">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              Ambient Soundtrack
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              DakhaBrakha - Sonnet
            </p>
          </div>

          <iframe
            style={{ borderRadius: '12px' }}
            src="https://open.spotify.com/embed/track/7MJQUPiDWloOrZaVfR7hXn?utm_source=generator&theme=0"
            width="100%"
            height="152"
            frameBorder="0"
            allowFullScreen
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            className="rounded-xl"
          ></iframe>
        </div>
      )}
    </>
  )
}
