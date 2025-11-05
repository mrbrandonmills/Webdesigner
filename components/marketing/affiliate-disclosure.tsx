'use client'

import { useState } from 'react'
import { Info, X } from 'lucide-react'
import { getAffiliateDisclosure } from '@/lib/affiliate-manager'

interface AffiliateDisclosureProps {
  type?: 'banner' | 'inline' | 'popup' | 'footer'
  variant?: 'full' | 'short'
  className?: string
}

export function AffiliateDisclosure({
  type = 'inline',
  variant = 'short',
  className = '',
}: AffiliateDisclosureProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  const disclosureText = getAffiliateDisclosure(variant)

  if (isDismissed && type === 'banner') {
    return null
  }

  // Banner disclosure (top of page)
  if (type === 'banner') {
    return (
      <div className={`bg-gray-100 border-b border-gray-200 ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-start">
              <Info className="text-gray-500 mt-0.5 mr-2 flex-shrink-0" size={16} />
              <p className="text-sm text-gray-700">
                {disclosureText}
                {variant === 'short' && (
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="ml-2 text-blue-600 hover:text-blue-700 underline"
                  >
                    {isExpanded ? 'Less' : 'More'}
                  </button>
                )}
              </p>
            </div>
            <button
              onClick={() => setIsDismissed(true)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          </div>
          {isExpanded && variant === 'short' && (
            <div className="mt-2 ml-6 text-sm text-gray-600">
              {getAffiliateDisclosure('full')}
            </div>
          )}
        </div>
      </div>
    )
  }

  // Inline disclosure (within content)
  if (type === 'inline') {
    return (
      <div className={`bg-blue-50 border-l-4 border-blue-400 p-4 my-4 ${className}`}>
        <div className="flex">
          <Info className="text-blue-400 flex-shrink-0" size={20} />
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              <strong>Affiliate Disclosure:</strong> {disclosureText}
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Popup disclosure
  if (type === 'popup') {
    if (!isExpanded) {
      return (
        <button
          onClick={() => setIsExpanded(true)}
          className={`fixed bottom-4 right-4 bg-black text-white p-3 rounded-full shadow-lg hover:bg-gray-800 z-40 ${className}`}
        >
          <Info size={24} />
        </button>
      )
    }

    return (
      <div className="fixed bottom-4 right-4 max-w-sm bg-white border border-gray-200 rounded-lg shadow-xl p-4 z-40">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-gray-900">Affiliate Disclosure</h3>
          <button
            onClick={() => setIsExpanded(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>
        <p className="text-sm text-gray-600">{disclosureText}</p>
      </div>
    )
  }

  // Footer disclosure
  if (type === 'footer') {
    return (
      <div className={`text-center py-4 ${className}`}>
        <p className="text-xs text-gray-500 max-w-3xl mx-auto">
          {disclosureText}
        </p>
      </div>
    )
  }

  return null
}

// Specific disclosure for product pages
export function ProductPageDisclosure() {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
      <div className="flex items-start">
        <Info className="text-amber-600 mt-0.5 mr-3 flex-shrink-0" size={20} />
        <div>
          <h4 className="font-medium text-amber-900 mb-1">
            Partner Disclosure
          </h4>
          <p className="text-sm text-amber-800">
            This page contains affiliate links. If you purchase through these links,
            we may earn a commission at no additional cost to you. We only recommend
            products we genuinely believe in and have tested ourselves.
          </p>
          <a
            href="/affiliate-disclosure"
            className="text-sm text-amber-600 hover:text-amber-700 underline mt-2 inline-block"
          >
            Learn more about our affiliate policy
          </a>
        </div>
      </div>
    </div>
  )
}

// Mini disclosure for individual links
export function InlineAffiliateLabel() {
  return (
    <span className="inline-flex items-center text-xs text-gray-500 ml-1">
      <Info size={12} className="mr-1" />
      affiliate
    </span>
  )
}