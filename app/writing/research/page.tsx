import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Research Papers | Brandon Mills',
  description: 'Academic and scientific writing on consciousness, quantum physics, and the bridge between ancient wisdom and modern science.',
}

const papers = [
  {
    id: 'quantum-coherence',
    title: 'Enlightenment Through Science',
    subtitle: 'Bridging Classical and Quantum Models of Consciousness',
    authors: ['Brandon Mills'],
    year: '2024',
    status: 'Published',
    field: 'Consciousness Studies',
    abstract: 'This paper explores the intersection of classical physics, quantum mechanics, psychology, and Buddhist philosophy to propose a scientific framework for understanding enlightenment. By examining consciousness through both classical and quantum lenses, we reveal how the transition from deterministic mental states to quantum coherence may represent the path to liberation from suffering.',
    link: '/writing/research/quantum-coherence',
  },
]

export default function ResearchPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="pt-32 pb-20 container-wide">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/writing"
            className="text-accent-gold hover:underline text-sm tracking-wider uppercase mb-8 inline-block"
          >
            ← Back to Writing
          </Link>

          <p className="text-accent-gold text-xs tracking-[0.3em] uppercase mb-6">
            Academic & Scientific Work
          </p>

          <h1 className="text-4xl md:text-6xl font-light font-serif leading-tight mb-6">
            Research Papers
          </h1>

          <p className="text-xl text-white/70 font-light leading-relaxed">
            Exploring consciousness, quantum physics, and the intersection of ancient wisdom with cutting-edge science.
          </p>
        </div>
      </section>

      {/* Papers */}
      <section className="pb-32 container-wide">
        <div className="max-w-5xl mx-auto space-y-12">
          {papers.map((paper) => (
            <article key={paper.id} className="border border-white/10 hover:border-accent-gold/50 transition-all">
              <div className="p-8 md:p-12 space-y-8">
                {/* Header */}
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <span className="px-3 py-1 bg-accent-gold/10 border border-accent-gold/30 text-accent-gold tracking-wider uppercase">
                      {paper.status}
                    </span>
                    <span className="text-white/60">{paper.field}</span>
                    <span className="text-white/40">·</span>
                    <span className="text-white/60">{paper.year}</span>
                  </div>

                  <h2 className="text-3xl md:text-4xl font-light font-serif text-white">
                    {paper.title}
                  </h2>

                  {paper.subtitle && (
                    <p className="text-xl text-white/70 font-light">
                      {paper.subtitle}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-2 text-white/60">
                    <span>by</span>
                    {paper.authors.map((author, i) => (
                      <span key={i} className="text-white">
                        {author}
                        {i < paper.authors.length - 1 && <span className="text-white/60"> & </span>}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="w-full h-px bg-white/10" />

                {/* Abstract */}
                <div>
                  <h3 className="text-accent-gold text-sm tracking-wider uppercase mb-3">
                    Abstract
                  </h3>
                  <p className="text-white/70 leading-relaxed">
                    {paper.abstract}
                  </p>
                </div>

                {/* CTA */}
                <div className="flex flex-wrap items-center gap-4 pt-4">
                  {paper.link && (
                    <Link
                      href={paper.link}
                      className="px-8 py-3 bg-accent-gold text-black font-medium tracking-wider hover:bg-accent-hover transition-colors"
                    >
                      READ FULL PAPER
                    </Link>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Coming Soon */}
        <div className="max-w-3xl mx-auto mt-20">
          <div className="border border-white/10 p-12 text-center space-y-6">
            <h3 className="text-2xl md:text-3xl font-light font-serif text-white">
              More Research Coming
            </h3>
            <p className="text-white/60">
              Additional papers on quantum consciousness, neuroscience, and the science of enlightenment
              currently in development. Follow @mrbrandonmills for updates.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
