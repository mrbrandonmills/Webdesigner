import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'
import Navigation from '@/components/navigation'
import './globals.css'

export const metadata: Metadata = {
  title: 'Brandon Mills | Cognitive Science Researcher · Model · Actor',
  description: 'Exploring the integration of mind, body, and creativity. Cognitive science research, modeling, acting, and self-actualization by Brandon Mills.',
  keywords: 'Brandon Mills, cognitive science, researcher, model, actor, self-actualization, embodied cognition, consciousness, performance, philosophy',
  openGraph: {
    title: 'Brandon Mills | Cognitive Science Researcher · Model · Actor',
    description: 'Where mind, body, and creativity converge into unified self-expression',
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
