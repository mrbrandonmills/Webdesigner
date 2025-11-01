import { UploadInterface } from '@/components/upload-interface'

export default function Home() {
  return (
    <div className="space-y-6">
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
