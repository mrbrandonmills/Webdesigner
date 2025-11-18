'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

function SuccessPageContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [verifying, setVerifying] = useState(true)

  useEffect(() => {
    const verifyAndUnlock = async () => {
      if (!sessionId) {
        setVerifying(false)
        return
      }

      try {
        const response = await fetch(`/api/stripe/verify-purchase?session_id=${sessionId}`)
        const data = await response.json()

        if (data.valid) {
          localStorage.setItem('book-unlocked-block-c', 'true')
          setVerifying(false)
        }
      } catch (error) {
        console.error('Verification failed:', error)
        setVerifying(false)
      }
    }

    verifyAndUnlock()
  }, [sessionId])

  if (verifying) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl mb-4">🔄</div>
          <h1 className="text-3xl font-light">Verifying your purchase...</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <section className="pt-32 pb-32 container-wide">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div className="text-7xl mb-4">✓</div>
          <h1 className="text-5xl font-light font-serif">Purchase Successful!</h1>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-accent-gold to-transparent mx-auto my-8" />
          <p className="text-white/70 text-lg">
            Thank you for your purchase. Your book is now unlocked and ready to read.
          </p>
          <div className="pt-8">
            <Link
              href="/writing/books/block-c"
              className="inline-block bg-accent-gold text-black px-12 py-4 text-sm tracking-wider uppercase font-medium hover:bg-white transition-colors rounded-full"
            >
              Read Block C Now
            </Link>
          </div>
          <div className="pt-8 text-white/50 text-sm space-y-2">
            <p>✓ Full PDF access unlocked</p>
            <p>✓ Lifetime access - yours forever</p>
            <p>✓ Read anytime, anywhere</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default function BlockCSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-6xl">⏳</div>
      </div>
    }>
      <SuccessPageContent />
    </Suspense>
  )
}
