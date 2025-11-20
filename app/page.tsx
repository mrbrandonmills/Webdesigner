import { Metadata } from 'next'
import HeroVideo from '@/components/home/hero-video'
import PhilosophySection from '@/components/home/philosophy-section'
import GenesisArchiveSection from '@/components/home/genesis-archive-section'
import SocialProofSection from '@/components/home/social-proof-section'
import { JsonLd } from '@/components/seo/JsonLd'
import { generateBreadcrumbSchema } from '@/lib/json-ld'

export const metadata: Metadata = {
  title: 'Brandon Mills | Author, Philosopher & Sacred Geometry Artist',
  description: 'Explore philosophy essays, mental health blog, meditation guides, luxury canvas prints featuring sacred geometry art, and AI tools. Renaissance living for deep thinkers.',
  keywords: [
    'Brandon Mills',
    'Brandon Mills author',
    'sacred geometry art',
    'luxury canvas prints',
    'philosophy essays',
    'mental health blog',
    'meditation guides',
    'AI tools',
    'polymath',
    'self-actualization',
    'consciousness',
    'deep thinker',
    'renaissance man',
    'guided meditation',
    'premium products'
  ],
  alternates: {
    canonical: 'https://brandonmills.com',
  },
  openGraph: {
    title: 'Brandon Mills | Author, Philosopher & Sacred Geometry Artist',
    description: 'Explore philosophy essays, mental health blog, meditation guides, luxury canvas prints, and AI tools. Renaissance living for deep thinkers.',
    type: 'website',
    url: 'https://brandonmills.com',
    siteName: 'Brandon Mills',
    locale: 'en_US',
    images: [
      {
        url: 'https://brandonmills.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Brandon Mills - Author, Philosopher & Sacred Geometry Artist',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Brandon Mills | Author, Philosopher & Sacred Geometry Artist',
    description: 'Philosophy essays, mental health blog, meditation guides, luxury canvas prints, and AI tools.',
    images: ['https://brandonmills.com/og-image.jpg'],
    creator: '@brandonmills',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

// Generate Person schema for Brandon Mills
function generatePersonSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Brandon Mills',
    url: 'https://brandonmills.com',
    image: 'https://brandonmills.com/og-image.jpg',
    description: 'Author, philosopher, sacred geometry artist, and AI engineer. Creator of meditation guides, philosophy essays, and luxury canvas prints.',
    jobTitle: ['Author', 'Philosopher', 'Artist', 'AI Engineer'],
    sameAs: [
      'https://www.instagram.com/brandonmillsofficial',
      'https://www.linkedin.com/in/brandonmillsofficial',
      'https://twitter.com/brandonmills',
      'https://medium.com/@brandonmills',
    ],
    knowsAbout: [
      'Philosophy',
      'Sacred Geometry',
      'Meditation',
      'Mental Health',
      'Artificial Intelligence',
      'Self-Actualization',
      'Consciousness',
    ],
  }
}

export default function HomePage() {
  const personSchema = generatePersonSchema()
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
  ])

  return (
    <>
      <JsonLd data={[personSchema, breadcrumbSchema]} />
      <div className="min-h-screen bg-black">
        <HeroVideo />
        <PhilosophySection />
        <SocialProofSection />
        <GenesisArchiveSection />
      </div>
    </>
  )
}
