import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Star, ExternalLink } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Books by Brandon Mills | Store',
  description: 'Published works on personal transformation, self-actualization, and conscious living. Co-authored with Jesse Doherty.',
}

const books = [
  {
    id: 'random-acts-building-block-a',
    asin: 'B0DRDXCJZQ',
    title: 'Random Acts of Self-Actualization',
    subtitle: 'Building Block A: Breaking Free From Addictive Patterns',
    authors: ['Brandon Mills', 'Jesse Doherty'],
    authorHandles: ['@mrbrandonmills', '@jesseadoherty'],
    coverImage: 'https://m.media-amazon.com/images/I/71vK8QZXHJL._SY522_.jpg',
    amazonUrl: 'https://www.amazon.com/Random-Acts-Self-Actualization-Building-Addictive-ebook/dp/B0DRDXCJZQ',
    price: 9.99,
    rating: 5.0,
    reviewCount: 2,
    format: 'Kindle Edition',
    series: 'Random Acts of Self-Actualization',
    volume: 1,
    totalVolumes: 3,
    description: `In this groundbreaking first volume, discover how unconscious patterns and societal programming shape your daily choices, relationships, and personal growth. Through practical insights and actionable guidance, learn to identify and transform the subtle addictions that keep you from authentic self-expression and genuine connection.`,
    highlights: [
      'How societal conditioning creates unconscious behavioral patterns',
      'Why traditional approaches to personal growth often reinforce addictive cycles',
      'The connection between communication breakdowns and deeper psychological patterns',
      'Practical tools for recognizing and transforming unconscious behaviors',
      'Methods for developing authentic relationships free from codependent patterns',
      'Strategies for integrating technology mindfully without feeding addictive tendencies',
    ],
  },
  {
    id: 'random-acts-block-b',
    asin: 'B0DSY6Z4YP',
    title: 'Random Acts of Self-Actualization',
    subtitle: 'Block B: Pattern Recognition & Emotional Intelligence',
    authors: ['Brandon Mills', 'Jesse Doherty'],
    authorHandles: ['@mrbrandonmills', '@jesseadoherty'],
    coverImage: 'https://m.media-amazon.com/images/I/71vK8QZXHJL._SY522_.jpg', // Placeholder - will be replaced
    amazonUrl: 'https://www.amazon.com/Random-Acts-Self-Actualization-Block-B-ebook/dp/B0DSY6Z4YP',
    price: 9.99,
    rating: 5.0,
    reviewCount: 0,
    format: 'Kindle Edition',
    series: 'Random Acts of Self-Actualization',
    volume: 2,
    totalVolumes: 3,
    description: `Building on the foundational insights of Block A, this book reveals how pattern recognition and emotional intelligence combine to create lasting transformation. Through intimate conversations and real-world examples, the authors illuminate the deeper patterns that shape our lives.`,
    highlights: [
      'How life\'s disruptions serve as gateways to higher consciousness',
      'Why authentic passion reveals the difference between programming and true self',
      'How technology can either enhance or hinder our evolution',
      'What quantum physics teaches us about human potential',
      'Bridges ancient wisdom with cutting-edge science',
      'Practical insights for moving beyond societal programming into authentic being',
    ],
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
          <p className="text-sm tracking-[0.3em] uppercase text-accent-gold">
            Published Works
          </p>
          <h1 className="text-5xl md:text-7xl font-light font-serif leading-tight">
            Books
          </h1>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-accent-gold to-transparent mx-auto my-8" />
          <p className="text-xl text-white/70 font-light max-w-2xl mx-auto">
            Co-authored with Jesse Doherty. Available on Amazon Kindle.
          </p>
        </div>
      </section>

      {/* Books */}
      <section className="pb-32 container-wide">
        <div className="max-w-6xl mx-auto space-y-20">
          {books.map((book) => (
            <article key={book.id} className="border border-white/10 overflow-hidden hover:border-accent-gold/50 transition-all">
              <div className="grid md:grid-cols-5 gap-8 md:gap-12 p-8 md:p-12">
                {/* Book Cover */}
                <div className="md:col-span-2">
                  <div className="relative aspect-[3/4] overflow-hidden bg-white/5 border border-white/10">
                    <img
                      src={book.coverImage}
                      alt={`${book.title}: ${book.subtitle}`}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Series Badge */}
                  {book.series && (
                    <div className="mt-4 text-center">
                      <p className="text-accent-gold text-xs tracking-wider uppercase">
                        Part {book.volume} of {book.totalVolumes}
                      </p>
                      <p className="text-white/60 text-sm mt-1">{book.series}</p>
                    </div>
                  )}
                </div>

                {/* Book Details */}
                <div className="md:col-span-3 space-y-6">
                  {/* Title & Authors */}
                  <div>
                    <p className="text-accent-gold text-xs tracking-[0.3em] uppercase mb-2">
                      {book.format}
                    </p>
                    <h2 className="text-3xl md:text-4xl font-light font-serif mb-2">
                      {book.title}
                    </h2>
                    <h3 className="text-xl md:text-2xl text-white/70 font-light mb-4">
                      {book.subtitle}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 text-white/60">
                      <span>by</span>
                      {book.authors.map((author, i) => (
                        <span key={i} className="text-white">
                          {author}
                          {book.authorHandles[i] && (
                            <span className="text-accent-gold ml-1">{book.authorHandles[i]}</span>
                          )}
                          {i < book.authors.length - 1 && <span className="text-white/60"> & </span>}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={i < Math.floor(book.rating) ? 'fill-accent-gold text-accent-gold' : 'text-white/20'}
                        />
                      ))}
                    </div>
                    <span className="text-white/60 text-sm">
                      {book.rating} ({book.reviewCount} {book.reviewCount === 1 ? 'review' : 'reviews'})
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-white/70 leading-relaxed">
                    {book.description}
                  </p>

                  {/* Highlights */}
                  <div>
                    <p className="text-accent-gold text-sm tracking-wider uppercase mb-3">
                      What You'll Learn
                    </p>
                    <ul className="space-y-2">
                      {book.highlights.map((highlight, i) => (
                        <li key={i} className="flex items-start gap-3 text-white/70 text-sm">
                          <span className="text-accent-gold mt-1">•</span>
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Price & CTA */}
                  <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <p className="text-3xl font-light text-white">${book.price}</p>
                      <p className="text-white/60 text-sm">Kindle Edition</p>
                    </div>

                    <a
                      href={book.amazonUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-8 py-4 bg-accent-gold text-black font-medium tracking-wider hover:bg-accent-hover transition-colors"
                    >
                      BUY ON AMAZON
                      <ExternalLink size={18} />
                    </a>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Block C Coming Soon */}
        <div className="max-w-3xl mx-auto mt-20">
          <div className="border border-accent-gold/30 bg-accent-gold/5 p-12 text-center space-y-6">
            <p className="text-accent-gold text-xs tracking-[0.3em] uppercase">
              Coming Soon
            </p>
            <h3 className="text-2xl md:text-3xl font-light font-serif text-white">
              Block C: In Production
            </h3>
            <p className="text-white/60">
              The final volume in the Random Acts of Self-Actualization trilogy is currently being formatted
              and will be available soon. Follow @mrbrandonmills on Medium and Instagram for updates.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
