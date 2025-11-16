'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Share2, Eye, Award, Shield, Sparkles } from 'lucide-react'
import GalleryViewer from '@/components/product/gallery-viewer'
import ArtistStatement from '@/components/product/artist-statement'
import LuxuryPrice from '@/components/product/luxury-price'
import ProductInfo from '@/components/store/ProductInfo'
import VariantSelector from '@/components/store/VariantSelector'
import AddToCartButton from '@/components/store/AddToCartButton'
import SizeGuide from '@/components/store/SizeGuide'
import RelatedProducts from '@/components/store/RelatedProducts'
import ScrollReveal from '@/components/scroll-reveal'
import { Product, ProductImage, ProductVariant } from '@/types/store'
import { motion } from 'framer-motion'

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const productId = params.productId as string

  const [product, setProduct] = useState<Product | null>(null)
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false)
  const [viewCount, setViewCount] = useState(0)

  useEffect(() => {
    if (productId) {
      fetchProduct()
      trackProductView()
    }
  }, [productId])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/store/curated-products')
      const data = await response.json()

      if (data.success) {
        const foundProduct = data.products.find((p: any) => p.id.toString() === productId)

        if (foundProduct) {
          // Transform to Product type with enhanced data
          const enhancedProduct: Product = {
            ...foundProduct,
            slug: foundProduct.title.toLowerCase().replace(/\s+/g, '-'),
            artist: foundProduct.brand,
            category: foundProduct.type,
            images: foundProduct.variants
              .filter((v: any) => v.image)
              .map((v: any, index: number) => ({
                id: `${v.id}`,
                url: v.image,
                alt: `${foundProduct.title} - ${v.name}`,
                position: index,
                isMain: index === 0,
              })),
            // Add sample materials
            materials: [
              {
                id: '1',
                name: 'Premium Paper',
                description: 'Museum-quality archival paper',
                finish: 'Matte',
                care: 'Keep away from direct sunlight',
              },
            ],
            dimensions: {
              width: 18,
              height: 24,
              unit: 'inches' as const,
            },
            isLimitedEdition: false,
            qualityGuarantee: true,
            freeShippingThreshold: 75,
            estimatedDeliveryDays: 7,
            careInstructions:
              'Display away from direct sunlight and moisture. Frame with UV-protective glass for longevity. Clean gently with a soft, dry cloth.',
            shippingInfo:
              'All prints are carefully packaged in protective tubes or flat mailers. Free shipping on orders over $75. International shipping available.',
            returnPolicy:
              '30-day money-back guarantee. If you\'re not completely satisfied, return your purchase within 30 days for a full refund.',
            printMethod: 'Giclée Printing',
            paperType: 'Premium Matte',
            tags: [foundProduct.type, foundProduct.brand],
          }

          setProduct(enhancedProduct)
          setSelectedVariant(foundProduct.variants[0] || null)

          // Simulate view count
          setViewCount(Math.floor(Math.random() * 500) + 100)
        } else {
          router.push('/store')
        }
      }
    } catch (error) {
      console.error('Failed to fetch product:', error)
      router.push('/store')
    } finally {
      setLoading(false)
    }
  }

  const trackProductView = () => {
    // Track view in analytics
    if (typeof window !== 'undefined') {
      try {
        const viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]')
        const newView = {
          productId: productId,
          viewedAt: new Date().toISOString(),
        }

        // Remove duplicates and keep last 10
        const filtered = viewed.filter((v: any) => v.productId !== productId)
        const updated = [newView, ...filtered].slice(0, 10)

        localStorage.setItem('recentlyViewed', JSON.stringify(updated))
      } catch (error) {
        console.error('Failed to track view:', error)
      }
    }
  }

  const handleShare = async () => {
    if (navigator.share && product) {
      try {
        await navigator.share({
          title: product.title,
          text: product.description,
          url: window.location.href,
        })
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(window.location.href)
        alert('Link copied to clipboard!')
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  const getStrategicPrice = (product: Product): string => {
    const basePrice = parseFloat(product.basePrice) || 0
    const type = (product.type || '').toLowerCase()

    if (type.includes('poster') || type.includes('print')) {
      if (basePrice < 12) return '49.00'
      if (basePrice < 15) return '79.00'
      if (basePrice < 20) return '99.00'
      return '149.00'
    }

    if (type.includes('canvas')) {
      if (basePrice < 35) return '149.00'
      if (basePrice < 50) return '179.00'
      return '249.00'
    }

    if (type.includes('shirt') || type.includes('tee')) return '35.00'
    if (type.includes('hoodie')) return '65.00'
    if (type.includes('mug')) return '22.00'

    return (basePrice * 3.5).toFixed(2)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white pt-40 pb-20">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Gallery skeleton */}
            <div className="space-y-6">
              <div className="aspect-square bg-white/5 rounded-3xl animate-pulse"></div>
              <div className="grid grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="aspect-square bg-white/5 rounded-xl animate-pulse"></div>
                ))}
              </div>
            </div>

            {/* Info skeleton */}
            <div className="space-y-8">
              <div className="h-12 bg-white/5 rounded animate-pulse"></div>
              <div className="h-8 bg-white/5 rounded animate-pulse w-3/4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-white/5 rounded animate-pulse"></div>
                <div className="h-4 bg-white/5 rounded animate-pulse"></div>
                <div className="h-4 bg-white/5 rounded animate-pulse w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product || !selectedVariant) {
    return (
      <div className="min-h-screen bg-black text-white pt-40 pb-20">
        <div className="container-wide text-center">
          <h1 className="text-4xl font-serif mb-4">Product Not Found</h1>
          <button
            onClick={() => router.push('/store')}
            className="px-8 py-4 bg-accent-gold text-black rounded-full hover:bg-accent-hover transition-colors"
          >
            Back to Store
          </button>
        </div>
      </div>
    )
  }

  const displayPrice = getStrategicPrice(product)

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Breadcrumb & Back Navigation */}
      <section className="pt-40 pb-12 container-wide">
        <ScrollReveal direction="up">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => router.push('/store')}
              className="flex items-center gap-2 text-white/60 hover:text-accent-gold transition-colors group"
            >
              <ArrowLeft
                size={20}
                className="group-hover:-translate-x-1 transition-transform duration-300"
              />
              <span className="tracking-wider uppercase text-sm">Back to Collection</span>
            </button>

            <div className="flex items-center gap-4">
              {/* View count */}
              <div className="flex items-center gap-2 text-white/40 text-sm">
                <Eye size={16} />
                <span>{viewCount} views</span>
              </div>

              {/* Share button */}
              <button
                onClick={handleShare}
                className="p-3 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 hover:border-accent-gold/30 transition-all duration-300"
                aria-label="Share product"
              >
                <Share2 size={20} />
              </button>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Product Detail */}
      <section className="pb-20 container-wide">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left: Museum-Quality Gallery */}
          <ScrollReveal direction="left">
            <div className="lg:sticky lg:top-32 space-y-8">
              <GalleryViewer
                images={product.images}
                productName={product.title}
                editionInfo={{
                  isLimited: product.isLimitedEdition,
                  editionNumber: product.editionNumber,
                  editionSize: product.editionSize,
                }}
              />

              {/* Certificate of Authenticity Preview */}
              {product.isLimitedEdition && product.certificateOfAuthenticity && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="bg-gradient-to-br from-accent-gold/10 to-accent-gold/5 border border-accent-gold/30 rounded-2xl p-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-accent-gold/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <Award className="w-6 h-6 text-accent-gold" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-serif text-white mb-2">
                        Certificate of Authenticity
                      </h3>
                      <p className="text-sm text-white/70 leading-relaxed">
                        Each limited edition print includes a signed certificate of authenticity,
                        guaranteeing its provenance and limited edition status. Numbered{' '}
                        {product.editionNumber && product.editionSize ? (
                          <span className="text-accent-gold font-medium">
                            {product.editionNumber}/{product.editionSize}
                          </span>
                        ) : (
                          'individually'
                        )}.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Collector's Metadata */}
              {product.isLimitedEdition && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6"
                >
                  <h3 className="text-xs tracking-[0.2em] uppercase text-white/40 mb-4">
                    Collector Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-white/60">Edition Type</span>
                      <span className="text-sm text-white font-medium">Limited Edition Print</span>
                    </div>
                    {product.editionSize && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-white/60">Total Edition Size</span>
                        <span className="text-sm text-accent-gold font-medium">
                          {product.editionSize} prints
                        </span>
                      </div>
                    )}
                    {product.editionNumber && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-white/60">This Edition</span>
                        <span className="text-sm text-accent-gold font-medium">
                          #{product.editionNumber}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-white/60">Exclusivity Status</span>
                      <span className="text-sm text-white font-medium flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-accent-gold" />
                        Museum Quality
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </ScrollReveal>

          {/* Right: Product Info */}
          <ScrollReveal direction="right">
            <div className="space-y-12">
              {/* Product Info Section */}
              <ProductInfo product={product} selectedVariant={selectedVariant} />

              {/* Luxury Price Display */}
              <div className="luxury-divider"></div>
              <LuxuryPrice
                price={displayPrice}
                isLimitedEdition={product.isLimitedEdition}
                originalPrice={selectedVariant.compareAtPrice}
              />

              {/* Artist Statement (for limited editions) */}
              {product.isLimitedEdition && product.artist && (
                <>
                  <div className="luxury-divider"></div>
                  <ArtistStatement
                    artistName={product.artist}
                    statement="Each piece in this limited collection represents a moment of creative vision, captured and preserved for collectors who appreciate the intersection of artistry and exclusivity. These works are not merely photographs—they are investment-grade artifacts of visual storytelling."
                    signature={product.artistSignature}
                  />
                </>
              )}

              {/* Variant Selector */}
              {product.variants && product.variants.length > 1 && (
                <>
                  <div className="luxury-divider"></div>
                  <VariantSelector
                    variants={product.variants}
                    selectedVariant={selectedVariant}
                    onSelectVariant={setSelectedVariant}
                    showImages={false}
                  />
                </>
              )}

              {/* Add to Cart Section */}
              <div className="luxury-divider"></div>
              <AddToCartButton
                productId={product.id}
                variantId={selectedVariant.id}
                productTitle={product.title}
                variantName={selectedVariant.name}
                image={selectedVariant.image || product.images[0]?.url || ''}
                price={displayPrice}
                type={product.type}
                brand={product.brand}
                inStock={selectedVariant.inStock}
              />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Related Products */}
      <RelatedProducts currentProductId={product.id} category={product.category} />

      {/* Size Guide Modal */}
      <SizeGuide
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        productType={product.type}
      />
    </div>
  )
}
