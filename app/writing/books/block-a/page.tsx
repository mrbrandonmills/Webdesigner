import { PDFBookViewer } from '@/components/pdf-book-viewer'

export default function BlockAPage() {
  return (
    <PDFBookViewer
      bookId="block-a"
      title="Random Acts of Self-Actualization: Block A"
      subtitle="Breaking Free from Addictive Patterns"
      pdfUrl="/books/block-a.pdf"
      teaserPages={10}
      unlockPrice={5}
    />
  )
}
