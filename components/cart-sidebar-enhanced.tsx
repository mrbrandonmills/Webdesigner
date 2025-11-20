'use client'

import { useCart } from '@/contexts/cart-context'
import { X, Plus, Minus, ShoppingBag, ArrowRight, Loader2, Truck, Gift, Tag } from 'lucide-react'
import { useEffect, useState } from 'react'
import { RippleButton } from '@/components/ripple-button'
import { motion, AnimatePresence } from 'framer-motion'
import { clientLogger } from '@/lib/client-logger'

export default function CartSidebarEnhanced() {
  const {
    items,
    removeItem,
    updateQuantity,
    totalItems,
    totalPrice,
    isOpen,
    closeCart,
  } = useCart()

  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)
  const [promoCode, setPromoCode] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)
  const [discount, setDiscount] = useState(0)
  const [recommendedProducts, setRecommendedProducts] = useState<any[]>([])

  const freeShippingThreshold = 75
  const shippingProgress = Math.min((totalPrice / freeShippingThreshold) * 100, 100)
  const needsForFreeShipping = Math.max(freeShippingThreshold - totalPrice, 0)

  // Lock body scroll when cart is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      loadRecommendations()
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart()
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [closeCart])

  const loadRecommendations = async () => {
    try {
      const response = await fetch('/api/store/curated-products')
      const data = await response.json()

      if (data.success) {
        // Get 3 random products
        const shuffled = data.products.sort(() => 0.5 - Math.random())
        setRecommendedProducts(shuffled.slice(0, 3))
      }
    } catch (error) {
      clientLogger.error('Failed to load recommendations:', error)
    }
  }

  const handleCheckout = async () => {
    setIsCheckingOut(true)
    setCheckoutError(null)

    try {
      // Create Stripe checkout session
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(item => ({
            productId: item.productId,
            variantId: item.variantId,
            productTitle: item.productTitle,
            variantName: item.variantName,
            image: item.image,
            price: item.price,
            quantity: item.quantity,
          })),
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.url) {
        throw new Error(data.error || 'Failed to create checkout session')
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url
    } catch (error) {
      clientLogger.error('Checkout error:', error)
      setCheckoutError(error instanceof Error ? error.message : 'Failed to start checkout')
      setIsCheckingOut(false)
    }
  }

  const handleApplyPromo = () => {
    // Simple promo code validation (extend in production)
    const validCodes: Record<string, number> = {
      'WELCOME10': 10,
      'SAVE15': 15,
      'LUXURY20': 20,
    }

    const code = promoCode.toUpperCase()
    if (validCodes[code]) {
      setDiscount(validCodes[code])
      setPromoApplied(true)
    } else {
      setCheckoutError('Invalid promo code')
      setTimeout(() => setCheckoutError(null), 3000)
    }
  }

  const handleRemovePromo = () => {
    setPromoCode('')
    setPromoApplied(false)
    setDiscount(0)
  }

  const finalPrice = totalPrice - (totalPrice * discount) / 100
  const estimatedDelivery = new Date()
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 7)

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50"
            style={{
              background: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(24px) saturate(180%)',
              WebkitBackdropFilter: 'blur(24px) saturate(180%)',
            }}
            onClick={closeCart}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: isOpen ? 0 : '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed top-0 right-0 h-full w-full md:w-[550px] glass-panel z-50 flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-3 glass-accent rounded-full">
              <ShoppingBag className="text-accent-gold" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-serif">Your Cart</h2>
              <p className="text-sm text-white/40">
                {totalItems} {totalItems === 1 ? 'item' : 'items'}
              </p>
            </div>
          </div>
          <button
            onClick={closeCart}
            className="p-3 glass-button rounded-full"
            aria-label="Close cart"
          >
            <X size={24} />
          </button>
        </div>

        {/* Free Shipping Progress */}
        {items.length > 0 && totalPrice < freeShippingThreshold && (
          <div className="p-6 glass-accent border-b border-accent-gold/20">
            <div className="flex items-center gap-2 mb-3">
              <Truck className="text-accent-gold" size={20} />
              <span className="text-sm">
                Add <span className="font-medium text-accent-gold">${needsForFreeShipping.toFixed(2)}</span> more for free shipping!
              </span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${shippingProgress}%` }}
                transition={{ duration: 0.5 }}
                className="h-full bg-gradient-to-r from-accent-gold to-amber-400"
              />
            </div>
          </div>
        )}

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
              <div className="p-8 glass-card rounded-3xl">
                <ShoppingBag size={64} className="text-white/20" />
              </div>
              <div>
                <h3 className="text-2xl font-serif mb-2">Your cart is empty</h3>
                <p className="text-white/60 text-sm max-w-xs">
                  Start adding some beautiful pieces to your collection
                </p>
              </div>
              <button
                onClick={closeCart}
                className="px-8 py-4 glass-button bg-accent-gold/90 text-black font-medium tracking-wider uppercase rounded-full hover:bg-accent-gold transition-colors shadow-xl shadow-accent-gold/30"
              >
                Explore Collection
              </button>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="space-y-4">
                <AnimatePresence>
                  {items.map((item) => (
                    <motion.div
                      key={item.variantId}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="group glass-card rounded-2xl p-5 space-y-4"
                    >
                      <div className="flex gap-4">
                        {/* Product Image */}
                        <div className="relative w-24 h-24 bg-white/5 rounded-xl overflow-hidden flex-shrink-0 group-hover:shadow-lg transition-shadow duration-300">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.productTitle}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-white/20">
                              <ShoppingBag size={32} />
                            </div>
                          )}
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <div className="text-xs text-white/40 tracking-wider uppercase mb-1">
                            {item.brand}
                          </div>
                          <h3 className="font-serif text-sm mb-1 truncate">
                            {item.productTitle}
                          </h3>
                          <p className="text-xs text-white/60 mb-2">
                            {item.variantName}
                          </p>
                          <div className="flex items-center gap-2">
                            <div className="text-lg font-light text-accent-gold">
                              ${item.price}
                            </div>
                            {item.quantity > 1 && (
                              <div className="text-xs text-white/40">
                                × {item.quantity} = ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 glass-input rounded-full overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                            className="p-3 hover:bg-accent-gold/20 hover:text-accent-gold transition-all duration-300"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-10 text-center font-medium text-sm">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                            className="p-3 hover:bg-accent-gold/20 hover:text-accent-gold transition-all duration-300"
                            aria-label="Increase quantity"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.variantId)}
                          className="text-xs text-white/40 hover:text-red-400 transition-colors duration-300 tracking-wider uppercase flex items-center gap-1"
                        >
                          <X size={14} />
                          Remove
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Recommendations */}
              {recommendedProducts.length > 0 && (
                <div className="mt-8 pt-8 border-t border-white/10">
                  <div className="flex items-center gap-2 mb-4">
                    <Gift className="text-accent-gold" size={16} />
                    <h3 className="text-sm tracking-[0.2em] uppercase text-white/60">
                      You May Also Like
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {recommendedProducts.slice(0, 2).map((product) => (
                      <div
                        key={product.id}
                        className="flex gap-3 p-3 glass-card rounded-xl"
                      >
                        <div className="w-16 h-16 bg-white/5 rounded-lg overflow-hidden flex-shrink-0">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-white/20">
                              <div className="text-2xl">📦</div>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs text-white/40 mb-1">{product.brand}</div>
                          <div className="text-sm font-serif truncate">{product.title}</div>
                          <div className="text-sm text-accent-gold mt-1">${product.basePrice}</div>
                        </div>
                        <button className="px-3 text-xs text-accent-gold hover:text-accent-hover transition-colors">
                          Add
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer - Checkout */}
        {items.length > 0 && (
          <div className="border-t border-white/10 p-6 space-y-4 bg-black">
            {/* Promo Code */}
            {!promoApplied ? (
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                  <input
                    type="text"
                    placeholder="Promo code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="w-full glass-input rounded-full pl-10 pr-4 py-3 text-sm"
                  />
                </div>
                <button
                  onClick={handleApplyPromo}
                  className="px-6 py-3 glass-button rounded-full text-sm"
                >
                  Apply
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between p-3 glass-accent rounded-full">
                <div className="flex items-center gap-2">
                  <Tag className="text-accent-gold" size={16} />
                  <span className="text-sm text-accent-gold font-medium">{promoCode}</span>
                  <span className="text-sm text-white/60">(-{discount}%)</span>
                </div>
                <button
                  onClick={handleRemovePromo}
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  Remove
                </button>
              </div>
            )}

            {/* Price Breakdown */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/60">Subtotal</span>
                <span className="font-light">${totalPrice.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/60">Discount ({discount}%)</span>
                  <span className="font-light text-accent-gold">
                    -${((totalPrice * discount) / 100).toFixed(2)}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/60">Shipping</span>
                <span className="font-light">
                  {totalPrice >= freeShippingThreshold ? (
                    <span className="text-green-400">FREE</span>
                  ) : (
                    'Calculated at checkout'
                  )}
                </span>
              </div>
              <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                <span className="font-serif text-lg">Total</span>
                <span className="font-light text-2xl text-accent-gold">
                  ${finalPrice.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Delivery Estimate */}
            <div className="flex items-center gap-2 text-xs text-white/40">
              <Truck size={14} />
              <span>Estimated delivery: {estimatedDelivery.toLocaleDateString()}</span>
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {checkoutError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 text-center"
                >
                  <p className="text-red-400 text-sm">{checkoutError}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Checkout Button */}
            <RippleButton
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="relative w-full py-5 bg-accent-gold text-black font-medium tracking-[0.2em] uppercase rounded-full group/btn shadow-xl shadow-accent-gold/30 hover:shadow-2xl hover:shadow-accent-gold/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {/* Button shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-200%] group-hover/btn:translate-x-[200%] transition-transform duration-700 pointer-events-none rounded-full"></div>

              <span className="relative z-10 flex items-center justify-center gap-3">
                {isCheckingOut ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Processing...
                  </>
                ) : (
                  <>
                    Proceed to Checkout
                    <ArrowRight
                      size={20}
                      className="group-hover/btn:translate-x-1 transition-transform duration-300"
                    />
                  </>
                )}
              </span>
            </RippleButton>

            {/* Continue Shopping */}
            <button
              onClick={closeCart}
              className="w-full py-4 glass-button text-white rounded-full text-sm tracking-[0.15em] uppercase"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </motion.div>
    </>
  )
}
