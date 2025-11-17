import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Guided Meditations - Premium Audio for Anxiety, Sleep & Focus | Brandon Mills',
  description: '10 professional guided meditations. Instant download, no subscription. Anxiety relief, deep sleep, confidence & more.',
  keywords: [
    'guided meditation',
    'meditation audio download',
    'anxiety relief meditation',
    'deep sleep meditation',
    'mindfulness meditation',
    'meditation for confidence',
    'premium meditation',
    'meditation mp3',
    'guided meditation 2025',
    'meditation for entrepreneurs'
  ],
  openGraph: {
    title: 'Guided Meditations - Premium Audio | Brandon Mills',
    description: '10 professional guided meditations. Instant download, no subscription. Anxiety relief, deep sleep, confidence & more.',
    type: 'website',
    url: 'https://brandonmills.com/meditations',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Guided Meditations - Premium Audio | Brandon Mills',
    description: '10 professional meditations. Anxiety relief, deep sleep, confidence & more.',
  },
}

export default function MeditationsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
