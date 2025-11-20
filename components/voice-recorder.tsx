'use client'

import { useState, useRef, useEffect } from 'react'
import { Mic, Square, Play, Pause, Trash2 } from 'lucide-react'
import { clientLogger } from '@/lib/client-logger'

interface VoiceRecorderProps {
  onRecordingComplete?: (audioBlob: Blob, duration: number) => void
}

export default function VoiceRecorder({ onRecordingComplete }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [duration, setDuration] = useState(0)
  const [audioURL, setAudioURL] = useState<string | null>(null)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      if (audioURL) {
        URL.revokeObjectURL(audioURL)
      }
    }
  }, [audioURL])

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
      })

      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        setAudioBlob(blob)
        const url = URL.createObjectURL(blob)
        setAudioURL(url)

        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop())

        if (onRecordingComplete) {
          onRecordingComplete(blob, duration)
        }
      }

      mediaRecorder.start(1000) // Capture data every second
      setIsRecording(true)
      setIsPaused(false)
      setDuration(0)

      // Start timer
      timerRef.current = setInterval(() => {
        setDuration((prev) => prev + 1)
      }, 1000)
    } catch (error) {
      clientLogger.error('Error starting recording:', error)
      alert('Could not access microphone. Please grant permission.')
    }
  }

  const pauseRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause()
      setIsPaused(true)
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }

  const resumeRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume()
      setIsPaused(false)
      timerRef.current = setInterval(() => {
        setDuration((prev) => prev + 1)
      }, 1000)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      setIsPaused(false)
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }

  const deleteRecording = () => {
    if (confirm('Delete this recording?')) {
      setAudioBlob(null)
      if (audioURL) {
        URL.revokeObjectURL(audioURL)
      }
      setAudioURL(null)
      setDuration(0)
    }
  }

  const restartRecording = () => {
    deleteRecording()
    startRecording()
  }

  return (
    <div className="space-y-6">
      {/* Recording Controls */}
      {!audioBlob && (
        <div className="text-center py-12">
          {!isRecording ? (
            <button
              onClick={startRecording}
              className="w-32 h-32 rounded-full bg-accent-gold hover:bg-accent-hover flex items-center justify-center transition-all shadow-lg hover:shadow-xl"
            >
              <Mic size={48} className="text-black" />
            </button>
          ) : (
            <div className="space-y-6">
              <button
                onClick={stopRecording}
                className="w-32 h-32 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-all shadow-lg hover:shadow-xl animate-pulse"
              >
                <Square size={48} className="text-white" />
              </button>

              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={isPaused ? resumeRecording : pauseRecording}
                  className="px-6 py-3 bg-white/10 border border-white/20 hover:bg-white/20 transition-colors rounded"
                >
                  {isPaused ? (
                    <>
                      <Play size={20} className="inline mr-2" />
                      Resume
                    </>
                  ) : (
                    <>
                      <Pause size={20} className="inline mr-2" />
                      Pause
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          <div className="mt-6 space-y-2">
            <p className="text-lg">
              {!isRecording && 'Click to start recording your essay'}
              {isRecording && !isPaused && 'Recording... Click square to stop'}
              {isPaused && 'Paused - Click Resume to continue'}
            </p>
            <p className="text-3xl font-mono text-accent-gold">{formatTime(duration)}</p>
          </div>
        </div>
      )}

      {/* Playback Controls */}
      {audioBlob && audioURL && (
        <div className="bg-white/5 border border-white/10 rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-medium mb-1">Recording Complete</p>
              <p className="text-sm text-white/60">Duration: {formatTime(duration)}</p>
            </div>
            <button
              onClick={deleteRecording}
              className="p-2 hover:bg-red-500/20 border border-white/10 hover:border-red-500 transition-colors rounded"
              title="Delete recording"
            >
              <Trash2 size={20} className="text-red-400" />
            </button>
          </div>

          {/* Audio Player */}
          <audio
            src={audioURL}
            controls
            className="w-full"
            style={{
              backgroundColor: 'transparent',
              borderRadius: '4px',
            }}
          />

          <div className="flex gap-4">
            <button
              onClick={restartRecording}
              className="flex-1 px-4 py-3 bg-white/10 border border-white/20 hover:bg-white/20 transition-colors rounded tracking-wider uppercase text-sm"
            >
              Record Again
            </button>
          </div>
        </div>
      )}

      {/* Info */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-sm text-blue-300">
        <p className="font-medium mb-2">💡 Tips for best results:</p>
        <ul className="space-y-1 text-blue-200/80">
          <li>• Speak clearly and at a natural pace</li>
          <li>• Minimize background noise</li>
          <li>• Pause for a moment between major sections</li>
          <li>• You can pause and resume as needed</li>
        </ul>
      </div>
    </div>
  )
}
