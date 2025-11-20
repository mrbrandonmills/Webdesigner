import { Metadata } from 'next'
import Link from 'next/link'
import { Library, Lock, Unlock } from 'lucide-react'
import { RippleButton } from '@/components/ripple-button'
import { JsonLd } from '@/components/seo/JsonLd'
import { generateBreadcrumbSchema } from '@/lib/json-ld'

export const metadata: Metadata = {
  title: 'Self-Actualization Books - Random Acts Trilogy | Brandon Mills',
  description: 'Purchase the Random Acts of Self-Actualization trilogy. Three transformative books on consciousness, personal growth, and breaking free from addictive patterns. $5 each.',
  keywords: [
    'self-actualization books',
    'Brandon Mills author',
    'consciousness books',
    'personal transformation',
    'philosophy books',
    'Random Acts of Self-Actualization',
    'self-help books',
    'addiction recovery books',
    'personal growth',
    'spiritual books',
  ],
  alternates: {
    canonical: 'https://brandonmills.com/writing/books',
  },
  openGraph: {
    title: 'Self-Actualization Books - Random Acts Trilogy | Brandon Mills',
    description: 'The Random Acts of Self-Actualization trilogy. Three transformative books on consciousness and personal growth. $5 each.',
    type: 'website',
    url: 'https://brandonmills.com/writing/books',
    siteName: 'Brandon Mills',
    images: [
      {
        url: 'https://brandonmills.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Brandon Mills Books - Random Acts of Self-Actualization',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Self-Actualization Books | Brandon Mills',
    description: 'Random Acts of Self-Actualization trilogy - consciousness, transformation, and personal growth.',
    images: ['https://brandonmills.com/og-image.jpg'],
  },
}

const books = [
  {
    id: 'block-a',
    title: 'Random Acts of Self-Actualization: Block A',
    subtitle: 'Breaking Free from Addictive Patterns',
    description: 'The journey begins. An exploration of the foundations of consciousness, identity, and the first steps toward self-awareness.',
    pages: '85',
    price: 5,
    status: 'available' as const,
  },
  {
    id: 'block-b',
    title: 'Random Acts of Self-Actualization: Block B',
    subtitle: 'The Path of Conscious Transformation',
    description: 'Deep dive into the mechanisms of transformation, exploring how we change, grow, and evolve through conscious practice.',
    pages: '57',
    price: 5,
    status: 'available' as const,
  },
  {
    id: 'block-c',
    title: 'Random Acts of Self-Actualization: Block C',
    subtitle: 'The Laboratory of Living',
    description: 'Integration and embodiment. Where theory meets practice and consciousness becomes a lived experience.',
    pages: '120+',
    price: 5,
    status: 'available' as const,
  },
]

// Generate Book schema for each book in the trilogy
function generateBookListSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Random Acts of Self-Actualization Trilogy',
    description: 'A three-part journey through consciousness, transformation, and integration',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        item: {
          '@type': 'Book',
          name: 'Random Acts of Self-Actualization: Block A',
          description: 'Breaking Free from Addictive Patterns - The journey begins. An exploration of the foundations of consciousness, identity, and the first steps toward self-awareness.',
          author: {
            '@type': 'Person',
            name: 'Brandon Mills',
          },
          numberOfPages: 85,
          bookFormat: 'EBook',
          inLanguage: 'en',
          offers: {
            '@type': 'Offer',
            price: '5.00',
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
            url: 'https://brandonmills.com/writing/books/block-a',
          },
        },
      },
      {
        '@type': 'ListItem',
        position: 2,
        item: {
          '@type': 'Book',
          name: 'Random Acts of Self-Actualization: Block B',
          description: 'The Path of Conscious Transformation - Deep dive into the mechanisms of transformation, exploring how we change, grow, and evolve through conscious practice.',
          author: {
            '@type': 'Person',
            name: 'Brandon Mills',
          },
          numberOfPages: 57,
          bookFormat: 'EBook',
          inLanguage: 'en',
          offers: {
            '@type': 'Offer',
            price: '5.00',
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
            url: 'https://brandonmills.com/writing/books/block-b',
          },
        },
      },
      {
        '@type': 'ListItem',
        position: 3,
        item: {
          '@type': 'Book',
          name: 'Random Acts of Self-Actualization: Block C',
          description: 'The Laboratory of Living - Integration and embodiment. Where theory meets practice and consciousness becomes a lived experience.',
          author: {
            '@type': 'Person',
            name: 'Brandon Mills',
          },
          numberOfPages: 120,
          bookFormat: 'EBook',
          inLanguage: 'en',
          offers: {
            '@type': 'Offer',
            price: '5.00',
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
            url: 'https://brandonmills.com/writing/books/block-c',
          },
        },
      },
    ],
  }
}

export default function BooksPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Writing', url: '/writing' },
    { name: 'Books', url: '/writing/books' },
  ])
  const bookListSchema = generateBookListSchema()

  return (
    <>
      <JsonLd data={[breadcrumbSchema, bookListSchema]} />
      <div className="min-h-screen bg-black text-white">
        {/* Hero */}
      <section className="pt-32 pb-20 container-wide relative overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] opacity-[0.06] blur-[120px] pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse, rgba(201, 160, 80, 0.4) 0%, transparent 70%)',
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-3 px-6 py-3 border border-accent-gold/20 bg-accent-gold/5 rounded-full">
            <Library className="text-accent-gold" size={20} />
            <span className="text-sm tracking-[0.2em] uppercase text-accent-gold font-light">
              Published Works
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-light font-serif leading-tight">
            Books
          </h1>

          <div className="w-24 h-px bg-gradient-to-r from-transparent via-accent-gold to-transparent mx-auto my-8" />

          <p className="text-xl text-white/70 font-light max-w-2xl mx-auto leading-relaxed">
            Full-length explorations of consciousness, transformation, and the art of living deliberately.
            Each book is a laboratory for self-actualization.
          </p>
        </div>
      </section>

      {/* Random Acts Trilogy */}
      <section className="pb-20 container-wide">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-light font-serif text-white mb-4">
              Random Acts of Self-Actualization
            </h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              A three-part journey through consciousness, transformation, and integration.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {books.map((book, index) => (
              <div
                key={book.id}
                className="group border border-white/10 hover:border-accent-gold/50 transition-all p-8 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl"
              >
                <div className="space-y-6">
                  {/* Book Number */}
                  <div className="flex items-center justify-between">
                    <span className="text-accent-gold font-light tracking-wider text-sm">
                      BLOCK {String.fromCharCode(65 + index)}
                    </span>
                    {book.status === 'available' ? (
                      <Unlock size={20} className="text-accent-gold" />
                    ) : (
                      <Lock size={20} className="text-white/40" />
                    )}
                  </div>

                  {/* Title */}
                  <div>
                    <h3 className="text-2xl font-light font-serif text-white mb-2 leading-tight">
                      {book.subtitle}
                    </h3>
                    <p className="text-white/50 text-sm mb-4">{book.pages} pages</p>
                  </div>

                  {/* Description */}
                  <p className="text-white/60 leading-relaxed text-sm">{book.description}</p>

                  {/* Price & CTA */}
                  <div className="pt-4 space-y-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-light text-accent-gold">${book.price}</span>
                      <span className="text-white/40 text-sm">one-time</span>
                    </div>

                    {book.status === 'available' ? (
                      <Link href={`/writing/books/${book.id}`} className="block">
                        <RippleButton className="w-full px-8 py-3 bg-accent-gold text-black font-medium tracking-[0.2em] uppercase text-sm rounded-full hover:bg-accent-hover transition-all">
                          Read Now
                        </RippleButton>
                      </Link>
                    ) : (
                      <button
                        disabled
                        className="w-full px-8 py-3 bg-white/10 text-white/40 font-medium tracking-[0.2em] uppercase text-sm rounded-full cursor-not-allowed"
                      >
                        Coming Soon
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bundle Offer */}
      <section className="pb-32 container-wide">
        <div className="max-w-4xl mx-auto">
          <div className="border border-accent-gold/30 bg-gradient-to-br from-accent-gold/10 to-transparent p-12 text-center space-y-8 rounded-3xl">
            <Library size={48} className="text-accent-gold mx-auto" />

            <div>
              <h3 className="text-3xl md:text-4xl font-light font-serif text-white mb-4">
                The Complete Trilogy
              </h3>
              <p className="text-white/70 leading-relaxed max-w-xl mx-auto">
                Get all three books together and save. Experience the complete journey from
                foundation to transformation to integration.
              </p>
            </div>

            <div className="flex items-baseline justify-center gap-4">
              <span className="text-white/40 line-through text-xl">$15</span>
              <span className="text-5xl font-light text-accent-gold">$12</span>
              <span className="text-white/60">for all 3 books</span>
            </div>

            <RippleButton className="px-12 py-4 bg-accent-gold text-black font-medium tracking-[0.2em] uppercase rounded-full hover:bg-accent-hover transition-all">
              Get Complete Trilogy
            </RippleButton>

            <p className="text-white/40 text-sm">
              One-time payment • Instant access • Read anytime
            </p>
          </div>
        </div>
      </section>
      </div>
    </>
  )
}
