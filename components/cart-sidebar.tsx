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
          fixed inset-0 bg-black/80 backdrop-blur-md z-50 transition-opacity duration-500
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
                className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 space-y-4 hover:border-accent-gold/30 hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex gap-4">
                  {/* Product Image */}
                  <div className="w-24 h-24 bg-white/5 rounded-xl overflow-hidden flex-shrink-0 group-hover:shadow-lg transition-shadow duration-300">
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
                    <div className="text-lg font-light">
                      ${item.price}
                    </div>
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full overflow-hidden">
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
                    className="text-xs text-white/40 hover:text-red-400 transition-colors duration-300 tracking-wider uppercase"
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
              className="relative w-full py-5 bg-accent-gold text-black font-medium tracking-[0.2em] uppercase rounded-full overflow-hidden group/btn shadow-xl shadow-accent-gold/30 hover:shadow-2xl hover:shadow-accent-gold/40 transition-all duration-300"
            >
              {/* Button shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-200%] group-hover/btn:translate-x-[200%] transition-transform duration-700"></div>

              <span className="relative z-10 flex items-center justify-center gap-3">
                Proceed to Checkout
                <ArrowRight
                  size={20}
                  className="group-hover/btn:translate-x-1 transition-transform duration-300"
                />
              </span>
            </button>

            {/* Continue Shopping */}
            <button
              onClick={closeCart}
              className="w-full py-4 border border-white/10 text-white rounded-full hover:bg-white/5 hover:border-accent-gold/30 transition-all duration-300 text-sm tracking-[0.15em] uppercase backdrop-blur-sm"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  )
}
