import { Metadata } from 'next'
import { PDFBookViewerWrapper } from '@/components/pdf-book-viewer-wrapper'

export const metadata: Metadata = {
  title: 'Random Acts of Self-Actualization: Block A | Brandon Mills',
  description: 'Breaking free from addictive patterns. The first volume exploring transformation and self-discovery.',
}

export default function BlockAPage() {
  return (
    <PDFBookViewerWrapper
      bookId="block-a"
      title="Random Acts of Self-Actualization: Block A"
      subtitle="Breaking Free from Addictive Patterns"
      pdfUrl="/books/block-a.pdf"
      teaserPages={10}
      unlockPrice={5}
    />
  )
}
