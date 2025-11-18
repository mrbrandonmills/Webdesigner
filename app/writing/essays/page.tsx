import { Metadata } from 'next'
import Link from 'next/link'
import { mediumEssays, getAllCategories } from '@/data/medium-essays'

export const metadata: Metadata = {
  title: 'Essays | Brandon Mills',
  description: 'Philosophical essays on identity, embodiment, consciousness, and the human condition. From social theory to self-actualization.',
  openGraph: {
    title: 'Essays | Brandon Mills',
    description: 'Exploring philosophy, consciousness, and what it means to be human',
  },
}

// Convert Medium essays to display format
const essays = mediumEssays.map((essay) => ({
  slug: `/writing/essays/${essay.slug}`,
  title: essay.title,
  excerpt: essay.excerpt,
  date: new Date(essay.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
  category: essay.category,
  readTime: essay.readTime,
}))

export default function EssaysPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="pt-32 pb-20 container-wide relative overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] opacity-[0.06] blur-[120px] pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse, rgba(201, 160, 80, 0.4) 0%, transparent 70%)',
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
          <p className="text-sm tracking-[0.3em] uppercase text-accent-gold">
            Philosophical Writings
          </p>
          <h1 className="text-5xl md:text-7xl font-light font-serif leading-tight">
            Essays
          </h1>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-accent-gold to-transparent mx-auto my-8" />
          <p className="text-xl text-white/70 font-light max-w-2xl mx-auto leading-relaxed">
            Exploring identity, embodiment, consciousness, and what it means to navigate the human condition
            with intention and awareness.
          </p>
        </div>
      </section>

      {/* Essays Grid */}
      <section className="pb-32 container-wide">
        <div className="max-w-5xl mx-auto space-y-16">
          {essays.map((essay, index) => (
            <article key={index} className="group">
              <Link href={essay.slug}>
                <div className="border border-white/10 hover:border-accent-gold/50 transition-all duration-500 p-8 md:p-12">
                  <div className="space-y-6">
                    {/* Meta */}
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <span className="text-accent-gold tracking-[0.2em] uppercase">
                        {essay.category}
                      </span>
                      <span className="text-white/40">·</span>
                      <span className="text-white/60">{essay.date}</span>
                      <span className="text-white/40">·</span>
                      <span className="text-white/60">{essay.readTime}</span>
                    </div>

                    {/* Title */}
                    <h2 className="text-3xl md:text-4xl font-light font-serif text-white group-hover:text-accent-gold transition-colors">
                      {essay.title}
                    </h2>

                    {/* Excerpt */}
                    <p className="text-white/70 text-lg leading-relaxed">
                      {essay.excerpt}
                    </p>

                    {/* Read More */}
                    <div className="pt-4">
                      <span className="inline-flex items-center gap-2 text-accent-gold text-sm tracking-wider group-hover:gap-4 transition-all">
                        READ ESSAY
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          className="group-hover:translate-x-1 transition-transform"
                        >
                          <path
                            d="M1 8H15M15 8L8 1M15 8L8 15"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* Featured Quote */}
      <section className="pb-32 container-wide">
        <div className="max-w-4xl mx-auto border-t border-white/10 pt-20">
          <blockquote className="text-center space-y-8">
            <p className="text-2xl md:text-3xl font-light font-serif text-white/90 leading-relaxed italic">
              "Philosophy begins in wonder. And wonder begins in the willingness to question
              what we take for granted about ourselves and the world."
            </p>
            <cite className="text-accent-gold text-sm tracking-wider uppercase not-italic">
              — Brandon Mills
            </cite>
          </blockquote>
        </div>
      </section>
    </div>
  )
}
