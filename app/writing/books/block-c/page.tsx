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

  const audioContent = `
Random Acts of Self-Actualization: Block C - Conscious Transformation and Integration

By Brandon Mills and Jesse Doherty

Introduction

Block C represents the culmination of the Random Acts trilogy—the synthesis of liberation and transformation into lived integration. Where Block A focused on breaking free and Block B explored conscious choice, Block C addresses the most profound question: How do we sustain transformation and embody wisdom in daily life?

The Challenge of Integration

The greatest challenge is not achieving moments of clarity or peak experiences, but integrating these insights into the fabric of our everyday existence. Integration is the bridge between understanding and embodiment, between knowing and being.

Bridging the Gaps

We explore the gaps that separate theory from practice, intention from action, individual awakening from collective transformation. These gaps are not obstacles to overcome but territories to navigate with skill, patience, and grace.

Quantum Consciousness in Action

Drawing on the quantum framework of consciousness introduced in earlier volumes, we investigate how coherence, entanglement, and superposition manifest in practical life. We discover that enlightenment is not a distant goal but an available state—a way of relating to reality that can be cultivated and sustained.

The Invitation Forward

This book is not an ending but an invitation—to continue the work, to deepen the practice, to live the questions. True integration is never complete; it is an ongoing process of becoming, a perpetual dance between form and emptiness, self and no-self, the personal and the universal.

Welcome to Block C. Welcome to integration. Welcome home.
  `.trim()

  return (
    <BookReader
      bookId="block-c"
      title="Random Acts of Self-Actualization: Block C"
      subtitle="Conscious Transformation and Integration"
      htmlContent={htmlContent}
      teaserPercentage={20}
      unlockPrice={5}
      audioTextContent={audioContent}
      showAudioReader={true}
      contentType="book"
    />
  )
}
