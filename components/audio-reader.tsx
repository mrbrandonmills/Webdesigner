'use client'

import { useState, useRef, useEffect } from 'react'
import { Play, Pause, Volume2, VolumeX, User } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface AudioReaderProps {
  contentId: string
  title: string
  textContent: string
  voicePreference?: 'male' | 'female' | 'male-indian' | 'female-indian'
  showVoiceSelector?: boolean
  contentType?: 'article' | 'poem' | 'essay' | 'research' | 'book'
}

export function AudioReader({ contentId, title, textContent, voicePreference = 'male', showVoiceSelector = true, contentType = 'article' }: AudioReaderProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [selectedVoice, setSelectedVoice] = useState<'male' | 'female' | 'male-indian' | 'female-indian'>(voicePreference)
  const [justGenerated, setJustGenerated] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const audioRef = useRef<HTMLAudioElement>(null)

  // Check if audio already exists in cache
  useEffect(() => {
    // Stop current playback when voice changes
    if (isPlaying) {
      const audio = audioRef.current
      if (audio) {
        audio.pause()
        setIsPlaying(false)
      }
    }

    // Revoke previous blob URL if it exists
    if (audioUrl && audioUrl.startsWith('blob:')) {
      URL.revokeObjectURL(audioUrl)
    }

    // Clear ALL old cached audio (blob URLs and old base64 data URLs)
    // Blob URLs are session-specific and invalid after refresh
    // Base64 data URLs are from old implementation and don't work with CSP
    const cachedUrl = localStorage.getItem(`audio-${contentId}-${selectedVoice}`)

    if (cachedUrl) {
      console.log('Clearing old cached audio format:', cachedUrl.substring(0, 30) + '...')
      localStorage.removeItem(`audio-${contentId}-${selectedVoice}`)
    }

    // Always start fresh - we'll load from blob storage or generate on-demand
    setAudioUrl(null)

    // Cleanup function to revoke blob URLs
    return () => {
      if (audioUrl && audioUrl.startsWith('blob:')) {
        URL.revokeObjectURL(audioUrl)
      }
    }
  }, [contentId, selectedVoice])

  // Update time as audio plays
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    // CRITICAL: Ensure volume is set to maximum and audio is unmuted
    audio.volume = 1.0
    audio.muted = false
    console.log('Audio initialized - Volume:', audio.volume, 'Muted:', audio.muted)

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => {
      console.log('Audio duration loaded:', audio.duration)
      setDuration(audio.duration)
    }
    const handleEnded = () => setIsPlaying(false)
    const handleError = (e: Event) => {
      console.error('Audio error:', e)
      const audioElement = e.target as HTMLAudioElement
      if (audioElement.error) {
        console.error('Audio error code:', audioElement.error.code)
        console.error('Audio error message:', audioElement.error.message)
      }
    }
    const handleCanPlay = () => {
      console.log('Audio can play - ready to start')
      console.log('Volume at canPlay:', audio.volume, 'Muted:', audio.muted)
    }

    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('loadedmetadata', updateDuration)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('error', handleError)
    audio.addEventListener('canplay', handleCanPlay)

    // Log audio element properties
    console.log('Audio element src:', audio.src.substring(0, 100) + '...')
    console.log('Audio element readyState:', audio.readyState)
    console.log('Audio element networkState:', audio.networkState)

    return () => {
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('loadedmetadata', updateDuration)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('error', handleError)
      audio.removeEventListener('canplay', handleCanPlay)
    }
  }, [audioUrl])

  // Auto-play after audio generation completes (not when loading from cache)
  useEffect(() => {
    if (audioUrl && !isGenerating && justGenerated) {
      const audio = audioRef.current
      if (audio) {
        // Small delay to ensure audio element is ready
        setTimeout(() => {
          audio.play()
            .then(() => {
              setIsPlaying(true)
              setJustGenerated(false) // Reset flag
            })
            .catch(err => {
              console.error('Auto-play failed:', err)
              setJustGenerated(false) // Reset flag even on error
              // Some browsers block auto-play, that's okay
            })
        }, 100)
      }
    }
  }, [audioUrl, isGenerating, justGenerated])

  const loadAudio = async () => {
    setIsGenerating(true)

    try {
      // First, try to get pre-generated audio
      console.log('Checking for pre-generated audio...')
      const preGenResponse = await fetch(
        `/api/get-poem-audio?contentId=${contentId}&voice=${selectedVoice}`
      )

      if (preGenResponse.ok) {
        const data = await preGenResponse.json()

        if (data.audioUrl && data.preGenerated) {
          console.log('Using pre-generated audio from blob storage')
          setAudioUrl(data.audioUrl)
          // Don't auto-play pre-generated audio
          setJustGenerated(false)
          setIsGenerating(false)
          return
        }
      }

      // Fall back to on-demand generation
      console.log('No pre-generated audio found, generating on-demand...')
      await generateAudioOnDemand()
    } catch (error) {
      console.error('Failed to load audio:', error)
      const errorMsg = error instanceof Error
        ? `❌ GENERATION ERROR: ${error.message}`
        : `❌ GENERATION ERROR: ${String(error)}`
      setErrorMessage(errorMsg)
      setIsGenerating(false)
    }
  }

  const generateAudioOnDemand = async () => {
    try {
      const response = await fetch('/api/text-to-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contentId,
          text: textContent,
          voice: selectedVoice,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate audio')
      }

      // Get the audio as a blob
      const audioBlob = await response.blob()
      console.log('Received audio blob:', audioBlob.size, 'bytes', audioBlob.type)

      // Create a blob URL for the audio
      const blobUrl = URL.createObjectURL(audioBlob)
      console.log('Created blob URL:', blobUrl)

      setAudioUrl(blobUrl)
      setJustGenerated(true) // Mark that we just generated audio (for auto-play)

      // Don't store in localStorage - blob URLs are session-specific and invalid after refresh
      // Later we'll use pre-generated audio from Vercel Blob Storage for instant loading
    } catch (error) {
      console.error('Failed to generate audio:', error)
      throw error
    } finally {
      setIsGenerating(false)
    }
  }

  const togglePlay = () => {
    if (!audioUrl) {
      loadAudio()
      return
    }

    const audio = audioRef.current
    if (!audio) {
      console.error('Audio element not found')
      setErrorMessage('Audio element not found')
      return
    }

    console.log('Toggle play - current state:', isPlaying)
    console.log('Audio paused:', audio.paused)
    console.log('Audio volume:', audio.volume)
    console.log('Audio muted:', audio.muted)
    console.log('Audio src:', audio.src.substring(0, 100) + '...')
    console.log('Audio readyState:', audio.readyState)
    console.log('Audio currentTime:', audio.currentTime)

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      // Clear any previous errors
      setErrorMessage(null)

      // Ensure volume is set before playing
      audio.volume = 1.0
      audio.muted = false
      console.log('Playing with volume:', audio.volume, 'muted:', audio.muted)

      audio.play()
        .then(() => {
          console.log('Play started successfully')
          console.log('After play - volume:', audio.volume, 'muted:', audio.muted, 'currentTime:', audio.currentTime)
          setIsPlaying(true)
          setErrorMessage(null)
        })
        .catch(err => {
          console.error('Play failed:', err)
          const errorMsg = `❌ PLAYBACK ERROR: ${err.name} - ${err.message}`
          setErrorMessage(errorMsg)
          console.error('Full error:', err)
        })
    }
  }

  const toggleMute = () => {
    const audio = audioRef.current
    if (audio) {
      audio.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current
    if (audio) {
      const time = parseFloat(e.target.value)
      audio.currentTime = time
      setCurrentTime(time)
    }
  }

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="bg-gradient-to-br from-accent-gold/10 to-transparent border border-accent-gold/20 rounded-2xl p-6 backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-accent-gold/20 border border-accent-gold/30 flex items-center justify-center">
            <Volume2 size={24} className="text-accent-gold" />
          </div>
          <div>
            <h3 className="text-white font-light text-lg">
              Listen to {contentType === 'poem' ? 'Poem' : contentType === 'essay' ? 'Essay' : contentType === 'research' ? 'Paper' : contentType === 'book' ? 'Book' : 'Article'}
            </h3>
            <p className="text-white/50 text-sm">{title}</p>
          </div>
        </div>

        {/* Voice Selection */}
        {showVoiceSelector && (
          <div className="flex items-center gap-2 bg-black/30 rounded-xl p-1">
            <button
              onClick={() => setSelectedVoice('male')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedVoice === 'male'
                  ? 'bg-accent-gold text-black'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              British Male
            </button>
            <button
              onClick={() => setSelectedVoice('female')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedVoice === 'female'
                  ? 'bg-accent-gold text-black'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              British Female
            </button>
            <button
              onClick={() => setSelectedVoice('male-indian')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedVoice === 'male-indian'
                  ? 'bg-accent-gold text-black'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Indian Male
            </button>
            <button
              onClick={() => setSelectedVoice('female-indian')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedVoice === 'female-indian'
                  ? 'bg-accent-gold text-black'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Indian Female
            </button>
          </div>
        )}
      </div>

      {/* Player Controls */}
      <div className="space-y-4">
        {/* Progress Bar */}
        {audioUrl && duration > 0 && (
          <div className="space-y-2">
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={seek}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none
                [&::-webkit-slider-thumb]:w-4
                [&::-webkit-slider-thumb]:h-4
                [&::-webkit-slider-thumb]:rounded-full
                [&::-webkit-slider-thumb]:bg-accent-gold
                [&::-webkit-slider-thumb]:cursor-pointer
                [&::-moz-range-thumb]:w-4
                [&::-moz-range-thumb]:h-4
                [&::-moz-range-thumb]:rounded-full
                [&::-moz-range-thumb]:bg-accent-gold
                [&::-moz-range-thumb]:border-0
                [&::-moz-range-thumb]:cursor-pointer"
              style={{
                background: `linear-gradient(to right, rgb(212, 175, 55) 0%, rgb(212, 175, 55) ${(currentTime / duration) * 100}%, rgba(255,255,255,0.1) ${(currentTime / duration) * 100}%, rgba(255,255,255,0.1) 100%)`,
              }}
            />
            <div className="flex justify-between text-xs text-white/50">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        )}

        {/* Control Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Play/Pause */}
            <button
              onClick={togglePlay}
              disabled={isGenerating}
              className="w-14 h-14 rounded-full bg-accent-gold hover:bg-accent-hover text-black flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <div className="w-6 h-6 border-3 border-black border-t-transparent rounded-full animate-spin" />
              ) : isPlaying ? (
                <Pause size={24} fill="currentColor" />
              ) : (
                <Play size={24} fill="currentColor" className="ml-1" />
              )}
            </button>

            {/* Mute */}
            {audioUrl && (
              <button
                onClick={toggleMute}
                className="p-3 hover:bg-white/10 rounded-full transition-colors"
              >
                {isMuted ? (
                  <VolumeX size={20} className="text-white/70" />
                ) : (
                  <Volume2 size={20} className="text-white/70" />
                )}
              </button>
            )}
          </div>

          {/* Status or Error */}
          {errorMessage ? (
            <div className="text-sm font-mono text-red-400 bg-red-500/10 border border-red-500/30 rounded px-3 py-2 max-w-md">
              {errorMessage}
            </div>
          ) : (
            <div className="text-sm text-white/60">
              {isGenerating && 'Generating audio...'}
              {!audioUrl && !isGenerating && 'Click play to generate'}
              {audioUrl && !isPlaying && !isGenerating && 'Ready to play'}
              {isPlaying && 'Now playing'}
            </div>
          )}
        </div>
      </div>

      {/* Error Details (if any) */}
      {errorMessage && (
        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
          <p className="text-red-400 font-medium mb-2">🔍 Debugging Info:</p>
          <div className="text-xs font-mono text-white/70 space-y-1">
            <div>Audio URL: {audioUrl ? audioUrl.substring(0, 50) + '...' : 'null'}</div>
            <div>Audio Element: {audioRef.current ? 'Found' : 'Missing'}</div>
            <div>Volume: {audioRef.current?.volume ?? 'N/A'}</div>
            <div>Muted: {audioRef.current?.muted ? 'Yes' : 'No'}</div>
            <div>ReadyState: {audioRef.current?.readyState ?? 'N/A'}</div>
          </div>
        </div>
      )}

      {/* Hidden Audio Element */}
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          className="hidden"
          preload="auto"
          onLoadedData={() => console.log('Audio data loaded')}
          onLoadedMetadata={() => console.log('Audio metadata loaded')}
        />
      )}

      {/* Info */}
      <div className="mt-6 pt-6 border-t border-white/10">
        <p className="text-white/40 text-xs leading-relaxed">
          Premium HD voice narration • Perfect for listening while commuting, exercising, or relaxing •
          Audio generated on-demand and cached for instant playback
        </p>
      </div>
    </div>
  )
}
