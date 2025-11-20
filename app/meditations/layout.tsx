import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Meditation Guides - Premium Audio for Anxiety, Sleep & Focus | Brandon Mills',
  description: '10 premium guided meditation audio downloads. AI-voiced meditations for anxiety relief, deep sleep, confidence building, and mindfulness. $5 each, instant download, no subscription.',
  keywords: [
    'meditation guides',
    'guided meditation',
    'meditation audio download',
    'anxiety relief meditation',
    'deep sleep meditation',
    'mindfulness meditation',
    'meditation for confidence',
    'premium meditation',
    'meditation mp3',
    'guided meditation 2025',
    'meditation for entrepreneurs',
    'Brandon Mills meditation',
    'AI meditation',
  ],
  alternates: {
    canonical: 'https://brandonmills.com/meditations',
  },
  openGraph: {
    title: 'Meditation Guides - Premium Audio | Brandon Mills',
    description: '10 premium guided meditation audio downloads. Anxiety relief, deep sleep, confidence & mindfulness. $5 each, instant download.',
    type: 'website',
    url: 'https://brandonmills.com/meditations',
    siteName: 'Brandon Mills',
    images: [
      {
        url: 'https://brandonmills.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Brandon Mills Meditation Guides',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Meditation Guides - Premium Audio | Brandon Mills',
    description: '10 premium guided meditations. Anxiety relief, deep sleep, confidence & mindfulness.',
    images: ['https://brandonmills.com/og-image.jpg'],
  },
}

export default function MeditationsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
