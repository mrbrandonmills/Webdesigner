'use client'

import { useState, useEffect } from 'react'

interface Post {
  index: number
  title: string
  imageCount: number
  status: string
  hasRealContent: boolean
  description: string
  date: string
}

export default function AutonomousImportAllPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [importing, setImporting] = useState<number | null>(null)
  const [results, setResults] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const [importingAll, setImportingAll] = useState(false)

  useEffect(() => {
    // Load available posts
    fetch('/api/autonomous-import-all')
      .then(res => res.json())
      .then(data => setPosts(data.availablePosts))
      .catch(err => setError(err.message))
  }, [])

  const importPost = async (postIndex: number) => {
    setImporting(postIndex)
    setError(null)

    try {
      const response = await fetch('/api/autonomous-import-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postIndex }),
      })

      const data = await response.json()

      if (response.ok) {
        setResults(prev => [...prev, data])
        return { success: true, data }
      } else {
        throw new Error(data.error || 'Import failed')
      }
    } catch (err: any) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setImporting(null)
    }
  }

  const importAll = async () => {
    setImportingAll(true)
    setError(null)

    for (let i = 0; i < posts.length; i++) {
      console.log(`Importing post ${i + 1}/${posts.length}...`)
      await importPost(i)

      // Wait 5 seconds between imports to avoid rate limits
      if (i < posts.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 5000))
      }
    }

    setImportingAll(false)
  }

  const realContentPosts = posts.filter(p => p.hasRealContent)
  const loremIpsumPosts = posts.filter(p => !p.hasRealContent)
  const totalImages = posts.reduce((sum, p) => sum + p.imageCount, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 mb-8 border border-white/20">
          <h1 className="text-4xl font-bold mb-3 text-white">
            🤖 Complete Autonomous Site Builder
          </h1>
          <p className="text-gray-300 mb-6 text-lg">
            Build your entire Brandon Mills portfolio with AI-enhanced content
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-500/20 backdrop-blur rounded-lg p-4 border border-blue-400/30">
              <div className="text-3xl font-bold text-blue-300">{posts.length}</div>
              <div className="text-blue-200 text-sm">Total Posts</div>
            </div>
            <div className="bg-green-500/20 backdrop-blur rounded-lg p-4 border border-green-400/30">
              <div className="text-3xl font-bold text-green-300">{realContentPosts.length}</div>
              <div className="text-green-200 text-sm">To Enhance</div>
            </div>
            <div className="bg-purple-500/20 backdrop-blur rounded-lg p-4 border border-purple-400/30">
              <div className="text-3xl font-bold text-purple-300">{loremIpsumPosts.length}</div>
              <div className="text-purple-200 text-sm">To Generate</div>
            </div>
            <div className="bg-orange-500/20 backdrop-blur rounded-lg p-4 border border-orange-400/30">
              <div className="text-3xl font-bold text-orange-300">{totalImages}</div>
              <div className="text-orange-200 text-sm">Total Images</div>
            </div>
          </div>

          <div className="bg-blue-900/30 border border-blue-400/30 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-blue-100 mb-3 text-lg">🚀 Autonomous Build Process:</h3>
            <ol className="list-decimal list-inside text-blue-200 space-y-2">
              <li>
                <strong className="text-white">Enhance {realContentPosts.length} posts</strong> with real content using brand voice
              </li>
              <li>
                <strong className="text-white">Generate {loremIpsumPosts.length} posts</strong> with Lorem ipsum → create original content
              </li>
              <li>
                <strong className="text-white">Import {totalImages} images</strong> from Squarespace CDN
              </li>
              <li>
                <strong className="text-white">Generate SEO metadata</strong> for all posts
              </li>
              <li>
                <strong className="text-white">Publish to Webflow</strong> CMS automatically
              </li>
            </ol>
          </div>

          <button
            onClick={importAll}
            disabled={importingAll || importing !== null || posts.length === 0}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xl py-4 px-8 rounded-xl hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
          >
            {importingAll
              ? `⏳ Building... (${results.length}/${posts.length})`
              : `🚀 Build Complete Site (${posts.length} Posts)`}
          </button>

          {importingAll && (
            <div className="mt-4">
              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-semibold">Progress</span>
                  <span className="text-blue-300">{results.length}/{posts.length}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${(results.length / posts.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Posts Grid */}
        <div className="grid gap-6">
          {/* Real Content Posts */}
          {realContentPosts.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">
                ✨ Posts to Enhance ({realContentPosts.length})
              </h2>
              <div className="grid gap-4">
                {realContentPosts.map((post) => (
                  <PostCard
                    key={post.index}
                    post={post}
                    importing={importing}
                    results={results}
                    onImport={importPost}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Lorem Ipsum Posts */}
          {loremIpsumPosts.length > 0 && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-white mb-4">
                🎨 Posts to Generate ({loremIpsumPosts.length})
              </h2>
              <div className="grid gap-4">
                {loremIpsumPosts.map((post) => (
                  <PostCard
                    key={post.index}
                    post={post}
                    importing={importing}
                    results={results}
                    onImport={importPost}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-6 bg-red-900/50 border border-red-500/50 rounded-lg p-4 backdrop-blur">
            <h3 className="font-semibold text-red-200 mb-2">❌ Error</h3>
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        {/* Success Summary */}
        {results.length > 0 && (
          <div className="mt-6 bg-green-900/50 border border-green-500/50 rounded-lg p-6 backdrop-blur">
            <h3 className="font-semibold text-green-200 mb-4 text-xl">
              ✅ Import Summary ({results.length}/{posts.length})
            </h3>
            <div className="space-y-2">
              {results.map((result, i) => (
                <div key={i} className="text-sm text-green-200 flex items-start gap-2">
                  <span className="text-green-400">•</span>
                  <div>
                    <div className="font-semibold">{result.post?.enhanced?.title}</div>
                    <div className="text-green-300 text-xs">
                      Category: {result.post?.enhanced?.category} |
                      Images: {result.post?.original?.imageCount} |
                      {result.post?.original?.hadRealContent ? ' Enhanced' : ' Generated'}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {results.length === posts.length && (
              <div className="mt-6 pt-6 border-t border-green-500/30">
                <div className="text-center">
                  <div className="text-3xl mb-2">🎉</div>
                  <h4 className="text-2xl font-bold text-green-100 mb-2">
                    Site Build Complete!
                  </h4>
                  <p className="text-green-200 mb-4">
                    All {posts.length} posts published to Webflow with AI-enhanced content
                  </p>
                  <a
                    href="https://brandonmills.webflow.io"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                  >
                    View Your Site →
                  </a>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function PostCard({ post, importing, results, onImport }: {
  post: Post
  importing: number | null
  results: any[]
  onImport: (index: number) => Promise<any>
}) {
  const isImported = results.some(r => r.post?.original?.title === post.title)
  const isImporting = importing === post.index

  return (
    <div
      className={`bg-white/10 backdrop-blur-lg rounded-xl p-6 border transition-all ${
        isImported
          ? 'border-green-500/50 bg-green-900/20'
          : 'border-white/20 hover:border-white/40'
      }`}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-xl font-bold text-white">{post.title}</h3>
            {!post.hasRealContent && (
              <span className="text-xs bg-purple-500/30 text-purple-200 px-2 py-1 rounded">
                Generate
              </span>
            )}
            {post.hasRealContent && (
              <span className="text-xs bg-blue-500/30 text-blue-200 px-2 py-1 rounded">
                Enhance
              </span>
            )}
          </div>
          <p className="text-gray-300 text-sm mb-3 line-clamp-2">{post.description}</p>
          <div className="flex gap-4 text-xs text-gray-400">
            <span>📸 {post.imageCount} images</span>
            <span>📅 {new Date(post.date).toLocaleDateString()}</span>
            <span className={post.status === 'publish' ? 'text-green-400' : 'text-yellow-400'}>
              {post.status}
            </span>
          </div>
        </div>

        <button
          onClick={() => onImport(post.index)}
          disabled={isImporting || isImported}
          className={`px-6 py-2 rounded-lg font-semibold transition-all ${
            isImported
              ? 'bg-green-600/30 text-green-300 cursor-not-allowed'
              : isImporting
              ? 'bg-blue-600/30 text-blue-300'
              : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
          }`}
        >
          {isImporting ? '⏳ Importing...' : isImported ? '✅ Done' : '🚀 Import'}
        </button>
      </div>
    </div>
  )
}
