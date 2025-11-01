'use client'

import { useState } from 'react'
import Image from 'next/image'
import { EditableField } from './editable-field'

interface ReviewInterfaceProps {
  initialData: {
    photos: any[]
    audio: any
    content: {
      title: string
      slug: string
      description: string
      metaDescription: string
      tags: string[]
      photos: Array<{
        caption: string
        alt: string
      }>
      seoKeywords: string[]
      category: string
    }
  }
}

export function ReviewInterface({ initialData }: ReviewInterfaceProps) {
  const [content, setContent] = useState(initialData.content)
  const [isPublishing, setIsPublishing] = useState(false)
  const [publishStep, setPublishStep] = useState('')

  const updateField = (field: string, value: any) => {
    setContent(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  const updatePhotoField = (index: number, field: 'caption' | 'alt', value: string) => {
    setContent(prev => ({
      ...prev,
      photos: prev.photos.map((photo, i) =>
        i === index ? { ...photo, [field]: value } : photo
      ),
    }))
  }

  const handleRegenerate = async () => {
    if (!confirm('Regenerate all content? Your edits will be lost.')) {
      return
    }

    setIsPublishing(true)
    setPublishStep('Regenerating content...')

    try {
      // Get style guide from localStorage (should have been saved during site audit)
      let styleGuide = null
      try {
        const savedStyleGuide = localStorage.getItem('siteStyleGuide')
        if (savedStyleGuide) {
          styleGuide = JSON.parse(savedStyleGuide)
          console.log('Using saved style guide for regeneration')
        }
      } catch (error) {
        console.log('No style guide found, using default')
      }

      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcription: initialData.audio?.transcription || '',
          photoUrls: initialData.photos.map(p => p.url),
          styleGuide, // FIXED: Now passes style guide for brand-consistent regeneration
        }),
      })

      if (!response.ok) throw new Error('Regeneration failed')

      const newContent = await response.json()
      setContent(newContent)

      alert('Content regenerated successfully!')
    } catch (error) {
      console.error('Regeneration error:', error)
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsPublishing(false)
      setPublishStep('')
    }
  }

  const handleSaveDraft = async () => {
    setIsPublishing(true)
    setPublishStep('Saving draft to Webflow...')

    try {
      const response = await fetch('/api/webflow/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          photos: initialData.photos,
          draft: true,
        }),
      })

      if (!response.ok) throw new Error('Failed to save draft')

      const result = await response.json()

      alert('Draft saved successfully! ✓')
      console.log('Draft saved:', result)

      // Clear session storage
      sessionStorage.removeItem('pending-upload')

      // Redirect to success page or gallery
      window.location.href = '/gallery'
    } catch (error) {
      console.error('Save draft error:', error)
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsPublishing(false)
      setPublishStep('')
    }
  }

  const handlePublishLive = async () => {
    if (!confirm('Publish this gallery live to your website?')) {
      return
    }

    setIsPublishing(true)
    setPublishStep('Publishing to Webflow...')

    try {
      const response = await fetch('/api/webflow/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          photos: initialData.photos,
          draft: false,
        }),
      })

      if (!response.ok) throw new Error('Publishing failed')

      const result = await response.json()

      alert('Published successfully! 🎉')
      console.log('Published:', result)

      // Clear session storage
      sessionStorage.removeItem('pending-upload')

      // Redirect to success page
      window.location.href = '/gallery'
    } catch (error) {
      console.error('Publish error:', error)
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsPublishing(false)
      setPublishStep('')
    }
  }

  return (
    <div className="space-y-8">
      {/* Main Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
          Gallery Details
        </h3>

        <div className="space-y-6">
          <EditableField
            label="Title"
            value={content.title}
            onChange={(value) => updateField('title', value)}
            maxLength={60}
            hint="SEO-optimized title (50-60 characters)"
          />

          <EditableField
            label="Slug"
            value={content.slug}
            onChange={(value) => updateField('slug', value)}
            hint="URL-friendly slug"
          />

          <EditableField
            label="Description"
            value={content.description}
            onChange={(value) => updateField('description', value)}
            multiline
            rows={3}
            hint="Compelling 2-3 sentence description"
          />

          <EditableField
            label="Meta Description (SEO)"
            value={content.metaDescription}
            onChange={(value) => updateField('metaDescription', value)}
            multiline
            rows={2}
            maxLength={160}
            hint="150-160 characters for search engines"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <select
              value={content.category}
              onChange={(e) => updateField('category', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option>Portrait</option>
              <option>Fashion</option>
              <option>Product</option>
              <option>Editorial</option>
              <option>Fine Art</option>
              <option>Personal Work</option>
              <option>Commercial</option>
              <option>Other</option>
            </select>
          </div>

          <EditableField
            label="Tags"
            value={content.tags.join(', ')}
            onChange={(value) => updateField('tags', value.split(',').map(t => t.trim()))}
            hint="Comma-separated tags"
          />

          <EditableField
            label="SEO Keywords"
            value={content.seoKeywords.join(', ')}
            onChange={(value) => updateField('seoKeywords', value.split(',').map(k => k.trim()))}
            hint="Comma-separated keywords"
          />
        </div>
      </div>

      {/* Photos Grid */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
          Photos ({initialData.photos.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {initialData.photos.map((photo, index) => (
            <div key={photo.id} className="space-y-3">
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                <Image
                  src={photo.optimizedUrl || photo.url}
                  alt={content.photos[index]?.alt || `Photo ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>

              <EditableField
                label={`Caption ${index + 1}`}
                value={content.photos[index]?.caption || ''}
                onChange={(value) => updatePhotoField(index, 'caption', value)}
                multiline
                rows={2}
              />

              <EditableField
                label={`Alt Text ${index + 1}`}
                value={content.photos[index]?.alt || ''}
                onChange={(value) => updatePhotoField(index, 'alt', value)}
                hint="For accessibility"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Transcription (if available) */}
      {initialData.audio?.transcription && (
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
            📝 Original Transcription
          </h3>
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
            {initialData.audio.transcription}
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 justify-center">
        <button
          onClick={handleRegenerate}
          disabled={isPublishing}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <span>🔄</span>
          <span>Regenerate Content</span>
        </button>

        <button
          onClick={handleSaveDraft}
          disabled={isPublishing}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <span>💾</span>
          <span>Save as Draft</span>
        </button>

        <button
          onClick={handlePublishLive}
          disabled={isPublishing}
          className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-semibold"
        >
          {isPublishing ? (
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
              <span>{publishStep || 'Publishing...'}</span>
            </>
          ) : (
            <>
              <span>🚀</span>
              <span>Publish Live</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
