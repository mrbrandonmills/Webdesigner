/**
 * Design Generator
 * Uses theme factory to create luxury designs for curated products
 */

import { designTokens } from './design-tokens'
import { contentThemes } from './store-curator'

export interface DesignConfig {
  width: number
  height: number
  theme: string
  content: string
  style: 'typography' | 'photography' | 'infographic' | 'mixed'
}

export class DesignGenerator {
  /**
   * Generate SVG design for poetry products
   */
  static generatePoetryDesign(poemId: string, productType: string): string {
    const theme = contentThemes.poetry[poemId as keyof typeof contentThemes.poetry]
    if (!theme) return this.generatePlaceholder(poemId)

    const { width, height } = this.getDimensionsByType(productType)
    const [primary, secondary, tertiary] = theme.colorPalette

    // Get poem text
    const poemTexts: Record<string, string[]> = {
      'fine-lines': [
        'We lean on singular words',
        'with multiple meanings,',
        'but we don\'t know',
        'how to use them.',
      ],
      'poet-proponent': [
        'A poet,',
        'a proponent of my life',
        'from here on after',
      ],
      'the-tourbillon': [
        'Did I take the rope',
        'off my neck',
        'just to put it',
        'around my wrist?',
      ],
    }

    const lines = poemTexts[poemId as keyof typeof poemTexts] || []

    return `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad-${poemId}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${secondary};stop-opacity:0.1" />
            <stop offset="100%" style="stop-color:${primary};stop-opacity:0.05" />
          </linearGradient>

          <filter id="noise">
            <feTurbulence baseFrequency="0.8" numOctaves="4" />
            <feColorMatrix type="saturate" values="0" />
            <feBlend mode="multiply" in="SourceGraphic" />
          </filter>
        </defs>

        <!-- Background -->
        <rect width="100%" height="100%" fill="${secondary}" />

        <!-- Subtle gradient overlay -->
        <rect width="100%" height="100%" fill="url(#grad-${poemId})" />

        <!-- Noise texture -->
        <rect width="100%" height="100%" fill="${primary}" opacity="0.02" filter="url(#noise)" />

        <!-- Main text -->
        <g text-anchor="middle" font-family="Playfair Display, serif">
          ${lines.map((line, i) => `
            <text
              x="${width / 2}"
              y="${height / 2 - (lines.length * 35) + (i * 70)}"
              font-size="${i === 0 ? '56' : '48'}"
              font-weight="${i === 0 ? '600' : '300'}"
              fill="${primary}"
              opacity="${i === 0 ? '1' : '0.9'}"
              letter-spacing="${i === 0 ? '0.05em' : '0.02em'}"
            >
              ${line}
            </text>
          `).join('')}
        </g>

        <!-- Signature line -->
        <text
          x="${width / 2}"
          y="${height - 80}"
          text-anchor="middle"
          font-family="Inter, sans-serif"
          font-size="14"
          fill="${primary}"
          opacity="0.6"
          letter-spacing="0.3em"
          font-weight="300"
        >
          ${theme.name.toUpperCase()}
        </text>

        <!-- Luxury accent line -->
        <line
          x1="${width / 2 - 100}"
          y1="${height - 50}"
          x2="${width / 2 + 100}"
          y2="${height - 50}"
          stroke="${primary}"
          stroke-width="1"
          opacity="0.3"
        />
      </svg>
    `
  }

  /**
   * Generate design for photography products (overlay/frame only)
   */
  static generatePhotographyFrame(photoId: string): string {
    const theme = contentThemes.photography[photoId as keyof typeof contentThemes.photography]
    if (!theme) return ''

    const [primary] = theme.colorPalette

    return `
      <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="shine" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="${primary}" stop-opacity="0" />
            <stop offset="50%" stop-color="${primary}" stop-opacity="0.3" />
            <stop offset="100%" stop-color="${primary}" stop-opacity="0" />
          </linearGradient>
        </defs>

        <!-- Corner accents -->
        <path d="M 2 2 L 20 2 L 20 4 L 4 4 L 4 20 L 2 20 Z" fill="${primary}" opacity="0.6" />
        <path d="M 98 2 L 80 2 L 80 4 L 96 4 L 96 20 L 98 20 Z" fill="${primary}" opacity="0.6" />
        <path d="M 2 98 L 20 98 L 20 96 L 4 96 L 4 80 L 2 80 Z" fill="${primary}" opacity="0.6" />
        <path d="M 98 98 L 80 98 L 80 96 L 96 96 L 96 80 L 98 80 Z" fill="${primary}" opacity="0.6" />

        <!-- Signature -->
        <text
          x="50"
          y="95"
          text-anchor="middle"
          font-family="Playfair Display, serif"
          font-size="4"
          fill="${primary}"
          opacity="0.8"
          letter-spacing="0.2em"
        >
          BRANDON MILLS
        </text>
      </svg>
    `
  }

  /**
   * Generate infographic-style design for essays
   */
  static generatePhilosophyDesign(essayId: string, productType: string): string {
    const theme = contentThemes.philosophy[essayId as keyof typeof contentThemes.philosophy]
    if (!theme) return this.generatePlaceholder(essayId)

    const { width, height } = this.getDimensionsByType(productType)
    const [primary, secondary, accent] = theme.colorPalette

    const essayTitles: Record<string, { title: string; subtitle: string; keyPoints: string[] }> = {
      'enlightenment-science': {
        title: 'Enlightenment',
        subtitle: 'Through Science',
        keyPoints: ['Classical Framework', 'Quantum Consciousness', 'Liberation Path'],
      },
      'social-theory': {
        title: 'Social Theory',
        subtitle: 'Understanding Power',
        keyPoints: ['Structure', 'Inequality', 'Cultural Impact'],
      },
      'self-esteem': {
        title: 'Self-Esteem',
        subtitle: 'Cultivating Worth',
        keyPoints: ['Self-Compassion', 'Self-Care', 'Positive Self-Talk'],
      },
    }

    const essay = essayTitles[essayId as keyof typeof essayTitles] || {
      title: 'Philosophy',
      subtitle: 'Deep Thinking',
      keyPoints: [],
    }

    return `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="radial-${essayId}">
            <stop offset="0%" stop-color="${accent}" stop-opacity="0.15" />
            <stop offset="100%" stop-color="${secondary}" stop-opacity="0" />
          </radialGradient>
        </defs>

        <!-- Background -->
        <rect width="100%" height="100%" fill="${secondary}" />

        <!-- Radial accent -->
        <circle cx="${width / 2}" cy="${height / 3}" r="${width / 2}" fill="url(#radial-${essayId})" />

        <!-- Title -->
        <text
          x="${width / 2}"
          y="${height / 3}"
          text-anchor="middle"
          font-family="Playfair Display, serif"
          font-size="72"
          font-weight="600"
          fill="${primary}"
          letter-spacing="0.05em"
        >
          ${essay.title}
        </text>

        <!-- Subtitle -->
        <text
          x="${width / 2}"
          y="${height / 3 + 60}"
          text-anchor="middle"
          font-family="Inter, sans-serif"
          font-size="32"
          font-weight="300"
          fill="${primary}"
          opacity="0.7"
          letter-spacing="0.15em"
        >
          ${essay.subtitle}
        </text>

        <!-- Divider line -->
        <line
          x1="${width / 2 - 150}"
          y1="${height / 2}"
          x2="${width / 2 + 150}"
          y2="${height / 2}"
          stroke="${primary}"
          stroke-width="2"
          opacity="0.4"
        />

        <!-- Key points -->
        ${essay.keyPoints.map((point, i) => `
          <g>
            <circle
              cx="${width / 2 - 200}"
              cy="${height / 2 + 80 + (i * 60)}"
              r="8"
              fill="${primary}"
              opacity="0.6"
            />
            <text
              x="${width / 2 - 170}"
              y="${height / 2 + 86 + (i * 60)}"
              font-family="Inter, sans-serif"
              font-size="24"
              fill="${primary}"
              opacity="0.8"
              font-weight="300"
            >
              ${point}
            </text>
          </g>
        `).join('')}

        <!-- Footer signature -->
        <text
          x="${width / 2}"
          y="${height - 60}"
          text-anchor="middle"
          font-family="Playfair Display, serif"
          font-size="18"
          fill="${primary}"
          opacity="0.5"
          letter-spacing="0.3em"
        >
          BRANDON MILLS
        </text>
      </svg>
    `
  }

  /**
   * Get dimensions based on product type
   */
  private static getDimensionsByType(type: string): { width: number; height: number } {
    const dimensions: Record<string, { width: number; height: number }> = {
      'framed-poster': { width: 2400, height: 3600 }, // 18x24"
      'premium-framed-poster': { width: 3600, height: 4800 }, // 24x36"
      'canvas': { width: 3000, height: 4000 },
      'large-canvas': { width: 4000, height: 5000 },
      'greeting-cards': { width: 1400, height: 1960 }, // 5x7"
      'postcards': { width: 1200, height: 1800 }, // 4x6"
    }

    return dimensions[type] || { width: 2400, height: 3600 }
  }

  /**
   * Generate placeholder design
   */
  private static generatePlaceholder(id: string): string {
    return `
      <svg width="2400" height="3600" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#000000" />
        <text
          x="1200"
          y="1800"
          text-anchor="middle"
          font-family="Playfair Display, serif"
          font-size="48"
          fill="#D4AF37"
          opacity="0.5"
        >
          ${id}
        </text>
      </svg>
    `
  }

  /**
   * Convert SVG to data URL for use in products
   */
  static svgToDataUrl(svg: string): string {
    const encoded = encodeURIComponent(svg)
      .replace(/'/g, '%27')
      .replace(/"/g, '%22')
    return `data:image/svg+xml,${encoded}`
  }
}
