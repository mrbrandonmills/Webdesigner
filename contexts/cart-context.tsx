'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Toast } from '@/components/toast'

export interface CartItem {
  productId: number
  variantId: number
  productTitle: string
  variantName: string
  image: string
  price: string
  quantity: number
  type: string
  brand: string
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (variantId: number) => void
  updateQuantity: (variantId: number, quantity: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [toasts, setToasts] = useState<Toast[]>([])

  // Load cart from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('bmills-cart')
      if (savedCart) {
        try {
          setItems(JSON.parse(savedCart))
        } catch (error) {
          console.error('Failed to load cart:', error)
        }
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('bmills-cart', JSON.stringify(items))
    }
  }, [items])

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Date.now().toString()
    setToasts(current => [...current, { ...toast, id }])
  }

  const removeToast = (id: string) => {
    setToasts(current => current.filter(t => t.id !== id))
  }

  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    setItems(current => {
      const existingItem = current.find(i => i.variantId === item.variantId)

      if (existingItem) {
        // Increment quantity if item already exists
        addToast({
          type: 'success',
          message: `Updated ${item.productTitle} quantity`,
        })
        return current.map(i =>
          i.variantId === item.variantId
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      }

      // Add new item with quantity 1
      addToast({
        type: 'success',
        message: `Added ${item.productTitle} to cart`,
      })
      return [...current, { ...item, quantity: 1 }]
    })

    // Open cart when item is added
    setIsOpen(true)
  }

  const removeItem = (variantId: number) => {
    setItems(current => current.filter(item => item.variantId !== variantId))
  }

  const updateQuantity = (variantId: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(variantId)
      return
    }

    setItems(current =>
      current.map(item =>
        item.variantId === variantId
          ? { ...item, quantity }
          : item
      )
    )
  }

  const clearCart = () => {
    setItems([])
  }

  const openCart = () => setIsOpen(true)
  const closeCart = () => setIsOpen(false)

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce(
    (sum, item) => sum + parseFloat(item.price) * item.quantity,
    0
  )

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isOpen,
        openCart,
        closeCart,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}
