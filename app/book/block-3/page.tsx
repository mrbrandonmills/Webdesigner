import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, BookOpen, Mail, Share2, ExternalLink } from 'lucide-react'
import { Block3SignupForm } from '@/components/email/block-3-signup-form'
import { Block3Content } from '@/components/block-3-content'
import { ReadingProgress } from '@/components/reading-progress'
import { EbookCTA } from '@/components/ebook-cta'
import Navigation from '@/components/navigation'
import { ebookConfig } from '@/lib/ebook-config'
import { getFeaturedProducts } from '@/lib/affiliate-products'

export const metadata: Metadata = {
  title: 'Read Block 3 Free - Random Acts of Self-Actualization',
  description: 'The final chapter of the trilogy. Exclusive free content online. The Laboratory of Living - a journey of self-actualization, breaking addiction, and building an intentional life.',
  keywords: [
    'Block 3',
    'Random Acts of Self-Actualization',
    'Brandon Mills',
    'self-actualization',
    'personal growth',
    'philosophy',
    'addiction recovery',
    'polymath',
    'intentional living',
    'free ebook',
    'The Laboratory of Living'
  ],
  openGraph: {
    title: 'Read Block 3 Free - Random Acts of Self-Actualization',
    description: 'The final chapter of the trilogy. Exclusive free content online. The Laboratory of Living.',
    type: 'book',
    url: 'https://www.brandonmills.com/book/block-3',
    images: [
      {
        url: 'https://www.brandonmills.com/og-block-3.jpg',
        width: 1200,
        height: 630,
        alt: 'Random Acts of Self-Actualization: The Laboratory of Living - Block 3'
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Read Block 3 Free - Random Acts of Self-Actualization',
    description: 'The final chapter of the trilogy. Exclusive free content online.',
    images: ['https://www.brandonmills.com/og-block-3.jpg'],
  },
  authors: [{ name: 'Brandon Mills', url: 'https://www.brandonmills.com' }],
}

export default function Block3Page() {
  const featuredProducts = getFeaturedProducts().slice(0, 4)

  // JSON-LD Schema for Book
  const bookSchema = {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: 'Random Acts of Self-Actualization: The Laboratory of Living',
    author: {
      '@type': 'Person',
      name: 'Brandon Mills',
      url: 'https://www.brandonmills.com',
      jobTitle: 'Polymath, Philosopher, Author',
      alumniOf: 'NASA',
    },
    description: 'Block 3 of the transformative trilogy exploring self-actualization, breaking free from addiction, and building an intentional life. From NASA engineer to philosopher.',
    inLanguage: 'en-US',
    bookFormat: 'EBook',
    isPartOf: {
      '@type': 'BookSeries',
      name: 'Random Acts of Self-Actualization',
      numberOfItems: 3,
    },
    isAccessibleForFree: true,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: 'https://www.brandonmills.com/book/block-3',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(bookSchema) }}
      />

      <ReadingProgress />

      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
        <Navigation />

        {/* Hero Section with Email Capture */}
        <section className="relative pt-32 pb-20 px-6 overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-purple-900/10 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(212,175,55,0.05),transparent_50%)]" />

          <div className="max-w-6xl mx-auto relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left: Hero Content */}
              <div className="text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 border border-gold/30 rounded-full mb-6">
                  <BookOpen className="w-4 h-4 text-gold" />
                  <span className="text-sm font-medium text-gold">FREE TO READ ONLINE</span>
                </div>

                <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 font-serif leading-tight">
                  Random Acts of
                  <br />
                  <span className="text-gold">Self-Actualization</span>
                </h1>

                <p className="text-2xl md:text-3xl text-gray-300 mb-4 font-serif italic">
                  The Laboratory of Living
                </p>

                <div className="w-20 h-1 bg-gradient-to-r from-gold to-amber-600 mb-6 mx-auto lg:mx-0" />

                <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                  <strong className="text-gold">Block 3</strong> - The final chapter of the trilogy.
                  <br />
                  From NASA engineer to philosopher. A journey of breaking free from addiction and building an intentional life.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
                  <a
                    href="#read-now"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-black font-bold rounded-lg hover:bg-gray-100 transition-all transform hover:scale-105"
                  >
                    <BookOpen className="w-5 h-5" />
                    Start Reading Free
                  </a>
                  <a
                    href="#get-books"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent border-2 border-gold text-gold font-bold rounded-lg hover:bg-gold/10 transition-all"
                  >
                    <ExternalLink className="w-5 h-5" />
                    Get Books 1 & 2
                  </a>
                </div>

                {/* Social Proof */}
                <div className="flex items-center gap-6 justify-center lg:justify-start text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 border-2 border-black" />
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold to-amber-600 border-2 border-black" />
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-600 to-emerald-600 border-2 border-black" />
                    </div>
                    <span>Join hundreds of readers</span>
                  </div>
                  <div className="h-4 w-px bg-gray-700" />
                  <span>📚 Part of a trilogy</span>
                </div>
              </div>

              {/* Right: Email Signup Form */}
              <div>
                <Block3SignupForm variant="hero" />
              </div>
            </div>
          </div>
        </section>

        {/* Get Books 1 & 2 CTA */}
        <section id="get-books" className="py-16 px-6 bg-gradient-to-r from-purple-900/20 to-blue-900/20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-serif">
              Start from the Beginning
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              The complete trilogy is best experienced in order. Get Books 1 & 2 on Amazon.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {ebookConfig.volumes.filter(v => v.amazonUrl).map((volume, idx) => (
                <a
                  key={volume.asin}
                  href={volume.amazonUrl!}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    // Track clicks
                    if (typeof window !== 'undefined' && (window as any).gtag) {
                      (window as any).gtag('event', 'click', {
                        event_category: 'affiliate',
                        event_label: `Block 3 Page - ${volume.name}`,
                        value: ebookConfig.price
                      })
                    }
                  }}
                  className="bg-black/40 backdrop-blur-sm border border-gold/20 rounded-xl p-6 hover:border-gold/50 transition-all transform hover:scale-105 group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-24 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-3xl font-bold">{idx + 1}</span>
                    </div>
                    <div className="text-left flex-1">
                      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-gold transition-colors">
                        {volume.name}
                      </h3>
                      <p className="text-sm text-gray-400 mb-3">
                        {idx === 0 ? 'Breaking free from addiction' : 'Continuing the journey'}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-gold font-bold">${ebookConfig.price}</span>
                        <ArrowRight className="w-5 h-5 text-gold group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>

            <p className="text-sm text-gray-400">
              Amazon Kindle • Instant delivery • Read on any device
            </p>
          </div>
        </section>

        {/* Sticky CTA Bar */}
        <div className="sticky bottom-0 left-0 right-0 z-40 bg-black/90 backdrop-blur-lg border-t border-gold/20 py-3 px-6">
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <BookOpen className="w-6 h-6 text-gold flex-shrink-0" />
              <div className="hidden sm:block">
                <p className="text-white font-bold text-sm">Random Acts of Self-Actualization</p>
                <p className="text-gray-400 text-xs">Get the complete trilogy</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <a
                href={ebookConfig.volumes[0].amazonUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2 bg-gradient-to-r from-gold to-amber-600 text-black font-bold rounded-lg hover:from-amber-600 hover:to-gold transition-all text-sm"
              >
                Buy on Amazon
              </a>
              <ShareButton />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <section id="read-now" className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <Block3Content />
          </div>
        </section>

        {/* Inline Email Capture (After 50% content) */}
        <section className="py-16 px-6 bg-gradient-to-r from-purple-900/10 to-blue-900/10">
          <div className="max-w-2xl mx-auto">
            <Block3SignupForm variant="inline" />
          </div>
        </section>

        {/* Affiliate Product Recommendations */}
        <section className="py-20 px-6 bg-black/40">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-serif">
                Tools for Your Journey
              </h2>
              <p className="text-xl text-gray-300">
                Products I use and recommend for self-actualization
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <a
                  key={product.id}
                  href={product.amazonUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    // Track affiliate clicks
                    if (typeof window !== 'undefined' && (window as any).gtag) {
                      (window as any).gtag('event', 'click', {
                        event_category: 'affiliate',
                        event_label: `Block 3 - ${product.name}`,
                        value: product.price
                      })
                    }
                  }}
                  className="bg-black/60 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden hover:border-gold/50 transition-all transform hover:scale-105 group"
                >
                  <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-bold text-white mb-2 line-clamp-2 group-hover:text-gold transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-gold font-bold">${product.price}</span>
                      <div className="flex items-center gap-1 text-yellow-500 text-xs">
                        <span>★</span>
                        <span>{product.rating}</span>
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>

            <p className="text-center text-xs text-gray-500 mt-8">
              As an Amazon Associate, I earn from qualifying purchases at no extra cost to you.
            </p>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 px-6 bg-gradient-to-b from-black via-gray-900 to-black">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 font-serif">
              Ready to Begin Your Journey?
            </h2>
            <p className="text-xl text-gray-300 mb-12">
              Join thousands of readers transforming their lives through intentional self-actualization.
            </p>

            <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <a
                href={ebookConfig.volumes[0].amazonUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-4 p-8 bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-purple-800/30 rounded-xl hover:border-gold/50 transition-all transform hover:scale-105"
              >
                <BookOpen className="w-12 h-12 text-gold" />
                <h3 className="text-xl font-bold text-white">Start with Book 1</h3>
                <p className="text-gray-400 text-sm">Building a Non-Addictive Life</p>
                <span className="text-gold font-bold">${ebookConfig.price}</span>
              </a>

              <div className="flex flex-col items-center gap-4 p-8 bg-gradient-to-br from-green-900/20 to-emerald-900/20 border border-green-800/30 rounded-xl">
                <Mail className="w-12 h-12 text-green-400" />
                <h3 className="text-xl font-bold text-white">Get Launch Updates</h3>
                <p className="text-gray-400 text-sm">Be notified when Block 3 publishes</p>
                <a href="#" className="text-green-400 font-bold hover:text-green-300">
                  Sign up above ↑
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Footer Email Capture */}
        <section className="py-16 px-6 bg-black/60">
          <div className="max-w-2xl mx-auto">
            <Block3SignupForm variant="footer" />
          </div>
        </section>
      </div>
    </>
  )
}

// Share Button Component
function ShareButton() {
  const handleShare = async () => {
    const shareData = {
      title: 'Random Acts of Self-Actualization: Block 3',
      text: 'Read Block 3 free online - The Laboratory of Living',
      url: 'https://www.brandonmills.com/book/block-3',
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        // Fallback: Copy to clipboard
        await navigator.clipboard.writeText(shareData.url)
        alert('Link copied to clipboard!')
      }

      // Track share
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'share', {
          event_category: 'engagement',
          event_label: 'Block 3 Share',
        })
      }
    } catch (error) {
      console.error('Share failed:', error)
    }
  }

  return (
    <button
      onClick={handleShare}
      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
      aria-label="Share"
    >
      <Share2 className="w-5 h-5 text-gray-400 hover:text-white" />
    </button>
  )
}
