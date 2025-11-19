import { Metadata } from 'next'
import { JsonLd } from '@/components/seo/JsonLd'
import { generateSoftwareApplicationSchema, generateBreadcrumbSchema, generateFAQSchema } from '@/lib/json-ld'

export const metadata: Metadata = {
  title: 'Dream Decoder - AI Jungian Dream Analysis | Brandon Mills',
  description: 'Unlock the hidden messages in your dreams with AI-powered Jungian analysis. Decode symbols, archetypes, and patterns to reveal deeper meaning.',
  keywords: [
    'dream analysis',
    'dream interpretation',
    'Jungian psychology',
    'dream decoder',
    'dream symbols',
    'AI dream analysis',
    'archetypes',
    'unconscious mind',
  ],
  openGraph: {
    title: 'Dream Decoder - AI Jungian Dream Analysis',
    description: 'Unlock the hidden messages in your dreams with AI-powered Jungian analysis.',
    type: 'website',
    url: 'https://brandonmills.com/dreams',
  },
}

export default function DreamsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Generate structured data for SEO
  const softwareAppSchema = generateSoftwareApplicationSchema({
    name: 'Dream Decoder',
    description: 'AI-powered Jungian dream analysis tool that decodes symbols, archetypes, and patterns to reveal the hidden messages in your dreams.',
    category: 'LifestyleApplication',
    features: [
      'Symbol Analysis',
      'Jungian Interpretation',
      'Archetype Identification',
      '3D Dream Visualization',
      'Personalized Sleep Guidance',
      'Voice Input Support',
    ],
    screenshot: '/og-image.jpg',
    isFree: true,
  })

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Dream Decoder', url: '/dreams' },
  ])

  const faqSchema = generateFAQSchema([
    {
      question: 'What is the Dream Decoder?',
      answer: 'The Dream Decoder is an AI-powered tool that analyzes your dreams using Jungian psychology principles to help you understand the hidden meanings, symbols, and archetypes present in your dreams.',
    },
    {
      question: 'How does dream analysis work?',
      answer: 'Simply describe your dream in detail using text or voice input, and our AI will analyze the symbols, patterns, and archetypes to provide a comprehensive interpretation based on Jungian psychology.',
    },
    {
      question: 'Is the Dream Decoder free to use?',
      answer: 'Yes, the Dream Decoder is completely free to use. You can analyze as many dreams as you like without any cost.',
    },
    {
      question: 'What is Jungian dream analysis?',
      answer: 'Jungian dream analysis is an approach developed by Carl Jung that views dreams as a window into the unconscious mind. It focuses on identifying universal symbols (archetypes) and personal associations to understand the deeper meaning of dreams.',
    },
  ])

  return (
    <>
      <JsonLd data={[softwareAppSchema, breadcrumbSchema, faqSchema]} />
      {children}
    </>
  )
}
