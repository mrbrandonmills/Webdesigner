import { MetadataRoute } from 'next'
import { affiliateProducts } from '@/lib/affiliate-products'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://brandonmills.com'

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
  ]

  // Shop pages
  const shopPages = [
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    ...affiliateProducts.map((product) => ({
      url: `${baseUrl}/shop/${product.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ]

  // Meditation pages
  const meditationSlugs = [
    'morning-mindfulness',
    'deep-sleep',
    'anxiety-relief',
    'self-actualization',
    'body-scan-pain',
    'confidence-power',
    'loving-kindness',
    'creative-unblocking',
    'grief-loss',
    'entrepreneurial-mindset',
  ]

  const meditationPages = [
    {
      url: `${baseUrl}/meditations`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    ...meditationSlugs.map((slug) => ({
      url: `${baseUrl}/meditations/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ]

  // Blog pages
  const blogPages = [
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog/best-noise-canceling-headphones-2025`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/braun-ipl-first-week`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.9, // High priority - personal testimonial with conversion potential
    },
  ]

  // Writing pages
  const writingPages = [
    {
      url: `${baseUrl}/writing`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/writing/books`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/writing/books/block-a`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/writing/books/block-b`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/writing/books/block-c`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/writing/essays/self-esteem-cultivating-positive-self-image`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/writing/essays/intro-to-social-theory`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/writing/poems/fine-lines`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/writing/poems/poet-proponent`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/writing/poems/the-tourbillon`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
  ]

  return [
    ...staticPages,
    ...shopPages,
    ...meditationPages,
    ...blogPages,
    ...writingPages,
  ]
}
