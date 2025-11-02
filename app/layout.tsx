import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'
import Navigation from '@/components/navigation'
import './globals.css'

export const metadata: Metadata = {
  title: 'Brandon Mills | Model · Photographer · Creative',
  description: 'Therapeutic warmth meets renaissance sophistication. Portfolio of modeling, photography, and creative work by Brandon Mills.',
  keywords: 'Brandon Mills, modeling, photography, fashion, creative portfolio, Los Angeles, renaissance man',
  openGraph: {
    title: 'Brandon Mills | Model · Photographer · Creative',
    description: 'Therapeutic warmth meets renaissance sophistication',
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
        <Navigation />
        <main className="min-h-screen">
          {children}
        </main>
        <Analytics />
      </body>
    </html>
  )
}
