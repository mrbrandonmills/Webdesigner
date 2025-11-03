'use client'

import { useState, useRef } from 'react'
import { Upload, Mic, FileText, Film, Camera, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import BatchUploader from '@/components/batch-uploader'

export default function AdminPage() {
  const router = useRouter()
  const [activeZone, setActiveZone] = useState<'modeling' | 'acting' | 'videos' | 'essays' | 'manage'>('modeling')

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/gallery')
  }

  const uploadZones = [
    { id: 'modeling' as const, label: 'Modeling', icon: Camera, desc: 'Photo shoots with voice descriptions' },
    { id: 'acting' as const, label: 'Acting', icon: Film, desc: 'Reels, clips, stills with context' },
    { id: 'videos' as const, label: 'Web Videos', icon: Upload, desc: 'Site videos & background content' },
    { id: 'essays' as const, label: 'Essays', icon: Mic, desc: 'Dictate or upload written work' },
    { id: 'manage' as const, label: 'Manage', icon: FileText, desc: 'View all content' },
  ]

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-20">
      <div className="container-wide max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-light font-serif mb-2">
              Content Studio
            </h1>
            <p className="text-white/60">
              Modeling · Acting · Essays · Media
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/20 hover:bg-white/10 transition-colors text-sm tracking-wider"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>

        {/* Upload Zone Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
          {uploadZones.map((zone) => {
            const Icon = zone.icon
            return (
              <button
                key={zone.id}
                onClick={() => setActiveZone(zone.id)}
                className={`p-6 border transition-all ${
                  activeZone === zone.id
                    ? 'bg-accent-gold/10 border-accent-gold'
                    : 'bg-white/5 border-white/10 hover:border-white/30'
                }`}
              >
                <Icon size={32} className={`mb-3 ${activeZone === zone.id ? 'text-accent-gold' : 'text-white/60'}`} />
                <div className="text-left">
                  <div className="font-medium mb-1">{zone.label}</div>
                  <div className="text-xs text-white/40">{zone.desc}</div>
                </div>
              </button>
            )
          })}
        </div>

        {/* Upload Zone Content */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-8">
          {activeZone === 'modeling' && <ModelingUploadZone />}
          {activeZone === 'acting' && <ActingUploadZone />}
          {activeZone === 'videos' && <VideoUploadZone />}
          {activeZone === 'essays' && <EssayZone />}
          {activeZone === 'manage' && <ManageContent />}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
          {[
            { label: 'Collections', count: 0, icon: '📁' },
            { label: 'Photos', count: 0, icon: '📸' },
            { label: 'Videos', count: 0, icon: '🎬' },
            { label: 'Essays', count: 0, icon: '📝' },
          ].map((stat) => (
            <div key={stat.label} className="luxury-card bg-white/5 border border-white/10 p-6 text-center">
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-3xl font-light mb-1">{stat.count}</div>
              <div className="text-sm text-white/60">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// MODELING UPLOAD ZONE
function ModelingUploadZone() {
  const uploaderRef = useRef<any>(null)
  const [collectionName, setCollectionName] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState<any>(null)

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      const chunks: BlobPart[] = []

      recorder.ondataavailable = (e) => chunks.push(e.data)
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' })
        setAudioBlob(blob)
        stream.getTracks().forEach(track => track.stop())
      }

      recorder.start()
      setMediaRecorder(recorder)
      setIsRecording(true)
    } catch (error) {
      console.error('Failed to start recording:', error)
      alert('Microphone access denied')
    }
  }

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop()
      setMediaRecorder(null)
      setIsRecording(false)
    }
  }

  const handleUpload = async (files: File[]) => {
    if (files.length === 0) {
      alert('Please select at least one photo')
      return
    }

    setIsUploading(true)
    setUploadResult(null)

    try {
      const formData = new FormData()
      files.forEach(file => formData.append('files', file))
      if (audioBlob) {
        formData.append('audio', audioBlob, 'voice-memo.webm')
      }
      if (collectionName) {
        formData.append('title', collectionName)
      }
      formData.append('type', 'modeling')

      const response = await fetch('/api/upload-collection', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (data.success) {
        setUploadResult(data)
        setCollectionName('')
        setAudioBlob(null)
        // Reset files in uploader (would need to add this method to BatchUploader)
      } else {
        alert(`Upload failed: ${data.error}`)
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Upload failed')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-serif mb-2">📸 Modeling Upload</h2>
        <p className="text-white/60 text-sm">
          Upload a batch of photos from one shoot. Add a voice description to create a collection.
        </p>
      </div>

      {uploadResult && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6">
          <h3 className="text-green-400 font-medium mb-2">✅ Collection Created!</h3>
          <p className="text-white/80 mb-2">"{uploadResult.data.title}"</p>
          <p className="text-sm text-white/60">{uploadResult.message}</p>
        </div>
      )}

      {/* Collection Name */}
      <div>
        <label className="block text-white/60 text-sm tracking-wider uppercase mb-2">
          Collection Name (optional - AI will generate)
        </label>
        <input
          type="text"
          value={collectionName}
          onChange={(e) => setCollectionName(e.target.value)}
          placeholder="e.g., Vogue Fall Editorial 2024"
          className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-accent-gold transition-colors"
        />
      </div>

      {/* Photo Drop Zone */}
      <BatchUploader
        ref={uploaderRef}
        type="modeling"
        accept="image/*"
        icon={Camera}
        onUploadComplete={handleUpload}
      />

      {/* Voice Memo for Batch */}
      <div className="border border-white/10 rounded-lg p-6">
        <h3 className="text-lg font-serif mb-4">🎤 Voice Description (Recommended)</h3>
        <p className="text-white/60 text-sm mb-4">
          Describe the shoot vibe, location, style, mood. AI uses this for keywords and collection details.
        </p>

        <div className="flex gap-4">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isUploading}
            className={`flex-1 px-6 py-4 font-medium tracking-wider uppercase transition-colors ${
              isRecording
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-white/10 border border-white/20 hover:bg-white/20'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isRecording ? '⏹ Stop Recording' : '🎤 Record Description'}
          </button>

          {audioBlob && (
            <button
              onClick={() => setAudioBlob(null)}
              disabled={isUploading}
              className="px-6 py-4 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors disabled:opacity-50"
            >
              🗑️ Clear
            </button>
          )}
        </div>

        {audioBlob && (
          <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded">
            ✓ Voice description recorded ({(audioBlob.size / 1024).toFixed(2)} KB)
          </div>
        )}
      </div>

      {/* Upload Button */}
      <button
        onClick={() => {
          const filesInput = uploaderRef.current?.getFiles?.()
          if (filesInput) handleUpload(filesInput)
        }}
        disabled={isUploading}
        className="w-full px-6 py-4 bg-accent-gold text-black font-medium tracking-wider uppercase hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isUploading ? 'Uploading...' : 'Upload & Create Collection'}
      </button>

      {/* Info */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded p-4 text-sm text-blue-300">
        <p className="font-medium mb-2">💡 How it works:</p>
        <ul className="space-y-1 text-blue-200/80 text-sm">
          <li>• Photos grouped into one collection</li>
          <li>• Voice memo transcribed for keywords & vibe</li>
          <li>• AI generates collection title if not provided</li>
          <li>• Each photo tagged with collection metadata</li>
          <li>• Appears in Gallery with luxury hover effects</li>
        </ul>
      </div>
    </div>
  )
}

// ACTING UPLOAD ZONE
function ActingUploadZone() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-serif mb-2">🎭 Acting Upload</h2>
        <p className="text-white/60 text-sm">
          Upload reels (2-3 min), clips (&lt;1 min), or stills. Add voice context about the role/performance.
        </p>
      </div>

      <div className="border-2 border-dashed border-white/20 rounded-lg p-12 text-center">
        <Film size={48} className="mx-auto mb-4 text-white/40" />
        <p className="text-lg mb-2">Drop videos or photos</p>
        <p className="text-sm text-white/40">
          Reels, Instagram clips, headshots, stills
        </p>
      </div>

      <div className="border border-white/10 rounded-lg p-6">
        <h3 className="text-lg font-serif mb-4">🎤 Project Context</h3>
        <p className="text-white/60 text-sm mb-4">
          Describe the character, role, project, or performance
        </p>
        <button className="w-full px-6 py-4 bg-white/10 border border-white/20 hover:bg-white/20 transition-colors">
          🎤 Record Context
        </button>
      </div>

      <button className="w-full px-6 py-4 bg-accent-gold text-black font-medium tracking-wider uppercase hover:bg-accent-hover transition-colors">
        Upload & Create Collection
      </button>
    </div>
  )
}

// WEB VIDEO UPLOAD ZONE
function VideoUploadZone() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-serif mb-2">🎥 Web Videos</h2>
        <p className="text-white/60 text-sm">
          Upload videos for site backgrounds, hero sections, or content. No voice memo needed.
        </p>
      </div>

      <div>
        <label className="block text-white/60 text-sm tracking-wider uppercase mb-2">
          Video Purpose
        </label>
        <select className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-accent-gold transition-colors">
          <option value="hero">Hero Background Video</option>
          <option value="portfolio">Portfolio Showcase</option>
          <option value="broll">B-Roll / Content</option>
        </select>
      </div>

      <div className="border-2 border-dashed border-white/20 rounded-lg p-12 text-center">
        <Film size={48} className="mx-auto mb-4 text-white/40" />
        <p className="text-lg mb-2">Drop video files</p>
        <p className="text-sm text-white/40">
          MP4, MOV, WebM formats
        </p>
      </div>

      <button className="w-full px-6 py-4 bg-accent-gold text-black font-medium tracking-wider uppercase hover:bg-accent-hover transition-colors">
        Upload Videos
      </button>
    </div>
  )
}

// ESSAY ZONE
function EssayZone() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-serif mb-2">✍️ Essay Creator</h2>
        <p className="text-white/60 text-sm">
          Dictate a full essay or upload written documents. AI formats, adds SEO, generates theme image.
        </p>
      </div>

      {/* Dictation Option */}
      <div className="border border-accent-gold/30 rounded-lg p-8 bg-accent-gold/5">
        <h3 className="text-xl font-serif mb-4">🎤 Dictate Essay (Recommended)</h3>
        <p className="text-white/60 mb-6">
          Speak your essay naturally. Unlimited length. AI transcribes, formats, and publishes.
        </p>

        <div className="text-center py-8">
          <button className="w-32 h-32 rounded-full bg-accent-gold hover:bg-accent-hover flex items-center justify-center transition-all shadow-lg mx-auto">
            <Mic size={48} className="text-black" />
          </button>
          <p className="mt-4 text-lg">Click to start dictating</p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" defaultChecked className="w-4 h-4" />
            <span className="text-white/60">Generate theme image</span>
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" defaultChecked className="w-4 h-4" />
            <span className="text-white/60">Auto-post to Medium</span>
          </label>
        </div>
      </div>

      {/* Document Upload Option */}
      <div className="border border-white/10 rounded-lg p-6">
        <h3 className="text-lg font-serif mb-4">📄 Upload Written Document</h3>
        <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center">
          <FileText size={40} className="mx-auto mb-3 text-white/40" />
          <p>Drop PDF, Word doc, or text file</p>
        </div>
      </div>
    </div>
  )
}

// MANAGE CONTENT
function ManageContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-serif">📊 Content Manager</h2>

      <div className="flex gap-4 overflow-x-auto">
        {['All', 'Modeling', 'Acting', 'Essays', 'Videos'].map((filter) => (
          <button
            key={filter}
            className="px-4 py-2 bg-white/5 border border-white/10 hover:border-accent-gold whitespace-nowrap text-sm"
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="text-center py-20 text-white/40">
        No content yet. Upload your first collection!
      </div>
    </div>
  )
}
