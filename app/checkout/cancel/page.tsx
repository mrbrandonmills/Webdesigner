'use client'

import { useEffect, Suspense } from 'react'
import Link from 'next/link'
import { XCircle, ShoppingBag, Home } from 'lucide-react'

function CancelContent() {
  useEffect(() => {
    // Don't clear cart - user may want to retry
    console.log('Checkout cancelled')
  }, [])

  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-20">
      <div className="container-wide max-w-3xl mx-auto text-center">
        {/* Cancel Icon */}
        <div className="w-24 h-24 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
          <XCircle className="text-orange-400" size={48} />
        </div>

        {/* Cancel Message */}
        <h1 className="text-5xl md:text-6xl font-serif mb-6">
          Payment Cancelled
        </h1>
        <p className="text-xl text-white/70 mb-12">
          Your payment was cancelled. No charges were made to your account.
        </p>

        {/* Information Box */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 mb-8 text-left">
          <h2 className="text-2xl font-serif mb-6">What You Can Do</h2>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-accent-gold/20 rounded-full flex items-center justify-center flex-shrink-0">
                <ShoppingBag className="text-accent-gold" size={20} />
              </div>
              <div>
                <h3 className="font-medium mb-2">Your Cart is Safe</h3>
                <p className="text-sm text-white/60">
                  All items remain in your cart. You can review your selection and try again when you're ready.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-accent-gold/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Home className="text-accent-gold" size={20} />
              </div>
              <div>
                <h3 className="font-medium mb-2">Need Help?</h3>
                <p className="text-sm text-white/60">
                  If you encountered any issues during checkout, please contact our support team.
                  We're here to help make your purchase smooth and secure.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/store"
            className="px-8 py-4 bg-accent-gold text-black rounded-full font-medium tracking-wider uppercase hover:bg-accent-hover transition-colors"
          >
            Return to Cart
          </Link>

          <Link
            href="/store"
            className="px-8 py-4 bg-white/5 border border-white/10 rounded-full font-medium tracking-wider uppercase hover:bg-white/10 transition-colors"
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
            Need assistance? Contact us at{' '}
            <a href="mailto:support@brandonmills.com" className="text-accent-gold hover:underline">
              support@brandonmills.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutCancel() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="animate-spin w-12 h-12 border-2 border-accent-gold border-t-transparent rounded-full"></div>
        </div>
      }
    >
      <CancelContent />
    </Suspense>
  )
}
