import { Metadata } from 'next'
import { PDFBookViewerWrapper } from '@/components/pdf-book-viewer-wrapper'

export const metadata: Metadata = {
  title: 'Random Acts of Self-Actualization: Block B | Brandon Mills',
  description: 'Deep dive into consciousness, transformation, and the journey of self-discovery. Block B of the Random Acts trilogy.',
}

export default function BlockBPage() {
  const audioContent = `
Random Acts of Self-Actualization: Block B - The Path of Conscious Transformation

By Brandon Mills and Jesse Doherty

Introduction

Block B continues the journey begun in Block A, diving deeper into the mechanics of conscious transformation. Where Block A focused on breaking free from addictive patterns, Block B explores what comes next: the deliberate cultivation of new patterns, new ways of being, and new relationships with ourselves and reality.

The Nature of Transformation

Transformation is not a single event but a process—an ongoing dialogue between who we have been and who we are becoming. It requires courage to face the unknown, wisdom to navigate uncertainty, and compassion to hold ourselves gently through the inevitable discomfort of change.

Conscious Choice

At the heart of transformation is conscious choice—the ability to respond rather than react, to create rather than merely cope. This capacity emerges not from force or willpower, but from the cultivation of awareness, the development of presence, and the integration of our fragmented selves into a coherent whole.

The Journey Inward

True transformation begins within. In these pages, we explore meditation practices, psychological frameworks, and quantum perspectives that illuminate the path from mechanical reactivity to conscious responsiveness. We investigate the nature of consciousness itself, discovering that what we are is far more vast and magnificent than what we have been taught to believe.

Integration and Wholeness

The goal is not perfection but wholeness—the integration of shadow and light, past and present, individual and universal. This is the work of becoming fully human, fully alive, fully ourselves.
  `.trim()

  return (
    <PDFBookViewerWrapper
      bookId="block-b"
      title="Random Acts of Self-Actualization: Block B"
      subtitle="The Path of Conscious Transformation"
      pdfUrl="/books/block-b.pdf"
      teaserPages={10}
      unlockPrice={5}
      audioTextContent={audioContent}
      showAudioReader={true}
      contentType="book"
    />
  )
}
