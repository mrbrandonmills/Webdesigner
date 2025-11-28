'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, ShoppingBag, ArrowRight } from 'lucide-react'
import { useCart } from '@/contexts/cart-context'

function SuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { clearCart } = useCart()
  const [sessionId, setSessionId] = useState<string | null>(null)

  useEffect(() => {
    const session_id = searchParams.get('session_id')
    if (session_id) {
      setSessionId(session_id)
      // Clear the cart after successful purchase
      clearCart()
    } else {
      // No session ID, redirect to shop
      router.push('/shop')
    }
  }, [searchParams, clearCart, router])

  if (!sessionId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-green-500 opacity-20 rounded-full blur-xl"></div>
              <CheckCircle className="w-20 h-20 text-green-500 relative" strokeWidth={1.5} />
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-3xl md:text-4xl font-light mb-4 text-gray-900">
            Order Confirmed
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Thank you for your purchase! Your order has been successfully placed.
          </p>

          {/* Order Details */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <p className="text-sm text-gray-500 mb-2">Order Number</p>
            <p className="text-lg font-mono text-gray-900 mb-4">
              {sessionId.slice(-12).toUpperCase()}
            </p>
            <p className="text-sm text-gray-600">
              You will receive an email confirmation shortly with your order details and tracking information.
            </p>
          </div>

          {/* Next Steps */}
          <div className="space-y-4 mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">What's Next?</h2>
            <div className="text-left space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-green-600 text-xs font-medium">1</span>
                </div>
                <p className="text-gray-700">
                  Check your email for order confirmation and receipt
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-green-600 text-xs font-medium">2</span>
                </div>
                <p className="text-gray-700">
                  Your items will be carefully prepared and shipped
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-green-600 text-xs font-medium">3</span>
                </div>
                <p className="text-gray-700">
                  Track your order with the link sent to your email
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              Continue Shopping
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Return Home
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Support Info */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Need help with your order?</p>
          <p>Contact us at{' '}
            <a href="mailto:support@brandonmills.com" className="text-gray-900 hover:underline">
              support@brandonmills.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}
