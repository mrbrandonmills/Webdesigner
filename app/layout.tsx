import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'
import Navigation from '@/components/navigation'
import { CustomCursor } from '@/components/custom-cursor'
import SmoothScroll from '@/components/smooth-scroll'
import PageTransition from '@/components/page-transition'
import { CartProvider, useCart } from '@/contexts/cart-context'
import CartSidebar from '@/components/cart-sidebar'
import { ToastContainer } from '@/components/toast'
import './globals.css'

function ToastWrapper() {
  const { toasts, removeToast } = useCart()
  return <ToastContainer toasts={toasts} onClose={removeToast} />
}

export const metadata: Metadata = {
  title: 'Brandon Mills | Model · Actor · Creative',
  description: 'Fashion model, actor, and creative exploring the intersection of performance, embodiment, and human expression.',
  keywords: 'Brandon Mills, model, actor, fashion, modeling, acting, performance, creative, Los Angeles, editorial, commercial',
  openGraph: {
    title: 'Brandon Mills | Model · Actor · Creative',
    description: 'Where performance meets presence — modeling, acting, and creative expression',
    type: 'website',
    locale: 'en_US',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <CartProvider>
          <CustomCursor />
          <SmoothScroll>
            <Navigation />
            <PageTransition>
              <main className="min-h-screen">
                {children}
              </main>
            </PageTransition>
          </SmoothScroll>
          <CartSidebar />
          <ToastWrapper />
          <Analytics />
        </CartProvider>
      </body>
    </html>
  )
}
