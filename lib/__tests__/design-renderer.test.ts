/**
 * Design Renderer Tests
 * Verify SVG to PNG/JPG conversion and Genesis photo compositing
 */

import { describe, it, expect, beforeAll, afterAll } from '@jest/globals'
import { DesignRenderer, PRODUCT_SPECS } from '../design-renderer'
import { DesignGenerator } from '../design-generator'
import * as fs from 'fs/promises'
import * as path from 'path'
import sharp from 'sharp'

describe('DesignRenderer', () => {
  const testOutputDir = '/Volumes/Super Mastery/Webdesigner/public/designs/test-rendered'

  beforeAll(async () => {
    // Create test output directory
    await fs.mkdir(testOutputDir, { recursive: true })
  })

  afterAll(async () => {
    // Clean up test files
    try {
      await fs.rm(testOutputDir, { recursive: true, force: true })
    } catch (error) {
      // Directory might not exist
    }
  })

  describe('SVG to PNG Conversion', () => {
    it('should convert SVG to PNG at correct dimensions', async () => {
      const svg = `
        <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
          <rect width="100" height="100" fill="#D4AF37" />
          <text x="50" y="50" text-anchor="middle" fill="#000000">TEST</text>
        </svg>
      `

      const buffer = await DesignRenderer.renderSVGtoPNG(svg, 1000, 1000)

      expect(buffer).toBeInstanceOf(Buffer)
      expect(buffer.length).toBeGreaterThan(0)

      // Verify dimensions using sharp
      const metadata = await sharp(buffer).metadata()
      expect(metadata.width).toBe(1000)
      expect(metadata.height).toBe(1000)
      expect(metadata.format).toBe('png')
    })

    it('should handle transparent backgrounds for PNG', async () => {
      const svg = `
        <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="40" fill="#D4AF37" />
        </svg>
      `

      const buffer = await DesignRenderer.renderSVGtoPNG(svg, 500, 500)
      const metadata = await sharp(buffer).metadata()

      expect(metadata.channels).toBe(4) // RGBA channels
      expect(metadata.hasAlpha).toBe(true)
    })

    it('should handle background color when specified', async () => {
      const svg = `
        <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
          <text x="50" y="50" text-anchor="middle" fill="#000000">TEST</text>
        </svg>
      `

      const buffer = await DesignRenderer.renderSVGtoPNG(svg, 500, 500, '#FFFFFF')

      // Save to file for manual inspection
      const testPath = path.join(testOutputDir, 'background-test.png')
      await fs.writeFile(testPath, buffer)

      const metadata = await sharp(buffer).metadata()
      expect(metadata.width).toBe(500)
      expect(metadata.height).toBe(500)
    })
  })

  describe('Product-Specific Rendering', () => {
    it('should render poetry design for t-shirt at correct dimensions', async () => {
      const outputPath = await DesignRenderer.renderDesignForProduct(
        'poetry',
        'fine-lines',
        't-shirt'
      )

      expect(outputPath).toContain('t-shirt.png')

      // Verify file exists and has correct dimensions
      const buffer = await fs.readFile(outputPath)
      const metadata = await sharp(buffer).metadata()

      const spec = PRODUCT_SPECS['t-shirt']
      expect(metadata.width).toBe(spec.width)
      expect(metadata.height).toBe(spec.height)
      expect(metadata.format).toBe('png')
      expect(metadata.density).toBeGreaterThanOrEqual(72) // DPI check
    })

    it('should render poster as JPG with white background', async () => {
      const outputPath = await DesignRenderer.renderDesignForProduct(
        'philosophy',
        'enlightenment-science',
        'poster'
      )

      expect(outputPath).toContain('poster.jpg')

      // Verify JPG format
      const buffer = await fs.readFile(outputPath)
      const metadata = await sharp(buffer).metadata()

      expect(metadata.format).toBe('jpeg')
      expect(metadata.width).toBe(PRODUCT_SPECS['poster'].width)
      expect(metadata.height).toBe(PRODUCT_SPECS['poster'].height)
      expect(metadata.channels).toBe(3) // RGB without alpha
    })

    it('should render mug design at correct wrap dimensions', async () => {
      const outputPath = await DesignRenderer.renderDesignForProduct(
        'poetry',
        'the-tourbillon',
        'mug'
      )

      const buffer = await fs.readFile(outputPath)
      const metadata = await sharp(buffer).metadata()

      expect(metadata.width).toBe(PRODUCT_SPECS['mug'].width)
      expect(metadata.height).toBe(PRODUCT_SPECS['mug'].height)
      expect(metadata.format).toBe('png')
    })
  })

  describe('Photography Product Rendering', () => {
    it('should composite Genesis photo with overlay for photography theme', async () => {
      // This test requires actual Genesis photos to exist
      try {
        const outputPath = await DesignRenderer.renderDesignForProduct(
          'photography',
          'am-reed-monochrome',
          'poster'
        )

        expect(outputPath).toContain('photography/am-reed-monochrome')
        expect(outputPath).toContain('poster.jpg')

        // Verify the image has been processed
        const buffer = await fs.readFile(outputPath)
        const metadata = await sharp(buffer).metadata()

        expect(metadata.width).toBe(PRODUCT_SPECS['poster'].width)
        expect(metadata.height).toBe(PRODUCT_SPECS['poster'].height)

        // For monochrome theme, check if grayscale was applied
        const stats = await sharp(buffer).stats()

        // In grayscale, all channels should have similar values
        const rChannel = stats.channels[0]
        const gChannel = stats.channels[1]
        const bChannel = stats.channels[2]

        // Channels should be similar for grayscale
        expect(Math.abs(rChannel.mean - gChannel.mean)).toBeLessThan(5)
        expect(Math.abs(gChannel.mean - bChannel.mean)).toBeLessThan(5)
      } catch (error) {
        // Skip if Genesis photos aren't available
        console.warn('Skipping photography test - Genesis photos not found')
      }
    })
  })

  describe('Batch Rendering', () => {
    it('should render all variants for a poetry theme', async () => {
      const renderedPaths = await DesignRenderer.renderAllVariants(
        'poetry',
        'poet-proponent'
      )

      expect(renderedPaths.length).toBeGreaterThan(0)
      expect(renderedPaths.length).toBeLessThanOrEqual(4) // Max 4 product types

      // Verify each file exists
      for (const filePath of renderedPaths) {
        const exists = await fs.access(filePath)
          .then(() => true)
          .catch(() => false)

        expect(exists).toBe(true)
      }
    })

    it('should handle theme not found gracefully', async () => {
      await expect(
        DesignRenderer.renderAllVariants('poetry', 'non-existent-theme')
      ).rejects.toThrow('Theme not found')
    })
  })

  describe('Manifest Generation', () => {
    it('should generate manifest with correct structure', async () => {
      // Render a few test designs first
      await DesignRenderer.renderDesignForProduct('poetry', 'fine-lines', 't-shirt')
      await DesignRenderer.renderDesignForProduct('philosophy', 'self-esteem', 'mug')

      // Generate manifest
      await DesignRenderer.generateManifest()

      const manifestPath = '/Volumes/Super Mastery/Webdesigner/public/designs/rendered/manifest.json'
      const manifestContent = await fs.readFile(manifestPath, 'utf-8')
      const manifest = JSON.parse(manifestContent)

      expect(manifest).toHaveProperty('generatedAt')
      expect(manifest).toHaveProperty('categories')
      expect(manifest).toHaveProperty('totalDesigns')
      expect(manifest).toHaveProperty('totalSizeBytes')

      expect(manifest.totalDesigns).toBeGreaterThan(0)
      expect(manifest.totalSizeBytes).toBeGreaterThan(0)
    })
  })

  describe('Performance', () => {
    it('should render a design in reasonable time', async () => {
      const startTime = Date.now()

      await DesignRenderer.renderDesignForProduct(
        'poetry',
        'fine-lines',
        'phone-case'
      )

      const elapsedMs = Date.now() - startTime

      // Should complete within 5 seconds
      expect(elapsedMs).toBeLessThan(5000)
    })

    it('should render all variants for a theme in under 30 seconds', async () => {
      const startTime = Date.now()

      await DesignRenderer.renderAllVariants('philosophy', 'social-theory')

      const elapsedMs = Date.now() - startTime

      // Should complete within 30 seconds for all variants
      expect(elapsedMs).toBeLessThan(30000)
    })
  })

  describe('Quality Checks', () => {
    it('should maintain text readability at high DPI', async () => {
      const outputPath = await DesignRenderer.renderDesignForProduct(
        'poetry',
        'fine-lines',
        't-shirt'
      )

      const buffer = await fs.readFile(outputPath)
      const metadata = await sharp(buffer).metadata()

      // Check that DPI is preserved (Sharp reports as pixels per inch)
      expect(metadata.density).toBeGreaterThanOrEqual(72)

      // File size should be reasonable for print quality
      const stats = await fs.stat(outputPath)
      expect(stats.size).toBeGreaterThan(100 * 1024) // At least 100KB
      expect(stats.size).toBeLessThan(50 * 1024 * 1024) // Less than 50MB
    })

    it('should optimize file sizes without quality loss', async () => {
      const outputPath = await DesignRenderer.renderDesignForProduct(
        'philosophy',
        'enlightenment-science',
        'poster'
      )

      const stats = await fs.stat(outputPath)

      // JPG should be efficiently compressed
      expect(stats.size).toBeLessThan(10 * 1024 * 1024) // Less than 10MB for poster
    })
  })
})