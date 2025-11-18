/**
 * Design Renderer
 * Converts SVG designs from DesignGenerator to high-quality PNG/JPG files for Printful
 * Supports 300 DPI rendering, Genesis photo compositing, and multiple product variants
 */

import { Resvg } from '@resvg/resvg-js'
import sharp from 'sharp'
import * as fs from 'fs/promises'
import * as path from 'path'
import { DesignGenerator } from './design-generator'
import { contentThemes } from './store-curator'

// Initialize WASM for resvg
let wasmInitialized = false

export interface RenderConfig {
  width: number
  height: number
  dpi: number
  format: 'png' | 'jpg'
  quality?: number // For JPG
  background?: string // For non-transparent backgrounds
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

export class DesignRenderer {
  private static outputDir = '/Volumes/Super Mastery/Webdesigner/public/designs/rendered'

  /**
   * Initialize WASM for resvg
   */
  private static async initializeWasm(): Promise<void> {
    if (!wasmInitialized) {
      // resvg-js handles WASM initialization automatically in Node.js
      // We don't need to manually initialize it
      wasmInitialized = true
    }
  }

  /**
   * Convert SVG string to PNG buffer at specified dimensions
   */
  static async renderSVGtoPNG(
    svg: string,
    width: number,
    height: number,
    background?: string
  ): Promise<Buffer> {
    await this.initializeWasm()

    // Clean up SVG and ensure it's valid
    svg = svg.trim()

    // Fix viewBox and dimensions
    if (!svg.includes('viewBox')) {
      // Extract original dimensions if present
      const widthMatch = svg.match(/width="(\d+)"/)
      const heightMatch = svg.match(/height="(\d+)"/)
      const origWidth = widthMatch ? parseInt(widthMatch[1]) : width
      const origHeight = heightMatch ? parseInt(heightMatch[1]) : height

      svg = svg.replace(
        /<svg([^>]*)>/,
        `<svg$1 viewBox="0 0 ${origWidth} ${origHeight}">`
      )
    }

    // Ensure width and height are set
    svg = svg.replace(/width="[^"]*"/, `width="${width}"`)
    svg = svg.replace(/height="[^"]*"/, `height="${height}"`)

    try {
      // Create Resvg instance with options
      const resvg = new Resvg(svg, {
        fitTo: {
          mode: 'width',
          value: width,
        },
        background: background || 'rgba(0,0,0,0)',
        font: {
          loadSystemFonts: true, // Load system fonts
          defaultFontFamily: 'Arial', // Use a common fallback
        },
      })

      const pngData = resvg.render()
      const pngBuffer = Buffer.from(pngData.asPng())

      // Use sharp for final processing and optimization
      let sharpInstance = sharp(pngBuffer)

      // Resize to exact dimensions if needed
      const metadata = await sharpInstance.metadata()
      if (metadata.width !== width || metadata.height !== height) {
        sharpInstance = sharpInstance.resize(width, height, {
          fit: 'fill',
          background: background
            ? { r: parseInt(background.slice(1, 3), 16), g: parseInt(background.slice(3, 5), 16), b: parseInt(background.slice(5, 7), 16), alpha: 1 }
            : { r: 0, g: 0, b: 0, alpha: 0 },
        })
      }

      return sharpInstance
        .png({ quality: 100, compressionLevel: 6 })
        .toBuffer()
    } catch (error) {
      console.error('Error rendering SVG with Resvg, falling back to sharp:', error)

      // Fallback: Use sharp directly to convert SVG
      const svgBuffer = Buffer.from(svg)
      return sharp(svgBuffer, { density: 300 })
        .resize(width, height, {
          fit: 'fill',
          background: background
            ? { r: parseInt(background.slice(1, 3), 16), g: parseInt(background.slice(3, 5), 16), b: parseInt(background.slice(5, 7), 16), alpha: 1 }
            : { r: 0, g: 0, b: 0, alpha: 0 },
        })
        .png({ quality: 100, compressionLevel: 6 })
        .toBuffer()
    }
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

    let svg: string
    let outputPath: string

    // Generate appropriate SVG based on category
    if (category === 'poetry') {
      svg = DesignGenerator.generatePoetryDesign(themeId, productType)

      // Scale SVG to match product dimensions
      svg = this.scaleSVG(svg, spec.width, spec.height)
    } else if (category === 'photography') {
      // For photography, we need to composite the photo with overlay
      return this.renderPhotographyProduct(themeId, productType)
    } else if (category === 'philosophy') {
      svg = DesignGenerator.generatePhilosophyDesign(themeId, productType)

      // Scale SVG to match product dimensions
      svg = this.scaleSVG(svg, spec.width, spec.height)
    } else {
      throw new Error(`Unknown category: ${category}`)
    }

    // Render to PNG/JPG
    const buffer = await this.renderSVGtoPNG(
      svg,
      spec.width,
      spec.height,
      spec.background
    )

    // Save to file system
    outputPath = await this.saveRenderedDesign(
      buffer,
      category,
      themeId,
      productType,
      spec.format
    )

    // If JPG is requested, convert
    if (spec.format === 'jpg') {
      const jpgBuffer = await sharp(buffer)
        .jpeg({ quality: 95, mozjpeg: true })
        .toBuffer()

      outputPath = outputPath.replace('.png', '.jpg')
      await fs.writeFile(outputPath, jpgBuffer)

      return outputPath
    }

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

    // Load and process the Genesis photo
    let processedImage = sharp(imagePath)
      .resize(spec.width, spec.height, {
        fit: 'cover',
        position: 'center',
      })

    // Apply luxury filters based on theme
    if (themeId === 'am-reed-monochrome') {
      // Convert to high-contrast B&W
      processedImage = processedImage
        .grayscale()
        .normalise()
        .modulate({
          brightness: 1.1,
          saturation: 0,
        })
    } else if (themeId === 'am-reed-aqua') {
      // Enhance aqua tones
      processedImage = processedImage
        .modulate({
          brightness: 1.05,
          saturation: 1.2,
        })
        .tint({ r: 64, g: 224, b: 208 }) // Turquoise tint
    } else if (themeId === 'am-reed-leather') {
      // Urban edge with increased contrast
      processedImage = processedImage
        .modulate({
          brightness: 0.95,
          saturation: 0.9,
        })
        .linear(1.2, -(0.2 * 255)) // Increase contrast
    }

    // Generate the overlay frame
    const frameSvg = DesignGenerator.generatePhotographyFrame(themeId)

    // Scale frame to product dimensions
    const scaledFrameSvg = this.scaleSVG(frameSvg, spec.width, spec.height)

    // Convert frame to PNG
    const frameBuffer = await this.renderSVGtoPNG(
      scaledFrameSvg,
      spec.width,
      spec.height
    )

    // Composite photo with frame overlay
    const compositeBuffer = await processedImage
      .composite([
        {
          input: frameBuffer,
          blend: 'over',
        },
      ])
      .toBuffer()

    // Add subtle luxury enhancements
    const finalBuffer = await sharp(compositeBuffer)
      .sharpen({ sigma: 0.5 })
      .toBuffer()

    // Save the rendered design
    const outputPath = await this.saveRenderedDesign(
      finalBuffer,
      'photography',
      themeId,
      productType,
      spec.format
    )

    // Convert to JPG if needed
    if (spec.format === 'jpg') {
      const jpgBuffer = await sharp(finalBuffer)
        .jpeg({ quality: 95, mozjpeg: true })
        .toBuffer()

      const jpgPath = outputPath.replace('.png', '.jpg')
      await fs.writeFile(jpgPath, jpgBuffer)

      return jpgPath
    }

    return outputPath
  }

  /**
   * Scale SVG to specific dimensions
   */
  private static scaleSVG(svg: string, width: number, height: number): string {
    // Update width and height attributes
    svg = svg.replace(/width="[^"]*"/, `width="${width}"`)
    svg = svg.replace(/height="[^"]*"/, `height="${height}"`)

    // Ensure viewBox is set for proper scaling
    if (!svg.includes('viewBox')) {
      svg = svg.replace(
        /<svg([^>]*)>/,
        `<svg$1 viewBox="0 0 ${width} ${height}">`
      )
    }

    return svg
  }

  /**
   * Save rendered design to file system
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

    // Determine which product types to render based on theme
    const productTypes = this.getProductTypesForTheme(category, themeId)

    for (const productType of productTypes) {
      try {
        const path = await this.renderDesignForProduct(category, themeId, productType)
        renderedPaths.push(path)
        console.log(`✅ Rendered ${themeId} → ${productType}`)
      } catch (error) {
        console.error(`❌ Failed to render ${themeId} → ${productType}:`, error)
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
    // Default product types based on category
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
              sizeBytes: stats.size,
              productType: file.replace(/\.(png|jpg)$/, ''),
            })

            manifest.totalDesigns++
            manifest.totalSizeBytes += stats.size
          }
        }
      } catch (error) {
        console.warn(`Category ${category} not found or empty`)
      }
    }

    // Save manifest
    const manifestPath = path.join(this.outputDir, 'manifest.json')
    await fs.writeFile(
      manifestPath,
      JSON.stringify(manifest, null, 2)
    )

    console.log(`\n📊 Manifest saved to ${manifestPath}`)
    console.log(`   Total designs: ${manifest.totalDesigns}`)
    console.log(`   Total size: ${(manifest.totalSizeBytes / 1024 / 1024).toFixed(2)} MB`)
  }
}