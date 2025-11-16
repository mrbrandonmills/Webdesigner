'use client'

import dynamic from 'next/dynamic'

// Dynamic import of PDF viewer to prevent SSR issues with react-pdf
const PDFBookViewerClient = dynamic(
  () => import('./pdf-viewer-client').then((mod) => ({ default: mod.PDFBookViewerClient })),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-pulse text-accent-gold">Loading book viewer...</div>
      </div>
    ),
  }
)

interface PDFBookViewerWrapperProps {
  bookId: string
  title: string
  subtitle?: string
  pdfUrl: string
  teaserPages?: number
  unlockPrice?: number
  audioTextContent?: string
  showAudioReader?: boolean
  contentType?: 'article' | 'poem' | 'essay' | 'research' | 'book'
}

export function PDFBookViewerWrapper(props: PDFBookViewerWrapperProps) {
  return <PDFBookViewerClient {...props} />
}
