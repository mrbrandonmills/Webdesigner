import { UploadInterface } from '@/components/upload-interface'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="space-y-6">
      {/* Autonomous Import Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 shadow-2xl border border-purple-400/30">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-white">
            <h2 className="text-3xl font-bold mb-2">🤖 Build Complete Portfolio Site</h2>
            <p className="text-purple-100 text-lg">
              Import all 10 posts from Squarespace with AI-enhanced content
            </p>
          </div>
          <Link
            href="/admin/autonomous-import-all"
            className="bg-white text-purple-600 font-bold text-xl px-8 py-4 rounded-xl hover:bg-purple-50 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 whitespace-nowrap"
          >
            🚀 Start Import
          </Link>
        </div>
      </div>

      <div className="text-center space-y-2">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
          Upload Your Latest Shoot
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Drop your photos and voice memo - AI handles the rest
        </p>
      </div>

      <UploadInterface />

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="text-3xl mb-3">🎤</div>
          <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
            Voice Notes
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Record or upload your notes about the shoot - AI transcribes and extracts key details
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="text-3xl mb-3">✨</div>
          <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
            AI Content
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Generates SEO-optimized titles, descriptions, captions, and meta tags in your voice
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="text-3xl mb-3">🚀</div>
          <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
            Auto-Publish
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Review and publish to Webflow with one click - theme and styling applied automatically
          </p>
        </div>
      </div>
    </div>
  )
}
