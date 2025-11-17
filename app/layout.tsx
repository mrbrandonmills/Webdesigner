import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'
import Navigation from '@/components/navigation'
import { CustomCursor } from '@/components/custom-cursor'
import SmoothScroll from '@/components/smooth-scroll'
import PageTransition from '@/components/page-transition'
import { CartProvider } from '@/contexts/cart-context'
import CartSidebar from '@/components/cart-sidebar'
import ToastWrapper from '@/components/toast-wrapper'
import { ErrorBoundary } from '@/components/error-boundary'
import { ConciergeWidget } from '@/components/concierge/concierge-widget'
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics'
import './globals.css'

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
        <ErrorBoundary>
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
            <ConciergeWidget />
            <ToastWrapper />
            <Analytics />
            <GoogleAnalytics />
          </CartProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
