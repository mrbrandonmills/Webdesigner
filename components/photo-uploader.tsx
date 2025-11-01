'use client'

import { useCallback, useState } from 'react'

interface PhotoUploaderProps {
  onPhotosAdded: (photos: File[]) => void
  disabled?: boolean
}

export function PhotoUploader({ onPhotosAdded, disabled }: PhotoUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files || disabled) return

    const imageFiles = Array.from(files).filter(file =>
      file.type.startsWith('image/')
    )

    if (imageFiles.length === 0) {
      alert('Please select image files only')
      return
    }

    if (imageFiles.length > 100) {
      alert('Maximum 100 photos per upload')
      return
    }

    onPhotosAdded(imageFiles)
  }, [onPhotosAdded, disabled])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    if (!disabled) {
      setIsDragging(true)
    }
  }, [disabled])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (disabled) return

    handleFiles(e.dataTransfer.files)
  }, [handleFiles, disabled])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files)
  }, [handleFiles])

  return (
    <div
      className={`
        relative border-2 border-dashed rounded-lg p-8 text-center transition-all
        ${isDragging ? 'drag-over border-blue-500 bg-blue-50 dark:bg-blue-950' : 'border-gray-300 dark:border-gray-600'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-400 dark:hover:border-gray-500 cursor-pointer'}
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleInputChange}
        disabled={disabled}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
      />

      <div className="space-y-4">
        <div className="text-6xl">📸</div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Upload Photos
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Drag and drop photos here, or click to browse
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
            Supports: JPG, PNG, WebP, HEIC (up to 100 photos)
          </p>
        </div>
        <button
          type="button"
          disabled={disabled}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={(e) => {
            e.stopPropagation()
            const input = e.currentTarget.parentElement?.parentElement?.querySelector('input[type="file"]') as HTMLInputElement
            input?.click()
          }}
        >
          Choose Files
        </button>
      </div>
    </div>
  )
}
