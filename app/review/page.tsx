'use client'

import { useEffect, useState } from 'react'
import { ReviewInterface } from '@/components/review-interface'

export default function ReviewPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load data from sessionStorage
    const stored = sessionStorage.getItem('pending-upload')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setData(parsed)
      } catch (error) {
        console.error('Error parsing stored data:', error)
      }
    }
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🤔</div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          No Content to Review
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Upload some photos first to generate content
        </p>
        <a
          href="/"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go to Upload
        </a>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
          Review Generated Content
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Edit as needed, then publish to your website
        </p>
      </div>

      <ReviewInterface initialData={data} />
    </div>
  )
}
