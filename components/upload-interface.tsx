'use client'

import { useState } from 'react'
import { PhotoUploader } from './photo-uploader'
import { VoiceMemoRecorder } from './voice-memo-recorder'
import { UploadedFilesPreview } from './uploaded-files-preview'

export interface UploadedPhoto {
  id: string
  file: File
  preview: string
  url?: string
  optimizedUrl?: string
}

export interface UploadedAudio {
  id: string
  file: File
  url?: string
  transcription?: string
}

export function UploadInterface() {
  const [photos, setPhotos] = useState<UploadedPhoto[]>([])
  const [audio, setAudio] = useState<UploadedAudio | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingStep, setProcessingStep] = useState<string>('')

  const handlePhotosAdded = (newPhotos: File[]) => {
    const photoObjects: UploadedPhoto[] = newPhotos.map(file => ({
      id: Math.random().toString(36).substring(7),
      file,
      preview: URL.createObjectURL(file),
    }))
    setPhotos(prev => [...prev, ...photoObjects])
  }

  const handlePhotoRemoved = (id: string) => {
    setPhotos(prev => {
      const photo = prev.find(p => p.id === id)
      if (photo?.preview) {
        URL.revokeObjectURL(photo.preview)
      }
      return prev.filter(p => p.id !== id)
    })
  }

  const handleAudioAdded = (file: File) => {
    setAudio({
      id: Math.random().toString(36).substring(7),
      file,
    })
  }

  const handleAudioRemoved = () => {
    setAudio(null)
  }

  const handleProcess = async () => {
    if (photos.length === 0) {
      alert('Please upload at least one photo')
      return
    }

    setIsProcessing(true)

    try {
      // Step 1: Upload photos to Vercel Blob
      setProcessingStep('Uploading photos...')
      const photoUploads = await Promise.all(
        photos.map(async (photo) => {
          const formData = new FormData()
          formData.append('file', photo.file)

          const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          })

          if (!response.ok) throw new Error('Photo upload failed')

          const { url } = await response.json()
          return { ...photo, url }
        })
      )

      setPhotos(photoUploads)

      // Step 2: Upload and transcribe audio if present
      let transcription = ''
      if (audio) {
        setProcessingStep('Transcribing voice memo...')
        const formData = new FormData()
        formData.append('file', audio.file)

        const response = await fetch('/api/transcribe', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) throw new Error('Transcription failed')

        const { transcription: text, url } = await response.json()
        transcription = text
        setAudio({ ...audio, transcription: text, url })
      }

      // Step 3: Optimize images with Cloudinary
      setProcessingStep('Optimizing images...')
      const optimizedPhotos = await fetch('/api/optimize-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          photos: photoUploads.map(p => ({ id: p.id, url: p.url })),
        }),
      }).then(res => res.json())

      // Update photos with optimized URLs
      setPhotos(prev => prev.map(photo => {
        const optimized = optimizedPhotos.find((p: any) => p.id === photo.id)
        return optimized ? { ...photo, optimizedUrl: optimized.optimizedUrl } : photo
      }))

      // Step 4: Generate content with AI
      setProcessingStep('Generating content with AI...')
      const contentResponse = await fetch('/api/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcription,
          photoUrls: photoUploads.map(p => p.url),
        }),
      })

      if (!contentResponse.ok) throw new Error('Content generation failed')

      const generatedContent = await contentResponse.json()

      // Step 5: Redirect to review page
      setProcessingStep('Complete! Redirecting...')

      // Store in sessionStorage for review page
      sessionStorage.setItem('pending-upload', JSON.stringify({
        photos: photoUploads,
        audio,
        content: generatedContent,
      }))

      // Redirect to review
      window.location.href = '/review'

    } catch (error) {
      console.error('Processing error:', error)
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
      setIsProcessing(false)
      setProcessingStep('')
    }
  }

  const canProcess = photos.length > 0

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PhotoUploader
          onPhotosAdded={handlePhotosAdded}
          disabled={isProcessing}
        />

        <VoiceMemoRecorder
          onAudioAdded={handleAudioAdded}
          onAudioRemoved={handleAudioRemoved}
          audio={audio}
          disabled={isProcessing}
        />
      </div>

      <UploadedFilesPreview
        photos={photos}
        audio={audio}
        onPhotoRemoved={handlePhotoRemoved}
        onAudioRemoved={handleAudioRemoved}
        disabled={isProcessing}
      />

      {(photos.length > 0 || audio) && (
        <div className="flex justify-center">
          <button
            onClick={handleProcess}
            disabled={!canProcess || isProcessing}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
          >
            {isProcessing ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>{processingStep || 'Processing...'}</span>
              </>
            ) : (
              <>
                <span>✨</span>
                <span>Process with AI</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  )
}
