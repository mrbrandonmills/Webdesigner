import { Metadata } from 'next'
import { BookReader } from '@/components/book-reader'
import { readFile } from 'fs/promises'
import path from 'path'

export const metadata: Metadata = {
  title: 'Random Acts of Self-Actualization: Block C | Brandon Mills',
  description: 'Conscious Transformation and Integration - The final volume exploring the path from classical to quantum consciousness.',
}

export default async function BlockCPage() {
  // Read the HTML file
  const htmlPath = path.join(process.cwd(), 'public', 'books', 'block-c.html')
  let htmlContent = ''

  try {
    htmlContent = await readFile(htmlPath, 'utf-8')
  } catch (error) {
    console.error('Failed to read Block C HTML:', error)
    htmlContent = '<p>Book content currently unavailable. Please check back soon.</p>'
  }

  return (
    <BookReader
      bookId="block-c"
      title="Random Acts of Self-Actualization: Block C"
      subtitle="Conscious Transformation and Integration"
      htmlContent={htmlContent}
      teaserPercentage={20}
      unlockPrice={5}
    />
  )
}
