import { Metadata } from 'next'
import { PDFBookViewerWrapper } from '@/components/pdf-book-viewer-wrapper'

export const metadata: Metadata = {
  title: 'Random Acts of Self-Actualization: Block A | Brandon Mills',
  description: 'Breaking free from addictive patterns. The first volume exploring transformation and self-discovery.',
}

export default function BlockAPage() {
  const audioContent = `
Random Acts of Self-Actualization: Block A - Breaking Free from Addictive Patterns

By Brandon Mills and Jesse Doherty

Introduction

Block A marks the beginning of a transformative journey through consciousness, addiction, and self-discovery. This volume explores the fundamental patterns that keep us bound to destructive behaviors and offers a pathway toward liberation through awareness and conscious choice.

The Nature of Addiction

Addiction is not merely a chemical dependency or behavioral compulsion—it is a pattern of consciousness, a way of relating to ourselves and the world that keeps us trapped in cycles of seeking and suffering. Whether we're addicted to substances, behaviors, relationships, or even our own thoughts, the underlying mechanism is the same: we seek external solutions to internal imbalances.

Breaking Free

True freedom from addictive patterns requires more than willpower or abstinence. It demands a fundamental shift in consciousness—a movement from the classical, deterministic framework of habitual response to the quantum framework of conscious choice. This is not about replacing one addiction with another, but about transcending the very mechanism of addiction itself.

The Path Forward

In these pages, we explore practical tools and philosophical frameworks for recognizing addictive patterns, understanding their roots, and cultivating the awareness necessary for genuine transformation. Drawing on psychology, neuroscience, quantum physics, and ancient wisdom traditions, we offer a comprehensive approach to breaking free from the chains that bind us.

This is not a quick fix or easy answer. It is an invitation to the hardest and most rewarding work you will ever do: the work of becoming truly free.
  `.trim()

  return (
    <PDFBookViewerWrapper
      bookId="block-a"
      title="Random Acts of Self-Actualization: Block A"
      subtitle="Breaking Free from Addictive Patterns"
      pdfUrl="/books/block-a.pdf"
      teaserPages={10}
      unlockPrice={5}
      audioTextContent={audioContent}
      showAudioReader={true}
    />
  )
}
