'use client'

import { useState, useRef, useEffect } from 'react'
import { Play, Pause, Volume2, VolumeX, User } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface AudioReaderProps {
  contentId: string
  title: string
  textContent: string
  voicePreference?: 'male' | 'female'
}

export function AudioReader({ contentId, title, textContent, voicePreference = 'male' }: AudioReaderProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [selectedVoice, setSelectedVoice] = useState<'male' | 'female'>(voicePreference)

  const audioRef = useRef<HTMLAudioElement>(null)

  // Check if audio already exists in cache
  useEffect(() => {
    const cachedUrl = localStorage.getItem(`audio-${contentId}-${selectedVoice}`)
    if (cachedUrl) {
      setAudioUrl(cachedUrl)
    }
  }, [contentId, selectedVoice])

  // Update time as audio plays
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => setDuration(audio.duration)
    const handleEnded = () => setIsPlaying(false)

    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('loadedmetadata', updateDuration)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('loadedmetadata', updateDuration)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [audioUrl])

  const generateAudio = async () => {
    setIsGenerating(true)

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

      const data = await response.json()

      if (data.audioUrl) {
        setAudioUrl(data.audioUrl)
        localStorage.setItem(`audio-${contentId}-${selectedVoice}`, data.audioUrl)
      }
    } catch (error) {
      console.error('Failed to generate audio:', error)
      alert('Failed to generate audio. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const togglePlay = () => {
    if (!audioUrl) {
      generateAudio()
      return
    }

    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    setIsPlaying(!isPlaying)
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
            <h3 className="text-white font-light text-lg">Listen to Article</h3>
            <p className="text-white/50 text-sm">{title}</p>
          </div>
        </div>

        {/* Voice Selection */}
        <div className="flex items-center gap-2 bg-black/30 rounded-full p-1">
          <button
            onClick={() => setSelectedVoice('male')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedVoice === 'male'
                ? 'bg-accent-gold text-black'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Male
          </button>
          <button
            onClick={() => setSelectedVoice('female')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedVoice === 'female'
                ? 'bg-accent-gold text-black'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Female
          </button>
        </div>
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

          {/* Status */}
          <div className="text-sm text-white/60">
            {isGenerating && 'Generating audio...'}
            {!audioUrl && !isGenerating && 'Click play to generate'}
            {audioUrl && !isPlaying && !isGenerating && 'Ready to play'}
            {isPlaying && 'Now playing'}
          </div>
        </div>
      </div>

      {/* Hidden Audio Element */}
      {audioUrl && (
        <audio ref={audioRef} src={audioUrl} className="hidden" />
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
