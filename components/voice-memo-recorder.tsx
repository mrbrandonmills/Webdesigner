'use client'

import { useState, useRef, useCallback } from 'react'
import type { UploadedAudio } from './upload-interface'

interface VoiceMemoRecorderProps {
  onAudioAdded: (audio: File) => void
  onAudioRemoved: () => void
  audio: UploadedAudio | null
  disabled?: boolean
}

export function VoiceMemoRecorder({
  onAudioAdded,
  onAudioRemoved,
  audio,
  disabled,
}: VoiceMemoRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        const file = new File([blob], `voice-memo-${Date.now()}.webm`, {
          type: 'audio/webm',
        })
        onAudioAdded(file)

        // Stop all tracks
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)

    } catch (error) {
      console.error('Error accessing microphone:', error)
      alert('Could not access microphone. Please check permissions.')
    }
  }, [onAudioAdded])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)

      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, [isRecording])

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('audio/')) {
        alert('Please select an audio file')
        return
      }
      onAudioAdded(file)
    }
  }, [onAudioAdded])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8">
      <div className="space-y-4 text-center">
        <div className="text-6xl">🎤</div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Voice Memo
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Record notes about the shoot or upload an audio file
          </p>
        </div>

        {!audio ? (
          <div className="space-y-3">
            {isRecording ? (
              <div className="space-y-3">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-sm font-mono text-gray-700 dark:text-gray-300">
                    Recording: {formatTime(recordingTime)}
                  </span>
                </div>
                <button
                  onClick={stopRecording}
                  disabled={disabled}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  Stop Recording
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={startRecording}
                  disabled={disabled}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  🎙️ Start Recording
                </button>

                <div className="text-gray-500 dark:text-gray-400">or</div>

                <label className="inline-block">
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleFileUpload}
                    disabled={disabled}
                    className="hidden"
                  />
                  <span className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors cursor-pointer inline-block">
                    📁 Upload Audio File
                  </span>
                </label>
              </>
            )}
          </div>
        ) : (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-2xl">🎵</div>
                <div className="text-left">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {audio.file.name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {(audio.file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  {audio.transcription && (
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                      ✓ Transcribed
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={onAudioRemoved}
                disabled={disabled}
                className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        <p className="text-xs text-gray-500 dark:text-gray-500">
          Supports: MP3, M4A, WAV, WebM (max 25MB)
        </p>
      </div>
    </div>
  )
}
