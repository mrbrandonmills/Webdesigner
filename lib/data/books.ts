// Book data structure for Brandon Mills' published works
// Import to store as products

export interface Book {
  id: string
  asin: string
  title: string
  subtitle?: string
  authors: string[]
  description: string
  coverImage: string
  amazonUrl: string
  price: {
    kindle?: number
    paperback?: number
    hardcover?: number
  }
  publicationDate?: string
  pageCount?: number
  series?: {
    name: string
    volume: number
  }
  categories: string[]
  rating?: number
  reviewCount?: number
}

export const brandonMillsBooks: Book[] = [
  {
    id: 'random-acts-building-block-a',
    asin: 'B0DRDXCJZQ',
    title: 'Random Acts of Self-Actualization',
    subtitle: 'Building Block A: Breaking Free From Addictive Patterns',
    authors: ['Brandon Mills', 'Jesse Doherty'],
    description: `In this groundbreaking first volume of the Random Acts of Self-Actualization series, discover how unconscious patterns and societal programming shape your daily choices, relationships, and personal growth. Through practical insights and actionable guidance, learn to identify and transform the subtle addictions that keep you from authentic self-expression and genuine connection.

**This book reveals:**

• How societal conditioning creates unconscious behavioral patterns
• Why traditional approaches to personal growth often reinforce addictive cycles
• The connection between communication breakdowns and deeper psychological patterns
• Practical tools for recognizing and transforming unconscious behaviors
• Methods for developing authentic relationships free from codependent patterns
• Strategies for integrating technology mindfully without feeding addictive tendencies

Moving beyond traditional self-help approaches, Building Block A provides a framework for understanding how everyday addictions manifest in our lives—from social media and external validation to relationship patterns and professional achievements. Through conscious awareness and practical implementation strategies, readers learn to break free from these patterns and create lasting positive change.

Whether you're navigating relationship challenges, seeking more authentic communication, or looking to break free from unconscious patterns, this book offers a comprehensive guide to beginning your journey of self-actualization. Each chapter builds upon the last, creating a solid foundation for conscious living while providing immediate, actionable steps for implementing these insights in your daily life.

Transform your understanding of yourself and your relationships. Start your journey toward conscious living with Building Block A: Breaking Free from Addictive Patterns.`,
    coverImage: '/images/books/random-acts-building-block-a.jpg',
    amazonUrl: 'https://www.amazon.com/Random-Acts-Self-Actualization-Building-Addictive-ebook/dp/B0DRDXCJZQ',
    price: {
      kindle: 9.99,
    },
    publicationDate: '2024',
    categories: ['Self-Help', 'Personal Development', 'Psychology', 'Personal Transformation'],
    rating: 5.0,
    reviewCount: 2,
    series: {
      name: 'Random Acts of Self-Actualization',
      volume: 1,
    },
  },
  // Volume 2 and additional books will be added here
]

// Helper function to create store product from book data
export function bookToStoreProduct(book: Book) {
  return {
    name: book.subtitle ? `${book.title}: ${book.subtitle}` : book.title,
    description: book.description,
    price: book.price.kindle || book.price.paperback || 0,
    images: [book.coverImage],
    category: 'Books',
    metadata: {
      asin: book.asin,
      authors: book.authors.join(', '),
      amazonUrl: book.amazonUrl,
      publicationDate: book.publicationDate,
      pageCount: book.pageCount,
      series: book.series,
    },
  }
}
