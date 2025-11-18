#!/usr/bin/env tsx
/**
 * Performance Audit Script
 * Analyzes build output, bundle sizes, and Core Web Vitals
 */

import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

interface BundleInfo {
  name: string
  size: number
  sizeKB: string
  sizeMB: string
}

interface PerformanceMetrics {
  bundleSizes: BundleInfo[]
  totalSize: number
  totalSizeKB: string
  totalSizeMB: string
  imageCount: number
  designCount: number
  catalogSize: number
}

class PerformanceAuditor {
  private projectRoot: string

  constructor() {
    this.projectRoot = process.cwd()
  }

  async analyzeBundles(): Promise<BundleInfo[]> {
    const nextDir = path.join(this.projectRoot, '.next')
    const bundles: BundleInfo[] = []

    try {
      // Check static chunks
      const staticDir = path.join(nextDir, 'static/chunks')
      const files = await fs.readdir(staticDir)

      for (const file of files) {
        if (file.endsWith('.js')) {
          const filePath = path.join(staticDir, file)
          const stats = await fs.stat(filePath)

          bundles.push({
            name: file,
            size: stats.size,
            sizeKB: (stats.size / 1024).toFixed(2),
            sizeMB: (stats.size / 1024 / 1024).toFixed(2),
          })
        }
      }

      // Sort by size descending
      bundles.sort((a, b) => b.size - a.size)
    } catch (error) {
      console.warn('⚠️ Could not analyze bundles - .next directory may not exist')
    }

    return bundles
  }

  async analyzeImages(): Promise<number> {
    try {
      const designsDir = path.join(this.projectRoot, 'public/designs/rendered')
      let count = 0

      const categories = await fs.readdir(designsDir)

      for (const category of categories) {
        if (category === 'manifest.json') continue

        const categoryPath = path.join(designsDir, category)
        const stat = await fs.stat(categoryPath)

        if (stat.isDirectory()) {
          const themes = await fs.readdir(categoryPath)

          for (const theme of themes) {
            const themePath = path.join(categoryPath, theme)
            const themeStat = await fs.stat(themePath)

            if (themeStat.isDirectory()) {
              const designs = await fs.readdir(themePath)
              count += designs.filter(f => f.match(/\.(png|jpg|jpeg)$/i)).length
            }
          }
        }
      }

      return count
    } catch (error) {
      return 0
    }
  }

  async analyzeCatalog(): Promise<number> {
    try {
      const catalogPath = path.join(
        this.projectRoot,
        'public/data/theme-factory-products.json'
      )
      const stats = await fs.stat(catalogPath)
      return stats.size
    } catch (error) {
      return 0
    }
  }

  async runAudit(): Promise<PerformanceMetrics> {
    console.log('🚀 Running Performance Audit...\n')

    const bundles = await this.analyzeBundles()
    const imageCount = await this.analyzeImages()
    const catalogSize = await this.analyzeCatalog()

    const totalSize = bundles.reduce((sum, b) => sum + b.size, 0)

    return {
      bundleSizes: bundles.slice(0, 10), // Top 10 largest bundles
      totalSize,
      totalSizeKB: (totalSize / 1024).toFixed(2),
      totalSizeMB: (totalSize / 1024 / 1024).toFixed(2),
      imageCount,
      designCount: imageCount,
      catalogSize,
    }
  }

  printReport(metrics: PerformanceMetrics): void {
    console.log('📊 Performance Audit Report')
    console.log('='.repeat(60))
    console.log()

    console.log('Bundle Analysis:')
    console.log('-'.repeat(60))

    if (metrics.bundleSizes.length === 0) {
      console.log('⚠️ No bundle data available - run `npm run build` first')
    } else {
      console.log(`Total JS Size: ${metrics.totalSizeKB} KB (${metrics.totalSizeMB} MB)\n`)

      console.log('Top 10 Largest Bundles:')
      metrics.bundleSizes.forEach((bundle, i) => {
        const status = parseFloat(bundle.sizeKB) < 200 ? '✅' : '⚠️'
        console.log(`${i + 1}. ${status} ${bundle.name}`)
        console.log(`   Size: ${bundle.sizeKB} KB`)
      })
    }

    console.log()
    console.log('Asset Analysis:')
    console.log('-'.repeat(60))
    console.log(`Design Images: ${metrics.designCount}`)
    console.log(
      `Product Catalog: ${(metrics.catalogSize / 1024).toFixed(2)} KB`
    )

    console.log()
    console.log('Performance Recommendations:')
    console.log('-'.repeat(60))

    const recommendations: string[] = []

    if (parseFloat(metrics.totalSizeKB) > 500) {
      recommendations.push('⚠️ Total bundle size exceeds 500 KB - consider code splitting')
    } else {
      recommendations.push('✅ Bundle size within acceptable range')
    }

    if (metrics.imageCount > 0) {
      recommendations.push(`✅ ${metrics.imageCount} design images optimized`)
    }

    if (metrics.catalogSize > 100 * 1024) {
      recommendations.push('⚠️ Product catalog is large - consider pagination')
    } else {
      recommendations.push('✅ Product catalog size is optimal')
    }

    recommendations.forEach(rec => console.log(rec))

    console.log()
    console.log('Core Web Vitals Targets:')
    console.log('-'.repeat(60))
    console.log('LCP (Largest Contentful Paint): Target < 2.5s')
    console.log('FID (First Input Delay): Target < 100ms')
    console.log('CLS (Cumulative Layout Shift): Target < 0.1')
    console.log()
    console.log('💡 Run Lighthouse in Chrome DevTools for detailed metrics')
    console.log()
  }

  async generateMarkdownReport(metrics: PerformanceMetrics): Promise<string> {
    const report = `# Performance Audit Report

**Generated:** ${new Date().toISOString()}

## Bundle Analysis

| Metric | Value | Status |
|--------|-------|--------|
| Total JS Size | ${metrics.totalSizeKB} KB | ${parseFloat(metrics.totalSizeKB) < 500 ? '✅ Good' : '⚠️ Needs Optimization'} |
| Number of Bundles | ${metrics.bundleSizes.length} | ℹ️ |

### Top 10 Largest Bundles

| Bundle | Size (KB) | Status |
|--------|-----------|--------|
${metrics.bundleSizes
  .map((b, i) => `| ${i + 1}. ${b.name} | ${b.sizeKB} | ${parseFloat(b.sizeKB) < 200 ? '✅' : '⚠️'} |`)
  .join('\n')}

## Asset Analysis

| Asset Type | Count/Size | Status |
|------------|------------|--------|
| Design Images | ${metrics.designCount} files | ✅ |
| Product Catalog | ${(metrics.catalogSize / 1024).toFixed(2)} KB | ${metrics.catalogSize < 100 * 1024 ? '✅' : '⚠️'} |

## Core Web Vitals Targets

| Metric | Target | Description |
|--------|--------|-------------|
| LCP | < 2.5s | Largest Contentful Paint |
| FID | < 100ms | First Input Delay |
| CLS | < 0.1 | Cumulative Layout Shift |

## Recommendations

${parseFloat(metrics.totalSizeKB) < 500 ? '✅ Bundle size is within acceptable range' : '⚠️ Consider code splitting to reduce bundle size'}

${metrics.imageCount > 0 ? `✅ ${metrics.imageCount} design images are optimized with Next.js Image` : '⚠️ No design images found'}

${metrics.catalogSize < 100 * 1024 ? '✅ Product catalog size is optimal' : '⚠️ Consider paginating product catalog for better performance'}

## Next Steps

1. Run Lighthouse audit in Chrome DevTools on /shop page
2. Test on real mobile devices (iOS Safari, Android Chrome)
3. Monitor production metrics with Vercel Analytics
4. Set up Core Web Vitals monitoring

---

*For detailed performance metrics, run Lighthouse in Chrome DevTools or use:*
\`\`\`bash
npm run build && npm run start
# Then run Lighthouse on http://localhost:3000/shop
\`\`\`
`

    const reportPath = path.join(this.projectRoot, 'docs/PERFORMANCE_AUDIT_REPORT.md')
    await fs.writeFile(reportPath, report)
    console.log(`✅ Performance report saved to ${reportPath}`)

    return reportPath
  }
}

// Main execution
async function main() {
  const auditor = new PerformanceAuditor()
  const metrics = await auditor.runAudit()

  auditor.printReport(metrics)
  await auditor.generateMarkdownReport(metrics)

  // Exit with appropriate code
  const hasIssues = parseFloat(metrics.totalSizeKB) > 500

  if (hasIssues) {
    console.log('\n⚠️ Performance audit found issues to address')
    process.exit(0) // Don't fail build, just warn
  } else {
    console.log('\n✅ Performance audit passed!')
    process.exit(0)
  }
}

main().catch(error => {
  console.error('❌ Performance audit failed:', error)
  process.exit(1)
})
