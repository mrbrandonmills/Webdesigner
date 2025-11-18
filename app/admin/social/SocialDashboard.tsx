'use client'

/**
 * Interactive Social Media Dashboard
 *
 * Client component with form handling and API calls
 */

import { useState } from 'react'

interface RedditPost {
  subreddit: string
  title: string
  text: string
  flairText?: string
  scheduleFor?: string
}

export default function SocialDashboard() {
  const [activeTab, setActiveTab] = useState<'reddit' | 'medium' | 'analytics' | 'settings'>('reddit')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const [redditPost, setRedditPost] = useState<RedditPost>({
    subreddit: 'malegrooming',
    title: '',
    text: '',
    scheduleFor: '',
  })

  const handleSubmitRedditPost = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const response = await fetch('/api/social/reddit/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(redditPost),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to post')
      }

      setMessage({
        type: 'success',
        text: data.scheduled
          ? `Post scheduled for ${new Date(redditPost.scheduleFor!).toLocaleString()}`
          : `Posted successfully! View at: ${data.url}`,
      })

      // Reset form
      setRedditPost({
        subreddit: 'malegrooming',
        title: '',
        text: '',
        scheduleFor: '',
      })
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.message || 'Failed to post to Reddit',
      })
    } finally {
      setLoading(false)
    }
  }

  const loadTemplate = (template: 'braun-ipl') => {
    if (template === 'braun-ipl') {
      setRedditPost({
        ...redditPost,
        title: 'Week 1 with Braun IPL: Honest review from a male model who\\'s tried everything',
        text: `I've been hairless since sixteen. Not genetics—choice.

When the Braun Silk Expert Pro 7 arrived, I committed to documenting honestly. Here's my first week.

**Why I Tried It:**
- Tired of daily shaving
- Salon laser costs $3k-5k
- Braun IPL: $500, 400k flashes, 20+ year lifespan

**Week 1 Results:**

Day 1: Started level 3, ended on 5. Warm pulses, not painful. 15 min for both arms.

Day 3: Hair growing back SLOWER than usual. Patchy regrowth.

Day 7: Sparse regrowth on arms. Legs almost invisible in treated areas.

**Honest Verdict:**

PROS:
✓ Actually works (visible results Week 1)
✓ Minimal pain (2/10)
✓ Cost-effective vs salon
✓ Privacy

CONS:
✗ Not instant (4-12 weeks full results)
✗ Doesn't work on dark skin or light hair
✗ Requires commitment

**Who Should Buy:**
✓ Light to medium skin + dark hair
✓ Tired of shaving/waxing
✓ Want permanent solution

**Who Should Skip:**
✗ Very dark skin (safety concern)
✗ Blonde/red/gray hair (physics—won't work)
✗ Need instant results

The Math:
- Braun IPL: $500 (one-time)
- Salon laser: $3k-5k
- Lifetime waxing: $12k+

Full breakdown with photos: https://brandonmills.com/blog/braun-ipl-first-week

Worth the $500? For me, yes.

Happy to answer questions.`,
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Social Media Dashboard</h1>
          <p className="text-gray-400">
            Manage posts across Reddit, Medium, and other platforms
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <StatCard
            title="Scheduled Posts"
            value="3"
            icon="📅"
            color="blue"
          />
          <StatCard
            title="Published Today"
            value="2"
            icon="✅"
            color="green"
          />
          <StatCard
            title="Total Reach"
            value="1.2K"
            icon="👁️"
            color="purple"
          />
          <StatCard
            title="Engagement Rate"
            value="8.3%"
            icon="💬"
            color="orange"
          />
        </div>

        {/* Main Content - Tabs */}
        <div className="bg-gray-800 rounded-lg shadow-xl">
          {/* Tab Navigation */}
          <div className="border-b border-gray-700">
            <nav className="flex gap-8 px-6">
              <TabButton active={activeTab === 'reddit'} onClick={() => setActiveTab('reddit')}>
                Reddit
              </TabButton>
              <TabButton active={activeTab === 'medium'} onClick={() => setActiveTab('medium')}>
                Medium
              </TabButton>
              <TabButton active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')}>
                Analytics
              </TabButton>
              <TabButton active={activeTab === 'settings'} onClick={() => setActiveTab('settings')}>
                Settings
              </TabButton>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'reddit' && (
              <div className="space-y-8">
                {/* Message Display */}
                {message && (
                  <div
                    className={`p-4 rounded-lg border ${
                      message.type === 'success'
                        ? 'bg-green-500/20 border-green-500/30 text-green-400'
                        : 'bg-red-500/20 border-red-500/30 text-red-400'
                    }`}
                  >
                    {message.text}
                  </div>
                )}

                {/* Create New Post Section */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Create Reddit Post</h2>
                    <button
                      onClick={() => loadTemplate('braun-ipl')}
                      className="text-sm bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors"
                    >
                      📝 Load Braun IPL Template
                    </button>
                  </div>

                  <form onSubmit={handleSubmitRedditPost} className="space-y-6">
                    {/* Subreddit Selection */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Select Subreddit
                      </label>
                      <select
                        value={redditPost.subreddit}
                        onChange={(e) => setRedditPost({ ...redditPost, subreddit: e.target.value })}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="malegrooming">r/malegrooming</option>
                        <option value="SkincareAddiction">r/SkincareAddiction</option>
                        <option value="BuyItForLife">r/BuyItForLife</option>
                        <option value="productivity">r/productivity</option>
                      </select>
                    </div>

                    {/* Post Title */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Post Title
                      </label>
                      <input
                        type="text"
                        value={redditPost.title}
                        onChange={(e) => setRedditPost({ ...redditPost, title: e.target.value })}
                        placeholder="Week 1 with Braun IPL: Honest review from a male model"
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    {/* Post Content */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Post Content
                      </label>
                      <textarea
                        value={redditPost.text}
                        onChange={(e) => setRedditPost({ ...redditPost, text: e.target.value })}
                        rows={12}
                        placeholder="I've been hairless since sixteen. Not genetics—choice..."
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                        required
                      />
                    </div>

                    {/* Schedule Options */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Schedule Date/Time (Optional)
                      </label>
                      <input
                        type="datetime-local"
                        value={redditPost.scheduleFor}
                        onChange={(e) => setRedditPost({ ...redditPost, scheduleFor: e.target.value })}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <p className="text-xs text-gray-400 mt-2">
                        Leave empty to post immediately
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-colors"
                      >
                        {loading ? '⏳ Posting...' : redditPost.scheduleFor ? '📅 Schedule Post' : '🚀 Post Now'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {activeTab === 'medium' && (
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold mb-4">Medium Import</h2>
                <p className="text-gray-400 mb-6">
                  Run: <code className="bg-gray-700 px-2 py-1 rounded">npm run auto-import:medium</code>
                </p>
                <p className="text-sm text-gray-500">
                  Or build web interface (coming soon)
                </p>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold mb-4">Analytics Dashboard</h2>
                <p className="text-gray-400 mb-6">
                  Run: <code className="bg-gray-700 px-2 py-1 rounded">npm run traffic:dashboard</code>
                </p>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold mb-4">Settings</h2>
                <div className="bg-gray-700 rounded-lg p-6">
                  <h3 className="font-medium mb-4">Reddit Credentials</h3>
                  <p className="text-sm text-gray-400">
                    Configure in <code className="bg-gray-800 px-2 py-1 rounded">.env.local</code>
                  </p>
                  <pre className="mt-4 bg-gray-800 p-4 rounded text-xs">
{`REDDIT_CLIENT_ID=your_client_id
REDDIT_CLIENT_SECRET=your_client_secret
REDDIT_USERNAME=your_username
REDDIT_PASSWORD=your_password`}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string
  value: string
  icon: string
  color: 'blue' | 'green' | 'purple' | 'orange'
}) {
  const colorClasses = {
    blue: 'from-blue-500/20 to-blue-600/20 border-blue-500/30',
    green: 'from-green-500/20 to-green-600/20 border-green-500/30',
    purple: 'from-purple-500/20 to-purple-600/20 border-purple-500/30',
    orange: 'from-orange-500/20 to-orange-600/20 border-orange-500/30',
  }

  return (
    <div
      className={`bg-gradient-to-br ${colorClasses[color]} border rounded-lg p-6`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{icon}</span>
        <span className="text-3xl font-bold">{value}</span>
      </div>
      <p className="text-sm text-gray-400">{title}</p>
    </div>
  )
}

function TabButton({
  active = false,
  onClick,
  children,
}: {
  active?: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`py-4 px-2 font-medium border-b-2 transition-colors ${
        active
          ? 'border-blue-500 text-blue-500'
          : 'border-transparent text-gray-400 hover:text-gray-300'
      }`}
    >
      {children}
    </button>
  )
}
