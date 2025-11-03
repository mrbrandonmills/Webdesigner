'use client'

import { useEffect } from 'react'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'

export interface Toast {
  id: string
  type: 'success' | 'error' | 'info'
  message: string
  duration?: number
}

interface ToastProps {
  toast: Toast
  onClose: (id: string) => void
}

export function ToastItem({ toast, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id)
    }, toast.duration || 3000)

    return () => clearTimeout(timer)
  }, [toast, onClose])

  const icons = {
    success: <CheckCircle className="text-green-400" size={20} />,
    error: <AlertCircle className="text-red-400" size={20} />,
    info: <Info className="text-blue-400" size={20} />,
  }

  const borderColors = {
    success: 'border-green-400/30',
    error: 'border-red-400/30',
    info: 'border-blue-400/30',
  }

  return (
    <div
      className={`
        flex items-center gap-4 p-4 pr-12 rounded-2xl backdrop-blur-xl border
        bg-black/90 ${borderColors[toast.type]} shadow-2xl
        animate-slideInRight relative overflow-hidden
      `}
    >
      {/* Glow effect */}
      <div className={`absolute inset-0 bg-gradient-to-r ${
        toast.type === 'success' ? 'from-green-400/10' :
        toast.type === 'error' ? 'from-red-400/10' :
        'from-blue-400/10'
      } to-transparent opacity-50`}></div>

      <div className="relative z-10 flex items-center gap-4 flex-1">
        {icons[toast.type]}
        <p className="text-white text-sm font-light">{toast.message}</p>
      </div>

      <button
        onClick={() => onClose(toast.id)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors z-10"
        aria-label="Close notification"
      >
        <X size={16} />
      </button>
    </div>
  )
}

interface ToastContainerProps {
  toasts: Toast[]
  onClose: (id: string) => void
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  return (
    <div className="fixed top-24 right-6 z-[100] space-y-3 max-w-md">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={onClose} />
      ))}
    </div>
  )
}
