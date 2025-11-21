/**
 * Books Data - Server-side source of truth for book pricing and metadata
 *
 * IMPORTANT: Never trust client-provided prices. Always look up prices server-side.
 */

export interface Book {
  id: string
  title: string
  price: number // Price in USD
  description: string
}

export const BOOKS: Record<string, Book> = {
  'block-a': {
    id: 'block-a',
    title: 'Block A',
    price: 9.99,
    description: 'Full PDF book with lifetime access',
  },
  'block-b': {
    id: 'block-b',
    title: 'Block B',
    price: 9.99,
    description: 'Full PDF book with lifetime access',
  },
  'block-c': {
    id: 'block-c',
    title: 'Block C',
    price: 14.99,
    description: 'Full PDF book with lifetime access',
  },
}

/**
 * Get book by ID - returns undefined if book doesn't exist
 */
export function getBookById(bookId: string): Book | undefined {
  return BOOKS[bookId]
}

/**
 * Get all available books
 */
export function getAllBooks(): Book[] {
  return Object.values(BOOKS)
}

/**
 * Check if a book ID is valid
 */
export function isValidBookId(bookId: string): boolean {
  return bookId in BOOKS
}
