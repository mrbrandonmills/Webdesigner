'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Zap, DollarSign, Eye, ShoppingCart, RefreshCw } from 'lucide-react'
import { ProductAnalytics } from '@/lib/product-analytics'
import { RippleButton } from '@/components/ripple-button'

export default function AnalyticsPage() {
  const [insights, setInsights] = useState<any>(null)
  const [optimizing, setOptimizing] = useState(false)
  const [lastOptimized, setLastOptimized] = useState<string | null>(null)

  useEffect(() => {
    loadInsights()
  }, [])

  const loadInsights = () => {
    const data = ProductAnalytics.getInsights()
    setInsights(data)
  }

  const handleAutoOptimize = async () => {
    setOptimizing(true)

    try {
      const result = await ProductAnalytics.autoOptimize()

      alert(`✅ Auto-Optimization Complete!\n\n${result.message}`)

      setLastOptimized(new Date().toLocaleString())
      loadInsights()
    } catch (error) {
      alert('Optimization failed. Check console for details.')
      console.error(error)
    } finally {
      setOptimizing(false)
    }
  }

  if (!insights) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-2 border-accent-gold border-t-transparent rounded-full"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-20">
      <div className="container-wide max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 px-6 py-3 border border-accent-gold/20 bg-accent-gold/5 rounded-full mb-8">
            <TrendingUp className="text-accent-gold" size={20} />
            <span className="text-sm tracking-[0.2em] uppercase text-accent-gold font-light">
              Store Analytics
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-serif mb-6">
            Performance Dashboard
          </h1>
          <p className="text-white/60 text-lg">
            AI-powered insights to optimize your product lineup
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
            <div className="flex items-center justify-between mb-4">
              <div className="text-4xl">📦</div>
              <div className="text-3xl font-light text-accent-gold">{insights.totalProducts}</div>
            </div>
            <h3 className="text-sm text-white/40 tracking-wider uppercase">Total Products</h3>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
            <div className="flex items-center justify-between mb-4">
              <Eye className="text-blue-400" size={32} />
              <div className="text-3xl font-light text-blue-400">{insights.totalViews.toLocaleString()}</div>
            </div>
            <h3 className="text-sm text-white/40 tracking-wider uppercase">Total Views</h3>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
            <div className="flex items-center justify-between mb-4">
              <ShoppingCart className="text-green-400" size={32} />
              <div className="text-3xl font-light text-green-400">{(insights.avgConversionRate * 100).toFixed(1)}%</div>
            </div>
            <h3 className="text-sm text-white/40 tracking-wider uppercase">Avg Conversion</h3>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="text-accent-gold" size={32} />
              <div className="text-3xl font-light text-accent-gold">${insights.totalRevenue.toLocaleString()}</div>
            </div>
            <h3 className="text-sm text-white/40 tracking-wider uppercase">Total Revenue</h3>
          </div>
        </div>

        {/* Auto-Optimize Section */}
        <div className="bg-gradient-to-br from-accent-gold/20 to-accent-gold/5 border border-accent-gold/30 rounded-3xl p-12 mb-16 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="w-20 h-20 bg-accent-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Zap className="text-accent-gold" size={40} />
            </div>

            <h2 className="text-4xl font-serif mb-4">Auto-Optimize Your Store</h2>
            <p className="text-white/70 mb-8 text-lg">
              AI will analyze performance, remove underperformers, and create new variations of your best sellers.
              Run this weekly to keep your store optimized.
            </p>

            {lastOptimized && (
              <p className="text-sm text-white/40 mb-6">
                Last optimized: {lastOptimized}
              </p>
            )}

            <RippleButton
              onClick={handleAutoOptimize}
              disabled={optimizing}
              className="px-12 py-6 bg-accent-gold text-black rounded-full font-medium tracking-[0.2em] uppercase disabled:opacity-50 hover:bg-accent-hover transition-all shadow-xl shadow-accent-gold/30 text-lg inline-flex items-center gap-3"
            >
              {optimizing ? (
                <>
                  <RefreshCw className="animate-spin" size={24} />
                  Optimizing...
                </>
              ) : (
                <>
                  <Zap size={24} />
                  Run Auto-Optimization
                </>
              )}
            </RippleButton>
          </div>
        </div>

        {/* Top Performers */}
        {insights.topPerformers.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-serif mb-8 flex items-center gap-3">
              <TrendingUp className="text-green-400" />
              Top Performers
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {insights.topPerformers.map((product: any, index: number) => (
                <div
                  key={product.productId}
                  className="bg-white/5 backdrop-blur-xl border border-green-400/30 rounded-3xl p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="text-4xl mb-2">🏆</div>
                      <h3 className="font-serif text-lg">#{index + 1} Performer</h3>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-light text-green-400">{product.performanceScore}</div>
                      <div className="text-xs text-white/40">Score</div>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white/60">Views:</span>
                      <span className="text-white">{product.views}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Clicks:</span>
                      <span className="text-white">{product.clicks}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Added to Cart:</span>
                      <span className="text-green-400">{product.addedToCart}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Conversion:</span>
                      <span className="text-green-400">{(product.conversionRate * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Revenue:</span>
                      <span className="text-accent-gold">${product.revenue}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Underperformers */}
        {insights.underperformers.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-serif mb-8 flex items-center gap-3">
              <TrendingDown className="text-red-400" />
              Underperformers ({insights.underperformers.length})
            </h2>

            <div className="bg-red-400/10 border border-red-400/30 rounded-3xl p-8">
              <p className="text-white/70 mb-4">
                These products will be removed during auto-optimization:
              </p>
              <div className="flex flex-wrap gap-2">
                {insights.underperformers.map((id: string) => (
                  <div
                    key={id}
                    className="px-4 py-2 bg-red-400/20 border border-red-400/30 rounded-full text-sm"
                  >
                    Product {id}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Recommendations */}
        <div>
          <h2 className="text-3xl font-serif mb-8">AI Recommendations</h2>

          <div className="space-y-4">
            {insights.recommendations.map((rec: string, index: number) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex items-center gap-4"
              >
                <div className="w-12 h-12 bg-accent-gold/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Zap className="text-accent-gold" size={20} />
                </div>
                <p className="text-white/80">{rec}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
