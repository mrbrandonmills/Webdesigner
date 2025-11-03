'use client'

import Link from 'next/link'
import { Zap, TrendingUp, Package, DollarSign, Eye, Settings } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function StoreAdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalRevenue: 0,
    needsOptimization: false
  })

  useEffect(() => {
    // Load quick stats
    fetch('/api/store/curated-products')
      .then(res => res.json())
      .then(data => {
        setStats({
          totalProducts: data.count || 0,
          totalRevenue: 0, // TODO: Calculate from analytics
          needsOptimization: (data.count || 0) > 10 // Optimize if more than 10 products
        })
      })
      .catch(err => console.error('Failed to load stats:', err))
  }, [])

  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-20">
      <div className="container-wide max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 px-6 py-3 border border-accent-gold/20 bg-accent-gold/5 rounded-full mb-8">
            <Settings className="text-accent-gold" size={20} />
            <span className="text-sm tracking-[0.2em] uppercase text-accent-gold font-light">
              Store Admin
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-serif mb-6">
            Automated Store Control
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Your self-optimizing e-commerce machine. Generate products, monitor performance, maximize revenue.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
            <div className="flex items-center justify-between mb-4">
              <Package className="text-accent-gold" size={32} />
              <div className="text-4xl font-light text-accent-gold">{stats.totalProducts}</div>
            </div>
            <h3 className="text-sm text-white/40 tracking-wider uppercase">Total Products</h3>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="text-green-400" size={32} />
              <div className="text-4xl font-light text-green-400">${stats.totalRevenue}</div>
            </div>
            <h3 className="text-sm text-white/40 tracking-wider uppercase">Total Revenue</h3>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="text-blue-400" size={32} />
              <div className="text-4xl font-light text-blue-400">{stats.needsOptimization ? '!' : '✓'}</div>
            </div>
            <h3 className="text-sm text-white/40 tracking-wider uppercase">
              {stats.needsOptimization ? 'Needs Review' : 'Optimized'}
            </h3>
          </div>
        </div>

        {/* Admin Tools */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Product Generator */}
          <Link
            href="/admin/products/generate"
            className="group bg-gradient-to-br from-accent-gold/20 to-accent-gold/5 border border-accent-gold/30 rounded-3xl p-12 hover:from-accent-gold/30 hover:to-accent-gold/10 transition-all duration-500"
          >
            <div className="w-20 h-20 bg-accent-gold/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
              <Zap className="text-accent-gold" size={40} />
            </div>

            <h2 className="text-3xl font-serif mb-4 group-hover:text-accent-gold transition-colors">
              Product Generator
            </h2>
            <p className="text-white/70 mb-6 leading-relaxed">
              Create new products with AI-generated designs. Select your themes and product types, and let AI do the rest.
            </p>

            <div className="flex items-center gap-2 text-accent-gold font-medium tracking-wider uppercase text-sm">
              Generate Products
              <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
            </div>
          </Link>

          {/* Analytics Dashboard */}
          <Link
            href="/admin/analytics"
            className="group bg-gradient-to-br from-blue-500/20 to-blue-500/5 border border-blue-500/30 rounded-3xl p-12 hover:from-blue-500/30 hover:to-blue-500/10 transition-all duration-500"
          >
            <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
              <TrendingUp className="text-blue-400" size={40} />
            </div>

            <h2 className="text-3xl font-serif mb-4 group-hover:text-blue-400 transition-colors">
              Analytics & Optimization
            </h2>
            <p className="text-white/70 mb-6 leading-relaxed">
              Monitor product performance, see what's working, and run auto-optimization to remove losers and replicate winners.
            </p>

            {stats.needsOptimization && (
              <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-2xl px-4 py-3 mb-6">
                <p className="text-yellow-400 text-sm font-medium">
                  ⚠️ Store ready for optimization
                </p>
              </div>
            )}

            <div className="flex items-center gap-2 text-blue-400 font-medium tracking-wider uppercase text-sm">
              View Analytics
              <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
            </div>
          </Link>

          {/* Store Preview */}
          <Link
            href="/store"
            className="group bg-gradient-to-br from-purple-500/20 to-purple-500/5 border border-purple-500/30 rounded-3xl p-12 hover:from-purple-500/30 hover:to-purple-500/10 transition-all duration-500"
          >
            <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
              <Eye className="text-purple-400" size={40} />
            </div>

            <h2 className="text-3xl font-serif mb-4 group-hover:text-purple-400 transition-colors">
              View Store
            </h2>
            <p className="text-white/70 mb-6 leading-relaxed">
              See your store as customers see it. Browse products, test the shopping experience, and verify everything looks perfect.
            </p>

            <div className="flex items-center gap-2 text-purple-400 font-medium tracking-wider uppercase text-sm">
              View Store
              <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
            </div>
          </Link>

          {/* Coming Soon: Stripe Integration */}
          <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-3xl p-12 opacity-50">
            <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-6">
              <DollarSign className="text-white/40" size={40} />
            </div>

            <h2 className="text-3xl font-serif mb-4 text-white/40">
              Stripe Integration
            </h2>
            <p className="text-white/40 mb-6 leading-relaxed">
              Accept payments and process orders automatically. Coming soon.
            </p>

            <div className="flex items-center gap-2 text-white/40 font-medium tracking-wider uppercase text-sm">
              Coming Soon
            </div>
          </div>
        </div>

        {/* Workflow Guide */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-12">
          <h2 className="text-3xl font-serif mb-8 text-center">Your Automated Workflow</h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-accent-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-serif text-accent-gold">1</span>
              </div>
              <h3 className="font-medium mb-2">Generate Products</h3>
              <p className="text-sm text-white/60">Create 20-50 products with AI across multiple themes</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-serif text-blue-400">2</span>
              </div>
              <h3 className="font-medium mb-2">Let Data Collect</h3>
              <p className="text-sm text-white/60">Track views, clicks, and conversions automatically</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-serif text-green-400">3</span>
              </div>
              <h3 className="font-medium mb-2">Run Optimization</h3>
              <p className="text-sm text-white/60">Auto-remove losers and create winner variations</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-serif text-purple-400">4</span>
              </div>
              <h3 className="font-medium mb-2">Repeat Weekly</h3>
              <p className="text-sm text-white/60">Continuously improve your product lineup</p>
            </div>
          </div>

          <div className="mt-12 bg-accent-gold/10 border border-accent-gold/30 rounded-2xl p-6 text-center">
            <p className="text-accent-gold font-medium mb-2">🎯 Goal: Automated Passive Income</p>
            <p className="text-white/70 text-sm">
              This system handles product creation, optimization, and sales automatically. 
              Just review analytics weekly and let AI maximize your revenue.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
