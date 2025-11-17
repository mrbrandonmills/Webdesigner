import { Metadata } from 'next'
import { getMeditationBySlug, getCategoryInfo } from '@/lib/meditations-data'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const meditation = getMeditationBySlug(slug)

  if (!meditation) {
    return {
      title: 'Meditation Not Found',
    }
  }

  const categoryInfo = getCategoryInfo(meditation.category)

  // Create SEO-optimized title based on primary benefit
  const primaryBenefit = meditation.benefits[0].toLowerCase()
  const seoTitle = `${meditation.title} - Guided Audio for ${categoryInfo.label} | Brandon Mills`
  const seoDescription = `${meditation.description.slice(0, 130)} ${meditation.duration} meditation. Instant download, 4 premium voices.`

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: [
      'guided meditation',
      'meditation audio download',
      meditation.category + ' meditation',
      'meditation for ' + categoryInfo.label.toLowerCase(),
      meditation.title.toLowerCase(),
      'premium meditation audio',
      'guided meditation 2025',
      'meditation mp3',
      meditation.theme.split(', ')[0],
      'professional meditation'
    ],
    openGraph: {
      title: `${meditation.title} - ${categoryInfo.label} Meditation`,
      description: seoDescription,
      type: 'website',
      url: `https://brandonmills.com/meditations/${meditation.slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${meditation.title} - ${categoryInfo.label} Meditation`,
      description: meditation.description.slice(0, 140),
    },
  }
}

export default function MeditationDetailLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
