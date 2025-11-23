import { Metadata } from 'next'
import CollaborationLanding from '@/components/collaboration/collaboration-landing'
import { JsonLd } from '@/components/seo/JsonLd'

export const metadata: Metadata = {
  title: 'US - Works from the Collective Consciousness | Revolutionary Collaborative Storytelling',
  description: 'Join the revolutionary AI-powered collective book writing platform. Share your story, become a published author, and earn profit share. No writing required - your voice transforms into print.',
  keywords: [
    'collective consciousness',
    'collaborative writing',
    'AI book creation',
    'become published author',
    'profit sharing',
    'collective storytelling',
    'AI-powered writing',
    'collaborative book project',
    'US series',
    'Brandon Mills collective',
    'voice to book',
    'no writing required',
    'earn from stories',
  ],
  alternates: {
    canonical: 'https://brandonmills.com/us-collaboration',
  },
  openGraph: {
    title: 'US - Works from the Collective Consciousness',
    description: 'Revolutionary collaborative storytelling powered by AI. Share your story, become a published author, earn profit share.',
    type: 'website',
    url: 'https://brandonmills.com/us-collaboration',
    siteName: 'Brandon Mills',
    locale: 'en_US',
    images: [
      {
        url: 'https://brandonmills.com/og-us-collaboration.jpg',
        width: 1200,
        height: 630,
        alt: 'US - Works from the Collective Consciousness - Revolutionary AI-Powered Collaborative Book Writing',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'US - Works from the Collective Consciousness',
    description: 'Revolutionary collaborative storytelling powered by AI. Share your story, become a published author.',
    images: ['https://brandonmills.com/og-us-collaboration.jpg'],
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

// Generate structured data for the project
function generateProjectSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: 'US - Works from the Collective Consciousness',
    description: 'Revolutionary AI-powered collective book writing platform where contributors share stories and become published co-authors with profit sharing.',
    creator: {
      '@type': 'Person',
      name: 'Brandon Mills',
      url: 'https://brandonmills.com',
    },
    offers: {
      '@type': 'Offer',
      description: 'Become a co-author and earn profit share by contributing your story',
      priceCurrency: 'USD',
      price: '0',
      availability: 'https://schema.org/InStock',
    },
    keywords: [
      'collaborative writing',
      'AI book creation',
      'collective consciousness',
      'profit sharing',
      'published author',
    ],
  }
}

function generateBreadcrumbSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://brandonmills.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'US Collaboration',
        item: 'https://brandonmills.com/us-collaboration',
      },
    ],
  }
}

export default function USCollaborationPage() {
  const projectSchema = generateProjectSchema()
  const breadcrumbSchema = generateBreadcrumbSchema()

  return (
    <>
      <JsonLd data={[projectSchema, breadcrumbSchema]} />
      <CollaborationLanding />
    </>
  )
}
