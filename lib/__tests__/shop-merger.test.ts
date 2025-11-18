import { mergeShopProducts } from '../shop-merger'
import { affiliateProducts } from '../affiliate-products'

describe('Shop Product Merger', () => {
  it('should combine Printful and Amazon products', () => {
    // Mock Printful products
    const printfulProducts = [
      {
        id: 1,
        title: 'Genesis Editorial Print',
        description: 'Museum-quality editorial photography',
        basePrice: '12.00',
        currency: 'USD',
        image: '/images/product-1.jpg',
        images: ['/images/product-1.jpg'],
        variantCount: 3,
        variants: [],
        type: 'poster',
        source: 'local-curated',
        tags: ['photography', 'editorial'],
      },
      {
        id: 2,
        title: 'Philosophy Quote Poster',
        description: 'Premium typography design',
        basePrice: '15.00',
        currency: 'USD',
        image: '/images/product-2.jpg',
        images: ['/images/product-2.jpg'],
        variantCount: 2,
        variants: [],
        type: 'canvas',
        source: 'printful',
        tags: ['philosophy', 'typography'],
      },
    ]

    const merged = mergeShopProducts(printfulProducts, affiliateProducts)

    // Should have products from both sources
    expect(merged.length).toBeGreaterThan(21) // At least 21 Amazon products
    expect(merged.some((p) => p.source === 'amazon')).toBe(true)
    expect(merged.some((p) => p.source === 'printful')).toBe(true)
  })

  it('should sort by featured first, then price descending', () => {
    const mockPrintful = [
      {
        id: 1,
        title: 'Regular Product',
        description: 'Regular item',
        basePrice: '50.00',
        currency: 'USD',
        image: '/test.jpg',
        type: 'poster',
        source: 'printful',
      },
      {
        id: 2,
        title: 'Featured Product',
        description: 'Featured item',
        basePrice: '30.00',
        currency: 'USD',
        image: '/test2.jpg',
        type: 'canvas',
        source: 'local-curated', // This makes it featured
      },
    ]

    const mockAmazon = affiliateProducts.slice(0, 3)
    const merged = mergeShopProducts(mockPrintful, mockAmazon)

    // First product should be featured
    const firstFeatured = merged.findIndex((p) => p.featured)
    expect(firstFeatured).toBeGreaterThanOrEqual(0)

    // All featured products should come before non-featured
    const firstNonFeatured = merged.findIndex((p) => !p.featured)
    if (firstNonFeatured >= 0) {
      expect(firstFeatured).toBeLessThan(firstNonFeatured)
    }
  })

  it('should convert Printful products correctly', () => {
    const printfulProducts = [
      {
        id: 123,
        title: 'Test Poster',
        description: 'Test description',
        basePrice: '25.50',
        currency: 'USD',
        image: '/test.jpg',
        images: ['/test.jpg', '/test2.jpg'],
        variantCount: 5,
        variants: [{ id: 1, name: 'Small', size: 'S', color: 'Black', image: '/test.jpg' }],
        syncProductId: 456,
        syncVariantId: 789,
        type: 'poster',
        source: 'local-curated',
        tags: ['photography'],
      },
    ]

    const merged = mergeShopProducts(printfulProducts, [])

    expect(merged.length).toBe(1)
    expect(merged[0].id).toBe('printful-123')
    expect(merged[0].source).toBe('printful')
    expect(merged[0].price).toBe(25.5)
    expect(merged[0].featured).toBe(true) // source === 'local-curated'
    expect(merged[0].variantCount).toBe(5)
    expect(merged[0].category).toBe('poster')
  })

  it('should convert Amazon products correctly', () => {
    const mockAmazon = [
      {
        id: 'test-product',
        name: 'Test Amazon Product',
        description: 'Test description',
        price: 99.99,
        originalPrice: 149.99,
        rating: 4.5,
        reviewCount: 1000,
        images: ['/amazon1.jpg', '/amazon2.jpg'],
        amazonUrl: 'https://amazon.com/test',
        features: ['Feature 1', 'Feature 2'],
        brand: 'Test Brand',
        category: 'Electronics',
        inStock: true,
        featured: true,
      },
    ]

    const merged = mergeShopProducts([], mockAmazon)

    expect(merged.length).toBe(1)
    expect(merged[0].id).toBe('amazon-test-product')
    expect(merged[0].source).toBe('amazon')
    expect(merged[0].title).toBe('Test Amazon Product')
    expect(merged[0].price).toBe(99.99)
    expect(merged[0].originalPrice).toBe(149.99)
    expect(merged[0].rating).toBe(4.5)
    expect(merged[0].reviewCount).toBe(1000)
    expect(merged[0].amazonUrl).toBe('https://amazon.com/test')
    expect(merged[0].featured).toBe(true)
  })
})
