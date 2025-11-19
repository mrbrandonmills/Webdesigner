'use client'

import { InlineEmailForm } from './inline-form'
import Link from 'next/link'
import { ArrowRight, Moon } from 'lucide-react'

interface BlogEmailCTAProps {
  variant?: 'default' | 'featured'
  showDreamAnalyzer?: boolean
}

export function BlogEmailCTA({
  variant = 'featured',
  showDreamAnalyzer = true
}: BlogEmailCTAProps) {
  return (
    <div className="my-12 space-y-8">
      {/* Email Capture */}
      <InlineEmailForm
        variant={variant}
        headline="Get the Free Dream Symbols Guide"
        subtext="100 dream symbols decoded + weekly insights on Jungian psychology and self-discovery."
        buttonText="Get the Free Guide"
        source="blog-cta"
      />

      {/* Optional Dream Analyzer CTA */}
      {showDreamAnalyzer && (
        <div className="p-6 bg-white/5 border border-white/10 rounded-xl text-center">
          <p className="text-gray-400 mb-4">
            Have a specific dream you want analyzed? Try our free AI-powered Dream Decoder.
          </p>
          <Link
            href="/dreams"
            className="inline-flex items-center gap-2 px-6 py-3 bg-transparent border border-[#C9A050]/50 text-[#C9A050] font-medium rounded-lg hover:bg-[#C9A050]/10 transition-colors"
          >
            <Moon className="w-5 h-5" />
            Analyze Your Dream
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  )
}

export default BlogEmailCTA
