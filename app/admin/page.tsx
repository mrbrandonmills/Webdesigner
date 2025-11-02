'use client'

import { useState } from 'react'
import { Upload, Mic, FileText, Image, Send, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import FileUploader from '@/components/file-uploader'
import VoiceRecorder from '@/components/voice-recorder'
import { upload } from '@vercel/blob/client'

export default function AdminPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'upload' | 'voice' | 'manage'>('upload')
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingStatus, setProcessingStatus] = useState<string[]>([])
  const [processedEssay, setProcessedEssay] = useState<any>(null)

  // Upload form state
  const [contentType, setContentType] = useState<'research' | 'essay' | 'modeling' | 'creative' | ''>('')
  const [category, setCategory] = useState('')
  const [title, setTitle] = useState('')
  const [autoImage, setAutoImage] = useState(false)
  const [autoPublish, setAutoPublish] = useState(true)

  // Voice memo form state
  const [voiceCategory, setVoiceCategory] = useState('')
  const [voiceAutoImage, setVoiceAutoImage] = useState(true)
  const [voiceAutoPublish, setVoiceAutoPublish] = useState(true)

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/gallery')
  }

  const handleRecordingComplete = async (audioBlob: Blob, duration: number) => {
    setIsProcessing(true)
    setProcessingStatus([])
    setProcessedEssay(null)

    try {
      // Status updates
      const addStatus = (status: string) => {
        setProcessingStatus((prev) => [...prev, status])
      }

      addStatus(`✓ Recorded ${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, '0')}`)

      // Upload audio to Vercel Blob
      addStatus('⏳ Uploading audio...')
      const audioFile = new File([audioBlob], `voice-memo-${Date.now()}.webm`, {
        type: 'audio/webm',
      })

      const blob = await upload(audioFile.name, audioFile, {
        access: 'public',
        handleUploadUrl: '/api/upload',
      })

      addStatus('✓ Audio uploaded')

      // Process with AI
      addStatus('⏳ Transcribing with Whisper AI...')

      const formData = new FormData()
      formData.append('audio', audioBlob, 'voice-memo.webm')
      formData.append('category', voiceCategory)
      formData.append('autoImage', voiceAutoImage.toString())
      formData.append('autoPublish', voiceAutoPublish.toString())

      const response = await fetch('/api/process-voice', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Processing failed')
      }

      const result = await response.json()

      addStatus('✓ Transcribed')
      addStatus('✓ Formatted as essay')
      addStatus('✓ Generated title & SEO')
      addStatus('✓ Auto-categorized')

      if (voiceAutoImage) {
        addStatus('✓ Generated visual theme prompt')
      }

      if (voiceAutoPublish) {
        addStatus('⏳ Publishing to platforms...')
      }

      setProcessedEssay(result.data)
      addStatus(`✅ Complete: "${result.data.title}"`)

      alert(`✅ Essay processed successfully!\n\nTitle: ${result.data.title}\nWords: ${result.data.wordCount}\nCategory: ${result.data.category}`)
    } catch (error) {
      console.error('Voice processing error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      setProcessingStatus((prev) => [...prev, `❌ Error: ${errorMessage}`])
      alert(`Error processing voice memo: ${errorMessage}`)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-20">
      <div className="container-wide max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-light font-serif mb-2">
              Content Studio
            </h1>
            <p className="text-white/60">
              Mind · Body · Creativity · Synthesis
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

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8 border-b border-white/10">
          <button
            onClick={() => setActiveTab('upload')}
            className={`pb-4 px-6 text-sm tracking-wider uppercase transition-colors border-b-2 ${
              activeTab === 'upload'
                ? 'border-accent-gold text-white'
                : 'border-transparent text-white/60 hover:text-white/80'
            }`}
          >
            <Upload size={16} className="inline mr-2" />
            File Upload
          </button>
          <button
            onClick={() => setActiveTab('voice')}
            className={`pb-4 px-6 text-sm tracking-wider uppercase transition-colors border-b-2 ${
              activeTab === 'voice'
                ? 'border-accent-gold text-white'
                : 'border-transparent text-white/60 hover:text-white/80'
            }`}
          >
            <Mic size={16} className="inline mr-2" />
            Voice Memo
          </button>
          <button
            onClick={() => setActiveTab('manage')}
            className={`pb-4 px-6 text-sm tracking-wider uppercase transition-colors border-b-2 ${
              activeTab === 'manage'
                ? 'border-accent-gold text-white'
                : 'border-transparent text-white/60 hover:text-white/80'
            }`}
          >
            <FileText size={16} className="inline mr-2" />
            Manage Content
          </button>
        </div>

        {/* File Upload Tab */}
        {activeTab === 'upload' && (
          <div className="space-y-8">
            <div className="bg-white/5 border border-white/10 rounded-lg p-8">
              <h2 className="text-2xl font-serif mb-6">Upload Files</h2>

              {/* Content Type Selector */}
              <div className="mb-6">
                <label className="block text-white/60 text-sm tracking-wider uppercase mb-3">
                  Content Type
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { id: 'research' as const, label: 'Research Paper', icon: '🧠', desc: 'Cognitive Science' },
                    { id: 'essay' as const, label: 'Essay', icon: '✍️', desc: 'Thought Leadership' },
                    { id: 'modeling' as const, label: 'Photo Shoot', icon: '📸', desc: 'Modeling Work' },
                    { id: 'creative' as const, label: 'Creative Work', icon: '🎭', desc: 'Acting/Projects' },
                  ].map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setContentType(type.id)}
                      className={`p-4 border transition-all text-left ${
                        contentType === type.id
                          ? 'bg-accent-gold/10 border-accent-gold'
                          : 'bg-white/5 border-white/10 hover:border-accent-gold hover:bg-white/10'
                      }`}
                    >
                      <div className="text-2xl mb-2">{type.icon}</div>
                      <div className="font-medium text-sm mb-1">{type.label}</div>
                      <div className="text-xs text-white/40">{type.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Metadata Fields */}
              <div className="mb-6 space-y-4">
                <div>
                  <label className="block text-white/60 text-sm tracking-wider uppercase mb-2">
                    Title (optional - AI will suggest)
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Leave blank for AI to generate"
                    className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-accent-gold transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-white/60 text-sm tracking-wider uppercase mb-2">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-accent-gold transition-colors"
                  >
                    <option value="">Auto-categorize with AI</option>
                    <option value="mind">Mind (Cognitive Research)</option>
                    <option value="body">Body (Modeling)</option>
                    <option value="creativity">Creativity (Acting)</option>
                    <option value="synthesis">Synthesis (Self-Actualization)</option>
                  </select>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="auto-image"
                    checked={autoImage}
                    onChange={(e) => setAutoImage(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <label htmlFor="auto-image" className="text-sm text-white/60">
                    Generate visual theme image/video with AI
                  </label>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="auto-publish"
                    checked={autoPublish}
                    onChange={(e) => setAutoPublish(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <label htmlFor="auto-publish" className="text-sm text-white/60">
                    Auto-publish to Medium, LinkedIn, Instagram
                  </label>
                </div>
              </div>

              {/* File Uploader Component */}
              <FileUploader
                contentType={contentType}
                category={category}
                title={title}
                autoImage={autoImage}
                autoPublish={autoPublish}
              />
            </div>
          </div>
        )}

        {/* Voice Memo Tab */}
        {activeTab === 'voice' && (
          <div className="space-y-8">
            <div className="bg-white/5 border border-white/10 rounded-lg p-8">
              <h2 className="text-2xl font-serif mb-4">Voice Essay Dictation</h2>
              <p className="text-white/60 mb-8">
                Dictate your entire essay. AI will transcribe, format, add visuals,
                optimize for SEO, and publish across platforms.
              </p>

              {/* Settings */}
              <div className="mb-6 space-y-4 bg-white/5 border border-white/10 rounded-lg p-6">
                <h3 className="text-sm font-medium tracking-wider uppercase text-white/60">
                  Processing Options
                </h3>

                <div>
                  <label className="block text-white/60 text-sm tracking-wider uppercase mb-2">
                    Category
                  </label>
                  <select
                    value={voiceCategory}
                    onChange={(e) => setVoiceCategory(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-accent-gold transition-colors"
                    disabled={isProcessing}
                  >
                    <option value="">Auto-categorize with AI</option>
                    <option value="mind">Mind (Cognitive Research)</option>
                    <option value="body">Body (Modeling)</option>
                    <option value="creativity">Creativity (Acting)</option>
                    <option value="synthesis">Synthesis (Self-Actualization)</option>
                  </select>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="voice-auto-image"
                    checked={voiceAutoImage}
                    onChange={(e) => setVoiceAutoImage(e.target.checked)}
                    className="w-4 h-4"
                    disabled={isProcessing}
                  />
                  <label htmlFor="voice-auto-image" className="text-sm text-white/60">
                    Generate visual theme image with AI
                  </label>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="voice-auto-publish"
                    checked={voiceAutoPublish}
                    onChange={(e) => setVoiceAutoPublish(e.target.checked)}
                    className="w-4 h-4"
                    disabled={isProcessing}
                  />
                  <label htmlFor="voice-auto-publish" className="text-sm text-white/60">
                    Auto-publish to Medium, LinkedIn, Instagram
                  </label>
                </div>
              </div>

              {/* Voice Recorder */}
              <VoiceRecorder onRecordingComplete={handleRecordingComplete} />

              {/* Processing Status */}
              {isProcessing && (
                <div className="mt-8 p-6 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="animate-spin w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                    <span className="text-blue-400">Processing your essay...</span>
                  </div>
                  <div className="space-y-2 text-sm text-white/60">
                    {processingStatus.map((status, i) => (
                      <div key={i}>{status}</div>
                    ))}
                  </div>
                </div>
              )}

              {/* Processed Essay Preview */}
              {processedEssay && !isProcessing && (
                <div className="mt-8 p-6 bg-green-500/10 border border-green-500/30 rounded-lg space-y-4">
                  <h3 className="text-lg font-semibold text-green-400">
                    ✅ Essay Processed Successfully!
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-white/60">Title:</span>{' '}
                      <span className="text-white">{processedEssay.title}</span>
                    </div>
                    <div>
                      <span className="text-white/60">Category:</span>{' '}
                      <span className="text-white capitalize">{processedEssay.category}</span>
                    </div>
                    <div>
                      <span className="text-white/60">Word Count:</span>{' '}
                      <span className="text-white">{processedEssay.wordCount}</span>
                    </div>
                    <div className="pt-4">
                      <span className="text-white/60">Excerpt:</span>
                      <p className="text-white/80 italic mt-2">{processedEssay.excerpt}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* AI Processing Info */}
              <div className="border-t border-white/10 pt-8 mt-8 space-y-4">
                <h3 className="text-lg font-serif mb-4">AI Will Automatically:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { icon: '🎯', text: 'Transcribe with OpenAI Whisper' },
                    { icon: '✍️', text: 'Format as professional essay with Claude' },
                    { icon: '📖', text: 'Generate compelling title' },
                    { icon: '🏷️', text: 'Auto-categorize (Mind/Body/Creativity/Synthesis)' },
                    { icon: '🔍', text: 'Create SEO meta description & keywords' },
                    { icon: '📝', text: 'Generate social media excerpt' },
                    { icon: '🎨', text: 'Create visual theme prompt (optional)' },
                    { icon: '🚀', text: 'Publish to platforms (optional)' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 text-sm text-white/80">
                      <span className="text-xl">{item.icon}</span>
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Manage Content Tab */}
        {activeTab === 'manage' && (
          <div className="space-y-8">
            <div className="bg-white/5 border border-white/10 rounded-lg p-8">
              <h2 className="text-2xl font-serif mb-6">Content Manager</h2>

              {/* Filter Tabs */}
              <div className="flex gap-4 mb-6 overflow-x-auto">
                {['All', 'Mind', 'Body', 'Creativity', 'Synthesis'].map((filter) => (
                  <button
                    key={filter}
                    className="px-4 py-2 bg-white/5 border border-white/10 hover:border-accent-gold whitespace-nowrap text-sm"
                  >
                    {filter}
                  </button>
                ))}
              </div>

              {/* Content List */}
              <div className="space-y-4">
                <p className="text-white/40 text-center py-12">
                  No content yet. Upload files or record a voice memo to get started.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
          {[
            { label: 'Essays', count: 0, icon: '📝' },
            { label: 'Research', count: 0, icon: '🧠' },
            { label: 'Photo Shoots', count: 0, icon: '📸' },
            { label: 'Projects', count: 0, icon: '🎭' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white/5 border border-white/10 p-6 text-center">
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
