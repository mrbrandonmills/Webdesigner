/**
 * Additional SEO Schema Generators
 *
 * These schemas complement the existing json-ld.ts utilities
 * with additional specialized schemas for different content types.
 */

const BASE_URL = 'https://brandonmills.com'

/**
 * Generate FAQ schema for pages with frequently asked questions
 */
export function generateFAQSchema(questions: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map(q => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer,
      },
    })),
  }
}

/**
 * Generate ImageGallery schema for photo galleries
 */
export function generateImageGallerySchema(gallery: {
  name: string
  description: string
  url: string
  images: { url: string; name: string; description?: string }[]
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ImageGallery',
    name: gallery.name,
    description: gallery.description,
    url: gallery.url.startsWith('http') ? gallery.url : `${BASE_URL}${gallery.url}`,
    image: gallery.images.map(img => ({
      '@type': 'ImageObject',
      url: img.url.startsWith('http') ? img.url : `${BASE_URL}${img.url}`,
      name: img.name,
      description: img.description,
    })),
  }
}

/**
 * Generate CreativeWork schema for art pieces
 */
export function generateArtworkSchema(artwork: {
  name: string
  description: string
  image: string
  url: string
  creator?: string
  dateCreated?: string
  artform?: string
  artMedium?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'VisualArtwork',
    name: artwork.name,
    description: artwork.description,
    image: artwork.image.startsWith('http') ? artwork.image : `${BASE_URL}${artwork.image}`,
    url: artwork.url.startsWith('http') ? artwork.url : `${BASE_URL}${artwork.url}`,
    creator: {
      '@type': 'Person',
      name: artwork.creator || 'Brandon Mills',
    },
    dateCreated: artwork.dateCreated,
    artform: artwork.artform,
    artMedium: artwork.artMedium,
  }
}

/**
 * Generate Course schema for meditation guides
 */
export function generateCourseSchema(course: {
  name: string
  description: string
  url: string
  price: number
  provider?: string
  duration?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.name,
    description: course.description,
    url: course.url.startsWith('http') ? course.url : `${BASE_URL}${course.url}`,
    provider: {
      '@type': 'Person',
      name: course.provider || 'Brandon Mills',
      url: BASE_URL,
    },
    offers: {
      '@type': 'Offer',
      price: course.price.toFixed(2),
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'online',
      duration: course.duration,
    },
  }
}

/**
 * Generate HowTo schema for guides and tutorials
 */
export function generateHowToSchema(howTo: {
  name: string
  description: string
  image?: string
  totalTime?: string
  steps: { name: string; text: string; image?: string }[]
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: howTo.name,
    description: howTo.description,
    image: howTo.image ? (howTo.image.startsWith('http') ? howTo.image : `${BASE_URL}${howTo.image}`) : undefined,
    totalTime: howTo.totalTime,
    step: howTo.steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
      image: step.image ? (step.image.startsWith('http') ? step.image : `${BASE_URL}${step.image}`) : undefined,
    })),
  }
}

/**
 * Generate VideoObject schema for video content
 */
export function generateVideoSchema(video: {
  name: string
  description: string
  thumbnailUrl: string
  uploadDate: string
  duration?: string
  contentUrl?: string
  embedUrl?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: video.name,
    description: video.description,
    thumbnailUrl: video.thumbnailUrl.startsWith('http') ? video.thumbnailUrl : `${BASE_URL}${video.thumbnailUrl}`,
    uploadDate: video.uploadDate,
    duration: video.duration,
    contentUrl: video.contentUrl,
    embedUrl: video.embedUrl,
    publisher: {
      '@type': 'Person',
      name: 'Brandon Mills',
      url: BASE_URL,
    },
  }
}

/**
 * Generate Review schema for product reviews
 */
export function generateReviewSchema(review: {
  itemReviewed: {
    type: 'Product' | 'Book' | 'Course'
    name: string
  }
  reviewRating: number
  author: string
  reviewBody: string
  datePublished?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: {
      '@type': review.itemReviewed.type,
      name: review.itemReviewed.name,
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: review.reviewRating,
      bestRating: 5,
      worstRating: 1,
    },
    author: {
      '@type': 'Person',
      name: review.author,
    },
    reviewBody: review.reviewBody,
    datePublished: review.datePublished,
  }
}
