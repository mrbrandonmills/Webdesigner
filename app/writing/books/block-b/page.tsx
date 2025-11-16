import { Metadata } from 'next'
import { PDFBookViewerWrapper } from '@/components/pdf-book-viewer-wrapper'

export const metadata: Metadata = {
  title: 'Random Acts of Self-Actualization: Block B | Brandon Mills',
  description: 'Deep dive into consciousness, transformation, and the journey of self-discovery. Block B of the Random Acts trilogy.',
}

export default function BlockBPage() {
  return (
    <PDFBookViewerWrapper
      bookId="block-b"
      title="Random Acts of Self-Actualization: Block B"
      subtitle="The Path of Conscious Transformation"
      pdfUrl="/books/block-b.pdf"
      teaserPages={10}
      unlockPrice={5}
    />
  )
}
