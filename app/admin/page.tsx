'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Camera, ShoppingBag, LogOut, Upload, TrendingUp, Package, Sparkles } from 'lucide-react'

export default function AdminHub() {
  const router = useRouter()

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/gallery')
  }

  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-20">
      <div className="container-wide max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-16">
          <div>
            <h1 className="text-5xl md:text-6xl font-light font-serif mb-4">
              Admin Control Center
            </h1>
            <p className="text-white/60 text-lg">
              Manage your portfolio content and automated store
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/20 hover:bg-white/10 transition-colors rounded-full text-sm tracking-wider uppercase"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>

        {/* Two Main Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Content Studio */}
          <Link
            href="/admin/content"
            className="group relative bg-gradient-to-br from-purple-500/20 to-purple-500/5 border border-purple-500/30 rounded-3xl p-12 hover:from-purple-500/30 hover:to-purple-500/10 transition-all duration-500"
          >
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-transparent to-transparent rounded-3xl opacity-0 group-hover:opacity-100 blur-2xl transition-all duration-700 -z-10"></div>

            {/* Icon */}
            <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
              <Camera className="text-purple-400" size={40} />
            </div>

            {/* Content */}
            <h2 className="text-3xl font-serif mb-4 group-hover:text-purple-400 transition-colors">
              Content Studio
            </h2>
            <p className="text-white/70 mb-6 leading-relaxed">
              Upload and manage your modeling photos, acting reels, essays, and portfolio media.
              AI-powered organization with voice descriptions.
            </p>

            {/* Features */}
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-sm text-white/60">
                <Upload size={16} className="text-purple-400" />
                <span>Photo & Video Uploads</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-white/60">
                <Camera size={16} className="text-purple-400" />
                <span>Voice Descriptions</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-white/60">
                <Package size={16} className="text-purple-400" />
                <span>Collection Management</span>
              </div>
            </div>

            {/* CTA */}
            <div className="flex items-center gap-2 text-purple-400 font-medium tracking-wider uppercase text-sm">
              Manage Content
              <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
            </div>
          </Link>

          {/* Store Management */}
          <Link
            href="/admin/store"
            className="group relative bg-gradient-to-br from-accent-gold/20 to-accent-gold/5 border border-accent-gold/30 rounded-3xl p-12 hover:from-accent-gold/30 hover:to-accent-gold/10 transition-all duration-500"
          >
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent-gold/20 via-transparent to-transparent rounded-3xl opacity-0 group-hover:opacity-100 blur-2xl transition-all duration-700 -z-10"></div>

            {/* Icon */}
            <div className="w-20 h-20 bg-accent-gold/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
              <ShoppingBag className="text-accent-gold" size={40} />
            </div>

            {/* Content */}
            <h2 className="text-3xl font-serif mb-4 group-hover:text-accent-gold transition-colors">
              Store Management
            </h2>
            <p className="text-white/70 mb-6 leading-relaxed">
              AI-powered e-commerce store. Generate products, track sales, optimize performance,
              and manage orders automatically.
            </p>

            {/* Features */}
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-sm text-white/60">
                <Sparkles size={16} className="text-accent-gold" />
                <span>AI Product Generator</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-white/60">
                <TrendingUp size={16} className="text-accent-gold" />
                <span>Analytics & Optimization</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-white/60">
                <Package size={16} className="text-accent-gold" />
                <span>Order Management</span>
              </div>
            </div>

            {/* CTA */}
            <div className="flex items-center gap-2 text-accent-gold font-medium tracking-wider uppercase text-sm">
              Manage Store
              <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
            </div>
          </Link>
        </div>

        {/* Quick Links */}
        <div className="mt-12 pt-12 border-t border-white/10">
          <h3 className="text-sm tracking-[0.2em] uppercase text-white/40 mb-6">Quick Links</h3>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/gallery"
              className="px-6 py-3 bg-white/5 border border-white/10 hover:border-accent-gold/50 hover:bg-white/10 transition-colors rounded-full text-sm"
            >
              View Gallery
            </Link>
            <Link
              href="/store"
              className="px-6 py-3 bg-white/5 border border-white/10 hover:border-accent-gold/50 hover:bg-white/10 transition-colors rounded-full text-sm"
            >
              View Store
            </Link>
            <Link
              href="/admin/products/generate"
              className="px-6 py-3 bg-white/5 border border-white/10 hover:border-accent-gold/50 hover:bg-white/10 transition-colors rounded-full text-sm"
            >
              Generate Products
            </Link>
            <Link
              href="/admin/analytics"
              className="px-6 py-3 bg-white/5 border border-white/10 hover:border-accent-gold/50 hover:bg-white/10 transition-colors rounded-full text-sm"
            >
              Analytics
            </Link>
            <Link
              href="/admin/orders"
              className="px-6 py-3 bg-white/5 border border-white/10 hover:border-accent-gold/50 hover:bg-white/10 transition-colors rounded-full text-sm"
            >
              Orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
