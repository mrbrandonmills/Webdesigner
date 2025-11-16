/**
 * Store Curator
 * AI-powered curation system that selects meaningful content to productize
 * Uses theme factory to generate intentional, luxury designs
 */

import { designTokens } from './design-tokens'

// Content themes matching the luxury aesthetic
export const contentThemes = {
  poetry: {
    'fine-lines': {
      name: 'Fine Lines',
      essence: 'Language as weapon and wound',
      aestheticDirection: 'Typography-forward, minimal, sharp edges',
      colorPalette: ['#D4AF37', '#000000', '#FFFFFF'],
      mood: 'Critical, intellectual, urgent',
      targetAudience: 'Linguists, activists, critical thinkers',
      productTypes: ['framed-poster', 'greeting-cards', 'postcards'],
      designApproach: 'Large typography with key words highlighted, wordplay emphasized',
    },
    'poet-proponent': {
      name: 'Poet, Proponent',
      essence: 'Liberation through art, survival as methodology',
      aestheticDirection: 'Bold, street art meets museum, graffiti elegance',
      colorPalette: ['#C9A050', '#000000', '#8B4513'],
      mood: 'Defiant, powerful, transformative',
      targetAudience: 'Social justice advocates, artists, educators',
      productTypes: ['large-canvas', 'framed-poster', 'greeting-card-sets'],
      designApproach: 'Mixed typography, layered text, urban aesthetic with gold accents',
    },
    'the-tourbillon': {
      name: 'The Tourbillon',
      essence: 'Luxury as constraint, beautiful bondage',
      aestheticDirection: 'Horological precision, mechanical elegance',
      colorPalette: ['#D4AF37', '#1a1a1a', '#B89040'],
      mood: 'Contemplative, luxurious, paradoxical',
      targetAudience: 'Watch collectors, luxury consumers, philosophers',
      productTypes: ['premium-framed-poster', 'canvas', 'luxury-greeting-cards'],
      designApproach: 'Serif typography, mechanical diagrams, gold foil effect, parchment texture',
    },
  },

  photography: {
    'am-reed-aqua': {
      name: 'Aqua Meditation',
      essence: 'Stillness in turquoise, masculine vulnerability',
      aestheticDirection: 'Editorial minimalism, color field painting',
      colorPalette: ['#40E0D0', '#D4AF37', '#000000'],
      mood: 'Meditative, sensual, introspective',
      targetAudience: 'Interior designers, art collectors, fashion enthusiasts',
      productTypes: ['large-canvas', 'premium-framed-poster'],
      designApproach: 'Full bleed photo, minimal text, museum-quality finish',
    },
    'am-reed-leather': {
      name: 'Urban Edge',
      essence: 'Masculine sophistication, editorial grit',
      aestheticDirection: 'High fashion meets street photography',
      colorPalette: ['#1a1a1a', '#D4AF37', '#8B7355'],
      mood: 'Confident, edgy, sophisticated',
      targetAudience: 'Fashion enthusiasts, young professionals, collectors',
      productTypes: ['framed-poster', 'canvas', 'greeting-cards'],
      designApproach: 'Dramatic contrast, gold accent elements, editorial layout',
    },
    'am-reed-monochrome': {
      name: 'Monochrome Elegance',
      essence: 'Timeless sophistication in B&W',
      aestheticDirection: 'Classic fine art photography',
      colorPalette: ['#000000', '#FFFFFF', '#C9A050'],
      mood: 'Timeless, elegant, intimate',
      targetAudience: 'Art collectors, interior designers, photography enthusiasts',
      productTypes: ['premium-framed-poster', 'large-canvas'],
      designApproach: 'High contrast B&W, gold signature element, archival quality',
    },
  },

  philosophy: {
    'enlightenment-science': {
      name: 'Quantum Consciousness',
      essence: 'Science meets enlightenment, bridging frameworks',
      aestheticDirection: 'Scientific diagrams with spiritual undertones',
      colorPalette: ['#D4AF37', '#000000', '#4A90E2'],
      mood: 'Intellectual, expansive, transformative',
      targetAudience: 'Neuroscientists, philosophers, consciousness explorers',
      productTypes: ['framed-poster', 'canvas', 'educational-prints'],
      designApproach: 'Infographic style, sacred geometry, quantum wave patterns',
    },
    'social-theory': {
      name: 'Structures of Power',
      essence: 'Understanding societal frameworks',
      aestheticDirection: 'Academic meets accessible, visual sociology',
      colorPalette: ['#B8934C', '#000000', '#E5C073'],
      mood: 'Analytical, empowering, educational',
      targetAudience: 'Students, educators, activists',
      productTypes: ['framed-poster', 'postcards', 'greeting-card-sets'],
      designApproach: 'Diagram-heavy, clear typography, visual hierarchy',
    },
    'self-esteem': {
      name: 'Cultivating Self',
      essence: 'Practical wisdom for mental well-being',
      aestheticDirection: 'Warm, accessible, encouraging',
      colorPalette: ['#C4A661', '#000000', '#8B7355'],
      mood: 'Nurturing, hopeful, empowering',
      targetAudience: 'Therapists, students, self-improvement seekers',
      productTypes: ['greeting-cards', 'postcards', 'framed-poster'],
      designApproach: 'Soft serif, generous whitespace, affirming layout',
    },
  },

  books: {
    'block-a-cover': {
      name: 'Breaking Free',
      essence: 'Liberation from addictive patterns',
      aestheticDirection: 'Book cover as art piece',
      colorPalette: ['#D4AF37', '#000000', '#8B4513'],
      mood: 'Transformative, bold, courageous',
      targetAudience: 'Recovery community, readers, gift-givers',
      productTypes: ['framed-poster', 'canvas'],
      designApproach: 'Book cover enlarged, treated as fine art',
    },
    'block-b-cover': {
      name: 'Pattern Recognition',
      essence: 'Understanding emotional intelligence',
      aestheticDirection: 'Geometric patterns meet psychology',
      colorPalette: ['#C9A050', '#000000', '#4A90E2'],
      mood: 'Insightful, systematic, empowering',
      targetAudience: 'Students, therapists, readers',
      productTypes: ['framed-poster', 'canvas'],
      designApproach: 'Book cover with added visual elements, pattern emphasis',
    },
  },
} as const

/**
 * Curation criteria - what makes content worthy of becoming a product?
 */
export interface CurationCriteria {
  visualImpact: number      // 1-10: How visually striking is it?
  emotionalResonance: number // 1-10: Does it move people?
  intellectualDepth: number  // 1-10: Is there substance?
  marketViability: number    // 1-10: Will people buy it?
  uniqueness: number         // 1-10: Is it differentiated?
  brandAlignment: number     // 1-10: Does it fit the luxury brand?
}

/**
 * Product recommendation based on content and theme
 */
export interface ProductRecommendation {
  themeId: string
  themeName: string
  contentId: string
  productType: string
  priority: number // 1-100
  reasoning: string
  designDirection: string
  estimatedPrice: string
  targetMarket: string
}

/**
 * Curate which pieces of content should become products
 */
export class StoreCurator {
  /**
   * Analyze content and recommend products
   */
  static curatePoetry(poemId: string): ProductRecommendation[] {
    const theme = contentThemes.poetry[poemId as keyof typeof contentThemes.poetry]
    if (!theme) return []

    const recommendations: ProductRecommendation[] = []

    // For each recommended product type
    theme.productTypes.forEach((productType, index) => {
      const basePrice = this.getPriceByType(productType)
      const priority = 100 - (index * 10) // Higher priority for first product type

      recommendations.push({
        themeId: poemId,
        themeName: theme.name,
        contentId: `poetry-${poemId}`,
        productType,
        priority,
        reasoning: `${theme.essence} - ${theme.mood} aesthetic appeals to ${theme.targetAudience}`,
        designDirection: theme.designApproach,
        estimatedPrice: basePrice,
        targetMarket: theme.targetAudience,
      })
    })

    return recommendations
  }

  /**
   * Curate photography for products
   */
  static curatePhotography(photoId: string): ProductRecommendation[] {
    const theme = contentThemes.photography[photoId as keyof typeof contentThemes.photography]
    if (!theme) return []

    const recommendations: ProductRecommendation[] = []

    theme.productTypes.forEach((productType, index) => {
      const basePrice = this.getPriceByType(productType)
      const priority = 95 - (index * 10) // High priority for photography

      recommendations.push({
        themeId: photoId,
        themeName: theme.name,
        contentId: `photo-${photoId}`,
        productType,
        priority,
        reasoning: `${theme.essence} - Museum-quality photography for ${theme.targetAudience}`,
        designDirection: theme.designApproach,
        estimatedPrice: basePrice,
        targetMarket: theme.targetAudience,
      })
    })

    return recommendations
  }

  /**
   * Curate essays/philosophy for products
   */
  static curatePhilosophy(essayId: string): ProductRecommendation[] {
    const theme = contentThemes.philosophy[essayId as keyof typeof contentThemes.philosophy]
    if (!theme) return []

    const recommendations: ProductRecommendation[] = []

    theme.productTypes.forEach((productType, index) => {
      const basePrice = this.getPriceByType(productType)
      const priority = 85 - (index * 10) // Medium-high priority

      recommendations.push({
        themeId: essayId,
        themeName: theme.name,
        contentId: `essay-${essayId}`,
        productType,
        priority,
        reasoning: `${theme.essence} - Educational and inspiring for ${theme.targetAudience}`,
        designDirection: theme.designApproach,
        estimatedPrice: basePrice,
        targetMarket: theme.targetAudience,
      })
    })

    return recommendations
  }

  /**
   * Get all curated product recommendations sorted by priority
   */
  static getCuratedCollection(): ProductRecommendation[] {
    const all: ProductRecommendation[] = []

    // Poetry
    all.push(...this.curatePoetry('fine-lines'))
    all.push(...this.curatePoetry('poet-proponent'))
    all.push(...this.curatePoetry('the-tourbillon'))

    // Photography
    all.push(...this.curatePhotography('am-reed-aqua'))
    all.push(...this.curatePhotography('am-reed-leather'))
    all.push(...this.curatePhotography('am-reed-monochrome'))

    // Philosophy
    all.push(...this.curatePhilosophy('enlightenment-science'))
    all.push(...this.curatePhilosophy('social-theory'))
    all.push(...this.curatePhilosophy('self-esteem'))

    // Sort by priority
    return all.sort((a, b) => b.priority - a.priority)
  }

  /**
   * Get strategic pricing by product type
   */
  private static getPriceByType(type: string): string {
    const pricing: Record<string, string> = {
      'premium-framed-poster': '149.00',
      'framed-poster': '79.00',
      'large-canvas': '249.00',
      'canvas': '179.00',
      'greeting-cards': '4.99',
      'greeting-card-sets': '19.99',
      'luxury-greeting-cards': '7.99',
      'postcards': '3.99',
      'educational-prints': '49.00',
    }

    return pricing[type] || '49.00'
  }

  /**
   * Map product type to Printful product ID
   */
  static getPrintfulProductId(type: string): number {
    const mapping: Record<string, number> = {
      'framed-poster': 1, // Enhanced matte paper framed poster
      'premium-framed-poster': 1,
      'canvas': 29, // Canvas print
      'large-canvas': 29,
      'greeting-cards': 281, // Greeting card
      'greeting-card-sets': 281,
      'luxury-greeting-cards': 281,
      'postcards': 156, // Postcard
      'educational-prints': 1,
    }

    return mapping[type] || 1
  }
}
