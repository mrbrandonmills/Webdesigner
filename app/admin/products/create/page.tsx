'use client'

import { useState, useEffect } from 'react'
import { Upload, Plus, Loader2, Save, Eye } from 'lucide-react'
import { RippleButton } from '@/components/ripple-button'

interface PrintfulProduct {
  id: number
  title: string
  type_name: string
  image: string
}

export default function CreateProductPage() {
  const [step, setStep] = useState<'upload' | 'select' | 'preview' | 'publish'>('upload')
  const [designImage, setDesignImage] = useState<string | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<PrintfulProduct | null>(null)
  const [availableProducts, setAvailableProducts] = useState<PrintfulProduct[]>([])
  const [loading, setLoading] = useState(false)
  const [customTitle, setCustomTitle] = useState('')
  const [customDescription, setCustomDescription] = useState('')
  const [customPrice, setCustomPrice] = useState('')

  // Fetch available Printful products
  useEffect(() => {
    if (step === 'select') {
      fetchProducts()
    }
  }, [step])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/store/products?category=posters')
      const data = await response.json()
      if (data.success) {
        setAvailableProducts(data.products.slice(0, 10))
      }
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setDesignImage(reader.result as string)
        setStep('select')
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSelectProduct = (product: PrintfulProduct) => {
    setSelectedProduct(product)
    setCustomTitle(`${product.title} - Limited Edition`)
    setStep('preview')
  }

  const handlePublish = async () => {
    // TODO: Save to curated-products.json
    console.log('Publishing product:', {
      designImage,
      product: selectedProduct,
      title: customTitle,
      description: customDescription,
      price: customPrice
    })
  }

  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-20">
      <div className="container-wide max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-serif mb-4">Create Product</h1>
          <p className="text-white/60 text-lg">
            Upload your design and create a custom product for your store
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-4 mb-16">
          {['Upload Design', 'Select Product', 'Preview', 'Publish'].map((label, index) => {
            const stepNames = ['upload', 'select', 'preview', 'publish']
            const currentIndex = stepNames.indexOf(step)
            const isActive = index <= currentIndex

            return (
              <div key={label} className="flex items-center">
                <div className={`
                  flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all
                  ${isActive ? 'border-accent-gold bg-accent-gold/20 text-accent-gold' : 'border-white/20 text-white/40'}
                `}>
                  {index + 1}
                </div>
                {index < 3 && (
                  <div className={`w-16 h-px ${isActive ? 'bg-accent-gold' : 'bg-white/20'}`}></div>
                )}
              </div>
            )
          })}
        </div>

        {/* Step 1: Upload Design */}
        {step === 'upload' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-12 text-center">
              <Upload className="mx-auto mb-6 text-accent-gold" size={64} />
              <h2 className="text-3xl font-serif mb-4">Upload Your Design</h2>
              <p className="text-white/60 mb-8">
                Choose an image from your portfolio or upload a new design
              </p>

              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <div className="inline-block px-8 py-4 bg-accent-gold text-black font-medium tracking-wider uppercase rounded-full hover:bg-accent-hover transition-colors">
                  Choose Image
                </div>
              </label>

              {designImage && (
                <div className="mt-8">
                  <img
                    src={designImage}
                    alt="Design preview"
                    className="max-w-full h-64 object-contain mx-auto rounded-2xl"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Select Product */}
        {step === 'select' && (
          <div>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-serif mb-4">Select Product Type</h2>
              <p className="text-white/60">Choose which product to apply your design to</p>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="animate-spin text-accent-gold" size={48} />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {availableProducts.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleSelectProduct(product)}
                    className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:border-accent-gold/50 transition-all text-left"
                  >
                    <div className="aspect-square bg-white/5 rounded-2xl mb-4 overflow-hidden">
                      {product.image && (
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      )}
                    </div>
                    <h3 className="font-serif text-lg mb-2 group-hover:text-accent-gold transition-colors">
                      {product.title}
                    </h3>
                    <p className="text-sm text-white/40">{product.type_name}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 3: Preview & Customize */}
        {step === 'preview' && selectedProduct && (
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Product Preview */}
              <div>
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 mb-6">
                  <div className="aspect-square bg-white/10 rounded-2xl mb-6 relative overflow-hidden">
                    {designImage && (
                      <img
                        src={designImage}
                        alt="Your design"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <p className="text-center text-sm text-white/40">
                    Mockup will be generated with Printful API
                  </p>
                </div>
              </div>

              {/* Product Details */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm text-white/60 mb-2 tracking-wider uppercase">
                    Product Title
                  </label>
                  <input
                    type="text"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-full px-6 py-4 text-white focus:outline-none focus:border-accent-gold transition-colors"
                    placeholder="e.g., Sunset Dream - Limited Edition Print"
                  />
                </div>

                <div>
                  <label className="block text-sm text-white/60 mb-2 tracking-wider uppercase">
                    Description
                  </label>
                  <textarea
                    value={customDescription}
                    onChange={(e) => setCustomDescription(e.target.value)}
                    rows={4}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-accent-gold transition-colors resize-none"
                    placeholder="Tell the story behind this piece..."
                  />
                </div>

                <div>
                  <label className="block text-sm text-white/60 mb-2 tracking-wider uppercase">
                    Price (USD)
                  </label>
                  <input
                    type="number"
                    value={customPrice}
                    onChange={(e) => setCustomPrice(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-full px-6 py-4 text-white focus:outline-none focus:border-accent-gold transition-colors"
                    placeholder="49.00"
                  />
                </div>

                <div className="flex gap-4 pt-6">
                  <RippleButton
                    onClick={() => setStep('select')}
                    className="flex-1 py-4 border border-white/10 rounded-full hover:bg-white/5 transition-colors"
                  >
                    Back
                  </RippleButton>
                  <RippleButton
                    onClick={() => setStep('publish')}
                    className="flex-1 py-4 bg-accent-gold text-black rounded-full hover:bg-accent-hover transition-colors font-medium tracking-wider uppercase"
                  >
                    Continue
                  </RippleButton>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Publish */}
        {step === 'publish' && (
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-12">
              <div className="w-20 h-20 bg-accent-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Save className="text-accent-gold" size={40} />
              </div>

              <h2 className="text-3xl font-serif mb-4">Ready to Publish?</h2>
              <p className="text-white/60 mb-8">
                Your product will be added to the store and available for customers to purchase.
              </p>

              <div className="flex gap-4 justify-center">
                <RippleButton
                  onClick={() => setStep('preview')}
                  className="px-8 py-4 border border-white/10 rounded-full hover:bg-white/5 transition-colors"
                >
                  Back to Edit
                </RippleButton>
                <RippleButton
                  onClick={handlePublish}
                  className="px-8 py-4 bg-accent-gold text-black rounded-full hover:bg-accent-hover transition-colors font-medium tracking-wider uppercase flex items-center gap-2"
                >
                  <Plus size={20} />
                  Publish Product
                </RippleButton>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
