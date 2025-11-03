'use client'

import { useCart } from '@/contexts/cart-context'
import { ToastContainer } from '@/components/toast'

export default function ToastWrapper() {
  const { toasts, removeToast } = useCart()
  return <ToastContainer toasts={toasts} onClose={removeToast} />
}
