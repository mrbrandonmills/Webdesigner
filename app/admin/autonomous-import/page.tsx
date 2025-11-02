'use client'

import { useState, useEffect } from 'react'

interface Post {
  index: number
  title: string
  imageCount: number
  description: string
  date: string
}

export default function AutonomousImportPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [importing, setImporting] = useState<number | null>(null)
  const [results, setResults] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Load available posts
    fetch('/api/autonomous-import')
      .then(res => res.json())
      .then(data => setPosts(data.availablePosts))
      .catch(err => setError(err.message))
  }, [])

  const importPost = async (postIndex: number) => {
    setImporting(postIndex)
    setError(null)

    try {
      const response = await fetch('/api/autonomous-import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postIndex }),
      })

      const data = await response.json()

      if (response.ok) {
        setResults(prev => [...prev, data])
      } else {
        throw new Error(data.error || 'Import failed')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setImporting(null)
    }
  }

  const importAll = async () => {
    for (let i = 0; i < posts.length; i++) {
      await importPost(i)
      // Wait 5 seconds between imports to avoid rate limits
      if (i < posts.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 5000))
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h1 className="text-3xl font-bold mb-2">🤖 Autonomous Portfolio Importer</h1>
          <p className="text-gray-600 mb-6">
            Import your quality portfolio posts with AI-enhanced descriptions
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">How it works:</h3>
            <ol className="list-decimal list-inside text-blue-800 space-y-1 text-sm">
              <li>Click "Import" on any post below</li>
              <li>Claude enhances the description using your brand voice</li>
              <li>SEO metadata is generated automatically</li>
              <li>Post is published to Webflow (live immediately!)</li>
              <li>All images are included (main + gallery)</li>
            </ol>
          </div>

          <button
            onClick={importAll}
            disabled={importing !== null || posts.length === 0}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed mb-6 transition-all"
          >
            {importing !== null ? '⏳ Importing...' : '🚀 Import All Posts (Autonomous Mode)'}
          </button>
        </div>

        {/* Posts List */}
        <div className="grid gap-6">
          {posts.map((post) => {
            const isImported = results.some(r => r.post?.original?.title === post.title)
            const isImporting = importing === post.index

            return (
              <div
                key={post.index}
                className={`bg-white rounded-lg shadow-md p-6 border-2 ${
                  isImported ? 'border-green-500 bg-green-50' : 'border-transparent'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                      {post.title}
                      {isImported && <span className="text-green-600 text-sm">✅ Imported</span>}
                    </h2>
                    <p className="text-gray-600 text-sm mb-2">{post.description}</p>
                    <div className="flex gap-4 text-xs text-gray-500">
                      <span>📸 {post.imageCount} images</span>
                      <span>📅 {new Date(post.date).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => importPost(post.index)}
                    disabled={isImporting || isImported}
                    className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                      isImported
                        ? 'bg-green-100 text-green-700 cursor-not-allowed'
                        : isImporting
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {isImporting ? '⏳ Importing...' : isImported ? '✅ Imported' : '🚀 Import'}
                  </button>
                </div>

                {/* Show result if imported */}
                {isImported && (
                  <div className="mt-4 pt-4 border-t border-green-200">
                    {results.map((result, i) => {
                      if (result.post?.original?.title === post.title) {
                        return (
                          <div key={i} className="text-sm space-y-2">
                            <div>
                              <strong className="text-green-700">Enhanced Title:</strong>
                              <p className="text-gray-800">{result.post.enhanced.title}</p>
                            </div>
                            <div>
                              <strong className="text-green-700">Category:</strong>
                              <span className="ml-2 bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                                {result.post.enhanced.category}
                              </span>
                            </div>
                            <div>
                              <strong className="text-green-700">Webflow URL:</strong>
                              <a
                                href={result.post.webflowUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ml-2 text-blue-600 hover:underline"
                              >
                                {result.post.webflowUrl}
                              </a>
                            </div>
                          </div>
                        )
                      }
                      return null
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="font-semibold text-red-900 mb-2">❌ Error</h3>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Success Summary */}
        {results.length > 0 && (
          <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="font-semibold text-green-900 mb-4">✅ Import Summary</h3>
            <p className="text-green-700 mb-4">
              Successfully imported {results.length} post{results.length !== 1 ? 's' : ''}
            </p>
            <div className="space-y-2">
              {results.map((result, i) => (
                <div key={i} className="text-sm text-green-800">
                  • {result.post?.enhanced?.title}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
