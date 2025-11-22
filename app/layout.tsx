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
import PageBackground from '@/components/ui/page-background'
// import { EmailPopup } from '@/components/email-capture'
import { DynamicIslandMusic } from '@/components/dynamic-island-music'
import { JsonLd } from '@/components/seo/JsonLd'
import { generateOrganizationSchema, generateWebSiteSchema } from '@/lib/json-ld'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://brandonmills.com'),
  title: {
    default: 'Brandon Mills | Author, Philosopher & Sacred Geometry Artist',
    template: '%s | Brandon Mills',
  },
  description: 'Explore philosophy essays, mental health blog, meditation guides, luxury canvas prints featuring sacred geometry art, and AI tools by Brandon Mills.',
  keywords: [
    'Brandon Mills',
    'sacred geometry art',
    'luxury canvas prints',
    'philosophy essays',
    'mental health blog',
    'meditation guides',
    'AI tools',
    'self-actualization',
    'consciousness',
    'Brandon Mills author',
  ],
  authors: [{ name: 'Brandon Mills', url: 'https://brandonmills.com' }],
  creator: 'Brandon Mills',
  publisher: 'Brandon Mills',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'Brandon Mills | Author, Philosopher & Sacred Geometry Artist',
    description: 'Philosophy essays, mental health blog, meditation guides, luxury canvas prints, and AI tools.',
    type: 'website',
    locale: 'en_US',
    url: 'https://brandonmills.com',
    siteName: 'Brandon Mills',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Brandon Mills - Author, Philosopher & Sacred Geometry Artist',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Brandon Mills | Author, Philosopher & Sacred Geometry Artist',
    description: 'Philosophy essays, mental health blog, meditation guides, luxury canvas prints, and AI tools.',
    creator: '@brandonmills',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
  category: 'Art & Philosophy',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Generate structured data for the entire site
  const organizationSchema = generateOrganizationSchema()
  const webSiteSchema = generateWebSiteSchema({ includeSearch: true })

  return (
    <html lang="en">
      <head>
        {/* Global JSON-LD structured data for SEO */}
        <JsonLd data={[organizationSchema, webSiteSchema]} />
      </head>
      <body className="antialiased">
        <ErrorBoundary>
          <CartProvider>
            <PageBackground />
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
            <DynamicIslandMusic />
            {/* <EmailPopup /> */}
            <ToastWrapper />
            <Analytics />
            <GoogleAnalytics />
          </CartProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
