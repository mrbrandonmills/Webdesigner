/**
 * Brandon Mills Ebook Configuration
 * Random Acts of Self-Actualization: Building a Non-Addictive Life
 */

const AFFILIATE_TAG = 'brandonmil0e-20'

export const ebookConfig = {
  title: 'Random Acts of Self-Actualization',
  subtitle: 'Building a Non-Addictive Life',
  fullTitle: 'Random Acts of Self-Actualization: Building a Non-Addictive Life',
  author: 'Brandon Mills',

  // Multiple volumes/editions
  volumes: [
    {
      name: 'Volume 1: Building a Non-Addictive Life',
      asin: 'B0DRDXCJZQ',
      amazonUrl: `https://www.amazon.com/Random-Acts-Self-Actualization-Building-Addictive-ebook/dp/B0DRDXCJZQ?tag=${AFFILIATE_TAG}`,
      price: 9.99,
    },
    {
      name: 'Block B',
      asin: 'B0DSY6Z4YP',
      amazonUrl: `https://www.amazon.com/Random-Acts-Self-Actualization-Block-B-ebook/dp/B0DSY6Z4YP?tag=${AFFILIATE_TAG}`,
      price: 6.99,
    },
    {
      name: 'Block 3: The Laboratory of Living',
      asin: null, // Not yet on Amazon
      amazonUrl: null,
      websiteUrl: '/book/block-3',
      price: 0, // FREE on website
      isFree: true,
      description: 'Read Block 3 FREE exclusively on brandonmills.com',
    },
  ],

  // FREE Block 3 on website
  block3: {
    title: 'Block 3: The Laboratory of Living',
    url: '/book/block-3',
    isFree: true,
    description: 'The final chapter of the trilogy - available FREE exclusively on this website.',
  },

  // Primary version (default)
  asin: 'B0DRDXCJZQ',
  amazonUrl: `https://www.amazon.com/Random-Acts-Self-Actualization-Building-Addictive-ebook/dp/B0DRDXCJZQ?tag=${AFFILIATE_TAG}`,
  kindleUrl: `https://www.amazon.com/Random-Acts-Self-Actualization-Building-Addictive-ebook/dp/B0DRDXCJZQ?tag=${AFFILIATE_TAG}`,

  // Pricing
  price: 9.99, // Update with actual price
  currency: 'USD',

  // Description
  shortDescription: 'A transformative guide to breaking free from addictive patterns and building a life of intentional self-actualization.',
  longDescription: `From NASA engineer to philosopher, Brandon Mills shares his journey of breaking free from society's addictive patterns and building a life of authentic self-actualization. This book combines personal memoir with practical philosophy, offering a roadmap for anyone seeking to live more intentionally, mindfully, and freely.`,

  // Key themes (for SEO and recommendations)
  themes: [
    'Self-Actualization',
    'Breaking Addiction',
    'Personal Growth',
    'Mindfulness',
    'Philosophy',
    'Mental Health',
    'Intentional Living',
    'Polymath Lifestyle',
  ],

  // Related blog posts (slugs)
  relatedPosts: [
    'learning-unconditional-love',
    'the-polymath-renaissance',
    'mindfulness-meditation',
    'breaking-free-from-addiction',
    'nasa-engineer-to-model',
    'building-intentional-life',
  ],

  // Call-to-action variations
  ctas: {
    short: 'Read the full story →',
    medium: 'Explore the full journey in Random Acts of Self-Actualization',
    long: 'If this essay resonated with you, dive deeper into these ideas in my book: Random Acts of Self-Actualization: Building a Non-Addictive Life',
    sidebar: 'From NASA to Philosophy: Read My Story',
  },

  // Social proof (update with actual data)
  reviews: {
    count: 0, // Update as reviews come in
    rating: 0, // Update with actual rating
  },

  // Marketing
  tagline: 'From NASA Engineer to Philosopher: A Journey of Self-Actualization',
  keywords: [
    'self-actualization',
    'addiction recovery',
    'personal transformation',
    'mindfulness',
    'philosophy',
    'polymath',
    'intentional living',
    'mental health',
    'NASA engineer',
    'personal growth',
  ],
}

/**
 * Get ebook purchase URL with affiliate tracking
 */
export function getEbookUrl(source?: string): string {
  if (source) {
    return `${ebookConfig.amazonUrl}&source=${source}`
  }
  return ebookConfig.amazonUrl
}

/**
 * Check if a blog post should promote the ebook
 */
export function shouldPromoteEbook(postSlug: string): boolean {
  return ebookConfig.relatedPosts.includes(postSlug)
}

/**
 * Get CTA text based on context
 */
export function getEbookCTA(context: 'short' | 'medium' | 'long' | 'sidebar' = 'medium'): string {
  return ebookConfig.ctas[context]
}

/**
 * Generate ebook schema.org markup for SEO
 */
export function getEbookSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: ebookConfig.fullTitle,
    author: {
      '@type': 'Person',
      name: ebookConfig.author,
      url: 'https://brandonmills.com',
    },
    description: ebookConfig.longDescription,
    isbn: ebookConfig.asin,
    bookFormat: 'EBook',
    inLanguage: 'en-US',
    offers: {
      '@type': 'Offer',
      price: ebookConfig.price,
      priceCurrency: ebookConfig.currency,
      availability: 'https://schema.org/InStock',
      url: ebookConfig.amazonUrl,
      seller: {
        '@type': 'Organization',
        name: 'Amazon.com',
      },
    },
    aggregateRating: ebookConfig.reviews.count > 0 ? {
      '@type': 'AggregateRating',
      ratingValue: ebookConfig.reviews.rating,
      reviewCount: ebookConfig.reviews.count,
    } : undefined,
  }
}
