/**
 * Product Analytics & Performance Tracking
 * Tracks product engagement to optimize inventory
 */

export interface ProductMetrics {
  productId: string
  views: number
  clicks: number
  addedToCart: number
  purchased: number
  revenue: number
  lastViewed: string
  firstSeen: string
  conversionRate: number
  performanceScore: number
}

export interface PerformanceThresholds {
  minViews: number // Minimum views before making decisions
  minConversionRate: number // Minimum conversion rate to keep
  staleDays: number // Days without views before considering stale
  topPerformerPercentile: number // Top X% to replicate
}

const DEFAULT_THRESHOLDS: PerformanceThresholds = {
  minViews: 50, // Need at least 50 views to judge
  minConversionRate: 0.02, // 2% add-to-cart rate minimum
  staleDays: 30, // Remove if no views in 30 days
  topPerformerPercentile: 0.2 // Top 20% are winners
}

export class ProductAnalytics {
  private static STORAGE_KEY = 'bmills_product_metrics'

  /**
   * Track product view
   */
  static trackView(productId: string) {
    if (typeof window === 'undefined') return

    const metrics = this.getMetrics()
    const product = this.getOrCreateProduct(productId, metrics)

    product.views++
    product.lastViewed = new Date().toISOString()
    product.performanceScore = this.calculateScore(product)

    this.saveMetrics(metrics)

    // Send to analytics endpoint
    this.sendEvent('product_view', { productId })
  }

  /**
   * Track product click (clicked on product card)
   */
  static trackClick(productId: string) {
    if (typeof window === 'undefined') return

    const metrics = this.getMetrics()
    const product = this.getOrCreateProduct(productId, metrics)

    product.clicks++
    product.performanceScore = this.calculateScore(product)

    this.saveMetrics(metrics)
    this.sendEvent('product_click', { productId })
  }

  /**
   * Track add to cart
   */
  static trackAddToCart(productId: string, price: number) {
    if (typeof window === 'undefined') return

    const metrics = this.getMetrics()
    const product = this.getOrCreateProduct(productId, metrics)

    product.addedToCart++
    product.conversionRate = product.addedToCart / product.views
    product.performanceScore = this.calculateScore(product)

    this.saveMetrics(metrics)
    this.sendEvent('add_to_cart', { productId, price })
  }

  /**
   * Track purchase
   */
  static trackPurchase(productId: string, revenue: number) {
    if (typeof window === 'undefined') return

    const metrics = this.getMetrics()
    const product = this.getOrCreateProduct(productId, metrics)

    product.purchased++
    product.revenue += revenue
    product.performanceScore = this.calculateScore(product)

    this.saveMetrics(metrics)
    this.sendEvent('purchase', { productId, revenue })
  }

  /**
   * Calculate performance score (0-100)
   */
  private static calculateScore(product: ProductMetrics): number {
    let score = 0

    // Conversion rate (40 points max)
    score += Math.min(product.conversionRate * 2000, 40)

    // Click-through rate (30 points max)
    const ctr = product.views > 0 ? product.clicks / product.views : 0
    score += Math.min(ctr * 300, 30)

    // Purchase rate (30 points max)
    const purchaseRate = product.views > 0 ? product.purchased / product.views : 0
    score += Math.min(purchaseRate * 3000, 30)

    return Math.round(score)
  }

  /**
   * Get underperforming products to remove
   */
  static getUnderperformers(thresholds = DEFAULT_THRESHOLDS): string[] {
    const metrics = this.getMetrics()
    const now = new Date()
    const underperformers: string[] = []

    Object.entries(metrics).forEach(([productId, product]) => {
      // Skip if not enough data
      if (product.views < thresholds.minViews) return

      // Check if stale (no views in X days)
      const daysSinceView = (now.getTime() - new Date(product.lastViewed).getTime()) / (1000 * 60 * 60 * 24)
      if (daysSinceView > thresholds.staleDays) {
        underperformers.push(productId)
        return
      }

      // Check conversion rate
      if (product.conversionRate < thresholds.minConversionRate) {
        underperformers.push(productId)
        return
      }

      // Check performance score
      if (product.performanceScore < 20) {
        underperformers.push(productId)
      }
    })

    return underperformers
  }

  /**
   * Get top performers to replicate
   */
  static getTopPerformers(thresholds = DEFAULT_THRESHOLDS): ProductMetrics[] {
    const metrics = this.getMetrics()
    const products = Object.values(metrics)

    // Filter to products with enough data
    const qualified = products.filter(p => p.views >= thresholds.minViews)

    // Sort by performance score
    qualified.sort((a, b) => b.performanceScore - a.performanceScore)

    // Return top X%
    const topCount = Math.ceil(qualified.length * thresholds.topPerformerPercentile)
    return qualified.slice(0, Math.max(topCount, 1))
  }

  /**
   * Get insights for optimization
   */
  static getInsights() {
    const metrics = this.getMetrics()
    const products = Object.values(metrics)

    if (products.length === 0) {
      return {
        totalProducts: 0,
        totalViews: 0,
        totalRevenue: 0,
        avgConversionRate: 0,
        topPerformers: [],
        underperformers: [],
        recommendations: ['Generate your first products to start collecting data']
      }
    }

    const totalViews = products.reduce((sum, p) => sum + p.views, 0)
    const totalRevenue = products.reduce((sum, p) => sum + p.revenue, 0)
    const avgConversionRate = products.reduce((sum, p) => sum + p.conversionRate, 0) / products.length

    const topPerformers = this.getTopPerformers()
    const underperformers = this.getUnderperformers()

    const recommendations = []

    if (underperformers.length > 0) {
      recommendations.push(`Remove ${underperformers.length} underperforming products`)
    }

    if (topPerformers.length > 0) {
      recommendations.push(`Create ${topPerformers.length * 3} variations of top performers`)
    }

    if (products.length < 20) {
      recommendations.push('Generate more products to test (aim for 30-50 total)')
    }

    return {
      totalProducts: products.length,
      totalViews,
      totalRevenue,
      avgConversionRate,
      topPerformers: topPerformers.slice(0, 5),
      underperformers,
      recommendations
    }
  }

  /**
   * Auto-optimize: Remove bad, replicate good
   */
  static async autoOptimize(): Promise<{
    removed: number
    created: number
    message: string
  }> {
    const underperformers = this.getUnderperformers()
    const topPerformers = this.getTopPerformers()

    // Remove underperformers
    await fetch('/api/admin/products/remove', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productIds: underperformers })
    })

    // Create variations of winners
    const variations = await fetch('/api/admin/products/replicate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        products: topPerformers.map(p => p.productId),
        variationsPerProduct: 3
      })
    })

    const result = await variations.json()

    return {
      removed: underperformers.length,
      created: result.created || 0,
      message: `Removed ${underperformers.length} underperformers, created ${result.created} new variations`
    }
  }

  // Helper methods
  private static getMetrics(): Record<string, ProductMetrics> {
    if (typeof window === 'undefined') return {}

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      return stored ? JSON.parse(stored) : {}
    } catch {
      return {}
    }
  }

  private static saveMetrics(metrics: Record<string, ProductMetrics>) {
    if (typeof window === 'undefined') return

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(metrics))
    } catch (error) {
      console.error('Failed to save metrics:', error)
    }
  }

  private static getOrCreateProduct(productId: string, metrics: Record<string, ProductMetrics>): ProductMetrics {
    if (!metrics[productId]) {
      metrics[productId] = {
        productId,
        views: 0,
        clicks: 0,
        addedToCart: 0,
        purchased: 0,
        revenue: 0,
        lastViewed: new Date().toISOString(),
        firstSeen: new Date().toISOString(),
        conversionRate: 0,
        performanceScore: 0
      }
    }
    return metrics[productId]
  }

  private static sendEvent(eventName: string, data: any) {
    // Send to backend analytics
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: eventName, data, timestamp: new Date().toISOString() })
    }).catch(() => {
      // Fail silently
    })
  }
}
