'use client'

import { Share2 } from 'lucide-react'

export function ShareButtonBlock3() {
  const handleShare = async () => {
    const shareData = {
      title: 'Random Acts of Self-Actualization: Block 3',
      text: 'Read Block 3 free online - The Laboratory of Living',
      url: 'https://www.brandonmills.com/book/block-3',
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        // Fallback: Copy to clipboard
        await navigator.clipboard.writeText(shareData.url)
        alert('Link copied to clipboard!')
      }

      // Track share
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'share', {
          event_category: 'engagement',
          event_label: 'Block 3 Share',
        })
      }
    } catch (error) {
      console.error('Share failed:', error)
    }
  }

  return (
    <button
      onClick={handleShare}
      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
      aria-label="Share"
    >
      <Share2 className="w-5 h-5 text-gray-400 hover:text-white" />
    </button>
  )
}
