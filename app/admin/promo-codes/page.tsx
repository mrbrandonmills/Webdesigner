'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Copy, Check, Tag, Calendar, Users, Percent } from 'lucide-react'
import type { PromoCode } from '@/lib/promo-codes'

export default function PromoCodesAdminPage() {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    code: '',
    type: 'meditation' as 'meditation' | 'book' | 'all',
    target: '',
    discount: 100,
    maxUses: '',
    expiresAt: '',
    description: '',
  })

  useEffect(() => {
    loadPromoCodes()
  }, [])

  const loadPromoCodes = async () => {
    try {
      const response = await fetch('/api/admin/promo-codes')
      if (response.ok) {
        const data = await response.json()
        setPromoCodes(data.codes || [])
      }
    } catch (error) {
      console.error('Failed to load promo codes:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateCode = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch('/api/admin/promo-codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          maxUses: formData.maxUses ? parseInt(formData.maxUses) : undefined,
          expiresAt: formData.expiresAt || undefined,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setPromoCodes([...promoCodes, data.code])
        setShowCreateForm(false)
        resetForm()
      } else {
        const error = await response.json()
        alert(error.message || 'Failed to create promo code')
      }
    } catch (error) {
      console.error('Failed to create promo code:', error)
      alert('Failed to create promo code')
    }
  }

  const handleDeleteCode = async (code: string) => {
    if (!confirm(`Are you sure you want to delete promo code ${code}?`)) {
      return
    }

    try {
      const response = await fetch(`/api/admin/promo-codes?code=${code}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setPromoCodes(promoCodes.filter((p) => p.code !== code))
      }
    } catch (error) {
      console.error('Failed to delete promo code:', error)
      alert('Failed to delete promo code')
    }
  }

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const resetForm = () => {
    setFormData({
      code: '',
      type: 'meditation',
      target: '',
      discount: 100,
      maxUses: '',
      expiresAt: '',
      description: '',
    })
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'meditation':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'book':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
      case 'all':
        return 'bg-accent-gold/20 text-accent-gold border-accent-gold/30'
      default:
        return 'bg-white/10 text-white/70 border-white/20'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black pt-32 pb-20">
        <div className="container-wide max-w-5xl">
          <div className="text-white text-center">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black pt-32 pb-20">
      <div className="container-wide max-w-5xl">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl md:text-7xl font-light text-white mb-4 tracking-tight">
            Promo Codes
          </h1>
          <p className="text-xl text-white/60 font-light">
            Manage promo codes for meditations and books
          </p>
        </div>

        {/* Create Button */}
        <div className="mb-8">
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-6 py-3 bg-accent-gold hover:bg-accent-hover text-black font-medium rounded-xl transition-all flex items-center gap-2"
          >
            <Plus size={20} />
            Create New Promo Code
          </button>
        </div>

        {/* Create Form */}
        {showCreateForm && (
          <div className="mb-12 bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-2xl p-8">
            <h2 className="text-2xl font-light text-white mb-6">Create Promo Code</h2>
            <form onSubmit={handleCreateCode} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white/70 text-sm mb-2">Code *</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({ ...formData, code: e.target.value.toUpperCase() })
                    }
                    placeholder="SUMMER2024"
                    className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white placeholder:text-white/40 focus:border-accent-gold/50 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white/70 text-sm mb-2">Type *</label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        type: e.target.value as 'meditation' | 'book' | 'all',
                      })
                    }
                    className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white focus:border-accent-gold/50 focus:outline-none"
                  >
                    <option value="meditation">Meditation</option>
                    <option value="book">Book</option>
                    <option value="all">All (Meditation & Book)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white/70 text-sm mb-2">
                    Target (optional - leave empty for all)
                  </label>
                  <input
                    type="text"
                    value={formData.target}
                    onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                    placeholder="morning-mindfulness or block-c"
                    className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white placeholder:text-white/40 focus:border-accent-gold/50 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-white/70 text-sm mb-2">Discount % *</label>
                  <input
                    type="number"
                    value={formData.discount}
                    onChange={(e) =>
                      setFormData({ ...formData, discount: parseInt(e.target.value) })
                    }
                    min="1"
                    max="100"
                    className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white focus:border-accent-gold/50 focus:outline-none"
                    required
                  />
                  <p className="text-white/40 text-xs mt-1">100 = Free access</p>
                </div>

                <div>
                  <label className="block text-white/70 text-sm mb-2">
                    Max Uses (optional)
                  </label>
                  <input
                    type="number"
                    value={formData.maxUses}
                    onChange={(e) => setFormData({ ...formData, maxUses: e.target.value })}
                    placeholder="Unlimited"
                    className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white placeholder:text-white/40 focus:border-accent-gold/50 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-white/70 text-sm mb-2">
                    Expires At (optional)
                  </label>
                  <input
                    type="date"
                    value={formData.expiresAt}
                    onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                    className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white focus:border-accent-gold/50 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Internal notes about this promo code"
                  rows={3}
                  className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white placeholder:text-white/40 focus:border-accent-gold/50 focus:outline-none"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="px-6 py-3 bg-accent-gold hover:bg-accent-hover text-black font-medium rounded-xl transition-all"
                >
                  Create Promo Code
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false)
                    resetForm()
                  }}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Promo Codes List */}
        <div className="space-y-4">
          {promoCodes.length === 0 ? (
            <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-2xl p-12 text-center">
              <Tag size={48} className="mx-auto mb-4 text-white/30" />
              <p className="text-white/60">No promo codes yet. Create one to get started!</p>
            </div>
          ) : (
            promoCodes.map((promo) => (
              <div
                key={promo.code}
                className="bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-2xl p-6 hover:border-accent-gold/30 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-2xl font-mono text-white font-bold">
                        {promo.code}
                      </h3>
                      <span
                        className={`px-3 py-1 border rounded-full text-xs font-medium ${getTypeColor(
                          promo.type
                        )}`}
                      >
                        {promo.type}
                      </span>
                      {promo.discount === 100 && (
                        <span className="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full text-xs font-medium">
                          FREE
                        </span>
                      )}
                    </div>

                    {promo.description && (
                      <p className="text-white/60 mb-4">{promo.description}</p>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="flex items-center gap-2 text-white/50 mb-1">
                          <Percent size={14} />
                          <span>Discount</span>
                        </div>
                        <div className="text-white font-medium">{promo.discount}%</div>
                      </div>

                      {promo.target && (
                        <div>
                          <div className="flex items-center gap-2 text-white/50 mb-1">
                            <Tag size={14} />
                            <span>Target</span>
                          </div>
                          <div className="text-white font-medium">{promo.target}</div>
                        </div>
                      )}

                      {promo.maxUses && (
                        <div>
                          <div className="flex items-center gap-2 text-white/50 mb-1">
                            <Users size={14} />
                            <span>Max Uses</span>
                          </div>
                          <div className="text-white font-medium">
                            {promo.usageCount || 0} / {promo.maxUses}
                          </div>
                        </div>
                      )}

                      {promo.expiresAt && (
                        <div>
                          <div className="flex items-center gap-2 text-white/50 mb-1">
                            <Calendar size={14} />
                            <span>Expires</span>
                          </div>
                          <div className="text-white font-medium">
                            {new Date(promo.expiresAt).toLocaleDateString()}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => copyToClipboard(promo.code)}
                      className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all"
                      title="Copy code"
                    >
                      {copiedCode === promo.code ? (
                        <Check size={18} className="text-green-400" />
                      ) : (
                        <Copy size={18} />
                      )}
                    </button>
                    <button
                      onClick={() => handleDeleteCode(promo.code)}
                      className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-all"
                      title="Delete code"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Quick Create Buttons */}
        <div className="mt-12 bg-gradient-to-br from-accent-gold/10 to-transparent border border-accent-gold/20 rounded-2xl p-8">
          <h3 className="text-xl font-light text-white mb-4">Quick Actions</h3>
          <p className="text-white/60 text-sm mb-6">
            The BLOCKC2024 and COAUTHOR2024 codes are already created by default in the system.
            Use the form above to create custom codes.
          </p>
          <div className="flex flex-wrap gap-3">
            <div className="px-4 py-2 bg-black/30 border border-white/10 rounded-lg">
              <span className="text-white/50 text-sm">Pre-loaded: </span>
              <span className="text-white font-mono font-bold">BLOCKC2024</span>
              <span className="text-white/50 text-sm"> (Free Block C)</span>
            </div>
            <div className="px-4 py-2 bg-black/30 border border-white/10 rounded-lg">
              <span className="text-white/50 text-sm">Pre-loaded: </span>
              <span className="text-white font-mono font-bold">COAUTHOR2024</span>
              <span className="text-white/50 text-sm"> (Free Meditations)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
