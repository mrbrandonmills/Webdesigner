'use client'

import { useState, useCallback, forwardRef, useImperativeHandle } from 'react'
import { Camera, Film, Upload, X } from 'lucide-react'

interface BatchUploaderProps {
  type: 'modeling' | 'acting' | 'web-video'
  accept?: string
  icon?: React.ComponentType<{ size: number; className?: string }>
  onUploadComplete?: (data: any) => void
}

export interface BatchUploaderRef {
  getFiles: () => File[]
  clearFiles: () => void
}

const BatchUploader = forwardRef<BatchUploaderRef, BatchUploaderProps>(({
  type,
  accept = 'image/*,video/*',
  icon: Icon = Camera,
  onUploadComplete,
}, ref) => {
  const [files, setFiles] = useState<File[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  // Expose methods to parent component via ref
  useImperativeHandle(ref, () => ({
    getFiles: () => files,
    clearFiles: () => setFiles([]),
  }))

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const droppedFiles = Array.from(e.dataTransfer.files)
    setFiles(prev => [...prev, ...droppedFiles])
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      setFiles(prev => [...prev, ...selectedFiles])
    }
  }, [])

  const removeFile = useCallback((index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }, [])

  const clearAll = useCallback(() => {
    setFiles([])
  }, [])

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <label
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-lg p-12 text-center
          transition-all duration-300 cursor-pointer
          ${isDragging
            ? 'border-accent-gold bg-accent-gold/10'
            : 'border-white/20 hover:border-accent-gold/50 hover:bg-white/5'
          }
        `}
      >
        <input
          type="file"
          multiple
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
        />

        <Icon size={48} className={`mx-auto mb-4 transition-colors ${isDragging ? 'text-accent-gold' : 'text-white/40'}`} />

        <p className="text-lg mb-2">
          {isDragging ? 'Drop files here' : 'Drop files here or click to browse'}
        </p>

        <p className="text-sm text-white/40">
          {type === 'modeling' && 'Upload all photos from one shoot'}
          {type === 'acting' && 'Reels, clips, or headshots from one project'}
          {type === 'web-video' && 'Videos for site backgrounds or content'}
        </p>
      </label>

      {/* Selected Files List */}
      {files.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-accent-gold font-medium">
              {files.length} file{files.length !== 1 ? 's' : ''} selected
            </p>
            <button
              onClick={clearAll}
              className="text-sm text-white/40 hover:text-white transition-colors"
            >
              Clear all
            </button>
          </div>

          <div className="max-h-64 overflow-y-auto space-y-2">
            {files.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center justify-between bg-white/5 border border-white/10 rounded p-3 group"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {file.type.startsWith('image/') ? (
                    <Camera size={16} className="text-white/40 flex-shrink-0" />
                  ) : (
                    <Film size={16} className="text-white/40 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{file.name}</p>
                    <p className="text-xs text-white/40">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => removeFile(index)}
                  className="ml-2 p-1 hover:bg-white/10 rounded transition-colors opacity-0 group-hover:opacity-100"
                >
                  <X size={16} className="text-white/60" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Progress */}
      {isUploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/60">Uploading...</span>
            <span className="text-accent-gold">{uploadProgress}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
            <div
              className="bg-accent-gold h-full transition-all duration-300 rounded-full"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  )
})

BatchUploader.displayName = 'BatchUploader'

export default BatchUploader
