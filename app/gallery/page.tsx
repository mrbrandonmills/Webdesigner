export default function GalleryPage() {
  return (
    <div className="text-center py-12">
      <div className="text-6xl mb-4">🎉</div>
      <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
        Success!
      </h2>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
        Your gallery has been published to Webflow
      </p>

      <div className="flex gap-4 justify-center">
        <a
          href="/"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Upload Another Shoot
        </a>
        <a
          href={process.env.NEXT_PUBLIC_WEBFLOW_SITE_URL || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          View on Website
        </a>
      </div>

      <div className="mt-12 max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            What's Next?
          </h3>
          <ul className="text-left space-y-3 text-gray-600 dark:text-gray-400">
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span>Your content is live on Webflow (or saved as draft)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span>Images are optimized with Cloudinary for fast loading</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span>SEO meta tags are configured automatically</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">→</span>
              <span>Share on social media to drive traffic</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">→</span>
              <span>Monitor analytics to track performance</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
