'use client'

import { useState } from 'react'
import { ShoppingCart, Check, Heart, Minus, Plus } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/contexts/cart-context'
import { RippleButton } from '@/components/ripple-button'

interface AddToCartButtonProps {
  productId: number
  variantId: number
  productTitle: string
  variantName: string
  image: string
  price: string
  type: string
  brand: string
  inStock: boolean
  onAddToWishlist?: () => void
}

export default function AddToCartButton({
  productId,
  variantId,
  productTitle,
  variantName,
  image,
  price,
  type,
  brand,
  inStock,
  onAddToWishlist,
}: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1)
  const [isAdded, setIsAdded] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const { addItem } = useCart()

  const handleAddToCart = () => {
    if (!inStock) return

    // Add to cart with quantity
    for (let i = 0; i < quantity; i++) {
      addItem({
        productId,
        variantId,
        productTitle,
        variantName,
        image,
        price,
        type,
        brand,
      })
    }

    // Show success animation
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  const handleBuyNow = () => {
    if (!inStock) return
    handleAddToCart()
    // In a real app, redirect to checkout immediately
    // window.location.href = '/checkout'
  }

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted)
    if (onAddToWishlist) {
      onAddToWishlist()
    }
  }

  return (
    <div className="space-y-6">
      {/* Quantity Selector */}
      <div className="space-y-3">
        <div className="text-sm tracking-[0.2em] uppercase text-white/40">Quantity</div>
        <div className="flex items-center gap-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full p-2 w-fit">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="p-3 hover:bg-accent-gold/20 hover:text-accent-gold transition-all duration-300 rounded-full"
            aria-label="Decrease quantity"
            disabled={quantity <= 1}
          >
            <Minus size={18} />
          </button>
          <span className="w-16 text-center text-lg font-light">{quantity}</span>
          <button
            onClick={() => setQuantity(Math.min(10, quantity + 1))}
            className="p-3 hover:bg-accent-gold/20 hover:text-accent-gold transition-all duration-300 rounded-full"
            aria-label="Increase quantity"
            disabled={quantity >= 10}
          >
            <Plus size={18} />
          </button>
        </div>
      </div>

      {/* Price Display */}
      <div className="flex items-baseline gap-3">
        <div className="text-5xl font-light text-accent-gold">${price}</div>
        <div className="text-white/40 text-sm">per item</div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        {/* Add to Cart */}
        <RippleButton
          onClick={handleAddToCart}
          disabled={!inStock || isAdded}
          className={`
            relative w-full py-5 font-medium tracking-[0.2em] uppercase rounded-full
            shadow-xl transition-all duration-300 group/btn
            ${
              inStock
                ? 'bg-accent-gold text-black hover:shadow-2xl hover:shadow-accent-gold/40 shadow-accent-gold/30'
                : 'bg-white/10 text-white/40 cursor-not-allowed'
            }
          `}
        >
          {/* Button shine effect */}
          {inStock && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-200%] group-hover/btn:translate-x-[200%] transition-transform duration-700 pointer-events-none rounded-full"></div>
          )}

          <AnimatePresence mode="wait">
            {isAdded ? (
              <motion.span
                key="added"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="relative z-10 flex items-center justify-center gap-3"
              >
                <Check size={20} />
                <span>Added to Cart!</span>
              </motion.span>
            ) : (
              <motion.span
                key="add"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="relative z-10 flex items-center justify-center gap-3"
              >
                <ShoppingCart
                  size={20}
                  className="group-hover/btn:rotate-12 transition-transform duration-300"
                />
                <span>{inStock ? 'Add to Cart' : 'Out of Stock'}</span>
              </motion.span>
            )}
          </AnimatePresence>
        </RippleButton>

        {/* Buy Now */}
        {inStock && (
          <button
            onClick={handleBuyNow}
            className="w-full py-5 border-2 border-accent-gold text-accent-gold rounded-full hover:bg-accent-gold hover:text-black transition-all duration-300 font-medium tracking-[0.2em] uppercase backdrop-blur-xl"
          >
            Buy Now
          </button>
        )}

        {/* Add to Wishlist */}
        <button
          onClick={handleWishlist}
          className={`
            w-full py-5 border border-white/10 rounded-full transition-all duration-300
            font-medium tracking-[0.2em] uppercase backdrop-blur-xl
            flex items-center justify-center gap-3
            ${
              isWishlisted
                ? 'border-red-500 bg-red-500/10 text-red-400'
                : 'hover:bg-white/5 hover:border-accent-gold/30 text-white/80'
            }
          `}
        >
          <Heart
            size={20}
            className={`transition-all duration-300 ${
              isWishlisted ? 'fill-red-400' : ''
            }`}
          />
          <span>{isWishlisted ? 'In Wishlist' : 'Add to Wishlist'}</span>
        </button>
      </div>

      {/* Additional Info */}
      {inStock && quantity > 1 && (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/60">Total for {quantity} items:</span>
            <span className="text-2xl font-light text-accent-gold">
              ${(parseFloat(price) * quantity).toFixed(2)}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
