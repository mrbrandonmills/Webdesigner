'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Package, Mail } from 'lucide-react'

function SuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [loading, setLoading] = useState(true)
  const [order, setOrder] = useState<any>(null)

  useEffect(() => {
    // Clear cart on successful checkout
    if (typeof window !== 'undefined') {
      localStorage.removeItem('bmills-cart')
    }

    // Simulate loading (in production, fetch order details from Stripe)
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-2 border-accent-gold border-t-transparent rounded-full"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-20">
      <div className="container-wide max-w-3xl mx-auto text-center">
        {/* Success Icon */}
        <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle className="text-green-400" size={48} />
        </div>

        {/* Success Message */}
        <h1 className="text-5xl md:text-6xl font-serif mb-6">
          Payment Successful!
        </h1>
        <p className="text-xl text-white/70 mb-12">
          Thank you for your order. We're preparing your items for shipment.
        </p>

        {/* Order Details */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 mb-8 text-left">
          <h2 className="text-2xl font-serif mb-6">What Happens Next</h2>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-accent-gold/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Mail className="text-accent-gold" size={20} />
              </div>
              <div>
                <h3 className="font-medium mb-2">Order Confirmation</h3>
                <p className="text-sm text-white/60">
                  You'll receive an email confirmation with your order details shortly.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-accent-gold/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Package className="text-accent-gold" size={20} />
              </div>
              <div>
                <h3 className="font-medium mb-2">Production & Shipping</h3>
                <p className="text-sm text-white/60">
                  Your custom products are being created and will ship within 5-7 business days.
                  You'll receive tracking information when your order ships.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Session ID (for debugging) */}
        {sessionId && (
          <div className="text-xs text-white/30 mb-8">
            Order ID: {sessionId}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/store"
            className="px-8 py-4 bg-accent-gold text-black rounded-full font-medium tracking-wider uppercase hover:bg-accent-hover transition-colors"
          >
            Continue Shopping
          </Link>

          <Link
            href="/"
            className="px-8 py-4 bg-white/5 border border-white/10 rounded-full font-medium tracking-wider uppercase hover:bg-white/10 transition-colors"
          >
            Return Home
          </Link>
        </div>

        {/* Support Info */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <p className="text-sm text-white/40">
            Questions about your order? Contact us at{' '}
            <a href="mailto:support@brandonmills.com" className="text-accent-gold hover:underline">
              support@brandonmills.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutSuccess() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="animate-spin w-12 h-12 border-2 border-accent-gold border-t-transparent rounded-full"></div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  )
}
