/**
 * Design Renderer using Sharp
 * Converts SVG designs from DesignGenerator to high-quality PNG/JPG files for Printful
 * Uses pure Sharp library for stability
 */

import sharp from 'sharp'
import * as fs from 'fs/promises'
import * as path from 'path'
import { DesignGenerator } from './design-generator'
import { contentThemes } from './store-curator'
import { logger } from '@/lib/logger'

export interface RenderConfig {
  width: number
  height: number
  dpi: number
  format: 'png' | 'jpg'
  quality?: number
  background?: string
}

export interface ProductDimensions {
  width: number
  height: number
  dpi: number
  format: 'png' | 'jpg'
  background?: string
}

// Printful product specifications at 300 DPI
export const PRODUCT_SPECS: Record<string, ProductDimensions> = {
  't-shirt': {
    width: 4500,
    height: 5400,
    dpi: 300,
    format: 'png',
  },
  'hoodie': {
    width: 4500,
    height: 5400,
    dpi: 300,
    format: 'png',
  },
  'poster': {
    width: 3600,
    height: 5400,
    dpi: 300,
    format: 'jpg',
    background: '#FFFFFF',
  },
  'wall-art': {
    width: 3600,
    height: 5400,
    dpi: 300,
    format: 'jpg',
    background: '#FFFFFF',
  },
  'mug': {
    width: 2475,
    height: 1155,
    dpi: 300,
    format: 'png',
  },
  'phone-case': {
    width: 3000,
    height: 6000,
    dpi: 300,
    format: 'png',
  },
  'tote-bag': {
    width: 4500,
    height: 4500,
    dpi: 300,
    format: 'png',
  },
  'pillow': {
    width: 4500,
    height: 4500,
    dpi: 300,
    format: 'png',
  },
}

export class DesignRendererSharp {
  private static outputDir = '/Volumes/Super Mastery/Webdesigner/public/designs/rendered'

  /**
   * Convert SVG string to PNG/JPG buffer at specified dimensions
   */
  static async renderSVGtoImage(
    svg: string,
    width: number,
    height: number,
    format: 'png' | 'jpg' = 'png',
    background?: string
  ): Promise<Buffer> {
    // Clean up SVG
    svg = svg.trim()

    // Ensure proper dimensions in SVG
    if (!svg.includes('viewBox')) {
      const widthMatch = svg.match(/width="(\d+)"/)
      const heightMatch = svg.match(/height="(\d+)"/)
      const origWidth = widthMatch ? parseInt(widthMatch[1]) : width
      const origHeight = heightMatch ? parseInt(heightMatch[1]) : height

      svg = svg.replace(
        /<svg([^>]*)>/,
        `<svg$1 viewBox="0 0 ${origWidth} ${origHeight}">`
      )
    }

    // Update dimensions
    svg = svg.replace(/width="[^"]*"/, `width="${width}"`)
    svg = svg.replace(/height="[^"]*"/, `height="${height}"`)

    // Convert SVG to buffer
    const svgBuffer = Buffer.from(svg)

    // Process with sharp
    let pipeline = sharp(svgBuffer, {
      density: 300, // 300 DPI
    })
      .resize(width, height, {
        fit: 'fill',
        background: background
          ? this.hexToRgb(background)
          : { r: 0, g: 0, b: 0, alpha: 0 },
      })

    // Output format
    if (format === 'jpg') {
      return pipeline
        .flatten({ background: background || '#FFFFFF' })
        .jpeg({ quality: 95, mozjpeg: true })
        .toBuffer()
    } else {
      return pipeline
        .png({ quality: 100, compressionLevel: 6 })
        .toBuffer()
    }
  }

  /**
   * Convert hex color to RGB object
   */
  private static hexToRgb(hex: string): { r: number; g: number; b: number; alpha: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
          alpha: 1,
        }
      : { r: 255, g: 255, b: 255, alpha: 1 }
  }

  /**
   * Render a design for a specific product type
   */
  static async renderDesignForProduct(
    category: 'poetry' | 'photography' | 'philosophy',
    themeId: string,
    productType: string
  ): Promise<string> {
    const spec = PRODUCT_SPECS[productType]
    if (!spec) {
      throw new Error(`Unknown product type: ${productType}`)
    }

    let outputPath: string

    if (category === 'photography') {
      // Handle photography with photo compositing
      return this.renderPhotographyProduct(themeId, productType)
    }

    // Generate SVG for poetry or philosophy
    let svg: string
    if (category === 'poetry') {
      svg = DesignGenerator.generatePoetryDesign(themeId, productType)
    } else if (category === 'philosophy') {
      svg = DesignGenerator.generatePhilosophyDesign(themeId, productType)
    } else {
      throw new Error(`Unknown category: ${category}`)
    }

    // Scale SVG to product dimensions
    svg = this.scaleSVG(svg, spec.width, spec.height)

    // Render to image
    const buffer = await this.renderSVGtoImage(
      svg,
      spec.width,
      spec.height,
      spec.format,
      spec.background
    )

    // Save to filesystem
    outputPath = await this.saveRenderedDesign(
      buffer,
      category,
      themeId,
      productType,
      spec.format
    )

    return outputPath
  }

  /**
   * Render photography product with Genesis photo compositing
   */
  private static async renderPhotographyProduct(
    themeId: string,
    productType: string
  ): Promise<string> {
    const spec = PRODUCT_SPECS[productType]
    const theme = contentThemes.photography[themeId as keyof typeof contentThemes.photography]

    if (!theme || !theme.sourceImage) {
      throw new Error(`No source image for photography theme: ${themeId}`)
    }

    // Convert relative path to absolute
    const imagePath = path.join(
      '/Volumes/Super Mastery/Webdesigner/public',
      theme.sourceImage.replace(/^\//, '')
    )

    // Check if file exists
    try {
      await fs.access(imagePath)
    } catch (error) {
      logger.warn('Source image not found: ${imagePath}, using placeholder')
      // Generate a placeholder design instead
      return this.generatePlaceholderDesign(themeId, productType, spec)
    }

    // Load and process the Genesis photo
    let processedImage = sharp(imagePath)

    // Get image metadata
    const metadata = await processedImage.metadata()

    // Calculate crop dimensions to maintain aspect ratio
    const targetAspect = spec.width / spec.height
    const sourceAspect = (metadata.width || 1) / (metadata.height || 1)

    let cropWidth = metadata.width || spec.width
    let cropHeight = metadata.height || spec.height

    if (sourceAspect > targetAspect) {
      // Image is wider, crop width
      cropWidth = Math.floor((metadata.height || spec.height) * targetAspect)
    } else {
      // Image is taller, crop height
      cropHeight = Math.floor((metadata.width || spec.width) / targetAspect)
    }

    // Apply theme-specific processing
    processedImage = processedImage.extract({
      left: Math.floor(((metadata.width || 0) - cropWidth) / 2),
      top: Math.floor(((metadata.height || 0) - cropHeight) / 2),
      width: cropWidth,
      height: cropHeight,
    })

    // Resize to final dimensions
    processedImage = processedImage.resize(spec.width, spec.height, {
      fit: 'fill',
    })

    // Apply artistic filters based on theme
    if (themeId === 'am-reed-monochrome') {
      processedImage = processedImage
        .grayscale()
        .normalise()
        .modulate({
          brightness: 1.1,
          saturation: 0,
        })
        .sharpen({ sigma: 1.5 })
    } else if (themeId === 'am-reed-aqua') {
      processedImage = processedImage
        .modulate({
          brightness: 1.05,
          saturation: 1.3,
          hue: 180, // Shift toward cyan
        })
        .sharpen({ sigma: 1 })
    } else if (themeId === 'am-reed-leather') {
      processedImage = processedImage
        .modulate({
          brightness: 0.95,
          saturation: 0.85,
        })
        .linear(1.3, -(0.15 * 255))
        .sharpen({ sigma: 2 })
    }

    // Create luxury overlay with branding
    const overlay = await this.createLuxuryOverlay(spec.width, spec.height, theme)

    // Composite the overlay
    const finalBuffer = await processedImage
      .composite([
        {
          input: overlay,
          blend: 'over',
        },
      ])
      .toFormat(spec.format === 'jpg' ? 'jpeg' : 'png', {
        quality: spec.format === 'jpg' ? 95 : 100,
        mozjpeg: spec.format === 'jpg',
      })
      .toBuffer()

    // Save the rendered design
    const outputPath = await this.saveRenderedDesign(
      finalBuffer,
      'photography',
      themeId,
      productType,
      spec.format
    )

    return outputPath
  }

  /**
   * Create luxury overlay for photography
   */
  private static async createLuxuryOverlay(
    width: number,
    height: number,
    theme: { colorPalette: string[]; name?: string }
  ): Promise<Buffer> {
    const [primary] = theme.colorPalette

    // Create a subtle signature overlay
    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="fade" x1="0%" y1="80%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#000000" stop-opacity="0" />
            <stop offset="100%" stop-color="#000000" stop-opacity="0.3" />
          </linearGradient>
        </defs>

        <!-- Bottom gradient fade for text -->
        <rect x="0" y="${height * 0.8}" width="${width}" height="${height * 0.2}" fill="url(#fade)" />

        <!-- Luxury corner accents -->
        <g opacity="0.5">
          <path d="M 40 40 L 140 40 L 140 42 L 42 42 L 42 140 L 40 140 Z" fill="${primary}" />
          <path d="M ${width - 40} 40 L ${width - 140} 40 L ${width - 140} 42 L ${width - 42} 42 L ${width - 42} 140 L ${width - 40} 140 Z" fill="${primary}" />
          <path d="M 40 ${height - 40} L 140 ${height - 40} L 140 ${height - 42} L 42 ${height - 42} L 42 ${height - 140} L 40 ${height - 140} Z" fill="${primary}" />
          <path d="M ${width - 40} ${height - 40} L ${width - 140} ${height - 40} L ${width - 140} ${height - 42} L ${width - 42} ${height - 42} L ${width - 42} ${height - 140} L ${width - 40} ${height - 140} Z" fill="${primary}" />
        </g>

        <!-- Brand signature -->
        <text
          x="${width / 2}"
          y="${height - 80}"
          text-anchor="middle"
          font-family="Arial, sans-serif"
          font-size="42"
          fill="#FFFFFF"
          opacity="0.9"
          letter-spacing="0.3em"
          font-weight="300"
        >
          BRANDON MILLS
        </text>

        <!-- Theme name -->
        <text
          x="${width / 2}"
          y="${height - 120}"
          text-anchor="middle"
          font-family="Arial, sans-serif"
          font-size="28"
          fill="${primary}"
          opacity="0.8"
          letter-spacing="0.15em"
          font-weight="600"
        >
          ${theme.name.toUpperCase()}
        </text>
      </svg>
    `

    return Buffer.from(svg)
  }

  /**
   * Generate placeholder design when photo is missing
   */
  private static async generatePlaceholderDesign(
    themeId: string,
    productType: string,
    spec: ProductDimensions
  ): Promise<string> {
    const svg = `
      <svg width="${spec.width}" height="${spec.height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#1a1a1a" />
        <text
          x="${spec.width / 2}"
          y="${spec.height / 2}"
          text-anchor="middle"
          font-family="Arial, sans-serif"
          font-size="72"
          fill="#D4AF37"
          opacity="0.5"
        >
          ${themeId.toUpperCase()}
        </text>
        <text
          x="${spec.width / 2}"
          y="${spec.height / 2 + 80}"
          text-anchor="middle"
          font-family="Arial, sans-serif"
          font-size="36"
          fill="#D4AF37"
          opacity="0.3"
        >
          Photography Collection
        </text>
      </svg>
    `

    const buffer = await this.renderSVGtoImage(
      svg,
      spec.width,
      spec.height,
      spec.format,
      spec.background
    )

    const outputPath = await this.saveRenderedDesign(
      buffer,
      'photography',
      themeId,
      productType,
      spec.format
    )

    return outputPath
  }

  /**
   * Scale SVG to specific dimensions
   */
  private static scaleSVG(svg: string, width: number, height: number): string {
    svg = svg.replace(/width="[^"]*"/, `width="${width}"`)
    svg = svg.replace(/height="[^"]*"/, `height="${height}"`)

    if (!svg.includes('viewBox')) {
      svg = svg.replace(
        /<svg([^>]*)>/,
        `<svg$1 viewBox="0 0 ${width} ${height}">`
      )
    }

    return svg
  }

  /**
   * Save rendered design to filesystem
   */
  private static async saveRenderedDesign(
    buffer: Buffer,
    category: string,
    themeId: string,
    productType: string,
    format: string
  ): Promise<string> {
    const dirPath = path.join(this.outputDir, category, themeId)

    // Ensure directory exists
    await fs.mkdir(dirPath, { recursive: true })

    const fileName = `${productType}.${format}`
    const filePath = path.join(dirPath, fileName)

    await fs.writeFile(filePath, buffer)

    return filePath
  }

  /**
   * Render all product variants for a theme
   */
  static async renderAllVariants(
    category: 'poetry' | 'photography' | 'philosophy',
    themeId: string
  ): Promise<string[]> {
    const renderedPaths: string[] = []
    const themes = contentThemes[category]
    const theme = themes[themeId as keyof typeof themes]

    if (!theme) {
      throw new Error(`Theme not found: ${category}/${themeId}`)
    }

    const productTypes = this.getProductTypesForTheme(category, themeId)

    for (const productType of productTypes) {
      try {
        const path = await this.renderDesignForProduct(category, themeId, productType)
        renderedPaths.push(path)
        logger.info('productType}')
      } catch (error) {
        logger.error('productType}: ${error}')
      }
    }

    return renderedPaths
  }

  /**
   * Get appropriate product types for a theme
   */
  private static getProductTypesForTheme(
    category: string,
    themeId: string
  ): string[] {
    const defaultTypes: Record<string, string[]> = {
      poetry: ['t-shirt', 'poster', 'mug', 'phone-case'],
      photography: ['poster', 'wall-art', 'phone-case', 'tote-bag'],
      philosophy: ['t-shirt', 'poster', 'mug', 'tote-bag'],
    }

    return defaultTypes[category] || ['t-shirt', 'poster', 'mug']
  }

  /**
   * Generate manifest of all rendered designs
   */
  static async generateManifest(): Promise<void> {
    const manifest: Record<string, any> = {
      generatedAt: new Date().toISOString(),
      categories: {},
      totalDesigns: 0,
      totalSizeBytes: 0,
      productSpecs: PRODUCT_SPECS,
    }

    const categories = ['poetry', 'photography', 'philosophy']

    for (const category of categories) {
      const categoryPath = path.join(this.outputDir, category)

      try {
        const themes = await fs.readdir(categoryPath)
        manifest.categories[category] = {}

        for (const theme of themes) {
          const themePath = path.join(categoryPath, theme)
          const files = await fs.readdir(themePath)

          manifest.categories[category][theme] = []

          for (const file of files) {
            const filePath = path.join(themePath, file)
            const stats = await fs.stat(filePath)

            manifest.categories[category][theme].push({
              file,
              path: `/designs/rendered/${category}/${theme}/${file}`,
              absolutePath: filePath,
              sizeBytes: stats.size,
              sizeMB: (stats.size / 1024 / 1024).toFixed(2),
              productType: file.replace(/\.(png|jpg)$/, ''),
              format: file.endsWith('.png') ? 'png' : 'jpg',
            })

            manifest.totalDesigns++
            manifest.totalSizeBytes += stats.size
          }
        }
      } catch (error) {
        // Category might not exist yet
      }
    }

    manifest.totalSizeMB = (manifest.totalSizeBytes / 1024 / 1024).toFixed(2)

    // Save manifest
    const manifestPath = path.join(this.outputDir, 'manifest.json')
    await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2))

    logger.info('n📊 Manifest saved to ${manifestPath}')
    logger.info('Total designs: ${manifest.totalDesigns}')
    logger.info('Total size: ${manifest.totalSizeMB} MB')
  }
}