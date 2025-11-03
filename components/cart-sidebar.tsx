'use client'

import { useCart } from '@/contexts/cart-context'
import { X, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react'
import { useEffect } from 'react'

export default function CartSidebar() {
  const {
    items,
    removeItem,
    updateQuantity,
    totalItems,
    totalPrice,
    isOpen,
    closeCart,
  } = useCart()

  // Lock body scroll when cart is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
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

  return (
    <>
      {/* Backdrop */}
      <div
        className={`
          fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300
          ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
        onClick={closeCart}
      />

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 right-0 h-full w-full md:w-[500px] bg-black border-l border-white/10
          z-50 flex flex-col transition-transform duration-300 ease-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <ShoppingBag className="text-accent-gold" size={24} />
            <div>
              <h2 className="text-xl font-serif">Your Cart</h2>
              <p className="text-sm text-white/40">
                {totalItems} {totalItems === 1 ? 'item' : 'items'}
              </p>
            </div>
          </div>
          <button
            onClick={closeCart}
            className="p-2 hover:bg-white/5 transition-colors rounded"
            aria-label="Close cart"
          >
            <X size={24} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <ShoppingBag size={64} className="text-white/20" />
              <div>
                <h3 className="text-xl font-serif mb-2">Your cart is empty</h3>
                <p className="text-white/60 text-sm">
                  Add some premium pieces to get started
                </p>
              </div>
              <button
                onClick={closeCart}
                className="mt-4 px-6 py-3 bg-accent-gold text-black font-medium tracking-wider uppercase hover:bg-accent-hover transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.variantId}
                className="bg-white/5 border border-white/10 p-4 space-y-4"
              >
                <div className="flex gap-4">
                  {/* Product Image */}
                  <div className="w-24 h-24 bg-white/5 overflow-hidden flex-shrink-0">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.productTitle}
                        className="w-full h-full object-cover"
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
                    <div className="text-lg font-light">
                      ${item.price}
                    </div>
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 bg-white/5 border border-white/10">
                    <button
                      onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                      className="p-2 hover:bg-white/5 transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-8 text-center font-medium">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                      className="p-2 hover:bg-white/5 transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.variantId)}
                    className="text-sm text-white/40 hover:text-white transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer - Checkout */}
        {items.length > 0 && (
          <div className="border-t border-white/10 p-6 space-y-4">
            {/* Subtotal */}
            <div className="flex items-center justify-between text-lg">
              <span className="font-serif">Subtotal</span>
              <span className="font-light">${totalPrice.toFixed(2)}</span>
            </div>

            {/* Info */}
            <p className="text-xs text-white/40">
              Shipping and taxes calculated at checkout
            </p>

            {/* Checkout Button */}
            <button
              className="w-full py-4 bg-accent-gold text-black font-medium tracking-wider uppercase hover:bg-accent-hover transition-colors flex items-center justify-center gap-2 group"
            >
              Proceed to Checkout
              <ArrowRight
                size={20}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>

            {/* Continue Shopping */}
            <button
              onClick={closeCart}
              className="w-full py-3 border border-white/10 text-white hover:bg-white/5 transition-colors text-sm tracking-wider uppercase"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  )
}
