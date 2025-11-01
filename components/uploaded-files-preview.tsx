'use client'

import Image from 'next/image'
import type { UploadedPhoto, UploadedAudio } from './upload-interface'

interface UploadedFilesPreviewProps {
  photos: UploadedPhoto[]
  audio: UploadedAudio | null
  onPhotoRemoved: (id: string) => void
  onAudioRemoved: () => void
  disabled?: boolean
}

export function UploadedFilesPreview({
  photos,
  audio,
  onPhotoRemoved,
  onAudioRemoved,
  disabled,
}: UploadedFilesPreviewProps) {
  if (photos.length === 0 && !audio) {
    return null
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
        Uploaded Files
      </h3>

      {photos.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {photos.length} photo{photos.length !== 1 ? 's' : ''} ready
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 group"
              >
                <Image
                  src={photo.preview}
                  alt="Upload preview"
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
                />

                {/* Optimized badge */}
                {photo.optimizedUrl && (
                  <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                    ✓ Optimized
                  </div>
                )}

                {/* Remove button */}
                {!disabled && (
                  <button
                    onClick={() => onPhotoRemoved(photo.id)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    aria-label="Remove photo"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}

                {/* File name on hover */}
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-2 opacity-0 group-hover:opacity-100 transition-opacity truncate">
                  {photo.file.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
