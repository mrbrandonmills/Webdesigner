'use client'

import { useState } from 'react'
import { Upload, Mic, FileText, Image, Send, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import FileUploader from '@/components/file-uploader'

export default function AdminPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'upload' | 'voice' | 'manage'>('upload')
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  // Upload form state
  const [contentType, setContentType] = useState<'research' | 'essay' | 'modeling' | 'creative' | ''>('')
  const [category, setCategory] = useState('')
  const [title, setTitle] = useState('')
  const [autoImage, setAutoImage] = useState(false)
  const [autoPublish, setAutoPublish] = useState(true)

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/gallery')
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

              {/* Recording Interface */}
              <div className="text-center py-12">
                <button
                  onClick={() => setIsRecording(!isRecording)}
                  className={`w-32 h-32 rounded-full flex items-center justify-center transition-all ${
                    isRecording
                      ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                      : 'bg-accent-gold hover:bg-accent-hover'
                  }`}
                >
                  <Mic size={48} className={isRecording ? 'text-white' : 'text-black'} />
                </button>
                <p className="mt-4 text-lg">
                  {isRecording ? 'Recording... Click to stop' : 'Click to start recording'}
                </p>
                {isRecording && (
                  <p className="text-sm text-white/40 mt-2">00:00:00</p>
                )}
              </div>

              {/* AI Processing Options */}
              <div className="border-t border-white/10 pt-8 mt-8 space-y-4">
                <h3 className="text-lg font-serif mb-4">AI Will Automatically:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { icon: '🎯', text: 'Transcribe & format as professional essay' },
                    { icon: '🎨', text: 'Generate/find theme image or video' },
                    { icon: '🏷️', text: 'Auto-categorize (Mind/Body/Creativity/Synthesis)' },
                    { icon: '🔍', text: 'Optimize SEO & add meta tags' },
                    { icon: '📝', text: 'Post to Medium with proper formatting' },
                    { icon: '💼', text: 'Share story on LinkedIn' },
                    { icon: '📱', text: 'Create Instagram post with excerpt' },
                    { icon: '✅', text: 'Add to correct page section on your site' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 text-sm text-white/80">
                      <span className="text-xl">{item.icon}</span>
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {isProcessing && (
                <div className="mt-8 p-6 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="animate-spin w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                    <span className="text-blue-400">Processing your essay...</span>
                  </div>
                  <div className="space-y-2 text-sm text-white/60">
                    <div>✓ Transcribed (2,847 words)</div>
                    <div>✓ Formatted as essay</div>
                    <div className="animate-pulse">⏳ Generating visual theme...</div>
                    <div className="text-white/30">⏳ Optimizing SEO...</div>
                    <div className="text-white/30">⏳ Publishing to platforms...</div>
                  </div>
                </div>
              )}
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
