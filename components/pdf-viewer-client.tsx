'use client'

import { useState, useEffect } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { Lock, Unlock, BookOpen, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react'
import { RippleButton } from './ripple-button'
import { motion, AnimatePresence } from 'framer-motion'

// Configure PDF.js worker - only in browser
if (typeof window !== 'undefined') {
  pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`
}

interface PDFBookViewerClientProps {
  bookId: string
  title: string
  subtitle?: string
  pdfUrl: string
  teaserPages?: number
  unlockPrice?: number
}

export function PDFBookViewerClient({
  bookId,
  title,
  subtitle,
  pdfUrl,
  teaserPages = 10,
  unlockPrice = 5,
}: PDFBookViewerClientProps) {
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [numPages, setNumPages] = useState<number>(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [scale, setScale] = useState(1.0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  // Prevent hydration issues
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Check if book is already unlocked
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const unlocked = localStorage.getItem(`book-unlocked-${bookId}`)
      if (unlocked === 'true') {
        setIsUnlocked(true)
      }
    }
  }, [bookId])

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
  }

  const handleUnlock = async () => {
    setIsProcessing(true)

    try {
      const response = await fetch('/api/books/unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookId,
          title,
          price: unlockPrice,
        }),
      })

      const data = await response.json()

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl
      } else if (data.unlocked) {
        localStorage.setItem(`book-unlocked-${bookId}`, 'true')
        setIsUnlocked(true)
      }
    } catch (error) {
      console.error('Failed to unlock book:', error)
      alert('Failed to process payment. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const maxPage = isUnlocked ? numPages : Math.min(teaserPages, numPages)
  const canGoNext = currentPage < maxPage
  const canGoPrev = currentPage > 1

  const nextPage = () => {
    if (canGoNext) setCurrentPage(currentPage + 1)
  }

  const prevPage = () => {
    if (canGoPrev) setCurrentPage(currentPage - 1)
  }

  const zoomIn = () => setScale(Math.min(scale + 0.2, 2.5))
  const zoomOut = () => setScale(Math.max(scale - 0.2, 0.5))

  // Show loading state during hydration
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="container-wide pt-32 pb-12">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-light font-serif leading-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xl md:text-2xl text-white/70 font-light">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        <div className="container-wide pb-32">
          <div className="max-w-5xl mx-auto">
            <div className="relative bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-3xl p-4 md:p-8 backdrop-blur-xl overflow-hidden">
              <div className="flex items-center justify-center h-96">
                <div className="animate-pulse text-accent-gold">Loading book viewer...</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-black text-white ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Book Header */}
      <div className="container-wide pt-32 pb-12">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-3 px-6 py-3 border border-accent-gold/20 bg-accent-gold/5 rounded-full">
            <BookOpen className="text-accent-gold" size={20} />
            <span className="text-sm tracking-[0.2em] uppercase text-accent-gold font-light">
              {isUnlocked ? 'Full Access' : `Preview • ${teaserPages} of ${numPages || '...'} Pages`}
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-light font-serif leading-tight">
            {title}
          </h1>

          {subtitle && (
            <p className="text-xl md:text-2xl text-white/70 font-light">
              {subtitle}
            </p>
          )}

          {!isUnlocked && (
            <div className="pt-6">
              <p className="text-white/50 mb-6">
                Reading preview • Unlock full book for ${unlockPrice}
              </p>
              <RippleButton
                onClick={handleUnlock}
                disabled={isProcessing}
                className="px-12 py-4 bg-accent-gold text-black font-medium tracking-[0.2em] uppercase rounded-full hover:bg-accent-hover transition-all"
              >
                <Unlock size={20} className="inline mr-3" />
                {isProcessing ? 'Processing...' : `Unlock for $${unlockPrice}`}
              </RippleButton>
            </div>
          )}
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="container-wide pb-32">
        <div className="max-w-5xl mx-auto">
          {/* PDF Container with smooth transitions */}
          <div className="relative bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-3xl p-4 md:p-8 backdrop-blur-xl overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                className="flex justify-center items-center"
              >
                <Document
                  file={pdfUrl}
                  onLoadSuccess={onDocumentLoadSuccess}
                  loading={
                    <div className="flex items-center justify-center h-96">
                      <div className="animate-pulse text-accent-gold">Loading book...</div>
                    </div>
                  }
                  error={
                    <div className="flex items-center justify-center h-96 text-red-400">
                      Failed to load book. Please refresh the page.
                    </div>
                  }
                >
                  <Page
                    pageNumber={currentPage}
                    scale={scale}
                    renderTextLayer={true}
                    renderAnnotationLayer={true}
                    className="shadow-2xl"
                  />
                </Document>
              </motion.div>
            </AnimatePresence>

            {/* Floating Control Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/80 backdrop-blur-xl border border-accent-gold/20 rounded-full px-6 py-3"
            >
              {/* Zoom Out */}
              <button
                onClick={zoomOut}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                aria-label="Zoom Out"
              >
                <ZoomOut size={20} className="text-white/70 hover:text-accent-gold transition-colors" />
              </button>

              {/* Zoom Level */}
              <span className="text-sm text-white/50 min-w-[60px] text-center">
                {Math.round(scale * 100)}%
              </span>

              {/* Zoom In */}
              <button
                onClick={zoomIn}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                aria-label="Zoom In"
              >
                <ZoomIn size={20} className="text-white/70 hover:text-accent-gold transition-colors" />
              </button>

              <div className="w-px h-6 bg-white/20" />

              {/* Previous Page */}
              <button
                onClick={prevPage}
                disabled={!canGoPrev}
                className="p-2 hover:bg-white/10 rounded-full transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Previous Page"
              >
                <ChevronLeft size={20} className="text-white/70 hover:text-accent-gold transition-colors" />
              </button>

              {/* Page Counter */}
              <span className="text-sm text-white/70 font-light min-w-[80px] text-center">
                {currentPage} / {maxPage || '...'}
              </span>

              {/* Next Page */}
              <button
                onClick={nextPage}
                disabled={!canGoNext}
                className="p-2 hover:bg-white/10 rounded-full transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Next Page"
              >
                <ChevronRight size={20} className="text-white/70 hover:text-accent-gold transition-colors" />
              </button>

              <div className="w-px h-6 bg-white/20" />

              {/* Fullscreen */}
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                aria-label="Toggle Fullscreen"
              >
                <Maximize2 size={20} className="text-white/70 hover:text-accent-gold transition-colors" />
              </button>
            </motion.div>
          </div>

          {/* Unlock Prompt (if at end of preview) */}
          {!isUnlocked && currentPage >= maxPage && numPages > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-12 text-center space-y-8"
            >
              <div className="w-full h-px bg-gradient-to-r from-transparent via-accent-gold/30 to-transparent" />

              <div className="bg-gradient-to-br from-accent-gold/10 to-transparent border border-accent-gold/20 rounded-3xl p-12 backdrop-blur-xl">
                <Lock className="mx-auto text-accent-gold mb-6" size={48} />

                <h3 className="text-2xl md:text-3xl font-serif text-white mb-4">
                  Continue Reading
                </h3>

                <p className="text-white/70 mb-8 leading-relaxed max-w-md mx-auto">
                  You've reached the end of the preview. Unlock all {numPages} pages to continue your journey.
                </p>

                <RippleButton
                  onClick={handleUnlock}
                  disabled={isProcessing}
                  className="px-12 py-4 bg-accent-gold text-black font-medium tracking-[0.2em] uppercase rounded-full hover:bg-accent-hover transition-all"
                >
                  <Unlock size={20} className="inline mr-3" />
                  {isProcessing ? 'Processing...' : `Unlock Full Book • $${unlockPrice}`}
                </RippleButton>

                <p className="text-white/40 text-sm mt-6">
                  One-time payment • {numPages} pages • Read anytime
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Reading Progress Bar */}
      {isUnlocked && numPages > 0 && (
        <div className="fixed bottom-0 left-0 right-0 h-1 bg-white/10 z-50">
          <motion.div
            className="h-full bg-accent-gold"
            initial={{ width: 0 }}
            animate={{ width: `${(currentPage / numPages) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      )}
    </div>
  )
}
