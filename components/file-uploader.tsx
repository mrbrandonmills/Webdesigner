'use client'

import { useState, useCallback } from 'react'
import { Upload, X, FileText, Image as ImageIcon, Film, Mic } from 'lucide-react'
import { upload } from '@vercel/blob/client'
import { clientLogger } from '@/lib/client-logger'

interface FileUploaderProps {
  contentType: 'research' | 'essay' | 'modeling' | 'creative' | ''
  category: string
  title: string
  autoImage: boolean
  autoPublish: boolean
  onUploadComplete?: (url: string, fileType: string) => void
}

export default function FileUploader({
  contentType,
  category,
  title,
  autoImage,
  autoPublish,
  onUploadComplete,
}: FileUploaderProps) {
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const droppedFiles = Array.from(e.dataTransfer.files)
    setFiles((prev) => [...prev, ...droppedFiles])
  }, [])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      setFiles((prev) => [...prev, ...selectedFiles])
    }
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <ImageIcon size={20} className="text-blue-400" />
    if (file.type.startsWith('audio/')) return <Mic size={20} className="text-green-400" />
    if (file.type.startsWith('video/')) return <Film size={20} className="text-purple-400" />
    return <FileText size={20} className="text-gray-400" />
  }

  const handleUpload = async () => {
    if (files.length === 0) {
      setError('Please select at least one file')
      return
    }

    if (!contentType) {
      setError('Please select a content type')
      return
    }

    setUploading(true)
    setError(null)
    setProgress(0)

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        setProgress(Math.round(((i + 0.5) / files.length) * 100))

        // Upload to Vercel Blob
        const blob = await upload(file.name, file, {
          access: 'public',
          handleUploadUrl: '/api/upload',
        })

        clientLogger.info('Uploaded:', { data: blob.url })

        // Process the uploaded file
        await fetch('/api/process-content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            url: blob.url,
            fileName: file.name,
            fileType: file.type,
            contentType,
            category: category || 'auto',
            title: title || '',
            autoImage,
            autoPublish,
          }),
        })

        setProgress(Math.round(((i + 1) / files.length) * 100))

        if (onUploadComplete) {
          onUploadComplete(blob.url, file.type)
        }
      }

      // Success!
      setFiles([])
      alert(`✅ Successfully uploaded and processed ${files.length} file(s)!`)
    } catch (err) {
      clientLogger.error('Upload error:', err)
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
      setProgress(0)
    }
  }

  return (
    <div className="space-y-6">
      {/* Drag & Drop Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-12 text-center transition-all cursor-pointer ${
          dragActive
            ? 'border-accent-gold bg-accent-gold/10'
            : 'border-white/20 hover:border-accent-gold/50'
        }`}
      >
        <input
          type="file"
          id="file-input"
          multiple
          onChange={handleFileInput}
          className="hidden"
          accept=".pdf,.doc,.docx,.txt,.md,.rtf,.jpg,.jpeg,.png,.gif,.webp,.mp4,.mov,.mp3,.wav,.webm"
        />
        <label htmlFor="file-input" className="cursor-pointer">
          <Upload size={48} className="mx-auto mb-4 text-white/40" />
          <p className="text-lg mb-2">Drop files here or click to browse</p>
          <p className="text-sm text-white/40">
            PDFs, Word docs, photos, videos, or text files
          </p>
        </label>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-white/60">Selected Files ({files.length})</h3>
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-white/5 border border-white/10 rounded p-3"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {getFileIcon(file)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{file.name}</p>
                  <p className="text-xs text-white/40">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                onClick={() => removeFile(index)}
                className="p-1 hover:bg-white/10 rounded transition-colors"
                disabled={uploading}
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Progress Bar */}
      {uploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Uploading and processing...</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-accent-gold transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded p-4 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={uploading || files.length === 0}
        className="w-full px-6 py-4 bg-accent-gold text-black font-medium tracking-wider uppercase hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {uploading ? 'Processing...' : `Upload & Process ${files.length > 0 ? `(${files.length})` : ''}`}
      </button>
    </div>
  )
}
