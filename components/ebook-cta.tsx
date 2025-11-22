/**
 * Ebook CTA Component
 * Promotes "Random Acts of Self-Actualization" across the site
 */

import Link from 'next/link'
import { ebookConfig, getEbookUrl } from '@/lib/ebook-config'

interface EbookCTAProps {
  variant?: 'inline' | 'card' | 'sidebar' | 'footer'
  source?: string
  className?: string
}

export function EbookCTA({ variant = 'inline', source, className = '' }: EbookCTAProps) {
  const purchaseUrl = getEbookUrl(source)

  if (variant === 'inline') {
    return (
      <div className={`my-8 p-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg border border-purple-200 dark:border-purple-800 ${className}`}>
        <p className="text-sm font-medium text-purple-900 dark:text-purple-100 mb-2">
          📖 Enjoyed this essay?
        </p>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Dive deeper into these ideas in my book: <span className="font-semibold">{ebookConfig.fullTitle}</span>
        </p>
        <a
          href={purchaseUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
        >
          Read on Amazon →
        </a>
      </div>
    )
  }

  if (variant === 'card') {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden ${className}`}>
        <div className="p-6">
          <div className="flex items-start gap-4">
            {/* Book cover placeholder - replace with actual cover image */}
            <div className="flex-shrink-0 w-24 h-36 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg shadow-md flex items-center justify-center">
              <span className="text-white text-4xl">📖</span>
            </div>

            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                {ebookConfig.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {ebookConfig.subtitle}
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                {ebookConfig.shortDescription}
              </p>
              <a
                href={purchaseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Get the Book →
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (variant === 'sidebar') {
    return (
      <div className={`bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-6 border border-purple-200 dark:border-purple-800 ${className}`}>
        <div className="text-center mb-4">
          <div className="w-20 h-28 mx-auto bg-gradient-to-br from-purple-600 to-blue-600 rounded shadow-lg flex items-center justify-center mb-3">
            <span className="text-white text-3xl">📖</span>
          </div>
          <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-1">
            {ebookConfig.title}
          </h4>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
            {ebookConfig.subtitle}
          </p>
        </div>
        <p className="text-xs text-gray-700 dark:text-gray-300 mb-4 text-center">
          {ebookConfig.tagline}
        </p>
        <a
          href={purchaseUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          Read My Story
        </a>
      </div>
    )
  }

  if (variant === 'footer') {
    return (
      <div className={`border-t border-gray-200 dark:border-gray-700 pt-8 mt-12 ${className}`}>
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            If you enjoyed this essay, explore the complete trilogy
          </p>
          <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {ebookConfig.fullTitle}
          </h4>
          <p className="text-gray-700 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
            {ebookConfig.shortDescription}
          </p>

          {/* Trilogy Options */}
          <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-6">
            {/* Book 1 */}
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-purple-400 dark:hover:border-purple-600 transition-colors">
              <h5 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">
                Volume 1
              </h5>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                Building a Non-Addictive Life
              </p>
              <a
                href={ebookConfig.volumes[0].amazonUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                $9.99 on Amazon →
              </a>
            </div>

            {/* Block B */}
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-purple-400 dark:hover:border-purple-600 transition-colors">
              <h5 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">
                Block B
              </h5>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                Continuing the Journey
              </p>
              <a
                href={ebookConfig.volumes[1].amazonUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                $6.99 on Amazon →
              </a>
            </div>

            {/* Block 3 - FREE */}
            <div className="p-4 border-2 border-amber-500 dark:border-amber-600 rounded-lg bg-amber-50 dark:bg-amber-900/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-bl">
                FREE
              </div>
              <h5 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">
                Block 3
              </h5>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                The Laboratory of Living
              </p>
              <Link
                href="/book/block-3"
                className="block w-full px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Read FREE Now →
              </Link>
            </div>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 italic">
            Block 3 is exclusive to brandonmills.com - read it free before it's published on Amazon
          </p>
        </div>
      </div>
    )
  }

  return null
}

/**
 * Compact ebook mention for blog post outros
 */
export function EbookMention({ className = '' }: { className?: string }) {
  return (
    <p className={`text-sm text-gray-600 dark:text-gray-400 italic ${className}`}>
      <span className="font-medium">Want more?</span> This essay is part of the larger exploration in{' '}
      <a
        href={getEbookUrl('blog-mention')}
        target="_blank"
        rel="noopener noreferrer"
        className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
      >
        Random Acts of Self-Actualization
      </a>
      .
    </p>
  )
}
