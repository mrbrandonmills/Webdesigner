'use client'

import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Share2, Twitter, Facebook, Link2, Check, Download, X } from 'lucide-react'
import html2canvas from 'html2canvas'
import { clientLogger } from '@/lib/client-logger'

interface ShareCardProps {
  type: 'dream' | 'archetype' | 'visualization'
  title: string
  subtitle?: string
  description?: string
  id: string
  onClose?: () => void
}

export function ShareCard({ type, title, subtitle, description, id, onClose }: ShareCardProps) {
  const [copied, setCopied] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/${type === 'dream' ? 'dreams' : type === 'archetype' ? 'oracle' : 'visualize'}/${id}`
    : ''

  const shareText = type === 'dream'
    ? `I just decoded my dream and discovered: ${title}. Discover what your dreams mean!`
    : type === 'archetype'
    ? `I discovered my archetype: ${title}. What's yours?`
    : `I visualized my thoughts as a 3D neural network. Try it yourself!`

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      clientLogger.error('Failed to copy:', err)
    }
  }, [shareUrl])

  const shareToTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
    window.open(url, '_blank', 'width=600,height=400')
  }

  const shareToFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`
    window.open(url, '_blank', 'width=600,height=400')
  }

  const downloadAsImage = async () => {
    if (!cardRef.current) return
    setIsGenerating(true)

    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#000000',
        scale: 2,
        useCORS: true,
        logging: false
      })

      const link = document.createElement('a')
      link.download = `${type}-result-${id}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (err) {
      clientLogger.error('Failed to generate image:', err)
    } finally {
      setIsGenerating(false)
    }
  }

  const getGradient = () => {
    switch (type) {
      case 'dream':
        return 'from-purple-600/20 via-purple-500/10 to-transparent'
      case 'archetype':
        return 'from-[#C9A050]/20 via-[#C9A050]/10 to-transparent'
      case 'visualization':
        return 'from-blue-600/20 via-blue-500/10 to-transparent'
      default:
        return 'from-[#C9A050]/20 via-[#C9A050]/10 to-transparent'
    }
  }

  const getAccentColor = () => {
    switch (type) {
      case 'dream':
        return 'text-purple-500'
      case 'archetype':
        return 'text-[#C9A050]'
      case 'visualization':
        return 'text-blue-500'
      default:
        return 'text-[#C9A050]'
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.95 }}
          className="w-full max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Shareable Card Preview */}
          <div
            ref={cardRef}
            className="relative overflow-hidden bg-black rounded-2xl border border-white/10 p-8 mb-4"
          >
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${getGradient()}`} />

            {/* Content */}
            <div className="relative z-10">
              {/* Logo/Brand */}
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-full bg-[#C9A050]/20 flex items-center justify-center">
                  <span className="text-[#C9A050] font-serif text-sm">BM</span>
                </div>
                <span className="text-sm text-gray-400">brandonmills.com</span>
              </div>

              {/* Result Type Badge */}
              <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-4 bg-white/5 ${getAccentColor()}`}>
                {type === 'dream' ? 'Dream Analysis' : type === 'archetype' ? 'Life Path Oracle' : 'Mind Visualization'}
              </div>

              {/* Title */}
              <h3 className="font-serif text-2xl md:text-3xl mb-2 text-white">
                {title}
              </h3>

              {/* Subtitle */}
              {subtitle && (
                <p className={`text-sm ${getAccentColor()} mb-4`}>
                  {subtitle}
                </p>
              )}

              {/* Description */}
              {description && (
                <p className="text-sm text-gray-400 line-clamp-3">
                  {description}
                </p>
              )}

              {/* QR Code placeholder - using URL */}
              <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs text-gray-500">Discover yours at</span>
                <span className="text-xs text-[#C9A050]">brandonmills.com</span>
              </div>
            </div>
          </div>

          {/* Share Buttons */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-white">Share Your Result</h4>
              {onClose && (
                <button
                  onClick={onClose}
                  className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <button
                onClick={shareToTwitter}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-[#1DA1F2]/10 border border-[#1DA1F2]/20 rounded-lg hover:bg-[#1DA1F2]/20 transition-colors"
              >
                <Twitter className="w-4 h-4 text-[#1DA1F2]" />
                <span className="text-sm text-white">Twitter</span>
              </button>

              <button
                onClick={shareToFacebook}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-[#4267B2]/10 border border-[#4267B2]/20 rounded-lg hover:bg-[#4267B2]/20 transition-colors"
              >
                <Facebook className="w-4 h-4 text-[#4267B2]" />
                <span className="text-sm text-white">Facebook</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={copyToClipboard}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-green-500">Copied!</span>
                  </>
                ) : (
                  <>
                    <Link2 className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-white">Copy Link</span>
                  </>
                )}
              </button>

              <button
                onClick={downloadAsImage}
                disabled={isGenerating}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50"
              >
                <Download className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-white">
                  {isGenerating ? 'Saving...' : 'Save Image'}
                </span>
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// Inline share button to trigger the modal
interface ShareButtonProps {
  onClick: () => void
  className?: string
}

export function ShareButton({ onClick, className = '' }: ShareButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-4 py-2 bg-[#C9A050]/10 border border-[#C9A050]/20 rounded-lg hover:bg-[#C9A050]/20 transition-colors ${className}`}
    >
      <Share2 className="w-4 h-4 text-[#C9A050]" />
      <span className="text-sm text-[#C9A050]">Share Result</span>
    </button>
  )
}
