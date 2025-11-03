'use client'

import { useState, useEffect } from 'react'
import { Package, DollarSign, Calendar, Mail, MapPin, Loader2 } from 'lucide-react'

interface Order {
  id: string
  email: string
  total: number
  status: string
  createdAt: string
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
  })

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    try {
      const response = await fetch('/api/admin/orders')
      const data = await response.json()

      if (data.success) {
        setOrders(data.orders)
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Failed to load orders:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center pt-32">
        <Loader2 className="animate-spin text-accent-gold" size={48} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-20">
      <div className="container-wide max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 px-6 py-3 border border-accent-gold/20 bg-accent-gold/5 rounded-full mb-8">
            <Package className="text-accent-gold" size={20} />
            <span className="text-sm tracking-[0.2em] uppercase text-accent-gold font-light">
              Order Management
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-serif mb-6">
            Your Orders
          </h1>
          <p className="text-white/60 text-lg">
            Track and manage all customer orders
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
            <div className="flex items-center justify-between mb-4">
              <Package className="text-accent-gold" size={32} />
              <div className="text-4xl font-light text-accent-gold">{stats.totalOrders}</div>
            </div>
            <h3 className="text-sm text-white/40 tracking-wider uppercase">Total Orders</h3>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="text-green-400" size={32} />
              <div className="text-4xl font-light text-green-400">${stats.totalRevenue.toFixed(2)}</div>
            </div>
            <h3 className="text-sm text-white/40 tracking-wider uppercase">Total Revenue</h3>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
            <div className="flex items-center justify-between mb-4">
              <Package className="text-blue-400" size={32} />
              <div className="text-4xl font-light text-blue-400">{stats.pendingOrders}</div>
            </div>
            <h3 className="text-sm text-white/40 tracking-wider uppercase">Pending Orders</h3>
          </div>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-16 text-center">
            <Package size={64} className="mx-auto mb-6 text-white/20" />
            <h2 className="text-2xl font-serif mb-4">No Orders Yet</h2>
            <p className="text-white/60 mb-8">
              Orders will appear here once customers complete checkout
            </p>
            <a
              href="/store"
              className="inline-block px-8 py-4 bg-accent-gold text-black rounded-full font-medium tracking-wider uppercase hover:bg-accent-hover transition-colors"
            >
              View Store
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-accent-gold/30 transition-all"
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {/* Order ID & Date */}
                  <div>
                    <div className="text-xs text-white/40 tracking-wider uppercase mb-2">
                      Order ID
                    </div>
                    <div className="font-mono text-sm mb-4">{order.id}</div>
                    <div className="flex items-center gap-2 text-sm text-white/60">
                      <Calendar size={16} />
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Customer Email */}
                  <div>
                    <div className="text-xs text-white/40 tracking-wider uppercase mb-2">
                      Customer
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail size={16} className="text-white/40" />
                      <span className="text-sm">{order.email}</span>
                    </div>
                  </div>

                  {/* Total */}
                  <div>
                    <div className="text-xs text-white/40 tracking-wider uppercase mb-2">
                      Total
                    </div>
                    <div className="text-2xl font-light text-accent-gold">
                      ${order.total.toFixed(2)}
                    </div>
                  </div>

                  {/* Status */}
                  <div>
                    <div className="text-xs text-white/40 tracking-wider uppercase mb-2">
                      Status
                    </div>
                    <div
                      className={`
                        inline-block px-4 py-2 rounded-full text-sm font-medium
                        ${order.status === 'paid' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : ''}
                        ${order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : ''}
                        ${order.status === 'fulfilled' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : ''}
                      `}
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
