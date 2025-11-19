/**
 * JSON-LD Structured Data Utilities
 *
 * This module provides type-safe generators for Google-compatible structured data.
 * Rich snippets improve CTR by 20-30% in search results.
 *
 * Test your structured data: https://search.google.com/test/rich-results
 * Schema.org reference: https://schema.org/
 */

const BASE_URL = 'https://brandonmills.com'

// Type definitions for structured data
export interface OrganizationSchema {
  '@context': string
  '@type': 'Organization' | 'Person'
  name: string
  url: string
  logo?: string
  description?: string
  email?: string
  sameAs?: string[]
  founder?: {
    '@type': 'Person'
    name: string
  }
}

export interface WebSiteSchema {
  '@context': string
  '@type': 'WebSite'
  name: string
  url: string
  description?: string
  publisher?: {
    '@type': 'Person' | 'Organization'
    name: string
  }
  potentialAction?: {
    '@type': 'SearchAction'
    target: {
      '@type': 'EntryPoint'
      urlTemplate: string
    }
    'query-input': string
  }
}

export interface ProductSchema {
  '@context': string
  '@type': 'Product'
  name: string
  description: string
  image: string | string[]
  brand?: {
    '@type': 'Brand'
    name: string
  }
  sku?: string
  offers: {
    '@type': 'Offer' | 'AggregateOffer'
    price?: number | string
    lowPrice?: number | string
    highPrice?: number | string
    priceCurrency: string
    availability: string
    url?: string
    seller?: {
      '@type': 'Organization'
      name: string
    }
  }
  aggregateRating?: {
    '@type': 'AggregateRating'
    ratingValue: number | string
    reviewCount: number
    bestRating?: string
    worstRating?: string
  }
}

export interface ArticleSchema {
  '@context': string
  '@type': 'Article' | 'BlogPosting'
  headline: string
  description: string
  image: string | string[]
  datePublished: string
  dateModified?: string
  author: {
    '@type': 'Person'
    name: string
    url?: string
  }
  publisher: {
    '@type': 'Organization' | 'Person'
    name: string
    logo?: {
      '@type': 'ImageObject'
      url: string
    }
  }
  mainEntityOfPage?: {
    '@type': 'WebPage'
    '@id': string
  }
  wordCount?: number
  articleSection?: string
}

export interface SoftwareApplicationSchema {
  '@context': string
  '@type': 'WebApplication' | 'SoftwareApplication'
  name: string
  description: string
  applicationCategory: string
  operatingSystem?: string
  offers?: {
    '@type': 'Offer'
    price: string
    priceCurrency: string
  }
  aggregateRating?: {
    '@type': 'AggregateRating'
    ratingValue: number | string
    ratingCount: number
  }
  featureList?: string[]
  screenshot?: string | string[]
}

export interface BreadcrumbSchema {
  '@context': string
  '@type': 'BreadcrumbList'
  itemListElement: {
    '@type': 'ListItem'
    position: number
    name: string
    item: string
  }[]
}

export interface FAQSchema {
  '@context': string
  '@type': 'FAQPage'
  mainEntity: {
    '@type': 'Question'
    name: string
    acceptedAnswer: {
      '@type': 'Answer'
      text: string
    }
  }[]
}

// Generator functions

/**
 * Generate Organization/Person schema for the site owner
 */
export function generateOrganizationSchema(): OrganizationSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Brandon Mills',
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
    description: 'Polymath, model, philosopher, and entrepreneur. Renaissance living in the modern age.',
    sameAs: [
      'https://www.instagram.com/brandonmillsofficial',
      'https://www.linkedin.com/in/brandonmillsofficial',
      'https://twitter.com/brandonmills',
    ],
  }
}

/**
 * Generate WebSite schema with optional search action
 */
export function generateWebSiteSchema(options?: {
  includeSearch?: boolean
}): WebSiteSchema {
  const schema: WebSiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Brandon Mills',
    url: BASE_URL,
    description: 'Renaissance living in the modern age. Philosophy, meditation, premium products for deep thinkers.',
    publisher: {
      '@type': 'Person',
      name: 'Brandon Mills',
    },
  }

  if (options?.includeSearch) {
    schema.potentialAction = {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/shop?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    }
  }

  return schema
}

/**
 * Generate Product schema for shop items
 */
export function generateProductSchema(product: {
  name: string
  description: string
  images: string[]
  price: number
  brand?: string
  sku?: string
  inStock?: boolean
  rating?: number
  reviewCount?: number
  slug: string
}): ProductSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images.map(img =>
      img.startsWith('http') ? img : `${BASE_URL}${img}`
    ),
    brand: product.brand ? {
      '@type': 'Brand',
      name: product.brand,
    } : undefined,
    sku: product.sku,
    offers: {
      '@type': 'Offer',
      price: product.price.toFixed(2),
      priceCurrency: 'USD',
      availability: product.inStock !== false
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      url: `${BASE_URL}/shop/${product.slug}`,
      seller: {
        '@type': 'Organization',
        name: 'Brandon Mills',
      },
    },
    aggregateRating: product.rating && product.reviewCount ? {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
      bestRating: '5',
      worstRating: '1',
    } : undefined,
  }
}

/**
 * Generate AggregateOffer schema for product collections
 */
export function generateAggregateOfferSchema(options: {
  name: string
  description: string
  lowPrice: number
  highPrice: number
  offerCount: number
  image?: string
}): ProductSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: options.name,
    description: options.description,
    image: options.image ? `${BASE_URL}${options.image}` : `${BASE_URL}/og-image.jpg`,
    offers: {
      '@type': 'AggregateOffer',
      lowPrice: options.lowPrice.toFixed(2),
      highPrice: options.highPrice.toFixed(2),
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
  }
}

/**
 * Generate Article/BlogPosting schema
 */
export function generateArticleSchema(article: {
  title: string
  description: string
  image: string
  datePublished: string
  dateModified?: string
  url: string
  category?: string
  wordCount?: number
}): ArticleSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.description,
    image: article.image.startsWith('http')
      ? article.image
      : `${BASE_URL}${article.image}`,
    datePublished: article.datePublished,
    dateModified: article.dateModified || article.datePublished,
    author: {
      '@type': 'Person',
      name: 'Brandon Mills',
      url: BASE_URL,
    },
    publisher: {
      '@type': 'Person',
      name: 'Brandon Mills',
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': article.url.startsWith('http') ? article.url : `${BASE_URL}${article.url}`,
    },
    wordCount: article.wordCount,
    articleSection: article.category,
  }
}

/**
 * Generate SoftwareApplication schema for web apps
 */
export function generateSoftwareApplicationSchema(app: {
  name: string
  description: string
  category: string
  features?: string[]
  screenshot?: string
  isFree?: boolean
  rating?: number
  ratingCount?: number
}): SoftwareApplicationSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: app.name,
    description: app.description,
    applicationCategory: app.category,
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: app.isFree !== false ? '0' : '0',
      priceCurrency: 'USD',
    },
    featureList: app.features,
    screenshot: app.screenshot
      ? (app.screenshot.startsWith('http') ? app.screenshot : `${BASE_URL}${app.screenshot}`)
      : undefined,
    aggregateRating: app.rating && app.ratingCount ? {
      '@type': 'AggregateRating',
      ratingValue: app.rating,
      ratingCount: app.ratingCount,
    } : undefined,
  }
}

/**
 * Generate Breadcrumb schema
 */
export function generateBreadcrumbSchema(items: {
  name: string
  url: string
}[]): BreadcrumbSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${BASE_URL}${item.url}`,
    })),
  }
}

/**
 * Generate FAQ schema
 */
export function generateFAQSchema(questions: {
  question: string
  answer: string
}[]): FAQSchema {
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
 * Combine multiple schemas into a graph
 */
export function combineSchemas(...schemas: Record<string, unknown>[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@graph': schemas.map(schema => {
      // Remove @context from individual schemas when combining
      const { '@context': _, ...rest } = schema
      return rest
    }),
  }
}
