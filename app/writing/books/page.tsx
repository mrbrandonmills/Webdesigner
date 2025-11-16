import { Metadata } from 'next'
import Link from 'next/link'
import { Library, Lock, Unlock } from 'lucide-react'
import { RippleButton } from '@/components/ripple-button'

export const metadata: Metadata = {
  title: 'Books | Brandon Mills',
  description: 'Full-length works exploring consciousness, self-actualization, and transformation. Random Acts of Self-Actualization trilogy available for purchase.',
}

const books = [
  {
    id: 'block-a',
    title: 'Random Acts of Self-Actualization: Block A',
    subtitle: 'The Foundation of Conscious Living',
    description: 'The journey begins. An exploration of the foundations of consciousness, identity, and the first steps toward self-awareness.',
    pages: 'TBD',
    price: 5,
    status: 'coming-soon' as const,
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

export default function BooksPage() {
  return (
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
  )
}
