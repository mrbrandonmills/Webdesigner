import { Metadata } from 'next'
import { JsonLd } from '@/components/seo/JsonLd'
import { generateSoftwareApplicationSchema, generateBreadcrumbSchema, generateFAQSchema } from '@/lib/json-ld'

export const metadata: Metadata = {
  title: 'Life Path Oracle - Discover Your Archetype | Brandon Mills',
  description: 'Answer 8 questions to reveal your dominant archetype and unlock personalized guidance for your life path. AI-powered personality and archetype analysis.',
  keywords: [
    'life path',
    'archetype quiz',
    'personality analysis',
    'self discovery',
    'Jungian archetypes',
    'life guidance',
    'personal development',
    'archetype test',
  ],
  openGraph: {
    title: 'Life Path Oracle - Discover Your Archetype',
    description: 'Answer 8 questions to reveal your dominant archetype and unlock personalized guidance for your life path.',
    type: 'website',
    url: 'https://brandonmills.com/oracle',
  },
}

export default function OracleLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Generate structured data for SEO
  const softwareAppSchema = generateSoftwareApplicationSchema({
    name: 'Life Path Oracle',
    description: 'AI-powered archetype discovery tool that analyzes your values, fears, goals, and relationships to reveal your dominant archetype and provide personalized life guidance.',
    category: 'LifestyleApplication',
    features: [
      'Archetype Discovery',
      'Personalized Life Guidance',
      '8-Question Deep Analysis',
      'AI-Powered Insights',
      '3D Archetype Visualization',
      'Voice Input Support',
    ],
    screenshot: '/og-image.jpg',
    isFree: true,
  })

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Life Path Oracle', url: '/oracle' },
  ])

  const faqSchema = generateFAQSchema([
    {
      question: 'What is the Life Path Oracle?',
      answer: 'The Life Path Oracle is an AI-powered tool that analyzes your responses to 8 deep questions about your values, fears, goals, and relationships to reveal your dominant archetype and provide personalized guidance for your life path.',
    },
    {
      question: 'How does archetype discovery work?',
      answer: 'You answer 8 thoughtful questions about different aspects of your life and personality. Our AI then analyzes your responses to identify patterns and reveal your dominant Jungian archetype with personalized insights.',
    },
    {
      question: 'Is the Life Path Oracle free to use?',
      answer: 'Yes, the Life Path Oracle is completely free to use. You can discover your archetype and receive personalized guidance at no cost.',
    },
    {
      question: 'What are Jungian archetypes?',
      answer: 'Jungian archetypes are universal patterns of behavior and personality identified by psychologist Carl Jung. They include the Hero, Sage, Explorer, Creator, Caregiver, and others. Understanding your dominant archetype can provide insights into your motivations, strengths, and life path.',
    },
  ])

  return (
    <>
      <JsonLd data={[softwareAppSchema, breadcrumbSchema, faqSchema]} />
      {children}
    </>
  )
}
