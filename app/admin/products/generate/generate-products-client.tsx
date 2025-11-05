'use client'

import { useState } from 'react'
import { Sparkles, Wand2, Download, Plus, Loader2 } from 'lucide-react'
import { RippleButton } from '@/components/ripple-button'

const DESIGN_THEMES = [
  {
    id: 'consciousness',
    name: 'Consciousness & Awareness',
    description: 'Abstract representations of mindfulness and presence',
    prompt: 'Abstract minimalist art representing consciousness, awareness, and mindfulness. Sacred geometry, flowing energy, meditative states. Muted earth tones, gold accents. Premium art print quality.',
    tags: ['consciousness', 'mindfulness', 'sacred geometry']
  },
  {
    id: 'embodiment',
    name: 'Embodiment & Movement',
    description: 'Dynamic forms expressing physical presence',
    prompt: 'Elegant abstract art capturing human movement and embodiment. Flowing lines, dynamic forms, grace and strength. Sophisticated black and gold palette. Museum-quality aesthetic.',
    tags: ['movement', 'embodiment', 'performance']
  },
  {
    id: 'philosophy',
    name: 'Philosophical Concepts',
    description: 'Visual interpretations of existential ideas',
    prompt: 'Sophisticated abstract visualization of philosophical concepts. Existentialism, being, becoming. Minimalist modern art. Neutral tones with gold highlights. Premium gallery aesthetic.',
    tags: ['philosophy', 'existentialism', 'wisdom']
  },
  {
    id: 'nature',
    name: 'Nature & Elements',
    description: 'Organic forms and natural aesthetics',
    prompt: 'Refined abstract art inspired by natural elements. Organic shapes, earth, water, air, fire. Harmonious composition. Earthy palette with metallic accents. High-end art print quality.',
    tags: ['nature', 'elements', 'organic']
  },
  {
    id: 'typography',
    name: 'Wisdom Typography',
    description: 'Philosophical quotes in beautiful typography',
    prompt: 'Minimalist typography design featuring philosophical wisdom. Clean serif fonts, elegant spacing, subtle textures. Black background with gold text. Premium poster aesthetic.',
    tags: ['typography', 'quotes', 'minimalist']
  },
  {
    id: 'editorial',
    name: 'Editorial Fashion',
    description: 'High-fashion editorial aesthetic',
    prompt: 'Editorial fashion photography aesthetic reimagined as abstract art. High contrast, dramatic lighting, sophisticated composition. Black, white, and gold palette. Vogue-quality premium art.',
    tags: ['fashion', 'editorial', 'luxury']
  }
]

const PRODUCT_TEMPLATES = [
  {
    id: 'poster-small',
    name: '12×16" Premium Poster',
    printfulId: 1,
    variantId: 6239,
    price: '49.00',
    category: 'posters'
  },
  {
    id: 'poster-medium',
    name: '18×24" Gallery Print',
    printfulId: 1,
    variantId: 4464,
    price: '79.00',
    category: 'posters'
  },
  {
    id: 'poster-large',
    name: '24×36" Statement Piece',
    printfulId: 1,
    variantId: 14125,
    price: '99.00',
    category: 'posters'
  },
  {
    id: 'canvas-small',
    name: '16×20" Canvas',
    printfulId: 29,
    variantId: null, // Will fetch from API
    price: '149.00',
    category: 'canvas'
  },
  {
    id: 'tshirt',
    name: 'Premium T-Shirt',
    printfulId: 71,
    variantId: null,
    price: '35.00',
    category: 'apparel'
  }
]

export default function GenerateProductsClient() {
  const [selectedThemes, setSelectedThemes] = useState<string[]>([])
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [generating, setGenerating] = useState(false)
  const [generatedProducts, setGeneratedProducts] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const toggleTheme = (themeId: string) => {
    setSelectedThemes(prev =>
      prev.includes(themeId)
        ? prev.filter(id => id !== themeId)
        : [...prev, themeId]
    )
  }

  const toggleProduct = (productId: string) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const handleGenerate = async () => {
    setGenerating(true)
    setError(null)
    setSuccessMessage(null)

    try {
      // Call API to generate designs using AI
      const response = await fetch('/api/admin/generate-products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          themes: selectedThemes,
          products: selectedProducts
        })
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate products')
      }

      setGeneratedProducts(data.products)
      setSuccessMessage(data.message || `Successfully generated ${data.count} products!`)

      // Scroll to results
      setTimeout(() => {
        document.getElementById('generated-products')?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } catch (error) {
      console.error('Failed to generate products:', error)
      setError(error instanceof Error ? error.message : 'Failed to generate products')
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-20">
      <div className="container-wide max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 px-6 py-3 border border-accent-gold/20 bg-accent-gold/5 rounded-full mb-8">
            <Wand2 className="text-accent-gold" size={20} />
            <span className="text-sm tracking-[0.2em] uppercase text-accent-gold font-light">
              AI Product Generator
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-serif mb-6">
            Generate Your Collection
          </h1>
          <p className="text-white/60 text-lg max-w-3xl mx-auto">
            Select themes and product types. AI will generate unique designs aligned with your brand philosophy,
            create mockups, and add them to your store.
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-8 bg-green-500/10 border border-green-500/30 rounded-3xl p-6 text-center">
            <p className="text-green-400 font-medium">✅ {successMessage}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-8 bg-red-500/10 border border-red-500/30 rounded-3xl p-6 text-center">
            <p className="text-red-400 font-medium">❌ {error}</p>
            <p className="text-red-300/70 text-sm mt-2">
              Check the console for more details or try again.
            </p>
          </div>
        )}

        {/* Design Themes */}
        <div className="mb-16">
          <h2 className="text-3xl font-serif mb-8 text-center">1. Choose Design Themes</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DESIGN_THEMES.map((theme) => (
              <button
                key={theme.id}
                onClick={() => toggleTheme(theme.id)}
                className={`
                  group relative p-8 rounded-3xl backdrop-blur-xl border transition-all duration-500 text-left
                  ${selectedThemes.includes(theme.id)
                    ? 'bg-accent-gold/20 border-accent-gold shadow-xl shadow-accent-gold/20'
                    : 'bg-white/5 border-white/10 hover:border-accent-gold/50'
                  }
                `}
              >
                {selectedThemes.includes(theme.id) && (
                  <div className="absolute top-4 right-4 w-8 h-8 bg-accent-gold rounded-full flex items-center justify-center">
                    <Sparkles size={16} className="text-black" />
                  </div>
                )}

                <h3 className="text-xl font-serif mb-3 group-hover:text-accent-gold transition-colors">
                  {theme.name}
                </h3>
                <p className="text-sm text-white/60 mb-4">{theme.description}</p>

                <div className="flex flex-wrap gap-2">
                  {theme.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-white/40"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Product Types */}
        <div className="mb-16">
          <h2 className="text-3xl font-serif mb-8 text-center">2. Select Product Types</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {PRODUCT_TEMPLATES.map((product) => (
              <button
                key={product.id}
                onClick={() => toggleProduct(product.id)}
                className={`
                  p-6 rounded-2xl border transition-all text-center
                  ${selectedProducts.includes(product.id)
                    ? 'bg-accent-gold/10 border-accent-gold'
                    : 'bg-white/5 border-white/10 hover:border-white/30'
                  }
                `}
              >
                <div className="text-2xl mb-3">{product.category === 'posters' ? '🖼️' : product.category === 'canvas' ? '🎨' : '👕'}</div>
                <h3 className="text-sm font-medium mb-2">{product.name}</h3>
                <p className="text-xs text-accent-gold">${product.price}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <div className="text-center mb-16">
          <RippleButton
            onClick={handleGenerate}
            disabled={selectedThemes.length === 0 || selectedProducts.length === 0 || generating}
            className="px-12 py-6 bg-accent-gold text-black rounded-full font-medium tracking-[0.2em] uppercase disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent-hover transition-all shadow-xl shadow-accent-gold/30 text-lg"
          >
            {generating ? (
              <span className="flex items-center gap-3">
                <Loader2 className="animate-spin" size={24} />
                Generating Products...
              </span>
            ) : (
              <span className="flex items-center gap-3">
                <Wand2 size={24} />
                Generate {selectedThemes.length * selectedProducts.length} Products
              </span>
            )}
          </RippleButton>

          {selectedThemes.length > 0 && selectedProducts.length > 0 && !generating && (
            <p className="mt-4 text-white/40 text-sm">
              {selectedThemes.length} theme{selectedThemes.length > 1 ? 's' : ''} × {selectedProducts.length} product{selectedProducts.length > 1 ? 's' : ''} = {selectedThemes.length * selectedProducts.length} unique items
            </p>
          )}
        </div>

        {/* Generated Products */}
        {generatedProducts.length > 0 && (
          <div id="generated-products">
            <h2 className="text-3xl font-serif mb-8 text-center">✨ Your AI-Generated Products</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {generatedProducts.map((product, index) => (
                <div
                  key={index}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:border-accent-gold/50 transition-all"
                >
                  <div className="aspect-square bg-white/10 rounded-2xl mb-4 overflow-hidden relative group">
                    <img
                      src={product.designUrl}
                      alt={product.title}
                      className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        // Fallback if image fails to load
                        e.currentTarget.src = `/api/ai-design-placeholder?theme=${product.themeId}&t=${Date.now()}`
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <p className="text-white text-xs">AI-Generated Design</p>
                    </div>
                  </div>

                  <h3 className="font-serif text-lg mb-2 line-clamp-2">{product.title}</h3>
                  <p className="text-sm text-white/60 mb-4 line-clamp-2">{product.description}</p>

                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-light text-accent-gold">${product.price}</span>
                    <div className="text-xs text-green-400 bg-green-400/10 px-3 py-1 rounded-full">
                      ✓ Added to Store
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
