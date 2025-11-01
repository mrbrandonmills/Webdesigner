'use client'

import { useState } from 'react'

export default function AdminPage() {
  const [url, setUrl] = useState('')
  const [isAuditing, setIsAuditing] = useState(false)
  const [styleGuide, setStyleGuide] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleAudit = async () => {
    if (!url) {
      alert('Please enter a website URL')
      return
    }

    setIsAuditing(true)
    setError(null)

    try {
      const response = await fetch('/api/audit-site', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Audit failed')
      }

      const result = await response.json()
      setStyleGuide(result.styleGuide)

      // Save to localStorage for future content generation
      localStorage.setItem('siteStyleGuide', JSON.stringify(result.styleGuide))
      localStorage.setItem('styleGuideUrl', url)
      localStorage.setItem('styleGuideTimestamp', result.timestamp)

      alert('✅ Site audit complete! Style guide saved. AI will now match your brand.')
    } catch (error) {
      console.error('Audit error:', error)
      setError(error instanceof Error ? error.message : 'Unknown error')
    } finally {
      setIsAuditing(false)
    }
  }

  const handleClearStyleGuide = () => {
    if (confirm('Clear saved style guide? AI will use generic style until next audit.')) {
      localStorage.removeItem('siteStyleGuide')
      localStorage.removeItem('styleGuideUrl')
      localStorage.removeItem('styleGuideTimestamp')
      setStyleGuide(null)
      alert('Style guide cleared')
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
          Site Audit & Style Learning
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Teach AI to write in your voice by analyzing your existing website
        </p>
      </div>

      {/* Audit Form */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          1. Analyze Your Current Website
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Website URL (Squarespace, existing site, etc.)
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://yourwebsite.com"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              disabled={isAuditing}
            />
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Enter your current website URL. AI will crawl and analyze your writing style, brand voice, and visual aesthetic.
            </p>
          </div>

          <button
            onClick={handleAudit}
            disabled={isAuditing || !url}
            className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold text-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {isAuditing ? (
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
                <span>Analyzing website... (may take 2-3 minutes)</span>
              </>
            ) : (
              <>
                <span>🔍</span>
                <span>Run Site Audit</span>
              </>
            )}
          </button>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-800 dark:text-red-300 font-medium">Error:</p>
              <p className="text-red-700 dark:text-red-400 text-sm mt-1">{error}</p>
            </div>
          )}
        </div>
      </div>

      {/* What Gets Analyzed */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
        <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
          🧠 What the AI Learns
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300">
          <div>
            <strong>Writing Style:</strong>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>Tone and voice</li>
              <li>Sentence structure</li>
              <li>Vocabulary and phrases</li>
              <li>How you describe your work</li>
            </ul>
          </div>
          <div>
            <strong>Brand Personality:</strong>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>Your values and approach</li>
              <li>Target audience</li>
              <li>Unique selling points</li>
              <li>Emotional tone</li>
            </ul>
          </div>
          <div>
            <strong>Content Patterns:</strong>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>Title formatting</li>
              <li>Description style</li>
              <li>Caption approach</li>
              <li>SEO strategy</li>
            </ul>
          </div>
          <div>
            <strong>Business Intelligence:</strong>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>Services offered</li>
              <li>Pricing positioning</li>
              <li>Geographic focus</li>
              <li>Specialties</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Style Guide Display */}
      {styleGuide && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
              ✨ Your Style Guide
            </h3>
            <button
              onClick={handleClearStyleGuide}
              className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Clear Style Guide
            </button>
          </div>

          {/* Writing Style */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h4 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
              ✍️ Writing Style
            </h4>
            <div className="space-y-3 text-gray-700 dark:text-gray-300">
              <div>
                <strong>Tone:</strong> {styleGuide.writingStyle.tone}
              </div>
              <div>
                <strong>Voice:</strong> {styleGuide.writingStyle.voice}
              </div>
              <div>
                <strong>Sentence Structure:</strong> {styleGuide.writingStyle.sentenceStructure}
              </div>
              <div>
                <strong>Vocabulary:</strong>
                <div className="flex flex-wrap gap-2 mt-2">
                  {styleGuide.writingStyle.vocabulary.map((word: string, i: number) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                    >
                      {word}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <strong>Example Phrases:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1 italic">
                  {styleGuide.writingStyle.examplePhrases.map((phrase: string, i: number) => (
                    <li key={i}>"{phrase}"</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Content Patterns */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h4 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
              📝 Content Patterns
            </h4>
            <div className="space-y-3 text-gray-700 dark:text-gray-300">
              <div>
                <strong>Title Style:</strong> {styleGuide.contentPatterns.titleStyle}
              </div>
              <div>
                <strong>Description Style:</strong> {styleGuide.contentPatterns.descriptionStyle}
              </div>
              <div>
                <strong>Caption Style:</strong> {styleGuide.contentPatterns.captionStyle}
              </div>
              <div>
                <strong>SEO Approach:</strong> {styleGuide.contentPatterns.seoApproach}
              </div>
            </div>
          </div>

          {/* Brand Personality */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h4 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
              💎 Brand Personality
            </h4>
            <div className="space-y-3 text-gray-700 dark:text-gray-300">
              <div>
                <strong>Values:</strong>
                <div className="flex flex-wrap gap-2 mt-2">
                  {styleGuide.brandPersonality.values.map((value: string, i: number) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm"
                    >
                      {value}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <strong>Target Audience:</strong> {styleGuide.brandPersonality.targetAudience}
              </div>
              <div>
                <strong>Unique Selling Points:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  {styleGuide.brandPersonality.uniqueSellingPoints.map((point: string, i: number) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>
              </div>
              <div>
                <strong>Emotional Tone:</strong> {styleGuide.brandPersonality.emotionalTone}
              </div>
            </div>
          </div>

          {/* Business Info */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h4 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
              💼 Business Information
            </h4>
            <div className="space-y-3 text-gray-700 dark:text-gray-300">
              <div>
                <strong>Services:</strong>
                <div className="flex flex-wrap gap-2 mt-2">
                  {styleGuide.businessInfo.services.map((service: string, i: number) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <strong>Price Positioning:</strong> {styleGuide.businessInfo.priceIndicators}
              </div>
              <div>
                <strong>Location:</strong> {styleGuide.businessInfo.location}
              </div>
              <div>
                <strong>Specialties:</strong>
                <div className="flex flex-wrap gap-2 mt-2">
                  {styleGuide.businessInfo.specialties.map((specialty: string, i: number) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 rounded-full text-sm"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg p-6 border border-yellow-200 dark:border-yellow-800">
            <h4 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
              💡 AI Recommendations
            </h4>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <div>
                <strong>Content Improvements:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  {styleGuide.recommendations.contentImprovements.map((rec: string, i: number) => (
                    <li key={i}>{rec}</li>
                  ))}
                </ul>
              </div>
              <div>
                <strong>SEO Opportunities:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  {styleGuide.recommendations.seoOpportunities.map((rec: string, i: number) => (
                    <li key={i}>{rec}</li>
                  ))}
                </ul>
              </div>
              <div>
                <strong>Store Optimizations:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  {styleGuide.recommendations.storeOptimizations.map((rec: string, i: number) => (
                    <li key={i}>{rec}</li>
                  ))}
                </ul>
              </div>
              <div>
                <strong>Audience Growth:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  {styleGuide.recommendations.audienceGrowth.map((rec: string, i: number) => (
                    <li key={i}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 border border-green-200 dark:border-green-800">
            <h4 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
              ✅ Style Guide Saved!
            </h4>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Your style guide has been saved. When you upload new photos, the AI will automatically:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li>Write in your unique voice and tone</li>
              <li>Match your existing content patterns</li>
              <li>Use your vocabulary and phrases</li>
              <li>Follow your SEO strategy</li>
              <li>Maintain your brand personality</li>
            </ul>
            <div className="mt-6">
              <a
                href="/"
                className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
              >
                🚀 Go Upload Your Shoots!
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      {!styleGuide && !isAuditing && (
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
            📋 How It Works
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
            <li>Enter your current website URL (Squarespace, or any site)</li>
            <li>AI crawls your homepage + portfolio/gallery pages</li>
            <li>Analyzes your writing style, brand voice, and business info</li>
            <li>Creates a detailed style guide (takes 2-3 minutes)</li>
            <li>Style guide is saved and used for all future content generation</li>
            <li>Upload new shoots - AI writes in YOUR voice automatically!</li>
          </ol>
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            <strong>Note:</strong> Run this audit once when you first set up the system. Re-run anytime you want to update your style preferences or if your brand evolves.
          </p>
        </div>
      )}
    </div>
  )
}
