import { Metadata } from 'next'
import Link from 'next/link'
import { FileText, BookOpen, Feather } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Writing | Brandon Mills',
  description: 'Research papers, philosophical essays, and poetry exploring consciousness, self-actualization, and the human condition.',
}

export default function WritingPage() {
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
            Intellectual Work
          </p>
          <h1 className="text-5xl md:text-7xl font-light font-serif leading-tight">
            Writing
          </h1>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-accent-gold to-transparent mx-auto my-8" />
          <p className="text-xl text-white/70 font-light max-w-2xl mx-auto leading-relaxed">
            Research papers, philosophical essays, and poetry exploring consciousness,
            quantum physics, self-actualization, and what it means to be human.
          </p>
        </div>
      </section>

      {/* Three Categories */}
      <section className="pb-32 container-wide">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
          {/* Research Papers */}
          <Link
            href="/writing/research"
            className="group border border-white/10 hover:border-accent-gold/50 transition-all p-8 md:p-12"
          >
            <div className="space-y-6">
              <div className="w-16 h-16 rounded-full bg-accent-gold/10 border border-accent-gold/30 flex items-center justify-center group-hover:bg-accent-gold/20 transition-colors">
                <FileText size={32} className="text-accent-gold" />
              </div>

              <div>
                <h2 className="text-2xl md:text-3xl font-light font-serif text-white mb-3 group-hover:text-accent-gold transition-colors">
                  Research Papers
                </h2>
                <p className="text-white/60 leading-relaxed">
                  Academic and scientific writing on consciousness, quantum physics, and the intersection
                  of ancient wisdom with modern science.
                </p>
              </div>

              <div className="text-accent-gold text-sm tracking-wider flex items-center gap-2 group-hover:gap-4 transition-all">
                VIEW RESEARCH
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M1 8H15M15 8L8 1M15 8L8 15"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </Link>

          {/* Essays */}
          <Link
            href="/writing/essays"
            className="group border border-white/10 hover:border-accent-gold/50 transition-all p-8 md:p-12"
          >
            <div className="space-y-6">
              <div className="w-16 h-16 rounded-full bg-accent-gold/10 border border-accent-gold/30 flex items-center justify-center group-hover:bg-accent-gold/20 transition-colors">
                <BookOpen size={32} className="text-accent-gold" />
              </div>

              <div>
                <h2 className="text-2xl md:text-3xl font-light font-serif text-white mb-3 group-hover:text-accent-gold transition-colors">
                  Essays
                </h2>
                <p className="text-white/60 leading-relaxed">
                  Philosophical explorations on identity, self-actualization, mental health, and social theory.
                  Published on Medium.
                </p>
              </div>

              <div className="text-accent-gold text-sm tracking-wider flex items-center gap-2 group-hover:gap-4 transition-all">
                READ ESSAYS
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M1 8H15M15 8L8 1M15 8L8 15"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </Link>

          {/* Poetry */}
          <Link
            href="/writing/poetry"
            className="group border border-white/10 hover:border-accent-gold/50 transition-all p-8 md:p-12"
          >
            <div className="space-y-6">
              <div className="w-16 h-16 rounded-full bg-accent-gold/10 border border-accent-gold/30 flex items-center justify-center group-hover:bg-accent-gold/20 transition-colors">
                <Feather size={32} className="text-accent-gold" />
              </div>

              <div>
                <h2 className="text-2xl md:text-3xl font-light font-serif text-white mb-3 group-hover:text-accent-gold transition-colors">
                  Poetry
                </h2>
                <p className="text-white/60 leading-relaxed">
                  Verse exploring embodiment, performance, vulnerability, and the ineffable moments
                  between thought and feeling.
                </p>
              </div>

              <div className="text-accent-gold text-sm tracking-wider flex items-center gap-2 group-hover:gap-4 transition-all">
                EXPLORE POETRY
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M1 8H15M15 8L8 1M15 8L8 15"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Quote */}
      <section className="pb-32 container-wide">
        <div className="max-w-4xl mx-auto border-t border-white/10 pt-20">
          <blockquote className="text-center space-y-8">
            <p className="text-2xl md:text-3xl font-light font-serif text-white/90 leading-relaxed italic">
              "Writing is thinking made visible. Through research, reflection, and verse,
              we map the territory between what we know and what we're learning to see."
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
